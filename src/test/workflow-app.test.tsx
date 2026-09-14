import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { WorkflowApp } from '../WorkflowApp';
import { saveDocument } from '../features/workflow-library/document';
beforeEach(() => localStorage.clear());
afterEach(cleanup);
it('opens a newly created workflow with its fixed start form', async () => {
  const user = userEvent.setup();
  render(<WorkflowApp />);
  await user.click(screen.getAllByRole('button', { name: 'New workflow' })[0]);
  await user.type(screen.getByLabelText('Workflow name'), 'New request');
  await user.click(screen.getByRole('button', { name: 'Create workflow' }));
  expect(await screen.findByText('Start form · version 1 · 0 fields')).toBeInTheDocument();
});
it('opens separate saved canvases and restores the filtered library on return', async () => {
  const user = userEvent.setup();
  render(<WorkflowApp />);
  await user.click(screen.getByRole('button', { name: 'Load sample workflows' }));
  saveDocument('sample-0', { nodes: [{ id: 'one', position: { x: 100, y: 100 }, data: { label: '采购专属节点' } }], edges: [] });
  await user.selectOptions(screen.getByLabelText('Filter by group'), 'supplies');
  await user.click(screen.getByRole('button', { name: 'Open Supply request' }));
  expect(screen.getByText('采购专属节点')).toBeInTheDocument();
  expect(screen.queryByRole('navigation', { name: 'Main navigation' })).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Back to library' }));
  expect(screen.getByLabelText('Filter by group')).toHaveValue('supplies');
  await user.click(screen.getByRole('button', { name: 'Open Purchase confirmation' }));
  expect(screen.queryByText('采购专属节点')).not.toBeInTheDocument();
});
