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
 * all info of product 
 */

// about product element
const dragBlock = document.getElementById('drag-block');
const product = document.getElementById('product');
const bottomNavBar = document.getElementById('bottom-nav-bar');
const placeHolder = document.getElementById('center-placeholder');
const setPage = document.getElementById('set-page');

const statusBar = document.getElementById('top-status-bar');
const statusbarTime = document.getElementById('statusbar-time');
const statusbarInfo = document.getElementById('statusbar-info');
const statusAndNavView = document.getElementById('status-and-nav-view');
let backgroundApp = [];
// const mainActivity = document.getElementById('main-activity-1');
const shade = document.getElementById('shade'); // shade on the desktop when background app show
const desktop = document.getElementById('desktop'); // app grid
let currentDesktopPageIndex = 1;
let maxDesktopPage = 0;
let currentBottomNavBarStyle;
let columnOfShowAppInDesktop;
let isMainActivityHaving = false; // having app show current
let runningAppList = []; // storge running app list
let appList = [];  // storge installed app list
let taskId = 0; // running app task id
let tempTaskInfo = null;
let clearBtnFlag = false;
const appInfoMap = new Map();
// running app infos object
class TaskInfo {
    constructor(packageName, appIcon, appName, taskId, column, row, 
        widthCross, heightCross, mainActivity, isShowNow, iconHeight,
        iconWidth, top, left, appIconBg) {
        this.packageName = packageName;
        this.appIcon = appIcon; // the app icon path actually
        this.appName = appName;
        this.taskId = taskId;
        this.column = column;
        this.row = row;
        this.widthCross = widthCross;
        this.heightCross = heightCross;
        this.mainActivity = mainActivity; // app page
        this.isShowNow = isShowNow;
        this.iconHeight = iconHeight;
        this.iconWidth = iconWidth;
        this.top = top; // app icon postion on desktop
        this.left = left;
        this.appIconBg = appIconBg;
    }
}
// app infos object
class AppInfo {
    constructor(packageName, appIcon, appName, column, row, widthCross, heightCross, index) {
        this.packageName = packageName;
        this.index = index; // the page index of app in desktop
        this.appIcon = appIcon; // the app icon path actually
        this.appName = appName;
        this.column = column;
        this.row = row;
        this.widthCross = widthCross;
        this.heightCross = heightCross;
    }
}

let noRecentTaskTag = 'hav\'t recent task';

// config top bar icon and state
class StatusBarConfig{
    constructor(wifi, mobile, blueTooth, battery, location, charging, airMode){
        this.wifi = wifi;
        this.mobile = mobile;
        this.blueTooth = blueTooth;
        this.battery = battery;
        this.location = location;
        this.charging = charging;
        this.airMode = airMode;
    }
}

let statusBarConfig = new StatusBarConfig();

// app push information format
class PushInformationPackget{
    constructor(appIcon, appName, time, info){
        this.appIcon = appIcon;
        this.appName = appName;
        this.time = time;
        this.info = info;
    }
}

let pushInformationList = [];

let timeFormat;

let batteryVal;

let historyInfo = [];

let qspInfoShow = null;