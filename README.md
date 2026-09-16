# Yue Wu Personal Homepage

这是一个可直接部署到 GitHub Pages 的纯静态个人主页。

## 文件结构

```text
.
├── index.html
├── style.css
├── script.js
└── assets/
    └── avatar.jpg
```

## 上传到 GitHub Pages

1. 打开你的 `YueWuHHU.github.io` 仓库。
2. 上传本目录中的 `index.html`、`style.css`、`script.js` 和 `assets` 文件夹。
3. 确认文件位于仓库根目录。
4. 打开 `Settings → Pages`。
5. `Source` 选择 `Deploy from a branch`。
6. Branch 选择 `main`，目录选择 `/(root)`，保存。
7. 稍等片刻后访问 `https://YueWuHHU.github.io/`。

## 建议你上线前检查

- 论文、奖项、经历是否需要继续补充或删减；
- 是否希望公开学校邮箱；
- 替换 `assets/avatar.jpg` 为更高清的个人照片；
- 如果有 LinkedIn / Google Scholar / ORCID，可在 `index.html` 的个人链接区增加。

## 修改内容

网页文字都在 `index.html` 里，配色和布局在 `style.css` 里。
不需要安装任何框架或依赖。
