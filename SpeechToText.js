import { HtmlElementsFactory } from './HtmlElementsFactory.js';

export class SpeechToText {
  constructor() {
    this.createHtmlElements();
    this.initializeSpeechRecognition();
  }

  createHtmlElements(stt) {
    const select = {
      tag: 'select',
      id: 'lang-select',
      label: 'Selecciona un idioma:',
      onChange: this.setLanguage.bind(this),
    };
    const output = {
      tag: 'textarea',
      id: 'output-text',
      label: 'Texto transcrito:',
    };
    const startStopBtn = {
      tag: 'button',
      id: 'start-stop-btn',
      label: 'Iniciar',
      onClick: this.toggleRecognition.bind(this),
    };
    const createdElements = HtmlElementsFactory.appendTo(document.querySelector('speech-to-text'), [select, output, startStopBtn]);
  
    this.langSelect = createdElements[0];
    this.outputText = createdElements[1];
    this.startStopBtn = createdElements[2];
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

    const langSelect = this.langSelect;
    languages.forEach(lang => {
      const option = document.createElement('option');
      option.textContent = lang.name;
      option.setAttribute('value', lang.code);
      langSelect.appendChild(option);
    });

    langSelect.value = 'en-US';
  }

  setLanguage() {
    const selectedLanguage = this.langSelect.value;
    this.recognition.lang = selectedLanguage;
  }

  handleRecognitionResult(event) {
    const outputText = this.outputText;
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
    const startStopBtn = this.startStopBtn;
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
