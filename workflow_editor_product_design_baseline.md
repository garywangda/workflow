# Workflow Editor 产品设计基线
## Visual Business Workflow SaaS — Product Model & Editor Architecture

> 版本：v0.4
> 状态：Draft / Design Baseline  
> 用途：作为后续管理台、员工执行端、Workflow Editor、Toolbox、React Flow Node、Inspector、Workflow JSON、Execution Engine 与 AI 功能设计的统一基线。

---

# 1. 文档目的

本文档用于整理当前 Workflow SaaS 的核心产品设计方向，以及当前管理台概念原型的范围边界。

## 1.1 当前产品阶段

当前阶段只实现：

```text
Management Console Concept Prototype
管理者 / 运营人员管理台概念原型
```

当前阶段的目标是验证：

```text
流程如何被设计
流程如何被配置
流程如何被发布
流程运行后如何被查看
工作内容和进度如何被管理
```

当前阶段暂不实现：

```text
真实后端
真实数据库
员工执行 App
真实流程执行引擎
真实登录与权限
真实通知
第三方系统连接
真实 AI 调用
```

运行状态、执行记录和统计数据可以通过 Mock Data 展示，用于验证管理台的信息架构和交互体验。

## 1.2 产品用户与产品端

首要用户是负责制定、维护和管理业务流程的运营人员与经理。

未来产品包含两个主要界面：

```text
Management Console
面向运营人员和经理，用于设计、配置、发布和监控流程

Employee App
面向员工，用于接收、执行和提交系统配发的任务
```

两个界面未来可以作为不同的子系统或应用部署，但应基于同一套底层流程、任务、权限、数据和审计模型。当前仅制作 Management Console 的概念原型，Employee App 和后端系统属于后续阶段。

管理台的核心价值不是单纯绘制流程，而是：

```text
设计流程
→
发布流程
→
分配工作
→
查看执行进度
→
处理异常并了解结果
```

产品目标不是：

- 传统 BPMN 编辑器
- 单纯的流程图工具
- monday / Airtable 风格的简单 Automation Builder
- 只依附于某个 Table 的自动化系统

目标是建立一个：

> **对运营人员和经理足够容易使用，同时又能够承载跨行业业务流程的 Visual Business Workflow Management Platform。**

当前管理台是该平台的第一阶段产品表现形式。员工执行端不是当前原型范围，但会影响未来的任务、表单、执行记录和权限设计。

整体能力方向：

```text
Flexible Data
+
Visual Workflow
+
Human Task
+
Approval
+
Automation
+
Business Logic
+
AI
```

希望用户能够像使用：

```text
Figma
FigJam
draw.io
Mind Map
Flowchart
```

一样，在无限 Canvas 中直接搭建业务流程。

但 Canvas 上的核心 Workflow Node 不只是图形，而是具有真正的执行语义。

例如：

```text
Trigger
Task
Approval
Form
Condition
Parallel
Wait
Action
AI
Subflow
End
```

Node 被选中后，通过右侧 Inspector 配置：

```text
负责人
审批人
表单
输入
输出
规则
条件
超时
通知
异常处理
权限
重试
```

最终将：

```text
Visual Diagram
```

转换为：

```text
Executable Business Workflow
```

---

# 2. 产品核心定位

推荐产品定位：

```text
draw.io / FigJam
        ↓
   Our Product
        ↓
Appian / BPM Platform
```

不是简单取中间值，而是组合三个方向的优势：

```text
Appian-like execution depth
+
monday-like business language
+
Figma-like editing experience
+
AI-native authoring
```

核心原则：

> **底层执行能力可以逐步接近 BPM 平台，但表层交互不能要求普通企业用户理解 BPMN 或编程语言。**

进一步的产品定义：

> **本产品是面向业务人员的 Visual Workflow Programming / No-Code Process Runtime。用户通过组合具有预定义执行语义的 Workflow Nodes，并使用 Connections 定义执行顺序、分支和数据关系，从而创建可以被 Workflow Engine 直接解释和运行的 Workflow Definition。**

Workflow Editor 因此不是单纯的流程图编辑器。用户在 Canvas 上进行的操作，可以理解为通过可视化业务语言“编写”一个业务程序。

从用户心智看：

```text
画 Workflow
≈
编写业务程序
```

从系统架构看：

```text
Workflow Definition
≈
Visual DSL / Executable Process Definition
```

因此产品不应被简单定义为“简化版 BPMN”。更准确的方向是：

```text
保留 BPM / Workflow Engine 的核心执行模型
+
将复杂的低层流程原语封装成高层 Semantic Nodes
+
使用普通业务语言完成配置
```

也就是：

```text
复杂度封装在 Node 内部
而不是暴露给 Workflow Designer
```

---

# 3. 核心产品原则

## 3.1 Workflow-first，而不是 Diagram-first

Canvas 可以支持自由绘图，但产品核心必须是 Workflow。

因此：

```text
Workflow Node
```

与：

```text
Diagram Shape
```

必须是两个不同概念。

---

## 3.2 业务语言优先

不要直接暴露：

```text
XOR Gateway
Inclusive Gateway
Complex Gateway
Process Variable
Expression
While Loop
```

优先使用：

```text
IF / ELSE
Switch
Parallel
Merge
Workflow Data
Repeat Until
For Each
```

---

## 3.3 Progressive Disclosure

不要一次暴露所有高级配置。

推荐三个工作状态：

```text
Design
Configure
Run
```

### Design

关注：

```text
流程结构
节点
分支
负责人
基础条件
注释
```

### Configure

关注：

```text
Data Mapping
Advanced Rules
Retry
Timeout
Escalation
Permissions
Exception
```

### Run

关注：

```text
实例
状态
执行路径
错误
等待
历史数据
```

这里的 Design / Configure / Run 是 Editor 的工作视图，不等同于后文定义的产品生命周期 Design Time / Run Time。

```text
Design + Configure
主要属于 Design Time

Run View
主要用于 Runtime Monitoring / Mock Runtime Visualization
```

---

## 3.4 Canvas 负责“表达流程”

Canvas 不应该承载全部配置。

Canvas 主要回答：

> **流程是什么？**

更具体地说，Canvas 负责定义：

```text
Program Structure
+
Control Flow
```

---

## 3.5 Inspector 负责“节点如何运行”

右侧 Inspector 主要回答：

> **这个 Node 怎么工作？**

也就是：

```text
Canvas
=
Program Structure

Inspector
=
Program Configuration
```

---

## 3.6 Validation 是一等能力

Workflow Editor 不能只是保存 JSON。

需要明确：

```text
Errors
Warnings
Recommendations
```

并在 Publish 前进行 Validation。

---

## 3.7 AI 不是附加聊天机器人

AI 应该贯穿：

```text
Create
Configure
Modify
Explain
Validate
Optimize
```

同时 AI 也可以作为 Runtime Node 执行任务。

---

# 4. Editor 四层模型

推荐将整个 Workflow Editor 理解为四层。

```text
Layer 1
DIAGRAM
```

自由表达业务关系。

```text
Layer 2
WORKFLOW
```

定义真正执行逻辑。

```text
Layer 3
CONFIGURATION
```

配置每个 Node 如何执行。

```text
Layer 4
EXECUTION VIEW
```

展示 Workflow Instance 的运行状态。

注意：第四层是 Editor / Management Console 对 Runtime 的可视化，不意味着可变 Runtime State 属于 Workflow Definition 本身。

---

# 5. Diagram Layer

Diagram Layer 用于：

```text
说明
分组
辅助理解
组织复杂流程
```

而不是直接执行。

建议包括：

```text
Rectangle
Rounded Rectangle
Circle
Diamond
Text
Note
Arrow
Group
Swimlane
```

这些对象：

- 可以自由修改尺寸
- 可以修改颜色
- 可以作为注释
- 可以组织工作流
- 不参与 Runtime
- 不需要 Validation
- 不拥有 Workflow Behavior

---

# 6. Workflow Layer

Workflow Layer 中的 Node 才是真正拥有执行语义的 Runtime Primitive Definition。

推荐第一版核心 Node：

```text
START / EVENT
Trigger

HUMAN
Task
Approval
Form

LOGIC
Condition
Parallel
Merge
Wait

SYSTEM
Action
AI

STRUCTURE
Subflow

END
End
```

后续高级逻辑：

```text
Switch
For Each
Repeat Until
```

---

# 7. Shape 与 Behavior

## 7.1 不推荐完全自由的 Shape != Behavior

不建议采用：

```text
Rectangle
↓
Behavior = Approval
```

并允许：

```text
Circle = Approval
Diamond = Approval
Rectangle = Approval
```

虽然这种模型自由度高，但会产生严重问题。

### 风险

```text
流程视觉语义丢失
用户无法快速识别节点
Workflow Validation 更复杂
AI 难以解释 Canvas
团队成员之间缺少统一视觉语言
```

---

## 7.2 推荐模型

```text
Diagram Shape
≠
Workflow Node
```

Workflow Node 可以修改：

```text
颜色
尺寸
图标
标题
说明
显示密度
```

但必须保留基本 Semantic Identity。

例如：

```text
Approval
→ Approval-style node

Condition
→ Branch / Decision visual

Trigger
→ Event-style visual
```

---

## 7.3 允许有限 Node Conversion

部分拥有相似执行 primitive 的 Node 可以互相转换。

例如：

```text
Task
↔
Approval
↔
Form Task
```

因为它们都属于：

```text
Human Activity
```

但不建议：

```text
Condition → HTTP Request
Circle → Approval
Rectangle → Parallel
```

---

# 8. Workflow Node Model

一个 Workflow Node 不应该只是：

```text
type + position
```

推荐 Definition Model：

```text
Node Definition
│
├── Identity
├── Semantic Type
├── Capabilities
├── Configuration
├── Data Contract
├── Connections / Ports
├── Appearance
└── Metadata
```

概念结构：

```json
{
  "id": "node_123",
  "type": "approval",
  "name": "Manager Approval",

  "capabilities": [
    "assignment",
    "form",
    "rules",
    "timing",
    "output"
  ],

  "config": {},
  "inputs": [],
  "outputs": [],
  "appearance": {},
  "metadata": {}
}
```

注意：

```text
capabilities
```

非常重要。

Node 不应该通过一个巨大统一 Schema 进行配置。

同时需要明确：

> **可变 Runtime State 不属于 immutable Workflow Version 中的 Node Definition。运行状态属于 Workflow Instance 中对应的 Node Execution / Step Execution。**

例如：

```text
Node Definition
Manager Approval

≠

Node Execution
Manager Approval · Running · Instance #1024
```

---

# 9. Capability Model

推荐将 Node 配置拆成可组合 Capability。

核心 Capability：

```text
Setup
Assignment
Form
Input
Output
Rules
Condition
Timing
Actions
Notification
Retry
Escalation
Exception
Permissions
Appearance
```

不同 Node 组合不同 Capability。

---

## 9.1 Task

```text
Task

Capabilities:
- setup
- assignment
- form
- input
- output
- completion
- timing
- notification
- escalation
- permissions
```

---

## 9.2 Approval

```text
Approval

Capabilities:
- setup
- assignment
- approvalPolicy
- form
- input
- output
- rules
- timing
- escalation
- notification
```

---

## 9.3 Condition

```text
Condition

Capabilities:
- setup
- input
- rules
- branches
```

---

## 9.4 Action

```text
Action

Capabilities:
- setup
- actionType
- connection
- input
- output
- retry
- exception
- timing
```

---

## 9.5 AI

```text
AI

Capabilities:
- setup
- aiTask
- instruction
- input
- outputSchema
- confidence
- retry
- humanFallback
- exception
```

---

# 10. Node Inspector

## 10.1 Inspector 原则

Inspector 应该：

- 固定在右侧
- 不默认使用大型 Modal
- 根据 Node Capability 动态变化
- 采用 Config Blocks
- 默认显示常用配置
- 高级配置折叠
- 支持 AI 修改当前 Node

---

## 10.2 不推荐固定 Tab 表单

不要所有 Node 都显示：

```text
General
Data
Rules
Actions
Advanced
```

因为：

```text
Condition
```

根本不需要 Assignment。

```text
Note
```

也不需要 Retry。

---

## 10.3 推荐 Config Block Architecture

例如 Task：

```text
TASK
Manager Review

────────────────

ASSIGNMENT

Manager
+ Add fallback

────────────────

FORM

Purchase Review
4 fields

+ Configure form

────────────────

INPUT

Purchase Request
← Trigger.Request

+ Add input

────────────────

COMPLETION

Complete when
User submits form

────────────────

TIMING

Due
2 business days

+ Add escalation

────────────────

OUTPUT

Decision
Comment

+ Add output
```

---

## 10.4 Condition Inspector

```text
CONDITION
Amount Check

────────────────

INPUT

Purchase Amount
← Request.Amount

────────────────

BRANCHES

IF
Amount > 5000

→ High Value

ELSE

→ Standard

+ Add branch
```

---

## 10.5 Approval Inspector

```text
APPROVAL
Manager Approval

────────────────

APPROVER

Sales Manager

+ Add approver

────────────────

APPROVAL POLICY

Any one approves

────────────────

DECISIONS

Approve
Reject
Request changes

────────────────

FORM

Approval Form

────────────────

TIMING

Due in
2 business days

────────────────

ON REJECT

Return to requester
```

---

# 11. Approval Model

用户层建议：

```text
Approval = 一级 Workflow Node
```

不要强迫用户自己组合：

```text
Task
+
Decision
+
Condition
```

但是执行引擎内部可以把 Approval 编译为：

```text
Human Task
+
Decision Result
+
Routing Semantics
```

因此采用：

```text
High-level Semantic Node
→
Low-level Execution Primitives
```

这是推荐架构。

---

# 12. Action Node Architecture

## 12.1 不建议每个动作都是新的 Engine Node Type

不要：

```text
Send Email Node
Slack Node
Teams Node
Create Record Node
Update Record Node
HTTP Node
```

因为未来会导致 Node Explosion。

---

## 12.2 推荐统一 Action Node

底层：

```text
Action
```

Inspector：

```text
Action Type
[ Update Record ▼ ]

Target
[ Purchase Request ]

Record
[ Trigger → Record ID ]

Fields
Status → Approved
Approved Date → Current Time
```

---

## 12.3 Toolbox 可以显示 Action Shortcut

虽然底层统一为：

```text
Action
```

但左侧 Library 可以显示：

```text
Create Record
Update Record
Send Message
Send Email
HTTP Request
Generate Document
```

这些实际上是：

```text
Action Node Preset
```

因此：

```text
UI Node Shortcut
≠
Engine Node Type
```

---

# 13. Trigger Model

Workflow 不应该只有一个无语义的 Start Node。

推荐：

```text
Trigger
├── Manual
├── Record Created
├── Record Updated
├── Status Changed
├── Form Submitted
├── Schedule
├── Date Reached
├── Webhook
└── External Event
```

Canvas 可以显示：

```text
START

When purchase request submitted
```

因此：

```text
Start
```

是视觉角色。

```text
Trigger
```

才是执行语义。

---

# 14. Logic Model

必须严格区分：

```text
Node Internal Rule
```

与：

```text
Workflow Control Flow
```

---

# 15. Node Internal Rule

Node Internal Rule 不应该改变 Canvas 主路径。

例如：

```text
Run when
Priority = High
```

```text
Complete when
All reviewers submit
```

```text
Notify when
Due date < 1 day
```

```text
Assign when
Department = Finance
```

这些规则放在 Inspector。

推荐命名：

```text
Run Conditions
Completion Rules
Validation Rules
Assignment Rules
Notification Rules
Skip Conditions
```

---

# 16. Workflow Control Flow

真正改变路径的逻辑必须在 Canvas 上可见。

例如：

```text
Amount > 5000?
        │
    ┌───┴───┐
   YES      NO
    │        │
Finance   Standard
Approval  Process
```

这类逻辑使用 Canvas Node。

Workflow Edge 在这里不是普通绘图连线，而是：

```text
Execution Transition
```

也就是：

> **当前 Node 完成后，Execution Engine 应该沿哪一条路径继续运行。**

---

# 17. IF / ELSE

推荐作为核心 Logic Node。

Inspector：

```text
IF

Field
Purchase Request.Amount

Operator
is greater than

Value
5000
```

支持：

```text
+ Add condition
```

组合方式：

```text
All conditions match
Any condition matches
```

输出：

```text
YES
NO
```

---

# 18. Switch

适合：

```text
Status
Department
Region
Request Type
Risk Level
```

例如：

```text
Department
│
├── Finance
├── HR
├── Operations
└── Other
```

Switch 是：

```text
多分支路由
```

不应该要求用户理解：

```text
Inclusive Gateway
```

---

# 19. Parallel

Parallel 表示：

```text
以下工作同时开始
```

例如：

```text
             ┌→ Legal Review
Submit ──────┼→ Finance Review
             └→ Security Review
```

---

# 20. Merge

Merge 表示：

```text
等待多个路径重新汇聚
```

未来可以支持：

```text
Wait for all
Wait for any
Wait for N of M
```

第一版建议：

```text
Wait for all
```

---

# 21. Loop 产品化

第一版不要使用：

```text
While Loop
Do While
For Loop
```

推荐企业语言：

```text
For Each
Repeat Until
Retry
```

---

## 21.1 For Each

用于对集合中的每个对象执行流程。

例如：

```text
For each supplier
↓
Send RFQ
```

重要配置：

```text
Collection
Concurrency
Failure Policy
Max Items
```

---

## 21.2 Repeat Until

用于：

```text
重复业务过程直到满足某个条件
```

例如：

```text
Request Correction
↓
Repeat until document is valid
```

必须配置：

```text
Maximum iterations
Timeout
Exit condition
Failure behavior
```

---

## 21.3 Retry

Retry 不建议成为 Canvas Node。

Retry 属于：

```text
Action
AI
Integration
```

的 Inspector。

例如：

```text
ERROR HANDLING

Retry
3 times

Interval
5 minutes

After final failure
→ Error branch
```

---

# 22. Wait Node

推荐统一 Wait：

```text
WAIT

Wait for:
○ Duration
○ Date / time
○ Event
○ Condition
```

示例：

```text
Wait 2 days
```

```text
Wait until Due Date
```

```text
Wait until Invoice Paid
```

```text
Wait until Status = Ready
```

---

# 23. Subflow

Workflow 必须支持 Subflow。

用途：

```text
复用流程
降低复杂 Canvas
模块化业务逻辑
团队复用
版本管理
```

例如：

```text
Employee Onboarding
│
├── Create Accounts
├── Assign Hardware
└── Orientation
```

主流程只显示：

```text
Run Employee Onboarding
```

在 Visual Workflow Programming 心智模型中，Subflow 可以理解为：

```text
Reusable Function / Callable Process Module
```

---

# 24. Data Model

不推荐让普通用户直接管理：

```text
Process Variables
pv!amount
```

推荐统一概念：

```text
Workflow Data
```

Workflow Data 在可执行模型中承担：

```text
Variables
+
Process State
+
Node-to-Node Data
```

但 UI 仍应优先使用业务语言，不向普通用户暴露编程术语。

---

# 25. Workflow Context

推荐数据模型：

```text
Workflow Context
│
├── Trigger Data
├── Business Records
├── Workflow Variables
├── Step Outputs
├── User Context
└── Environment
```

---

# 26. Data Flow

标准执行流程：

```text
Trigger
↓
Workflow Context Created
↓
Node Resolves Input Mapping
↓
Node Executes
↓
Node Produces Output
↓
Output Written to Context
↓
Next Node Reads Context
```

---

# 27. Data Picker

普通用户不要输入：

```text
workflow.steps[3].outputs.amount
```

应该通过 Picker：

```text
Previous Steps
└── Purchase Request
    ├── Amount
    ├── Applicant
    └── Department
```

结果显示：

```text
Purchase Request → Amount
```

高级模式以后可以支持：

```text
Expression
Formula
```

Data Mapping 在产品本质上相当于 No-Code 编程中的变量传递，但用户层应保持：

```text
Previous Step Output
→
Current Step Input
```

这样的业务表达。

---

# 28. Form Model

Form 既可以：

```text
独立成为 Form Node
```

也可以：

```text
作为 Task / Approval Capability
```

因此：

```text
Form
```

本身应该是 reusable object。

例如：

```text
Purchase Request Form
Manager Review Form
Incident Form
```

Task Inspector 引用 Form。

同时必须区分：

```text
Design Time
定义 Form Schema / Fields / Rules

Run Time
员工或审批人在 Task Instance 中真正填写和提交 Form
```

---

# 29. Editor Information Architecture

## 29.1 管理台与员工端的产品边界

当前产品设计只实现管理台概念原型，但信息架构需要预留未来员工端的边界。

```text
Management Console
│
├── Dashboard
├── Workflows
├── Workflow Editor
├── Workflow Run Monitor
├── Tasks / Progress
├── People & Teams
├── Reports
└── Settings
```

管理台面向运营人员和经理，主要负责：

```text
创建和编辑流程
配置任务、审批、表单和规则
发布流程版本
查看流程实例
查看任务进度和工作内容
处理异常、超时和重新分配
```

未来员工端面向员工，主要负责：

```text
接收待办任务
查看任务说明
填写表单
上传文件或其他信息
提交执行结果
评论、反馈或请求帮助
查看个人历史记录
```

员工端不需要暴露：

```text
Workflow Canvas
Node Type
Capability Schema
流程版本配置
高级执行规则
```

员工端与管理台是两个不同的产品界面，但不是两个互相独立的执行系统。未来两者应共享：

```text
Workflow Definition
Workflow Version
Workflow Instance
Task Instance
Execution Record
Permission Model
Audit Log
```

当前原型只通过管理台和 Mock Data 表现未来运行结果，不实现员工端和真实服务端。

推荐：

```text
Workflow Editor
│
├── Top Bar
├── Left Library
├── Canvas
├── Right Inspector
├── Workflow Health
├── Mock Runtime / Run Monitor
└── AI Assistant
```

---

# 30. Top Bar

建议：

```text
Workflow Name
Draft / Published
Undo
Redo
Run Test
Workflow Health
Version
Publish
More
```

其中：

```text
Run Test
=
Design Time Dry Run / Simulation
```

它不应创建真实生产任务、发送真实通知或修改真实业务数据。

以后：

```text
History
Permissions
Environment
```

---

# 31. Left Library

推荐：

```text
WORKFLOW
────────────────

Start & Events
Trigger

People
Task
Approval
Form

Logic
Condition
Switch
Parallel
Merge
Wait
For Each

Automation
Action
AI

Structure
Subflow
End


DIAGRAM
────────────────

Shapes
Rectangle
Circle
Diamond

Organization
Group
Swimlane

Annotation
Text
Note
```

Workflow Library 必须放在 Diagram Library 上方。

---

# 32. Node Search

Library 顶部必须存在：

```text
Search nodes...
```

用户可以搜索：

```text
email
approval
http
message
record
AI
```

即使：

```text
Send Email
```

不是 Engine Node Type，也可以搜索到 Action Preset。

---

# 33. Canvas 创建方式

推荐同时支持三种模式。

---

## 33.1 Click-to-place

```text
Select Task
↓
Cursor changes
↓
Click Canvas
↓
Place Task
↓
Inspector opens
```

这是非常适合当前产品方向的交互。

---

## 33.2 Drag & Drop

```text
Library
↓
Drag
↓
Canvas
```

适合熟练用户。

---

## 33.3 Edge +

Node 下方：

```text
Task
 │
[+]
```

点击：

```text
Add next step

Task
Approval
Condition
Action
Wait

Search...
```

优点：

```text
降低连接成本
适合新用户
快速连续搭建流程
```

---

# 34. Connection Interaction

React Flow 的 Handle 可以作为基础。

建议：

选中 Node 后显示连接 Handle。

用户可以：

```text
Drag Handle
→
Create Edge
```

或者：

```text
Click +
→
Select next Node
→
Automatically connect
```

Condition Branch 的 Handle 应该带语义：

```text
YES
NO
```

或者：

```text
Finance
Operations
Other
```

Connections 必须分为：

```text
Workflow Connection
=
Executable Transition
```

与：

```text
Diagram Arrow
=
Visual Annotation Only
```

两者不能因为视觉上都是线而混为同一对象。

---

# 35. Canvas Node Content

Canvas 不显示全部配置。

例如：

```text
┌────────────────────────┐
│ ✓ Manager Approval     │
│                        │
│ 👤 Sales Manager       │
│ ⏱ 2 days              │
│                        │
│ 2 rules      1 output  │
└────────────────────────┘
```

原则：

```text
Canvas = Summary
Inspector = Full Configuration
```

进一步可理解为：

```text
Canvas Node Card
=
Executable Component Summary
```

而不是员工真正执行任务时看到的 Task UI。

---

# 36. Node Status

Design Mode：

```text
Configured
Needs setup
Warning
Error
```

Run Mode：

```text
Not started
Running
Waiting
Completed
Failed
Skipped
Cancelled
```

两类状态必须分别属于：

```text
Node Definition Design State
```

和：

```text
Node Execution Runtime State
```

不能共享同一个可变字段。

---

# 37. Workflow Validation

推荐建立：

```text
Workflow Health
```

顶部显示：

```text
3 Errors
2 Warnings
1 Recommendation
```

---

## 37.1 Error

例如：

```text
Missing assignee
Missing branch
Missing required input
Invalid connection
Invalid loop
Missing trigger
```

无法 Publish。

---

## 37.2 Warning

例如：

```text
Task has no due date
Branch has no default path
Approval has no escalation
Action has no retry policy
```

允许 Publish。

---

## 37.3 Recommendation

例如：

```text
Consider using a Subflow
This process has 40+ nodes
Consider adding error handling
```

---

# 38. Execution Layer

未来真实运行时应该可以 Overlay 到 Canvas。

当前管理台概念原型不实现真实 Execution Engine，而是使用 Mock Runtime State 展示管理者在流程运行期间需要看到的信息。原型重点验证：

```text
流程实例当前走到哪里
哪些任务已完成
哪些任务正在等待
哪些任务发生异常
谁负责当前工作
流程整体进度如何
```

管理台可以提供两种查看方式：

```text
Workflow Canvas Overlay
查看流程结构上的运行状态

Workflow Run Monitor
查看某一次流程实例的任务、人员、时间和记录
```

例如：

```text
✓ Trigger
↓
✓ Manager Review
↓
✓ Amount Check
↓
● Finance Approval
   Waiting
```

用户点击运行中的 Node，可以查看：

```text
Started
Assignee
Input
Output
Duration
Logs
Errors
```

这里显示的是 Workflow Instance 中的 Node Execution，不是修改 Workflow Version 中的 Node Definition。

---

# 39. Workflow Instance

建议架构区分：

```text
Workflow Definition
```

与：

```text
Workflow Instance
```

Definition：

```text
设计
配置
版本
Publish
```

Instance：

```text
运行
等待
失败
完成
历史
```

在 Definition 与 Instance 之间，还需要明确区分具体的工作任务和执行记录：

```text
Workflow Definition
流程的逻辑容器与设计对象

Workflow Draft
当前可变的设计状态

Workflow Version
已发布的不可变执行快照

Workflow Instance
某一次实际启动的流程

Node Execution / Step Execution
该次流程中某一个 Node 的实际执行状态

Task Instance
该次流程中分配给某个人或团队的具体人工任务

Execution Record
任务执行过程中产生的表单、附件、评论、输入、输出、时间和操作记录
```

标准关系：

```text
Workflow Definition
        ↓ Edit
Workflow Draft
        ↓ Publish
Workflow Version
        ↓ Start
Workflow Instance
        ↓ Execute Nodes
Node Executions
        ↓ Human Node Generates
Task Instances
        ↓ Execute
Execution Records
```

Workflow Instance 必须绑定：

```text
workflowVersionId
```

而不能只绑定：

```text
workflowId
```

这样才能保证后续发布新版本不会改变已经运行中的实例。

当前原型只需要通过 Mock Data 模拟 Workflow Instance、Task Instance 和 Execution Record 的展示，不要求这些对象已经由真实后端创建。

---

# 40. Workflow 与 Table 的关系

Workflow 应该独立于 Table。

推荐：

```text
Workspace
│
├── Tables
├── Forms
├── Workflows
├── Files
├── Dashboards
└── Integrations
```

Workflow 可以同时使用：

```text
Table A
Table B
Form
API
User
External System
```

不要采用：

```text
一个 Table
=
一个 Workflow
```

这种强耦合模型。

---

# 41. Automation 与 Workflow

长期建议提供两层入口。

简单：

```text
Automation

When X
→
Do Y
```

复杂：

```text
Workflow

Trigger
↓
Task
↓
Condition
↓
Multiple Branches
↓
Actions
```

底层可以共用同一 Runtime。

即：

```text
Automation
=
Simplified Workflow Authoring
```

---

# 42. AI Architecture

必须区分：

```text
Editor AI Assistant
```

和：

```text
Runtime AI Node
```

这是两个完全不同的产品。

---

# 43. Editor AI Assistant

AI Assistant 应该支持：

```text
Generate
Configure
Modify
Explain
Validate
Optimize
```

---

## 43.1 AI Generate Workflow

输入：

```text
采购金额低于5000由经理审批，
超过5000还要财务审批，
审批完成以后通知采购人员。
```

AI 输出：

```text
Request Submitted
       ↓
Manager Approval
       ↓
Amount > 5000?
     /       \
   YES       NO
    ↓         │
Finance       │
Approval      │
     \       /
       ↓
Notify Purchasing
       ↓
End
```

但 AI 不应该偷偷假设未知配置。

例如：

```text
Finance Approval
⚠ Approver not configured
```

---

## 43.2 AI Configure Node

选中 Approval：

用户输入：

```text
超过5000由财务经理审批。
```

AI 修改当前 Node Config。

应该显示：

```text
Proposed changes
```

而不是完全静默修改。

---

## 43.3 AI Modify Workflow

例如：

```text
在财务审批失败以后增加一个通知申请人的步骤。
```

AI 修改 Graph。

---

## 43.4 AI Explain Workflow

用户：

```text
什么情况下会进入财务审批？
```

AI 根据 Workflow Graph、Condition 和 Data Mapping 回答。

---

## 43.5 AI Validate Workflow

AI 检查：

```text
Dead end
Missing assignee
Missing branch
Missing input
Unreachable node
Unsafe loop
Conflicting rules
Missing exception handling
```

---

## 43.6 AI Optimize Workflow

未来可以结合 Runtime Analytics。

例如：

```text
过去90%的金额低于1000的申请都直接审批，
是否考虑自动批准？
```

或者：

```text
这个审批平均等待2.6天，
建议增加24小时提醒。
```

---

# 44. Runtime AI Node

AI Node 是真正执行 Workflow 的 Node。

推荐能力：

```text
Extract
Classify
Summarize
Generate
Analyze
Route
Transform
Agent
```

---

# 45. AI Node Inspector

例如：

```text
AI TASK

Task
[ Extract information ▼ ]

Instruction
Extract invoice information

Input
[ Uploaded Document ]

Expected Output

Invoice Number
Text

Amount
Number

Supplier
Text

Confidence Threshold
80%

If confidence below
→ Manual Review

Retry
2 times
```

---

# 46. AI Output Schema

企业 Workflow 中 AI 输出必须尽量结构化。

不要只返回：

```text
Text
```

推荐：

```text
Output Schema
```

例如：

```json
{
  "category": "string",
  "riskLevel": "string",
  "confidence": "number",
  "summary": "string"
}
```

这样后面的 Condition 才能直接使用：

```text
AI.riskLevel = High
```

---

# 47. Error Handling

每个可失败的 Node 应该拥有统一 Error Policy。

例如：

```text
ERROR HANDLING

Retry
3

Interval
5 minutes

Timeout
30 seconds

After failure
○ Fail workflow
○ Continue
○ Route to error branch
```

---

# 48. Exception Path

以后 Node 可以拥有：

```text
Success
Error
Timeout
```

不同 Handle。

但第一版不要所有 Node 默认显示。

只有配置 Error Branch 后才显示。

---

# 49. Permissions

未来 Node 可以拥有：

```text
Who can view
Who can edit
Who can execute
Who can reassign
```

第一版可以只做 Workflow-level permission。

Node-level permission 放后续。

---

# 50. Versioning

Workflow 需要：

```text
Workflow Draft
Published Workflow Version
```

用户编辑 Draft 不应该影响正在运行的 Instance。

以后支持：

```text
v1
v2
v3
```

运行中的实例绑定启动时版本。

推荐生命周期：

```text
Published v3
    ↓ Edit
Draft based on v3
    ↓ Modify / Validate / Test
Publish
    ↓
Published v4
```

其中：

```text
v3
```

仍然保留，用于解释和继续运行所有已经绑定 v3 的旧 Workflow Instances。

---

# 51. MVP Node Taxonomy

建议第一版约 12–15 个核心执行 Node。

这些 Node 是未来 Workflow Engine 的通用语义原语，同时也是当前管理台原型中用于展示流程设计能力的主要节点。当前原型不要求这些节点已经具备真实执行能力。

| Category | Node | Purpose | MVP |
|---|---|---|---|
| Event | Trigger | 启动流程 | P0 |
| Human | Task | 人工任务 | P0 |
| Human | Approval | 审批 | P0 |
| Human | Form | 收集数据 | P0 |
| Logic | Condition | IF / ELSE | P0 |
| Logic | Switch | 多分支 | P1 |
| Logic | Parallel | 并行 | P0 |
| Logic | Merge | 汇聚 | P0 |
| Logic | Wait | 等待 | P0 |
| Automation | Action | 系统操作 | P0 |
| AI | AI | AI Runtime | P1 |
| Structure | Subflow | 子流程 | P1 |
| Loop | For Each | 遍历 | P1 |
| Loop | Repeat Until | 条件重复 | P2 |
| End | End | 结束流程 | P0 |

---

# 52. MVP Priority

本节区分当前管理台概念原型与未来完整产品的优先级。

## 当前概念原型 P0

当前原型必须优先验证管理台的核心体验：

```text
Management Console Shell
Dashboard
Workflow List
Workflow Editor
Workflow Node Library
Infinite Canvas
Node placement
Click-to-place
Drag & drop
Connections
Edge +
Selection
Right Inspector
Undo / redo
Workflow Health
Mock Workflow Run Monitor
Mock Task / Progress View
```

当前原型中的运行状态、任务进度、人员和执行记录均可使用 Mock Data。原型不包含真实保存、真实执行、真实登录或真实员工端。

当前原型中的通用数据展示可以包括：

```text
Workflow Definition
Workflow Version
Workflow Instance
Task Instance
Execution Record
Person / Team
Status / Progress
```

## 未来完整产品 P0

必须先做：

```text
Infinite Canvas
Node placement
Click-to-place
Drag & drop
Connections
Edge +
Selection
Right Inspector
Undo / redo
```

Node：

```text
Trigger
Task
Approval
Form
Condition
Parallel
Merge
Wait
Action
End
```

Config Blocks：

```text
Setup
Assignment
Form
Input
Rules
Timing
Action
Output
```

Data：

```text
Workflow Context
Previous Node Output
Table Record
```

Validation：

```text
Missing configuration
Unconnected node
Missing branch
Missing input
Dead end
```

---

## 未来完整产品 P1

```text
Switch
Subflow
For Each
AI Node
AI Generate Workflow
AI Configure Node
Error Branch
Retry
Escalation
Debug Run
Execution Timeline
Versioning
Swimlane
Integration Catalog
```

---

## 未来完整产品 P2

```text
Repeat Until
Advanced Expressions
Complex Join Rules
Reusable Node Templates
Custom Node Types
Simulation
Process Analytics
SLA Analytics
AI Optimization
Process Mining
Advanced Permissions
```

---

# 53. 不建议第一版开发的功能

以下内容不属于当前管理台概念原型的实现范围，也不属于未来完整产品的早期核心范围：

暂时不要：

```text
Complex Gateway
While Loop
Custom BPMN notation
100+ Node Types
Full Expression Language
Node-level RBAC
Process Mining
Simulation Engine
Custom Code Node
```

这些会显著增加：

```text
学习成本
Runtime complexity
Validation complexity
Debug complexity
UI density
```

---

# 54. Node Toolbar 与 Node Library

## 54.1 产品定义

Node Toolbar 是专门用于添加 Workflow Node 的一级入口，不是通用 Canvas 编辑工具栏，也不是直接罗列所有具体节点的完整节点库。

它主要回答：

> **用户现在想添加哪一类流程职责？**

Node Library 是选择具体节点能力的二级界面，主要回答：

> **这个节点具体要做什么事情？**

两者共同形成以下添加流程：

```text
选择 Node Type
→
在 Node Library 选择具体能力
→
节点预览跟随鼠标
→
点击 Canvas 放置节点
→
节点被选中并打开右侧 Inspector
```

这一模型将稳定的流程语义与持续扩展的业务能力分开：

```text
Node Toolbar
=
稳定、少量、按流程职责分类的 Semantic Type

Node Library
=
可搜索、可扩展、按具体行为组织的 Node Definition / Preset
```

---

## 54.2 Node Toolbar 一级类型

第一阶段建议包含：

```text
Trigger
Human Task
Approval
Action
Logic
Wait
End
```

每个一级类型表示节点在流程中的职责，而不是某个具体动作：

| Node Type | 用户心智 | Node Library 示例 |
| --- | --- | --- |
| Trigger | 流程何时开始 | Manual trigger、Schedule、Form submitted、Webhook received |
| Human Task | 需要人完成什么工作 | Complete task、Fill form、Upload documents |
| Approval | 谁需要作出审批决定 | Single approver、Any approver、All approvers |
| Action | 系统自动执行什么操作 | Send email、Update record、Create task、HTTP request |
| Logic | 流程如何判断或分流 | If / Else、Multi-branch、Parallel、Merge |
| Wait | 流程需要等待什么 | Wait for duration、Wait until date、Wait for event |
| End | 流程以什么结果结束 | Success、Rejected、Cancelled、Failed |

一级类型需要保持数量有限和语义稳定。新增第三方应用、集成动作或业务模板时，原则上应扩展 Node Library，而不是不断增加 Toolbar 图标。

---

## 54.3 Node Library 的作用

用户点击 Node Toolbar 中的类型后，在其旁边展开对应的 Node Library 面板。面板建议包含：

```text
当前 Node Type 名称
Search
Recommended / Recent（后续能力）
具体节点列表
节点来源和可用状态
```

每个具体节点条目第一阶段显示：

```text
Icon
Name
One-line description
Source / Provider
Availability status（仅在需要时）
```

例如：

```text
Send email
Send a customized email to selected recipients
Email · Connection required
```

Node Library 只负责选择节点要执行的能力，不在这个阶段要求用户填写负责人、审批规则、条件表达式、邮件内容或数据映射。具体配置统一在节点放置后的右侧 Inspector 完成。

---

## 54.4 添加交互与状态规则

添加节点需要具有明确、可撤销的状态：

```text
Idle
→ Select Node Type
→ Node Library Open
→ Select Concrete Node
→ Node Attached to Cursor
→ Place on Canvas
→ Node Created and Selected
```

交互规则：

- 点击 Toolbar 类型后打开对应 Library；点击其他类型时直接切换 Library 内容。
- 点击具体节点后关闭 Library，并进入当前已有的鼠标跟随放置状态。
- 点击 Canvas 后创建一个节点，默认退出放置模式，并打开该节点的 Inspector。
- 按 `Esc` 逐级退出当前状态：优先取消鼠标携带，其次关闭 Node Library。
- 再次点击当前激活的 Toolbar 类型，可以关闭 Node Library。
- 点击 Library 外部时可以关闭 Library，但不得删除或修改 Canvas 上已有内容。
- 第一阶段不默认连续添加同类节点，避免误操作；连续添加可作为后续显式模式。
- 需要账号连接或高级配置的节点允许先放置，再通过 Inspector 完成配置。
- 未完成配置的节点可以保留在 Draft 中，但应显示配置状态，并在 Publish Validation 中提示。

---

## 54.5 与 Canvas Tools 的边界

以下功能不属于 Node Toolbar：

```text
Select
Hand / Pan
Connect
Delete
Undo / Redo
Text / Note
Zoom / Fit View
```

它们属于 Canvas Tools 或 Diagram Tools，用于操作画布和已有对象。

因此编辑器左侧需要建立清晰的产品边界：

```text
Node Toolbar
→ 添加什么 Workflow Node

Canvas Tools
→ 如何操作 Canvas 和已有对象

Diagram Tools
→ 添加不参与 Runtime 的说明与组织元素
```

Node Toolbar 不应同时承担选择、移动、连线、删除和缩放等职责。

---

## 54.6 Node Type、Library Item 与 Engine Type

界面中的具体节点条目不一定等于新的底层 Engine Node Type。

例如：

```text
Send Email
Update Record
HTTP Request
```

在 Node Library 中是不同的具体能力，但底层可以统一为：

```text
Engine Type = Action
Preset = sendEmail / updateRecord / httpRequest
```

同样：

```text
Single Approver
Any Approver
All Approvers
```

可以统一使用：

```text
Engine Type = Approval
Approval Policy = single / any / all
```

因此：

```text
Toolbar Node Type、Library Item 与 Engine Node Type 是三个不同层级
Library Item 与 Engine Node Type 不要求一一对应
```

这个边界用于避免 Node Explosion，同时允许产品持续增加具体业务能力。

---

## 54.7 第一阶段范围

概念原型优先验证：

```text
Toolbar 类型切换
Node Library 展开与关闭
Library 搜索
具体节点选择
鼠标跟随预览
点击 Canvas 放置
放置后自动选中
Inspector 自动打开
Esc 取消
节点配置状态提示
```

第一阶段暂不实现：

```text
完整 Integration Marketplace
用户自定义 Node Type
组织级节点发布
Library 权限管理
复杂 Favorites 管理
拖拽重排 Toolbar 类型
连续批量放置模式
```

---

# 55. Node Visual Design

建议 Node 使用 Card-like Semantic Shape。

不要过度追求传统流程图图形。

Node Visual 可以参考 UML Class / Object Diagram 的 Compartment 思路，但不复制传统 UML 外观：

```text
Identity
────────────
Key Configuration Summary
────────────
Output / Branch / Status Summary
```

结合 Mind Map 的轻量连接和快速扩展方式，使 Canvas 在大量 Node 下仍然保持可扫描性。

例如：

```text
┌────────────────────────────┐
│ ✓ APPROVAL        Manager  │
│ Manager Approval           │
├────────────────────────────┤
│ Form · Purchase Review     │
│ Due · 2 days               │
├────────────────────────────┤
│ Approve        Reject      │
└────────────────────────────┘
```

Node Name 应高于 Semantic Type 成为第一视觉层级。

推荐视觉层级：

```text
Node Name
>
Semantic Type / Identity
>
Key Configuration Metadata
```

Condition 可以突出 Branch，但不强制使用传统大菱形：

```text
┌────────────────────────────┐
│ ◇ CONDITION                │
│ Amount Check               │
├────────────────────────────┤
│ Amount > 5000              │
├──────────────┬─────────────┤
│ YES          │ NO          │
└──────────────┴─────────────┘
```

核心原则：

```text
统一 Card Shell
+
不同 Semantic Identity
+
Capability-driven Compartments
```

---

# 56. Node Density

推荐三种显示密度作为未来能力：

```text
Compact
Default / Standard
Expanded / Detail
```

Compact：

```text
[ Approval ] Manager Review
```

主要用于快速理解流程结构，接近 Mind Map 浏览体验。

Default / Standard：

显示：

```text
Node Name
Semantic Identity
Owner / Assignment Summary
1–2 个关键配置
```

Expanded / Detail：

显示更多：

```text
Rules
Inputs
Outputs
Timing
Form Summary
Branches
```

但即使 Expanded，也不应该复制完整 Inspector。

---

# 57. Group 与 Swimlane

Group：

```text
纯视觉组织
```

Swimlane：

未来可以拥有更强业务语义，例如：

```text
Department
Role
System
Phase
```

第一版建议先做视觉 Swimlane。

以后再支持：

```text
Lane default assignee
Lane permissions
Lane analytics
```

当 Lane 已经表达 Owner Context 时，Node 可以减少重复显示负责人，从而降低复杂跨部门流程的视觉密度。

---

# 58. Node Internal State

Node Definition 的 Design State：

```text
Draft
Configured
Warning
Error
```

Node Execution 的 Runtime State：

```text
Pending
Running
Waiting
Completed
Failed
Skipped
Cancelled
```

两个 State 不应该混在一起。

推荐对象关系：

```text
Workflow Version
└── Node Definition

Workflow Instance
└── Node Execution
    └── Runtime State
```

---

# 59. Publish Model

Publish 不是普通 Save，也不是把页面“公开”。

Publish 的产品语义是：

> **将当前可变的 Workflow Draft 经过 Validation 后冻结为一个可被 Execution Engine 使用的不可变 Workflow Version。**

推荐流程：

```text
Edit Draft
↓
Save
↓
Validate
↓
Resolve Errors
↓
Test Run / Dry Run
↓
Publish
↓
Immutable Published Version
```

其中：

```text
Save
=
保存当前设计内容
```

```text
Publish
=
创建可以用于生产运行的 Workflow Version
```

因此：

```text
Save
≠
Publish
```

用户再次修改 Published Workflow 时，不直接修改已经发布的版本，而是：

```text
Published v3
↓ Edit
Draft based on v3
↓ Modify
Publish
↓
Published v4
```

已经使用 v3 启动的 Workflow Instances：

```text
继续绑定 v3
```

新启动的 Workflow Instances：

```text
使用当前 Active Published Version（例如 v4）
```

Publish 前 Validation：

```text
Errors
→ Block Publish

Warnings
→ Allow Publish with notice

Recommendations
→ Optional improvement
```

Published Version 必须保留用于：

```text
Runtime consistency
Audit
Historical explanation
Incident investigation
Version comparison
```

---

# 60. Workflow Health

Workflow Health 不只是 Validation。

长期建议包括：

```text
Correctness
Complexity
Maintainability
Execution Risk
Performance
```

例如：

```text
3 Errors
2 Warnings
1 Recommendation
```

未来 AI 可以解释：

```text
Why this is a problem
```

以及：

```text
Fix with AI
```

---

# 61. 复杂流程管理

当 Workflow 超过一定规模：

```text
30+
50+
100+ Nodes
```

必须提供：

```text
Group
Subflow
Minimap
Search
Focus Mode
Breadcrumb
Collapse Group
Jump to Node
Outline
```

否则无限 Canvas 本身不能解决复杂度。

---

# 62. 推荐最终产品模型

最终产品模型：

```text
Node Definition Model
=
Semantic Type
+
Capabilities
+
Configuration
+
Data Contract
+
Connections
+
Appearance
```

---

```text
Node Execution Model
=
Node Definition Reference
+
Runtime State
+
Resolved Input
+
Output
+
Timing
+
Error / Logs
```

---

```text
Shape Model
=
Diagram Element
OR
Workflow Node Appearance
```

---

```text
Behavior Model
=
Determined primarily by Node Type
```

而不是：

```text
Any Shape
+
Any Behavior
```

---

```text
Inspector Model
=
Capability-driven Config Blocks
```

---

```text
Logic Model
=
Node Internal Rules
+
Visible Workflow Control Flow
```

---

```text
Data Model
=
Workflow Context
+
Visual Data Mapping
```

---

```text
Action Model
=
Unified Action Node
+
Action Catalog / Presets
```

---

```text
AI Model
=
Editor AI Assistant
+
Runtime AI Node
```

---

# 63. 推荐的 Editor 心智模型

整个产品应该让用户自然理解：

```text
左边
创建什么
```

```text
中间
流程应该怎么走
```

```text
右边
这个节点怎么工作
```

```text
顶部
当前 Draft / Version / Publish 状态是什么
```

```text
Workflow Health
哪里有问题
```

```text
AI
帮我创建、修改、检查和解释
```

---

# 64. 最重要的设计判断

如果重新设计这个 Workflow Editor，推荐遵循以下答案：

> **不要做一个“可以执行的 draw.io”。**

因为自由图形并不能天然形成可靠的 Workflow Semantic Model。

同时：

> **不要做一个“更复杂的 monday Automation Builder”。**

因为最终企业流程需要 Human Task、Approval、Subflow、Data Flow、Error Handling、Runtime Monitoring 等更深能力。

推荐构建：

> **一个面向业务人员的 Visual Workflow Programming / No-Code Process Runtime：以业务语义 Node 为核心、以无限 Canvas 为可视化编程表面、以 Capability-based Config Blocks 为配置层、以 Workflow Context 为数据层、以 Published Workflow Version 为可执行定义、以 Runtime Engine 为执行层，并由 AI 贯穿创建—配置—验证—运行全过程。**

---

# 65. 下一阶段最应该冻结的模型

在继续大量开发 Toolbox 或增加 Node 前，应优先正式定义以下模型。

## 1. Workflow Lifecycle Model

回答：

```text
Workflow 从设计到运行到底经历哪些对象和状态？
```

需要确定：

```text
Workflow Definition
Workflow Draft
Workflow Version
Workflow Instance
Node Execution
Task Instance
Execution Record
```

以及：

```text
Save
Validate
Test
Publish
Start
Run
Complete
Archive
```

之间的关系。

---

## 2. Node Schema

回答：

```text
一个 Node Definition 到底由什么组成？
```

需要确定：

```text
ID
Type
Version
Position
Capabilities
Config
Inputs
Outputs
Ports
Appearance
Metadata
```

Runtime State 不属于 immutable Node Definition。

---

## 3. Capability Schema

回答：

```text
哪些 Node 可以拥有哪些能力？
```

例如：

```text
Assignment
Form
Rules
Timing
Retry
Exception
Output
```

以及 Capability 之间是否允许组合。

---

## 4. Inspector Config Block Schema

回答：

```text
每一种 Capability 在 UI 中如何表现？
```

包括：

```text
Add
Remove
Edit
Collapse
Reorder
Validation
AI Modify
```

---

## 5. Execution Object Model

回答：

```text
一个 Workflow Version 在 Runtime 中如何变成实际工作？
```

需要确定：

```text
Workflow Instance
Node Execution
Task Instance
Resolved Assignee
Workflow Context
Execution Record
Runtime Event
```

---

# 66. 推荐下一阶段设计顺序

建议按以下顺序推进：

```text
Stage 0
Workflow Lifecycle / Design Time / Run Time Model
```

↓

```text
Stage A
Node Definition Schema
```

↓

```text
Stage B
Capability Schema
```

↓

```text
Stage C
Inspector Block Schema
```

↓

```text
Stage D
Workflow Graph / Control Flow Schema
```

↓

```text
Stage E
Workflow Context / Data Mapping
```

↓

```text
Stage F
Publish / Version Model
```

↓

```text
Stage G
Runtime / Execution Object & State Model
```

↓

```text
Stage H
AI Edit Protocol
```

完成这些后再继续大规模扩充：

```text
Toolbox
Node Visuals
Advanced Logic
AI Workflow Generation
```

会稳定得多。

---

# 67. 当前设计基线总结

当前管理台概念原型的推荐架构：

```text
Management Console
│
├── Dashboard
├── Workflow List
├── Workflow Editor
│   ├── Top Bar
│   ├── Workflow Node Library
│   ├── Diagram Library
│   ├── Infinite React Flow Canvas
│   ├── Semantic Workflow Nodes
│   ├── Capability-driven Inspector
│   └── Workflow Health
│
├── Workflow Run Monitor
├── Task / Progress View
└── Mock Runtime Data
```

未来完整产品的推荐架构：

```text
Workflow Management Platform
│
├── Management Console
│   ├── Dashboard
│   ├── Workflow Editor
│   ├── Workflow Health
│   ├── Run Monitor
│   └── Reports
│
├── Workflow Engine
│   ├── Workflow Definition
│   ├── Workflow Draft
│   ├── Workflow Version
│   ├── Workflow Instance
│   ├── Node Execution
│   ├── Task Instance
│   └── Execution Record
│
├── Employee App
│   ├── My Tasks
│   ├── Task Execution
│   ├── Forms
│   └── History
│
└── Shared Data / Permission / Audit Model
```

核心思想：

```text
自由画布
≠
自由语义
```

```text
Node 数量少
+
Capability 组合丰富
```

```text
简单业务语言
+
复杂执行引擎
```

```text
视觉配置
+
结构化数据
```

```text
Human Workflow
+
Automation
+
AI
```

```text
Management Console
+
Employee Execution App
+
Shared Workflow Engine
```

产品的跨行业能力不通过预置某个行业流程实现，而通过通用的：

```text
Workflow Node
+
Capability
+
Form Field
+
Data Mapping
+
Assignment Rule
+
Rule
+
Execution Record
```

来支持不同组织自行配置流程。

当前阶段的明确边界是：

```text
只验证 Management Console 的信息架构与交互概念
不实现 Employee App
不实现 Backend
不实现真实 Execution Engine
不绑定具体行业和具体业务流程
```

这应该作为后续 Workflow Editor 产品设计和工程实现的统一基础。

---

# 68. Visual Workflow Programming / No-Code Process Runtime 详细模型

## 68.1 Workflow 是可执行定义，不是流程图

Workflow Editor 的核心产物不是 Canvas Screenshot，也不是 Diagram JSON，而是：

```text
Executable Workflow Definition
```

用户通过：

```text
Node
+
Configuration
+
Connection
+
Workflow Data
```

共同定义一个可以执行的业务程序。

推荐统一映射：

```text
Workflow Node
=
Predefined Execution Primitive / Instruction

Workflow Edge
=
Execution Transition / Control Flow

Workflow Data
=
Variables / Process State / Shared Context

Data Mapping
=
Input / Output Binding

Form
=
Human Input Interface Definition

Condition
=
Control Logic

Subflow
=
Reusable Function / Process Module

Workflow Definition
=
Visual Program Definition

Workflow Instance
=
Running Program Instance
```

这套映射只用于内部产品与架构理解，不要求直接把 Programming Terminology 暴露给普通用户。

---

## 68.2 Node 是预设执行逻辑的封装

例如 Task Node 的内部语义可以理解为：

```text
Enter Task Node
↓
Resolve Assignee Rule
↓
Create Human Task Instance
↓
Wait for Completion
↓
Receive Form / Result
↓
Write Output to Workflow Context
↓
Complete Node Execution
↓
Follow Outgoing Transition
```

用户不需要自己组合这些低层步骤，只需要配置：

```text
Task Name
Assignee Rule
Form
Input
Completion Rule
Timing
Output
```

Approval Node 同理：

```text
Enter Approval
↓
Resolve Approver
↓
Create Approval Task
↓
Wait
↓
Receive Decision
↓
Produce Approval Result
↓
Follow corresponding branch
```

这就是 No-Code 的核心：

```text
High-level Semantic Node
封装
Low-level Execution Logic
```

---

## 68.3 与 BPMN 的关系

产品不需要要求用户理解完整 BPMN notation。

推荐产品方向：

```text
BPM / Workflow execution depth
+
High-level business semantic nodes
+
Simplified visual authoring
```

例如传统 BPM 模型可能通过多个低层 primitive 表达：

```text
Human Task
+
Decision
+
Timer
+
Routing
```

产品层可以封装成：

```text
Approval

Approver
Due
Escalation
Decisions
On reject
```

因此：

> **产品不是通过减少执行能力来“简化 BPMN”，而是通过高层 Node 把复杂执行能力封装起来。**

---

# 69. Design Time / Run Time 产品生命周期

整个产品生命周期必须分成两个明确世界：

```text
DESIGN TIME
定义系统以后应该怎么运行

        ↓ Publish

RUN TIME
系统按照已发布定义真正运行
```

## 69.1 Design Time

Design Time 回答：

> **What should happen?**

也就是：

```text
谁
在什么条件下
需要做什么
使用什么数据
产生什么结果
完成后去哪里
```

Design Time 不直接产生真实业务操作。

例如配置：

```text
Task
Assignee = Irrigation Manager
```

此时只是创建：

```text
Assignment Rule
```

并没有给某个真实员工创建 Task Instance。

---

## 69.2 Run Time

Run Time 回答：

> **What is happening now?**

当一个 Workflow Instance 启动以后，Execution Engine 才会：

```text
读取 Workflow Version
↓
创建 Workflow Context
↓
执行当前 Node
↓
解析实际负责人
↓
创建 Task / Approval / Action
↓
等待或执行
↓
记录结果
↓
沿 Edge 进入下一 Node
```

---

## 69.3 Publish 是两个世界之间的边界

```text
Design Time

Workflow Draft
↓
Validate
↓
Test
↓
Publish

────────────────────────

Run Time

Published Workflow Version
↓
Start
↓
Workflow Instance
↓
Execution Engine
```

这应该成为系统最重要的生命周期边界之一。

---

# 70. Design Time 详细产品模型

Design Time 的核心目标是：

> **创建、配置、验证并发布一个 Executable Workflow Definition。**

推荐拆成以下能力。

## 70.1 Workflow Structure Authoring

通过 Canvas 定义：

```text
Nodes
Connections
Branches
Parallel Paths
Merge
Loops
Subflows
```

产物是：

```text
Execution Graph / Control Flow Graph
```

---

## 70.2 Node Selection

通过 Node Toolbar / Node Library 选择预设的 Execution Primitive。

Node Library 的作用不是提供“图形”，而是提供：

```text
Executable Capability Presets
```

---

## 70.3 Node Configuration

通过 Inspector 配置 Node Behavior：

```text
Assignment
Form
Input
Output
Rules
Timing
Notification
Retry
Escalation
Exception
Permissions
```

---

## 70.4 Workflow Data Definition

Design Time 需要允许定义和引用：

```text
Trigger Data
Business Records
Workflow Variables
Previous Step Outputs
User Context
Environment
```

从而形成真正可执行的数据流，而不只是 A → B → C 的流程结构。

---

## 70.5 Data Mapping

需要明确：

```text
Previous Node Output
        ↓
Current Node Input
```

例如：

```text
Approval.Request
←
Task.Output
```

普通用户通过 Data Picker 完成，不要求写代码。

---

## 70.6 Form Definition

Design Time 配置：

```text
Fields
Validation
Default Values
Visibility Rules
Attachments
Required Fields
```

Run Time 才真正产生：

```text
Form Submission
```

---

## 70.7 Assignment Definition

Design Time 保存的是：

```text
Assignment Rule
```

例如：

```text
Role = Irrigation Manager
```

而 Run Time 才解析成：

```text
Actual Assignee = Zhang San
```

因此：

```text
Design-time Assignee Rule
≠
Runtime Actual Assignee
```

---

## 70.8 Validation

Publish 前必须检查：

```text
Graph validity
Required configuration
Branch completeness
Data mapping
Assignment
Forms
Loops
Dead ends
Unreachable nodes
```

---

## 70.9 Test / Dry Run

Test Run 属于 Design Time。

可以模拟：

```text
Input Data
↓
Which branch is selected
↓
Which node would execute next
↓
Expected output / validation
```

但默认不应该：

```text
Create production employee tasks
Send real notifications
Modify production records
Call destructive integrations
```

---

## 70.10 Save / Publish

```text
Save Draft
=
保存当前编辑状态
```

```text
Publish
=
生成不可变的可执行 Workflow Version
```

这两个操作必须保持清晰区别。

---

# 71. Runtime / Work Distribution Model

Workflow 发布并启动后，真正产生员工工作的过程由 Runtime 完成。

例如 Definition：

```text
Prepare Material
↓
Manager Approval
↓
Irrigation Work
↓
Inspection
```

当 Instance 执行到 `Prepare Material`：

```text
Execution Engine
↓
Resolve Assignee
↓
Create Task Instance
↓
Employee App receives task
```

员工完成后：

```text
Employee submits result
↓
Task Instance Completed
↓
Node Execution Completed
↓
Workflow Context Updated
↓
Follow outgoing Edge
↓
Manager Approval starts
```

所以：

> **Workflow Canvas 定义的是“如何产生和推进工作”，Employee App 承载的是“被产生出来的实际工作”。**

---

## 71.1 Employee App

员工主要看到：

```text
My Tasks
Task Instructions
Form
Attachments
Due Date
Comments
Submit / Complete
History
```

员工不需要理解：

```text
Workflow Graph
Node Type
Data Mapping
Capability Schema
Versioning
Execution Engine
```

---

## 71.2 Management Console

管理者主要回答：

```text
当前有哪些 Workflow Instances？
现在执行到哪里？
谁正在负责？
什么已经完成？
什么超时或失败？
是否需要重新分配或人工干预？
```

Management Console 和 Employee App 是同一个 Runtime Model 的不同 View。

```text
Employee App
→ What do I need to do?

Management Console
→ What is happening?
```

---

# 72. Workflow Definition / Version / Instance 关系

推荐固定以下对象层级：

```text
Workflow
│
├── Draft
│
└── Versions
    ├── v1
    │   ├── Instance 001
    │   └── Instance 002
    │
    ├── v2
    │   └── Instance 003
    │
    └── v3 ← Active Published Version
        ├── Instance 004
        └── Instance 005
```

对象定义：

```text
Workflow
业务流程的长期身份和容器

Workflow Draft
当前正在编辑的可变状态

Workflow Version
Publish 后形成的不可变执行定义

Workflow Instance
某一次基于特定 Version 的实际运行

Node Execution
某个 Node Definition 在该 Instance 中的一次执行

Task Instance
Human Node 产生的真实工作项

Execution Record
执行过程中形成的记录与审计证据
```

---

## 72.1 Version Binding

每个 Workflow Instance 必须记录：

```text
workflowId
workflowVersionId
```

例如：

```text
Instance #001
Workflow = Drip Irrigation
Version = v2
```

即使后来已经发布 v5，Instance #001 仍然按照 v2 继续运行和解释。

---

## 72.2 为什么 Published Version 必须 Immutable

如果运行中的 Instance 会随着 Editor 保存自动改变：

```text
正在运行的流程路径可能突然变化
等待中的 Node 可能消失
新增审批可能插入旧流程
审计无法解释历史行为
```

所以：

```text
Editing Draft
不得直接修改
Published Version
```

---

# 73. Node Definition 与 Runtime Object 的严格边界

未来数据模型应避免把 Design Time 与 Runtime 混在同一个 Node Object 中。

推荐：

```text
NodeDefinition
{
  id,
  type,
  config,
  inputs,
  outputs,
  capabilities,
  appearance
}
```

Runtime：

```text
NodeExecution
{
  id,
  workflowInstanceId,
  nodeDefinitionId,
  status,
  resolvedInputs,
  outputs,
  startedAt,
  completedAt,
  error
}
```

Human Node 可以继续产生：

```text
TaskInstance
{
  nodeExecutionId,
  assignee,
  status,
  dueAt,
  formSubmission
}
```

这层分离对以下能力非常重要：

```text
Versioning
Audit
Retry
Runtime Monitoring
Historical Analysis
Migration
Testing
```

---

# 74. 推荐系统主链路

整个系统可以统一理解为：

```text
                 DESIGN TIME

                Workflow Editor
                       │
                       ↓
                Workflow Draft
                       │
          ┌────────────┼────────────┐
          │            │            │
       Nodes         Edges        Data
          │            │            │
          └────────────┼────────────┘
                       ↓
                   Validate
                       ↓
                    Test
                       ↓
                   Publish
                       ↓
              Workflow Version

────────────────────────────────────────

                  RUN TIME

              Workflow Version
                       ↓
                    Start
                       ↓
              Workflow Instance
                       ↓
                Execution Engine
                       ↓
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
   Human Task       Automation      Decision
        ↓              ↓              ↓
  Employee App      Systems         Engine
        │
        ↓
  User completes work
        │
        ↓
  Task Instance Completed
        │
        ↓
  Node Execution Completed
        │
        ↓
  Follow outgoing transition
        │
        ↓
  Execute next Node
```

这条主链路应成为后续工程设计、数据模型和 UI 设计共同依赖的基础。

---

# 75. 产品术语基线

为了避免后续设计和代码讨论出现歧义，推荐统一以下术语。

| Term | 推荐含义 |
| --- | --- |
| Workflow | 一个业务流程的长期逻辑容器 |
| Workflow Draft | 当前可编辑的 Workflow Definition 状态 |
| Workflow Version | Publish 后不可变的执行定义快照 |
| Workflow Instance | 某一次真实流程运行 |
| Node Definition | Design Time 中定义的可执行步骤 |
| Node Execution | Runtime 中某个 Node 的一次实际执行 |
| Task Instance | Human Node 在 Runtime 中生成的真实员工工作 |
| Workflow Context | Instance 运行过程中的共享数据上下文 |
| Execution Record | 执行历史、输入输出、表单、附件、时间与审计记录 |
| Edge / Transition | Node 之间的可执行 Control Flow |
| Diagram Arrow | 不参与执行的视觉关系 |
| Assignment Rule | Design Time 的负责人解析规则 |
| Actual Assignee | Runtime 解析出的真实负责人 |
| Test Run | Design Time Dry Run / Simulation |
| Publish | 将 Draft 冻结为可执行 Workflow Version |

需要避免含糊使用：

```text
Node
```

在架构讨论中最好明确是：

```text
Node Definition
```

还是：

```text
Node Execution
```

同样：

```text
Task
```

需要区分：

```text
Task Node Definition
```

和：

```text
Task Instance
```

---

# 76. 本次细化后的核心产品判断

经过本次模型细化，后续设计应统一遵循以下判断：

1. Workflow Editor 是 Design Time Authoring Environment，不是员工执行工作的界面。
2. Workflow Definition 是可执行的 Visual Process Program，不是普通 Diagram。
3. Workflow Node 是预定义 Execution Logic 的高层业务封装。
4. Workflow Edge 是 Execution Transition，不只是视觉连线。
5. Canvas 负责 Program Structure，Inspector 负责 Program Configuration。
6. Workflow Data / Data Mapping 是可执行流程不可缺少的一等能力。
7. Design Time 保存 Assignment Rule，Run Time 才解析 Actual Assignee。
8. Form Definition 属于 Design Time，Form Submission 属于 Run Time。
9. Save Draft 与 Publish 必须是两个不同动作。
10. Published Workflow Version 必须 Immutable。
11. Workflow Instance 必须绑定启动时使用的 Workflow Version。
12. Node Definition 与 Node Execution 必须分离。
13. Employee App 执行 Runtime 产生的 Task Instances，而不是直接“执行 Canvas Node”。
14. Management Console 和 Employee App 共享同一个 Workflow Runtime Model，但服务不同用户视角。
15. 产品对 BPMN 的简化应通过 Semantic Node Encapsulation 实现，而不是通过削弱 Runtime 能力实现。

这些判断作为后续 Task Node、Approval Node、Condition Node、Node Visual、Inspector Schema、Publish、Runtime 与 Employee App 设计的上位约束。