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
 * pointer event type enum
 */
const PointerEventType = Object.freeze({
    pointerdown: 'pointerdown',//按下|触摸
    pointerup: 'pointerup',//释放|抬起
    pointermove: 'pointermove',//移动|滑动
    pointerenter: 'pointerenter',//进入元素边界
    pointerleave: 'pointerleave',//离开元素边界
    pointerover: 'pointerover',//移入元素
    pointerout: 'pointerout',//移出元素
    pointercancel: 'pointercancel',//输入被系统中断
    pointergotcapture: 'pointergotcapture',//捕获指针成功
    gotpointercapture: 'gotpointercapture',//丢失指针成功
    lostpointercapture: 'lostpointercapture'//丢失指针捕获
});

/**
 * mouse event type enum
 */
const MouseEventType = Object.freeze({
    click: 'click',//点击
    dblclick: 'dblclick',//双击
    mousedown: 'mousedown',//按下
    mouseup: 'mouseup',//释放
    mousemove: 'mousemove',//移动
    mouseenter: 'mouseenter',//进入元素边界
    mouseleave: 'mouseleave',//离开元素边界
    mouseover: 'mouseover',//移入元素
    mouseout: 'mouseout',//移出元素
    contextmenu: 'contextmenu',//右键菜单
    wheel: 'wheel'//滚轮
});

/**
 * touch event type enum
 */
const TouchEventType = Object.freeze({
    touchstart: 'touchstart',//触摸开始
    touchmove: 'touchmove',//触摸移动
    touchend: 'touchend',//触摸结束
    touchcancel: 'touchcancel'//触摸取消
});

/**
 * key event type enum
 */
const KeyEventType = Object.freeze({
    keypress: 'keypress',
    keyup: 'keyup',
    keydown: 'keydown'
});