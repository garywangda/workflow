import { useEffect, useRef, useState } from 'react';
import { Grid2X2, List, Search, Star, Plus, MoreHorizontal, FolderOpen, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LibraryDialog } from './LibraryDialog';
import { FileForm } from './FileForm';
import { copyDocument } from './document';
import { groupNameError, LIBRARY_KEY, VIEW_KEY, loadLibrary, sampleLibrary, selectWorkflows, type Group, type LibraryData, type Scope, type WorkflowFile } from './model';
import './workflow-library.css';

const statuses = { draft: 'Unpublished', published: 'Published', changes: 'Unpublished changes' };
const scopes: [Scope, string][] = [['all', 'All workflows'], ['recent', 'Recently viewed'], ['favorites', 'Favorites']];
const dateLabel = (time: number) => new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(time);

export function WorkflowLibrary({ onOpen, revision = 0 }: { onOpen?: (file: WorkflowFile) => void; revision?: number }) {
  const [loaded, setLoaded] = useState(loadLibrary);
  const [data, setData] = useState(loaded.data);
  const [saveError, setSaveError] = useState('');
  useEffect(() => { const next = loadLibrary(); setLoaded(next); setData(next.data); }, [revision]);
  const [scope, setScope] = useState<Scope>('all');
  const [group, setGroup] = useState('all');
  const [search, setSearch] = useState('');
  const [composing, setComposing] = useState(false);
  const searchBeforeComposition = useRef('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('updated');
  const [view, setView] = useState(() => { try { return localStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'cards'; } catch { return 'cards'; } });
  const [manage, setManage] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<Group | null>(null);
  const [formError, setFormError] = useState('');
  const [editingFile, setEditingFile] = useState<WorkflowFile | 'new' | null>(null);
  const [notice, setNotice] = useState('');
  const results = selectWorkflows(data, { scope, group, search: composing ? searchBeforeComposition.current : search, status, sort });
  function commit(next: LibraryData) {
    if (loaded.error) return false;
    try { localStorage.setItem(LIBRARY_KEY, JSON.stringify(next)); setData(next); setSaveError(''); return true; }
    catch { setSaveError('Save failed. Your changes have not been saved. Check browser storage and try again.'); return false; }
  }
  function patchFile(file: WorkflowFile, patch: Partial<WorkflowFile>) {
    return commit({ ...data, workflows: data.workflows.map(w => w.id === file.id ? { ...w, ...patch } : w) });
  }
  function changeView(next: string) {
    setView(next);
    try { localStorage.setItem(VIEW_KEY, next); } catch { setNotice('View changed, but the preference could not be saved.'); }
  }
  function openFile(file: WorkflowFile) {
    if (patchFile(file, { visitedAt: Date.now() })) {
      if (onOpen) onOpen(file); else setNotice('The workflow editor is not connected yet.');
    }
  }
  function saveGroup(event: React.FormEvent) {
    event.preventDefault();
    const error = groupNameError(groupName, data.groups, editingGroup?.id);
    if (error) { setFormError(error); return; }
    const groups = editingGroup ? data.groups.map(g => g.id === editingGroup.id ? { ...g, name: groupName.trim() } : g) : [...data.groups, { id: crypto.randomUUID(), name: groupName.trim() }];
    if (commit({ ...data, groups })) { setGroupName(''); setEditingGroup(null); setFormError(''); }
  }
  function removeGroup() {
    if (!deletingGroup) return;
    if (commit({ ...data, groups: data.groups.filter(g => g.id !== deletingGroup.id), workflows: data.workflows.map(w => ({ ...w, groupIds: w.groupIds.filter(id => id !== deletingGroup.id) })) })) {
      if (group === deletingGroup.id) setGroup('all');
      if (editingGroup?.id === deletingGroup.id) { setEditingGroup(null); setGroupName(''); }
      setDeletingGroup(null);
    }
  }
  function tags(file: WorkflowFile) {
    const names = file.groupIds.map(id => data.groups.find(g => g.id === id)).filter((g): g is Group => !!g);
    return <div className="library-tags">{names.length ? <>{names.slice(0, 2).map(g => <button key={g.id} onClick={() => setGroup(g.id)}>{g.name}</button>)}{names.length > 2 && <button title={names.map(g => g.name).join('、')} onClick={() => setEditingFile(file)}>＋{names.length - 2}</button>}</> : <span className="library-muted">Ungrouped</span>}</div>;
  }
  function actions(file: WorkflowFile) {
    return <div className="library-file-actions">
      <Button variant="ghost" size="icon" aria-label={`${file.favorite ? 'Unfavorite' : 'Favorite'} ${file.name}`} onClick={() => patchFile(file, { favorite: !file.favorite })}><Star size={16} fill={file.favorite ? 'currentColor' : 'none'} /></Button>
      <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={`More actions for ${file.name}`}><MoreHorizontal size={18} /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setEditingFile(file)}>Edit details / Groups</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => { const copy = { ...file, id: crypto.randomUUID(), name: `${file.name} copy`, status: 'draft' as const, archived: false, favorite: false, visitedAt: undefined, updatedAt: Date.now() }; try { copyDocument(file.id, copy.id); if (commit({ ...data, workflows: [...data.workflows, copy] })) setNotice('An independent copy has been created.'); } catch { setSaveError('Copy failed. The original workflow is unchanged.'); } }}>Duplicate workflow</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => patchFile(file, { archived: !file.archived })}>{file.archived ? 'Restore workflow' : 'Archive workflow'}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>;
  }
  return <div className="workflow-library">
    <aside className="library-sidebar"><div className="library-brand">Workflow</div>
      <nav aria-label="Main navigation"><button aria-current="page">Workflows</button>{['Tasks', 'Boards', 'Gantt'].map(label => <button key={label} disabled title="Coming soon">{label}</button>)}</nav>
      <div className="library-sidebar-footer"><span>Settings & help</span></div>
    </aside>
    <main className="library-main" aria-label="Workflow library">
      <header className="library-header"><div><h1>Workflow library</h1></div><div className="library-header-actions"><Button variant="ghost" onClick={() => { setManage(true); setFormError(''); }}>Manage groups</Button><Button className="library-primary" onClick={() => setEditingFile('new')} disabled={!!loaded.error}><Plus size={16} />New workflow</Button></div></header>
      {loaded.error && <div role="alert" className="library-error">{loaded.error}<Button variant="outline" onClick={() => { const next = loadLibrary(); setLoaded(next); setData(next.data); }}>Retry</Button></div>}
      {saveError && <div role="alert" className="library-error">{saveError}</div>}
      {notice && <div role="status" className="library-notice">{notice}<Button variant="ghost" size="icon" aria-label="Dismiss notification" onClick={() => setNotice('')}><X size={16} /></Button></div>}
      <div role="tablist" aria-label="Library views" className="library-tabs">{scopes.map(([value, label]) => <button key={value} role="tab" aria-selected={scope === value} onClick={() => { setScope(value); setSort(value === 'recent' ? 'visited' : 'updated'); }}>{label}</button>)}</div>
      <div className="library-toolbar">
        <div className="library-search"><input type="search" aria-label="Search workflows" placeholder="Search workflows by name or description…" value={search} onCompositionStart={() => { searchBeforeComposition.current = search; setComposing(true); }} onCompositionEnd={() => setComposing(false)} onChange={e => setSearch(e.target.value)} /><Search size={17} aria-hidden="true" /></div>
        <select aria-label="Filter by group" value={group} onChange={e => setGroup(e.target.value)}><option value="all">All groups</option><option value="ungrouped">Ungrouped</option>{data.groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select>
        <select aria-label="Filter by status" value={status} onChange={e => setStatus(e.target.value)}><option value="all">All statuses</option>{Object.entries(statuses).map(([v, label]) => <option key={v} value={v}>{label}</option>)}<option value="archived">Archived</option></select>
        <select aria-label="Sort" className="library-sort" value={sort} onChange={e => setSort(e.target.value)}><option value="updated">Last modified ↓</option><option value="visited">Last opened ↓</option><option value="name">Name A–Z</option></select>
        <div className="library-view" role="group" aria-label="Display mode"><button aria-label="Cards" aria-pressed={view === 'cards'} onClick={() => changeView('cards')}><Grid2X2 size={20} /></button><button aria-label="List" aria-pressed={view === 'list'} onClick={() => changeView('list')}><List size={20} /></button></div>
      </div>
      <div className="library-summary" aria-live="polite"><span>{group !== 'all' ? `${group === 'ungrouped' ? 'Ungrouped' : data.groups.find(g => g.id === group)?.name} · ` : ''}{results.length} workflows</span>{(search || group !== 'all' || status !== 'all') && <button onClick={() => { setSearch(''); setGroup('all'); setStatus('all'); }}>Clear filters</button>}</div>
      {!loaded.error && !data.workflows.length ? <div className="library-empty"><FolderOpen size={36} /><h2>Create your first workflow</h2><p>Create a workflow to get started.</p><Button className="library-primary" onClick={() => setEditingFile('new')}>New workflow</Button>{!data.groups.length && <Button variant="ghost" onClick={() => commit(sampleLibrary())}>Load sample workflows</Button>}</div>
        : !loaded.error && !results.length ? <div className="library-empty"><Search size={32} /><h2>{scope === 'favorites' && !search && group === 'all' ? 'No favorites yet' : scope === 'recent' && !search && group === 'all' ? 'No recently viewed workflows' : 'No workflows match your filters'}</h2><p>Try another view or clear your filters.</p></div>
        : view === 'cards' ? <div className="library-grid">{results.map(file => <article className="library-card" key={file.id}>
          <button className="library-preview" aria-label={`Preview ${file.name}`} onClick={() => openFile(file)}><img src="/figma/workflow-preview.svg" alt="Workflow illustration" /></button>
          <div className="library-card-content"><button className="library-file-title" aria-label={`Open ${file.name}`} onClick={() => openFile(file)}><strong>{file.name}</strong><span>{file.description || 'No description'}</span></button>{tags(file)}<div className="library-card-footer"><span>{file.owner || 'Unassigned'} · {dateLabel(file.updatedAt)}</span>{actions(file)}</div></div>
        </article>)}</div> : <div className="library-table-scroll"><table className="library-table"><thead><tr><th>Workflow name</th><th>Group</th><th>Owner</th><th>Status</th><th>Last modified</th><th><span className="sr-only">More actions</span></th></tr></thead><tbody>{results.map(file => <tr key={file.id}><td><button className="library-file-title" aria-label={`Open ${file.name}`} onClick={() => openFile(file)}><strong>{file.name}</strong><span>{file.description || 'No description'}</span></button></td><td>{tags(file)}</td><td>{file.owner || 'Unassigned'}</td><td><span className={`library-status ${file.status === 'published' ? 'is-published' : ''}`}>{file.archived ? 'Archived' : statuses[file.status]}</span></td><td>{dateLabel(file.updatedAt)}</td><td>{actions(file)}</td></tr>)}</tbody></table></div>}

    </main>
    {manage && <LibraryDialog drawer title="Manage groups" description="Organize workflows into groups. A workflow can belong to multiple groups." closeLabel="Close group manager" onClose={() => setManage(false)}>
      <div className="library-group-list">{data.groups.map(g => <div className="library-group-row" key={g.id}><span>{g.name}</span><small>{data.workflows.filter(w => w.groupIds.includes(g.id)).length} workflows</small><Button variant="ghost" size="sm" aria-label={`Rename ${g.name}`} onClick={() => { setEditingGroup(g); setGroupName(g.name); setFormError(''); }}>Rename</Button><Button variant="ghost" size="sm" aria-label={`Delete ${g.name}`} onClick={() => setDeletingGroup(g)}>Delete</Button></div>)}{!data.groups.length && <p className="library-muted">No groups yet. Create one below.</p>}</div>
      <form onSubmit={saveGroup} className="library-form"><h3>{editingGroup ? 'Rename group' : 'New group'}</h3><label htmlFor="group-name">Group name</label><input id="group-name" value={groupName} onChange={e => { setGroupName(e.target.value); setFormError(''); }} maxLength={80} />{(formError || saveError) && <p role="alert">{formError || saveError}</p>}<div className="library-form-actions">{editingGroup && <Button type="button" variant="ghost" onClick={() => { setEditingGroup(null); setGroupName(''); }}>Cancel</Button>}<Button className="library-primary" type="submit" disabled={!!loaded.error}>{editingGroup ? 'Save name' : 'Create group'}</Button></div></form>
    </LibraryDialog>}
    {deletingGroup && <LibraryDialog title={`Delete ${deletingGroup.name}`} description={`Delete this group and keep its ${data.workflows.filter(w => w.groupIds.includes(deletingGroup.id)).length} workflows and their other group associations.`} onClose={() => setDeletingGroup(null)}><div className="library-form-actions"><Button variant="outline" onClick={() => setDeletingGroup(null)}>Cancel</Button><Button variant="destructive" onClick={removeGroup}>Delete group</Button></div></LibraryDialog>}
    {editingFile && <FileForm saveError={saveError} file={editingFile} groups={data.groups} initialGroup={group} onClose={() => setEditingFile(null)} onSave={file => { const isNew = editingFile === 'new'; if (commit({ ...data, workflows: isNew ? [...data.workflows, file] : data.workflows.map(w => w.id === file.id ? file : w) })) { setEditingFile(null); if (isNew && onOpen) onOpen(file); } }} />}
  </div>;
}
