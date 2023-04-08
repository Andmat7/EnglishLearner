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
            default:
                throw new Error(`Unsupported element type: ${elem.tag}`);
        }
        if (elem.style) {
            el.setAttribute('style', elem.style);
        }
        return el;
    }

    static createSelect({ id, label, onChange }) {
        const select = document.createElement('select');
        select.setAttribute('id', id);

        const selectLabel = document.createElement('label');
        selectLabel.textContent = label;
        selectLabel.setAttribute('for', id);

        selectLabel.addEventListener('change', onChange);

        selectLabel.appendChild(select);

        return selectLabel;
    }

    static createInput({ id, label, type }) {
        const input = document.createElement('input');
        input.setAttribute('type', type);
        input.setAttribute('id', id);

        const inputLabel = document.createElement('label');
        inputLabel.textContent = label;
        inputLabel.setAttribute('for', id);

        inputLabel.appendChild(input);

        return inputLabel;
    }

    static createButton({ id, label, onClick }) {
        const button = document.createElement('button');
        button.setAttribute('id', id);
        button.addEventListener('click', onClick);

        const buttonLabel = document.createTextNode(label);
        button.appendChild(buttonLabel);

        return button;
    }

    static createAudio({ id }) {
        const audio = document.createElement('audio');
        audio.setAttribute('id', id);
        audio.setAttribute('controls', '');

        return audio;
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