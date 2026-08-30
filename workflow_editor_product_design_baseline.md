# Workflow Editor 产品设计基线
## Visual Business Workflow SaaS — Product Model & Editor Architecture

> 版本：v0.3
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

---

## 3.4 Canvas 负责“表达流程”

Canvas 不应该承载全部配置。

Canvas 主要回答：

> **流程是什么？**

---

## 3.5 Inspector 负责“节点如何运行”

右侧 Inspector 主要回答：

> **这个 Node 怎么工作？**

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
EXECUTION
```

展示 Workflow Instance 的运行状态。

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

Workflow Layer 中的 Node 才是真正的 Runtime Object。

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

推荐模型：

```text
Node
│
├── Identity
├── Semantic Type
├── Capabilities
├── Configuration
├── Data Contract
├── Connections
├── Appearance
└── Runtime State
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
  "runtime": {}
}
```

注意：

```text
capabilities
```

非常重要。

Node 不应该通过一个巨大统一 Schema 进行配置。

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

未来真实运行时应该直接 Overlay 到 Canvas。

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
流程模板，由运营人员或经理设计

Workflow Version
已发布的不可变版本

Workflow Instance
某一次实际启动的流程

Task Instance
该次流程中分配给某个人或团队的具体任务

Execution Record
任务执行过程中产生的表单、附件、评论、输入、输出、时间和操作记录
```

标准关系：

```text
Workflow Definition
        ↓ Publish
Workflow Version
        ↓ Start
Workflow Instance
        ↓ Generate
Task Instances
        ↓ Execute
Execution Records
```

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
Draft Version
Published Version
```

用户编辑 Draft 不应该影响正在运行的 Instance。

以后支持：

```text
v1
v2
v3
```

运行中的实例绑定启动时版本。

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

例如：

```text
┌─────────────────────────┐
│ ✓ Approval              │
│ Manager Approval        │
│                         │
│ Sales Manager           │
│ Due: 2 days             │
└─────────────────────────┘
```

Condition 可以更突出 Branch：

```text
        Amount > 5000?
           ◇
        /     \
      YES     NO
```

但也可以设计为 modern workflow card。

---

# 56. Node Density

推荐三种显示密度作为未来能力：

```text
Compact
Default
Expanded
```

Compact：

```text
[ Approval ] Manager Review
```

Default：

显示负责人、时间等核心信息。

Expanded：

显示更多 Rules / Inputs / Outputs。

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

---

# 58. Node Internal State

Node Design State：

```text
Draft
Configured
Warning
Error
```

Runtime State：

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

---

# 59. Publish Model

推荐流程：

```text
Edit
↓
Validate
↓
Resolve Errors
↓
Test Run
↓
Publish
```

Publish 后形成：

```text
Immutable Published Version
```

用户再次修改时创建新 Draft。

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
Node Model
=
Semantic Type
+
Capabilities
+
Configuration
+
Data Contract
+
Runtime State
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
流程是什么
```

```text
右边
这个节点怎么工作
```

```text
顶部
流程现在是什么状态
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

> **一个以业务语义 Node 为核心、以无限 Canvas 为表现层、以 Capability-based Config Blocks 为配置层、以 Workflow Context 为数据层、以 Runtime Engine 为执行层，并由 AI 贯穿创建—配置—验证—运行全过程的 Visual Business Workflow Editor。**

---

# 65. 下一阶段最应该冻结的三个模型

在继续大量开发 Toolbox 或增加 Node 前，应优先正式定义：

## 1. Node Schema

回答：

```text
一个 Node 到底由什么组成？
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
Edges
Appearance
Metadata
Runtime
```

---

## 2. Capability Schema

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

## 3. Inspector Config Block Schema

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

# 66. 推荐下一阶段设计顺序

建议按以下顺序推进：

```text
Stage A
Node Schema
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
Workflow Graph Schema
```

↓

```text
Stage E
Data Context / Mapping
```

↓

```text
Stage F
Runtime / Execution State
```

↓

```text
Stage G
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
│   ├── Workflow Version
│   ├── Workflow Instance
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
Assignment
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
