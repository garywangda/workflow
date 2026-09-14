import { useEffect, useRef, useState } from 'react';
import { bindForm, componentType, formInputs, renderSchema, saveFormVersion, type FieldBinding, type FormAsset, type FormComponent } from './model';
import { Button } from '@/components/ui/button';

export const FORMS_KEY = 'workflow.forms.v1';
export function readForms(): FormAsset[] {
  const forms = JSON.parse(localStorage.getItem(FORMS_KEY) ?? '[]') as FormAsset[];
  if (!Array.isArray(forms) || forms.some(f => !f.id || !f.name || !Number.isInteger(f.version) || !Array.isArray(f.bindings) || !Array.isArray(f.schema?.components))) throw new Error('Saved forms cannot be read. Existing data has not been overwritten.');
  return forms;
}

export function FormDesigner({ form, fields, onSave, onClose }: { form: FormAsset; fields: FieldBinding[]; onSave: (form: FormAsset) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(() => bindForm(form));
  const frame = useRef<HTMLIFrameElement>(null);
  const currentDraft = useRef(draft);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { currentDraft.current = draft; }, [draft]);
  useEffect(() => {
    frame.current?.contentWindow?.postMessage({ type: 'workflow-form-init', preview, schema: preview ? renderSchema(currentDraft.current) : currentDraft.current.schema }, location.origin);
  }, [preview]);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || event.origin !== location.origin) return;
      if (event.data?.type === 'workflow-form-change') update(event.data.payload);
      if (event.data?.type === 'workflow-form-error') setError(String(event.data.payload));
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, []);
  const update = (schema: { components?: unknown[] }) => {
    const components = (schema.components ?? []) as FormComponent[];
    setDraft(current => ({ ...current, schema: { components }, bindings: formInputs(components).map(input => {
      const previous = current.bindings.find(b => b.key === input.key);
      return previous ? { ...previous, name: input.label ?? input.key } : { key: input.key, fieldId: crypto.randomUUID(), name: input.label ?? input.key, type: componentType(input), access: 'write', required: Boolean((input.validate as { required?: boolean })?.required) };
    }) }));
  };
  const save = () => {
    try {
      const saved = readForms();
      const latest = saved.filter(f => f.id === draft.id).sort((a, b) => b.version - a.version)[0];
      const next = saveFormVersion(latest, draft);
      for (const input of formInputs(next.schema.components)) {
        if (input.type === 'datagrid' && formInputs(input.components ?? []).some(c => c.type === 'datagrid')) throw new Error('Only one level of detail rows is supported');
        const binding = next.bindings.find(b => b.key === input.key);
        if (!binding || binding.type !== componentType(input)) throw new Error(`Choose a compatible field for ${input.label ?? input.key}`);
      }
      localStorage.setItem(FORMS_KEY, JSON.stringify([...saved, next]));
      onSave(next);
      onClose();
    } catch (cause) { setError((cause as Error).message); }
  };
  return <div className="phase2-modal" role="dialog" aria-modal="true" aria-label="Form designer" onKeyDown={e => { e.stopPropagation(); if (e.key === 'Escape') onClose(); }}>
    <header><label>Form name<input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} /></label><span>Version {draft.version} · changes save as a new version</span><Button variant="outline" onClick={() => setPreview(v => !v)}>{preview ? 'Design' : 'Preview'}</Button><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={save}>Save form</Button></header>
    {error && <p role="alert">{error}</p>}
    <div className="phase2-form-layout"><iframe className="phase2-form-surface" ref={frame} title="Visual form editor" src={`${import.meta.env.BASE_URL}form-designer.html`} onLoad={() => frame.current?.contentWindow?.postMessage({ type: 'workflow-form-init', preview, schema: preview ? renderSchema(draft) : draft.schema }, location.origin)} />
      <aside><h2>Data bindings</h2><p>Each input uses a stable workflow field. New fields are created automatically; select an existing compatible field to reuse it.</p><p>Files, people and submissions need storage and directory services before live execution. Preview does not start a workflow.</p>
        {draft.bindings.map((binding, index) => <fieldset key={binding.key}><legend>{binding.name}</legend><label>Data field<select value={binding.fieldId} onChange={e => { const field = fields.find(f => f.fieldId === e.target.value); if (field) setDraft({ ...draft, bindings: draft.bindings.map((b, i) => i === index ? { ...b, fieldId: field.fieldId, type: field.type } : b) }); }}><option value={binding.fieldId}>{binding.name} ({binding.type})</option>{fields.filter(f => f.type === binding.type && f.fieldId !== binding.fieldId).map(f => <option key={f.fieldId} value={f.fieldId}>{f.name} ({f.type})</option>)}</select></label><label>Access<select value={binding.access} onChange={e => setDraft({ ...draft, bindings: draft.bindings.map((b, i) => i === index ? { ...b, access: e.target.value as FieldBinding['access'] } : b) })}><option value="write">Editable</option><option value="read">Read only</option><option value="hidden">Hidden</option></select></label><label><input type="checkbox" checked={binding.required} onChange={e => setDraft({ ...draft, bindings: draft.bindings.map((b, i) => i === index ? { ...b, required: e.target.checked } : b) })} /> Required at this step</label></fieldset>)}
      </aside></div>
  </div>;
}
