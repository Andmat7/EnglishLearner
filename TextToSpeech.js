import { HtmlElementsFactory } from './HtmlElementsFactory.js';

export class TextToSpeech {
  constructor(ttsElement) {
    this.createHtmlElements(ttsElement);
    this.initializeSpeechSynthesis();
  }

  createHtmlElements(ttsElement) {
    const select = { tag: 'select', id: 'voice-select', label: 'Select an English voice:', onChange: this.setVoice.bind(this) };
    const input = { tag: 'input', type: 'text', id: 'input-text', label: 'Enter text to synthesize:' };
    const speakBtn = { tag: 'button', label: 'Speak', id: 'speak-btn', onClick: this.speak.bind(this) };
    const createdElements = HtmlElementsFactory.appendTo(ttsElement, [select, input, speakBtn]);
    
    this.voiceSelect = createdElements[0];
    this.inputText = createdElements[1];
    this.speakBtn = createdElements[2];
  }

  initializeSpeechSynthesis() {
    if ('speechSynthesis' in window) {
      this.utterance = new SpeechSynthesisUtterance();
      window.speechSynthesis.addEventListener('voiceschanged', this.loadVoices.bind(this));
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
      this.voiceSelect.appendChild(option);
    });

    const defaultEnVoice = enVoices[0];
    this.utterance.voice = defaultEnVoice;
    this.voiceSelect.value = defaultEnVoice.name;
  }

  setVoice() {
    const selectedVoiceName = this.voiceSelect.value;
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(voice => voice.name === selectedVoiceName);
    this.utterance.voice = selectedVoice;
  }

  speak() {
    const inputTextValue =this.inputText.value;
    this.utterance.text = inputTextValue;
    window.speechSynthesis.speak(this.utterance);
  }
}