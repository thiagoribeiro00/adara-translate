import whisper
from flask import Flask, request, jsonify
import os
import torch
import warnings
from flask_cors import CORS

warnings.filterwarnings("ignore", "You are using `torch.load` with `weights_only=False`*.")
warnings.filterwarnings("ignore", "FP16 is not supported on CPU; using FP32 instead")

app = Flask(__name__)
CORS(app)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = whisper.load_model("tiny", device=device, download_root="./models")

os.makedirs('transcribed_audio', exist_ok=True)

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    try:
        if 'audio' not in request.files:
            return jsonify({"message": "Audio file not found"}), 400
        
        file = request.files['audio']
        if file.filename == '':
            return jsonify({"message": "No files selected"}), 400
        
        audio_path = f"./transcribed_audio/{file.filename}"
        file.save(audio_path)
        
        result = model.transcribe(audio_path)
        return jsonify({"transcription": result["text"]})
    
    except Exception as e:
        print(f"Error transcribing audio: {str(e)}")
        return jsonify({"message": f"Error transcribing audio: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(port=5002, debug=True)
