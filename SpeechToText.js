import { HtmlElementsFactory } from './HtmlElementsFactory.js';

export class SpeechToText {
  constructor() {
    this.init();
  }

  init() {
    this.createHtmlElements();
    this.initializeSpeechRecognition();
  }

  createHtmlElements() {
    const elements = [
      {
        tag: 'select',
        id: 'lang-select',
        label: 'Selecciona un idioma:',
        onChange: this.setLanguage.bind(this),
      },
      {
        tag: 'textarea',
        id: 'output-text',
        label: 'Texto transcrito:',
      },
      {
        tag: 'button',
        id: 'start-stop-btn',
        label: 'Iniciar',
        onClick: this.toggleRecognition.bind(this),
      },
    ];

    const stt = document.querySelector('speech-to-text');
    HtmlElementsFactory.appendTo(stt, elements);
  }

  initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.onresult = this.handleRecognitionResult.bind(this);

      this.loadLanguages();

    } else {
      console.error('La API de reconocimiento de voz no está disponible en este navegador.');
    }
  }

  loadLanguages() {
    const languages = [
      { code: 'en-US', name: 'English (US)' },
      { code: 'es-ES', name: 'Español (España)' },
      // Agrega más idiomas aquí
    ];

    const langSelect = document.getElementById('lang-select');
    languages.forEach(lang => {
      const option = document.createElement('option');
      option.textContent = lang.name;
      option.setAttribute('value', lang.code);
      langSelect.appendChild(option);
    });

    langSelect.value = 'en-US';
  }

  setLanguage() {
    const selectedLanguage = document.getElementById('lang-select').value;
    this.recognition.lang = selectedLanguage;
  }

  handleRecognitionResult(event) {
    const outputText = document.getElementById('output-text');
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        outputText.value = finalTranscript + transcript;
      }
    }
  }

  toggleRecognition() {
    const startStopBtn = document.getElementById('start-stop-btn');
    if (this.recognition && this.recognition.recognizing) {
      this.recognition.stop();
      this.recognition.recognizing = false;
      startStopBtn.textContent = 'Iniciar';
    } else {
      this.recognition.start();
      this.recognition.recognizing = true;
      startStopBtn.textContent = 'Detener';
    }
  }
}
