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
 * left siderbar
 */

export class qgLeftSiderbar extends HTMLElement {
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
if (!customElements.get('qg-left-siderbar')) {
  customElements.define('qg-left-siderbar', qgLeftSiderbar);
}
