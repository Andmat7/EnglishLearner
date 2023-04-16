import { HtmlElementsFactory } from './HtmlElementsFactory.js';

export class VoiceRecognition {
  constructor() {
    this.createHtmlElements();

    const startBtn = this.recordBtn;
    startBtn.addEventListener("click", this.startRecognition.bind(this));

    this.initChart();
    this.setupAudioContext();
  }

  async initChart() {
    await this.createChartScript();
    this.configChart();
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
    const recordBtn = { tag: 'button', label: 'Iniciar reconocimiento de voz', onClick: null };
    const canvas = { tag: 'canvas', attributes: { id: 'radarChart' } };
    const recordingDiv = { tag: 'div', label: 'Grabando...', style: { display: 'none' } };
    const progress = { tag: 'progress', attributes: { max: 100, value: 0 } };
    const voiceRecognition = document.querySelector('voice-recognition');
    const createdElements = HtmlElementsFactory.appendTo(voiceRecognition, [recordBtn, canvas, recordingDiv, progress]);
    this.recordBtn = createdElements[0];
    this.canvas = createdElements[1];
    this.recordingDiv = createdElements[2];
    this.progress = createdElements[3];
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

  startRecognition() {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      this.setupRecognition(recognition);
      recognition.start();
    } else {
      alert('Lo siento, tu navegador no es compatible con el reconocimiento de voz webkitSpeechRecognition.');
    }
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
  }

  onRecognitionStart() {
    console.log('Micrófono activado. Comenzando a grabar.');
    this.recordingDiv.style.display = 'block';  
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
    const results = event.results[0];
    console.log(event.results)
    this.clearLabelsAndData();
    this.addResultsToChart(results);
    this.updateChart();
  }

  clearLabelsAndData() {
    this.config.data.labels = [];
    this.config.data.datasets[0].data = [];
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
    console.log(label);
  }

  addData(data) {
    this.config.data.datasets[0].data.push(data);
    console.log(data);
  }

  updateChart() {
    this.radarChart.update();
  }
}