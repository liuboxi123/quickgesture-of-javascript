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
import { attachPressGlowExp, pressFeedbackExp } from "../../../src/core/index-export.js";
// first page control 
document.getElementById('git-link-btn').addEventListener('click', () => {
    window.open("https://github.com/liuboxi123/quickgesture-of-javascript.git", "_blank");
});
// components control
// app card
document.querySelector('.app-card-return-btn').addEventListener('click', (e) => {
    console.log('btn');
    e.stopPropagation();
    document.getElementById('app-card').setAttribute('fold', 'true');
});
const appCardIcon = document.getElementById('icon');
const appCard = document.getElementById('app-card');
pressFeedbackExp(appCardIcon);
pressFeedbackExp(document.querySelector('.app-card-return-btn'));
attachPressGlowExp(appCardIcon);
//ground glass
const groundGlass = document.getElementById('ground-glass');
// attachPressGlow(document.getElementById('ground-glass'));
pressFeedbackExp(groundGlass);
// slider
const slider = document.getElementById('slider');
pressFeedbackExp(slider);
// image vector
const imageVector = document.getElementById('image-vector');
// pressFeedback(imageVector);
// attachPressGlow(imageVector);
// bottom sheet
document.getElementById('bottom-sheet-op').addEventListener('click',()=>{
    const sheet = document.querySelector('qg-bottom-sheet');
    sheet.isShow = true;
});
document.getElementById('close-bottom-sheet-btn').addEventListener('click',()=>{
    console.log('click close btn');
    const sheet = document.querySelector('qg-bottom-sheet');
    sheet.isShow = false;
});
