export function elUnfoldAnimationExp(el) {
  const rect = el.getBoundingClientRect();
  
  const computed = getComputedStyle(el);
  el.dataset.foldTop = rect.top + 'px';
  el.dataset.foldLeft = rect.left + 'px';
  el.dataset.initialWidth = rect.width + 'px';
  el.dataset.initialHeight = rect.height + 'px';
  let borderRadius = computed.borderRadius;
  el.dataset.initialBorderRadius = '12px';

  const placeholder = document.createElement('div');
  placeholder.id = 'quickgestureappcardplaceholder';
  placeholder.style.width = rect.width + 'px';
  placeholder.style.height = rect.height + 'px';
  placeholder.style.visibility = 'hidden';
  placeholder.dataset.placeholderFor = el.getAttribute('id') || String(rect.top);
  el.parentNode.insertBefore(placeholder, el);

  el.style.position = 'fixed';
  el.style.top = rect.top + 'px';
  el.style.left = rect.left + 'px';
  el.style.width = rect.width + 'px';
  el.style.height = rect.height + 'px';
  el.style.margin = '0';
  el.style.zIndex = '999999';
  

  const animation = el.animate([
    {
      width: rect.width + 'px',
      height: rect.height + 'px',
      top: rect.top + 'px',
      left: rect.left + 'px',
      borderRadius: '0',
    },
    {
      width: '100vw',
      height: '100vh',
      top: '0px',
      left: '0px',
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
    el.style.top = '0';
    el.style.left = '0';
  };
}

export function gestureListenerExp(el, {
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
export function findElPosExp(el){
  return el.getBoundingClientRect();
}
export function setElPosExp(el, rect){
  el.style.position = 'fixed';
  el.style.top = `${rect.top}px`;
  el.style.left = `${rect.left}px`;
}
export function elFoldAnimationExp(el) {
  const targetTop = el.dataset.foldTop || (el.getBoundingClientRect().top + 'px');
  const targetLeft = el.dataset.foldLeft || (el.getBoundingClientRect().left + 'px');
  const targetWidth = el.dataset.initialWidth || (el.getBoundingClientRect().width + 'px');
  const targetHeight = el.dataset.initialHeight || (el.getBoundingClientRect().height + 'px');
    let targetBorderRadius = el.dataset.initialBorderRadius;
    if (!targetBorderRadius) {
        const computed = getComputedStyle(el);
        targetBorderRadius = computed.borderRadius || '0px';
    }
  const animation = el.animate([
    {
      top: '0px',
      left: '0px',
      width: '100vw',
      height: '100vh',
      borderRadius: '0px',
    },
    {
      top: targetTop,
      left: targetLeft,
      width: targetWidth,
      height: targetHeight,
      borderRadius: targetBorderRadius,
    }
  ], {
    duration: 500,
    easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    fill: 'forwards',
  });

  animation.onfinish = () => {
    el.style.removeProperty('position');
    el.style.removeProperty('top');
    el.style.removeProperty('left');
    el.style.removeProperty('width');
    el.style.removeProperty('height');
    el.style.removeProperty('border-radius');
    el.style.removeProperty('z-index');
    el.style.removeProperty('margin');

    let placeholder;
    placeholder = document.getElementById('quickgestureappcardplaceholder');
    if(placeholder !== null) placeholder.remove();
    if(placeholder === null){
      const host = el.host || el.getRootNode().host; 
      
      const rootNode = el.getRootNode();
      if (rootNode instanceof ShadowRoot) {
          placeholder = rootNode.getElementById('quickgestureappcardplaceholder');
      }
      
      if (placeholder) {
          placeholder.remove();
      }
    }
    
  };
}
export function addEaseAnimationExp(el){
    el.style.transition = 'all 0.3s ease';
}
export function draggableElementExp(el, scale) {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let translateX = 0;
  let translateY = 0;

  el.addEventListener('dragstart', (e) => e.preventDefault());

  const dragStart = (e) => {
    if (e.button !== 0) return;

    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;

    el.style.zIndex = '999999';
    el.style.userSelect = 'none';
    el.style.cursor = 'grabbing';
  };

  const drag = (e) => {
    if (!isDragging) return;

    translateX = e.clientX - startX;
    translateY = e.clientY - startY;

    el.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  };

  const endDrag = () => {
    isDragging = false;
    el.style.userSelect = '';
    el.style.cursor = '';
  };

  el.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', endDrag);

  el.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      dragStart({ button: 0, clientX: t.clientX, clientY: t.clientY });
    }
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      const t = e.touches[0];
      drag({ clientX: t.clientX, clientY: t.clientY });
    }
  }, { passive: true });

  document.addEventListener('touchend', endDrag);
}
export function pinchInOrOutOfTwoFingersLisenterExp(el){

  let startDistance = 0;
  let currentScale = 1;

  function getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  el.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (e.touches.length === 2) {
      startDistance = getDistance(e.touches[0], e.touches[1]);
    }
  });

  el.addEventListener('touchmove', (e) => {
    e.preventDefault();

    if (e.touches.length !== 2) return;

    e.preventDefault();

    const distance = getDistance(e.touches[0], e.touches[1]);
    const scale = distance / startDistance;

    if (scale > 1) {
      el.style.transform = `scale(${scale})`;
      console.log('pinch out', scale);
    } else if (scale < 1) {
      el.style.transform = `scale(${scale})`;
      console.log('pinch in', scale);
    }

    currentScale = scale;
  });
}
export function isKeyDown(key){
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === key) {
      return true;
    }
    return false;
  });
}
export function wheelLisenterExp(el, uprollCallback, downrollCallback){
  el.addEventListener('wheel', (e) => {
    if (e.deltaY > 0) {
      uprollCallback();
    } else if (e.deltaY < 0) {
      downrollCallback();
    }
  });
}