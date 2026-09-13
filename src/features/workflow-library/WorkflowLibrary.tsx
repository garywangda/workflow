import { useEffect, useRef, useState } from 'react';
import { Grid2X2, List, Search, Star, Plus, MoreHorizontal, FolderOpen, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LibraryDialog } from './LibraryDialog';
import { FileForm } from './FileForm';
import { copyDocument } from './document';
import { groupNameError, LIBRARY_KEY, VIEW_KEY, loadLibrary, sampleLibrary, selectWorkflows, type Group, type LibraryData, type Scope, type WorkflowFile } from './model';
import './workflow-library.css';

const statuses = { draft: '未发布', published: '已发布', changes: '有未发布修改' };
const scopes: [Scope, string][] = [['all', '全部流程'], ['recent', '最近访问'], ['favorites', '收藏']];
const dateLabel = (time: number) => new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(time);

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
    catch { setSaveError('保存失败，修改尚未保存。请检查浏览器存储空间后重试。'); return false; }
  }
  function patchFile(file: WorkflowFile, patch: Partial<WorkflowFile>) {
    return commit({ ...data, workflows: data.workflows.map(w => w.id === file.id ? { ...w, ...patch } : w) });
  }
  function changeView(next: string) {
    setView(next);
    try { localStorage.setItem(VIEW_KEY, next); } catch { setNotice('显示方式已切换，本次偏好未能保存。'); }
  }
  function openFile(file: WorkflowFile) {
    if (patchFile(file, { visitedAt: Date.now() })) {
      if (onOpen) onOpen(file); else setNotice('流程编辑器入口尚未连接。');
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
    return <div className="library-tags">{names.length ? <>{names.slice(0, 2).map(g => <button key={g.id} onClick={() => setGroup(g.id)}>{g.name}</button>)}{names.length > 2 && <button title={names.map(g => g.name).join('、')} onClick={() => setEditingFile(file)}>＋{names.length - 2}</button>}</> : <span className="library-muted">未分组</span>}</div>;
  }
  function actions(file: WorkflowFile) {
    return <div className="library-file-actions">
      <Button variant="ghost" size="icon" aria-label={`${file.favorite ? '取消收藏' : '收藏'} ${file.name}`} onClick={() => patchFile(file, { favorite: !file.favorite })}><Star size={16} fill={file.favorite ? 'currentColor' : 'none'} /></Button>
      <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={`更多 ${file.name}`}><MoreHorizontal size={18} /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setEditingFile(file)}>编辑信息 / 设置 Group</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => { const copy = { ...file, id: crypto.randomUUID(), name: `${file.name} 副本`, status: 'draft' as const, archived: false, favorite: false, visitedAt: undefined, updatedAt: Date.now() }; try { copyDocument(file.id, copy.id); if (commit({ ...data, workflows: [...data.workflows, copy] })) setNotice('已创建独立副本。'); } catch { setSaveError('复制失败，原流程没有变化。'); } }}>复制流程</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => patchFile(file, { archived: !file.archived })}>{file.archived ? '恢复流程' : '归档流程'}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>;
  }
  return <div className="workflow-library">
    <aside className="library-sidebar"><div className="library-brand">Workflow</div><span className="library-muted">工作空间</span>
      <nav aria-label="全局导航"><button aria-current="page">流程</button>{['任务', '看板', '甘特图'].map(label => <button key={label} disabled title="后续开放">{label}</button>)}</nav>
      <div className="library-sidebar-footer"><span>设置与帮助</span><small>本地工作空间</small></div>
    </aside>
    <main className="library-main" aria-label="流程库">
      <header className="library-header"><div><h1>流程库</h1><p>把重复的工作，整理成清晰的流程。</p></div><div className="library-header-actions"><Button variant="ghost" onClick={() => { setManage(true); setFormError(''); }}>管理 Group</Button><Button className="library-primary" onClick={() => setEditingFile('new')} disabled={!!loaded.error}><Plus size={16} />新建流程</Button></div></header>
      {loaded.error && <div role="alert" className="library-error">{loaded.error}<Button variant="outline" onClick={() => { const next = loadLibrary(); setLoaded(next); setData(next.data); }}>重试</Button></div>}
      {saveError && <div role="alert" className="library-error">{saveError}</div>}
      {notice && <div role="status" className="library-notice">{notice}<Button variant="ghost" size="icon" aria-label="关闭提示" onClick={() => setNotice('')}><X size={16} /></Button></div>}
      <div role="tablist" aria-label="查看范围" className="library-tabs">{scopes.map(([value, label]) => <button key={value} role="tab" aria-selected={scope === value} onClick={() => { setScope(value); setSort(value === 'recent' ? 'visited' : 'updated'); }}>{label}</button>)}</div>
      <div className="library-toolbar">
        <div className="library-search"><input type="search" aria-label="搜索流程" placeholder="搜索流程名称或说明…" value={search} onCompositionStart={() => { searchBeforeComposition.current = search; setComposing(true); }} onCompositionEnd={() => setComposing(false)} onChange={e => setSearch(e.target.value)} /><Search size={17} aria-hidden="true" /></div>
        <select aria-label="Group 筛选" value={group} onChange={e => setGroup(e.target.value)}><option value="all">不限 Group</option><option value="ungrouped">未分组</option>{data.groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select>
        <select aria-label="状态筛选" value={status} onChange={e => setStatus(e.target.value)}><option value="all">全部状态</option>{Object.entries(statuses).map(([v, label]) => <option key={v} value={v}>{label}</option>)}<option value="archived">已归档</option></select>
        <select aria-label="排序" className="library-sort" value={sort} onChange={e => setSort(e.target.value)}><option value="updated">最近修改 ↓</option><option value="visited">最近打开 ↓</option><option value="name">名称 A—Z</option></select>
        <div className="library-view" role="group" aria-label="显示方式"><button aria-label="卡片" aria-pressed={view === 'cards'} onClick={() => changeView('cards')}><Grid2X2 size={20} /></button><button aria-label="列表" aria-pressed={view === 'list'} onClick={() => changeView('list')}><List size={20} /></button></div>
      </div>
      <div className="library-summary" aria-live="polite"><span>{group !== 'all' ? `${group === 'ungrouped' ? '未分组' : data.groups.find(g => g.id === group)?.name} · ` : ''}{results.length} 个流程</span>{(search || group !== 'all' || status !== 'all') && <button onClick={() => { setSearch(''); setGroup('all'); setStatus('all'); }}>清除筛选</button>}</div>
      {!loaded.error && !data.workflows.length ? <div className="library-empty"><FolderOpen size={36} /><h2>从第一份流程开始</h2><p>为重复的工作建立清晰的步骤，按工作内容创建自己的 Group。</p><Button className="library-primary" onClick={() => setEditingFile('new')}>新建流程</Button>{!data.groups.length && <Button variant="ghost" onClick={() => commit(sampleLibrary())}>载入示例流程</Button>}</div>
        : !loaded.error && !results.length ? <div className="library-empty"><Search size={32} /><h2>{scope === 'favorites' && !search && group === 'all' ? '还没有收藏流程' : scope === 'recent' && !search && group === 'all' ? '还没有访问记录' : '没有符合当前条件的流程'}</h2><p>试试其他查找范围，或清除筛选条件。</p></div>
        : view === 'cards' ? <div className="library-grid">{results.map(file => <article className="library-card" key={file.id}>
          <button className="library-preview" aria-label={`预览 ${file.name}`} onClick={() => openFile(file)}><img src="/figma/workflow-preview.svg" alt="流程示意预览" /></button>
          <div className="library-card-content"><button className="library-file-title" aria-label={`打开 ${file.name}`} onClick={() => openFile(file)}><strong>{file.name}</strong><span>{file.description || '暂无说明'}</span></button>{tags(file)}<div className="library-card-footer"><span>{file.owner || '未设置'} · {dateLabel(file.updatedAt)}</span>{actions(file)}</div></div>
        </article>)}</div> : <div className="library-table-scroll"><table className="library-table"><thead><tr><th>流程名称</th><th>Group</th><th>维护负责人</th><th>发布状态</th><th>最近修改</th><th><span className="sr-only">更多操作</span></th></tr></thead><tbody>{results.map(file => <tr key={file.id}><td><button className="library-file-title" aria-label={`打开 ${file.name}`} onClick={() => openFile(file)}><strong>{file.name}</strong><span>{file.description || '暂无说明'}</span></button></td><td>{tags(file)}</td><td>{file.owner || '未设置'}</td><td><span className={`library-status ${file.status === 'published' ? 'is-published' : ''}`}>{file.archived ? '已归档' : statuses[file.status]}</span></td><td>{dateLabel(file.updatedAt)}</td><td>{actions(file)}</td></tr>)}</tbody></table></div>}
      <footer className="library-footer">数据保存在当前浏览器中 · 卡片图片为流程示意</footer>
    </main>
    {manage && <LibraryDialog drawer title="管理 Group" description="按工作内容组织流程。一个流程可加入多个 Group。" closeLabel="关闭 Group 管理" onClose={() => setManage(false)}>
      <div className="library-group-list">{data.groups.map(g => <div className="library-group-row" key={g.id}><span>{g.name}</span><small>{data.workflows.filter(w => w.groupIds.includes(g.id)).length} 个流程</small><Button variant="ghost" size="sm" aria-label={`重命名 ${g.name}`} onClick={() => { setEditingGroup(g); setGroupName(g.name); setFormError(''); }}>改名</Button><Button variant="ghost" size="sm" aria-label={`删除 ${g.name}`} onClick={() => setDeletingGroup(g)}>删除</Button></div>)}{!data.groups.length && <p className="library-muted">还没有 Group，可以先创建一个。</p>}</div>
      <form onSubmit={saveGroup} className="library-form"><h3>{editingGroup ? '重命名 Group' : '新建 Group'}</h3><label htmlFor="group-name">Group 名称</label><input id="group-name" value={groupName} onChange={e => { setGroupName(e.target.value); setFormError(''); }} maxLength={80} />{(formError || saveError) && <p role="alert">{formError || saveError}</p>}<div className="library-form-actions">{editingGroup && <Button type="button" variant="ghost" onClick={() => { setEditingGroup(null); setGroupName(''); }}>取消</Button>}<Button className="library-primary" type="submit" disabled={!!loaded.error}>{editingGroup ? '保存名称' : '创建 Group'}</Button></div></form>
    </LibraryDialog>}
    {deletingGroup && <LibraryDialog title={`删除 ${deletingGroup.name}`} description={`移除这个 Group，保留其中的 ${data.workflows.filter(w => w.groupIds.includes(deletingGroup.id)).length} 个流程及其他 Group 关联。`} onClose={() => setDeletingGroup(null)}><div className="library-form-actions"><Button variant="outline" onClick={() => setDeletingGroup(null)}>取消</Button><Button variant="destructive" onClick={removeGroup}>确认删除 Group</Button></div></LibraryDialog>}
    {editingFile && <FileForm saveError={saveError} file={editingFile} groups={data.groups} initialGroup={group} onClose={() => setEditingFile(null)} onSave={file => { const isNew = editingFile === 'new'; if (commit({ ...data, workflows: isNew ? [...data.workflows, file] : data.workflows.map(w => w.id === file.id ? file : w) })) { setEditingFile(null); if (isNew && onOpen) onOpen(file); } }} />}
  </div>;
}
