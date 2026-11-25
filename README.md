# AAIF 中文社区

志愿者维护的 AAIF 中文社区站点，在中国各城市组织公开活动并分享开放智能体标准（MCP、AGENTS.md、Goose、Agent Skills 等）。

> **说明**：本站为志愿者维护的中文社区站点，与 Agentic AI Foundation 无隶属、赞助或背书关系。官方网站为 [aaif.io](https://aaif.io/)。

`本站域名 aaif.cc 由 [vivo](https://github.com/vivo) 赞助支持。`

---

## 本地开发与构建

```bash
npm install
npm run dev      # 本地开发预览
npm run build    # 构建静态产物至 dist/（自动按页面字符裁剪中文字体子集）
npm run preview  # 本地预览生产构建
```

## 双语版、Agent 入口与会话共享

- **静态中英双语（零插件）**：中文首页 `/`（`index.html`）与英文版 `/en/`（`en/index.html`），顶栏支持 `EN` / `中文` 互切。
- **专供 Agent 访问的 Markdown**：构建后自动提供 `/llms.txt`（双语总览）、`/index.md`（中文）与 `/en/index.md`（英文），并在 HTML `<head>` 通过 `<link rel="alternate" type="text/markdown">` 与页脚声明。
- **人机协作规范与会话共享**：
  - [`AGENTS.md`](./AGENTS.md)：AAIF 标准的持久协作规范（品牌红线、视觉系统、WCAG 2.2 无障碍基线与 Luma 同步约定）；
  - [`docs/agent-sessions/`](./docs/agent-sessions/README.md)：脱敏后的 Coding Agent 会话决策记录与后续接入 [PowerContext](https://github.com/oceanbase/powercontext) 的评估建议。

## 部署说明（GitHub Pages）

仓库包含 `.github/workflows/deploy.yml`：当代码合并到 `main` 且仓库 Settings → Pages 的 Source 切换为 **GitHub Actions** 后，会自动构建 `dist/` 并保留根目录 `CNAME` 发布。
