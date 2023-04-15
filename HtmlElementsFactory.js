export class HtmlElementsFactory {
    static createElement(elem) {
        let el;
        switch (elem.tag) {
            case 'select':
                el = this.createSelect(elem);
                break;
            case 'input':
                el = this.createInput(elem);
                break;
            case 'button':
                el = this.createButton(elem);
                break;
            case 'audio':
                el = this.createAudio(elem);
                break;
            case 'video': // Agrega el caso de video
                el = this.createVideo(elem);
                break;
            case 'textarea': // Agrega el caso de textarea
                el = this.createTextarea(elem);
                break;
            case 'canvas':
                el = this.createCanvas(elem);
                break;
            case 'script':
                el = this.createScript(elem);
                break;
            case 'div': // Agrega el caso de div
                el = this.createDiv(elem);
                break;
            case 'progress':
                el = this.createProgress(elem);
                break;
            default:
                throw new Error(`Unsupported element type: ${elem.tag}`);
        }
        if (elem.style) {
            el.setAttribute('style', elem.style);
        }
        return el;
    }

    static createScript({ attributes = {} }) {
        const script = document.createElement('script');
        script.setAttribute('src', attributes.src);
        return script;
    }

    static createCanvas({ id, width, height }) {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('id', id);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        return canvas;
    }

    static createTextarea({ id, label }) {
        const textarea = document.createElement('textarea');
        textarea.setAttribute('id', id);

        const textareaLabel = document.createElement('label');
        textareaLabel.textContent = label;
        textareaLabel.setAttribute('for', id);

        textareaLabel.appendChild(textarea);

        return textarea;
    }
    static createSelect({ id, label, onChange }) {
        const select = document.createElement('select');
        select.setAttribute('id', id);

        const selectLabel = document.createElement('label');
        selectLabel.textContent = label;
        selectLabel.setAttribute('for', id);

        select.addEventListener('change', onChange);

        selectLabel.appendChild(select);
        return select;
    }

    static createInput({ id, label, type }) {
        const input = document.createElement('input');
        input.setAttribute('type', type);
        input.setAttribute('id', id);

        const inputLabel = document.createElement('label');
        inputLabel.textContent = label;
        inputLabel.setAttribute('for', id);

        inputLabel.appendChild(input);

        return input;
    }
    static createProgress({ id, value = 0, max = 100 }) {
        const progress = document.createElement('progress');
        progress.setAttribute('id', id);
        progress.setAttribute('value', value);
        progress.setAttribute('max', max);

        return progress;
    }


    static createButton({ id, label, onClick }) {
        const button = document.createElement('button');
        button.setAttribute('id', id);
        button.addEventListener('click', onClick);

        const buttonLabel = document.createTextNode(label);
        button.appendChild(buttonLabel);

        return button;
    }

    static createDiv({ label, style }) {
        const div = document.createElement('div');
        div.textContent = label;
        if (style) {
            div.setAttribute('style', style);
        }
        return div;
    }
    static createAudio({ id }) {
        const audio = document.createElement('audio');
        audio.setAttribute('id', id);
        audio.setAttribute('controls', '');

        return audio;
    }
    static createVideo({ id, attributes = {} }) {
        const video = document.createElement('video');
        video.setAttribute('id', id);

        for (const [key, value] of Object.entries(attributes)) {
            video.setAttribute(key, value);
        }

        return video;
    }
    static appendTo(parentElement, elements) {
        const createdElements = [];

        elements.forEach(elem => {
            const el = this.createElement(elem);
            if (el != undefined) {
                parentElement.appendChild(el);
                createdElements.push(el);
            }
        });

        return createdElements;
    }
}