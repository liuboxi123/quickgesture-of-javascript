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

const STYLES = `
  :host {
    --glass-blur: 28px;
    --glass-saturate: 170%;
    --glass-radius: 0;
    --glass-tint: 255 255 255;
    --glass-tint-alpha: 0.12;
    --glass-padding: 0px;
    --glass-shadow-strength: 1;
    --glass-border-opacity: 1;
    --glass-noise-opacity: 0.25;
    --glass-noise-blend: overlay;

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
      rgb(255 255 255 / 0.85) 0%,
      rgb(255 255 255 / 0.20) 25%,
      rgb(255 255 255 / 0.05) 50%,
      rgb(255 255 255 / 0.20) 75%,
      rgb(255 255 255 / 0.70) 100%
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

  @media (prefers-color-scheme: dark) {
    :host {
      --glass-tint-alpha: 0.06;
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
`;
let _sheet = null;
function getSheet() {
  if (!_sheet) {
    _sheet = new CSSStyleSheet();
    _sheet.replaceSync(STYLES);
  }
  return _sheet;
}

export class qgGlass2 extends HTMLElement {
  constructor() {
    super();
    if (this.childNodes.length > 0) {
      queueMicrotask(() => this._init());
    } else {
      this._init();
    }
  }

  _init() {
    if (this.shadowRoot) return;
    const shadow = this.attachShadow({ mode: 'open' });

    if ('adoptedStyleSheets' in ShadowRoot.prototype) {
      shadow.adoptedStyleSheets = [getSheet()];
    } else {
      const style = document.createElement('style');
      style.textContent = STYLES;
      shadow.appendChild(style);
    }

    const inner = document.createElement('div');
    inner.className = 'inner';
    inner.setAttribute('part', 'content');
    inner.appendChild(document.createElement('slot'));
    shadow.appendChild(inner);
  }
}

if (!customElements.get('qg-glass-2')) {
  customElements.define('qg-glass-2', qgGlass2);
}