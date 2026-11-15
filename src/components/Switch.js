/**
 * Copyright (C) 2026 The QuickGesture of JavaScript
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. 
 */
export class qgSwitch extends HTMLElement {
  static get observedAttributes() {
    return ['checked', 'disabled', 'size'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
            display: inline-flex;
            vertical-align: middle;

            font-size: var(--qg-switch-font-size, 1em);

            /* ② 尺寸全部用 em，相对上面的 font-size */
            --qg-switch-width: 3.25em;        /* 52/16 */
            --qg-switch-height: 2em;          /* 32/16 */
            --qg-switch-thumb-size: 1.5em;    /* 24/16 */
            --qg-switch-padding: 0.25em;      /* 4/16 */

            --qg-switch-track-on: green;
            --qg-switch-track-off: #E0E0E0;
            --qg-switch-thumb-color: #fff;
            --qg-switch-thumb-scale-off: 0.667;

            /* ③ 位移计算：变量全是 em，calc 结果也是 em，跟随字号 */
            --_tx: calc(
                var(--qg-switch-width)
                - var(--qg-switch-thumb-size)
                - var(--qg-switch-padding) * 2
            );
        }

        :host([size="small"]) {
        --qg-switch-width: 2.5em;
        --qg-switch-height: 1.5em;
        --qg-switch-thumb-size: 1.125em;
        --qg-switch-padding: 0.1875em;
        }

        /* 禁用 */
        :host([disabled]) {
          opacity: 0.4;
          pointer-events: none;
          cursor: not-allowed;
        }

        /* 内部元素必须显式继承字号，em 才解析在正确的基准上 */
        button {
            all: unset;
            box-sizing: border-box;
            font-size: inherit;                /* ← 关键：保证 em 和 host 同一基准 */
            display: block;
            width: var(--qg-switch-width);
            height: var(--qg-switch-height);
            border-radius: calc(var(--qg-switch-height) / 2);   /* 自动胶囊 */
            background: var(--qg-switch-track-off);
            position: relative;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
            transition: background-color .25s cubic-bezier(.4, 0, .2, 1);
        }

        button:focus-visible {
            outline: 0.125em solid var(--qg-switch-track-on);
            outline-offset: 0.125em;
        }

        button[aria-checked="true"] {
            background: var(--qg-switch-track-on);
        }

        .thumb {
            position: absolute;
            top: 50%;
            left: var(--qg-switch-padding);
            width: var(--qg-switch-thumb-size);
            height: var(--qg-switch-thumb-size);
            border-radius: 50%;
            background: var(--qg-switch-thumb-color);
            /* 阴影也用 em，大号时不显得薄 */
            box-shadow: 0 0.0625em 0.125em rgba(0,0,0,.25),
                        0 0.0625em 0.1875em rgba(0,0,0,.15);
            transform: translateY(-50%) scale(var(--qg-switch-thumb-scale-off));
            transition: transform .25s cubic-bezier(.4, 0, .2, 1);
            pointer-events: none;
        }

        button[aria-checked="true"] .thumb {
            transform: translateY(-50%) translateX(var(--_tx)) scale(1);
        }

        /* 按下光晕（Material ripple 简化版） */
        .thumb::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: var(--qg-switch-track-on);
          opacity: 0;
          transform: scale(1);
          transition: opacity .2s, transform .2s;
        }
        button[aria-checked="false"]:active .thumb::after {
          background: #000;
        }
        button:active .thumb::after {
          opacity: .12;
          transform: scale(1.6);
        }
      </style>
      <button type="button" part="track" role="switch" aria-checked="false">
        <span class="thumb" part="thumb"></span>
      </button>
    `;
    this._button = this.shadowRoot.querySelector('button');
    this._onClick = this._onClick.bind(this);
  }

  connectedCallback() {
    this._button.addEventListener('click', this._onClick);
    this._sync();
  }

  disconnectedCallback() {
    this._button.removeEventListener('click', this._onClick);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    this._sync();
  }

  /* ---- 公开 API ---- */
  get checked() {
    return this.hasAttribute('checked');
  }
  set checked(v) {
    v ? this.setAttribute('checked', '') : this.removeAttribute('checked');
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }
  set disabled(v) {
    v ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
  }

  /* ---- 内部 ---- */
  _onClick() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.dispatchEvent(new CustomEvent('change', {
      detail: { checked: this.checked },
      bubbles: true,
      composed: true, // 穿透 shadow DOM
    }));
  }

  _sync() {
    if (!this._button) return;
    this._button.setAttribute('aria-checked', String(this.checked));
    this._button.disabled = this.disabled;
  }
}
if (!customElements.get('qg-switch')) {
   customElements.define('qg-switch', qgSwitch); 
}
