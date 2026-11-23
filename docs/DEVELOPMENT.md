# 开发说明

这是一个构建步骤为零的静态 ES Modules 项目。日常改 HTML/CSS/JS 后刷新浏览器即可。

## 内容入口

- 花名、产地、主题顺序：`dist/themes.js`。
- 主页卡片与文字：`dist/index.html`、`dist/home.js`。
- 文化故事与产品：`dist/origins.js`、`dist/jasmine-content.js`、`dist/panzhihua-content.js`。
- 菜谱数据：`dist/content.js` 及 `*-recipes.js`；详情页位于 `dist/recipes/`。
- 手势映射：`dist/math.js`；左右手：`dist/hand-roles.js`；挥手：`dist/swipe.js`。
- 单花动画：`dist/sequence-store.js`；五花同步：`dist/home-sequences.js`。

## 素材脚本

现有 `scripts/prepare-*.py`、`stabilize-lotus.py` 和 `pack-sequences.py` 是各次素材处理的工具，部分是历史处理路径，并非按名称顺序执行的统一构建流水线。运行前阅读脚本，确认输入文件、裁切坐标与输出路径，并备份素材。当前所有展示资源已随包提供，运行网站无需执行这些脚本。

可选环境：Python 3、Pillow、NumPy、opencv-python、SciPy，以及某些脚本调用的 FFmpeg。脚本按相对项目根目录定位资源；替换视频时需要重新核对所有花苞/盛放端点和画面构图。

96 帧序列包格式：前 4 字节 little-endian 无符号整数表示 JSON 头长度；JSON 含 `width`、`height`、`lengths`；随后按顺序连接 WebP 帧字节。不要改动长度表却不重建二进制主体。

缓存以资源 URL 为键。更新同名动画或模型内容时要版本化文件 URL 或同步更新 `dist/asset-cache.js` 缓存名，避免旧资源残留。

## 验证

`npm test` 检查手势映射、序列帧、主题与菜谱；`npm run check` 检查发布文件、媒体清单及敏感文件排除。真实摄像头效果仍需在目标设备上人工测试；单元测试不能替代低光、快动作和不同摄像头的实际体验。

本地静态服务器支持 HEAD 和单段 Range，绑定 127.0.0.1，仅用于本地预览，不用于直接承载公网生产流量。
