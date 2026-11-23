# 掌间花开 · Palm Bloom

**V3.0 · 数字助农互动版**  
四川特色花卉、乡土文化与数字艺术的相遇。

从渠县黄花、江油辛夷、中江荷花、犍为茉莉到攀枝花木棉，以双手为媒介，轻挥切换主题，指尖开合控制绽放。项目由黄诗芮策划并借助 AI 辅助开发，使用 MediaPipe 实现浏览器端手部关键点识别，探索“指尖互动—文化认知—产品推介—消费连接”的数字助农路径。

[在线体验](https://daylily-in-your-hands.divineeel19.chatgpt.site) · [零基础发布指南](docs/GITHUB_GUIDE.md) · [素材说明](ASSETS.md) · [第三方声明](THIRD_PARTY_NOTICES.md)

本次源码快照基于 2026-11-23 的 **Build 48**。对外版本为 **3.0.0**；Build 48 是内部构建编号，两者含义不同。本包没有旧站点的 Git 历史，也没有旧新闻照片、原始家庭照片、托管凭据或站点内部配置。

## 可以体验什么

- **百花齐放大厅**：一只手的拇指、食指开合，同时控制五朵花；也可自动演示、拖动滑块。
- **五个独立展厅**：默认右手双指控制绽放，左手张掌左右平移切换主题；支持左右手交换及校准。
- **连续开合**：通过高清花卉序列帧定位，展示 0% 含苞至 100% 盛放；支持鼠标、触摸和自动演示。
- **文化与助农**：产地故事、文化身份、二十道花食参考做法，以及附来源的产品与产业入口。
- **本地识别**：摄像头由用户主动开启并授权；项目代码在设备本地处理画面，不将其上传到服务器。

花卉动画是 AI 辅助创作视频的序列帧交互，不是实时植物生长模拟或原创识别模型；项目创新集中在交互整合、内容策划和数字助农场景。

## 三步在电脑上运行

1. 下载完整项目并解压，进入含有本文件和 `package.json` 的 `palm-bloom` 文件夹。
2. 安装 [Node.js LTS](https://nodejs.org/)，在此文件夹打开终端，运行：

   ```bash
   npm start
   ```

3. 在 Chrome 或 Edge 打开 **http://localhost:8080**。按网页按钮授权摄像头。

无需 `npm install`，运行服务只用 Node.js 内置模块。Windows 也可双击根目录的 `启动网站.cmd`；它会寻找已安装的 Node.js 或 Python。程序启动后保持命令窗口开启，结束时按 `Ctrl+C`。

不要直接双击 `dist/index.html`。摄像头、ES 模块和模型读取需要通过 localhost 或 HTTPS 访问。启动详情见 [本地运行说明](docs/RUN_LOCAL.md)。

下载完成且电脑已装好运行环境后，核心网页、动画和模型可以在本地无互联网、无 VPN 运行。新闻和购买链接仍需联网；GitHub 和在线展示站在不同地区的网络可达性不作保证。

## 技术组成

| 部分 | 实现 |
| --- | --- |
| 页面 | HTML、CSS、原生 ES Modules，无前端构建步骤 |
| 手势 | MediaPipe Tasks Vision 0.10.22-rc.20250304、Hand Landmarker |
| 线程 | Web Worker 处理识别，主线程处理交互与 Canvas 绘制 |
| 动画 | 96 帧高清序列包，流式下载与解码、有限缓存、主题原子切换 |
| 校准 | 相对掌宽距离、张合端点校准、平滑及左右手角色管理 |
| 数据 | 静态内容文件、浏览器 localStorage 校准、Cache Storage 资源缓存 |

字体使用系统字体。JavaScript、WASM 和模型文件均随项目提供，不依赖运行时远程 CDN。

## 项目目录

- `dist/`：可直接部署的静态网站。`index.html` 是大厅，`flower.html` 是花卉展厅。
- `dist/themes.js`：花卉顺序、名称和基础信息。
- `dist/content.js`、`origins.js`、`*-content.js`：文化、菜谱及产业内容。
- `dist/assets/`：动画、照片、AI 配图和菜品图，适用独立素材说明。
- `dist/vendor/`：未改动的 MediaPipe 发布文件及模型。
- `scripts/serve.mjs`：仅绑定本机的静态服务；`scripts/` 其他脚本用于可选的素材预处理。
- `tests/`：手势映射、角色稳定、主题切换、动画解码和菜谱一致性测试。
- `docs/`、`LICENSES/`：使用、贡献、素材来源及第三方许可说明。

## 检查与开发

```bash
npm test
npm run check
```

普通修改不需要重建花卉素材。若要处理新视频，阅读 [开发说明](docs/DEVELOPMENT.md)。不要直接运行旧的素材准备脚本覆盖现有高清资源。

## 部署到自己的静态服务器

将 `dist/` 的全部内容作为站点根目录上传，启用 HTTPS。GitHub Pages 的可选手动工作流已提供：在仓库 Settings → Pages 选择 GitHub Actions，再运行 Actions 中的 **Deploy static site to GitHub Pages**。默认不会因为上传源码就自动替你开通 Pages。

本项目使用相对资源路径，可部署在 GitHub Pages 的仓库子路径下。服务器需要正确返回 `.mjs`、`.wasm`、`.webp`、`.bin` 和 `.task` 文件；不要把资源请求重写成 HTML。

## 开源与素材授权范围

**MIT 只适用于本项目自有源代码及技术文档。** 允许在遵守 MIT 条件的前提下使用、修改、分发及商用这些代码，须保留版权与许可声明。

- MediaPipe 及随附模型遵循各自上游许可，见 `THIRD_PARTY_NOTICES.md`。
- 图片、视频、人物肖像、项目名称和品牌不因代码开源而自动获得 MIT 授权，见 `ASSETS.md`。
- 新闻报道作为事实查证链接保留，不代表相关媒体、商家或产地为本项目背书。
- AI 花卉与菜品画面是数字示意，不用于判定植物食用安全、药用用途或商品实物品质。

欢迎以 Issue 提交可复现问题，以 Pull Request 改进交互、可访问性和资料准确性。详见 [贡献指南](CONTRIBUTING.md)。
