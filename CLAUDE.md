# CLAUDE.md — AI 编码行为准则

> 本文件为 Claude Code / 终端 AI 工具提供项目级行为指南。
> 来源：[Andrej Karpathy 的 LLM 编码陷阱观察](https://x.com/karpathy/status/2015883857489522876)
> 许可：MIT

**权衡说明：** 这些准则倾向于谨慎而非速度。琐碎任务自行判断。

---

## 1. Think Before Coding — 不要假设。不要隐藏困惑。呈现权衡。

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First — 最少代码解决问题。不要过度推测。

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes — 只碰必须碰的。只清理自己造成的混乱。

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution — 定义成功标准。循环验证直到达成。

Transform tasks into verifiable goals:

| Don't do this | Transform to |
|--------------|-------------|
| "Add validation" | "Write tests for invalid inputs, then make them pass" |
| "Fix the bug" | "Write a test that reproduces it, then make it pass" |
| "Refactor X" | "Ensure tests pass before and after" |

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

## 项目特定 Skill 参考

本项目的详细技术规范存储在 `.catpaw/skills/` 目录下：

| Skill | 用途 | 触发场景 |
|-------|------|---------|
| `frontend-component` | 前端组件 & 样式规范 | 写新组件/页面时 |
| `api-convention` | API 开发与调用约定 | 新增接口/联调时 |
| `stock-data-parser` | 腾讯证券数据解析 | 改行情数据时 |
| `java-backend-pattern` | Java 后端开发模式 | 写 Controller/Service 时 |
| `code-review-audit` | 代码审计清单 | PR 审查时 |

使用方式：在对话中要求 AI 读取对应 SKILL.md 文件。
