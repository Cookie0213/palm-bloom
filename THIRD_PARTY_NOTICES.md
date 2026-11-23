# 第三方软件与模型声明

本项目不主张拥有 MediaPipe、其模型或上游软件的著作权，也不把上游软件重新许可为 MIT。

## MediaPipe Tasks Vision

- 上游：Google AI Edge / MediaPipe Authors。
- 软件包：`@mediapipe/tasks-vision`，版本 `0.10.22-rc.20250304`。
- 许可：Apache License 2.0。完整上游许可文本（含随附声明）保留于 `LICENSES/MediaPipe-Apache-2.0.txt`。
- 上游仓库：https://github.com/google-ai-edge/mediapipe
- 软件包元数据：https://registry.npmjs.org/@mediapipe/tasks-vision/0.10.22-rc.20250304
- 上游许可证：https://github.com/google-ai-edge/mediapipe/blob/master/LICENSE
- Copyright The MediaPipe Authors。原文件内的版权与许可注释保留。

以下五个本地文件在 2026-11-23 与该版本 npm 官方发布包逐字节核对一致，未修改：

- `dist/vendor/vision_bundle.mjs`
- `dist/vendor/wasm/vision_wasm_internal.js`
- `dist/vendor/wasm/vision_wasm_internal.wasm`
- `dist/vendor/wasm/vision_wasm_nosimd_internal.js`
- `dist/vendor/wasm/vision_wasm_nosimd_internal.wasm`

npm 包没有单独随附 LICENSE 或 NOTICE 文件；此处补充上游仓库发布的 LICENSE 全文。没有自行编造上游 NOTICE。

## Hand Landmarker 模型

- 文件：`dist/vendor/hand_landmarker.task`。
- 与 Google 官方 float16/1 模型下载逐字节核对一致，未修改模型权重。
- 官方来源：https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task
- 官方手部跟踪模型卡：https://storage.googleapis.com/mediapipe-assets/Model%20Card%20Hand%20Tracking%20(Lite_Full)%20with%20Fairness%20Oct%202021.pdf
- 官方模型卡标示 Apache License 2.0；随包保留 Apache 许可及本来源说明，不适用本项目 MIT 许可。

此模型用于手部关键点与左右手分类；不是身份识别系统。模型有光照、遮挡、运动模糊及设备性能限制。本项目没有训练新的手势模型。

## 其他开发工具

网站运行本身无需安装 npm 第三方依赖。可选 Python 素材脚本会使用 Pillow、NumPy、OpenCV 和 SciPy；这些开发工具不随本包复制，安装时遵循各自上游许可。GitHub Actions 使用的官方 Actions 也按其各自许可运行。

第三方图片、视频与事实资料另见 `ASSETS.md` 和 `docs/CONTENT_SOURCES.md`。版本、文件大小与校验值见 `docs/VENDOR_MANIFEST.json`。
