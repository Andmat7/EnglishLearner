import { HtmlElementsFactory } from './HtmlElementsFactory.js';


export class VoiceRecorder {
  constructor() {
    this.createHtmlElements();
    this.chunks = [];
    this.recorder = null;
    this.initializeRecorder();
  }

  createHtmlElements() {
    // Crea los botones
    const recordBtn = { tag: 'button', label: 'Record', onClick: this.startRecording.bind(this) };
    const stopBtn = { tag: 'button', label: 'Stop', onClick: this.stopRecording.bind(this), style: 'display: none;' };
    const audio = { tag: 'audio', attributes: { controls: true } };

    // Agrega los botones a la página web   
    const voiceRecorder = document.querySelector('voice-recorder');
    const createdElements = HtmlElementsFactory.appendTo(voiceRecorder, [recordBtn, stopBtn, audio]);

    // Asignar los elementos creados a las propiedades correspondientes
    this.recordBtn = createdElements[0];
    this.stopBtn = createdElements[1];
    this.audio = createdElements[2];
  }
  initializeRecorder() {
    
    this.source = null;

    if (this.isAudioSupported()) {
      const audioStreamPromise = navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamPromise.then(stream => {
        this.audioCtx = new AudioContext();
        this.source = this.audioCtx.createMediaStreamSource(stream);
        this.enableRecorder(stream);

      }).catch(error => {
        console.error('No se pudo acceder al micrófono.', error);
      });
    }
  }

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

  isAudioSupported() {
    const isAudioSupported = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
    if (!isAudioSupported) {
      console.error('La API de getUserMedia no está disponible en este navegador.');
    }
    return isAudioSupported;
  }

  enableRecorder(stream) {
    this.recorder = new MediaRecorder(stream);
    this.recorder.addEventListener('dataavailable', event => {
      this.chunks.push(event.data);
    });
    this.recorder.addEventListener('stop', this.onRecordingStop.bind(this));
    this.showButton(this.recordBtn);
  }

  onRecordingStop() {
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
