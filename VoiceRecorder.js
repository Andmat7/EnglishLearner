import { HtmlElementsFactory } from './HtmlElementsFactory.js';


export class VoiceRecorder {
    constructor() {
      this.createButtons();
      this.initializeRecorder();
    }
  
    createButtons() {
      // Crea los botones
      const recordBtn = { tag: 'button', label: 'Record', onClick: this.startRecording.bind(this) };
      const stopBtn = { tag: 'button', label: 'Stop', onClick: this.stopRecording.bind(this) };
      const playBtn = { tag: 'button', label: 'Play', onClick: this.playRecording.bind(this) };
      const audio = { tag: 'audio', attributes: { controls: true } };
    
      // Agrega los botones a la página web   
      const voiceRecorder = document.querySelector('voice-recorder');
      HtmlElementsFactory.appendTo(voiceRecorder, [recordBtn, stopBtn, playBtn, audio]);
    }
  
    initializeRecorder() {
      // Inicializa el módulo VoiceRecorder
      this.chunks = [];
      this.recorder = null;
      this.audioCtx = new AudioContext();
      this.source = null;
  
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
          this.source = this.audioCtx.createMediaStreamSource(stream);
          this.recorder = new MediaRecorder(stream);
    
          this.recorder.addEventListener('dataavailable', event => {
            this.chunks.push(event.data);
          });
    
          this.recorder.addEventListener('stop', () => {
            this.handleRecordingStop();
          });
    
        }).catch(error => {
          console.error('No se pudo acceder al micrófono.', error);
        });
      } else {
        console.error('La API de getUserMedia no está disponible en este navegador.');
      }
    }
  
    handleRecordingStop() {
      const audioData = new Blob(this.chunks, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioData);
      const audioElement = document.querySelector('audio');
      audioElement.src = audioUrl;
    }
  
    startRecording() {
      if (this.recorder) {
        this.recorder.start();
        document.querySelector('.record-button').classList.add('hidden');
        document.querySelector('.stop-button').classList.remove('hidden');
      }
    }
    
  
    stopRecording() {
      if (this.recorder) {
        this.recorder.stop();
        this.chunks = [];
        document.querySelector('.record-button').classList.remove('hidden');
        document.querySelector('.stop-button').classList.add('hidden');
      }
    }
  
    playRecording() {
      const audioElement = document.querySelector('audio');
      audioElement.play();
    }
  }
  