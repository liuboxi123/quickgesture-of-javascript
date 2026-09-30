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
// components control
// app card
document.getElementById('app-card-return-btn').addEventListener('click', (e) => {
    console.log('btn');
    e.stopPropagation();
    document.getElementById('app-card').setAttribute('fold', 'true');
});
const appCardIcon = document.getElementById('icon');
const appCard = document.getElementById('app-card');
pressFeedback(appCardIcon);
pressFeedback(document.getElementById('app-card-return-btn'));
attachPressGlow(appCardIcon);
//ground glass
const groundGlass = document.getElementById('ground-glass');
// attachPressGlow(document.getElementById('ground-glass'));
pressFeedback(groundGlass);
// slider
const slider = document.getElementById('slider');
pressFeedback(slider);
// image vector
const imageVector = document.getElementById('image-vector');
// pressFeedback(imageVector);
// attachPressGlow(imageVector);
