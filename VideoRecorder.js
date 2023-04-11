import { HtmlElementsFactory } from './HtmlElementsFactory.js';
export class VideoRecorder {
    constructor() {
        this.createHtmlElements();
        this.chunks = [];
        this.recorder = null;
    }

    createHtmlElements() {
        const recordBtn = { tag: 'button', label: 'Record', onClick: this.startRecording.bind(this) };
        const stopBtn = { tag: 'button', label: 'Stop', onClick: this.stopRecording.bind(this), style: 'display: none;' };
        const video = { tag: 'video', attributes: { controls: true, muted: '' }, id: 'myVideo' };
        const enableVideo = { tag: 'button', label: 'Enable video', onClick: this.toggleCamera.bind(this) };

        const videoRecorder = document.querySelector('video-recorder');
        const createdElements = HtmlElementsFactory.appendTo(videoRecorder, [recordBtn, stopBtn, enableVideo, video]);

        this.recordBtn = createdElements[0];
        this.stopBtn = createdElements[1];
        this.cameraBtn = createdElements[2];
        this.videoElement = createdElements[3];
    }

    enableVideoAndAudio() {
        const isVideoSupported = navigator.mediaDevices && navigator.mediaDevices.getUserMedia
        if (isVideoSupported) {

            navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
                this.startStreaming(stream);

            }).catch(error => {
                console.error('No se pudo acceder a la cámara y/o micrófono.', error);
            });
        } else {
            console.error('La API de getUserMedia no está disponible en este navegador.');
        }
    }

    toggleCamera() {
        if (this.recorder) {
            this.recorder.stream.getTracks().forEach(track => track.stop());
            this.recorder = null;
            this.hideButton(this.stopBtn);
            this.showButton(this.recordBtn);
        } else {
            navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
                this.startStreaming(stream);
                this.showButton(this.recordBtn);
                this.hideButton(this.cameraBtn);
            }).catch(error => {
                console.error('No se pudo acceder a la cámara y/o micrófono.', error);
            });
        }
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
        this.cameraBtn.textContent = 'Stop Camera';
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
