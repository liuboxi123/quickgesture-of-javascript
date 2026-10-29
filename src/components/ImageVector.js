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
import { qgGlass2 } from './Glass2.js';
/**
 * image vector
 */
export class qgImageVector extends HTMLElement {
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
        #qg-1069027654-image-vector-content {
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        #qg-1069027654-image-vector-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          pointer-events: none;
        }
        #qg-1069027654-image-vector-preview {
          height: 100%;
          width: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-color: #c6c6c6;
        }
        #qg-1069027654-image-vector-drag-block{
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        #qg-1069027654-app-card{
          width: 100%;
          height: 100%;
        }
        .qg-1069027654-image-vector-btn{
          width: min(10vw, 25px);
          height: min(10vw, 25px);
          border-radius: 50%;
          position: fixed;
          padding: 5px;
          top: 1%;
          left: 1%;
          z-index: 9999;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .qg-1069027654-more-btn{
          width: min(10vw, 25px);
          height: min(10vw, 25px);
          border-radius: 50%;
          position: fixed;
          padding: 5px;
          top: 1%;
          right: 1%;
          z-index: 9999;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .qg-1069027654-image-vector-btn-icon{
          display: block;
          width: 100%;
          height: 100%;
          color: rgb(252, 252, 252);
        }
        
      </style>

      <qg-expanding-card id="qg-1069027654-app-card">
        <div slot="icon" id="qg-1069027654-image-vector-preview"></div>
        <div id="qg-1069027654-image-vector-content">
          <qg-glass-2 class="qg-1069027654-image-vector-btn" id="qg-1069027654-image-vector-return-btn">
            <svg class="qg-1069027654-image-vector-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
              <path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </qg-glass-2>
          <qg-glass-2 class="qg-1069027654-more-btn">
            <svg class="qg-1069027654-image-vector-btn-icon"
             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.75"/>
              <circle cx="12" cy="12" r="1.75"/>
              <circle cx="12" cy="19" r="1.75"/>
            </svg>
          </qg-glass-2>
          <div id="qg-1069027654-image-vector-drag-block">
            <img src="" alt="" id="qg-1069027654-image-vector-img">
          </div>
        </div>
      </qg-expanding-card>
    `;
    this._syncSrc();
    this._draggable();
    this._initBtn();
    this._addFoldLisenter();
  }
  _initBtn(){
    const returnBtn = this.shadowRoot.querySelector('#qg-1069027654-image-vector-return-btn');
    returnBtn.addEventListener('click', () => {
      const appCard = this.shadowRoot.querySelector('#qg-1069027654-app-card');
      appCard.collapse().then(() => {});
    });
  }
  _addFoldLisenter() {

  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'src' && oldValue !== newValue) {
      this._syncSrc();
    }
  }
   _syncSrc() {
    const src = this.getAttribute('src');
    const img = this.shadowRoot.querySelector('#qg-1069027654-image-vector-img');
    const preview = this.shadowRoot.querySelector('#qg-1069027654-image-vector-preview');
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
    const dragBlock = this.shadowRoot.querySelector('#qg-1069027654-image-vector-drag-block');
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
    dragBlock.style.willChange = 'transform';
  }
  get src(){
    return this.getAttribute('src');
  }
  set src(val){
    this.setAttribute('src', val);
  }
}

if (!customElements.get('qg-image-vector')) {
  customElements.define('qg-image-vector', qgImageVector);
}
