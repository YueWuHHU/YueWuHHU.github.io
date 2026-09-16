# Yue Wu Personal Homepage V2

这是可直接上传到 GitHub Pages 的完整版本，新增：

- 首次进入时选择 `Web` / `Mobile`
- 自动识别设备
- 用户选择会保存在浏览器中
- 顶部 `Web / Mobile` 按钮可以随时重新选择
- 深色 / 浅色模式
- 手机与桌面响应式布局
- 滚动进入动画
- 无框架、无依赖，直接部署即可

## 文件结构

```text
.
├── index.html
├── style.css
├── script.js
└── assets/
    └── avatar.jpg
```

## GitHub Pages 部署

把整个压缩包解压后，将里面的所有文件上传到：

`YueWuHHU.github.io`

仓库根目录。

然后：

1. `Settings`
2. `Pages`
3. `Source` → `Deploy from a branch`
4. Branch → `main`
5. Folder → `/(root)`
6. `Save`

访问：

`https://YueWuHHU.github.io/`

## 测试首次选择页面

选择结果会保存在浏览器的 Local Storage 中。

如果想重新看到首次选择界面：
- 直接点击网页顶部的 `Web` 或 `Mobile` 按钮即可重新选择；
- 或清除该网站的浏览器存储数据。
