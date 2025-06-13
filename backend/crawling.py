# -*- coding: utf-8 -*-
import requests
from requests.adapters import HTTPAdapter
from urllib3.poolmanager import PoolManager
import ssl
import xml.etree.ElementTree as ET
import psycopg2
from psycopg2.extras import execute_values
import urllib3
import os

# ─── Custom SSL Adapter ──────────────────────────────────────────────────
class CustomSSLAdapter(HTTPAdapter):
    """TLS 핸드쉐이크 이슈 해결용 커스텀 어댑터"""
    def init_poolmanager(self, connections, maxsize, block=False, **kwargs):
        ctx = ssl.create_default_context()
        ctx.set_ciphers('DEFAULT@SECLEVEL=1')
        ctx.check_hostname = False
        self.poolmanager = PoolManager(
            num_pools=connections, maxsize=maxsize, block=block,
            ssl_context=ctx
        )
# ──────────────────────────────────────────────────────────────────────────

# SSL 경고 비활성화
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# 전역 세션 생성 & 어댑터 장착
session = requests.Session()
session.mount("https://", CustomSSLAdapter())

# 설정
SERVICE_KEY     = "pc4aEEx+Da+dk2odUnz+EoetScF/K0bRC1YiJi5F6Mdza9DS7EoVXbP5vX4sCKPQHtsYgly4e6L4M7iISLXPdw=="
PRODUCT_API_URL = "https://apis.data.go.kr/1471000/DrugPrdtPrmsnInfoService06/getDrugPrdtPrmsnInq06"
DUR_API_URL     = "https://apis.data.go.kr/1471000/DURPrdlstInfoService03/getDurPrdlstInfoList03"

DB_CONFIG = {
    "host":     "localhost",
    "database": "drugdb",
    "user":     "postgres",
    "password": "1213"
}

os.environ["PGCLIENTENCODING"] = "UTF8"

def safe_get_xml(url, params):
    try:
        resp = session.get(url, params=params, timeout=10, verify=False)
        resp.raise_for_status()
    except Exception as e:
        raise RuntimeError(f"{url} 요청 실패: {e}\n{getattr(e.response, 'text', '')}")
    try:
        # 서버 응답을 UTF-8로 디코딩 시도
        content = resp.content.decode('utf-8', errors='replace')
        return ET.fromstring(content)
    except ET.ParseError as e:
        raise RuntimeError(f"XML 파싱 실패 ({url}): {e}")

def fetch_product_info(drug_name):
    params = {
        "serviceKey": SERVICE_KEY,
        "itemName":   drug_name,
        "numOfRows":  100,
        "type":      "xml",
    }
    root = safe_get_xml(PRODUCT_API_URL, params)
    out = []
    for it in root.findall(".//item"):
        out.append({
            "item_seq":         it.findtext("ITEM_SEQ"),
            "item_name":        it.findtext("ITEM_NAME"),
            "entp_name":        it.findtext("ENTP_NAME"),
            "spclty_pblc":      it.findtext("SPCLTY_PBLC"),
            "prduct_type":      it.findtext("PRDUCT_TYPE"),
            "big_prdt_img_url": it.findtext("BIG_PRDT_IMG_URL"),
        })
    return out

def fetch_dur_info(item_seq):
    params = {
        "serviceKey": SERVICE_KEY,
        "itemSeq":    item_seq,
        "pageNo":     1,
        "numOfRows":  100,
        "type":      "xml",
    }
    root = safe_get_xml(DUR_API_URL, params)
    out = []
    for it in root.findall(".//item"):
        out.append({
            "item_seq":       it.findtext("ITEM_SEQ"),
            "storage_method": it.findtext("STORAGE_METHOD"),
            "valid_term":     it.findtext("VALID_TERM"),
            "type_name":      it.findtext("TYPE_NAME"),
        })
    return out

def merge_records(products, durs):
    dur_map = {d["item_seq"]: d for d in durs}
    merged = []
    for p in products:
        seq = p["item_seq"]
        d = dur_map.get(seq, {})
        merged.append({
            **p,
            "storage_method": d.get("storage_method"),
            "valid_term":     d.get("valid_term"),
            "type_name":      d.get("type_name"),
        })
    return merged

def upsert_drug_info(records):
    for k, v in DB_CONFIG.items():
        print(k, type(v), repr(v)[:60])
    conn = psycopg2.connect(**DB_CONFIG)
    conn.set_client_encoding('UTF8')
    cur = conn.cursor()

    sql = """
    INSERT INTO drug_info (
      item_seq, item_name, entp_name, spclty_pblc,
      prduct_type, big_prdt_img_url,
      storage_method, valid_term, type_name
    ) VALUES %s
    ON CONFLICT (item_seq) DO UPDATE
      SET
        item_name        = EXCLUDED.item_name,
        entp_name        = EXCLUDED.entp_name,
        spclty_pblc      = EXCLUDED.spclty_pblc,
        prduct_type      = EXCLUDED.prduct_type,
        big_prdt_img_url = EXCLUDED.big_prdt_img_url,
        storage_method   = EXCLUDED.storage_method,
        valid_term       = EXCLUDED.valid_term,
        type_name        = EXCLUDED.type_name,
        updated_at       = NOW();
    """
    vals = [
        (
            r["item_seq"], r["item_name"], r["entp_name"], r["spclty_pblc"],
            r["prduct_type"], r["big_prdt_img_url"],
            r["storage_method"], r["valid_term"], r["type_name"]
        )
        for r in records
    ]
    execute_values(cur, sql, vals)
    conn.commit()
    cur.close()
    conn.close()

def main():
    drug = input("검색할 약품명: ")
    products = fetch_product_info(drug)
    if not products:
        print("제품 허가 정보가 없습니다.")
        return

    # 모든 ITEM_SEQ에 대해 DUR 정보 가져오기
    all_dur = []
    for p in products:
        all_dur.extend(fetch_dur_info(p["item_seq"]))

    merged = merge_records(products, all_dur)
    upsert_drug_info(merged)
    print(f"{len(merged)}건을 drug_info 테이블에 저장/갱신했습니다.")

if __name__ == "__main__":
    main()
