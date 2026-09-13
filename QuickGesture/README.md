# QuickGesture of JavaScript

A Web Component Library for Gesture Interaction with Comprehensive Gesture Recognition APIs.

##  Catalogue

- [Features](#-Features)
- [ProjectStruct](#-Projectsrtuct)
- [FastStart](#-FastStart)
- [Examples(part)](#-Examples)
- [Contribution](#-Contribution)
- [Lisence](#-Lisence)
- [More](#-more)

##  Features

### Comprehensive gesture support

- Support check swipe up, left, right and down, multi-finger operation, speed of operation(fast or slow).

### Web components architecture

- Strueture base on Web Components standard.
- Frame-independent, it can be seamlessly integrated into Vue, React or native projects.

### Cross-Plantform compatibility

- Uniformly encapsulate Touch , Mouse and Pointer events, perfrctly adapting to both mobile, desktop and AndriodView.


##  Project struct

```text
QuickGesture
├─image
└─src
   └─main
       ├─core
       └─demo
```
- core: Core files
- demo: Example code and pages

##  Fast satrt

- Add the JavaScript files which in the core folder in your project.
- Then using functions and components what you want.

```html
<!-- conponents lib -->
<script src="../your/project/path/components.js"></script>
<!-- gesture apis -->
<script src="../your/project/path/index.js"></script>
```

##  Examples

### Gesture APIs

- Gesture gesture Listener
```javascript
gestureListener(el /* element being monitored */, { // config of recognition
  slowSwipeUp     = () => {/* response */},
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
});
```
- Multi-Finger Listener
```javascript
/**
 * Checks if a two-finger slide downward event has occurred on the specified element.
 * @param {HTMLElement} element 
 * @param {Function} callback 
 * @param {float} threshold the percentage of the height of the bound element
 * @param {boolean} preventDefault 
 */
checkTwoFingersSlideDownwardEvent(el, (e) => { /* response */ }, 0.1, true);
```
### Gesture components

- Liquid Glass 

```html
<qg-liquid-glass>
    <div>
        <small>liquid glass</small>
    </div>
</qg-liquid-glass>
```

- Grid Layout

```html
<qg-grid cols="5" rows="7" gap="15px" padding="30px"></qg-grid>
```

##  Contribution

We welcome contributions from the community! Whether it's fixing a bug, adding a new gesture, or improving documentation, your help is appreciated.


### How to Contribute

Fork the Repository
Click the "Fork" button at the top right of this page to create your own copy of the repository.

Clone Your Fork
```bash
git clone https://github.com/liuboxi123/quickgesture-of-javascript.git
```

### Create a Branch

- Create a new branch for your feature or bugfix.

```bash
git checkout -b feature/AmazingFeature
# or
git checkout -b fix/BugFix
```

### Make Changes & Commit
Make your changes and commit them using the Conventional Commits standard.

```bash
git add .
git commit -m "feat: add pinch gesture support"
# or
git commit -m "fix: resolve touch event conflict on iOS"
```

### Push to GitHub

```bash
git push origin feature/AmazingFeature
```

### Open a Pull Request
Go to the original repository and open a Pull Request. Please describe your changes clearly in the PR description.

##  License

This project is licensed under the Apache License 2.0.

You may not use this file except in compliance with the License. You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

##  More
Quick Gesture of JavaStcipt is in development share your idea or ask for help use the following method.

- Join the group.

![groupQRCode](./image/QRCode.jpg)

- GitHub Discussions [click here](https://github.com/liuboxi123/quickgesture-of-javascript.git).