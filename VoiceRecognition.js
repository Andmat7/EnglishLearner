import { HtmlElementsFactory } from './HtmlElementsFactory.js';

export class VoiceRecognition {
  constructor() {
    this.createHtmlElements();

    const startBtn = this.recordBtn;
    startBtn.addEventListener("click", this.startRecognition.bind(this));

    this.initChart();
  }

  async initChart() {
    await this.createChartScript();
    this.configChart();
  }

  createHtmlElements() {
    const recordBtn = { tag: 'button', label: 'Iniciar reconocimiento de voz', onClick: null };
    const canvas = { tag: 'canvas', attributes: { id: 'radarChart' } };
    const recordingDiv = { tag: 'div', label: 'Grabando...', style: { display: 'none' } };

    const voiceRecognition = document.querySelector('voice-recognition');
    const createdElements = HtmlElementsFactory.appendTo(voiceRecognition, [recordBtn, canvas, recordingDiv]);
    this.recordBtn = createdElements[0];
    this.canvas = createdElements[1];
    this.recordingDiv = createdElements[2];
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
      const recordingDiv = this.recordingDiv; // Referencia a la etiqueta HTML "div"

      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 5;

      recognition.onstart = function () {
        console.log('Micrófono activado. Comenzando a grabar.');
        recordingDiv.style.display = 'block'; // Muestra la etiqueta HTML "div"
      }

      recognition.onresult = this.onRecognitionResult.bind(this);
      recognition.onerror = function (event) {
        console.error('Error en el reconocimiento de voz: ' + event.error);
      };

      recognition.onend = function () {
        console.log('Micrófono desactivado. Deteniendo grabación.');
        recordingDiv.style.display = 'none'; // Oculta la etiqueta HTML "div"
      }

      recognition.start();
    } else {
      alert('Lo siento, tu navegador no es compatible con el reconocimiento de voz webkitSpeechRecognition.');
    }
  }



  onRecognitionResult(event) {
    const results = event.results[0];
    console.log(event.results)
    this.config.data.labels = []; // Vacía las etiquetas antes de agregar nuevas
    this.config.data.datasets[0].data = []; // Vacía los datos antes de agregar nuevos
    for (let i = 0; i < results.length; i++) {

      const alternative = results[i];
      this.config.data.labels.push(alternative.transcript);

      console.log(alternative.transcript)
      console.log(alternative.confidence)
      this.config.data.datasets[0].data.push(alternative.confidence);
    }
    this.radarChart.update();
  }
}