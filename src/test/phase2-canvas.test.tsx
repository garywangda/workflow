import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ReactFlowProvider } from '@xyflow/react';
import { afterEach, expect, it } from 'vitest';
import { useState } from 'react';
import { WorkflowCanvas } from '../features/workflow-editor/components/WorkflowCanvas';
import { WorkflowEditorWorkspace } from '../features/workflow-editor/components/WorkflowEditorWorkspace';
import { DocumentContext } from '../features/workflow-library/DocumentContext';
import { createPresetNodes } from '../features/workflow-editor/phase2/model';
import type { WorkflowDocument } from '../features/workflow-library/document';
import type { PlacementItem } from '../features/workflow-editor/types/placement';
import userEvent from '@testing-library/user-event';

afterEach(cleanup);

function Harness({ capture }: { capture: (document: WorkflowDocument) => void }) {
  const [item, setItem] = useState<PlacementItem | null>({ kind: 'workflow-node', type: 'task' });
  const [initial] = useState(() => {
    const [a] = createPresetNodes('success', { x: 0, y: 0 });
    const [b] = createPresetNodes('success', { x: 0, y: 180 });
    return { nodes: [a, b], edges: [{ id: 'preserved-edge', source: a.id, target: b.id }] };
  });
  return <DocumentContext.Provider value={{ initial, onChange: capture }}><ReactFlowProvider><WorkflowCanvas activeEditorTool="select" placementItem={item} onPlacementItemChange={setItem} onEditorToolChange={() => {}} /></ReactFlowProvider></DocumentContext.Provider>;
}

it('keeps the original node placement, edge preservation, and confirmed deletion behavior', async () => {
  let document: WorkflowDocument = { nodes: [], edges: [] };
  const view = render(<Harness capture={doc => { document = doc; }} />);
  fireEvent.click(view.container.querySelector('.react-flow__pane')!, { clientX: 250, clientY: 100 });
  await waitFor(() => expect(document.nodes).toHaveLength(3));
  expect(document.nodes[2].data.name).toBe('Review purchase request');
  expect(document.edges.map(e => e.id)).toEqual(['preserved-edge']);
  fireEvent.keyDown(window, { key: 'Delete' });
  expect(document.nodes).toHaveLength(3);
  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(document.nodes).toHaveLength(3);
  fireEvent.keyDown(window, { key: 'Delete' });
  fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
  await waitFor(() => expect(document.nodes).toHaveLength(2));
  expect(document.edges.map(e => e.id)).toEqual(['preserved-edge']);
});

it('places the selected toolbar preset on the canvas with its phase-two configuration', async () => {
  const user = userEvent.setup();
  let document: WorkflowDocument = { nodes: [], edges: [] };
  const initial: WorkflowDocument = { nodes: [], edges: [] };
  const view = render(
    <DocumentContext.Provider value={{ id: 'placement-test', initial, onChange: next => { document = next; } }}>
      <ReactFlowProvider>
        <div style={{ width: 1200, height: 800 }}><WorkflowEditorWorkspace /></div>
      </ReactFlowProvider>
    </DocumentContext.Provider>,
  );

  await user.click(screen.getByRole('button', { name: 'Trigger' }));
  await user.click(screen.getByRole('button', { name: 'On a schedule' }));
  expect(screen.getByRole('complementary', { name: 'Node toolbar' })).toHaveAttribute('data-placement-active', 'true');
  const pane = view.container.querySelector('.react-flow__pane')!;
  fireEvent.click(pane, { clientX: 500, clientY: 240 });

  await waitFor(() => expect(document.nodes).toHaveLength(1));
  expect(document.nodes[0]).toMatchObject({
    type: 'trigger',
    data: { name: 'On a schedule', config: { presetId: 'schedule' } },
  });
});
