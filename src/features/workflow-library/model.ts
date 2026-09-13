export type Scope = 'all' | 'recent' | 'favorites';
export type WorkflowStatus = 'draft' | 'published' | 'changes';
export interface Group { id: string; name: string }
export interface WorkflowFile {
  id: string; name: string; description: string; groupIds: string[]; owner: string;
  status: WorkflowStatus; archived: boolean; favorite: boolean; updatedAt: number; visitedAt?: number;
}
export interface LibraryData { version: 1; groups: Group[]; workflows: WorkflowFile[] }
export const LIBRARY_KEY = 'workflow.library.v1';
export const VIEW_KEY = 'workflow.library.view';
export const emptyLibrary = (): LibraryData => ({ version: 1, groups: [], workflows: [] });
export function loadLibrary(): { data: LibraryData; error: string } {
  try {
    const raw = localStorage.getItem(LIBRARY_KEY);
    if (!raw) return { data: emptyLibrary(), error: '' };
    const value = JSON.parse(raw) as LibraryData;
    if (value.version !== 1 || !Array.isArray(value.groups) || !Array.isArray(value.workflows)
      || value.groups.some(g => typeof g.id !== 'string' || typeof g.name !== 'string')
      || value.workflows.some(w => typeof w.id !== 'string' || typeof w.name !== 'string'
        || typeof w.description !== 'string' || typeof w.owner !== 'string'
        || !Array.isArray(w.groupIds) || w.groupIds.some(id => typeof id !== 'string')
        || !['draft', 'published', 'changes'].includes(w.status)
        || typeof w.favorite !== 'boolean' || typeof w.archived !== 'boolean'
        || !Number.isFinite(w.updatedAt))) throw new Error('Invalid library');
    return { data: value, error: '' };
  } catch { return { data: emptyLibrary(), error: '无法读取本地流程数据。原数据未被覆盖，请重试或检查浏览器存储。' }; }
}
export function sampleLibrary(): LibraryData {
  const now = Date.now();
  const groups = [{ id: 'supplies', name: '物资管理' }, { id: 'onboarding', name: '员工入职' }, { id: 'maintenance', name: '设备维护' }, { id: 'delivery', name: '客户交付' }];
  const rows: [string, string, string[], string, WorkflowStatus][] = [
    ['物品申请', '申请、确认与物品领取', ['supplies', 'onboarding'], '林晓', 'published'],
    ['新员工入职', '从入职准备到第一周安排', ['onboarding'], '陈雨', 'changes'],
    ['设备巡检', '定期检查、问题记录与处理', ['maintenance'], '周宁', 'published'],
    ['客户项目交付', '交付准备、验收与资料归档', ['delivery'], '许舟', 'draft'],
    ['采购需求确认', '汇总需求并确认采购安排', ['supplies'], '林晓', 'published'],
    ['服务问题处理', '接收反馈并跟进处理结果', [], '陈雨', 'draft'],
  ];
  return { version: 1, groups, workflows: rows.map(([name, description, groupIds, owner, status], i) => ({ id: `sample-${i}`, name, description, groupIds, owner, status, archived: false, favorite: false, updatedAt: now - i * 86400000 })) };
}
export function groupNameError(name: string, groups: Group[], except?: string) {
  if (!name.trim()) return '请输入 Group 名称';
  if (groups.some(g => g.id !== except && g.name === name.trim())) return '这个 Group 名称已存在';
  return '';
}
export function selectWorkflows(data: LibraryData, query: { scope: Scope; group: string; search: string; status: string; sort: string }) {
  const term = query.search.trim().toLocaleLowerCase();
  return data.workflows.filter(w =>
    (query.scope !== 'favorites' || w.favorite) && (query.scope !== 'recent' || !!w.visitedAt)
    && (query.group === 'all' || (query.group === 'ungrouped' ? w.groupIds.length === 0 : w.groupIds.includes(query.group)))
    && (query.status === 'archived' ? w.archived : !w.archived && (query.status === 'all' || w.status === query.status))
    && `${w.name} ${w.description}`.toLocaleLowerCase().includes(term)
  ).sort((a, b) => query.sort === 'name' ? a.name.localeCompare(b.name, 'zh-CN') : (query.sort === 'visited' ? (b.visitedAt || 0) - (a.visitedAt || 0) : b.updatedAt - a.updatedAt));
}
