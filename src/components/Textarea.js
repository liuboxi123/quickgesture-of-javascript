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
 * textarea
 */

const STYLES = `
  <style>
    :host {
      display: block;
      box-sizing: border-box;
    }

    .qg-1069027654-textarea {
      display: block;
      width: 100%;
      box-sizing: border-box;
      margin: 0;
      padding: 0;

      /* 无外边框 / 无焦点框 / 透明背景 */
      border: 0;
      outline: none;
      background: transparent;
      box-shadow: none;

      /* 不允许用户拉伸，也不出现滚动条（靠自动增高） */
      resize: none;
      overflow: hidden;

      /* 文字全部继承宿主 */
      font: inherit;
      color: inherit;
      line-height: 1.5;
      letter-spacing: inherit;
      caret-color: currentColor;

      /* 现代浏览器：原生内容驱动尺寸（Chrome 123+ / Safari 17.4+） */
      field-sizing: content;
      min-height: 1lh;
    }

    .qg-1069027654-textarea::placeholder {
      color: currentColor;
      opacity: 0.5;
    }

    .qg-1069027654-textarea:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    /* 可选：宽度也随内容自适应（依赖 field-sizing） */
    :host([fit]) .qg-1069027654-textarea {
      width: auto;
      min-width: 1ch;
      max-width: 100%;
    }
  </style>
  <textarea class="qg-1069027654-textarea" part="textarea"></textarea>
`;

/* field-sizing 能力检测（只算一次） */
let _fsSupported;
function supportsFieldSizing() {
  if (_fsSupported === undefined) {
    try {
      _fsSupported = typeof CSS !== 'undefined' && !!CSS.supports &&
        CSS.supports('field-sizing', 'content');
    } catch {
      _fsSupported = false;
    }
  }
  return _fsSupported;
}

export class qgTextarea extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
    this._shadow.innerHTML = STYLES;
    this._textarea = this._shadow.querySelector('textarea');
    this._lastWidth = -1;
    this._ro = null;

    this._textarea.addEventListener('input', () => {
      this._resizeIfNeeded();
      this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    });
    this._textarea.addEventListener('change', () => {
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    });
    this._textarea.addEventListener('focus', () => {
      this.dispatchEvent(new Event('focus', { bubbles: true, composed: true }));
    });
    this._textarea.addEventListener('blur', () => {
      this.dispatchEvent(new Event('blur', { bubbles: true, composed: true }));
    });
  }

  static get observedAttributes() {
    return [
      'value', 'placeholder', 'disabled', 'readonly', 'required',
      'name', 'maxlength', 'minlength', 'rows', 'cols', 'wrap',
      'autocomplete', 'autofocus', 'spellcheck',
      'aria-label', 'aria-labelledby', 'aria-describedby',
      'title', 'tabindex'
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this._textarea) return;

    if (name === 'value') {
      this._textarea.value = newValue ?? '';
      this._resizeIfNeeded();
      return;
    }

    const booleanAttrs = new Set(['disabled', 'readonly', 'required', 'autofocus']);
    if (booleanAttrs.has(name)) {
      if (newValue === null) this._textarea.removeAttribute(name);
      else this._textarea.setAttribute(name, '');
    } else if (newValue === null) {
      this._textarea.removeAttribute(name);
    } else {
      this._textarea.setAttribute(name, newValue);
    }

    this._resizeIfNeeded();
  }

  connectedCallback() {
    // 支持 <qg-textarea>初始文本</qg-textarea> 作为初始 value
    if (!this.hasAttribute('value') && this.textContent.trim()) {
      this._textarea.value = this.textContent.trim();
    }

    if (!supportsFieldSizing()) {
      // 容器宽度变化会导致换行变化 → 高度需重算；只对宽度变化响应，避免自触发循环
      this._ro = new ResizeObserver((entries) => {
        const w = entries[0].contentRect.width;
        if (w !== this._lastWidth) {
          this._lastWidth = w;
          this._resize();
        }
      });
      this._ro.observe(this);
    }

    this._resizeIfNeeded();
    // 首次布局完成后再校正一次（处理 display:none 挂载的情况）
    requestAnimationFrame(() => this._resizeIfNeeded());
  }

  disconnectedCallback() {
    this._ro?.disconnect();
    this._ro = null;
    this._lastWidth = -1;
  }

  _resizeIfNeeded() {
    if (!supportsFieldSizing()) this._resize();
  }

  _resize() {
    const el = this._textarea;
    el.style.height = 'auto';                 // 先归零才能拿到真实 scrollHeight
    el.style.height = el.scrollHeight + 'px'; // border-box 下 scrollHeight 含 padding
  }

  get value() {
    return this._textarea.value;
  }
  set value(v) {
    this._textarea.value = v;
    this._resizeIfNeeded();
  }

  focus()  { this._textarea.focus(); }
  blur()   { this._textarea.blur(); }
  select() { this._textarea.select(); }
}

if (!customElements.get('qg-textarea')) {
  customElements.define('qg-textarea', qgTextarea);
}