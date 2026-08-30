# Frontend UI Guidelines

This project uses Tailwind CSS v4 for application chrome while keeping React Flow interaction rendering in feature CSS. The split is intentional: application surfaces can evolve without changing Canvas geometry, event handling, or connection behavior.

## CSS loading contract

`src/main.tsx` is the only CSS entry point. Keep imports in this order:

1. `src/styles/tailwind.css` — Tailwind v4 theme, Preflight, and utilities.
2. `@xyflow/react/dist/style.css` — the official React Flow reset and component styles.
3. `src/styles/global.css` — document sizing, root typography, and `body` overflow.
4. `src/features/workflow-editor/styles/workflow-editor.css` — small feature-level integration rules such as React Flow `Panel` spacing.
5. `src/features/workflow-editor/styles/workflow-canvas.css` — Canvas, Node, Handle, Edge, Controls, menu, and dialog behavior/visuals.

Do not move feature CSS imports back into component modules. The build contract in `tests/style-contract.test.mjs` verifies the emitted CSS order rather than assuming module traversal order.

Tailwind Preflight remains enabled. React Flow's official stylesheet loads after Tailwind and restores its component assumptions; browser regression confirms Controls, Nodes, Handles, Edges, and pointer events remain stable. If a future React Flow release exposes a reset conflict that cannot be solved by ordering or a narrow feature override, use Tailwind v4's supported split imports to omit Preflight while retaining theme and utilities, and add a regression case first.

## Design tokens

CSS-first tokens live in `src/styles/tailwind.css` under `@theme static` so they are emitted even when a token is consumed from feature CSS rather than a utility class.

- Application: `app-background`, `panel`, `foreground`, `muted`, `muted-foreground`, `subtle-foreground`, `border`, and `border-strong`.
- Actions and focus: `primary`, `primary-hover`, `primary-soft`, `focus-ring`, `danger`, and `danger-hover`.
- Shape: `radius-control`, `radius-panel`, `shadow-panel`, and `shadow-dialog`.
- Typography: `font-sans` and `font-mono`.
- Workflow semantics: `workflow-trigger`, `workflow-condition`, `workflow-action`, `workflow-end`, and their `*-surface` companions.

Workflow semantic colors are separate from generic application colors. Do not map a business role such as Condition or End directly to `primary` or `danger`; its meaning must remain stable if application branding changes. The protected Canvas stylesheet currently preserves its validated values and can adopt the semantic variables only as a dedicated, regression-tested Canvas change.

## Component and styling boundaries

- Use Tailwind utilities for the application shell, header, tool buttons, Node Library, Inspector typography, and ordinary form controls.
- Put reusable application UI in `src/components/ui` if shadcn/ui is introduced later. At that point add the `@/*` alias, `components.json`, and `src/lib/utils.ts` once; do not add a second Tailwind configuration or a Tailwind v3/PostCSS setup.
- Keep workflow-specific composition under `src/features/workflow-editor`.
- Keep complex Canvas, Node, Handle, Edge, preview, selection, and React Flow Controls styling in `workflow-canvas.css`.
- Keep `WorkflowContextMenu` attached to `onNodeContextMenu`. Never wrap the entire React Flow surface in a third-party context-menu trigger.
- Keep `WorkflowDeleteDialog` controlled by `deleteRequest` and `deleteElements`. A future AlertDialog migration must preserve this state boundary and pass the pointer-event browser regression.
- Keep `CanvasControls` based on React Flow `Controls` and `ControlButton`.

## Interaction and accessibility rules

- Preserve the 52px editor header and visible keyboard focus rings.
- Icon-only buttons require an accessible name and a tooltip/title.
- Library scrolling must use `overscroll-contain`; wheel input over the Library must not pan the Canvas.
- Do not change node origin, coordinate conversion, connection radius, Handle size/position, pointer events, Edge type, or connection preview as part of application styling work.
- Treat a new browser console error or warning as a regression. The current development baseline has one unrelated `/favicon.ico` 404.

## Verification

Run these commands after each migration stage:

```powershell
npm run typecheck
npm run lint
npm run build
npm run test:styles
git diff --check
```

Then run a real-browser regression at 1440×900 covering node placement coordinates, preview following, selection, drag, box selection, Select/Hand tools and shortcuts, pan, zoom, Fit View, all four Handles, connection preview and snap, final Edge arrow, placement cancellation, Library search/scroll boundaries, context-menu deletion, Delete-key confirmation, Inspector resizing, and console output.
