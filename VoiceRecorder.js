import { HtmlElementsFactory } from './HtmlElementsFactory.js';


export class VoiceRecorder {
  constructor() {
    this.createButtons();
    this.initializeRecorder();
  }
  
  createButtons() {
    // Crea los botones
    const recordBtn = { tag: 'button', label: 'Record', onClick: this.startRecording.bind(this) };
    const stopBtn = { tag: 'button', label: 'Stop', onClick: this.stopRecording.bind(this), style: 'display: none;' };
    const audio = { tag: 'audio', attributes: { controls: true } };

    // Agrega los botones a la página web   
    const voiceRecorder = document.querySelector('voice-recorder');
    const createdElements = HtmlElementsFactory.appendTo(voiceRecorder, [recordBtn, stopBtn,  audio]);

    // Asignar los elementos creados a las propiedades correspondientes
    this.recordBtn = createdElements[0];
    this.stopBtn = createdElements[1];
    this.audio = createdElements[2];
}

  // Agrega estos dos métodos
  showButton(button) {
    button.style.display = 'inline-block';
  }

  hideButton(button) {
    button.style.display = 'none';
  }

  startRecording() {
    if (this.recorder) {
      this.recorder.start();
      this.hideButton(this.recordBtn);
      this.showButton(this.stopBtn);  
    }
  }

  stopRecording() {
    if (this.recorder) {
      this.recorder.stop();
      this.chunks = [];
      this.hideButton(this.stopBtn); 
      this.showButton(this.recordBtn);
    }
  }

  initializeRecorder() {
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
    this.playRecording()
  }

  playRecording() {
    this.audio.volume = 0.5; 
    this.audio.play();
  }
}
