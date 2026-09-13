import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { WorkflowLibrary } from '../features/workflow-library/WorkflowLibrary';

beforeEach(() => localStorage.clear());
afterEach(cleanup);

it('keeps search and Group filtering when switching between cards and a checkbox-free table', async () => {
  const user = userEvent.setup();
  render(<WorkflowLibrary />);
  await user.click(screen.getByRole('button', { name: 'Load sample workflows' }));
  await user.selectOptions(screen.getByLabelText('Filter by group'), 'supplies');
  await user.type(screen.getByRole('searchbox', { name: 'Search workflows' }), 'request');
  expect(screen.getByRole('button', { name: 'Open Supply request' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Open Purchase confirmation' })).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'List' }));
  const table = screen.getByRole('table');
  expect(within(table).getAllByRole('row')).toHaveLength(2);
  expect(within(table).queryByRole('checkbox')).not.toBeInTheDocument();
  expect(screen.getByLabelText('Filter by group')).toHaveValue('supplies');
});

it('deletes only the Group association, retaining workflows and their other Groups after reload', async () => {
  const user = userEvent.setup();
  const view = render(<WorkflowLibrary />);
  await user.click(screen.getByRole('button', { name: 'Load sample workflows' }));
  await user.click(screen.getByRole('button', { name: 'Manage groups' }));
  await user.click(screen.getByRole('button', { name: 'Delete Supplies' }));
  await user.click(screen.getByRole('button', { name: 'Delete group' }));
  await user.click(screen.getByRole('button', { name: 'Close group manager' }));
  view.unmount(); render(<WorkflowLibrary />);
  await user.selectOptions(screen.getByLabelText('Filter by group'), 'onboarding');
  expect(screen.getByRole('button', { name: 'Open Supply request' })).toBeInTheDocument();
  await user.selectOptions(screen.getByLabelText('Filter by group'), 'ungrouped');
  expect(screen.getByRole('button', { name: 'Open Purchase confirmation' })).toBeInTheDocument();
});

it('persists favorites without changing Group membership', async () => {
  const user = userEvent.setup();
  const view = render(<WorkflowLibrary />);
  await user.click(screen.getByRole('button', { name: 'Load sample workflows' }));
  await user.click(screen.getByRole('button', { name: 'Favorite Equipment inspection' }));
  await user.click(screen.getByRole('tab', { name: 'Favorites' }));
  expect(screen.getByRole('button', { name: 'Open Equipment inspection' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Open Supply request' })).not.toBeInTheDocument();
  view.unmount(); render(<WorkflowLibrary />);
  await user.click(screen.getByRole('tab', { name: 'Favorites' }));
  expect(screen.getByRole('button', { name: 'Open Equipment inspection' })).toBeInTheDocument();
});

it('rejects empty and duplicate Group names without closing the form', async () => {
  const user = userEvent.setup();
  render(<WorkflowLibrary />);
  await user.click(screen.getByRole('button', { name: 'Manage groups' }));
  await user.type(screen.getByLabelText('Group name'), '采购');
  await user.click(screen.getByRole('button', { name: 'Create group' }));
  await user.type(screen.getByLabelText('Group name'), ' 采购 ');
  await user.click(screen.getByRole('button', { name: 'Create group' }));
  expect(screen.getByRole('alert')).toHaveTextContent('already exists');
});

it('creates a workflow in the selected Group and retains it on reload', async () => {
  const user = userEvent.setup();
  const view = render(<WorkflowLibrary />);
  await user.click(screen.getByRole('button', { name: 'Load sample workflows' }));
  await user.selectOptions(screen.getByLabelText('Filter by group'), 'maintenance');
  await user.click(screen.getByRole('button', { name: 'New workflow' }));
  await user.type(screen.getByLabelText('Workflow name'), '每月保养');
  expect(screen.getByRole('checkbox', { name: 'Maintenance' })).toBeChecked();
  await user.click(screen.getByRole('button', { name: 'Create workflow' }));
  view.unmount(); render(<WorkflowLibrary />);
  await user.selectOptions(screen.getByLabelText('Filter by group'), 'maintenance');
  expect(screen.getByRole('button', { name: 'Open 每月保养' })).toBeInTheDocument();
});

it('does not overwrite unreadable stored data with an empty library', () => {
  localStorage.setItem('workflow.library.v1', '{broken');
  render(<WorkflowLibrary />);
  expect(screen.getByRole('alert')).toHaveTextContent('Unable to read');
  expect(localStorage.getItem('workflow.library.v1')).toBe('{broken');
});

it('keeps a failed creation form visible with its error so the user can retry', async () => {
  const user = userEvent.setup();
  render(<WorkflowLibrary />);
  await user.click(screen.getByRole('button', { name: 'Load sample workflows' }));
  await user.click(screen.getByRole('button', { name: 'New workflow' }));
  await user.type(screen.getByLabelText('Workflow name'), '待保存的流程');
  const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
  try {
    await user.click(screen.getByRole('button', { name: 'Create workflow' }));
    expect(within(screen.getByRole('alertdialog')).getByRole('alert')).toHaveTextContent('Save failed');
    expect(screen.getByLabelText('Workflow name')).toHaveValue('待保存的流程');
  } finally { spy.mockRestore(); }
});
