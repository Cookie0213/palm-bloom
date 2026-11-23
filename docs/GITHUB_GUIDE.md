# 掌间花开：零基础 GitHub 开源发布指南

> 当前公开仓库：https://github.com/Cookie0213/palm-bloom 。以下从零发布步骤供复用学习；已有此仓库时，请克隆现有仓库，不必重新创建。GitHub Pages 未开通。

本指南配套 V3.0.0 源码包（基于 Build 48）。你已选择 **MIT 代码许可证**；文件已经写好，不要在 GitHub 再生成一套不同的 README 或许可证。

## 第 1 步：注册免费的个人账号

打开 https://github.com/signup ，按页面填写自己的邮箱、用户名和密码，完成邮箱验证与网站要求的验证。账号条款、密码和验证码由你本人处理；不要把密码或验证码发给别人。普通个人免费账号足以开始这个项目。

用户名会进入以后仓库的网址，例如 `https://github.com/你的用户名/palm-bloom`。这是格式示例，目前尚未创建这个仓库。用户名可以与中文姓名不同。

## 第 2 步：下载项目并完整解压

下载本次提供的 `PalmBloom-v3.0.0-Build48-OpenSource.zip`，右键“全部解压”。打开解压后的 `palm-bloom`，确认里面直接有 `README.md`、`LICENSE`、`package.json`、`dist`、`scripts` 和 `tests`。

先按 `docs/RUN_LOCAL.md` 在本机打开网站。源码开源与在线托管不同：仓库用于分享代码，Pages 或其他托管用于让别人通过网址体验。

## 第 3 步：安装 GitHub Desktop

打开 https://desktop.github.com/ 下载官方 GitHub Desktop，安装后选择 Sign in to GitHub.com，使用刚注册的账号登录。GitHub Desktop 用来上传整个文件夹，比逐个网页拖拽更适合这个项目。

如果它询问提交者姓名和邮箱：姓名可填写公开使用的名字；邮箱可选 GitHub 的隐私 noreply 邮箱（在 GitHub Settings → Emails 查看），避免把私人邮箱写进公开提交。

## 第 4 步：用干净快照建立新仓库

本包故意没有 `.git` 历史。不要从旧站点目录复制历史，也不要把旧新闻照片加回去。

1. 在 GitHub Desktop 中选择 File → Add local repository。
2. 选择解压后的 `palm-bloom` 文件夹。
3. 如果提示该文件夹不是 Git 仓库，点击 **create a repository here**。确认 Name 为 `palm-bloom`，最终路径就是当前包含 `README.md` 的目录，避免生成 `palm-bloom/palm-bloom` 空嵌套目录。
4. 不要勾选重新创建 README；不要再选一份不同的 License 或 Git ignore，本包已有这些文件。
5. 创建后检查 Changes 中的内容。首次提交说明可填 `Initial release: Palm Bloom v3.0.0`，提交全部项目文件。如果创建时已自动做了初始提交，先确认文件已经纳入，不必重复提交。

如界面找不到 create a repository here：在 GitHub Desktop 用 File → New repository 创建名为 `palm-bloom` 的本地空仓库，再把解压项目**里面的内容**复制进去（保留新仓库自动生成的 `.git`），然后提交。不要把整个外层文件夹再嵌套一层。

## 第 5 步：公开发布

点击 **Publish repository**：

- Name：`palm-bloom`。
- Description：`掌间花开：基于 MediaPipe 的四川特色花卉手势交互与数字助农展示项目`。
- 选择你的个人账号，不选不属于你的组织。
- **取消勾选 Keep this code private**，表示公开仓库。
- 点击 Publish repository，等待上传完成。

上传的是解压后的完整项目，不是只往仓库里扔一个 ZIP。这个项目有一千多个文件，所以推荐 Desktop。浏览器逐批上传有数量和单文件限制，容易漏掉模型与序列帧。

## 第 6 步：检查开源是否完成

点击 Repository → View on GitHub，确认：

- 仓库显示 Public。
- 页面首页能显示中文 README。
- 根目录有 MIT `LICENSE`、`ASSETS.md`、`THIRD_PARTY_NOTICES.md`。
- `dist/vendor` 有模型、JavaScript 和 WASM；`dist/assets` 有动画资源。
- 没有 `.openai`、密码文件、原始家庭照片或旧新闻原图。
- Actions 中的 **Check project** 运行成功；如果失败，打开错误记录再处理。

这些条件满足，才是代码已经公开并有明确开源许可。下载 ZIP 给朋友属于分享文件，和发布 GitHub 开源仓库不同。

## 第 7 步（可选）：建立 v3.0.0 Release

在仓库 Releases → Draft a new release：

- Tag：`v3.0.0`，目标选择当前默认分支。
- Title：`掌间花开 V3.0 · 数字助农互动版`。
- 内容参考 `CHANGELOG.md` 的 3.0.0 条目。
- 点击 Publish release。需要时可附上本次 ZIP；源码本身已经在仓库里，不靠附件代替源码目录。

## 第 8 步（可选）：发布 GitHub Pages 网站

本次只完成源码开源，不开通 GitHub Pages。若以后需要新的在线网址，再单独配置托管服务；当前仓库没有可直接运行的 Pages 部署工作流。可以继续使用 README 中的原有在线体验地址。

GitHub Pages 和 GitHub 在中国大陆的访问体验因网络而异，并不保证所有电脑都能稳定访问。要给无 VPN 的电脑演示，可以另外发送完整离线包，通过 localhost 运行；开源不等于必须更换当前在线站。

## 以后怎样更新

修改本地代码 → 本地验证 → Desktop 查看改动 → 填写提交说明 → Commit → Push origin。不要把摄像头录制或私密文件一起提交。对外版本号可以根据实际功能变化递增，内部 Build 编号继续单独记录。

## 授权范围再看一眼

MIT 允许他人按许可条件使用、修改和商用代码，并要求保留相应版权与许可声明。图片、视频和人物肖像有独立说明，不因为代码开源就自动无限制商用。MediaPipe 继续适用上游 Apache 许可。

## 官方资料

- 注册账号：https://docs.github.com/en/account-and-profile/how-tos/account-management/creating-an-account-on-github
- Desktop 发布已有项目：https://docs.github.com/en/desktop/adding-and-cloning-repositories/adding-an-existing-project-to-github-using-github-desktop
- GitHub 文件上传限制：https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
- GitHub Pages 自定义流程：https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- MIT：https://choosealicense.com/licenses/mit/

资料核对日期：2026-11-23。GitHub 按钮位置可能随界面更新微调，以实际页面为准。
