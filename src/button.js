class Button extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['variant'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        const variant = this.getAttribute('variant') || 'primary';

        this.shadowRoot.innerHTML = `
            <style>
                button {
                    background-color: #222431;
                    color: #FDFDFC;
                    cursor: pointer;

                    font-family: 'Coustard', sans-serif;
                    font-size: 16px;
                    font-weight: 900;
                    border-radius: 99px;
                    padding: 12px 22px;
                    border: none;
                }
                
                button:hover {
                    background-color: #F1CABF;
                    color: #222431;
                }
                
                .secondary {
                    background-color: #FCF9F8;
                    color: #222431;
                }
            </style>
            <button class="${variant}">
                <slot></slot>
            </button>
        `;
    }
}

customElements.define('custom-button', Button);