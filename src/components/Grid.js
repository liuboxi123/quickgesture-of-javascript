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
export class Grid extends HTMLElement{
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
if (!customElements.get('qg-grid')) {
  customElements.define('qg-grid', Grid);
}

