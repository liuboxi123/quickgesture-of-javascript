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
 * products size config
 */
const productSize = Object.freeze({
    height: '1600px',
    width: '720px',
    borderRadius: '32px',
    backgroundColor: '#ccc'
});

/**
 * app icon size config (usually height = width)
 */
const appIconSize = Object.freeze({
    height: 'auto'/* 'auto' | number */,
    width: 'auto'/* 'auto' | number */,
    borderRadius: '16px', // recommend 16px
    backgroundColor: '#ffffff'
});

/**
 * wall paper config
 */
const wallPaper = Object.freeze({
    wallPaperPath: '../../resources/img/wallpaper.jpg'
});

/**
 * product bottom navigation bar style config
 * NAVIGATION_MODE_TRANSPARENT gesture navigation bar 
 * NAVIGATION_MODE_3_BUTTON * three buttons nav (Back|Home|Recent) 
 * NAVIGATION_MODE_GESTURE  gesture navigation bar and gesture line
 */
const productBottomNavBarStyle = Object.freeze({
    NAVIGATION_MODE_TRANSPARENT: 2,
    NAVIGATION_MODE_3_BUTTON: 0,
    NAVIGATION_MODE_GESTURE: 1
});

// Set bottom navigation bar style 
currentBottomNavBarStyle = productBottomNavBarStyle.NAVIGATION_MODE_TRANSPARENT;

// the column of desktop show app 
columnOfShowAppInDesktop = '5' /* number */; // 5 recommend

/**
 * Installed app list
 */
// appList.push(new AppInfo());
appList.push(new AppInfo("com.quickStepJs.myapp", '../packages/apps/MyApp/com/quickStepJs/myApp/res/ic_launcher.svg', 'MyApp', 1, 1, 2, 2, 1));
appList.push(new AppInfo("com.quickStepJs.camera", '../packages/apps/Camera/com/quickStepJs/camera/res/ic_launcher.svg', 'Camera', 3, 1, 1, 1, 1));
appList.push(new AppInfo("com.quickStepJs.calendar", '../packages/apps/Calendar/com/quickStepJs/calendar/res/ic_launcher.svg', 'Calendar', 4, 1, 1, 1, 2));
appList.push(new AppInfo("com.quickStepJs.email", '../packages/apps/Email/com/quickStepJs/email/res/ic_launcher.svg', 'Email', 5, 1, 1, 1, 2));
appList.push(new AppInfo("com.quickStepJs.gallery", '../packages/apps/Gallery/com/quickStepJs/gallery/res/ic_launcher.svg', 'Gallery', 3, 2, 1, 1, 3));
appList.push(new AppInfo("com.quickStepJs.settings", '../packages/apps/Settings/com/quickStepJs/settings/res/ic_launcher.svg', 'Settings', 1, 3, 2, 1, 2));

/**
 * Running app list auto add 
 */
// runningAppList.push();

const timeFormatConfig = Object.freeze({
    HOUR_MIN: 0,
    HOUR_MIN_SEC: 1
});
// timeFormat = timeFormatConfig.HOUR_MIN_SEC;
timeFormat = timeFormatConfig.HOUR_MIN;

const BatteryChecker = {
  isSupported: 'getBattery' in navigator,

  getStatus() {
    if (!this.isSupported) {
      console.warn('Battery API not supported, returning default status');
      return Promise.resolve({
        charging: false,
        level: -1,            
        chargingTime: Infinity,
        dischargingTime: Infinity,
        isFull: false,
        status: 'unknown'
      });
    }

    return navigator.getBattery().then(battery => ({
      charging: battery.charging,
      level: Math.round(battery.level * 100),
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime,
      isFull: battery.level === 1,
      status: battery.charging ? 'charging' : 'discharging' // ✅ 修正拼写
    }));
  },

  async isCharging() {
    const status = await this.getStatus();
    return status.charging;
  },

  onChargingChange(callback) {
    if (!this.isSupported) return;
    navigator.getBattery().then(battery => {
      battery.addEventListener('chargingchange', () => callback(battery.charging));
    });
  },

  onLevelChange(callback) {
    if (!this.isSupported) return;
    navigator.getBattery().then(battery => {
      battery.addEventListener('levelchange', () => callback(Math.round(battery.level * 100)));
    });
  }
};

function isBatteryCharging(){
    let isCharging = false;
    BatteryChecker.getStatus().then(status => {
        isCharging = status.charging;
        // { charging: true, level: 85, status: '充电中' }
    });
    return isCharging
}
async function batteryLevel(){
    const status = await BatteryChecker.getStatus();
    console.log('电池状态:', status);
    return status.level;
}

// Configeration status bar show infos 
const configReady = (async () => {
    const batteryStatus = await BatteryChecker.getStatus();
    statusBarConfig.wifi = true;
    statusBarConfig.airMode = false;
    statusBarConfig.blueTooth = false;
    statusBarConfig.charging = batteryStatus.charging;
    statusBarConfig.location = true;
    statusBarConfig.mobile = true;
    statusBarConfig.battery = batteryStatus.level;
    console.log('StatusBarConfig ready:', statusBarConfig);
    return statusBarConfig;
})();

configReady.then(() => {
    setStatusBar(true);
});
