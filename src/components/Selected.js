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
const STYLES = `
    <style>
        :host{
            display: block;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            position: relative;
        }
        .qg-1069027654-image-vector-btn-icon{
            display: block;
            width: 100%;
            height: 100%;
            color: rgb(252, 252, 252);
        }
        .qg-1069027654-selected{
            display: block;
            width: 100%;
            height: 100%;
            background-color: transparent;
            border: none;
            border-radius: inherit;
        }
        ::slotted([slot="option"]){
            display:block;
            cursor:pointer;
            white-space:nowrap;
        }
        .qg-1069027654-dropdown{
            position:absolute;
            top:calc(100% + 4px);
            left:0;
            display:none;
            flex-direction:column;
            transform-origin: top center;   /* 从顶部往下展开 */
            will-change: opacity, transform;
        }
        @keyframes qg-dropdown-in{
            from{ opacity: 0; transform: translateY(-6px) scale(.96); }
            to  { opacity: 1; transform: translateY(0)    scale(1);   }
        }
        :host([open]) .qg-1069027654-dropdown{ 
            display:flex;
            animation: qg-dropdown-in .18s cubic-bezier(.2, .8, .2, 1) both;
        }
    </style>
    <qg-glass-2 class="qg-1069027654-selected">
        <slot></slot>
    </qg-glass-2>
    <div class="qg-1069027654-dropdown">
        <slot name="option"></slot>
    </div>
`;

export class qgSelected extends HTMLElement {
    constructor(){
        super();
        this._shadow = this.attachShadow({ mode: 'open' });
        this._shadow.innerHTML = STYLES;
        this._selectedInput = this._shadow.querySelector('qg-glass-2');
        this._options = this.querySelectorAll('[slot="option"]'); // 下拉列表项
        this._init();
    }
    _init(){
        this._selectedInput.addEventListener('click', () => this.toggleAttribute('open'));
    }
}

if (!customElements.get('qg-selected')) {
  customElements.define('qg-selected', qgSelected);
}