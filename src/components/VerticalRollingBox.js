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
 * vertical rolling box
 */
export class qgVerticalRollingBox extends HTMLElement {
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

if (!customElements.get('qg-vertical-rolling-box')) {
  customElements.define('qg-vertical-rolling-box', qgVerticalRollingBox);
}
