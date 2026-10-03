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
 * Components suport
 */
/**
 * fast grid container 
 */
const grid = document.createElement('template');
grid.innerHTML = `
    <style>
        :host{  
            box-sizing: border-box;
            display: grid;
            grid-template-columns: repeat(var(--cols, 5), 1fr);
            grid-template-rows: repeat(var(--rows, auto), minmax(0, 1fr));
            gap: var(--gap, 12px);
            padding: var(--padding, 30px);
        }
        :host([hidden]) { display: none; }
        ::slotted(*) {
            min-width: 0;
            min-height: 0;
        }
    </style>
    <slot></slot>`;
class Grid extends HTMLElement{
    static get observedAttributes() {
        return ['cols', 'rows', 'gap'];
    }

    constructor(){
        super();
        const shadow = this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(grid.content.cloneNode(true));

    }
    connectedCallback() {
        this._syncStyles();
    }
    attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal !== newVal) this._syncStyles();
    }
    _syncStyles() {
    const style = this.shadowRoot.querySelector(':host')?.style ?? this.style;
        if (this.hasAttribute('cols')) {
            this.style.setProperty('--cols', this.getAttribute('cols'));
        }
        if (this.hasAttribute('rows')) {
            this.style.setProperty('--rows', this.getAttribute('rows'));
        }
        if (this.hasAttribute('gap')) {
            this.style.setProperty('--gap', this.getAttribute('gap'));
        }
    }
    get cols() { return Number(this.getAttribute('cols')) || 3; }
    set cols(v) { this.setAttribute('cols', String(v)); }

    get rows() { return this.getAttribute('rows') || 'auto'; }
    set rows(v) { this.setAttribute('rows', String(v)); }

    get gap() { return this.getAttribute('gap') || '8px'; }
    set gap(v) { this.setAttribute('gap', String(v)); }

    get padding() { return this.getAttribute('padding') || '30px'; }
    set padding(v) { this.setAttribute('padding', String(v)); }
}

/**
 * liquid glass 
 */
class QSLiquidGlass extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                position: relative;
                border-radius: 20px;
                width: 300px;
                height: 200px;
                --qs-glass-bg: rgba(255, 255, 255, 0.08);
                --qs-glass-border: rgba(255, 255, 255, 0.2);
                --qs-glass-highlight: rgba(255, 255, 255, 0.35);
                --qs-glass-shadow: rgba(0, 0, 0, 0.25);
                --qs-liquid-speed: 8s;
                --qs-radius: inherit;
            }

            .glass-panel {
                position: relative;
                width: 100%;
                height: 100%;
                border-radius: var(--qs-radius, inherit);
                background: var(--qs-glass-bg);
                backdrop-filter: blur(24px) saturate(1.4);
                -webkit-backdrop-filter: blur(24px) saturate(1.4);
                border: 1px solid var(--qs-glass-border);
                box-shadow:
                    0 8px 32px rgba(0, 0, 0, 0.3),
                    0 2px 8px rgba(0, 0, 0, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.25),
                    inset 0 -1px 0 rgba(255, 255, 255, 0.05);
                overflow: hidden;
                z-index: 1;
            }

            .liquid-layer {
                position: absolute;
                inset: 0;
                border-radius: inherit;
                pointer-events: none;
                overflow: hidden;
                z-index: 2;
            }

            .liquid-layer::before {
                content: '';
                position: absolute;
                width: 200%;
                height: 200%;
                top: -50%;
                left: -50%;
                background: radial-gradient(ellipse at 30% 30%,
                        rgba(255, 255, 255, 0.12) 0%,
                        transparent 45%),
                    radial-gradient(ellipse at 70% 60%,
                        rgba(96, 165, 250, 0.15) 0%,
                        transparent 50%),
                    radial-gradient(ellipse at 50% 80%,
                        rgba(167, 139, 250, 0.15) 0%,
                        transparent 40%);
                animation: gentleFlow 8s ease-in-out infinite alternate;
                mix-blend-mode: soft-light;
                border-radius: inherit;
            }

            .liquid-layer::after {
                content: '';
                position: absolute;
                width: 120%;
                height: 120%;
                top: -10%;
                left: -10%;
                background: radial-gradient(circle at 40% 45%,
                        rgba(244, 114, 182, 0.08) 0%,
                        transparent 50%),
                    radial-gradient(circle at 60% 55%,
                        rgba(96, 165, 250, 0.1) 0%,
                        transparent 45%);
                animation: gentleShift 10s ease-in-out infinite alternate;
                mix-blend-mode: overlay;
                border-radius: inherit;
            }

            @keyframes gentleFlow {
                0% {
                    transform: translate(-5%, -3%) scale(1.0);
                    opacity: 0.7;
                }
                50% {
                    transform: translate(5%, 3%) scale(1.05);
                    opacity: 1;
                }
                100% {
                    transform: translate(-3%, 2%) scale(0.98);
                    opacity: 0.75;
                }
            }

            @keyframes gentleShift {
                0% {
                    transform: translate(0%, 0%) scale(1);
                    opacity: 0.6;
                }
                33% {
                    transform: translate(4%, -2%) scale(1.1);
                    opacity: 0.9;
                }
                66% {
                    transform: translate(-2%, 3%) scale(1.0);
                    opacity: 0.7;
                }
                100% {
                    transform: translate(0%, 0%) scale(1.05);
                    opacity: 0.8;
                }
            }

            .glass-panel::before {
                content: '';
                position: absolute;
                top: 0;
                left: 12%;
                right: 12%;
                height: 1.5px;
                background: linear-gradient(90deg,
                    transparent 0%,
                    rgba(255, 255, 255, 0.6) 30%,
                    rgba(255, 255, 255, 0.8) 50%,
                    rgba(255, 255, 255, 0.6) 70%,
                    transparent 100%);
                border-radius: 50%;
                z-index: 4;
                pointer-events: none;
            }
            .glass-panel::after {
                content: '';
                position: absolute;
                bottom: -3px;
                left: 20%;
                right: 20%;
                height: 12px;
                border-radius: 50%;
                background: radial-gradient(ellipse at center,
                    rgba(96, 165, 250, 0.25) 0%,
                    transparent 70%);
                filter: blur(8px);
                z-index: -1;
                transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
                pointer-events: none;
            }

            .content-slot {
                position: relative;
                z-index: 3;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
            }

            @supports not (backdrop-filter: blur(24px)) {
                .glass-panel {
                    background: rgba(30, 30, 50, 0.85);
                }
            }
        `;

        const container = document.createElement('div');
        container.className = 'glass-panel';

        const liquidLayer = document.createElement('div');
        liquidLayer.className = 'liquid-layer';

        const contentSlot = document.createElement('div');
        contentSlot.className = 'content-slot';
        contentSlot.innerHTML = '<slot></slot>';

        container.appendChild(liquidLayer);
        container.appendChild(contentSlot);

        shadow.appendChild(style);
        shadow.appendChild(container);

        this._syncRadius = () => {
            const computedRadius = getComputedStyle(this).borderRadius;
            if (computedRadius && computedRadius !== '0px') {
                container.style.setProperty('--qs-radius', computedRadius);
            } else {
                container.style.setProperty('--qs-radius', '20px');
            }
        };
    }

    connectedCallback() {
        this._syncRadius();
        if (window.ResizeObserver) {
            this._resizeObserver = new ResizeObserver(() => this._syncRadius());
            this._resizeObserver.observe(this);
        }
        this._mutationObserver = new MutationObserver(() => this._syncRadius());
        this._mutationObserver.observe(this, { attributes: true, attributeFilter: ['style', 'class'] });
    }

    disconnectedCallback() {
        if (this._resizeObserver) this._resizeObserver.disconnect();
        if (this._mutationObserver) this._mutationObserver.disconnect();
    }
}

/**
 * slider
 */
class QsSlider extends HTMLElement {
  static get observedAttributes() { return ['value', 'max', 'orientation']; }

  constructor() {
    super();
    this._value = 50;
    this._max = 100;
    this._orientation = 'horizontal';
    this._dragging = false;
    this._moved = false;
    this._startPos = 0;
    this._stretchRatio = 0;
    this._releaseTimer = null;
    this._attachShadow();
  }

  connectedCallback() {
    this._bindEvents();
    this._updateUI();
  }

  disconnectedCallback() {
    this._unbindEvents();
    clearTimeout(this._releaseTimer);
  }

  attributeChangedCallback(name, _, val) {
    if (name === 'value') {
      this._value = Math.min(this._max, Math.max(0, Number(val) || 0));
      this._updateUI();
    } else if (name === 'max') {
      this._max = Number(val) || 100;
      this._updateUI();
    } else if (name === 'orientation') {
      this._orientation = val === 'vertical' ? 'vertical' : 'horizontal';
      this._updateUI();
    }
  }

  get value() { return this._value; }
  set value(v) {
    this._value = Math.min(this._max, Math.max(0, Number(v) || 0));
    this.setAttribute('value', this._value);
    this._updateUI();
  }

  get max() { return this._max; }
  set max(v) { this.setAttribute('max', v); }

  get orientation() { return this._orientation; }
  set orientation(v) { this.setAttribute('orientation', v); }

  _attachShadow() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          overflow: hidden;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        :host(:not([orientation="vertical"])) {
          width: 100%;
          height: 48px;
          border-radius: 24px;
          background: rgba(255,255,255,0.12);
        }
        :host(:not([orientation="vertical"])) .fill {
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 50%;
          border-radius: 0px;
          background: var(--qs-fill, rgba(255,255,255,0.9));
          transition: width 0.06s linear;
          will-change: width;
        }
        :host(:not([orientation="vertical"])) .content {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          padding: 0 16px;
          pointer-events: none;
          z-index: 1;
        }
        :host([orientation="vertical"]) {
          width: 48px;
          height: 200px;
          border-radius: 24px;
          background: rgba(255,255,255,0.12);
        }
        :host([orientation="vertical"]) .fill {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: 50%;
          border-radius: 0px;
          background: var(--qs-fill, rgba(255,255,255,0.9));
          transition: height 0.06s linear;
          will-change: height;
        }
        :host([orientation="vertical"]) .content {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 0 0 12px 0;
          pointer-events: none;
          z-index: 1;
        }

        :host(.dragging) .fill { transition: none; }
        :host(.releasing) .fill {
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        ::slotted([slot="icon"]) {
          width: 22px;
          height: 22px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>
      <div class="fill"></div>
      <div class="content">
        <slot name="icon"></slot>
      </div>
    `;
    this._fill = shadow.querySelector('.fill');
  }

  _bindEvents() {
    this._onDown = this._handleDown.bind(this);
    this._onMove = this._handleMove.bind(this);
    this._onUp   = this._handleUp.bind(this);
    // this.addEventListener('pointerdown', (e) => e.stopPropagation(), { capture: true });
    // this.addEventListener('pointermove', (e) => e.stopPropagation(), { capture: true });
    // this.addEventListener('pointerup', (e) => e.stopPropagation(), { capture: true });

    this.addEventListener('pointerdown', this._onDown);
    this.addEventListener('pointermove', this._onMove);
    this.addEventListener('pointerup',   this._onUp);
  }

  _unbindEvents() {
    this.removeEventListener('pointerdown', this._onDown);
    this.removeEventListener('pointermove', this._onMove);
    this.removeEventListener('pointerup',   this._onUp);
  }

  _isVertical() {
    return this._orientation === 'vertical';
  }

  _getPos(e) {
    // 竖向时取 Y 坐标，横向时取 X 坐标
    return this._isVertical() ? e.clientY : e.clientX;
  }

  _handleDown(e) {
    // console.log('slider pointerdown', e.pointerId);
    e.preventDefault();
    this._dragging = true;
    this._moved = false;
    this._startPos = this._getPos(e);
    this.classList.remove('releasing');
    this.setPointerCapture(e.pointerId);
  }

  _handleMove(e) {
    // console.log('slider pointermove', e.clientY);
    if (!this._dragging) return;
    const currentPos = this._getPos(e);
    const dx = Math.abs(currentPos - this._startPos);

    if (!this._moved && dx > 3) {
      this._moved = true;
      this.classList.add('dragging');
    }
    if (!this._moved) return;

    const rect = this.getBoundingClientRect();
    let ratio;

    if (this._isVertical()) {
      // 竖向：从底部算起，越往上值越大
      ratio = (rect.bottom - e.clientY) / rect.height;
    } else {
      // 横向：从左往右
      ratio = (e.clientX - rect.left) / rect.width;
    }

    ratio = Math.min(1, Math.max(0, ratio));
    this._value = Math.round(ratio * this._max);
    this._stretchRatio = ratio > 0.95 ? (ratio - 0.95) / 0.05 : 0;
    this._updateUI();
  }

  _handleUp(e) {
    if (!this._dragging) return;
    this._dragging = false;
    this.classList.remove('dragging');
    try { this.releasePointerCapture(e.pointerId); } catch (_) {}

    if (!this._moved) return;

    if (this._stretchRatio > 0) {
      this._stretchRatio = 0;
      this.classList.add('releasing');
      this._updateUI();
      clearTimeout(this._releaseTimer);
      this._releaseTimer = setTimeout(() => this.classList.remove('releasing'), 350);
    }

    if (navigator.vibrate) navigator.vibrate(5);
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this._value, percent: Math.round((this._value / this._max) * 100) },
      bubbles: true,
      composed: true,
    }));
  }

  _updateUI() {
    const pct = this._max > 0 ? (this._value / this._max) * 100 : 0;
    const stretchExtra = this._stretchRatio * 8;
    const finalPct = Math.min(pct + stretchExtra, 108);

    if (this._isVertical()) {
      this._fill.style.height = finalPct + '%';
      this._fill.style.width = '';
    } else {
      this._fill.style.width = finalPct + '%';
      this._fill.style.height = '';
    }
  }
}

/**
 * Components defind
 */
// fast grid container
customElements.define('qs-grid', Grid);
/* <qs-grid cols="5" rows="7" gap="15px" padding="30px"></qs-grid> */
// liquid-glass
customElements.define('qs-liquid-glass', QSLiquidGlass);
/* <qs-liquid-glass>
    <div>
        <small>liquid glass</small>
    </div>
</qs-liquid-glass> */
// slider
customElements.define('qs-slider', QsSlider);
{/* <qs-slider orientation="vertical" id="volume" value="40" max="100">
    <svg slot="icon" viewBox="0 0 24 24" fill="#000">
        <path d="..."/>
    </svg>
</qs-slider> */}
