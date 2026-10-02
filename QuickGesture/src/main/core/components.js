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
import { gestureListenerExp, isKeyDown, wheelLisenter } from './index-export.js';
import { elUnfoldAnimationExp, elFoldAnimationExp } from './index-export.js';
import { addEaseAnimationExp } from './index-export.js';
import { draggableElementExp } from './index-export.js';
import { pinchInOrOutOfTwoFingersLisenterExp } from './index-export.js';
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
 * Ground glass 
 */
class qgGroundGlass extends HTMLElement {
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
                --qg-glass-bg: rgba(255, 255, 255, 0.08);
                --qg-glass-border: rgba(255, 255, 255, 0.2);
                --qg-glass-highlight: rgba(255, 255, 255, 0.35);
                --qg-glass-shadow: rgba(0, 0, 0, 0.25);
                --qg-liquid-speed: 8s;
                --qg-radius: inherit;
            }

            .glass-panel {
                position: relative;
                width: 100%;
                height: 100%;
                border-radius: var(--qg-radius, inherit);
                background: var(--qg-glass-bg);
                backdrop-filter: blur(24px) saturate(1.4);
                -webkit-backdrop-filter: blur(24px) saturate(1.4);
                border: 1px solid var(--qg-glass-border);
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
                container.style.setProperty('--qg-radius', computedRadius);
            } else {
                container.style.setProperty('--qg-radius', '20px');
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
class qgSlider extends HTMLElement {
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
          height: 200px;
          width: 50px;
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
          background: var(--qg-fill, rgba(255,255,255,0.9));
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
          background: var(--qg-fill, rgba(255,255,255,0.9));
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
 * app card
 */
class qgAppCard extends HTMLElement {
  static get observedAttributes() {
    return ['height', 'width', 'fold'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: var(--card-width);
          height: var(--card-height);
          border-radius: 12px;
          box-sizing: border-box;
          overflow: hidden;
          transition: transform 0.5s ease-out, width 0.5s ease-out, height 0.5s ease-out;
        }
        .app-card {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        ::slotted([slot="icon"]) {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 12px;
        }
      </style>
      <div class="app-card">
        <slot name="icon"></slot>
        <slot></slot>
      </div>
    `;
    this._updateSize();
    this._clickAppCard();
    this._initialized = false;
    this._isUnfolded = this.getAttribute('fold') !== 'true';
  }
  connectedCallback(){
    this._initialized = true;
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if(name === 'fold'){
      if (!this._initialized) {
        this._isUnfolded = newValue !== 'true';
        return;
      }
      if(newValue === 'true'){
        elFoldAnimationExp(this);
        setTimeout(()=>{ this._isUnfolded = false; },300);
        
        let iconEl = this.querySelector('[slot="icon"]');
        iconEl.style.display = 'block';
        iconEl.style.transition = 'all 0.3s ease';
        iconEl.style.opacity = '1';
        // let defaultSlot = this.shadowRoot.querySelector('slot:not([name])');
        // console.log(defaultSlot);
        // setTimeout(()=>{
        //   Array.from(this.children).forEach(child => {
        //     if (!child.hasAttribute('slot')) {
        //       child.style.display = 'none';
        //     }
        //   });
        // },300);
      }else{
        elUnfoldAnimationExp(this);
        this._isUnfolded = true;
      }

      this.dispatchEvent(new CustomEvent('foldchange', {
        detail: { fold: newValue === 'true' },
        bubbles: true,
        composed: true,
      }));

      return;
    }
    
    if (oldValue !== newValue) {
      this._updateSize();
    }
  }

  _updateSize() {
    this.style.setProperty('--card-width', this.width);
    this.style.setProperty('--card-height', this.height);
  }

  get height() {
    return this.getAttribute('height');
  }

  set height(height) {
    this.setAttribute('height', height);
  }

  get width() {
    return this.getAttribute('width');
  }

  set width(width) {
    this.setAttribute('width', width);
  }
  _clickAppCard() {
    this.addEventListener('click', () => {
      // console.log(this._isUnfolded);
      if(this._isUnfolded === true) return;
      let iconEl = this.querySelector('[slot="icon"]');
      // elUnfoldAnimationExp(this);
      console.log(iconEl);
      addEaseAnimationExp(iconEl);
      iconEl.style.opacity = '0';
      this.setAttribute('fold', 'false');
      setTimeout(()=>{ iconEl.style.display = 'none'; },300);
    });
  }
  
}

/**
 * image vector
 */
class qgImageVector extends HTMLElement {
  static get observedAttributes() {
    return ['src'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (this.shadowRoot.firstChild) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          overflow: hidden;
        }
        #image-vector-content {
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        #image-vector-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          pointer-events: none;
        }
        #image-vector-preview {
          height: 100%;
          width: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-color: #c6c6c6;
        }
        #image-vector-drag-block{
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        #app-card{
          width: 100%;
          height: 100%;
        }
        #image-vector-top-bar{
          width: 100%;
          height: 10vh;
          position: absolute;
          top: 0;
          left: 0;
          display: none;
          z-index: 9999999;
          align-items: center;
          justify-content: center;
        }
        #image-vector-bottom-bar{
          width: 100%;
          height: 10vh;
          position: absolute;
          bottom: 0;
          left: 0;
          display: none;
          z-index: 9999999;
          align-items: center;
          justify-content: center;
        }
        .image-vector-btn{
          background-color: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(10px);                 
          -webkit-backdrop-filter: blur(10px); 
          width: min(10vw, 45px);
          height: min(10vw, 45px);
          border-radius: 50%;
        }
        .image-vector-btn-top-island{
          background-color: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(10px);                 
          -webkit-backdrop-filter: blur(10px); 
          width: min(30vw, 100px);
          height: min(10vw, 45px);
          border-radius: 1000px;
          margin-left: 10px;
        }
        .image-vector-btn-bottom-island{
          background-color: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(10px);                 
          -webkit-backdrop-filter: blur(10px); 
          width: min(40vw, 150px);
          height: min(10vw, 45px);
          border-radius: 1000px;
          margin-left: 10px;
        }
        .image-vector-back-icon{
          color: rgba(66, 64, 64, 0.5);
        }
      </style>

      <qg-app-card fold="true" id="app-card">
        <div slot="icon" id="image-vector-preview"></div>
        <div id="image-vector-content">
          <div id="image-vector-top-bar">
            <div class="image-vector-btn" id="image-vector-return-btn">
              <svg class="image-vector-back-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                <path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="image-vector-btn-top-island" id="image-vector-more-btn"></div>
          </div>
          <div id="image-vector-bottom-bar">
            <div class="image-vector-btn-bottom-island" id="image-vector-download-btn"></div>
          </div>
          <div id="image-vector-drag-block">
            <img src="" alt="" id="image-vector-img">
          </div>
        </div>
      </qg-app-card>
    `;
    this._syncSrc();
    this._draggable();
    this._initBtn();
    this._addFoldLisenter();
  }
  _initBtn(){
    const returnBtn = this.shadowRoot.querySelector('#image-vector-return-btn');
    this.shadowRoot.querySelector('#image-vector-download-btn');
    const dragBlock = this.shadowRoot.querySelector('#image-vector-drag-block');
    
    returnBtn.addEventListener('click', () => {
      const appCard = this.shadowRoot.querySelector('#app-card');
      appCard.setAttribute('fold', 'true');
    });
  }
  _addFoldLisenter() {
    const topBar = this.shadowRoot.querySelector('#image-vector-top-bar');
    const bottomBar = this.shadowRoot.querySelector('#image-vector-bottom-bar');
    const card = this.shadowRoot.querySelector('#app-card');

    const isFolded = card.getAttribute('fold') === 'true';
    topBar.style.display = isFolded ? 'none' : 'block';
    bottomBar.style.display = isFolded ? 'none' : 'block';

    card.addEventListener('foldchange', (e) => {
      if (e.detail.fold) {
        topBar.style.display = 'none';
        bottomBar.style.display = 'none';
      } else {
        topBar.style.display = 'flex';
        bottomBar.style.display = 'flex';
      }
    });
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'src' && oldValue !== newValue) {
      this._syncSrc();
    }
  }
   _syncSrc() {
    const src = this.getAttribute('src');
    const img = this.shadowRoot.querySelector('#image-vector-img');
    const preview = this.shadowRoot.querySelector('#image-vector-preview');
    if (img) img.src = src || '';
    if (preview) {
      if(src){
        preview.style.backgroundImage = `url('${src}')`;
      }else{
        preview.style.backgroundImage = '';
      }
    }
  }
  _draggable() {
    const dragBlock = this.shadowRoot.querySelector('#image-vector-drag-block');
    if (!dragBlock) return;

    let scale = 1;
    const MIN_SCALE = 0.2;
    const MAX_SCALE = 5;
    const SCALE_STEP = 0.1;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let translateX = 0;
    let translateY = 0;

    const updateTransform = () => {
      dragBlock.style.transform =
        `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    };

    dragBlock.addEventListener(
      'wheel',
      (e) => {
        if (!e.ctrlKey) return;
        e.preventDefault();

        if (e.deltaY < 0) {
          scale = Math.min(scale + SCALE_STEP, MAX_SCALE);
        } else {
          scale = Math.max(scale - SCALE_STEP, MIN_SCALE);
        }

        updateTransform();
      },
      { passive: false }
    );

    dragBlock.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      dragBlock.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      updateTransform();
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        dragBlock.style.cursor = 'grab';
      }
    });

    dragBlock.addEventListener(
      'touchstart',
      (e) => {
        const touch = e.touches[0];
        isDragging = true;
        startX = touch.clientX - translateX;
        startY = touch.clientY - translateY;
      },
      { passive: true }
    );

    dragBlock.addEventListener(
      'touchmove',
      (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        translateX = touch.clientX - startX;
        translateY = touch.clientY - startY;
        updateTransform();
      },
      { passive: true }
    );

    dragBlock.addEventListener('touchend', () => {
      isDragging = false;
    });

    dragBlock.style.transformOrigin = 'center center';
    dragBlock.style.cursor = 'grab';
    dragBlock.style.willChange = 'transform';
  }
  get src(){
    return this.getAttribute('src');
  }
  set src(val){
    this.setAttribute('src', val);
  }
}

/**
 * draggble element
 */
class qgDraggbleElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
      </style>
      <div>
        <slot></slot>
      </div>
    `;
    this._draggble();
  }
  
  _draggble(){
    draggableElementExp(this);
  }
}

/**
 * siderbar
 */

class qgLeftSiderbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 9999999;
          transition: transform 0.3s ease;
          transform: translateX(-100%);
        }
        #siderbar {
          width: 100%;
          height: 100%;
          touch-action: none;
        }
      </style>
      <div id="siderbar">
        <slot></slot>
      </div>
    `;

    this._isDragging = false;
    this._startX = 0;
    this._currentX = 0;
    this._hiddenWatcher = null;
    this._contentMove = null;
    this._contentUp = null;
    this.onSettled = null;
    this._exitSiderbar();
    this._bannedSlotBubbing();
  }
  _bannedSlotBubbing() {
    this.shadowRoot.querySelector('slot').addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  _exitSiderbar() {
    console.log(this.shadowRoot.querySelector('#siderbar'));
    // this.shadowRoot.querySelector('#siderbar').addEventListener('click', () => {
    //   console.log('click shade');
    //   this.close();
    // });
  }

  connectedCallback() {
    requestAnimationFrame(() => {
      this._initPosition();
      this._bindContentDrag();
      this._bindHiddenWatcher();
    });
  }

  disconnectedCallback() {
    this._unbindHiddenWatcher();
    if (this._contentMove) {
      window.removeEventListener('pointermove', this._contentMove);
    }
    if (this._contentUp) {
      window.removeEventListener('pointerup', this._contentUp);
    }
  }

  _initPosition() {
    const width = this.offsetWidth;
    this._currentX = -width;
    this.style.transform = `translateX(${-width}px)`;
  }

  _bindContentDrag() {
    const siderbar = this.shadowRoot.querySelector('#siderbar');
    if (!siderbar) return;

    siderbar.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this._isDragging = true;
      this._startX = e.clientX - this._currentX;
      this.style.transition = 'none';
      this.setPointerCapture(e.pointerId);
    });

    this._contentMove = (e) => {
      if (!this._isDragging) return;
      const width = this.offsetWidth;
      let x = e.clientX - this._startX;
      x = Math.max(-width, Math.min(0, x));
      this._currentX = x;
      this.style.transform = `translateX(${x}px)`;
    };

    this._contentUp = (e) => {
      if (!this._isDragging) return;
      this._isDragging = false;
      this.releasePointerCapture(e.pointerId);
      this.style.transition = 'transform 0.3s ease';
      this._snap();
    };

    this.addEventListener('pointerleave', (e) => {
      if (!this._isDragging) return;
      this._isDragging = false;
      this.releasePointerCapture(e.pointerId);
      this.style.transition = 'transform 0.3s ease';
      this._snap();
    });

    window.addEventListener('pointermove', this._contentMove);
    window.addEventListener('pointerup', this._contentUp);
  }

  _snap() {
    const width = this.offsetWidth;
    const wasOpen = this._currentX === 0;

    if (this._currentX < -width / 2) {
      this._currentX = -width;
    } else {
      this._currentX = 0;
    }

    const isOpen = this._currentX === 0;
    this.style.transform = `translateX(${this._currentX}px)`;
    this._syncHiddenWatcher();

    if (isOpen !== wasOpen) {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;

        if (isOpen) {
          // this.open();
          // const shade = document.createElement('div');
          // shade.id = 'qgsiderbarshade';
          // shade.style.cssText = `
          //   position: fixed; top: 0; left: 0;
          //   width: 100vw; height: 100vh;
          //   background: rgba(0,0,0,0.7);
          //   z-index: 9999998;
          // `;
          // shade.addEventListener('click', () => this.close());
          // document.body.appendChild(shade);
        } else if(!isOpen) {
          // document.getElementById('qgsiderbarshade')?.remove();
          // this._closeShade();
        }

        if (typeof this.onSettled === 'function') {
          this.onSettled(isOpen);
        }
      };

      const handler = () => {
        this.removeEventListener('transitionend', handler);
        finish();
      };
      this.addEventListener('transitionend', handler);

    }
  }

  _isHidden() {
    const width = this.offsetWidth;
    if (width === 0) return true;
    return this._currentX <= -width + 2;
  }

  _bindHiddenWatcher() {
    this._hiddenWatcher = (e) => {
      if (this._isDragging) return;
      this._isDragging = true;
      this._startX = e.clientX - this._currentX;
      this.style.transition = 'none';

      const move = (ev) => {
        if (!this._isDragging) return;
        const width = this.offsetWidth;
        let x = ev.clientX - this._startX;
        x = Math.max(-width, Math.min(0, x));
        this._currentX = x;
        this.style.transform = `translateX(${x}px)`;
      };

      const up = () => {
        this._isDragging = false;
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        this.style.transition = 'transform 0.3s ease';
        this._snap();
      };

      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
    };

    document.addEventListener('pointerdown', this._hiddenWatcher);
    this._syncHiddenWatcher();
  }

  _unbindHiddenWatcher() {
    if (this._hiddenWatcher) {
      document.removeEventListener('pointerdown', this._hiddenWatcher);
      this._hiddenWatcher = null;
    }
  }

  _syncHiddenWatcher() {
    if (this._isHidden()) {
      if (!this._hiddenWatcher) { // pack up
        this._shadeOp(true);
        this._bindHiddenWatcher();
      }
    } else { // unfold
      this._shadeOp(false);
      this._unbindHiddenWatcher();
    }
  }
  _shadeOp(isRemove) {
    if (isRemove === true) {
      const shade = document.getElementById('qgsiderbarshade');
      if (!shade) return;

      shade.style.opacity = '0';
      shade.style.transition = 'opacity 0.3s ease';

      shade.addEventListener('transitionend', () => {
        shade.remove();
      }, { once: true });
    } else {
      if (document.getElementById('qgsiderbarshade')) {
        return;
      }

      const shade = document.createElement('div');
      shade.id = 'qgsiderbarshade';
      shade.style.height = '100vh';
      shade.style.width = '100vw';
      shade.style.backgroundColor = 'rgba(0,0,0,0.7)';
      shade.style.position = 'fixed';
      shade.style.top = '0';
      shade.style.left = '0';
      shade.style.zIndex = '9999998';
      shade.style.opacity = '0';
      shade.style.transition = 'opacity 0.3s ease';

      shade.addEventListener('click', () => {
        this.close();
      });

      document.body.appendChild(shade);

      requestAnimationFrame(() => {
        shade.style.opacity = '1';
      });
    }
  }
  open() {
    const width = this.offsetWidth;
    if (this._currentX === 0) {
      this.style.transition = 'none';
      this._currentX = -width;
      this.style.transform = `translateX(${-width}px)`;
      void this.offsetHeight;
      this.style.transition = 'transform 0.3s ease';
    }
    this._currentX = 0;
    this.style.transform = 'translateX(0)';
    this._syncHiddenWatcher();
    
  }
  close() {
    const width = this.offsetWidth;
    this._currentX = -width;
    this.style.transition = 'transform 0.3s ease';
    this.style.transform = `translateX(${-width}px)`;
    this._syncHiddenWatcher();
  }
}

/**
 * vertical rolling box
 */
class qgVerticalRollingBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          overflow: hidden;
          position: relative;
          height: 100%;
          cursor: grab;
          touch-action: none;
          user-select: none;
        }
        :host(:active) {
          cursor: grabbing;
        }
        #inner-vertical-rolling-box {
          width: 100%;
          transition: transform 0.3s ease;
          will-change: transform;
        }
        #inner-vertical-rolling-box.dragging {
          transition: none;
        }
      </style>
      <div id="inner-vertical-rolling-box">
        <slot></slot>
      </div>
    `;

    this._offsetY = 0;
    this._isDragging = false;
    this._startY = 0;
    this._startOffsetY = 0;
    this._contentMove = null;
    this._contentUp = null;
  }

  connectedCallback() {
    requestAnimationFrame(() => {
      this._mouseScroll();
      this._draggable();
    });
  }

  disconnectedCallback() {
    this._unbindDragEvents();
  }

  _draggable() {
    const innerBox = this.shadowRoot.querySelector('#inner-vertical-rolling-box');
    if (!innerBox) return;

    innerBox.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button, a, input, select, textarea, [role="button"]')) {
        return;
      }

      this._isDragging = true;
      this._startY = e.clientY;
      this._startOffsetY = this._offsetY;
      innerBox.classList.add('dragging');

      try {
        this.setPointerCapture(e.pointerId);
      } catch {}
    });

    this._contentMove = (e) => {
      if (!this._isDragging) return;

      const deltaY = e.clientY - this._startY;

      if (Math.abs(deltaY) < 5) return;

      this._offsetY = this._startOffsetY + deltaY;

      const maxOffset = 0;
      const minOffset = -(innerBox.scrollHeight - this.offsetHeight);
      this._offsetY = Math.max(minOffset, Math.min(maxOffset, this._offsetY));

      innerBox.style.transform = `translateY(${this._offsetY}px)`;
    };

    this._contentUp = () => {
      if (!this._isDragging) return;

      this._isDragging = false;
      innerBox.classList.remove('dragging');

      try {
        this.releasePointerCapture(this._currentPointerId);
      } catch {}
      innerBox.style.transform = `translateY(${this._offsetY}px)`;
    };

    document.addEventListener('pointermove', this._contentMove);
    document.addEventListener('pointerup', this._contentUp);
    document.addEventListener('pointercancel', this._contentUp);

    innerBox.addEventListener('dragstart', (e) => e.preventDefault());
  }

  _unbindDragEvents() {
    if (this._contentMove) {
      document.removeEventListener('pointermove', this._contentMove);
    }
    if (this._contentUp) {
      document.removeEventListener('pointerup', this._contentUp);
      document.removeEventListener('pointercancel', this._contentUp);
    }
  }

  _mouseScroll() {
    this.addEventListener('wheel', (e) => {
      const innerBox = this.shadowRoot.querySelector('#inner-vertical-rolling-box');
      if (!innerBox) return;

      const canScroll = innerBox.scrollHeight > this.offsetHeight;
      if (!canScroll) return;

      e.preventDefault();

      const scrollSpeed = 1;
      this._offsetY -= e.deltaY * scrollSpeed;

      const maxOffset = 0;
      const minOffset = -(innerBox.scrollHeight - this.offsetHeight);
      this._offsetY = Math.max(minOffset, Math.min(maxOffset, this._offsetY));

      innerBox.style.transform = `translateY(${this._offsetY}px)`;
    }, { passive: false });
  }
}

/**
 * horizontal rolling box 
 */
class qgHorizontalRollingBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          overflow: hidden;
          position: relative;
          width: 100%;
          cursor: grab;
          touch-action: none;
          user-select: none;
        }
        :host(:active) {
          cursor: grabbing;
        }
        #inner-horizontal-rolling-box {
          height: 100%;
          white-space: nowrap;
          transition: transform 0.3s ease;
          will-change: transform;
        }
        #inner-horizontal-rolling-box.dragging {
          transition: none;
        }
      </style>
      <div id="inner-horizontal-rolling-box">
        <slot></slot>
      </div>
    `;

    this._offsetX = 0;
    this._isDragging = false;
    this._startX = 0;
    this._startOffsetX = 0;
    this._contentMove = null;
    this._contentUp = null;
  }

  connectedCallback() {
    requestAnimationFrame(() => {
      this._mouseScroll();
      this._draggable();
    });
  }

  disconnectedCallback() {
    this._unbindDragEvents();
  }

  _draggable() {
    const innerBox = this.shadowRoot.querySelector('#inner-horizontal-rolling-box');
    if (!innerBox) return;

    innerBox.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button, a, input, select, textarea, [role="button"]')) {
        return;
      }

      this._isDragging = true;
      this._startX = e.clientX;
      this._startOffsetX = this._offsetX;
      innerBox.classList.add('dragging');

      try {
        this.setPointerCapture(e.pointerId);
      } catch {}
    });

    this._contentMove = (e) => {
      if (!this._isDragging) return;

      const deltaX = e.clientX - this._startX;

      if (Math.abs(deltaX) < 5) return;

      this._offsetX = this._startOffsetX + deltaX;

      const maxOffset = 0;
      const minOffset = -(innerBox.scrollWidth - this.offsetWidth);
      this._offsetX = Math.max(minOffset, Math.min(maxOffset, this._offsetX));

      innerBox.style.transform = `translateX(${this._offsetX}px)`;
    };

    this._contentUp = () => {
      if (!this._isDragging) return;

      this._isDragging = false;
      innerBox.classList.remove('dragging');

      try {
        this.releasePointerCapture(this._currentPointerId);
      } catch {}

      innerBox.style.transform = `translateX(${this._offsetX}px)`;
    };

    document.addEventListener('pointermove', this._contentMove);
    document.addEventListener('pointerup', this._contentUp);
    document.addEventListener('pointercancel', this._contentUp);

    innerBox.addEventListener('dragstart', (e) => e.preventDefault());
  }

  _unbindDragEvents() {
    if (this._contentMove) {
      document.removeEventListener('pointermove', this._contentMove);
    }
    if (this._contentUp) {
      document.removeEventListener('pointerup', this._contentUp);
      document.removeEventListener('pointercancel', this._contentUp);
    }
  }

  _mouseScroll() {
    this.addEventListener('wheel', (e) => {
      e.preventDefault();

      const innerBox = this.shadowRoot.querySelector('#inner-horizontal-rolling-box');
      if (!innerBox) return;

      const scrollSpeed = 1;
      const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      this._offsetX -= delta * scrollSpeed;

      const maxOffset = 0;
      const minOffset = -(innerBox.scrollWidth - this.offsetWidth);
      this._offsetX = Math.max(minOffset, Math.min(maxOffset, this._offsetX));

      innerBox.style.transform = `translateX(${this._offsetX}px)`;
    }, { passive: false });
  }
}



/**
 * Components defind
 */
// fast grid container
customElements.define('qg-grid', Grid);
/* <qg-grid cols="5" rows="7" gap="15px" padding="30px"></qg-grid> */
// liquid-glass
customElements.define('qg-ground-glass', qgGroundGlass);
/* <qg-liquid-glass>
    <div>
        <small>Ground glass</small>
    </div>
</qg-liquid-glass> */
// slider
customElements.define('qg-slider', qgSlider);
/* <qg-slider orientation="vertical" id="volume" value="40" max="100">
    <svg slot="icon" viewBox="0 0 24 24" fill="#000">
        <path d="..."/>
    </svg>
</qg-slider> */
// app card
customElements.define('qg-app-card', qgAppCard);
/**
<qg-app-card fold="true" id="app-card">
  <div slot="icon" id="icon">
    <div id="app-card-icon">
      <h1>Fold card</h1>
    </div>
  </div>
  <div style="padding:20px;height: 100%;">
    <div id="app-card-return-btn">Fold</div>
    <h1 id="title">Unfold Card</h1>
  </div>
</qg-app-card>
 */
// image vector
customElements.define('qg-image-vector', qgImageVector);
// <qg-image-vector src="../../resources/img/example-img.png" id="image-vector"></qg-image-vector>

// draggble element
customElements.define('qg-draggble-element', qgDraggbleElement);

// siderbar
customElements.define('qg-left-siderbar', qgLeftSiderbar);
/* <qg-left-siderbar >
        <div></div>
    </qg-left-siderbar> */

// vertical rolling box
customElements.define('qg-vertical-rolling-box', qgVerticalRollingBox);
{/* <qg-vertical-rolling-box id="v-box">
  <div id="v-box-content">
  </div>
</qg-vertical-rolling-box> */}

// horizontal rolling box
customElements.define('qg-horizontal-rolling-box', qgHorizontalRollingBox);
{/* <qg-horizontal-rolling-box id="h-box">
  <div id="h-box-content">
    The horizontal rolling box
  </div>
</qg-horizontal-rolling-box> */}

// 