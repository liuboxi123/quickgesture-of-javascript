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
          width: min(40vw, 100px);
          height: min(10vw, 45px);
          border-radius: 1000px;
          margin-left: 10px;
        }
        .image-vector-btn-bottom-island{
          background-color: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(10px);                 
          -webkit-backdrop-filter: blur(10px); 
          width: min(50vw, 150px);
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
            <qg-horizontal-rolling-box class="image-vector-btn-top-island" id="image-vector-more-btn">
              <slot name="image-vector-top-tools"></slot>
            </qg-horizontal-rolling-box>
          </div>
          <div id="image-vector-bottom-bar">
            <qg-horizontal-rolling-box class="image-vector-btn-bottom-island" id="image-vector-download-btn">
              <slot name="image-vector-bottom-tools"></slot>
            </qg-horizontal-rolling-box>
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

if (!customElements.get('qg-image-vector')) {
  customElements.define('qg-image-vector', qgImageVector);
}
