import { HtmlElementsFactory } from './HtmlElementsFactory.js';

export class TextToSpeech {
  constructor() {
    this.init();
  }

  init() {
    this.createHtmlElements();
    this.initializeSpeechSynthesis();
  }

  createHtmlElements() {
    const elements = [
      {
        tag: 'select',
        id: 'voice-select',
        label: 'Selecciona una voz en inglés:',
        onChange: this.setVoice.bind(this),
      },
      {
        tag: 'input',
        type: 'text',
        id: 'input-text',
        label: 'Ingresa el texto a sintetizar:',
      },
      {
        tag: 'button',
        id: 'speak-btn',
        label: 'Hablar',
        onClick: this.speak.bind(this),
      },
    ];

    const tts = document.querySelector('text-to-speech');
    HtmlElementsFactory.appendTo(tts, elements);
  }


  initializeSpeechSynthesis() {
    if ('speechSynthesis' in window) {
      this.utterance = new SpeechSynthesisUtterance();
      window.speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
    } else {
      console.error('La API de síntesis de voz no está disponible en este navegador.');
    }
  }

  loadVoices() {
    const voices = window.speechSynthesis.getVoices();

    const enVoices = voices
      .filter(voice => voice.lang.startsWith('en-'));

    enVoices.forEach(voice => {
      const option = document.createElement('option');
      option.textContent = `${voice.name} (${voice.lang})`;
      option.setAttribute('value', voice.name);
      document.getElementById('voice-select').appendChild(option);
    });

    const defaultEnVoice = enVoices[0];
    this.utterance.voice = defaultEnVoice;
    document.getElementById('voice-select').value = defaultEnVoice.name;
  }

  setVoice() {
    const selectedVoiceName = document.getElementById('voice-select').value;
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(voice => voice.name === selectedVoiceName);
    this.utterance.voice = selectedVoice;
  }

  speak() {
    const inputTextValue = document.getElementById('input-text').value;
    this.utterance.text = inputTextValue;
    window.speechSynthesis.speak(this.utterance);
  }
}