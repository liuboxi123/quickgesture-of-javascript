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
 * Attaches a wheel event listener to an element
 * @param {HTMLElement} element element to attach the wheel event listener
 * @param {Function} callback wheel events callback function
 * @param {string} eventType the type of event to listen for
 * @param {boolean} shouldPreventDefault whether to call preventDefault() on the event
 */
function listener(element, callback, eventType, shouldPreventDefault = false) {
  element.addEventListener(eventType, (e) => {
    if (shouldPreventDefault) {
      e.preventDefault();
    }
    callback(e);
  }, { passive: !shouldPreventDefault });
}

/**
 * Checks if a double-finger gesture event has occurred on the specified element.
 * @param {HTMLElement} element 
 * @param {Function} callback 
 * @param {boolean} preventDefault whether to call preventDefault() on the event
 */
function checkDoubleFingersEvent(element, callback, touchType, preventDefault = false) {
  const h = (e) => {
    if(e.targetTouches.length === 2){
      if (preventDefault) {
        e.preventDefault();
      }
      callback(e);
    }
  };

  touchType.forEach(type => {
    element.addEventListener(type, h, { passive: false });
  });
}

  /**
   * Checks if a single-finger gesture event has occurred on the specified element.
   * @param {HTMLElement} element 
   * @param {Function} callback 
   * @param {boolean} preventDefault whether to call preventDefault() on the event
   */
function checkSingleFingerEvent(element, callback, touchType, preventDefault = false) {
  const h = (e) => {
    if(e.targetTouches.length === 1){
      if (preventDefault) {
        e.preventDefault();
      }
      callback(e);
    }
  };

  touchType.forEach(type => {
    element.addEventListener(type, h, { passive: false });
  });
}

/**
 * Checks if a triple-finger gesture event has occurred on the specified element.
 * notes the windows system's browsers maybe can't compatibility this event beacause the quickly step
 * @param {HTMLElement} element 
 * @param {Function} callback 
 * @param {boolean} preventDefault whether to call preventDefault() on the event
 */
function checkTripleFingersEvent(element, callback, touchType, preventDefault = false) {
  const h = (e) => {
    if(e.targetTouches.length === 3){
      if (preventDefault) {
        e.preventDefault();
      }
      callback(e);
    }
  };

  touchType.forEach(type => {
    element.addEventListener(type, h, { passive: false });
  });
}

/**
 * Checks if a mouse down event has occurred on the specified element.
 * @param {HTMLElement} element 
 * @param {Function} callback 
 * @param {boolean} preventDefault 
 */
function checkMouseAndTrackpadEvent(element, callback, eventType, preventDefault = false){
  listener(element, callback, eventType, preventDefault);
}

/**
 * Checks if a three-finger slide upward event has occurred on the specified element.
 * @param {HTMLElement} element 
 * @param {Function} callback 
 * @param {float} length the percentage of the height of the bound element
 * @param {boolean} preventDefault 
 */
function checkThreeFingersSlideUpwardEvent(element, callback, threshold, preventDefault = false) {
  let startY = null;
  listener(element, (e) => {
    if(e.touches.length !== 3) return;
    startY = Math.min(e.touches[0].clientY, e.touches[1].clientY, e.touches[2].clientY);
  }, TouchEventType.touchstart, false);

  listener(element, (e) => {
    let endY = null;
    if(startY === null) return;
    if(e.changedTouches.length === 3){
      endY = Math.max(e.changedTouches[0].clientY, e.changedTouches[1].clientY, e.changedTouches[2].clientY);
    }else if(e.changedTouches.length === 2){
      endY = Math.max(e.changedTouches[0].clientY, e.changedTouches[1].clientY);
    }else{
      endY = e.changedTouches[0].clientY;
    }
    const distance = startY - endY;
    const minDistance = element.clientHeight * threshold;
    if(distance >= minDistance){
      if(preventDefault){
        e.preventDefault();
      }
      callback(e);
    }
    startY = null; // reset start
  }, TouchEventType.touchend, preventDefault);
}

/**
 * Checks if a three-finger slide downward event has occurred on the specified element.
 * @param {HTMLElement} element 
 * @param {Function} callback 
 * @param {float} length the percentage of the height of the bound element
 * @param {boolean} preventDefault 
 */
function checkThreeFingersSlideDownwardEvent(element, callback, threshold = 1, preventDefault = false) {
  let startY = null;
  listener(element, (e) => {
    if(e.touches.length !== 3) return;
    startY = Math.min(e.touches[0].clientY, e.touches[1].clientY, e.touches[2].clientY);
  }, TouchEventType.touchstart, false);

  listener(element, (e) => {
    let endY = null;
    if(startY === null) return;
    if(e.changedTouches.length === 3){
      endY = Math.max(e.changedTouches[0].clientY, e.changedTouches[1].clientY, e.changedTouches[2].clientY);
    }else if(e.changedTouches.length === 2){
      endY = Math.max(e.changedTouches[0].clientY, e.changedTouches[1].clientY);
    }else{
      endY = e.changedTouches[0].clientY;
    }
    const distance = endY - startY;
    const minDistance = element.clientHeight * threshold;
    if(distance >= minDistance){
      if(preventDefault){
        e.preventDefault();
      }
      callback(e);
    }
    startY = null; // reset start
  }, TouchEventType.touchend, preventDefault);
}

/**
 * Checks if a two-finger slide upward event has occurred on the specified element.
 * @param {HTMLElement} element 
 * @param {Function} callback 
 * @param {float} threshold the percentage of the height of the bound element
 * @param {boolean} preventDefault 
 */
function checkTwoFingersSlideUpwardEvent(element, callback, threshold = 1, preventDefault = false) {
  let startY = null;
  listener(element, (e) => {
    if(e.touches.length !== 2) return;
    startY = Math.min(e.touches[0].clientY, e.touches[1].clientY);
  }, TouchEventType.touchstart, false);

  listener(element, (e) => {
    if(startY === null) return;
    const endY = e.changedTouches.length >= 2
      ? Math.max(e.changedTouches[0].clientY, e.changedTouches[1].clientY)
      : e.changedTouches[0].clientY;
    const distance = startY - endY;
    const minDistance = element.clientHeight * threshold;
    if(distance >= minDistance){
      if(preventDefault){
        e.preventDefault();
      }
      callback(e);
    }
    startY = null; // reset start
  }, TouchEventType.touchend, preventDefault);
}

/**
 * Checks if a two-finger slide downward event has occurred on the specified element.
 * @param {HTMLElement} element 
 * @param {Function} callback 
 * @param {float} threshold the percentage of the height of the bound element
 * @param {boolean} preventDefault 
 */
function checkTwoFingersSlideDownwardEvent(element, callback, threshold = 1, preventDefault = false) {
  let startY = null;
  listener(element, (e) => {
    if(e.touches.length !== 2) return;
    startY = Math.min(e.touches[0].clientY, e.touches[1].clientY);
  }, TouchEventType.touchstart, false);

  listener(element, (e) => {
    if(startY === null) return;
    const endY = e.changedTouches.length >= 2
      ? Math.max(e.changedTouches[0].clientY, e.changedTouches[1].clientY)
      : e.changedTouches[0].clientY;
    const distance = endY - startY;
    const minDistance = element.clientHeight * threshold;
    if(distance >= minDistance){
      if(preventDefault){
        e.preventDefault();
      }
      callback(e);
    }
    startY = null; // reset start
  }, TouchEventType.touchend, preventDefault);
}

/**
 * Check if single finger slide upware events
 * @param {HTMLElement} element bounded element
 * @param {Function} callback callback functions 
 * @param {Float} threshold the percentage of the height of the bound element
 * @param {boolean} shouldPreventDefault is prevent default events
 */
function checkSingleFingerSlideUpwardEvent(element, callback, threshold = 1, shouldPreventDefault = false){
  let startY = null;
  let isTracking = false;
  const resetState = () => {
    startY = null;
    isTracking = false;
  };
  // touch
  listener(element, (e) => {
    if(e.touches.length !== 1) return;
    startY = e.touches[0].clientY;
    isTracking = true;
  }, TouchEventType.touchstart, false);

  // cancel tracking when mutil finger or spilt out
  listener(element, () => {
    isTracking = false;
    startY = null;
  }, TouchEventType.touchcancel, false);

  listener(element, (e) => {
    if(! isTracking || startY === null) return;
    const endY = e.changedTouches[0].clientY;
    const distance = startY - endY;
    const minDistance = element.clientHeight * threshold;
    if(distance >= minDistance){
      if(shouldPreventDefault){
        e.preventDefault();
      }
      callback(e);
    }
    resetState(); // reset start
  }, TouchEventType.touchend, shouldPreventDefault);
  // drag
  listener(element, (e) => {
    if(e.button !== 0) return;
    startY = e.clientY;
    isTracking = true;
  }, MouseEventType.mousedown, false);
  // reset if mouse leave the window
  listener(document, () => {
    if(!isTracking) return;
    isTracking = false;
    startY = null;
  }, MouseEventType.mouseup, false);

  listener(element, (e) => {
    if(!isTracking || startY === null) return;
    const distance = startY - e.clientY;
    const minDistance = element.clientHeight * threshold;

    if(distance >= minDistance){
      if(shouldPreventDefault) e.preventDefault();
      callback(e);
    }

    startY = null;
    isTracking = false;

  }, MouseEventType.mouseup, shouldPreventDefault);
}

/**
 * Check if single finger slide downware events
 * @param {HTMLElement} element bounded element
 * @param {Function} callback callback functions 
 * @param {Float} threshold the percentage of the height of the bound element
 * @param {boolean} shouldPreventDefault is prevent default events
 */
function checkSingleFingerSlideDownwardEvent(element, callback, threshold = 1, shouldPreventDefault = false){
  let startY = null;
  let isTracking = false;
  // touch
  listener(element, (e) => {
    if(e.touches.length !== 1) return;
    startY = e.touches[0].clientY;
    isTracking = true;
  }, TouchEventType.touchstart, false);

  // cancel tracking when mutil finger or spilt out
  listener(element, () => {
    isTracking = false;
    startY = null;
  }, TouchEventType.touchcancel, false);

  listener(element, (e) => {
    if(! isTracking || startY === null) return;
    const endY = e.changedTouches[0].clientY;
    const distance = endY - startY;
    const minDistance = element.clientHeight * threshold;
    if(distance >= minDistance){
      if(shouldPreventDefault){
        e.preventDefault();
      }
      callback(e);
    }
    startY = null; // reset start
  }, TouchEventType.touchend, shouldPreventDefault);
  // drag
  listener(element, (e) => {
    if(e.button !== 0) return;
    startY = e.clientY;
    isTracking = true;
  }, MouseEventType.mousedown, false);
  // reset if mouse leave the window
  listener(document, () => {
    if(!isTracking) return;
    isTracking = false;
    startY = null;
  }, MouseEventType.mouseup, false);

  listener(element, (e) => {
    if(!isTracking || startY === null) return;
    const distance = e.clientY - startY;
    const minDistance = element.clientHeight * threshold;

    if(distance >= minDistance){
      if(shouldPreventDefault) e.preventDefault();
      callback(e);
    }

    startY = null;
    isTracking = false;

  }, MouseEventType.mouseup, shouldPreventDefault);
}

/**
 * Check single finger swipe left and mouse drag to the left events
 * @param {HTMLElement} element bounded element
 * @param {Function} callback callback functions 
 * @param {Float} threshold the percentage of the width of the bound element
 * @param {boolean} shouldPreventDefault is prevent default events
 */
function checkSingleFingerSwipeLeftEvent(element, callback, threshold = 1, shouldPreventDefault = false){
  let startX = null;
  let isTracking = false;
  // touch
  listener(element, (e) => {
    if(e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    isTracking = true;
  }, TouchEventType.touchstart, false);

  // cancel tracking when mutil finger or spilt out
  listener(element, () => {
    isTracking = false;
    startX = null;
  }, TouchEventType.touchcancel, false);

  listener(element, (e) => {
    if(! isTracking || startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const distance = startX - endX;
    const minDistance = element.clientWidth * threshold;
    if(distance >= minDistance){
      if(shouldPreventDefault){
        e.preventDefault();
      }
      callback(e);
    }
    startX = null; // reset start
  }, TouchEventType.touchend, shouldPreventDefault);
  // drag
  listener(element, (e) => {
    if(e.button !== 0) return;
    startX = e.clientX;
    isTracking = true;
  }, MouseEventType.mousedown, false);
  // reset if mouse leave the window
  listener(document, () => {
    if(!isTracking) return;
    isTracking = false;
    startX = null;
  }, MouseEventType.mouseup, false);

  listener(element, (e) => {
    if(!isTracking || startX === null) return;
    const distance = startX - e.clientX;
    const minDistance = element.clientWidth * threshold;

    if(distance >= minDistance){
      if(shouldPreventDefault) e.preventDefault();
      callback(e);
    }

    startX = null;
    isTracking = false;

  }, MouseEventType.mouseup, shouldPreventDefault);
}

/**
 * Check single finger swipe right and mouse drag to the left events
 * @param {HTMLElement} element bounded element
 * @param {Function} callback callback functions 
 * @param {Float} threshold the percentage of the width of the bound element
 * @param {boolean} shouldPreventDefault is prevent default events
 */
function checkSingleFingerSwipeRightEvent(element, callback, threshold = 1, shouldPreventDefault = false){
  let startX = null;
  let isTracking = false;
  // touch
  listener(element, (e) => {
    if(e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    isTracking = true;
  }, TouchEventType.touchstart, false);

  // cancel tracking when mutil finger or spilt out
  listener(element, () => {
    isTracking = false;
    startX = null;
  }, TouchEventType.touchcancel, false);

  listener(element, (e) => {
    if(startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const distance = endX - startX;
    const minDistance = element.clientWidth * threshold;
    if(distance >= minDistance){
      if(shouldPreventDefault){
        e.preventDefault();
      }
      callback(e);
    }
    startX = null; // reset start
  }, TouchEventType.touchend, shouldPreventDefault);
  // drag
  listener(element, (e) => {
    if(e.button !== 0) return;
    startX = e.clientX;
    isTracking = true;
  }, MouseEventType.mousedown, false);
  // reset if mouse leave the window
  listener(document, () => {
    if(!isTracking) return;
    isTracking = false;
    startX = null;
  }, MouseEventType.mouseup, false);

  listener(element, (e) => {
    if(!isTracking || startX === null) return;
    const distance = e.clientX - startX;
    const minDistance = element.clientWidth * threshold;

    if(distance >= minDistance){
      if(shouldPreventDefault) e.preventDefault();
      callback(e);
    }

    startX = null;
    isTracking = false;

  }, MouseEventType.mouseup, shouldPreventDefault);
}

const MODIFIERS = ['ctrl', 'alt', 'shift', 'meta'];

function normalizeCombo(comboStr){
  const parts = comboStr.toLowerCase().split('+').map(s => s.trim());
  const mods = parts.filter(p => MODIFIERS.includes(p)).sort();
  const main = parts.filter(p => !MODIFIERS.includes(p));
  return [...mods, ...main].join('+');
}

function buildCombo(e){
  const parts = [];
  if(e.ctrlKey) parts.push('ctrl');
  if(e.altKey) parts.push('alt');
  if(e.shiftKey) parts.push('shift');
  if(e.metaKey) parts.push('meta');

  const key = e.key.toLowerCase();

  if(!MODIFIERS.includes(key)){
    parts.push(key);
  }

  return parts.join('+');
}

/**
 * listen hot key events
 * @param {Object} eventType KeyEventType
 * @param {Function} callback callback function
 * @param {Array} keys array of hot keys
 */
function hotKeyEvent(eventType, callback, keys, shouldPreventDefault){
  const normalizedKeys = keys.map(normalizeCombo);
  listener(document, (e) => {
    const combo = buildCombo(e);
    if(!normalizedKeys.includes(combo)) return;
    if(shouldPreventDefault){
      e.preventDefault();
    }
    callback(e);
  }, eventType, shouldPreventDefault);
}

/**
 * Support drag element include touch and mouse
 * @param {HTMLElement} element the element which you want to drag it
 */
function addDragProperty(element){
  let isDragging = false;
  let startX, startY, initialLeft, initialTop;
  listener(element, (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;

    const style = getComputedStyle(element);
    // it will appear at left top corner if it is not exist
    initialLeft = parseInt(style.left) || 0;
    initialTop = parseInt(style.top) || 0;

  }, MouseEventType.mousedown);

  listener(document, (e) => {
    if(!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    element.style.left = `${initialLeft + dx}px`;
    element.style.top = `${initialTop + dy}px`;
  }, MouseEventType.mousemove);

  listener(document, () => {
    isDragging = false;
  }, MouseEventType.mouseup);
}

/**
 * Get coordinate when pointer presses down on element
 * @param {HTMLElement} element - Target element
 * @param {'x'|'y'} axis - Coordinate axis to capture
 * @param {(value: number, event: PointerEvent) => void} callback - Called with the coordinate value
 * @returns {() => void} Cleanup function to remove listener early
 */
function onPointerDownCoordinate(element, axis, callback) {
  const handler = (e) => {
    if (!e.isPrimary) return;
    const value = axis === 'x' ? e.clientX : e.clientY;
    callback(value, e);
  };

  element.addEventListener(PointerEventType.pointerdown, handler, { once: true });

  // return clear fun
  return () => element.removeEventListener(PointerEventType.pointerdown, handler);
}

/**
 * Get coordinate when pointer move on element
 * @param {HTMLElement} element - Target element
 * @param {'x'|'y'} axis - Coordinate axis to capture
 * @param {(value: number, event: PointerEvent) => void} callback - Called with the coordinate value
 * @returns {() => void} Cleanup function to remove listener early
 */
function onPointerMoveCoordinate(element, axis, callback){

  const handler = (e) => {
    if (!e.isPrimary) return;
    e.preventDefault();
    const value = axis === 'x' ? e.clientX : e.clientY;
    callback(value, e);
  };

  element.addEventListener(PointerEventType.pointermove, handler, { passive: false });

  // return clear fun
  return () => element.removeEventListener(PointerEventType.pointermove, handler);
}

/**
 * Set Grid element position and span
 * @param {HTMLElement} el target element
 * @param {number} row start row
 * @param {number} col start cloumn
 * @param {number} rowSpan span row 
 * @param {number} colSpan span cloumn
 */
function setGridPosition(el, row, col, rowSpan = 1, colSpan = 1) {
  el.style.gridRow = `${row} / span ${rowSpan}`;
  el.style.gridColumn = `${col} / span ${colSpan}`;
}

/**
 * Check element is draged now
 * @param {HTEMLElemtne} el element
 * @param {() => {}} callback fun
 */
function dragListener(el, callback){
  let startTime = 0;
  let isDrag = false;
  let startX =  0;
  let startY =  0;
  downListener(el, (e) => {
    el.setPointerCapture(e.pointerId);
    startX = e.clientX;
    startY = e.clientY;
    startTime = Date.now();
  });
  el.addEventListener(PointerEventType.pointermove, (e) => {
    if(startTime === 0) return;

    const currentX = e.clientX;
    const currentY = e.clientY;
    const distanceX = Math.abs(currentX - startX);
    const distanceY = Math.abs(currentY - startY);
    const elapsed = Date.now() - startTime;
    if(!isDrag && distanceX > 10 || distanceY > 10 || elapsed > 100){
      isDrag = true;
    }
    if(isDrag){
      e.preventDefault();
      callback(e);
    }
  });
  upListener(el, (e) => {
    isDrag = false;
    startTime = 0;
  });
  cancelListener(el, (e) => {
    isDrag = false;
    startTime = 0;
  });
}

/**
 * Listen for pointer up (release) on element
 * @param {HTMLElement} el - Target element
 * @param {(e: PointerEvent) => void} callback - Handler function
 */
function upListener(el, callback) {
  el.addEventListener(PointerEventType.pointerup, (e) => {
    callback(e);
  });
}

/**
 * Listen for pointer down (press) on element
 * @param {HTMLElement} el - Target element
 * @param {(e: PointerEvent) => void} callback - Handler function
 */
function downListener(el, callback) {
  el.addEventListener(PointerEventType.pointerdown, (e) => {
    callback(e);
  });
}

/**
 * Listen for pointer cancel on element
 * @param {HTMLElement} el - Target element
 * @param {(e: PointerEvent) => void} callback - Handler function
 */
function cancelListener(el, callback) {
  el.addEventListener(PointerEventType.pointercancel, (e) => {
    callback(e);
  });
}

/**
 * Element spring transition animation 
 * @param {HTEMLElemtne} el element
 * @param {string} startCSSClassName start element css style
 * @param {string} endCSSClassName finish element css style
 * @param {number} duration duration of anmation (ms)
 * @param {string} springName spring type name (spring-light spring-medium spring-heavy)
 * @param {boolean} isOpen true open false element close
 */
function transistionAnimation(el, startCSSClassName, endCSSClassName = startCSSClassName, duration, springName = 'spring-light', isOpen){
  void el.offsetHeight;
  if (isOpen) {
    el.classList.add(springName, startCSSClassName);
    el.classList.remove(endCSSClassName);
  } else {
    setTimeout(() => {
      if(startCSSClassName === endCSSClassName){
        if(!isOpen){
          el.classList.add('ease-out', endCSSClassName);
        }
      }else{
        el.classList.remove(springName, startCSSClassName);
        if(!isOpen){
          el.classList.add('ease-out', endCSSClassName);
        }
      }
    }, duration);
  }
}

/**
 * Gesture event lisenter
 * @param {HTMLElement} el 
 * @param {object} param1 
 * @returns 
 */
function gestureListener(el, {
  slowSwipeUp     = () => {},
  slowSwipeDown   = () => {},
  slowSwipeLeft   = () => {},
  slowSwipeRight  = () => {},
  quickSwipeUp    = () => {},
  quickSwipeDown  = () => {},
  quickSwipeLeft  = () => {},
  quickSwipeRight = () => {},
  interrupt       = () => {},
  simpleClick     = () => {},
  longClick       = () => {},
} = {}) {

  let startX = 0, startY = 0, startTime = 0;
  let state = 'idle';

  const THRESHOLD_DURATION   = 500;
  const THRESHOLD_DISTANCE_Y = 10;
  const THRESHOLD_DISTANCE_X = 30;

  /* ---------- Pointer Up ---------- */
  const handlePointerUp = (e) => {
    if (state !== 'dragging') return;
    state = 'idle';

    const deltaX  = startX - e.clientX;
    const deltaY  = startY - e.clientY;
    const absX    = Math.abs(deltaX);
    const absY    = Math.abs(deltaY);
    const elapsed = Date.now() - startTime;

    if (absX < THRESHOLD_DISTANCE_X && absY < THRESHOLD_DISTANCE_Y) {
      if (elapsed > THRESHOLD_DURATION) {
        longClick(e);
      } else {
        simpleClick(e);
      }
      reset();
      return; 
    }

   
    const isQuick = elapsed < THRESHOLD_DURATION;

    if (absX > absY) {
      
      if (absX < THRESHOLD_DISTANCE_X) { reset(); return; } 
      if (deltaX > 0) { 
        isQuick ? quickSwipeLeft(e) : slowSwipeLeft(e);
      } else {           
        isQuick ? quickSwipeRight(e) : slowSwipeRight(e);
      }
    } else {

      if (absY < THRESHOLD_DISTANCE_Y) { reset(); return; } 
      if (deltaY > 0) { 
        isQuick ? quickSwipeUp(e) : slowSwipeUp(e);
      } else {         
        isQuick ? quickSwipeDown(e) : slowSwipeDown(e);
      }
    }

    reset();
  };


  const handlePointerMove = (e) => {
    if (state !== 'dragging' || !e.isPrimary) return;
    e.preventDefault();
  };

  const handlePointerCancel = (e) => {
    if (state !== 'dragging') return;
    state = 'idle';
    interrupt(e);
    reset();
  };

  const handlePointerDown = (e) => {
    if (!e.isPrimary || state !== 'idle') return;
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    startTime = Date.now();
    state = 'dragging';
    el.setPointerCapture(e.pointerId);
  };

  const reset = () => {
    startX = startY = startTime = 0;
  };

  el.addEventListener('pointerdown',   handlePointerDown, { passive: false });
  el.addEventListener('pointermove',   handlePointerMove, { passive: false });
  el.addEventListener('pointerup',     handlePointerUp);
  el.addEventListener('pointercancel', handlePointerCancel);

  return () => {
    el.removeEventListener('pointerdown',   handlePointerDown);
    el.removeEventListener('pointermove',   handlePointerMove);
    el.removeEventListener('pointerup',     handlePointerUp);
    el.removeEventListener('pointercancel', handlePointerCancel);
  };
}

// gestureListener(bottomNav, {
//   quickSwipeUp: () => showDesktop(),
//   simpleClick:  () => goHome(),
// });

/**
 * Snack bar
 * @param {string} text tip string
 * @param {string} icon path of icon when snack bar show 
 * @param {HTMLElement} el show element
 * @param {*} cssClass snack bar's css style
 * @param {number} duration duration time ms
 */
function snackBar(text, icon = '', el, cssClass, duration) {
  if (!document.getElementById('snackbar-anim-style')) {
    const style = document.createElement('style');
    style.id = 'snackbar-anim-style';
    style.textContent = `
      @keyframes snackFadeIn {
        from { opacity: 0; transform: translate(-50%, 20px); }
        to   { opacity: 1; transform: translate(-50%, 0); }
      }
      @keyframes snackFadeOut {
        from { opacity: 1; transform: translate(-50%, 0); }
        to   { opacity: 0; transform: translate(-50%, 20px); }
      }
    `;
    document.head.appendChild(style);
  }

  const snack = document.createElement('div');
  snack.classList.add(cssClass);
  snack.innerHTML = `<div class="snack-bar" style="display: flex; align-items: center; height: 48px; padding: 0 16px;">
      <div style="width: 24px;padding=10px; height: 24px; background-image: url('${icon}'); background-repeat: no-repeat; background-position: center; background-size: contain; margin-right: 12px; flex-shrink: 0;"></div>
      <span style="flex: 1; text-align: center;padding=10px;">${text}</span>
    </div>`;

  snack.style.animation = 'snackFadeIn 0.3s ease forwards';

  el.prepend(snack);

  setTimeout(() => {
    snack.style.animation = 'snackFadeOut 0.3s ease forwards';
    snack.addEventListener('animationend', () => {
      snack.remove();
    });
  }, duration);
}

/**
 * Notice banner 
 * @param {string} innerHtml notice banner inner html
 * @param {HTMLElement} el where notice banner show
 * @param {number} duration duration time ms
 */
function noticeBanner(innerHtml, el, duration, infoList = []) {
  infoList.unshift(innerHtml);
  const slideBanner = (banner, dirction) => {
    if(dirction === 'left'){
      banner.style.transform = 'translate(-200%, -50%)';
      infoList.pop();
    }else if(dirction === 'right'){
      banner.style.transform = 'translate(200%, -50%)';
      infoList.pop();
    }else if(dirction === 'up'){
      banner.style.transform = 'translate(-50%, -1000%)';
      infoList.pop();
    }
  };

  const existing = el.querySelector('.notice-banner');
  if (existing) {
    existing.innerHTML = innerHtml;
    clearTimeout(Number(existing.dataset.timer));
    const timer = setTimeout(() => {
      existing.style.transform = 'translate(-50%, -150%)';
      existing.style.opacity = '0';
      setTimeout(() => existing.remove(), 300);
    }, duration);
    existing.dataset.timer = timer;
    return;
  }
  const banner = document.createElement('div');
  banner.classList.add('notice-banner');
  banner.innerHTML = innerHtml;
  banner.style.cssText = `
    background-color: rgba(146, 146, 146, 0.4);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    width: 95%;
    height: 5%;
    border-radius: 16px;
    position: absolute;
    top: 5%;
    left: 50%;
    transform: translate(-50%, -150%);
    opacity: 0;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    padding: 0 16px;
    box-sizing: border-box;
    z-index: 9999;
  `;
  gestureListener(banner, {
    slowSwipeLeft: () => {
      console.log('left');
      slideBanner(banner, 'left');
    },
    slowSwipeRight: () => {
      console.log('right');
      slideBanner(banner, 'right');
    },
    quickSwipeLeft: () => {
      console.log('quickSwipeLeft');
      slideBanner(banner, 'left');
    },
    quickSwipeRight: () => {
      console.log('right');
      slideBanner(banner, 'right');
    },
    quickSwipeUp: () => {
      console.log('up');
      slideBanner(banner, 'up');
    },
    slowSwipeUp: () => {
      console.log('up');
      slideBanner(banner, 'up');
    }
  });
  el.prepend(banner);
  banner.offsetHeight;
  requestAnimationFrame(() => {
    banner.style.transform = 'translate(-50%, -50%)';
    banner.style.opacity = '1';
  });
  const timer = setTimeout(() => {
    banner.style.transform = 'translate(-50%, -150%)';
    banner.style.opacity = '0';
    setTimeout(() => banner.remove(), 300);
  }, duration);
  banner.dataset.timer = timer;
}
/**
 * Find position of element 
 * @param {HTMLElement} el the element which you want to find
 * @returns {DOMRect} the position of element
 */
function findElPos(el){
  return el.getBoundingClientRect();
}
/**
 * Make app card from orginal to full of screen
 * @param {HTMLElement} el element
 */
function elUnfoldAnimation(el){
  const computed = getComputedStyle(el);
  el.style.position = 'fixed';
  el.style.top = computed.top;
  el.style.left = computed.left;

  const animation = el.animate([
    {
      width: computed.width,
      height: computed.height,
      borderRadius: computed.borderRadius,
    },
    {
      width: '100vw',
      height: '100vh',
      borderRadius: '0',
    }
  ], {
    duration: 500,
    easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    fill: 'forwards',
  });

  animation.onfinish = () => {
    el.style.width = '100vw';
    el.style.height = '100vh';
    el.style.borderRadius = '0';
  };
  
}
/**
 * Set elements position
 * @param {HTMLElement} el 
 * @param {} rect 
 */
function setElPos(el, rect){
  el.style.position = 'fixed';
  el.style.top = `${rect.top}px`;
  el.style.left = `${rect.left}px`;
}
/**
 * Make app card from full of screen to orginal
 * @param {HTMLElement} el element
 */
function elFoldAnimation(el) {
  const computed = getComputedStyle(el);
  
  const animation = el.animate([
    {
      width: computed.width,
      height: computed.height,
      borderRadius: computed.borderRadius,
    },
    {
      width: el.dataset.initialWidth || '100px',  
      height: el.dataset.initialHeight || '100px',
      borderRadius: el.dataset.initialBorderRadius || '5%',
    }
  ], {
    duration: 500,
    easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    fill: 'forwards',
  });

  animation.onfinish = () => {
    el.style.position = '';
    el.style.top = '';
    el.style.left = '';
    el.style.width = '';
    el.style.height = '';
    el.style.borderRadius = '';
  };
}
/**
 * Flowing light visual effect
 * @param {HTMLElement} el element
 */
function attachPressGlow(el) {
  if (!document.getElementById('press-glow-style')) {
    const style = document.createElement('style');
    style.id = 'press-glow-style';
    style.textContent = `
      [data-press-glow] {
        position: relative;
        overflow: hidden;
        touch-action: none;
      }
      [data-press-glow]::before {
        content: '';
        position: absolute;
        width: 600px;
        height: 600px;
        border-radius: 50%;
        background: radial-gradient(
          circle,
          rgba(255, 255, 255, 0.35) 0%,
          rgba(255, 255, 255, 0.15) 25%,
          rgba(255, 255, 255, 0.05) 50%,
          transparent 70%
        );
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
        left: var(--glow-x, 50%);
        top: var(--glow-y, 50%);
        pointer-events: none;
        transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                    opacity 0.4s ease-out;
        will-change: transform, opacity;
      }
      [data-press-glow].pressed::before {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
        transition: transform 0.15s ease-out,
                    opacity 0.15s ease-out;
      }
    `;
    document.head.appendChild(style);
  }

  el.setAttribute('data-press-glow', '');

  function updateGlow(e) {
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--glow-x', (e.clientX - rect.left) + 'px');
    el.style.setProperty('--glow-y', (e.clientY - rect.top) + 'px');
  }

  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    updateGlow(e);
    el.classList.add('pressed');
    el.setPointerCapture(e.pointerId);
  });

  el.addEventListener('pointermove', (e) => {
    if (!el.classList.contains('pressed')) return;
    updateGlow(e);
  });

  el.addEventListener('pointerup', () => el.classList.remove('pressed'));
  el.addEventListener('pointercancel', () => el.classList.remove('pressed'));
}
