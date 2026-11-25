# 会话交接记录：AAIF 中文社区站点从 0 到 1 与无障碍精修（2026-11）

- **协作工具**：Claude Code（初版搭建与视觉收敛）→ Antigravity（WCAG 2.2 实测修复、Luma 实时核对、双语版与 Agent 入口建设）
- **记录原则**：已脱敏（不含本机路径、账号凭据与冗余工具日志），保留全部关键需求、被否决方案与最终决策，供后续人或 Agent 直接接力。

---

## 阶段 1：初版搭建与视觉方向收敛（2026-11-17 ～ 11-18，Claude Code）

### 初始需求边界
- 技术栈：Vite + 纯 HTML/CSS/JS，`base: "./"`，零重框架依赖，支持任意静态托管。
- 品牌与合规红线：
  - 明确说明为志愿者运营的中文社区站点（非官方站，官方站为 `https://aaif.io/`）；
  - 官方头衔统一写「社区活动组织者 / Community Organizer」，绝不使用「大使 / Ambassador」；
  - 页脚右侧仅使用一次未改动的白色 AAIF 官方符号，并保留域名赞助方 `vivo` 署名；
  - 不虚构活动照片、演讲者、表单或未开放活动的报名链接。

### 关键设计转折（避坑记录）
1. **否决「炫技型 Awwwards 风格」**：中间尝试过较强艺术化动效方案，但阅读压力过大。随后回归「**瑞士网格 + 印刷杂志感 + 清晰可读 + 严格无障碍**」的四色极简系统（`#0b0a09` / `#ece7de` / `#ff702d` / `#b6b0d0`，无圆角、无阴影、无毛玻璃）。
2. **首屏城市地标剪影三版迭代**：
   - v1 单线轮廓：过于像工程制图 → 否决；
   - v2 纯黑剪影：视觉过重抢日期重心 → 否决；
   - v3 同色调剪影（`#918ca5`，比淡紫底深一档，居中置于弧线交点与橙色方块下方）：最克制且具辨识度 → **最终采纳**（北京故宫太和殿、深圳地王+平安+春笋、上海东方明珠；杭州筹备中保留纯弧线）。
3. **性能优化**：在 `vite.config.js` 编写 `pruneUnusedFontSlices()` 插件，构建时自动扫描入口 HTML 出现的字符并裁掉未使用的中文字体分片。

---

## 阶段 2：WCAG 2.2 无障碍实测与视觉精修（2026-11-25，Antigravity）

通过 Playwright 在 `1440px` / `1024px` / `768px` / `390px` 视口及 **200% 字体缩放** 下逐项审计并修复：

1. **修复 200% 字体缩放重叠（WCAG 1.4.4）**：为 `.nextset` 启用 `container-type: inline-size`，`.next__date` 改为 `clamp(2.75rem, 25cqi, 7rem)` + `white-space: nowrap`，消除大号日期折行压住时间行的问题。
2. **修复 Label-in-Name 一致性（WCAG 2.5.3）**：移除 `.bar__cta` 上与可见文本顺序不一致的 `aria-label`，改用自然 DOM 顺序 + `.sr-only`。
3. **修复「回到顶部」焦点目标**：在 `<body>` 补齐 `id="top" tabindex="-1"`，确保键盘点击「回到顶部」后焦点正确回归页首。
4. **修复轮播隐藏面板焦点泄漏**：在 `src/main.js` 中为非当前城市卡片同步设置 `inert` 与 `aria-hidden="true"`，并补充 `aria-roledescription`。
5. **补全社交元信息与视觉微调**：补齐 `og:*` / `twitter:card` 标签；给 `.nextset` 补 `1px solid var(--lilac)` 消除选中「北京」标签时的左上角缺口；对齐 4 个城市卡片标题起始高度。

---

## 阶段 3：Luma 活动实况核对与多形态扩展（2026-11-25，Antigravity）

1. **实时拉取全部 Luma 活动页核对**：
   - 发现 **北京站**（`luma.com/43j4ovh8`）发生两处重要变更：时间由 `18:30–21:30` 更新为 **`13:30–20:00`**（Meetup 13:30–17:30 + Happy Hour 18:00–20:00），地点由「阿里巴巴北京朝阳科技园（待定）」更新为 **「中关村创业大街氪空间（海淀区中关村创业大街 2 号楼 A 入口 3 层）」** → 已同步更新站点与 Markdown。
   - 确认 **深圳站**（`luma.com/01mkdbpc`）与 **上海站**（`luma.com/x2qerafa`）时间与公开地点无变化。
2. **零插件静态英文版（`/en/`）**：
   - 不接入第三方机翻插件（避免误译官方头衔与破坏无障碍语义）；
   - 通过 Vite 多入口同时构建中文首页（`/`）与英文版（`/en/`），在顶栏提供 `EN` / `中文` 切换与 `hreflang` 互指；
   - 针对英文排版定制水平城市标题、自然词间换行与双语化 JS 读屏文案。
3. **专供 AI Agent 访问的 Markdown 入口**：
   - 新增 `/llms.txt`（双语总览与索引）、`/index.md`（中文完整版）、`/en/index.md`（英文完整版），通过 HTML `<link rel="alternate" type="text/markdown">` 与页脚入口暴露。

---

## 当前状态与下一步交接（Handoff）

- **已验证通过**：`npm run build` 0 报错；中/英文双页面 Playwright 截图核验通过；0 控制台报错；多视口与 200% 字体缩放 0 横向溢出；`/llms.txt`、`/index.md`、`/en/index.md` 均完整输出。
- **待社区决策 / 后续事项**：
  1. 合并 PR 到 `aaifcc/aaifcc.github.io:main` 后，将仓库 GitHub Pages 的 Source 切换为 **GitHub Actions**，并在 Settings → Pages 重新触发 `aaif.cc` 的 HTTPS 证书签发（当前状态 `bad_authz`）；
  2. 杭州站与 2027 Agentic AI Week 确定日期/Luma 链接后，按 `AGENTS.md` 同步更新 `index.html`、`en/index.html`、`public/llms.txt`、`public/index.md`、`public/en/index.md`；
  3. 评估后续多城市协作时是否接入 **PowerContext**（`oceanbase/powercontext`）作为跨 Coding Agent 的长期共享上下文服务。
