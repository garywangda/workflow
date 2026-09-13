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
  } catch { return { data: emptyLibrary(), error: 'Unable to read saved workflows. Your data has not been overwritten. Retry or check browser storage.' }; }
}
export function sampleLibrary(): LibraryData {
  const now = Date.now();
  const groups = [{ id: 'supplies', name: 'Supplies' }, { id: 'onboarding', name: 'Onboarding' }, { id: 'maintenance', name: 'Maintenance' }, { id: 'delivery', name: 'Delivery' }];
  const rows: [string, string, string[], string, WorkflowStatus][] = [
    ['Supply request', 'Request, approve, and collect supplies', ['supplies', 'onboarding'], 'Alex Lin', 'published'],
    ['New employee onboarding', 'Prepare for onboarding and the first week', ['onboarding'], 'Taylor Chen', 'changes'],
    ['Equipment inspection', 'Schedule inspections and resolve issues', ['maintenance'], 'Jordan Zhou', 'published'],
    ['Project delivery', 'Prepare, accept, and archive deliverables', ['delivery'], 'Sam Xu', 'draft'],
    ['Purchase confirmation', 'Review requirements and confirm purchases', ['supplies'], 'Alex Lin', 'published'],
    ['Service issue resolution', 'Receive feedback and follow up on resolution', [], 'Taylor Chen', 'draft'],
  ];
  return { version: 1, groups, workflows: rows.map(([name, description, groupIds, owner, status], i) => ({ id: `sample-${i}`, name, description, groupIds, owner, status, archived: false, favorite: false, updatedAt: now - i * 86400000 })) };
}
export function groupNameError(name: string, groups: Group[], except?: string) {
  if (!name.trim()) return 'Enter a group name';
  if (groups.some(g => g.id !== except && g.name === name.trim())) return 'A group with this name already exists';
  return '';
}
export function selectWorkflows(data: LibraryData, query: { scope: Scope; group: string; search: string; status: string; sort: string }) {
  const term = query.search.trim().toLocaleLowerCase();
  return data.workflows.filter(w =>
    (query.scope !== 'favorites' || w.favorite) && (query.scope !== 'recent' || !!w.visitedAt)
    && (query.group === 'all' || (query.group === 'ungrouped' ? w.groupIds.length === 0 : w.groupIds.includes(query.group)))
    && (query.status === 'archived' ? w.archived : !w.archived && (query.status === 'all' || w.status === query.status))
    && `${w.name} ${w.description}`.toLocaleLowerCase().includes(term)
  ).sort((a, b) => query.sort === 'name' ? a.name.localeCompare(b.name, 'en') : (query.sort === 'visited' ? (b.visitedAt || 0) - (a.visitedAt || 0) : b.updatedAt - a.updatedAt));
}
