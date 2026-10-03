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
 * make the config of products come ture
 */
(function setProductSize(){
    const width = window.innerWidth;
    if(width <= 768){
        product.style.height = '100vh';
        product.style.width = '100%';
        dragBlock.style.height = '100vh';
        dragBlock.style.width = '100vw';
        product.style.borderRadius = productSize.borderRadius;
        product.style.backgroundColor  = productSize.backgroundColor;
    }else{
        product.style.height = productSize.height;
        product.style.width = productSize.width;
        product.style.borderRadius = productSize.borderRadius;
        product.style.backgroundColor  = productSize.backgroundColor;
        dragBlock.style.height = productSize.height;
        dragBlock.style.width = productSize.width;
        dragBlock.style.borderRadius = productSize.borderRadius;
    }

})();

/**
 * setting wall paper at first
 */
(function setWallPaper(){
    product.style.backgroundImage = 'url(../../resources/img/wallpaper.jpg)';
    product.style.backgroundSize = 'cover';
    product.style.backgroundRepeat = 'no-repeat';
})();

function setBottomNav(){

}

/**
 * Set bottom navigation height
 * @param {int} height bottom navigation height 
 */
function setBottomNavHeight(height){
    bottomNavBar.style.offsetHeight = height;
}

/**
 * Set place holder height
 * @param {HTMLElement} height place holder height
 */
function setPlaceHolderHeight(height){
    placeHolder.style.offsetHeight = height;
}

let handleShadeClick = null;
function splitUpwardInBottomNav(runningAppList, bottomNav){
    let state = 'idle'; // 'dragging' | 'preview'
    let THRESHOLD_DURATION = 500; // it is dragging if pointer down last more then 500 ms
    let THRESHOLD_DISTANCE_Y = 10;
    let THRESHOLD_DISTANCE_X = 30;
    let productHeigth = product.style.height;
    let productWidth = product.style.width;
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    
    const getFrontDeskTask = () => {
        let frontTask = null;
        runningAppList.forEach(task => {
            if(task.isShowNow == true){
                frontTask = task;
            }
        });
        // console.log(frontTask);
        return frontTask;
    };

    const isShowNoRecentTaskTagInShade = (isShow) => {
        if(shade.style.display === 'none') return;
        if(isShow){
            shade.innerHTML = `<h4 class="have-not-recent-task">${noRecentTaskTag}</h4>`
        }else{
            shade.innerHTML = '';
        }
    };

    let mainActivityPreviewCreated = false;
    const slowDragEvent = (deltaX, deltaY) => { // user slow dragging
        let frontTask = getFrontDeskTask();
        if(frontTask === null && !mainActivityPreviewCreated){ // hav't front task
            console.log('slow drag not front task ');
            let offSet = 0;
            let zIndex = 96;
            let perviewCardScaleY = 0.7;
            let _ = 0.08 * ((100 - runningAppList.length) / 100);
            isShowShade(true);
            console.log(`runningAppList.length${runningAppList.length}`);
            if(runningAppList.length === 0){
                console.log(`runningAppList.length${runningAppList.length}`);
                isShowNoRecentTaskTagInShade(true);
            }else{
                console.log(`runningAppList.length${runningAppList.length}`);
                runningAppList.forEach(taskInfo => {
                    console.log(taskInfo);
                    const mainActivityPreview = document.createElement('div');
                    mainActivityPreview.innerHTML = `<div class="preview-head">
                                                        <div class="preview-icon" style="background-image: url(${taskInfo.appIconBg});"></div>
                                                        <div class="preview-text">${taskInfo.appName}</div>
                                                    </div>
                                                    <div class="preview-page"></div>`;
                    mainActivityPreview.classList.add('main-activity');
                    mainActivityPreview.dataset.packageName = taskInfo.packageName;
                    mainActivityPreview.style.zIndex = zIndex;
                    mainActivityPreview.style.transition = 'all 0.3s ease';
                    mainActivityPreview.style.transform = `translate(${offSet}px, 0px) scale(0.7, ${perviewCardScaleY})`;
                    
                    statusAndNavView.prepend(mainActivityPreview);
                    offSet -= product.offsetWidth * _;
                    perviewCardScaleY *= 0.95;
                    _ *= 0.8;
                    backgroundApp.push(mainActivityPreview);
                    mainActivityPreview.addEventListener(PointerEventType.pointermove, (e) => mAPointerMove(e, mainActivityPreview, runningAppList));
                    mainActivityPreview.addEventListener(PointerEventType.pointerup, (e) => mAPointerUp(e, runningAppList, mainActivityPreview));
                    mainActivityPreview.addEventListener(PointerEventType.pointerdown, (e) => mAPointerDown(e, mainActivityPreview));
                    console.log(backgroundApp);
                });
            }
            mainActivityPreviewCreated = true;
        }else{ // have front task 
            return;
            if (frontTask === null || frontTask.mainActivity == null) {
                return;
            }
            const mainActivity = frontTask.mainActivity;
            isShowShade(true);
            isShowStatusBar(false);
            // isShowAppOnDesktop(false);
            mainActivity.style.transition = 'none';
            const rawProgress = Math.min(1, Math.max(0, Math.abs(deltaY) / 400));
            const progress = rawProgress ** 2;
            const scale = 1 - progress * 0.5;
            // var moveY = deltaY + (product.offsetHeight * 0.1);
            // console.log(moveY);
            // mainActivity.style.zIndex = 96;
            mainActivity.style.transform = `translate(${-deltaX}px, ${-deltaY}px) scale(${scale})`;
            mainActivity.style.backgroundColor = 'transparent';
            mainActivity.innerHTML = `<div class="preview-head">
                                            <div class="preview-icon" style="background-image: url(${frontTask.appIconBg});"></div>
                                            <div class="preview-text">${frontTask.appName}</div>
                                        </div>
                                        <div class="preview-page"></div>`;
        }
    };

    const pointerUpPreviewEvent = (taskInfo) => {
        currentX = 0;
        console.log(backgroundApp);
        backgroundApp = [];
        const _cMA = taskInfo.mainActivity;
        _cMA.style.borderRadius = '32px';
        let zIndex = 95;
        let perviewCardScaleY = 0.7 * 0.95;
        let _ = 0.08 * ((100 - runningAppList.length) / 100);
        let offSet = 0;
        offSet -= product.offsetWidth * _;

        _cMA.removeEventListener(PointerEventType.pointermove, mAPointerMove);
        _cMA.removeEventListener(PointerEventType.pointerup, mAPointerUp);
        _cMA.removeEventListener(PointerEventType.pointerdown, mAPointerDown);

        _cMA.addEventListener(PointerEventType.pointermove, (e) => mAPointerMove(e, _cMA, runningAppList));
        _cMA.addEventListener(PointerEventType.pointerup, (e) => mAPointerUp(e, runningAppList, _cMA));
        _cMA.addEventListener(PointerEventType.pointerdown, (e) => mAPointerDown(e, _cMA));
        backgroundApp.push(_cMA);
        console.log('[Event Bindng] pointer events attached to:', _cMA, {
            move: typeof mAPointerMove,
            up: typeof mAPointerUp,
            down: typeof mAPointerDown
        });
        runningAppList.forEach(task => {
            if(task !== taskInfo){
                console.log(task);
                const mainActivityPreview = document.createElement('div');
                mainActivityPreview.classList.add('main-activity');
                mainActivityPreview.style.zIndex = zIndex;
                // mainActivityPreview.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                mainActivityPreview.style.borderRadius = '32px';
                mainActivityPreview.style.transition = 'all 0.3s ease';
                mainActivityPreview.style.transform = `translate(${offSet}px, 0px) scale(0.7, ${perviewCardScaleY})`;
                mainActivityPreview.innerHTML = `<div class="preview-head">
                                            <div class="preview-icon" style="background-image: url(${task.appIconBg});"></div>
                                            <div class="preview-text">${task.appName}</div>
                                        </div>
                                        <div class="preview-page"></div>`;
                // mainActivityPreview.dataset.packageName = task.packageName;
                statusAndNavView.prepend(mainActivityPreview);
                offSet -= product.offsetWidth * _;
                perviewCardScaleY *= 0.95;
                _ *= 0.8;
                backgroundApp.push(mainActivityPreview);
                console.log(backgroundApp);
                mainActivityPreview.addEventListener(PointerEventType.pointermove, (e) => mAPointerMove(e, mainActivityPreview, runningAppList));
                mainActivityPreview.addEventListener(PointerEventType.pointerup, (e) => mAPointerUp(e, runningAppList, mainActivityPreview));
                mainActivityPreview.addEventListener(PointerEventType.pointerdown, (e) => mAPointerDown(e, mainActivityPreview));
            }
        });
    };

    const pointerUpFrontAppEvent = (task) => {
        if(getFrontDeskTask()) return;
        if(task === null || task.mainActivity === null) return;
        const mainActivity = task.mainActivity;
        
        mainActivity.style.transition = 'all 0.3s ease';
        mainActivity.style.transform = `translate(0px, 0px) scale(0.7)`;
        mainActivity.style.zIndex = 98;
    }

    let mAStartX = 0;
    let mAStartY = 0;
    let mAStartTime = 0;
    let mAState = 'idle';
    let lastPointerX = 0;
    let currentX = 0; 
    const mAPointerDown = (e, el) => {
        if (!e.isPrimary || mAState !== 'idle') return;
        mAStartX = e.clientX;
        mAStartY = e.clientY;
        mAStartTime = Date.now();
        mAState = 'dragging';
        lastPointerX = e.clientX;
        if (currentX === null && backgroundApp.length > 0) {
            const style = getComputedStyle(backgroundApp[0]);
            const matrix = new DOMMatrix(style.transform);
            currentX = matrix.m41; 
        }
        console.log(mAState);

        el.setPointerCapture(e.pointerId);
        // mA click event

    };
    
    const mAPointerUp = (e, runningAppList, el) => {
        if (mAState !== 'dragging') return;
        mAState = 'idle';
        const deltaY = mAStartY - e.clientY; 
        const deltaX = mAStartX - e.clientX;
        const elapsed = Date.now() - mAStartTime;
        const distanceY = deltaY;
        const distanceX = Math.abs(deltaX);
        
        console.log(mAState);
        // mA up event
        // console.log('ma up event');
        // if(runningAppList.length === 1){ // single task 
        //     el.style.transition = 'all 0.3s ease';
        //     el.style.transform = `translate(0px, 0px) scale(0.7)`; //************************************************************* */
        // }else{ // mutil tasks 

        // }

        // if(Date.now() - mAStartTime < 500){ // click ma event
        //     console.log('click ma');
        //     console.log(runningAppList);
        //     // el.innerHTML = '';
        //     // el.style.backgroundColor = 'white';
        //     // el.style.transform = `translate(0px, 0px) scale(1)`;
        //     runningAppList.forEach(task => {
        //         if(el.dataset.packageName == task.packageName){
        //             task.mainActivity = el;
        //             console.log(task.mainActivity);
        //             appList.forEach(app => {
        //                 if(app.packageName == task.packageName){
        //                     // handleShadeClick();
        //                     // setTimeout(() => {
        //                     //     launchApp(app, task.appIcon);
        //                     // }, 300);
                            
        //                     // task.mainActivity.innerHTML = '';
        //                     // el.innerHTML = '';
        //                     // el.style.backgroundImage = '';
        //                     // el.style.backgroundColor = 'white';
        //                     // el.style.transition = 'all 0.3s ease';
        //                     // el.style.transform = `translate(0px, 0px) scale(1)`;
        //                     // el.style.zIndex = '98';
        //                 }
        //             });
        //         }
        //     });
        //     // isShowShade(false);
        // }

        mAStartX = null;
        mAStartY = null;
        mAStartTime = 0;
    };

    // let lastScale = 0.7;
    let bgAppOffset = product.offsetWidth * 0.08 * ((100 - runningAppList.length) / 100);
    const PARALLAX_FACTOR = 0.6;
    
    const mAPointerMove = (e, el, runningAppList) => {
        if (mAState !== 'dragging' || !e.isPrimary) return;
        e.stopPropagation();
        const deltaY = mAStartY - e.clientY;
        const deltaX = e.clientX - lastPointerX;
        currentX += deltaX;
        lastPointerX = e.clientX;
        const elapsed = Date.now() - mAStartTime;
        // console.log(el);
        // move event
        // dragging main activity
        console.log(runningAppList);
        if(runningAppList.length === 1){
            return;
        }
        for(let i = 0; i < backgroundApp.length; i++){
            const baseScale = 0.7 * Math.pow(0.95, i);
            const minScale = 0.7;
            const maxScale = baseScale;
            
            const decay = 0.95;
            const speedFactor = Math.pow(decay, i);
            
            let progress;
            if (currentX >= 0) {
              
                const rawProgress = Math.min(1, currentX / 1000);
                progress = rawProgress * speedFactor;
            } else {
                const rawProgress = Math.min(1, -currentX / 800);
                progress = rawProgress * 0.2 * speedFactor;
            }
            
            const scale = maxScale - (maxScale - minScale) * progress;
            const baseSpacing = 300;
            const extraSpacing = Math.max(Math.min(0, currentX) * 0.1, Math.max(0, currentX) * 0.05);
            const dynamicSpacing = baseSpacing + extraSpacing;
            const layerX = dynamicSpacing * i;
            
            const minTranslateX = 50 * i;
            let translateX = currentX * 0.5 - layerX;
            translateX = Math.max(translateX, -minTranslateX);
            if(currentX > backgroundApp.length * product.offsetWidth * 0.7){
                console.log('ma unmove');
                return;
            }
            console.log(`currentX ${currentX}`);
            backgroundApp[i].style.transition = 'none';
            backgroundApp[i].style.transform = `translate(${translateX}px, 0px) scale(${scale})`;
            console.log(`back app ${i} :${backgroundApp[i].style.transform}`);
        }
        // backgroundApp.forEach(bgApp => {
            
        // });
    };

    handleShadeClick = function() { // user click shade
        mainActivityPreviewCreated = false;
        shade.innerHTML = '';
        mAState = 'idle';
        currentX = 0;
        lastPointerX = 0;
        mAStartX = 0;
        mAStartY = 0;
        mAStartTime = 0;
        isShowStatusBar(true);
        const allCards = document.querySelectorAll('.main-activity');
        allCards.forEach(el => {
            el.style.transition = 'all 0.3s ease';
            el.style.transform = `translate(0px, ${product.offsetHeight || 500}px)`;
        });
        backgroundApp = [];
        console.log(currentX);
        if(getFrontDeskTask() !== null){ // exit have front app
            let task = getFrontDeskTask();
            const mainActivity = task.mainActivity;
            mainActivity.cssText = '';
            mainActivity.innerHTML = '';
            setTimeout(() =>{
                mainActivity.style.cssText = `background-image: url(${task.appIconBg});`;
                mainActivity.classList.add('app-icon');
            }, 300);
            mainActivity.id = '';
            task.isShowNow = false;
            task.mainActivity = null;
            
            statusAndNavView.querySelectorAll('.main-activity').forEach(el => {
                el.style.transition = 'all 0.3s ease';
                el.style.transform = `translate(${-product.offsetWidth}px, 0px) scale(1)`;
            });
    
            setTimeout(() => {
                statusAndNavView.querySelectorAll('.main-activity').forEach(el => {
                    el.remove();                
                });
            }, 300);
            
            console.log(`task ${task}`);
        }else{ // exit hav't front app
            statusAndNavView.querySelectorAll('.main-activity').forEach(el => {
                el.style.transition = 'all 0.3s ease';
                el.style.transform = `translate(${-product.offsetWidth}px, 0px) scale(1)`;
            });
            setTimeout(() => {
                statusAndNavView.querySelectorAll('.main-activity').forEach(el => {
                    el.remove();                
                });
            }, 300);
        }
        isShowShade(false);
    };

    handleShadeClick = handleShadeClick;

    const handlePointerDown = (e) => {
        if (!e.isPrimary || state !== 'idle') return;
        startX = e.clientX;
        startY = e.clientY;
        startTime = Date.now();
        state = 'dragging';
        bottomNav.setPointerCapture(e.pointerId);
        console.log('pointerdown: start tracking');
        // click events

    };

    const handlePointerUp = (e) => {
        if (state !== 'dragging') return;
        const deltaY = startY - e.clientY; 
        const deltaX = startX - e.clientX;
        const elapsed = Date.now() - startTime;
        const distanceY = deltaY;
        const distanceX = Math.abs(deltaX);
        state = 'idle';
        
        if (distanceY < THRESHOLD_DISTANCE_Y && distanceX < THRESHOLD_DISTANCE_X) {
            console.log('gesture cancelled: insufficient distance');
            return;
        }
        if(distanceX > distanceY){
            if(elapsed <= THRESHOLD_DURATION && distanceX > THRESHOLD_DISTANCE_X){ // quick swip in x
                console.log(`quick release in x: ${distanceX}px in ${elapsed}ms`);

            }else{ // slow swipe in x
                console.log(`slow release in x: ${distanceX}px in ${elapsed}ms`);

            }
        }else{
            if (elapsed <= THRESHOLD_DURATION && distanceY > THRESHOLD_DISTANCE_Y) { // quick swipe up
                console.log(`fast swipe: ${distanceY}px in ${elapsed}ms`);
                closeApp(getFrontDeskTask(), runningAppList);
                isShowShade(false);
                isShowStatusBar(true);
            } else if (elapsed >= THRESHOLD_DURATION && distanceY > THRESHOLD_DISTANCE_Y) { // slow swipe up
                // unsuport 
                return;
                console.log(`slow release: ${distanceY}px in ${elapsed}ms`);
                if(getFrontDeskTask() !== null){
                    pointerUpFrontAppEvent(getFrontDeskTask());
                    pointerUpPreviewEvent(getFrontDeskTask(), e);
                    // closeApp(getFrontDeskTask(), runningAppList);
                    // return;
                }else{
                    
                }
            }
        }

        startX = null;
        startY = null;
        startTime = 0;
    };

    const handlePointerMove = (e) => {
        if (state !== 'dragging' || !e.isPrimary) return;
        const deltaY = startY - e.clientY;
        const deltaX = startX - e.clientX;
        const elapsed = Date.now() - startTime;
        // console.log(`slow drag : y ${deltaY}px, x ${deltaX}px, ${elapsed}ms`);
        // slow drag event
        slowDragEvent(deltaX, deltaY);
    };

    const handlePointerCancel = () => {
        if (state !== 'dragging') return;
        state = 'idle';
        // interrupt events

        startX = null;
        startY = null;
        startTime = 0;
    };

    shade.addEventListener(PointerEventType.pointerdown, handleShadeClick);

    bottomNav.addEventListener(PointerEventType.pointerdown, handlePointerDown);
    bottomNav.addEventListener(PointerEventType.pointermove, handlePointerMove);
    bottomNav.addEventListener(PointerEventType.pointerup, handlePointerUp);
    bottomNav.addEventListener(PointerEventType.pointercancel, handlePointerCancel);
}

/**
 * Hide app on desktop
 * @param {boolean} isShow true show, false hide
 */
function isShowAppOnDesktop(isShow){
    if(!isShow){
        desktopAppGrid.style.opacity = '0';
    }else{
        desktopAppGrid.style.opacity = '1';
    }
}

/**
 * Show status bar selectly
 * @param {boolean} isShow show status bar if true 
 */
function isShowStatusBar(isShow){
    if(!isShow){
        statusBar.classList.add('transparent');
        isShowShade(true);
    } else {
        statusBar.classList.remove('transparent');
        isShowShade(false);
    }
}

/**
 * Show shade layer
 * @param {boolean} isShow true show | false not show
 */
function isShowShade(isShow){
    if(isShow){
        shade.style.display = 'block';
        shade.innerHTML = `<qs-liquid-glass id="clear-btn">
                                <div>
                                    <small>clear all</small>
                                </div>
                           </qs-liquid-glass>`;
        const btn = document.getElementById('clear-btn');
        btn.addEventListener(PointerEventType.pointerdown, (e) => {
            console.log('clear btn ok');
            // clearBtnFlag = true;
            e.stopPropagation();
            // const elements1 = document.querySelectorAll('.main-activity');
            // console.log(elements1);
            // elements1.forEach(mainActivity => {
            //     mainActivity.style.transition = 'all 0.3s ease';
            //     mainActivity.style.transform = `translate(0px, ${product.offsetHeight})`;
            // });
            // const elements2 = document.querySelectorAll('[id^="main-activity"]');
            // console.log(elements2);
            // elements2.forEach(mainActivity => {
            //     mainActivity.style.transition = 'all 0.3s ease';
            //     mainActivity.style.transform = `translate(0px, ${product.offsetHeight})`;
            // });
            // setTimeout(() => {

            // }, 300);
            handleShadeClick();
            backgroundApp = [];
            runningAppList.length = 0;
            console.log(runningAppList);
            console.log(backgroundApp);
        });
    }else{
        shade.style.display = 'none';
    }
}

/**
 * Add app icon and info on desktop
 * @param {array} appList installed apps list
 */
function initInstalledApp(appList){
    // const fragment = document.createDocumentFragment();
    appInfoMap.clear();
    let index = 0;
    appList.forEach(app => {
        if(app.index > index){
            index = app.index;
        }
    });
    desktop.style.width = product.offsetWidth * index;
    console.log(index);
    maxDesktopPage = index;
    for(let i = 0; i <= index; i++){
        const appGrid = document.createElement('div');
        appGrid.innerHTML = `<qs-grid class="desktop-app-grid" rows="7" gap="30px" data-index=${i + 1} style="left: ${i * product.offsetWidth}px"></qs-grid>`;
        // const grid = document.querySelector(`qs-grid[data-index="${index}"]`);
        // grid.style.left = `${index * product.offsetWidth}px`;
        desktop.appendChild(appGrid);
    }
    appList.forEach(app => {
        appInfoMap.set(app.packageName, app);
        const el = document.createElement('div');
        el.dataset.packageName = app.packageName;
        el.classList.add('item');

        const icon = document.createElement('div');
        icon.className = 'app-icon';
        icon.style.backgroundImage = `url("${app.appIcon}")`;
        icon.dataset.packageName = app.packageName;
        const name = document.createElement('div');
        name.className = 'app-name';
        name.textContent = app.appName;
        setGridPosition(el, app.row, app.column, app.heightCross, app.widthCross);
        el.append(icon, name);
        const grid = document.querySelector(`qs-grid[data-index="${app.index}"]`);
        // console.log(grid);
        grid.appendChild(el);
    });
    // desktopAppGrid.appendChild(fragment);
}

/**
 * Listening open app event and push the task info into the running app list
 */
function openAppListener(){
    desktop.addEventListener(PointerEventType.pointerdown, (e) => {
        const item = e.target.closest('.app-icon');
        if (!item) return;

        const packageName = item.dataset.packageName;
        const appInfo = appInfoMap.get(packageName);
        if (!appInfo) return;
        console.log(appInfo);
        tempTaskInfo = launchApp(appInfo, item);
    });
}

/**
 * The things it will be when user click app to start it 
 * @param {AppInfo} appInfo app info 
 * @param {HTMLElement} app element in desktop 
 * @return {TaskInfo} taskInfo 
 */
function launchApp(appInfo, el){
    
    const existingTask  = runningAppList.find(
        app => app.packageName === appInfo.packageName
    );
    if (existingTask) {
        existingTask.isShowNow = true;
        playLaunchAnimation(el, existingTask);
        el.id = `main-activity${taskId}`;
        existingTask.mainActivity = el;
        const index = runningAppList.indexOf(existingTask);
        if (index > -1) {
            runningAppList.unshift(runningAppList.splice(index, 1)[0]);
        }
        console.log('exixting task launch success');
        return existingTask;
    }
    taskId++;
    el.id = `main-activity${taskId}`;
    const iconRect = el.getBoundingClientRect();
    const containerRect = statusAndNavView.getBoundingClientRect();
    const startX = iconRect.left - containerRect.left;
    const startY = iconRect.top  - containerRect.top;
    console.log(startX);
    console.log(startY);
    console.log(iconRect.height);
    console.log(iconRect.width);
    let taskInfo = new TaskInfo(appInfo.packageName, el /* appIcon */, 
                                    appInfo.appName, taskId, appInfo.column, appInfo.row, 
                                    appInfo.widthCross, appInfo.heightCross, el, true /* isShowNow */,
                                    iconRect.height, iconRect.width, startY, startX, appInfo.appIcon);
    runningAppList.unshift(taskInfo);
    console.log(taskInfo);
    
    playLaunchAnimation(el, taskInfo);
    // statusAndNavView.prepend(clone);

    void el.offsetHeight;

    // el.classList.add('ease-in');
    // el.style.cssText = '';
    // el.style.opacity = '0';
    console.log(runningAppList);
    return taskInfo;
}

/**
 * Get current front app task infomations 
 * @param {array} runningAppList 
 * @returns task
 */
function getCurrentTask(runningAppList){
    let frontTask = null;
    if (!runningAppList || !Array.isArray(runningAppList)) {
        console.warn('getCurrentTask: runningAppList');
        return null;
    }
    runningAppList.forEach(task => {
        if(task.isShowNow == true){
            frontTask = task;
        }
    });
    console.log(frontTask);
    return frontTask;
}

/**
 * Close app animation
 * @param {TaskInfo} taskInfo task info
 */
function closeApp(taskInfo, runningAppList) {
    const el = taskInfo.mainActivity;
    el.innerHTML = '';

    if(getCurrentTask(runningAppList) === null ){
        el.id = '';
        taskInfo.isShowNow = false;
        taskInfo.mainActivity = null;
        console.log(`task ${taskInfo}`);
        // make animation come true by yourself 
    }else{
        playCloseAnimation(el, taskInfo);
        el.id = '';
        taskInfo.isShowNow = false;
        taskInfo.mainActivity = null;
    }
}

/**
 * Close app animation
 * @param {HTMLElement} el current app
 * @param {TaskInfo} taskInfo 
 */
function playCloseAnimation(el, taskInfo) {
    el.style.cssText = `z-index: 96`;
    el.classList.add('app-icon','ease-in');
    setTimeout(() => {
        el.style.cssText = `background-image: url(${taskInfo.appIconBg});`;
    }, 300);
}

/**
 * Launch app animation 
 * @param {HTMLElement} el app icon
 * @param {TaskInfo} taskInfo 
 */
function playLaunchAnimation(el, taskInfo){
    el.classList.remove('app-icon');
    el.style.backgroundImage = '';
    console.log(el);
    console.log(product.style.width);
    el.style.cssText = `
        transition: all 0.1s ease;
        position: absolute !important;
        top: 0px !important;
        left: 0px !important;
        width: ${product.style.width} !important;
        height: ${product.style.height} !important;
        border-radius: 16px !important;
        background-color: white !important;
        background-image: none !important;
        z-index: 97;
        scale: (1);
    `;
}

/**
 * Clear all background app 
 */
function clearAllBackgroundApp(){
    runningAppList = [];
}

/**
 * Set status bar
 * @param {boolean} isReset reset all state if false noly set time
 */
function setStatusBar(isReset){
    const now = new Date();
    const sec = String(now.getSeconds()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    if(timeFormat === timeFormatConfig.HOUR_MIN_SEC){
        statusbarTime.innerHTML = `${hour}:${min}:${sec}`;
    }else{
        statusbarTime.innerHTML = `${hour}:${min}`;
    }
    if(isReset){
        
        // statusBarConfig = new StatusBarConfig(
        //     true,   /* wifi */
        //     false,  /* blue tooth */
        //     batteryVal,     /* battery val */
        //     true,   /* location */
        //     true,    /* charging */
        //     false   /* air mode */
        // );
        const infoIcon = document.createElement('div');
            infoIcon.innerHTML = `<svg class="icon" viewBox="0 0 24 24">
                                        <use href="../../resources/img/battery.svg"></use>
                                    </svg>`;
        infoIcon.classList.add('statusbar-icon-container');
        statusbarInfo.appendChild(infoIcon);
        const batteryVal = document.createElement('div');
            batteryVal.innerHTML = `${statusBarConfig.battery}%`;
        statusbarInfo.appendChild(batteryVal);
        console.log(statusBarConfig);
        if(statusBarConfig.wifi){
            const infoIcon = document.createElement('div');
            infoIcon.innerHTML = `<svg class="icon" viewBox="0 0 24 24">
                                        <use href="../../resources/img/wifi.svg"></use>
                                    </svg>`;
            infoIcon.classList.add('statusbar-icon-container');
            statusbarInfo.appendChild(infoIcon);
        } if(statusBarConfig.blueTooth){
            const infoIcon = document.createElement('div');
            infoIcon.innerHTML = `<svg class="icon" viewBox="0 0 24 24">
                                        <use href="../../resources/img/blue-tooth.svg"></use>
                                    </svg>`;
                                    infoIcon.classList.add('statusbar-icon-container');
                                    statusbarInfo.appendChild(infoIcon);
        } if(statusBarConfig.location){
            const infoIcon = document.createElement('div');
            infoIcon.innerHTML = `<svg class="top-bar-icon" viewBox="0 0 24 24">
                                        <use href="../../resources/img/location.svg"></use>
                                    </svg>`;
            statusbarInfo.appendChild(infoIcon);
        } if(statusBarConfig.charging){
            const infoIcon = document.createElement('div');
            infoIcon.innerHTML = `<svg class="top-bar-icon" viewBox="0 0 24 24">
                                        <use href="../../resources/img/charging.svg"></use>
                                    </svg>`;
            infoIcon.classList.add('statusbar-icon-container');
            statusbarInfo.appendChild(infoIcon);
        } if(statusBarConfig.airMode){
            const infoIcon = document.createElement('div');
            infoIcon.innerHTML = `<svg class="icon" viewBox="0 0 24 24">
                                        <use href="../../resources/img/air-mode.svg"></use>
                                    </svg>`;
            infoIcon.classList.add('statusbar-icon-container');

            statusbarInfo.appendChild(infoIcon);
        } if(statusBarConfig.mobile){
            const infoIcon = document.createElement('div');
            infoIcon.innerHTML = `<svg class="icon" viewBox="0 0 24 24">
                                        <use href="../../resources/img/mobile.svg"></use>
                                    </svg>`;
            infoIcon.classList.add('statusbar-icon-container');

            statusbarInfo.appendChild(infoIcon);
        }
    }
}

/**
 * Clear all info in status bar 
 */
function clearStatusBarInfo(){
    statusbarInfo.innerHTML = '';
}

/**
 * Show setting page when status bar slide down
 */
function handleStatusBarSlideUp(){
    setPage.innerHTML = '';
}

/**
 * Get current time infos 
 * @returns object
 */
function getTime(){
    const now = new Date();
    const sec = String(now.getSeconds()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const mouth = String(now.getMonth());
    const weekday = String(now.getDay());
    const day = String(now.getDate());
    return {
        now: now,
        sec: sec,
        min: min,
        hour: hour,
        mouth: mouth,
        weekday: weekday,
        day: day
    }
}

/**
 * Hidden setting page when status bar slide down
 */
function handleStatusBarSlideDown(){
    const date = getTime();
    console.log('handle status bar');
    setPage.innerHTML = `<div id="quick-settings-page">
        <qs-grid cols="4" rows="10" gap="15px" padding="0" style="height: 100%;width: 100%;">
          <div id="qsp-time" style="grid-area: 1 / 1 / span 1 / span 2;">
            <div id="qsp-h-m-time">
              ${date.hour}:${date.min}
            </div>
            <div id="qsp-y-w-time">
              ${date.mouth}月${date.day}日 周${date.weekday}
            </div>
          </div>
            <div id="qsp-wifi" style="grid-area: 2 / 1 / span 1 / span 2;">
              <qs-liquid-glass id="" class="net">
                  <svg class="set-page-icon" viewBox="0 0 24 24">
                      <use href="../../resources/img/wifi.svg"></use>
                  </svg>
                <div style="font-size: 30px;padding-left: 10%;">
                  <small>WLAN</small>
                </div>
              </qs-liquid-glass>
            </div>
            <div id="qsp-mobile">
              <qs-liquid-glass id="" class="net">
                  <svg class="set-page-icon" viewBox="0 0 24 24">
                      <use href="../../resources/img/mobile.svg"></use>
                  </svg>
                <div>
                  <small style="font-size: 30px;padding-left: 10%;">Mobile</small>
                </div>
              </qs-liquid-glass>
            </div>
            <div id="volume">
              <qs-slider orientation="vertical" id="volume" value="40" max="100">
                <svg slot="icon" viewBox="0 0 24 24" fill="#000" class="slider-icon">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06A7 7 0 0 1 14 18.71v2.06A9 9 0 0 0 14 3.23z"/>
                </svg>
              </qs-slider>
            </div>
            <div id="luminance">
              <qs-slider orientation="vertical" id="luminance" value="40" max="100">
                <svg slot="icon" viewBox="0 0 24 24" fill="#000"  class="slider-icon">
                  <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0-5v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#000" stroke-width="2" stroke-linecap="round" fill="none"/>
                </svg>
              </qs-slider>
            </div>
          <div class="qsp-set" style="grid-area: 4 / 1 / span 1 / span 1;">
            <qs-liquid-glass class="set-item" id="air-mode-set">
              <svg class="set-page-icon" viewBox="0 0 24 24">
                <use href="../../resources/img/air-mode.svg"></use>
              </svg>
            </qs-liquid-glass>
          </div>
          <div class="qsp-set" style="grid-area: 4 / 2 / span 1 / span 1;">
            <qs-liquid-glass class="set-item" id="blue-tooth-set">
              <svg class="set-page-icon" viewBox="0 0 24 24">
                <use href="../../resources/img/blue-tooth.svg"></use>
              </svg>
            </qs-liquid-glass>
          </div>
          <div class="qsp-set" style="grid-area: 4 / 3 / span 1 / span 1;">
            <qs-liquid-glass class="set-item" id="dark-theme-set">
              <svg class="set-page-icon" viewBox="0 0 24 24">
                <use href="../../resources/img/dark-theme.svg"></use>
              </svg>
            </qs-liquid-glass>
          </div>
          <div class="qsp-set" style="grid-area: 4 / 4 / span 1 / span 1;">
            <qs-liquid-glass class="set-item" id="location-set">
              <svg class="set-page-icon" viewBox="0 0 24 24">
                <use href="../../resources/img/location.svg"></use>
              </svg>
            </qs-liquid-glass>
          </div>
          <div class="qsp-set" style="grid-area: 5 / 1 / span 1 / span 1;">
            <qs-liquid-glass class="set-item" id="hot-spot-set">
              <svg class="set-page-icon" viewBox="0 0 24 24">
                <use href="../../resources/img/hot-spot.svg"></use>
              </svg>
            </qs-liquid-glass>
          </div>
          <div id="qsp-info-show" style="grid-area: 6 / 1 / span 4 / span 4;">
            
          </div>
        </qs-grid>
        
      </div>`;
    const infoShow = document.getElementById('qsp-info-show');
    qspInfoShow = infoShow;
    console.log(historyInfo);
    historyInfo.forEach(info => {
        const d = document.createElement('div');
        d.classList.add('qsp-info-show-div');
        d.innerHTML = info;
        qspInfoShow.prepend(d);
    });
    const page = document.getElementById('quick-settings-page');
    const time = document.getElementById('qsp-time');
    setInterval(() => {
        const date = getTime();
        time.innerHTML = `<div id="qsp-h-m-time">
              ${date.hour}:${date.min}
            </div>
            <div id="qsp-y-w-time">
              ${date.mouth}月${date.day}日 周${date.weekday}
            </div>`;
    }, 60000);
    
    requestAnimationFrame(() => {
        setPage.style.opacity = '1';
    });
    [PointerEventType.pointerup, PointerEventType.pointermove, PointerEventType.pointerdown].forEach(eventType => {
        setPage.addEventListener(eventType, (e) => {
            // console.log('setPage pointerdown', e.target, e.composedPath());
            const path = e.composedPath();
            const isSlider = path.some(el => el.tagName && el.tagName.toLowerCase() === 'qs-slider');
            // console.log('slider');
            if (isSlider) return;
            e.stopPropagation();
            e.preventDefault();
        }, { passive: false });
    });
    console.log(page);

    const qspWifi = document.getElementById('qsp-wifi');
    const qspMobile = document.getElementById('qsp-mobile');
    const volume = document.getElementById('volume');
    const luminance = document.getElementById('luminance');
    const location = document.getElementById('location-set');
    const hotSpot = document.getElementById('hot-spot-set');
    const airMode = document.getElementById('air-mode-set');
    const blueTooth = document.getElementById('blue-tooth-set');
    const darkTheme = document.getElementById('dark-theme-set');



    const net = page.querySelectorAll('.net');
    net.forEach(setItem => {
        setItem.addEventListener(PointerEventType.pointerdown, () => {
            activeSet(setItem);
        });
    });
    const setItems = page.querySelectorAll('.set-item');
    setItems.forEach(setItem => {
        setItem.addEventListener(PointerEventType.pointerdown, () => {
            activeSet(setItem);
        });
    });
}

/**
 * Active set item 
 */
function activeSet(el){
    console.log('1');
    if(el.style.backgroundColor){
        el.style.backgroundColor = '';
    }else{
        el.style.backgroundColor = '#0c92ff';
    }
}

/**
 * Set desktop page
 * @param {number} index 
 */
function setDesktopPage(dir) {
    console.log(maxDesktopPage);
    console.log(currentDesktopPageIndex);
    if(currentDesktopPageIndex >= maxDesktopPage && dir !== 'right') return;
    if(currentDesktopPageIndex <= 1 && dir !== 'left') return;
    
    const grids = document.querySelectorAll('qs-grid[data-index]');

    grids.forEach(item => {
        item.style.transition = 'transform 0.3s ease';
    });
    // const offset = (itemIndex - currentDesktopPageIndex) * product.offsetWidth;
    
    requestAnimationFrame(() => {
        grids.forEach(item => {
            const itemIndex = parseInt(item.dataset.index);
            const { translateX } = getTranslate(item);
            let newX = 0;
            // const newX = dir === 'left'
            //     ? translateX - product.offsetWidth
            //     : translateX + product.offsetWidth;
            if(dir === 'left'){
                newX = translateX - product.offsetWidth;
            }else{
                newX = translateX + product.offsetWidth;
            }
            item.style.transform = `translate(${newX}px, 0px)`;
        });
    });
    if(dir === 'left'){
        currentDesktopPageIndex++;
    }else{
        currentDesktopPageIndex--;
    }
}

/**
 * Get translate x or y 
 * @param {HTMLElement} element 
 * @returns { translateX, translateY }
 */
function getTranslate(element) {
    const transform = window.getComputedStyle(element).transform;
    
    if (!transform || transform === 'none') {
        return { translateX: 0, translateY: 0 };
    }
    
    const matrix = new DOMMatrix(transform);
    return {
        translateX: matrix.m41,
        translateY: matrix.m42
    };
}

