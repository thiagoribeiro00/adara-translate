## Introduction

This project is a web application that uses a speech-to-text LLM model to transcribe audio files and generated audio in real-time. The application is built using the Flask framework for Python on the backend and React.js on the frontend, and is designed to be scalable, easy to use, and robust.

The application allows users to upload audio files or record audio in real-time, and then get the audio transcript back to text. This is particularly useful for transcribing meetings, lectures, podcasts, and other types of audio content.

## Technologies and Tools Used

- **Flask**: Python web framework used to build the API.
- **Whisper**: OpenAI's audio transcription model.
- **PyTorch**: Machine learning library used to load and run the Whisper model.
- **React.js**: JavaScript library for building the user interface.
- **Render**: Hosting platform used to deploy the application.
-
## Whisper Model:

OpenAI's audio transcription model that is used to convert audio to text.

### Model Capabilities
- **Audio Transcription**: Converts audio to text in the same language as the audio.
- **Audio Translation**: Converts audio to text in a language different from the audio.
- **Language Identification**: Identifies the language spoken in the audio.
- **Voice Activity Detection**: Detects the presence of voice in the audio.

## Installation and Configuration

### Clone the Repository

```bash
git clone https://github.com/your-username/adara-translate.git
cd adara-translate
```
### Install Backend Dependencies
```bash
pip install -r api/requirements.txt
```

### Install Frontend Dependencies
```bash
cd Interface
npm install
```

## Audio Transcription API
### API Endpoints

**POST /transcribe**
**Description**: This endpoint receives an audio file and returns the transcription of the audio into text.

**Parameters:** audio: Audio file (supported formats: WAV, MP3, etc.).

**Response:** transcription: The transcription of the audio into text.

### Contact

Email: thiago2002sr@gmail.com
