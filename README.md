# 吴越个人主页｜合并版

这个压缩包把“设备选择”和“主页版本选择”整合在同一个网站中。

## 访问流程

打开首页：

1. 先选择 `Web / 桌面版` 或 `Mobile / 移动版`
2. 再选择 `求职版` 或 `学术版`
3. 进入对应主页

进入主页后还可以：
- 切换 Web / Mobile
- 在求职版和学术版之间切换
- 返回选择首页

## 文件结构

所有文件都在同一级目录，不需要创建文件夹：

- index.html        首页选择页
- landing.css       首页样式
- landing.js        首页选择逻辑
- job.html          求职版主页
- academic.html     学术版主页
- style.css         两个主页共用样式
- page.js           两个主页共用设备模式逻辑
- avatar.jpg        头像
- README.md

## GitHub Pages 上传

把以上所有文件一次性上传到 `YueWuHHU.github.io` 仓库根目录，然后：

Settings → Pages → Deploy from a branch → main → /(root) → Save

最终访问：
https://YueWuHHU.github.io/

## 两个版本的区别

求职版：
教育 → 实习 → 项目 → 竞赛 → 技能 → 校园经历 → 荣誉 → 学术论文 → 工作论文 → 学术会议 → 研修营

学术版：
教育 → 学术论文 → 工作论文 → 项目 → 学术会议 → 研修营 → 竞赛 → 实习 → 荣誉 → 校园经历 → 技能
