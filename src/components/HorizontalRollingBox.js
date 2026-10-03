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
 * horizontal rolling box 
 */
export class qgHorizontalRollingBox extends HTMLElement {
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
if (!customElements.get('qg-horizontal-rolling-box')) {
  customElements.define('qg-horizontal-rolling-box', qgHorizontalRollingBox);
}
