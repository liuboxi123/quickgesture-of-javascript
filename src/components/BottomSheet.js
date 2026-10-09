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
 * bottom sheet
 */

export class qgBottomSheet extends HTMLElement {
  // 1. 声明需要监听的属性
  static get observedAttributes() {
    return ['is-show'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 9999999;
          transition: transform 0.3s ease;
          transform: translateY(100%);
        }
        #sheet {
          width: 100%;
          height: auto;
          touch-action: none;
        }
      </style>
      <div id="sheet">
        <slot></slot>
      </div>
    `;

    this._isDragging = false;
    this._startY = 0;
    this._currentY = 0;
    this._hiddenWatcher = null;
    this._contentMove = null;
    this._contentUp = null;
    this.onSettled = null;
    this._exitSheet();
    this._bannedSlotBubbing();
  }

  // 2. 添加 isShow JavaScript 属性（方便 JS 直接赋值）
  get isShow() {
    return this.hasAttribute('is-show');
  }
  set isShow(val) {
    if (val) {
      this.setAttribute('is-show', '');
    } else {
      this.removeAttribute('is-show');
    }
  }

  // 3. 属性变化回调：is-show 添加/移除时触发开/关
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'is-show') {
      if (newValue !== null) {
        this._openSheet();
      } else {
        this._closeSheet();
      }
    }
  }

  _bannedSlotBubbing() {
    this.shadowRoot.querySelector('slot').addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  _exitSheet() {
    console.log(this.shadowRoot.querySelector('#sheet'));
    // this.shadowRoot.querySelector('#sheet').addEventListener('click', () => {
    //   console.log('click shade');
    //   this.close();
    // });
  }

  connectedCallback() {
    requestAnimationFrame(() => {
      this._initPosition();
      this._bindContentDrag();
      this._bindHiddenWatcher();
      // 如果 HTML 上初始就有 is-show 属性，则自动打开
      if (this.hasAttribute('is-show')) {
        this._openSheet();
      }
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
    const height = this.offsetHeight;
    this._currentY = height;
    this.style.transform = `translateY(${height}px)`;
  }

  _bindContentDrag() {
    const sheet = this.shadowRoot.querySelector('#sheet');
    if (!sheet) return;

    sheet.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, a, input, select, textarea, label, [data-no-drag]')) {
      return;
    }
      // e.preventDefault();
      this._isDragging = true;
      this._startY = e.clientY - this._currentY;
      this.style.transition = 'none';
      this.setPointerCapture(e.pointerId);
    });

    this._contentMove = (e) => {
      if (!this._isDragging) return;
      const height = this.offsetHeight;
      let y = e.clientY - this._startY;
      y = Math.max(0, Math.min(height, y));
      this._currentY = y;
      this.style.transform = `translateY(${y}px)`;
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
    const height = this.offsetHeight;
    const wasOpen = this._currentY === 0;

    if (this._currentY > height / 2) {
      this._currentY = height;
    } else {
      this._currentY = 0;
    }

    const isOpen = this._currentY === 0;
    this.style.transform = `translateY(${this._currentY}px)`;
    
    // 4. 拖拽松手后同步 is-show 属性到实际状态
    if (isOpen && !this.hasAttribute('is-show')) {
      this.setAttribute('is-show', '');
    } else if (!isOpen && this.hasAttribute('is-show')) {
      this.removeAttribute('is-show');
    }
    
    this._syncHiddenWatcher();

    if (isOpen !== wasOpen) {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;

        if (isOpen) {
          // this.open();
          // const shade = document.createElement('div');
          // shade.id = 'qgsheetshade';
          // shade.style.cssText = `
          //   position: fixed; top: 0; left: 0;
          //   width: 100vw; height: 100vh;
          //   background: rgba(0,0,0,0.7);
          //   z-index: 9999998;
          // `;
          
          // document.body.appendChild(shade);
        } else if(!isOpen) {
          // document.getElementById('qgsheetshade')?.remove();
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
    const height = this.offsetHeight;
    if (height === 0) return true;
    return this._currentY >= height - 2;
  }

  _bindHiddenWatcher() {
    this._hiddenWatcher = (e) => {
      if (this._isDragging) return;
      this._isDragging = true;
      this._startY = e.clientY - this._currentY;
      this.style.transition = 'none';

      const move = (ev) => {
        if (!this._isDragging) return;
        const height = this.offsetHeight;
        let y = ev.clientY - this._startY;
        y = Math.max(0, Math.min(height, y));
        this._currentY = y;
        this.style.transform = `translateY(${y}px)`;
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
      const shade = document.getElementById('qgsheetshade');
      if (!shade) return;

      shade.style.opacity = '0';
      shade.style.transition = 'opacity 0.3s ease';

      shade.addEventListener('transitionend', () => {
        shade.remove();
      }, { once: true });
    } else {
      if (document.getElementById('qgsheetshade')) {
        return;
      }

      const shade = document.createElement('div');
      shade.id = 'qgsheetshade';
      shade.style.height = '100vh';
      shade.style.width = '100vw';
      shade.style.backgroundColor = 'rgba(0,0,0,0.7)';
      shade.style.position = 'fixed';
      shade.style.top = '0';
      shade.style.left = '0';
      shade.style.zIndex = '9999998';
      shade.style.opacity = '0';
      shade.style.transition = 'opacity 0.3s ease';
      console.log('bind click shade');
      shade.addEventListener('click', () => {
        console.log('click shade');
        this.close();
      });

      document.body.appendChild(shade);

      requestAnimationFrame(() => {
        shade.style.opacity = '1';
      });
    }
  }

  open() {
    this.setAttribute('is-show', '');
  }

  close() {
    this.removeAttribute('is-show');
  }

  _openSheet() {
    if (!this.isConnected || this._currentY === 0) return;
    
    const height = this.offsetHeight;
    if (this._currentY === height) {
      this.style.transition = 'none';
      this._currentY = height;
      this.style.transform = `translateY(${height}px)`;
      void this.offsetHeight;
      this.style.transition = 'transform 0.3s ease';
    }
    this._currentY = 0;
    this.style.transform = 'translateY(0)';
    this._syncHiddenWatcher();
  }

  _closeSheet() {
    const height = this.offsetHeight;
    if (!this.isConnected || this._currentY === height) return;
    
    this._currentY = height;
    this.style.transition = 'transform 0.3s ease';
    this.style.transform = `translateY(${height}px)`;
    this._syncHiddenWatcher();
  }
}
if (!customElements.get('qg-bottom-sheet')) {
  customElements.define('qg-bottom-sheet', qgBottomSheet);
}