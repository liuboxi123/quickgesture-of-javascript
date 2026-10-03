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
 * draggble element
 */
export class qgDraggbleElement extends HTMLElement {
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
if (!customElements.get('qg-draggble-element')) {
  
  customElements.define('qg-draggble-element', qgDraggbleElement);
}
