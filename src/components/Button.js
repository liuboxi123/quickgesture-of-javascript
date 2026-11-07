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

/**
 * qg button
 */
const STYLES = `
    <style>   
        .qg-1069027654-button {
            display: block;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;              /* 去掉浏览器默认 padding */
            border: none;
            outline: none;
            background-color: transparent;
            box-sizing: border-box;
            font: inherit;           /* 避免 button 默认字体撑高 */
        }
        :host {
            display: block;          /* 关键：让宿主成为块级，能撑满父容器 */
            width: 100%;
            height: 100%;
            box-sizing: border-box;
        }
        qg-glass-2 {
            display: block;          /* 自定义元素默认 inline，必须改成 block */
            width: 100%;
            height: 100%;
            padding: 0;              /* 去掉它可能自带的内边距 */
            margin: 0;
            box-sizing: border-box;
        }
    </style>
    <qg-glass-2>
        <button class="qg-1069027654-button">
            <slot></slot>
        </button>
    </qg-glass-2>
  `;
const OBSERVED = ['disabled', 'type', 'name', 'value', 'aria-label', 'aria-pressed', 'title'];
export class qgButton extends HTMLElement{
    static observedAttributes = OBSERVED;
    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: 'open' });
        this._shadow.innerHTML = STYLES;
        this._btn = this._shadow.querySelector('button');
    }
    attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal === newVal) return;
        if (!this._btn) return;
        if (newVal === null) {
            this._btn.removeAttribute(name);
        } else {
            this._btn.setAttribute(name, newVal);
        }
        // disabled 在 button 上是布尔属性，setAttribute('disabled', 'false') 仍然禁用，
        // 所以布尔属性要特殊处理：
        if (name === 'disabled') {
            this._btn.disabled = newVal !== null;
        }
    }
  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(v) { v ? this.setAttribute('disabled', '') : this.removeAttribute('disabled'); }

  get type() { return this.getAttribute('type') ?? 'button'; }
  set type(v) { this.setAttribute('type', v); }

  get name() { return this.getAttribute('name'); }
  set name(v) { this.setAttribute('name', v); }

  get value() { return this.getAttribute('value'); }
  set value(v) { this.setAttribute('value', v); }
}

if (!customElements.get('qg-button')) {
  customElements.define('qg-button', qgButton);
}