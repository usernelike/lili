# Karpathy Guidelines 使用说明

> **来源仓库：** [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills)
> **许可：** MIT License
> **集成日期：** 2026-05-20
> **作者原始设计：** Andrej Karpathy（LLM 编码陷阱观察）→ [forrestchang](https://github.com/forrestchang)（Claude Code 插件化）→ [multica-ai](https://github.com/multica-ai)（Skill 标准化）

---

## 这是什么？

这是一套 **AI 编码行为准则**，源自前 Tesla AI 总监、OpenAI 创始成员 **Andrej Karpathy** 对大语言模型编码行为的经典观察。它总结了 LLM 写代码时最常犯的 4 类错误，并给出对应的纠正原则。

**核心价值：** 让任何 AI 工具（CatPaw / Cursor / Claude Code / Copilot / 终端 AI）在写代码时更谨慎、更精准、更简洁。

---

## 四大原则速查

| # | 原则 | 一句话总结 |
|---|------|-----------|
| 1 | **编码前思考** | 不确定就问，不要默默猜 |
| 2 | **简洁优先** | 能 50 行搞定的不要写 200 行 |
| 3 | **精准修改** | 只改用户要求的，不"顺手改进" |
| 4 | **目标驱动执行** | 给成功标准，不给操作指令 |

---

## 在各工具中的使用方式

### CatPaw IDE（原生支持，最完整体验）

**文件位置：** `.catpaw/skills/karpathy-guidelines/SKILL.md`

CatPaw 会自动识别并加载此 Skill。在以下场景自动触发：

- ✅ 编写新代码时 — 自动应用"简洁优先"原则
- ✅ 修改现有代码时 — 自动应用"精准修改"原则
- ✅ Code Review 时 — 自动按四大原则检查
- ✅ 重构时 — 自动要求先定义验证标准

**手动触发：**
```
请按照 karpathy-guidelines skill 的四原则来审查这段代码
```

---

### Cursor IDE（已配置，开箱即用）

**文件位置：** `.cursor/rules/karpathy-guidelines.mdc`（已设置 `alwaysApply: true`）

打开项目即自动生效，无需额外操作。可在 **Settings → Rules** 中确认已加载。

---

### Claude Code / 终端 AI

**文件位置：** `CLAUDE.md`（项目根目录）

Claude Code 启动时会自动读取 `CLAUDE.md`。使用方式：

```bash
# 方式1：直接在项目目录中启动 Claude Code
cd /Users/li/Desktop/kimi\ code
claude

# 方式2：在对话中引用
> 请按照 CLAUDE.md 中的行为准则来完成任务

# 方式3：让 AI 读取 Skill 文件
> 先读取 .catpaw/skills/karpathy-guidelines/SKILL.md，然后按其中的原则重构这个函数
```

---

### VS Code + GitHub Copilot

**文件位置：** 需要手动创建

```bash
# 复制 CLAUDE.md 内容到 Copilot 指令文件
cp CLAUDE.md .github/copilot-instructions.md
```

Copilot 会在下次对话时自动读取。

---

### 其他终端 AI 工具（Aider / Continue / 等）

```bash
# 方法1：直接粘贴内容
cat .catpaw/skills/karpathy-guidelines/SKILL.md | pbcopy

# 方法2：在对话中引用
# "请读取 .catpaw/skills/karpathy-guidelines/SKILL.md 并遵循其中的原则"

# 方法3：添加到 Aider 配置
echo ".catpaw/skills/karpathy-guidelines/SKILL.md" >> .aider.conf.yml
# （具体取决于你的 Aider 配置格式）
```

---

## 与项目中其他 Skill 的协作关系

```
┌─────────────────────────────────────────────┐
│         karpathy-guidelines (思维层)          │
│    怎么思考：假设？简洁？精准？可验证？         │
└──────────────────┬──────────────────────────┘
                   │ 决定"怎么做"
       ┌───────────┼───────────┐
       ▼           ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│frontend- │ │ api-     │ │java-     │
│component │ │convention│ │backend   │
│(技术层)  │ │(技术层)  │ │(技术层)  │
└──────────┘ └──────────┘ └──────────┘
                   │
                   ▼
          ┌────────────────┐
          │code-review-audit│
          │ (最终检查)      │
          └────────────────┘
```

**使用顺序：**
1. **karpathy-guidelines** → 确定思维方式和行动策略
2. **具体技术 Skill** → 获取 API 格式、组件规范等技术细节
3. **code-review-audit** → 最终质量检查

---

## 实际使用示例

### 示例 1：新功能开发

```
用户: 给股票详情页加一个 K 线图切换功能

AI 思考过程（遵循 karpathy-guidelines）:

【原则1 - 编码前思考】
- 假设确认: 用户要日K/周K/月K切换？还是只显示K线？
- 更简单方案: 先做日K显示，切换按钮后续迭代？
- → 向用户确认需求范围

【原则2 - 简洁优先】
- 不创建 ChartConfig 抽象类
- 不做"未来可能支持更多图表类型"的设计
- 直接用 enum + switch，50行搞定

【原则4 - 目标驱动】
- 成功标准:
  1. 页面显示日K线图 → 验证: 可视化渲染正确
  2. 数据来自腾讯API → 验证: stock-data-parser 解析无误
  3. 样式匹配现有风格 → 验证: CSS变量一致
```

### 示例 2：Bug 修复

```
用户: 登录后 token 没保存到 localStorage

AI 思考过程:

【原则3 - 精准修改】
- 只改 login 相关的 token 存储逻辑
- 不"顺手"重构整个 auth 模块
- 不改动相邻的 logout 函数（即使觉得它也有问题）
- 提一句："logout 函数的清理逻辑看起来也可能有类似问题，要我一起修吗？"

【原则4 - 目标驱动】
- 成功标准: 登录成功后 localStorage.token === 响应中的 token
- 验证: 写一个测试用例复现问题，修复后测试通过
```

### 示例 3：Code Review

```
用户: 帮我 review 这个 PR

AI 审查过程（同时应用 karpathy-guidelines + code-review-audit）:

【karpathy-guidelines 检查】
- 原则1: 改动是否有未说明的假设？
- 原则2: 是否过度工程？（100行能写成的写了500行？）
- 原则3: diff 中是否包含无关改动？（格式调整、重命名等）
- 原则4: 有没有可验证的成功标准？

【code-review-audit 检查】
- P0: 认证 header 是否正确传递？
- P1: iOS Safari 兼容性？
- P2: 命名规范？
```

---

## 文件清单

本 Skill 在项目中的完整分布：

| 文件 | 用途 | 目标工具 |
|------|------|---------|
| `.catpaw/skills/karpathy-guidelines/SKILL.md` | 完整版 Skill（含示例和协作流程） | **CatPaw** |
| `.cursor/rules/karpathy-guidelines.mdc` | Cursor 规则（alwaysApply） | **Cursor** |
| `CLAUDE.md` | Claude Code 指令文件 | **Claude Code / 终端 AI** |
| `.cursorrules` | 项目规则总入口（已更新引用） | 所有工具 |
| `docs/SKILLS_REGISTRY.md` | Skill 注册表（已更新） | 文档参考 |
| `docs/KARPATHY_GUIDELINES_USAGE.md` | 本使用说明文档 | 人工参考 |

---

## 定制与扩展

### 为项目添加特定约束

可以在对话或各工具配置文件中追加项目特定规则：

```markdown
## 项目特定约束（与 Karpathy 准则配合使用）

- 本项目使用内联样式 + CSS 变量，禁止新建 CSS 文件
- Java 后端必须使用构造器注入，禁止 @Autowired 字段注入
- 所有 API 必须返回 ApiResponse<T> 格式
- 股票数据解析必须参考 stock-data-parser Skill 的索引映射
```

### 调整严格程度

- **日常小任务**（改 typo、调颜色）：可以跳过完整的四原则流程
- **重要功能开发**：严格遵循全部四原则
- **PR Review**：必须用全部四原则 + code-review-audit 双重检查

---

## 原始资源

- [Karpathy 原始推文](https://x.com/karpathy/status/2015883857489522876)
- [GitHub 仓库（源码）](https://github.com/multica-ai/andrej-karpathy-skills)
- [英文 README](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/README.md)
- [中文 README](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/README.zh.md)
