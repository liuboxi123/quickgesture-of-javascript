class qgInput extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
    this._shadow.innerHTML = `
      <input />
      <style>
        :host { display: inline-block; }
        input { width: 100%; }
      </style>
    `;
    this._input = this._shadow.querySelector('input');
  }

  static get observedAttributes() {
    return [
      'type',
      'value',
      'placeholder',
      'disabled',
      'readonly',
      'required',
      'name',
      'maxlength',
      'minlength',
      'pattern',
      'autocomplete',
      'autofocus',
      'size',
      'min',
      'max',
      'step',
      'inputmode',
      'list',
      'multiple',
      'accept',
      'form',
      'formaction',
      'formenctype',
      'formmethod',
      'formnovalidate',
      'formtarget',
      'aria-label',
      'aria-labelledby',
      'aria-describedby',
      'aria-invalid',
      'aria-required',
      'aria-disabled',
      'aria-readonly',
      'aria-placeholder',
      'title',
      'tabindex',
      'class',
      'style',
      'id'
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    const booleanAttrs = new Set([
      'disabled',
      'readonly',
      'required',
      'autofocus',
      'multiple'
    ]);

    if (booleanAttrs.has(name)) {
      if (newValue === null) {
        this._input.removeAttribute(name);
      } else {
        this._input.setAttribute(name, '');
      }
    } else if (newValue === null) {
      this._input.removeAttribute(name);
    } else {
      this._input.setAttribute(name, newValue);
    }
  }

  connectedCallback() {
    for (const attr of this.getAttributeNames()) {
      this.attributeChangedCallback(attr, null, this.getAttribute(attr));
    }

    this._input.addEventListener('input', (e) => {
      this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    });
    this._input.addEventListener('change', (e) => {
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    });
    this._input.addEventListener('focus', (e) => {
      this.dispatchEvent(new Event('focus', { bubbles: true, composed: true }));
    });
    this._input.addEventListener('blur', (e) => {
      this.dispatchEvent(new Event('blur', { bubbles: true, composed: true }));
    });
  }

  get value() {
    return this._input.value;
  }
  set value(val) {
    this._input.value = val;
  }

  focus() {
    this._input.focus();
  }

  blur() {
    this._input.blur();
  }

  select() {
    this._input.select();
  }
}

customElements.define('qg-input', qgInput);
