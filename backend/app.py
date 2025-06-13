# app.py

import ssl
import requests
import xml.etree.ElementTree as ET
from flask import Flask, request, jsonify
from flask_cors import CORS
from requests.adapters import HTTPAdapter
from urllib3.poolmanager import PoolManager

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

API_KEY  = 'pc4aEEx+Da+dk2odUnz+EoetScF/K0bRC1YiJi5F6Mdza9DS7EoVXbP5vX4sCKPQHtsYgly4e6L4M7iISLXPdw=='
PERM_URL = 'https://apis.data.go.kr/1471000/DrugPrdtPrmsnInfoService06/getDrugPrdtPrmsnInq06'
DUR_URL  = 'https://apis.data.go.kr/1471000/DURPrdlstInfoService03/getDurPrdlstInfoList03'

class CustomSSLAdapter(HTTPAdapter):
    """TLS 핸드쉐이크 이슈 해결용 커스텀 어댑터"""
    def init_poolmanager(self, connections, maxsize, block=False, **kwargs):
        ssl_context = ssl.create_default_context()
        # 예: 약한 cipher 허용 및 호스트명 체크 비활성
        ssl_context.set_ciphers('DEFAULT@SECLEVEL=1')
        ssl_context.check_hostname = False
        self.poolmanager = PoolManager(
            num_pools=connections,
            maxsize=maxsize,
            block=block,
            ssl_context=ssl_context,
        )

def safe_get_xml(url, params):
    sess = requests.Session()
    sess.mount('https://', CustomSSLAdapter())
    try:
        resp = sess.get(url, params=params, timeout=10, verify=False)
        resp.raise_for_status()
    except Exception as e:
        raise RuntimeError(f'업스트림 요청 실패: {e}\n{getattr(e, "response", None)}')
    try:
        return ET.fromstring(resp.content)
    except ET.ParseError as e:
        raise RuntimeError(f'XML 파싱 실패: {e}')

@app.route('/api/search')
def search_drug():
    name = request.args.get('name', '').strip()
    if not name:
        return jsonify({'error': 'name 파라미터 필수'}), 400

    try:
        perm_p = {'serviceKey': API_KEY, 'type':'xml', 'item_name':name, 'pageNo':1,'numOfRows':100}
        perm_root = safe_get_xml(PERM_URL, perm_p)
        results = []

        for itm in perm_root.findall('.//item'):
            seq = itm.findtext('ITEM_SEQ')
            code = itm.findtext('ITEM_INGR_CODE') or ''
            base = {
                'itemSeq': seq,
                'name': itm.findtext('ITEM_NAME'),
                'ingrName': itm.findtext('ITEM_INGR_NAME'),
                'imgUrl': itm.findtext('BIG_PRDT_IMG_URL'),
            }

            dur_p = {'serviceKey':API_KEY,'type':'xml','itemSeq':seq,'pageNo':1,'numOfRows':100}
            dur_root = safe_get_xml(DUR_URL, dur_p)
            dur_list=[]
            contra=False
            for d in dur_root.findall('.//item'):
                t = d.findtext('TYPE_NAME')
                mix = d.findtext('MIXTURE_INGR_CODE') or ''
                if t:
                    dur_list.append(t)
                    if t=='병용금기' and mix==code:
                        contra=True

            base['durTypes'] = dur_list
            base['isContraindicated'] = contra
            results.append(base)

        return jsonify(results)

    except RuntimeError as e:
        return jsonify({'error':str(e)}), 502
    except Exception as e:
        return jsonify({'error':f'Internal Error: {e}'}), 500

    @app.route('/api/dur', methods=['GET'])
    def get_dur():
        item_seq = request.args.get('itemSeq')
        if not item_seq:
            return jsonify({'error': 'Missing itemSeq parameter'}), 400

        # 예시: db.py에 dur 조회 함수 추가
        from db import get_dur_info
        dur_info = get_dur_info(item_seq)
        if not dur_info:
            return jsonify({'error': 'DUR 정보가 없습니다'}), 404

        return jsonify(dur_info)



if __name__ == '__main__':
    app.run(debug=True)
