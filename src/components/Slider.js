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
import { gestureListenerExp, isKeyDownExp, wheelLisenterExp } from '../core/index-export.js';
import { elUnfoldAnimationExp, elFoldAnimationExp } from '../core/index-export.js';
import { addEaseAnimationExp } from '../core/index-export.js';
import { draggableElementExp } from '../core/index-export.js';
import { pinchInOrOutOfTwoFingersLisenterExp } from '../core/index-export.js';
/**
 * slider
 */
export class qgSlider extends HTMLElement {
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
if (!customElements.get('qg-slider')) {
  customElements.define('qg-slider', qgSlider);
}
