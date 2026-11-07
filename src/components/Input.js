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

/**
 * qg input
 */
const STYLES = `
  <style>
    :host {
      --glass-blur: 28px;
      --glass-saturate: 170%;
      --glass-radius: 0;
      --glass-tint: 255 255 255;
      --glass-tint-alpha: 0.12;
      --glass-padding: 0px;
      --glass-shadow-strength: 1;
      --glass-border-opacity: 0.2;
      --glass-noise-opacity: 0.25;
      --glass-noise-blend: overlay;
      --glass-text: #111;

      display: block;
      position: relative;
      isolation: isolate;
      border-radius: var(--glass-radius);
      overflow: hidden;

      -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
              backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));

      background-color: rgb(var(--glass-tint) / var(--glass-tint-alpha));

      box-shadow:
        calc(0px * var(--glass-shadow-strength)) 8px 32px -12px rgb(0 0 0 / 0.18),
        calc(0px * var(--glass-shadow-strength)) 4px 16px -8px  rgb(0 0 0 / 0.12),
        inset 1px 1px 1px 0   rgb(255 255 255 / 0.55),
        inset -1px -1px 1px 0 rgb(255 255 255 / 0.15),
        inset 0 0 0 1px       rgb(255 255 255 / 0.25);
    }

    :host([inline]) { display: inline-block; }

    :host::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      padding: 1px;
      background: linear-gradient(
        135deg,
        rgb(160 160 160 / 0.85) 0%,
        rgb(140 140 140 / 0.35) 25%,
        rgb(120 120 120 / 0.15) 50%,
        rgb(140 140 140 / 0.35) 75%,
        rgb(160 160 160 / 0.75) 100%
      );
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
              mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
              mask-composite: exclude;
      pointer-events: none;
      opacity: var(--glass-border-opacity);
      z-index: 1;
    }

    :host::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      opacity: var(--glass-noise-opacity);
      mix-blend-mode: var(--glass-noise-blend);
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
      background-size: 200px 200px;
      z-index: 2;
    }

    .inner {
      position: relative;
      z-index: 3;
      padding: var(--glass-padding);
      border-radius: inherit;
      box-sizing: border-box;

      display: flex;
      align-items: center;
    }

    /* ===== input 基础样式：浅色/深色通用，必须放在媒体查询外 ===== */
    .qg-1069027654-input {
      /* 1) 抹掉 UA 外观：去黑边、黑框、白底 */
      -webkit-appearance: none;
              appearance: none;
      margin: 0;
      border: 0;
      outline: none;
      background: transparent;
      box-shadow: none;


      /* 2) 铺满 .inner，不留缝 */
      display: block;
      flex: 1 1 auto;
      min-width: 0;
      box-sizing: border-box;

      /* 3) 内边距交给 .inner 的 --glass-padding 统一控制 */
      padding: 0;

      /* 4) 文字全部继承宿主 */
      font: inherit;
      color: inherit;
      line-height: normal;
      letter-spacing: inherit;
      caret-color: currentColor;

      /* 5) 移动端点击高亮去掉 */
      -webkit-tap-highlight-color: transparent;
    }

    .qg-1069027654-input::placeholder {
      color: currentColor;
      opacity: 0.5;
    }

    /* 聚焦不要浏览器默认黑框，由宿主玻璃描边提示即可 */
    .qg-1069027654-input:focus,
    .qg-1069027654-input:focus-visible {
      outline: none;
      box-shadow: none;
    }

    .qg-1069027654-input:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    /* 数字框上下箭头 / 搜索框的 × */
    .qg-1069027654-input::-webkit-outer-spin-button,
    .qg-1069027654-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .qg-1069027654-input[type="number"] { -moz-appearance: textfield; }
    .qg-1069027654-input::-webkit-search-cancel-button { display: none; }

    /* Chrome autofill 的黄底/黑底 */
    .qg-1069027654-input:-webkit-autofill,
    .qg-1069027654-input:-webkit-autofill:hover,
    .qg-1069027654-input:-webkit-autofill:focus {
      -webkit-text-fill-color: currentColor;
      transition: background-color 99999s ease-in-out 0s;
    }

    @supports not (
      (backdrop-filter: blur(1px)) or
      (-webkit-backdrop-filter: blur(1px))
    ) {
      :host {
        background-color: rgb(var(--glass-tint) / 0.72);
        box-shadow:
          0 8px 32px -12px rgb(0 0 0 / 0.18),
          inset 0 0 0 1px rgb(255 255 255 / 0.5);
      }
    }

    ::slotted([slot="prefix"]) {
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-inline-end: 8px;
      color: inherit;
      opacity: 0.7;
      pointer-events: none;   /* 点图标也能聚焦输入框；若图标可点击则删掉这行 */
    }

    @media (prefers-color-scheme: dark) {
      :host {
        --glass-tint-alpha: 0.06;
        --glass-text: #f5f5f5;
        box-shadow:
          0 8px 32px -12px rgb(0 0 0 / 0.55),
          0 4px 16px -8px  rgb(0 0 0 / 0.35),
          inset 1px 1px 1px 0   rgb(255 255 255 / 0.30),
          inset -1px -1px 1px 0 rgb(255 255 255 / 0.08),
          inset 0 0 0 1px       rgb(255 255 255 / 0.12);
      }
      :host::before {
        background: linear-gradient(
          135deg,
          rgb(255 255 255 / 0.55) 0%,
          rgb(255 255 255 / 0.10) 25%,
          rgb(255 255 255 / 0.02) 50%,
          rgb(255 255 255 / 0.10) 75%,
          rgb(255 255 255 / 0.45) 100%
        );
      }
      :host::after { opacity: calc(var(--glass-noise-opacity) * 0.6); }
    }
  </style>
  <div class="inner">
    <slot name="prefix"></slot>
    <input class="qg-1069027654-input" part="input" />
  </div>
`;

export class qgInput extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
    this._shadow.innerHTML = STYLES;
    this._input = this._shadow.querySelector('input');

    // 监听器只绑定一次，避免重复插入 DOM 时叠加
    this._input.addEventListener('input', () => {
      this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    });
    this._input.addEventListener('change', () => {
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    });
    this._input.addEventListener('focus', () => {
      this.dispatchEvent(new Event('focus', { bubbles: true, composed: true }));
    });
    this._input.addEventListener('blur', () => {
      this.dispatchEvent(new Event('blur', { bubbles: true, composed: true }));
    });
  }

  static get observedAttributes() {
    // 注意：已去掉 class / style / id，
    // 否则 <qg-input class="foo"> 会把内部 input 的 qg-1069027654-input 类覆盖掉，
    // 导致样式全部失效；外部样式请用 ::part(input) 定制。
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
      'tabindex'
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this._input) return;
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
    // 不再手动循环转发属性：
    // 元素升级时浏览器已对每个已有属性调用过 attributeChangedCallback，
    // 这里再循环会让属性被重复设置一次。
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

if (!customElements.get('qg-input')) {
  customElements.define('qg-input', qgInput);
}