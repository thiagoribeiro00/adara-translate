import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const Home = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [transcription, setTranscription] = useState(''); 
  const [audioFile, setAudioFile] = useState(null);  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const testMicrophone = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = devices.filter(device => device.kind === 'audioinput');

      if (audioDevices.length > 0) {
        console.log('Available microphones:', audioDevices);
        alert(`Microphone detected: ${audioDevices[0].label || 'Standard microphone'}`);
      } else {
        alert('No microphone detected. Check if it is connected or activated.');
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Error accessing media devices.');
    }
  };

  useEffect(() => {
    testMicrophone();
  }, []);

 // Function to record audio
  const handleRecordStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!stream) {
        alert('no audio stream found. Check your microphone.');
        return;
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);

        if (audioBlob.size === 0) {
          alert('No sound was captured. Check your microphone.');
          return;
        }

        const audioURL = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioURL);
        audio.onloadedmetadata = () => {
          setAudioDuration(audio.duration.toFixed(2));
        };

        setTranscription('Transcription simulation...');
        uploadAudioForTranscription(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      console.log('Recording started.');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Error accessing the microphone. Check browser permissions.');
    }
  };

  const handleRecordStop = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log('Recording finished.');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
      const fileURL = URL.createObjectURL(file);
      setTranscription('Loading File ...');
      uploadAudioForTranscription(file);
    }
  };

  const uploadAudioForTranscription = async (file) => {
    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await axios.post('http://localhost:5002/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTranscription(response.data.transcription); 
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setTranscription('Error transcribing audio.');
    }
  };

  return (
    <div className="container">
      <h1></h1>

      <div className="transcription">
        <label>{transcription || 'Waiting for Transcription ...'}</label>
      </div>

      <div className="buttons">
        <button onClick={handleRecordStart} disabled={isRecording}>
          {isRecording ? 'Recording...' : 'Start Recording'}
        </button>
        <button onClick={handleRecordStop} disabled={!isRecording}>
          Stop Recording
        </button>
      </div>

      {audioBlob && (
        <div className="audio-container">
          <h2>Recorded Audio:</h2>
          <audio controls src={URL.createObjectURL(audioBlob)} />
          <p>Duration: {audioDuration} segundos</p>
        </div>
      )}

      <div className="file-upload">
        <h2>Or upload an audio file:</h2>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
        />
      </div>

      {audioFile && (
        <div className="file-info">
          <h3>File uploaded:</h3>
          <p>{audioFile.name}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
