from flask import Flask, request, jsonify
from flask_cors import CORS
import os, requests, xml.etree.ElementTree as ET

app = Flask(__name__)
CORS(app)

API_KEY = 'pc4aEEx+Da+dk2odUnz+EoetScF/K0bRC1YiJi5F6Mdza9DS7EoVXbP5vX4sCKPQHtsYgly4e6L4M7iISLXPdw=='

@app.route('/api/search', methods=['GET'])
def search_drug():
    name = request.args.get('name')
    url = 'https://apis.data.go.kr/1471000/DrugPrdtPrmsnInfoService06/getDrugPrdtPrmsnInq06'
    params = {'serviceKey': API_KEY, 'item_name': name}
    resp = requests.get(url, params=params)
    root = ET.fromstring(resp.content)
    items = []
    for it in root.findall('.//item'):
        item = {
            'itemSeq': it.findtext('ITEM_SEQ'),
            'name': it.findtext('ITEM_NAME'),
            'ingr': it.findtext('ITEM_INGR_NAME'),
            'img': it.findtext('BIG_PRDT_IMG_URL')
        }
        items.append(item)
    return jsonify(items)

if __name__=='__main__':
    app.run(debug=True)