import { HtmlElementsFactory } from './HtmlElementsFactory.js';
export class VideoRecorder {
    constructor() {
        this.createHtmlElements();
        this.chunks = [];
        this.recorder = null;
    }

    createHtmlElements() {
        const recordBtn = { tag: 'button', label: 'Record', onClick: this.startRecording.bind(this), style: 'display: none;'  };
        const stopBtn = { tag: 'button', label: 'Stop', onClick: this.stopRecording.bind(this), style: 'display: none;' };
        const video = { tag: 'video', attributes: { controls: true, muted: '' }, id: 'myVideo' };
        const enableVideoBtn = { tag: 'button', label: 'Enable video', onClick: this.enableVideo.bind(this) };
        const disableVideoBtn = { tag: 'button', label: 'Disable video', onClick: this.disableVideo.bind(this), style: 'display: none;'  };
        const videoRecorder = document.querySelector('video-recorder');
        const createdElements = HtmlElementsFactory.appendTo(videoRecorder, [recordBtn, stopBtn, enableVideoBtn,disableVideoBtn, video]);

        this.recordBtn = createdElements[0];
        this.stopBtn = createdElements[1];
        this.enableVideoBtn = createdElements[2];
        this.disableVideoBtn = createdElements[3];
        this.videoElement = createdElements[4];
    }

    enableVideo() {
        const isVideoSupported = navigator.mediaDevices && navigator.mediaDevices.getUserMedia
        if (isVideoSupported) {
            navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
                this.startStreaming(stream);
                this.showButton(this.recordBtn);
                this.hideButton(this.enableVideoBtn);
                this.showButton(this.disableVideoBtn);
                this.isStreaming = false;
            }).catch(error => {
                console.error('No se pudo acceder a la cámara y/o micrófono.', error);
            });
        } else {
            console.error('La API de getUserMedia no está disponible en este navegador.');
        }
    }
    disableVideo() {
        if (this.recorder) {
            this.stopStreaming();
            this.recorder = null;
            this.hideButton(this.recordBtn);
        }
        this.hideButton(this.stopBtn);
        this.hideButton(this.disableVideoBtn);
        this.showButton(this.enableVideoBtn);
    }
    stopStreaming() {
        this.recorder.stream.getTracks().forEach(track => track.stop());

    }

    handleRecordingStop() {
        const videoData = new Blob(this.chunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(videoData);
        this.videoElement.srcObject = null;
        this.videoElement.src = videoUrl;
    }

    startRecording() {
        if (this.recorder) {
            this.videoElement.srcObject = this.recorder.stream;
            this.videoElement.play();
            this.videoElement.muted = true;
            this.recorder.start();
            this.hideButton(this.recordBtn);
            this.showButton(this.stopBtn);
        }
    }

    startStreaming(stream) {
        this.videoElement.srcObject = stream;
        this.videoElement.play();
        this.videoElement.muted = true;
        this.recorder = new MediaRecorder(stream);
        this.recorder.addEventListener('dataavailable', event => {
            this.chunks.push(event.data);
        });
        this.recorder.addEventListener('stop', () => {
            this.handleRecordingStop();
        });
    }

    stopRecording() {
        if (this.recorder) {
            this.recorder.stop();
            this.chunks = [];
            this.hideButton(this.stopBtn);
            this.showButton(this.recordBtn);
        }
    }

    showButton(button) {
        button.style.display = 'inline-block';
    }

    hideButton(button) {
        button.style.display = 'none';
    }
}
