class MenuItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      this.render();
        this.shadowRoot.querySelector('input').addEventListener('change', (e) => {
            if (e.target.checked) {
                this.setAttribute('checked', '');
                this.dispatchEvent(new CustomEvent('itemSelected', {
                    detail: { id: this.id, checked: true }
                }));
            } else {
                this.removeAttribute('checked');
                this.dispatchEvent(new CustomEvent('itemSelected', {
                    detail: { id: this.id, checked: false }
                }));
            }
        });
    }

    static get observedAttributes() {
        return ['checked'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'checked') {
            const checkbox = this.shadowRoot.querySelector('input');
            checkbox.checked = newValue !== null;
        }
    }

    render() {
        const isChecked = this.hasAttribute('checked');

        this.shadowRoot.innerHTML = `
            <style>
                .menu-item {
                    cursor: pointer;
                    display: flex;
                    padding: 12px 8px;
                    align-items: center;
                    gap: 8px;
                    border-radius: 4px;
                }

                .menu-item:hover {
                    /* background-color: #F5F5F5; */
                    background-color: #FCF4F2;
                    color: #E69680;
                }
            </style>

            <div class="menu-item">
                <label>
                    <input type="checkbox"
                        ${isChecked ? 'checked' : ''}
                    >
                    <slot></slot>
                </label>
            </div>
        `
    }
}

customElements.define("menu-item-component", MenuItem);