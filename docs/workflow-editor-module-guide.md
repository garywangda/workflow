# Workflow Editor 模块说明

本文档用于帮助新的开发者或 AI 快速理解 Workflow Editor 的目录结构、状态边界和扩展方式。当前编辑器基于 React、TypeScript、Vite 和 `@xyflow/react` 构建。

## 1. 先看哪里

推荐按下面的顺序阅读：

1. `src/features/workflow-editor/WorkflowEditorPage.tsx`：功能入口和 `ReactFlowProvider`。
2. `src/features/workflow-editor/components/WorkflowEditorWorkspace.tsx`：三栏工作区以及编辑上下文。
3. `src/features/workflow-editor/components/WorkflowCanvas.tsx`：节点、Edge、工具和连接交互的状态中心。
4. `src/features/workflow-editor/config/workflow-node-definitions.ts`：节点类型的配置注册表。
5. `src/features/workflow-editor/factories/create-workflow-node.ts`：从配置创建 React Flow Node。
6. `src/features/workflow-editor/components/nodes/BaseWorkflowNode.tsx`：节点视觉结构和四个连接 Handle。

## 2. 模块地图

| 模块 | 主要文件 | 作用 | 是否拥有编辑状态 |
| --- | --- | --- | --- |
| 页面入口 | `WorkflowEditorPage.tsx` | 组装页面并提供 `ReactFlowProvider` | 否 |
| 工作区编排 | `components/WorkflowEditorWorkspace.tsx` | 连接 Node Library、Canvas、Inspector | 只拥有工具和放置模式 |
| 画布 | `components/WorkflowCanvas.tsx` | 渲染 React Flow，维护 nodes/edges，处理放置和连接 | 是，当前为内存状态 |
| 节点库 | `components/library/NodeLibrary.tsx` | 搜索和选择可放置项目 | 否，输出 `PlacementItem` |
| Inspector | `components/inspector/NodeInspector.tsx` | 根据选中节点能力展示配置区块 | 当前为展示壳 |
| 节点渲染 | `components/nodes/*` | 将语义节点和图形元素渲染成 React Flow node | 否 |
| 连接线 | `components/edges/WorkflowConnectionLine.tsx` | 绘制拖动连接期间的平滑箭头预览线 | 否 |
| 数据类型 | `types/*` | 定义 Node、Diagram、Placement、Tool、Inspector 类型 | 否 |
| 配置注册表 | `config/*` | 定义节点、能力、动作预设、图形元素和 Inspector 区块 | 否 |
| 工厂 | `factories/*` | 根据配置生成可用的 React Flow Node | 否 |
| 快捷键 | `hooks/useEditorToolShortcuts.ts` | 管理选择工具和手型工具快捷键 | 否 |
| 样式 | `styles/*` | 页面布局、画布、节点库和 Inspector 视觉样式 | 否 |

## 3. 页面和状态流

```text
WorkflowEditorPage
  └─ ReactFlowProvider
      └─ WorkflowEditorWorkspace
          ├─ NodeLibrary ── PlacementItem ──┐
          ├─ WorkflowCanvas <───────────────┘
          └─ NodeInspector
```

`WorkflowEditorWorkspace` 是面板之间的编排层：

- `activeEditorTool` 保存当前是 `select` 还是 `hand` 工具。
- `placementItem` 表示用户从 Node Library 选中了什么，非空时进入“点击画布放置”模式。
- Node Library 不直接创建节点，只向 Workspace 发送 `PlacementItem`。
- WorkflowCanvas 根据 `PlacementItem` 调用 factory 创建节点，然后清空放置模式。
- 当前 `nodes` 和 `edges` 在 WorkflowCanvas 内存中维护；还没有接入后端或本地持久化。

## 4. Node 的数据模型

### 4.1 语义节点

`types/workflow-node.ts` 中的 `WorkflowNode` 是 React Flow `Node<WorkflowNodeData, WorkflowNodeType>` 的类型别名。节点数据包括：

- `name`：节点展示名称。
- `capabilities`：该节点支持的配置能力，驱动 Inspector 区块。
- `config`：节点实际配置，当前使用 `Record<string, unknown>` 作为迁移阶段的宽松结构。
- `inputs` / `outputs`：数据输入输出定义。
- `appearance`：语义角色和视觉密度。
- `metadata.schemaVersion`：未来进行数据迁移时使用的版本号。

### 4.2 配置优先

`config/workflow-node-definitions.ts` 是节点类型的单一注册表。一个节点的 label、图标、分类、默认名称、能力、默认配置和搜索关键词都从这里读取。

因此新增普通 Workflow 节点时，优先修改这个注册表；不要在 Node Library、Factory 和 Node Component 中分别复制一份节点元数据。

### 4.3 创建实例

`factories/create-workflow-node.ts` 接收节点类型、坐标和可选 Action preset，返回一个带唯一 id 的 React Flow Node。默认配置使用 `structuredClone`，防止不同节点共享同一个可变配置对象。

### 4.4 Canvas Node 视觉契约

画布当前展示一个代表性的 `Human task` 节点，用于验证节点卡片信息层级，不代表完整节点库。节点采用稳定、紧凑的 B2B SaaS 卡片结构：

- 顶部一级职责类别区：使用完整宽度的语义色标题区展示 `Human task`，不再叠加类别图标或额外色条；类别色只表达语义，不表达配置结果。
- 主体字段：按具体节点名称、负责人/Provider 与配置状态、最多两行的简短描述排列。
- 配置状态：`Needs setup` 以元数据行内的小圆点和文字显示，不使用胶囊、按钮或独立状态栏；不显示 `Pending`、`Running`、`Completed`、`Failed` 等任何运行状态，也不在节点上展开完整 Inspector 配置。
- 四连接点：上、右、下、左各一个 React Flow Handle；命中区域与视觉圆点由 `workflow-canvas.css` 统一控制。

节点采用“语义色标题区 + 白色内容区”的单一倒角长方形外框，不增加独立顶部色条或内部装饰线。节点保持稳定宽度，描述使用两行截断；在响应缩放时保持信息层级与连接点方向，不因缩放改变内容结构。Node 只表达流程结构、负责人/Provider 和轻量配置提示，不展示 Due 等时间摘要。完整配置仍属于右侧 Inspector；运行状态属于未来 Run/Monitor 视图，明确排除在本模块视觉契约之外。

## 5. 连接交互的数据流

当前的连接交互由 React Flow 官方 API 加上项目 CSS/状态逻辑组成：

```text
Hover Node
  ↓
CSS 显示四个 Handle 的命中区域和小圆点
  ↓
Hover Handle
  ↓
CSS 将小圆点放大为“圆圈 +”
  ↓
拖动 Handle
  ↓
React Flow 触发 onConnectStart，并显示所有节点的 Handle
  ↓
靠近目标 Handle
  ↓
connectionRadius=28 负责命中/吸附，Handle.valid 负责目标视觉状态
  ↓
释放鼠标
  ├─ 有效目标：onConnect → addEdge → 创建带箭头的 Edge
  └─ 无效目标：不创建 Edge，onConnectEnd 结束连接状态
  ↓
连接成功后暂时隐藏 Handle，下一次鼠标移动时恢复
```

### 5.1 React Flow API 与项目代码的分工

| API 或代码 | 责任 |
| --- | --- |
| `Handle` | 提供真正参与连接命中、起点和终点判断的交互元素 |
| `Position` | 定义 top、right、bottom、left 四个方向 |
| `id` | 区分四个方向的连接点，最终可用于判断连接来源和目标 |
| `ConnectionMode.Loose` | 允许四个 `source` Handle 同时作为起点和终点 |
| `connectionRadius={28}` | 定义目标 Handle 的吸附命中范围 |
| `onConnectStart` / `onConnectEnd` | 控制连接进行中的临时 UI 状态 |
| `onConnect` + `addEdge` | 将有效连接保存为 React Flow Edge |
| `connectionLineComponent` | 注入拖动中的自定义预览线 |
| `getSmoothStepPath` | 生成与最终 Edge 一致的平滑折线路径 |
| `MarkerType.ArrowClosed` | 为完成后的 Edge 添加闭合箭头 |
| `workflow-canvas.css` | 定义小圆点、圆圈加号、颜色、过渡动画和 Handle 显隐 |

官方参考：

- [React Flow Handles](https://reactflow.dev/learn/customization/handles)
- [React Flow Handle API](https://reactflow.dev/api-reference/components/handle)
- [React Flow API](https://reactflow.dev/api-reference/react-flow)
- [React Flow addEdge](https://reactflow.dev/api-reference/utils/add-edge)
- [React Flow Custom Connection Line](https://reactflow.dev/examples/edges/custom-connectionline)
- [draw.io Connectors](https://www.drawio.com/docs/manual/connectors/)

draw.io 只作为连接点、方向箭头和吸附交互的行为参考；项目没有引入或复制 draw.io 代码。

## 6. 如何扩展

### 6.1 新增一个 Workflow 节点

1. 在 `types/workflow-node.ts` 的 `WorkflowNodeType` 增加联合类型成员。
2. 在 `config/workflow-node-definitions.ts` 增加完整定义。
3. 在 `components/nodes/node-types.ts` 注册对应的 React Flow type；如果仍使用通用节点外观，可以复用 `WorkflowNodeComponent`。
4. 如果需要新的 Inspector 配置能力，在 `NodeCapabilityId`、`capability-definitions.ts` 和 `inspector-block-definitions.tsx` 中补齐。
5. 如需加入 Node Library 固定排序，在 `WORKFLOW_NODE_LIBRARY_ORDER` 中加入。

### 6.2 新增一个 Action preset

在 `config/action-presets.ts` 增加 preset id 和定义，并同步更新 `types/action-preset.ts`。Node Library 会自动读取 `ACTION_PRESETS`，点击后由 `createWorkflowNode` 创建 `action` 节点。

### 6.3 修改连接点视觉

优先修改 `styles/workflow-canvas.css`：

- 命中区域：`.workflow-connection-handle` 的宽高。
- 四个方向：`.react-flow__handle-top/right/bottom/left` 定位规则。
- 默认小圆点：`.workflow-connection-handle::before`。
- 圆圈加号：`:hover`、`.connecting`、`.valid` 状态规则。
- 拖动预览箭头：`.workflow-connection-line__path` 和 `WorkflowConnectionLine.tsx` 的 SVG marker。

不要通过修改 `Handle` 的 `type` 来实现视觉效果；`type` 会改变 React Flow 的连接语义。

### 6.4 修改连接规则

连接规则应集中在 `WorkflowCanvas.tsx` 和 React Flow 的 Handle 配置中：

- 是否允许连接：`nodesConnectable`、`isConnectableStart`、`isConnectableEnd`。
- 起点/终点类型：`ConnectionMode` 和 Handle `type`。
- 吸附距离：`connectionRadius`。
- 创建 Edge 前的业务校验：在 `handleConnect` 中校验 `connection`，校验失败时不要调用 `addEdge`。
- 禁止自连接或重复连接：在 `handleConnect` 中检查当前 `edges` 后再写入。

## 7. 给其他 AI 的修改约束

处理这个功能时请遵守以下边界：

1. 优先从 `config` 和 `types` 找到单一数据来源，不要在组件里硬编码节点元数据。
2. 不要把 Node Library 直接连接到 React Flow API；通过 `PlacementItem` 和 Workspace/Canvas 传递意图。
3. 连接 Handle 的命中逻辑交给 React Flow，视觉状态交给 CSS。
4. 新增 Edge 时使用 `useEdgesState` 的 setter 和 `addEdge`，不要直接修改原数组。
5. 如果修改 Node 或 Edge 的数据结构，需要同步更新本文件和相关 TypeScript 类型。
6. 连接数据目前只存在内存中。如果以后接入保存功能，应在 Workspace 或更高层统一管理序列化，不要让单个节点组件直接调用 API。
7. 完成修改后至少运行 `npm run typecheck`、`npm run lint` 和 `npm run build`。

## 8. 放置取消和删除交互

### 8.1 取消放置

Node Library 选择项目后，`placementItem` 非空，Canvas 会显示跟随鼠标的预览节点。空白画布右键由 `onPaneContextMenu` 处理：阻止浏览器默认菜单，并把 `placementItem` 清空；它不会创建节点，也不会改变已有节点和 Edge。

### 8.2 节点右键删除

节点右键由 `onNodeContextMenu` 打开 `WorkflowContextMenu`。菜单中的删除动作只创建 `deleteRequest`，必须在 `WorkflowDeleteDialog` 中再次确认后才执行删除。

### 8.3 Delete 键删除

`WorkflowCanvas` 将 React Flow 的 `deleteKeyCode` 设为 `null`，避免 React Flow 绕过确认窗口直接删除。Canvas 自己只监听 `Delete`，读取当前选中的节点和 Edge，弹出同一个确认窗口；没有把 `Enter` 注册为删除快捷键。

确认后通过 React Flow 官方 `deleteElements` 删除节点和 Edge。删除节点时，React Flow 会一并删除关联 Edge；因此不要在节点组件内手动修改其他节点或 Edge。

## 9. 验证命令

在项目根目录运行：

```powershell
npm run typecheck
npm run lint
npm run build
npm run test:styles
git diff --check
```
