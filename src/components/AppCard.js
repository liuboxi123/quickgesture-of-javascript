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
import { gestureListenerExp, isKeyDown, wheelLisenterExp } from '../core/index-export.js';
import { elUnfoldAnimationExp, elFoldAnimationExp } from '../core/index-export.js';
import { addEaseAnimationExp } from '../core/index-export.js';
import { draggableElementExp } from '../core/index-export.js';
import { pinchInOrOutOfTwoFingersLisenterExp } from '../core/index-export.js';
/**
 * app card
 */
export class qgAppCard extends HTMLElement {
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
if (!customElements.get('qg-app-card')) {
  customElements.define('qg-app-card', qgAppCard);
}

