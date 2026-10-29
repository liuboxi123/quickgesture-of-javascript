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
 * Expanding card
 */
export class qgExpandingCard extends HTMLElement {
  static get observedAttributes() {
    return ['expanded'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          cursor: pointer;
          box-sizing: border-box;
        }
        .qg-1069027654-content { display: none; }
        :host([data-expanded]) .qg-1069027654-content { display: block; }
      </style>
      <slot name="icon"></slot>
      <div class="qg-1069027654-content"><slot></slot></div>
    `;

    this._expanded = false;
    this._animating = false;
    this._placeholder = null;
    this._originalBorderRadius = '0px';
    this._reflecting = false;
    this._fallback = null;

    this._iconEl = null;
    this._iconFallback = null;

    this.addEventListener('click', (e) => {
      if (!this._expanded) return this.toggle();

      const path = e.composedPath();
      const closeBtn = path.find(el =>
        el instanceof HTMLElement && el.matches('[data-collapse]')
      );
      if (closeBtn) this.collapse();
    });
  }

  connectedCallback() {
    if (!this._iconEl) this._iconEl = this.querySelector('[slot="icon"]');
    this.shadowRoot
      .querySelector('slot[name="icon"]')
      ?.addEventListener('slotchange', this._refreshIcon);
  }

  disconnectedCallback() {
    this.shadowRoot
      .querySelector('slot[name="icon"]')
      ?.removeEventListener('slotchange', this._refreshIcon);
  }

  _refreshIcon = () => {
    const current = this.querySelector('[slot="icon"]');
    if (current) this._iconEl = current;
    else if (!this._expanded) this._iconEl = null;
  };

  get expanded() { return this._expanded; }
  set expanded(v) { v ? this.expand() : this.collapse(); }

  attributeChangedCallback(name, _old, val) {
    if (name !== 'expanded' || this._reflecting) return;
    const want = val !== null;
    if (want === this._expanded) return;
    want ? this.expand() : this.collapse();
  }

  /* ============ 公开方法 ============ */
  async expand() {
    if (this._expanded || this._animating) return;
    this._animating = true;
    this._expanded = true;

    this._fadeOutIcon();      // 与展开动画并行
    this._expandImpl();
    await this._waitTransform();

    this._animating = false;
    this._reflect('expanded', true);
    this.dispatchEvent(new CustomEvent('qg-expand', { bubbles: true, composed: true }));
  }

  async collapse() {
    if (!this._expanded || this._animating) return;
    this._animating = true;
    this._expanded = false;

    this._collapseImpl();
    await this._waitTransform();

    // 1) 隐藏默认内容
    this.removeAttribute('data-expanded');
    // 2) icon 先插回（透明占位），保证回文档流时高度正确
    this._prependIcon();
    // 3) 清占位符 + 回文档流（视觉位置不变）
    this._placeholder?.remove();
    this._placeholder = null;
    this.style.cssText = '';
    // 4) icon 淡入
    this._fadeInIcon();

    this._animating = false;
    this._reflect('expanded', false);
    this.dispatchEvent(new CustomEvent('qg-collapse', { bubbles: true, composed: true }));
  }

  toggle() {
    return this._expanded ? this.collapse() : this.expand();
  }

  /* ============ icon 淡出 / 淡入 ============ */
  _fadeOutIcon() {
    const icon = this._iconEl;
    if (!icon || !icon.isConnected) return;

    icon.style.transition = 'opacity 0.3s ease';
    icon.style.opacity = '1';
    void icon.offsetWidth;
    icon.style.opacity = '0';

    const cleanup = () => {
      icon.removeEventListener('transitionend', onEnd);
      if (icon.style.opacity === '0' && icon.isConnected) icon.remove();
    };
    const onEnd = (e) => {
      if (e.target !== icon || e.propertyName !== 'opacity') return;
      cleanup();
    };
    icon.addEventListener('transitionend', onEnd);
    clearTimeout(this._iconFallback);
    this._iconFallback = setTimeout(cleanup, 500);
  }

  _prependIcon() {
    const icon = this._iconEl;
    if (!icon || icon.isConnected) return;
    icon.style.transition = 'none';
    icon.style.opacity = '0';
    this.prepend(icon);
  }

  _fadeInIcon() {
    const icon = this._iconEl;
    if (!icon) return;
    icon.style.transition = 'opacity 0.3s ease';
    void icon.offsetWidth;
    icon.style.opacity = '1';

    const onEnd = (e) => {
      if (e.target !== icon || e.propertyName !== 'opacity') return;
      icon.removeEventListener('transitionend', onEnd);
      icon.style.transition = '';
      icon.style.opacity = '';
    };
    icon.addEventListener('transitionend', onEnd);
  }

  /* ============ FLIP 动画 ============ */
  _expandImpl() {
    const first = this.getBoundingClientRect();
    const cs = getComputedStyle(this);
    this._originalBorderRadius = cs.borderRadius;

    const ph = document.createElement('div');
    Object.assign(ph.style, {
      width: `${first.width}px`,
      height: `${first.height}px`,
      marginTop: cs.marginTop, marginRight: cs.marginRight,
      marginBottom: cs.marginBottom, marginLeft: cs.marginLeft,
      visibility: 'hidden', pointerEvents: 'none', flex: '0 0 auto',
    });
    this.parentNode.insertBefore(ph, this);
    this._placeholder = ph;

    Object.assign(this.style, {
      position: 'fixed', top: '0', left: '0',
      width: '100vw', height: '100vh', margin: '0',
      borderRadius: this._originalBorderRadius,
      transformOrigin: 'top left', transform: 'none',
      transition: 'none', zIndex: '9999', boxSizing: 'border-box',
    });

    // 现在 this 已 fixed 全屏，显示内容不影响外框
    this.setAttribute('data-expanded', '');

    const last = this.getBoundingClientRect();
    const sx = first.width / last.width;
    const sy = first.height / last.height;
    const dx = first.left - last.left;
    const dy = first.top - last.top;

    this.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    void this.offsetWidth;

    this.style.transition = 'transform .3s ease, border-radius .3s ease';
    this.style.transform = 'none';
    this.style.borderRadius = '0';
  }

  _collapseImpl() {
    const last = this.getBoundingClientRect();
    const target = this._placeholder?.getBoundingClientRect() ?? last;

    const dx = target.left - last.left;
    const dy = target.top - last.top;
    const sx = target.width / last.width;
    const sy = target.height / last.height;

    this.style.transition = 'none';
    this.style.transform = 'none';
    this.style.transformOrigin = 'top left';
    this.style.borderRadius = '0';
    void this.offsetWidth;

    this.style.transition = 'transform .3s ease, border-radius .3s ease';
    this.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    this.style.borderRadius = this._originalBorderRadius;
  }

  /* ============ 工具 ============ */
  _reflect(name, on) {
    this._reflecting = true;
    on ? this.setAttribute(name, '') : this.removeAttribute(name);
    this._reflecting = false;
  }

  _waitTransform() {
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        this.removeEventListener('transitionend', handler);
        clearTimeout(this._fallback);
        resolve();
      };
      const handler = (e) => {
        if (e.target === this && e.propertyName === 'transform') finish();
      };
      this.addEventListener('transitionend', handler);
      this._fallback = setTimeout(finish, 500);
    });
  }
}

if (!customElements.get('qg-expanding-card')) {
  customElements.define('qg-expanding-card', qgExpandingCard);
}

