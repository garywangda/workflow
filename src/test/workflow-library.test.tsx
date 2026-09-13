import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { WorkflowLibrary } from '../features/workflow-library/WorkflowLibrary';

beforeEach(() => localStorage.clear());
afterEach(cleanup);

it('keeps search and Group filtering when switching between cards and a checkbox-free table', async () => {
  const user = userEvent.setup();
  render(<WorkflowLibrary />);
  await user.click(screen.getByRole('button', { name: '载入示例流程' }));
  await user.selectOptions(screen.getByLabelText('Group 筛选'), 'supplies');
  await user.type(screen.getByRole('searchbox', { name: '搜索流程' }), '申请');
  expect(screen.getByRole('button', { name: '打开 物品申请' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: '打开 采购需求确认' })).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: '列表' }));
  const table = screen.getByRole('table');
  expect(within(table).getAllByRole('row')).toHaveLength(2);
  expect(within(table).queryByRole('checkbox')).not.toBeInTheDocument();
  expect(screen.getByLabelText('Group 筛选')).toHaveValue('supplies');
});

it('deletes only the Group association, retaining workflows and their other Groups after reload', async () => {
  const user = userEvent.setup();
  const view = render(<WorkflowLibrary />);
  await user.click(screen.getByRole('button', { name: '载入示例流程' }));
  await user.click(screen.getByRole('button', { name: '管理 Group' }));
  await user.click(screen.getByRole('button', { name: '删除 物资管理' }));
  await user.click(screen.getByRole('button', { name: '确认删除 Group' }));
  await user.click(screen.getByRole('button', { name: '关闭 Group 管理' }));
  view.unmount(); render(<WorkflowLibrary />);
  await user.selectOptions(screen.getByLabelText('Group 筛选'), 'onboarding');
  expect(screen.getByRole('button', { name: '打开 物品申请' })).toBeInTheDocument();
  await user.selectOptions(screen.getByLabelText('Group 筛选'), 'ungrouped');
  expect(screen.getByRole('button', { name: '打开 采购需求确认' })).toBeInTheDocument();
});

it('persists favorites without changing Group membership', async () => {
  const user = userEvent.setup();
  const view = render(<WorkflowLibrary />);
  await user.click(screen.getByRole('button', { name: '载入示例流程' }));
  await user.click(screen.getByRole('button', { name: '收藏 设备巡检' }));
  await user.click(screen.getByRole('tab', { name: '收藏' }));
  expect(screen.getByRole('button', { name: '打开 设备巡检' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: '打开 物品申请' })).not.toBeInTheDocument();
  view.unmount(); render(<WorkflowLibrary />);
  await user.click(screen.getByRole('tab', { name: '收藏' }));
  expect(screen.getByRole('button', { name: '打开 设备巡检' })).toBeInTheDocument();
});

it('rejects empty and duplicate Group names without closing the form', async () => {
  const user = userEvent.setup();
  render(<WorkflowLibrary />);
  await user.click(screen.getByRole('button', { name: '管理 Group' }));
  await user.type(screen.getByLabelText('Group 名称'), '采购');
  await user.click(screen.getByRole('button', { name: '创建 Group' }));
  await user.type(screen.getByLabelText('Group 名称'), ' 采购 ');
  await user.click(screen.getByRole('button', { name: '创建 Group' }));
  expect(screen.getByRole('alert')).toHaveTextContent('已存在');
});

it('creates a workflow in the selected Group and retains it on reload', async () => {
  const user = userEvent.setup();
  const view = render(<WorkflowLibrary />);
  await user.click(screen.getByRole('button', { name: '载入示例流程' }));
  await user.selectOptions(screen.getByLabelText('Group 筛选'), 'maintenance');
  await user.click(screen.getByRole('button', { name: '新建流程' }));
  await user.type(screen.getByLabelText('流程名称'), '每月保养');
  expect(screen.getByRole('checkbox', { name: '设备维护' })).toBeChecked();
  await user.click(screen.getByRole('button', { name: '创建流程' }));
  view.unmount(); render(<WorkflowLibrary />);
  await user.selectOptions(screen.getByLabelText('Group 筛选'), 'maintenance');
  expect(screen.getByRole('button', { name: '打开 每月保养' })).toBeInTheDocument();
});

it('does not overwrite unreadable stored data with an empty library', () => {
  localStorage.setItem('workflow.library.v1', '{broken');
  render(<WorkflowLibrary />);
  expect(screen.getByRole('alert')).toHaveTextContent('无法读取');
  expect(localStorage.getItem('workflow.library.v1')).toBe('{broken');
});

it('keeps a failed creation form visible with its error so the user can retry', async () => {
  const user = userEvent.setup();
  render(<WorkflowLibrary />);
  await user.click(screen.getByRole('button', { name: '载入示例流程' }));
  await user.click(screen.getByRole('button', { name: '新建流程' }));
  await user.type(screen.getByLabelText('流程名称'), '待保存的流程');
  const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
  try {
    await user.click(screen.getByRole('button', { name: '创建流程' }));
    expect(within(screen.getByRole('alertdialog')).getByRole('alert')).toHaveTextContent('保存失败');
    expect(screen.getByLabelText('流程名称')).toHaveValue('待保存的流程');
  } finally { spy.mockRestore(); }
});
