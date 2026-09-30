# 组件的z-Index详细解释
## 一、显式声明了z-Index的组件
### 1.qg-app-card
折叠卡片展开为全屏时，z-Index的值被设置为'999999'，恢复折叠状态后恢复
### 2.qg-image-vector
图像为全屏状态下z-Index值为默认值，被拖拽过后z-Index值为'999999'，上下操作栏的z-Index值为'999999'，预览状态下为默认值。
### 3.qg-draggable-element
元素z-Index值保持为'999999'。
### 4.qg-siderbar
侧边栏拉出时z-Index值为'9999999'。
### 5.