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
const NS = 'http://www.w3.org/2000/svg';

const R = 42;                          
const CIRC = 2 * Math.PI * R;         

const DASH_MIN = 2.1;                
const DASH_MAX = 186.9;                
const GAP = 420;
const OFF_MID = -73.5;
const OFF_END = -260.4;

const svgEl = (name, attrs) => {
const node = document.createElementNS(NS, name);
if (attrs) for (const k in attrs) node.setAttribute(k, attrs[k]);
return node;
};

const STYLE = `
:host {
    display: inline-block;
    width: var(--qg-size, 48px);
    height: var(--qg-size, 48px);
    vertical-align: middle;
}
:host([hidden]) { display: none; }

svg { display: block; width: 100%; height: 100%; }

.track {
    fill: none;
    stroke: var(--qg-track-color, transparent);
    stroke-width: var(--qg-stroke-width, 8);
}

.arc {
    fill: none;
    stroke: var(--qg-color, currentColor);
    stroke-width: var(--qg-stroke-width, 8);
    stroke-linecap: round;
    stroke-dasharray: ${CIRC};
    stroke-dashoffset: 0;
}

svg.spin {
    animation: qg-spin 1.4s linear infinite;
    transform-origin: 50% 50%;
}
svg.spin .track { display: none; }
svg.spin .arc   { animation: qg-dash 1.4s ease-in-out infinite; }

@keyframes qg-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}

@keyframes qg-dash {
    0% {
    stroke-dasharray: ${DASH_MIN} ${GAP};
    stroke-dashoffset: 0;
    }
    50% {
    stroke-dasharray: ${DASH_MAX} ${GAP};
    stroke-dashoffset: ${OFF_MID};
    }
    100% {
    stroke-dasharray: ${DASH_MAX} ${GAP};
    stroke-dashoffset: ${OFF_END};
    }
}

@media (prefers-reduced-motion: reduce) {
    svg.spin,
    svg.spin .arc { animation-duration: 4.2s; }
}
`;

export class qgLoader extends HTMLElement {
static get observedAttributes() {
    return ['size', 'stroke-width', 'color', 'track-color', 'value'];
}

constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = STYLE;

    this._svg = svgEl('svg', { viewBox: '0 0 100 100', 'aria-hidden': 'true' });

    this._track = svgEl('circle', { class: 'track', cx: 50, cy: 50, r: R });
    this._arc = svgEl('circle', {
    class: 'arc',
    cx: 50,
    cy: 50,
    r: R,
    transform: 'rotate(-90 50 50)',
    });

    this._svg.append(this._track, this._arc);
    root.append(style, this._svg);
}

connectedCallback() {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'progressbar');
    this._render();
}

attributeChangedCallback(_name, oldVal, newVal) {
    if (oldVal !== newVal) this._render();
}

get value() {
    const raw = this.getAttribute('value');
    if (raw === null || raw.trim() === '') return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
}
set value(v) {
    if (v === null || v === undefined || v === '') this.removeAttribute('value');
    else this.setAttribute('value', String(v));
}

_render() {
    const host = this.style;

    // size
    const size = this.getAttribute('size');
    if (size) {
    host.setProperty('--qg-size', /^-?\d+(\.\d+)?$/.test(size) ? `${size}px` : size);
    } else {
    host.removeProperty('--qg-size');
    }

    // stroke-width
    const sw = this.getAttribute('stroke-width');
    if (sw) host.setProperty('--qg-stroke-width', sw);
    else host.removeProperty('--qg-stroke-width');

    // colors
    const color = this.getAttribute('color');
    if (color) host.setProperty('--qg-color', color);
    else host.removeProperty('--qg-color');

    const trackColor = this.getAttribute('track-color');
    if (trackColor) host.setProperty('--qg-track-color', trackColor);
    else host.removeProperty('--qg-track-color');

    const raw = this.getAttribute('value');
    const n = raw === null || raw.trim() === '' ? NaN : Number(raw);
    const indeterminate = !Number.isFinite(n);

    this._svg.classList.toggle('spin', indeterminate);

    if (indeterminate) {
    this._arc.style.strokeDasharray = '';
    this._arc.style.strokeDashoffset = '';
    this._arc.style.strokeLinecap = '';

    this.removeAttribute('aria-valuenow');
    this.removeAttribute('aria-valuemin');
    this.removeAttribute('aria-valuemax');
    this.setAttribute('aria-valuetext', '加载中');
    return;
    }

    const clamped = Math.min(100, Math.max(0, n));
    const p = clamped / 100;

    this._arc.style.strokeDashoffset = '0';

    if (p <= 0) {
    this._arc.style.strokeLinecap = 'butt';
    this._arc.style.strokeDasharray = `0 ${CIRC}`;
    } else {
    this._arc.style.strokeLinecap = '';
    this._arc.style.strokeDasharray = `${CIRC * p} ${CIRC}`;
    }

    this.setAttribute('aria-valuemin', '0');
    this.setAttribute('aria-valuemax', '100');
    this.setAttribute('aria-valuenow', String(clamped));
    this.removeAttribute('aria-valuetext');
}
}

if (!customElements.get('qg-loader')) {
customElements.define('qg-loader', qgLoader);
}

