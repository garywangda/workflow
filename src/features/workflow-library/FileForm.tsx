import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LibraryDialog } from './LibraryDialog';
import type { Group, WorkflowFile } from './model';
export function FileForm({ file, groups, initialGroup, saveError, onClose, onSave }: { file: WorkflowFile | 'new'; groups: Group[]; initialGroup: string; saveError?: string; onClose: () => void; onSave: (file: WorkflowFile) => void }) {
  const [name, setName] = useState(file === 'new' ? '' : file.name);
  const [description, setDescription] = useState(file === 'new' ? '' : file.description);
  const [owner, setOwner] = useState(file === 'new' ? '' : file.owner);
  const [groupIds, setGroupIds] = useState(file === 'new' ? groups.filter(g => g.id === initialGroup).map(g => g.id) : file.groupIds);
  const [error, setError] = useState('');
  return <LibraryDialog title={file === 'new' ? 'New workflow' : 'Edit workflow details'} description="A workflow can belong to multiple groups." onClose={onClose}><form className="library-form" onSubmit={e => { e.preventDefault(); if (!name.trim()) { setError('Enter a workflow name'); return; } onSave({ ...(file === 'new' ? { id: crypto.randomUUID(), status: 'draft' as const, favorite: false, archived: false, visitedAt: Date.now() } : file), name: name.trim(), description: description.trim(), owner: owner.trim(), groupIds, updatedAt: Date.now() }); }}>
    <label htmlFor="file-name">Workflow name</label><input id="file-name" value={name} maxLength={120} onChange={e => setName(e.target.value)} />
    <label htmlFor="file-description">Description</label><textarea id="file-description" value={description} maxLength={500} onChange={e => setDescription(e.target.value)} />
    <label htmlFor="file-owner">Owner</label><input id="file-owner" value={owner} maxLength={80} onChange={e => setOwner(e.target.value)} />
    <fieldset><legend>Groups (select multiple)</legend>{groups.map(g => <label className="library-group-choice" key={g.id}><input type="checkbox" checked={groupIds.includes(g.id)} onChange={e => setGroupIds(e.target.checked ? [...groupIds, g.id] : groupIds.filter(id => id !== g.id))} />{g.name}</label>)}{!groups.length && <p className="library-muted">You can create groups later in Manage groups.</p>}</fieldset>
    {(error || saveError) && <p role="alert">{error || saveError}</p>}<div className="library-form-actions"><Button variant="outline" type="button" onClick={onClose}>Cancel</Button><Button className="library-primary" type="submit">{file === 'new' ? 'Create workflow' : 'Save changes'}</Button></div>
  </form></LibraryDialog>;
}
