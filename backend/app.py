from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from db import get_drug_info
from model_mock import mock_predict

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

@app.route('/api/recognize', methods=['POST'])
def recognize_drug():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image = request.files['image']
    filename = secure_filename(image.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    try:
        image.save(filepath)
    except Exception as e:
        return jsonify({'error': f'File save failed: {str(e)}'}), 500

    predicted_name = mock_predict(filename)
    drug_info = get_drug_info(predicted_name)

    if not drug_info:
        return jsonify({'error': 'Drug not found'}), 404

    return jsonify(drug_info)

if __name__ == '__main__':
    app.run(debug=True)
