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
 * Ground glass 
 */
export class qgGroundGlass extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                position: relative;
                border-radius: 20px;
                width: 300px;
                height: 200px;
                --qg-glass-bg: rgba(255, 255, 255, 0.08);
                --qg-glass-border: rgba(255, 255, 255, 0.2);
                --qg-glass-highlight: rgba(255, 255, 255, 0.35);
                --qg-glass-shadow: rgba(0, 0, 0, 0.25);
                --qg-liquid-speed: 8s;
                --qg-radius: inherit;
            }

            .glass-panel {
                position: relative;
                width: 100%;
                height: 100%;
                border-radius: var(--qg-radius, inherit);
                background: var(--qg-glass-bg);
                backdrop-filter: blur(24px) saturate(1.4);
                -webkit-backdrop-filter: blur(24px) saturate(1.4);
                border: 1px solid var(--qg-glass-border);
                box-shadow:
                    0 8px 32px rgba(0, 0, 0, 0.3),
                    0 2px 8px rgba(0, 0, 0, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.25),
                    inset 0 -1px 0 rgba(255, 255, 255, 0.05);
                overflow: hidden;
                z-index: 1;
            }

            .liquid-layer {
                position: absolute;
                inset: 0;
                border-radius: inherit;
                pointer-events: none;
                overflow: hidden;
                z-index: 2;
            }

            .liquid-layer::before {
                content: '';
                position: absolute;
                width: 200%;
                height: 200%;
                top: -50%;
                left: -50%;
                background: radial-gradient(ellipse at 30% 30%,
                        rgba(255, 255, 255, 0.12) 0%,
                        transparent 45%),
                    radial-gradient(ellipse at 70% 60%,
                        rgba(96, 165, 250, 0.15) 0%,
                        transparent 50%),
                    radial-gradient(ellipse at 50% 80%,
                        rgba(167, 139, 250, 0.15) 0%,
                        transparent 40%);
                animation: gentleFlow 8s ease-in-out infinite alternate;
                mix-blend-mode: soft-light;
                border-radius: inherit;
            }

            .liquid-layer::after {
                content: '';
                position: absolute;
                width: 120%;
                height: 120%;
                top: -10%;
                left: -10%;
                background: radial-gradient(circle at 40% 45%,
                        rgba(244, 114, 182, 0.08) 0%,
                        transparent 50%),
                    radial-gradient(circle at 60% 55%,
                        rgba(96, 165, 250, 0.1) 0%,
                        transparent 45%);
                animation: gentleShift 10s ease-in-out infinite alternate;
                mix-blend-mode: overlay;
                border-radius: inherit;
            }

            @keyframes gentleFlow {
                0% {
                    transform: translate(-5%, -3%) scale(1.0);
                    opacity: 0.7;
                }
                50% {
                    transform: translate(5%, 3%) scale(1.05);
                    opacity: 1;
                }
                100% {
                    transform: translate(-3%, 2%) scale(0.98);
                    opacity: 0.75;
                }
            }

            @keyframes gentleShift {
                0% {
                    transform: translate(0%, 0%) scale(1);
                    opacity: 0.6;
                }
                33% {
                    transform: translate(4%, -2%) scale(1.1);
                    opacity: 0.9;
                }
                66% {
                    transform: translate(-2%, 3%) scale(1.0);
                    opacity: 0.7;
                }
                100% {
                    transform: translate(0%, 0%) scale(1.05);
                    opacity: 0.8;
                }
            }

            .glass-panel::before {
                content: '';
                position: absolute;
                top: 0;
                left: 12%;
                right: 12%;
                height: 1.5px;
                background: linear-gradient(90deg,
                    transparent 0%,
                    rgba(255, 255, 255, 0.6) 30%,
                    rgba(255, 255, 255, 0.8) 50%,
                    rgba(255, 255, 255, 0.6) 70%,
                    transparent 100%);
                border-radius: 50%;
                z-index: 4;
                pointer-events: none;
            }
            .glass-panel::after {
                content: '';
                position: absolute;
                bottom: -3px;
                left: 20%;
                right: 20%;
                height: 12px;
                border-radius: 50%;
                background: radial-gradient(ellipse at center,
                    rgba(96, 165, 250, 0.25) 0%,
                    transparent 70%);
                filter: blur(8px);
                z-index: -1;
                transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
                pointer-events: none;
            }

            .content-slot {
                position: relative;
                z-index: 3;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
            }

            @supports not (backdrop-filter: blur(24px)) {
                .glass-panel {
                    background: rgba(30, 30, 50, 0.85);
                }
            }
        `;

        const container = document.createElement('div');
        container.className = 'glass-panel';

        const liquidLayer = document.createElement('div');
        liquidLayer.className = 'liquid-layer';

        const contentSlot = document.createElement('div');
        contentSlot.className = 'content-slot';
        contentSlot.innerHTML = '<slot></slot>';

        container.appendChild(liquidLayer);
        container.appendChild(contentSlot);

        shadow.appendChild(style);
        shadow.appendChild(container);

        this._syncRadius = () => {
            const computedRadius = getComputedStyle(this).borderRadius;
            if (computedRadius && computedRadius !== '0px') {
                container.style.setProperty('--qg-radius', computedRadius);
            } else {
                container.style.setProperty('--qg-radius', '20px');
            }
        };
    }

    connectedCallback() {
        this._syncRadius();
        if (window.ResizeObserver) {
            this._resizeObserver = new ResizeObserver(() => this._syncRadius());
            this._resizeObserver.observe(this);
        }
        this._mutationObserver = new MutationObserver(() => this._syncRadius());
        this._mutationObserver.observe(this, { attributes: true, attributeFilter: ['style', 'class'] });
    }

    disconnectedCallback() {
        if (this._resizeObserver) this._resizeObserver.disconnect();
        if (this._mutationObserver) this._mutationObserver.disconnect();
    }
}

if (!customElements.get('qg-ground-glass')) {
    customElements.define('qg-ground-glass', qgGroundGlass);
}
