import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'; // Usando Axios para fazer a requisição ao servidor
import '../App.css';

const Home = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [transcription, setTranscription] = useState(''); // Estado para a transcrição
  const [audioFile, setAudioFile] = useState(null);  // Estado para o arquivo carregado
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Função para testar se o microfone está disponível
  const testMicrophone = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = devices.filter(device => device.kind === 'audioinput');

      if (audioDevices.length > 0) {
        console.log('Microfones disponíveis:', audioDevices);
        alert(`Microfone detectado: ${audioDevices[0].label || 'Microfone padrão'}`);
      } else {
        alert('Nenhum microfone detectado. Verifique se está conectado ou ativado.');
      }
    } catch (error) {
      console.error('Erro ao acessar dispositivos de mídia:', error);
      alert('Erro ao acessar dispositivos de mídia.');
    }
  };

  // Chama a função de teste do microfone ao carregar o componente
  useEffect(() => {
    testMicrophone();
  }, []);

  // Função para gravar o áudio
  const handleRecordStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!stream) {
        alert('Nenhum fluxo de áudio encontrado. Verifique seu microfone.');
        return;
      }

      // Alteração aqui para capturar em formato .webm (mais compatível)
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
          alert('Nenhum som foi capturado. Verifique seu microfone.');
          return;
        }

        const audioURL = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioURL);
        audio.onloadedmetadata = () => {
          setAudioDuration(audio.duration.toFixed(2)); // Definir a duração do áudio
        };

        setTranscription('Simulação de transcrição...');
        uploadAudioForTranscription(audioBlob); // Enviar o áudio para transcrição
      };

      mediaRecorder.start();
      setIsRecording(true);
      console.log('Gravação iniciada.');
    } catch (error) {
      console.error('Erro ao acessar o microfone:', error);
      alert('Erro ao acessar o microfone. Verifique as permissões do navegador.');
    }
  };

  // Função para parar a gravação de áudio
  const handleRecordStop = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log('Gravação finalizada.');
    }
  };

  // Função para carregar um arquivo de áudio
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
      const fileURL = URL.createObjectURL(file);
      setTranscription('Loading File ...');
      // Enviar o arquivo carregado para transcrição
      uploadAudioForTranscription(file);
    }
  };

  // Função para enviar o arquivo de áudio para transcrição
  const uploadAudioForTranscription = async (file) => {
    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await axios.post('http://localhost:5002/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTranscription(response.data.transcription); // Exibir a transcrição recebida
    } catch (error) {
      console.error('Erro ao transcrever o áudio:', error);
      setTranscription('Erro ao transcrever áudio.');
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
