import { HtmlElementsFactory } from './HtmlElementsFactory.js';

export class VoiceRecognition {

  constructor() {
    this.createHtmlElements();
  }

  async setupAudioContext() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 1024;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.source = this.audioContext.createMediaStreamSource(stream);
      this.source.connect(this.analyser);
    } catch (err) {
      console.error('Error al configurar el AudioContext:', err);
    }
  }

  getVolume() {
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    const sum = dataArray.reduce((a, b) => a + b, 0);
    return sum / dataArray.length;
  }

  createHtmlElements() {
    const recordBtn = { tag: 'button', label: 'Iniciar reconocimiento de voz', onClick: this.startRecognition.bind(this) };
    const recordingDiv = { tag: 'div', label: '', style: { display: 'none' } };
    const progress = { tag: 'progress', attributes: { max: 100, value: 0 }, style: { display: 'none' }  };
    const voiceRecognition = document.querySelector('voice-recognition');
    const createdElements = HtmlElementsFactory.appendTo(voiceRecognition, [recordBtn, recordingDiv, progress]);
    this.recordBtn = createdElements[0];
    this.recordingDiv = createdElements[1];
    this.progress = createdElements[2];
    this.chartVoiceRecognition = new ChartVoiceRecognition(voiceRecognition);
  }

  setupRecognition(recognition) {
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 5;

    recognition.onstart = () => this.onRecognitionStart();
    recognition.onresult = (event) => this.onRecognitionResult(event);
    recognition.onerror = (event) => this.onRecognitionError(event);
    recognition.onend = () => this.onRecognitionEnd();

    recognition.onaudiostart = () => this.onAudioStart();
    recognition.onaudioend = () => this.onAudioEnd();
    recognition.onsoundstart = () => this.onSoundStart();
    recognition.onsoundend = () => this.onSoundEnd();
    recognition.onspeechstart = () => this.onSpeechStart();
    recognition.onspeechend = () => this.onSpeechEnd();
    recognition.onnomatch = (event) => this.onNoMatch(event);
  }

  startRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.setupAudioContext();
      const recognition = new webkitSpeechRecognition();
      this.setupRecognition(recognition);
      recognition.start();
    } else {
      alert('Lo siento, tu navegador no es compatible con el reconocimiento de voz webkitSpeechRecognition.');
    }
  }

  onRecognitionStart() {
    console.log('Micrófono activado. Comenzando a grabar.');
  }

  showVolume() {
    this.progress.style.display = 'block';
    this.volumeInterval = setInterval(() => {
      const volume = this.getVolume();
      this.progress.value = volume;
    }, 100);
  }

  onRecognitionError(event) {
    console.error('Error en el reconocimiento de voz: ' + event.error);
  }

  onRecognitionEnd() {
    console.log('Micrófono desactivado. Deteniendo grabación.');
    this.recordingDiv.style.display = 'none'; // Oculta la etiqueta HTML "div"
  }

  onRecognitionResult(event) {
    this.chartVoiceRecognition.onRecognitionResult(event)
  }

  onAudioStart() {
    console.log('El evento audiostart ha sido activado.');
    this.recordingDiv.textContent = 'Grabando...';
    this.recordingDiv.style.display = 'block';
    this.showVolume();
  }

  onAudioEnd() {
    console.log('El evento audioend ha sido activado.');
    this.hideVolume(); 
  }

  hideVolume() {
    clearInterval(this.volumeInterval);
    this.progress.style.display = 'none';
  }

  onSoundStart() {
    console.log('El evento soundstart ha sido activado.');
  }

  onSoundEnd() {
    console.log('El evento soundend ha sido activado.');
  }

  onSpeechStart() {
    console.log('El evento speechstart ha sido activado.');
  }

  onSpeechEnd() {
    console.log('El evento speechend ha sido activado.');
  }

  onNoMatch(event) {
    console.log('No se encontró una coincidencia: ', event);
  }

}


class ChartVoiceRecognition {

  constructor(voiceRecognition) {
    this.createHtmlElements(voiceRecognition);
    this.initChart();
  }

  createHtmlElements(voiceRecognition) {
    const canvas = { tag: 'canvas', attributes: { id: 'radarChart' } };
    const createdElements = HtmlElementsFactory.appendTo(voiceRecognition, [canvas]);
    this.canvas = createdElements[0];
  }

  createChartScript() {
    return new Promise((resolve) => {
      const script = HtmlElementsFactory.createElement({
        tag: 'script',
        attributes: {
          src: 'https://cdn.jsdelivr.net/npm/chart.js'
        }
      });
      script.addEventListener('load', resolve);
      document.head.appendChild(script);
    });
  }

  async initChart() {
    await this.createChartScript();
    this.configChart();
  }

  configChart() {
    this.config = {
      type: 'radar',
      data: {
        labels: [],
        datasets: [{
          label: 'Confianza',
          data: [],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 1,
            min: 0.5,
          }
        }
      }
    };

    this.ctx = this.canvas.getContext('2d');
    this.radarChart = new Chart(this.ctx, this.config);
  }

  clearLabelsAndData() {
    this.config.data.labels = [];
    this.config.data.datasets[0].data = [];
  }

  onRecognitionResult(event) {
    const results = event.results[0];
    this.clearLabelsAndData();
    this.addResultsToChart(results);
    this.updateChart();
  }

  addResultsToChart(results) {
    for (let i = 0; i < results.length; i++) {
      const alternative = results[i];
      this.addLabel(alternative.transcript);
      this.addData(alternative.confidence);
    }
  }

  addLabel(label) {
    this.config.data.labels.push(label);
  }

  addData(data) {
    this.config.data.datasets[0].data.push(data);
  }

  updateChart() {
    this.radarChart.update();
  }
}