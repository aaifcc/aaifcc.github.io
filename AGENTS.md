# AAIF 中文社区站点 · AGENTS.md

本文件供人类贡献者与 Coding Agent（Claude Code、Codex、Cursor、Antigravity 等）共同遵循，用于保持 **AAIF 中文社区站点** 的品牌合规、设计语言一致性、无障碍标准与活动信息准确性。

---

## 1. 站点定位与品牌红线（不可违背）

1. **非官方声明**：这是由志愿者维护的中文社区站点，与 Agentic AI Foundation（Linux Foundation 旗下）无隶属、赞助或背书关系；官方网站为 `https://aaif.io/`。须清晰呈现但不可喧宾夺主。
2. **官方头衔**：必须统一使用 **「社区活动组织者 / Community Organizer」**，**绝对不要**写「大使 / Ambassador」。
3. **官方标识（Logo）**：`public/brand/AAIF_Symbol_White.svg` 仅在页脚右侧使用**一次**，不得修改图形、颜色、比例，也不得添加旋转/缩放/发光等特效。
4. **域名赞助署名**：页脚保留域名赞助方 `vivo` 署名，链接指向 `https://github.com/vivo`。
5. **内容真实性**：
   - 不得虚构活动照片、演讲嘉宾、官方申请表单或未开放活动的报名链接；
   - 筹备中活动（如杭州站、Agentic AI Week）不放假链接；
   - 所有活动日期、时间（统一标注北京时间 UTC+8）、地点、标题与 Luma 公开页面核对一致；Luma 设为 `guests-only` 的地点不泄露也不杜撰详细街道。

---

## 2. 视觉与排版系统

- **配色严格限制在 4 个核心色值**（以及派生高对比度中性色）：
  - 背景黑 `#0b0a09`（`--bg` / `--ink`）
  - 正文米白 `#ece7de`（`--fg`）
  - 珊瑚橙 `#ff702d`（`--coral`）
  - 丁香紫 `#b6b0d0`（`--lilac`，剪影叠加深一档同色调 `#918ca5`）
- **禁止使用的视觉修饰**：禁止 `border-radius`（圆角）、`box-shadow`（阴影）、`backdrop-filter` / `blur`（毛玻璃）。
- **构图与字体**：12 列瑞士网格；标题 `Instrument Sans` + `Noto Serif SC`，正文 `Noto Sans SC`，元信息 `IBM Plex Mono`。`vite.config.js` 会在构建时按 `index.html` 实际出现的字符自动裁剪中文字体子集——**修改中文文案后务必重新执行 `npm run build`**。
- **首屏城市剪影**：同色调 `#7f7999` 几何建筑剪影位于弱化弧线与橙色方块下方，配左上角城市地标角标，随城市标签切换（北京：故宫太和殿；深圳：城市天际线；上海：东方明珠；杭州：雷峰塔）。

---

## 3. 无障碍标准（WCAG 2.2 AA / AAA）

任何改动都不得破坏以下基线：

- **对比度**：所有文本（含次要说明、面板墨色字）对比度 ≥ 7:1（AAA）；保留 `prefers-contrast: more` 与 `forced-colors: active` 降级样式。
- **键盘与焦点**：保留顶部「跳到主要内容」链接、清晰 `:focus-visible` 轮廓、`#top` 回到顶部焦点管理；轮播非激活面板必须保持 `inert` + `aria-hidden="true"`，键盘聚焦或鼠标悬停时暂停自动轮转。
- **读屏语义**：规范 `header` / `nav` / `main` / `footer` 地标与 `h1` → `h2` 标题层级；装饰性 SVG 一律 `aria-hidden="true"`；新窗口外链附 `.sr-only`「（在新窗口打开）」；英文内容标 `lang="en"`。
- **缩放与动效**：200% 字体缩放及 1440 / 1024 / 768 / 390 视口下 0 横向溢出、0 文字重叠；所有过渡与自动轮播必须尊重 `prefers-reduced-motion: reduce`。

---

## 4. 双语版与专供 Agent 访问的站点文件

- **静态双语版（零插件）**：`index.html`（中文首页 `/`）与 `en/index.html`（英文版 `/en/`）由 Vite 多入口统一构建，通过顶栏 `EN` / `中文` 互跳，并在 `<head>` 声明 `hreflang`。**不要引入第三方自动翻译插件**，以免误译「社区活动组织者 / Community Organizer」或破坏无障碍语义。
- **专供 Agent 访问的 Markdown**：`public/llms.txt`（双语总览）、`public/index.md`（中文版）、`public/en/index.md`（英文版）会在构建时原样输出到站点根目录与 `/en/`，并在 `<head>` 通过 `<link rel="alternate" type="text/markdown">` 与页脚暴露。
- **会话与上下文共享**：迭代决策与脱敏会话交接记录保存在 `docs/agent-sessions/`（见 `docs/agent-sessions/README.md`，含后续接入开源上下文服务 PowerContext 的评估建议）。
- **同步要求**：**每次更新活动时间、地点、链接或城市组织者时，必须同步更新 `index.html`、`en/index.html`、`public/llms.txt`、`public/index.md` 和 `public/en/index.md`**，保持中/英人类视图与 Agent 视图完全一致。

---

## 5. 本地开发、验证与部署

```bash
npm install
npm run dev      # 本地开发预览
npm run build    # 构建 dist/（含中文字体子集自动裁剪）
npm run preview  # 预览生产构建产物
```

提交 PR 前建议验证：
1. `npm run build` 0 报错；
2. 核对所有 Luma 链接对应的标题、时间（UTC+8）与公开地点；
3. 在桌面端（1440px）、移动端（390px）与 200% 字体缩放下检查无溢出、无重叠，4 个城市标签切换正常；
4. 确认 `public/llms.txt`、`public/index.md` 与 `public/en/index.md` 已随页面内容同步更新。

### PR 规范（Pull Request Convention）

- **PR 标题（Title）**：统一使用英文，遵循 Conventional Commits 风格（如 `feat: ...`、`fix: ...`、`docs: ...`），方便国际化检索与上游社区协作。
- **PR 描述（Description）**：使用**中英双语**（English + 中文），写明改动摘要、线上预览地址与验证情况。
