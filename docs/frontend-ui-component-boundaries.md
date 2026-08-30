# Frontend UI component boundaries

This project uses shadcn/ui-style local primitives for common application chrome while preserving React Flow as the owner of canvas interaction and rendering.

## Directory responsibilities

- `src/components/ui`: unstyled-by-business, reusable primitives based on Radix and semantic CSS variables. These files must not import from `features/workflow-editor`.
- `src/components/app`: small application-level compositions such as an accessible icon button with a Tooltip. These may compose `components/ui`, but must not own workflow or React Flow state.
- `src/features/workflow-editor/components`: feature components that map workflow intent onto common UI primitives.
- `src/features/workflow-editor/config`: registries for node definitions, capabilities, tools, and Inspector block renderers. Capability-driven behavior belongs here instead of hard-coded tabs.

## Protected React Flow boundary

The following remain React Flow-owned and must not be replaced with shadcn layout primitives:

- `WorkflowCanvas.tsx`
- `components/nodes/**`
- `components/edges/**`
- `factories/**`
- React Flow node/edge/placement types
- `styles/workflow-canvas.css`

Do not wrap the React Flow surface in a Radix ContextMenu trigger. Do not replace workflow nodes with Card, Node Library with Sidebar, or CanvasControls with application buttons. Preserve selectors, DOM geometry, `position`, `transform`, `pointer-events`, z-index, Handle hit areas, and React Flow stylesheet/import order.

## Component usage rules

- Icon-only controls use `AppIconButton` so they always have an accessible name, a visible focus ring, and a Tooltip.
- Destructive changes use a controlled `AlertDialog`; the feature remains responsible for the request state and the actual mutation.
- Portal components must be scoped to transient overlays. They must not add wrappers around the canvas or intercept canvas pointer/wheel events while closed.
- Node Library emits `PlacementItem` only. It never imports React Flow or creates nodes directly.
- Inspector sections remain capability-driven. Placeholder controls are read-only or disabled until their business model and write path are defined.
- CSS uses semantic tokens from `src/styles/global.css`. Dark mode is intentionally not defined in this phase.

## Migration and regression record

Before migration, `npm run typecheck` and `npm run lint` passed. The Vite build passed when esbuild was allowed to read the worktree metadata required by the managed sandbox. Browser baseline checks confirmed node preview, click placement, automatic selection, Inspector linkage, four Handle accessibility nodes, right-click delete, Escape cancellation, and Delete-key confirmation.

After UI changes, run:

```powershell
npm run typecheck
npm run lint
npm run test
npm run build
git diff --check
```

Manual browser regression must cover placement coordinates and preview, node drag, box selection, pan, four-direction connections, valid and invalid preview lines, Edge arrowheads, zoom/fit view, right-click placement cancellation, right-click deletion, Delete-key confirmation, Inspector selection linkage, Library search/scroll, and overlay pointer/focus behavior.
