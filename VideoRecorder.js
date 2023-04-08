import { HtmlElementsFactory } from './HtmlElementsFactory.js';
export class VideoRecorder {
    constructor() {
        this.createButtons();
        this.initializeRecorder();
    }

    createButtons() {
        const recordBtn = { tag: 'button', label: 'Record', onClick: this.startRecording.bind(this) };
        const stopBtn = { tag: 'button', label: 'Stop', onClick: this.stopRecording.bind(this), style: 'display: none;' };
        const video = { tag: 'video', attributes: { controls: true } };
        const cameraBtn = { tag: 'button', label: 'Camera', onClick: this.toggleCamera.bind(this) };
    
        const videoRecorder = document.querySelector('video-recorder');
        const createdElements = HtmlElementsFactory.appendTo(videoRecorder, [recordBtn, stopBtn, cameraBtn, video]);
    
        this.recordBtn = createdElements[0];
        this.stopBtn = createdElements[1];
        this.cameraBtn = createdElements[2];
    }
    
    toggleCamera() {
        if (this.recorder) {
            this.recorder.stream.getTracks().forEach(track => track.stop());
            this.recorder = null;
            this.hideButton(this.stopBtn);
            this.showButton(this.recordBtn);
        } else {
            navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
                this.videoElement.srcObject = stream;
                this.videoElement.play();
                this.recorder = new MediaRecorder(stream);
                this.cameraBtn.textContent = 'Stop Camera';
                this.recorder.addEventListener('dataavailable', event => {
                    this.chunks.push(event.data);
                });
                this.recorder.addEventListener('stop', () => {
                    this.handleRecordingStop();
                });
                this.showButton(this.recordBtn);
                this.hideButton(this.cameraBtn);
            }).catch(error => {
                console.error('No se pudo acceder a la cámara y/o micrófono.', error);
            });
        }
    }

    initializeRecorder() {
        this.chunks = [];
        this.recorder = null;
        this.videoElement = document.querySelector('video');

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
                this.videoElement.srcObject = stream;
                this.videoElement.play();
                this.recorder = new MediaRecorder(stream);

                this.recorder.addEventListener('dataavailable', event => {
                    this.chunks.push(event.data);
                });

                this.recorder.addEventListener('stop', () => {
                    this.handleRecordingStop();
                });

            }).catch(error => {
                console.error('No se pudo acceder a la cámara y/o micrófono.', error);
            });
        } else {
            console.error('La API de getUserMedia no está disponible en este navegador.');
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

    showButton(button) {
        button.style.display = 'inline-block';
    }

    hideButton(button) {
        button.style.display = 'none';
    }
}
