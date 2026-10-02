# QuickGesture：基于 Web Components 的手势交互组件库

> 项目地址：https://github.com/liuboxi123/quickgesture-of-javascript

QuickGesture 是一个面向 Web 端的手势交互组件库，基于 Web Components 标准构建，提供完整的手势识别 API 与可复用 UI 组件。其设计目标是统一封装 Touch、Mouse、Pointer 等事件模型，为移动端、桌面端以及 AndroidView 提供一致、稳定的手势交互能力。

本文为 QuickGesture 项目的官方介绍，内容涵盖功能特性、项目优势、项目结构、快速开始、使用示例、贡献方式与开源许可证。


## 功能特性

### 全面的手势支持

QuickGesture 支持检测以下手势与交互行为：

- 上滑、下滑、左滑、右滑
- 快速滑动与慢速滑动
- 多指操作
- 点击、长按、中断等基础交互

### Web Components 架构

- 基于 Web Components 标准实现
- 框架无关，可无缝集成到 Vue、React 或原生项目
- 组件具备良好的封装性与复用性

### 跨平台兼容

QuickGesture 统一封装：

- Touch 事件
- Mouse 事件
- Pointer 事件

可适配移动端、桌面端以及 AndroidView，降低多端手势交互的开发与维护成本。

## 项目优势

### 1. 组件化程度高

每个功能均封装为自定义元素，复用性强，后续维护简单。组件之间职责清晰，便于在多个页面、模块或项目中统一使用。

### 2. 交互体验好

QuickGesture 大量使用：

- pointer 事件
- wheel 事件
- touch 事件
- transform 动画
- 视觉状态切换

这些能力使组件交互更接近桌面级与手持设备的原生体验，提升整体操作流畅度与反馈质量。

### 3. 适合 launcher / 桌面应用场景

从侧边栏、卡片、图片预览、滚动列表等交互形态来看，QuickGesture 适用于 launcher、桌面应用、系统级 Web 界面等场景，能够承载较复杂的层级交互与手势操作。

### 4. 视觉效果比较完整

组件内置磨砂玻璃、渐变、动画、阴影、圆角等视觉处理，整体风格符合现代 UI 设计规范，可直接用于对视觉表现有较高要求的项目。

### 5. 可扩展性强

组件中大量使用属性、slot 与事件分发机制，外部页面可以方便地进行扩展与二次封装，便于项目按自身业务需求构建上层组件体系。

## 项目结构

```text
QuickGesture
├── image
└── src
    └── main
        ├── core
        └── demo
```

目录说明：

- `core`：核心文件
- `demo`：示例代码与页面
- `image`：图片资源，例如交流群二维码

## 快速开始

将 `core` 文件夹中的 JavaScript 文件加入项目，然后按需使用对应的函数与组件。

```html
<!-- 组件库 -->
<script src="../your/project/path/components.js"></script>

<!-- 手势 API -->
<script src="../your/project/path/index.js"></script>
```

引入后即可调用 QuickGesture 提供的手势 API 与 Web Components 组件。

## 使用示例

### 手势 API：gestureListener

`gestureListener` 用于监听指定元素上的多种手势：

```javascript
gestureListener(el /* 被监听的元素 */, {
  // 识别配置
  slowSwipeUp: () => {
    // response
  },
  slowSwipeDown: () => {},
  slowSwipeLeft: () => {},
  slowSwipeRight: () => {},

  quickSwipeUp: () => {},
  quickSwipeDown: () => {},
  quickSwipeLeft: () => {},
  quickSwipeRight: () => {},

  interrupt: () => {},
  simpleClick: () => {},
  longClick: () => {},
});
```

支持的回调包括：

- `slowSwipeUp`
- `slowSwipeDown`
- `slowSwipeLeft`
- `slowSwipeRight`
- `quickSwipeUp`
- `quickSwipeDown`
- `quickSwipeLeft`
- `quickSwipeRight`
- `interrupt`
- `simpleClick`
- `longClick`

### 多指手势：双指下滑

```javascript
/**
 * 检测指定元素上是否发生双指下滑事件
 * @param {HTMLElement} element 绑定元素
 * @param {Function} callback 触发回调
 * @param {number} threshold 绑定元素高度的百分比阈值
 * @param {boolean} preventDefault 是否阻止默认行为
 */
checkTwoFingersSlideDownwardEvent(
  el,
  (e) => {
    // response
  },
  0.1,
  true
);
```

参数说明：

| 参数 | 说明 |
| --- | --- |
| `element` | 被监听的元素 |
| `callback` | 手势触发后的回调 |
| `threshold` | 绑定元素高度的百分比阈值 |
| `preventDefault` | 是否阻止默认行为 |

### Web Components 组件示例

#### Liquid Glass

```html
<qg-liquid-glass>
  <div>
    <small>liquid glass</small>
  </div>
</qg-liquid-glass>
```

#### Grid Layout

```html
<qg-grid cols="5" rows="7" gap="15px" padding="30px"></qg-grid>
```

## 适用场景

QuickGesture 适用于以下方向：

- 移动端 H5 手势交互
- 桌面端鼠标与指针手势
- AndroidView 中的 Web 页面
- Vue、React、原生 JavaScript 项目
- launcher、桌面应用与系统级 Web 界面
- 需要快速实现滑动、多指、点击、长按等交互的场景

## 参与贡献

QuickGesture 欢迎社区贡献。无论是修复 Bug、增加新手势，还是改进文档，均欢迎提交。

### 1. Fork 仓库

点击 GitHub 页面右上角的 Fork 按钮，创建仓库副本。

### 2. 克隆 Fork

```bash
git clone https://github.com/liuboxi123/quickgesture-of-javascript.git
```

### 3. 创建分支

```bash
git checkout -b feature/AmazingFeature
# 或
git checkout -b fix/BugFix
```

### 4. 修改并提交

请尽量遵循 Conventional Commits 规范：

```bash
git add .
git commit -m "feat: add pinch gesture support"
# 或
git commit -m "fix: resolve touch event conflict on iOS"
```

### 5. 推送到 GitHub

```bash
git push origin feature/AmazingFeature
```

### 6. 提交 Pull Request

回到原仓库，打开 Pull Request，并清晰描述修改内容。

## 许可证

本项目基于 **Apache License 2.0** 开源。

你可以通过以下链接获取完整许可证：

```text
http://www.apache.org/licenses/LICENSE-2.0
```

除非适用法律要求或书面同意，否则依据该许可证分发的软件将按“原样”分发，不附带任何明示或暗示的担保或条件。

## 更多

QuickGesture 仍在持续开发中。欢迎通过以下方式分享建议或获取帮助：

- GitHub Discussions：  
  [https://github.com/liuboxi123/quickgesture-of-javascript](https://github.com/liuboxi123/quickgesture-of-javascript)


## 总结

QuickGesture 致力于提供一套框架无关、跨平台、组件化的手势交互方案。通过 Web Components、统一事件封装与丰富的手势识别 API，开发者可以更高效地构建移动端、桌面端及 launcher / 桌面应用场景下的交互体验。

欢迎开发者参与共建，提交 Issue 或 Pull Request，共同完善 QuickGesture 的组件生态与手势能力。