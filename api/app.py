# api/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

os.makedirs('recorded_audio', exist_ok=True)

@app.route('/record', methods=['POST'])
def record_audio():
    if 'audio' not in request.files:
        return jsonify({"message": "Arquivo de áudio não encontrado"}), 400
    
    file = request.files['audio']
    if file.filename == '':
        return jsonify({"message": "Nenhum arquivo selecionado"}), 400
    
    audio_path = f"./recorded_audio/{file.filename}"
    file.save(audio_path)
    return jsonify({"message": "Áudio gravado com sucesso!"}), 201

if __name__ == '__main__':
    app.run(port=5001, debug=True)