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

## 专供 Agent 访问与协作

- **站点 Agent 入口**：构建后提供 `/llms.txt` 与 `/index.md`（源文件位于 `public/llms.txt`、`public/index.md`），并在 HTML `<head>` 中通过 `<link rel="alternate" type="text/markdown">` 声明。
- **人机协作规范**：见根目录 [`AGENTS.md`](./AGENTS.md)，包含品牌红线、视觉系统、WCAG 2.2 无障碍要求与活动同步流程。

## 部署说明（GitHub Pages）

仓库包含 `.github/workflows/deploy.yml`：当代码合并到 `main` 且仓库 Settings → Pages 的 Source 切换为 **GitHub Actions** 后，会自动构建 `dist/` 并保留根目录 `CNAME` 发布。
