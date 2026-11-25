# Coding Agent 会话共享与交接说明（Agent Sessions & Context Handoff）

本目录用于共享本站点在 **人机协作（Coding Agent）** 过程中的关键设计决策、提示词脉络、取舍依据与验证结果，方便社区里的其他贡献者无论使用 **Claude Code、Codex、Cursor、Antigravity** 还是其他 Coding Agent，都能无缝接力维护，而不必从零摸索。

---

## 为什么不直接上传原始 `.jsonl` 聊天记录？

1. **噪音与体积**：原始会话日志往往超过数 MB，夹杂大量试错、工具输出和上下文压缩摘要；
2. **隐私与安全**：原始日志容易包含贡献者本机绝对路径、终端环境变量或临时调试信息；
3. **可复用性差**：Agent 真正需要的是「**不可违背的约束 + 已拍板的决策 + 被否决的坑 + 当前状态与下一步**」。

---

## 当前的三层上下文协作方案

| 层级 | 文件 / 工具 | 作用 |
| --- | --- | --- |
| **第 1 层：持久规范** | 根目录 [`AGENTS.md`](../../AGENTS.md) | AAIF 自家开源标准；定义品牌红线、视觉系统、无障碍基线、Luma 同步规则 |
| **第 2 层：脱敏会话交接记录** | `docs/agent-sessions/*.md` | 按迭代记录真实人机协作的提示词演变、被否决方案（避坑）与验收证据 |
| **第 3 层：站点 Agent 入口** | `public/llms.txt`、`public/index.md`、`public/en/index.md` | 面向外部来访 Agent 的结构化站点入口 |

---

## 关于后续接入 PowerContext（开源上下文服务）的评估

社区讨论了后续是否引入开源项目 **[PowerContext](https://github.com/oceanbase/powercontext)**（由 OceanBase 团队开源的 AI Agent 上下文与跨端交接服务，亦在 AAIF 深圳站 Meetup 中分享）来管理跨会话、跨工具的长期上下文记忆。

- **PowerContext 解决的核心问题**：把分散在不同 Coding Agent（如 Claude Code、Codex 等）里的对话提炼为按 Scope 隔离的持久化「决策 / 约束 / 证据 / Handoff」记忆，支持跨设备、跨 Agent 接力，无需手工整理日志。
- **本仓库的分阶段建议**：
  1. **现阶段（轻量静态站）**：用 Git 原生的 `AGENTS.md` + `docs/agent-sessions/*.md`（零外部服务依赖、任何 PR 直接审阅，且本身就是结构化 Markdown，随时可作为源文档导入 PowerContext）；
  2. **下一阶段（多城市长期协作 / 多 Agent 自动化更新）**：如果社区开始维护多页面、多城市活动自动化同步或共享长期任务记忆，可以将本仓库作为独立 Scope 接入 **PowerContext**，把 `AGENTS.md` 与本目录记录直接导入，实现跨贡献者、跨 Coding Agent 的实时上下文接力。

---

## 已有会话记录

- [`2026-11-site-build-and-audit.md`](./2026-11-site-build-and-audit.md)：首版从 0 到 1 搭建、视觉风格收敛、城市剪影三版迭代、WCAG 2.2 无障碍审计、Luma 信息核对、双语版与 Agent Markdown 入口建设完整脉络。
