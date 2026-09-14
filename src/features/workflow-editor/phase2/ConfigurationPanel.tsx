import { useContext, useState } from 'react';
import { useEdges, useNodes, useReactFlow } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { DocumentContext } from '../../workflow-library/DocumentContext';
import { LIBRARY_KEY, loadLibrary } from '../../workflow-library/model';
import type { WorkflowNode } from '../types/workflow-node';
import { FormDesigner, readForms } from './FormDesigner';
import { PRESETS, bindForm, emptyForm, evaluateCondition, publishVersion, validateWorkflow, workflowFields, type FormAsset, type Issue, type PublishedVersion } from './model';
import './phase2.css';

export function ConfigurationPanel({ node }: { node?: WorkflowNode }) {
  const nodes = useNodes();
  const edges = useEdges();
  const { updateNodeData, setNodes, setEdges } = useReactFlow();
  const session = useContext(DocumentContext);
  const [designing, setDesigning] = useState<FormAsset | null>(null);
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [message, setMessage] = useState('');
  const [forms, setForms] = useState<FormAsset[]>([]);
  const [sampleValue, setSampleValue] = useState('');
  const config = node?.data.config ?? {};
  const preset = String(config.presetId ?? '');
  const fields = workflowFields(nodes);
  const form = config.form as FormAsset | undefined;
  const update = (key: string, value: unknown) => {
    if (!node) return;
    updateNodeData(node.id, { config: { ...config, [key]: value }, configStatus: 'Needs check' });
    setIssues(null);
  };
  const input = (label: string, key: string, type = 'text', help?: string) => <label>{label}<input type={type} value={String(config[key] ?? '')} onChange={e => update(key, type === 'number' ? e.target.value === '' ? '' : Number(e.target.value) : e.target.value)} />{help && <small>{help}</small>}</label>;
  const select = (label: string, key: string, options: [string, string][]) => <label>{label}<select value={String(config[key] ?? '')} onChange={e => update(key, e.target.value)}><option value="">Select…</option>{options.map(([value, text]) => <option value={value} key={value}>{text}</option>)}</select></label>;
  const text = (label: string, key: string) => <label>{label}<textarea value={String(config[key] ?? '')} onChange={e => update(key, e.target.value)} /></label>;
  const toggle = (label: string, key: string) => <label><input type="checkbox" checked={Boolean(config[key])} onChange={e => update(key, e.target.checked)} /> {label}</label>;
  const check = () => { const found = validateWorkflow({ nodes, edges }); setIssues(found); setMessage(found.length ? '' : 'Configuration checks passed. Live execution is not available yet.'); return found; };
  const publish = () => {
    if (check().length || !session?.id) return;
    try {
      const key = `workflow.versions.${session.id}`;
      const history = JSON.parse(localStorage.getItem(key) ?? '[]') as PublishedVersion[];
      if (!Array.isArray(history)) throw new Error('Unable to read version history');
      const version = publishVersion({ nodes, edges }, history);
      const library = loadLibrary();
      if (library.error) throw new Error(library.error);
      localStorage.setItem(key, JSON.stringify([...history, version]));
      localStorage.setItem(LIBRARY_KEY, JSON.stringify({ ...library.data, workflows: library.data.workflows.map(f => f.id === session.id ? { ...f, status: 'published', updatedAt: Date.now() } : f) }));
      setMessage(`Published design version ${version.version}. New edits remain in the draft. Live execution is not available yet.`);
    } catch (error) { setMessage(`Publish failed: ${(error as Error).message}`); }
  };
  const people = <>{select('People source', 'assignmentSource', [['person', 'Fixed people'], ['role', 'Business role'], ['field', 'Person field']])}{config.assignmentSource === 'field' ? select('Person field', 'assignees', fields.filter(f => f.type === 'person').map(f => [f.fieldId, f.name])) : input(config.assignmentSource === 'role' ? 'Role identifier' : 'Person identifiers', 'assignees', 'text', 'Directory connection is not available yet. Enter stable IDs for configuration.')}<p>If nobody matches or a person is unavailable, pause for reassignment. Never skip silently.</p></>;
  return <aside className="node-inspector phase2-inspector" aria-label="Workflow inspector" onKeyDown={e => e.stopPropagation()}>
    <div className="phase2-actions"><Button variant="outline" onClick={check}>Check workflow</Button><Button onClick={publish} disabled={!session?.id}>Publish version</Button></div>
    {message && <p role="status">{message}</p>}
    {issues && <div aria-label="Workflow issues">{issues.map((issue, i) => <button className="phase2-issue" key={i} onClick={() => setNodes(current => current.map(n => ({ ...n, selected: n.id === issue.nodeId })))}>{issue.message} <small>({issue.field})</small></button>)}</div>}
    {!node ? <><h2>Workflow settings</h2><p>Select a node to configure it. Draft changes save automatically in this browser.</p><h3>Available data fields</h3>{fields.map(f => <p key={f.fieldId}>{f.name} · {f.type}</p>)}{!fields.length && <p>Create fields in a start form to make them available to later steps.</p>}</> : <>
      <h2>{PRESETS[preset]?.label ?? node.data.name}</h2>
      <label>Node name<input value={node.data.name} onChange={e => updateNodeData(node.id, { name: e.target.value })} /></label>
      <label>Description<textarea value={node.data.description} onChange={e => updateNodeData(node.id, { description: e.target.value })} /></label>
      {!preset && node.type !== 'merge' && <label>Configure legacy node as<select value="" onChange={e => { const next = PRESETS[e.target.value]; updateNodeData(node.id, { config: { ...config, ...next.defaults, presetId: e.target.value, ...(['manual', 'fillForm'].includes(e.target.value) && !form ? { form: emptyForm() } : {}) } }); }}><option value="">Choose a compatible preset…</option>{Object.entries(PRESETS).filter(([, p]) => p.type === node.type && !p.disabled).map(([id, p]) => <option key={id} value={id}>{p.label}</option>)}</select></label>}
      {node.type === 'merge' && <p>Wait for all paired branches. This is a structural join, not a separate executable preset.</p>}
      <details open><summary>Step settings</summary>
      {preset === 'manual' && <>{select('Who can start', 'initiators', [['everyone', 'Workspace members'], ['people', 'Specified people'], ['roles', 'Specified roles']])}{config.initiators !== 'everyone' && input('Permitted person or role IDs', 'initiatorIds')}{input('Run title', 'titleRule')}</>}
      {preset === 'schedule' && <>{select('Recurrence', 'recurrence', [['once', 'Once'], ['daily', 'Daily'], ['weekly', 'Weekly']])}{input('First scheduled time', 'startAt', 'datetime-local')}{input('Timezone', 'timezone')}{input('Effective until (optional)', 'endAt', 'datetime-local')}{select('When the previous run is unfinished', 'overlap', [['skip', 'Skip this occurrence'], ['allow', 'Start another run']])}<p>Scheduled starts collect no input. Add a fill-out-form step for required information. Scheduling executes in a future runtime.</p></>}
      {['fillForm', 'completeTask', 'approval', 'sendMessage'].includes(preset) && people}
      {['fillForm', 'completeTask'].includes(preset) && select('Handling mode', 'assignmentMode', [['single', 'One assignee'], ['claim', 'One candidate claims']])}
      {preset === 'completeTask' && <>{text('Work instructions', 'instructions')}{text('Checklist (one item per line)', 'checklist')}{toggle('Require completion attachment', 'evidence')}</>}
      {preset === 'approval' && <>{select('Approval rule', 'approvalRule', [['all', 'Everyone must approve'], ['any', 'Anyone may approve']])}<p>{config.approvalRule === 'any' ? 'One approval passes; all rejections reject.' : 'Every approval is required; one rejection rejects.'} Close remaining requests after the final decision.</p>{toggle('Require a reason for rejection', 'rejectionReason')}{toggle('Allow return for changes', 'returnEnabled')}{Boolean(config.returnEnabled) && <>{select('Return to', 'returnTarget', nodes.filter(n => (n.data.config as Record<string, unknown>)?.presetId === 'fillForm').map(n => [n.id, String(n.data.name)]))}<p>Resubmission starts a new review for all approvers. Previous submissions and opinions are retained.</p></>}</>}
      {preset === 'sendMessage' && <><p>Channel: in-app notification. Sending does not mean the message was read.</p>{input('Title', 'subject')}{text('Message', 'message')}</>}
      {['updateData', 'ifElse'].includes(preset) && <>{select('Workflow field', 'fieldId', fields.map(f => [f.fieldId, `${f.name} (${f.type})`]))}{preset === 'ifElse' && select('Operator', 'operator', [['equals', 'Equals'], ['notEquals', 'Does not equal'], ['greater', 'Greater than'], ['less', 'Less than'], ['empty', 'Is empty'], ['notEmpty', 'Is not empty']])}{!['empty', 'notEmpty'].includes(String(config.operator)) && input('Value', 'value')}{preset === 'updateData' && select('Write rule', 'overwrite', [['always', 'Replace current value'], ['emptyOnly', 'Only when empty']])}</>}
      {preset === 'ifElse' && <><label>Test with sample value<input value={sampleValue} onChange={e => setSampleValue(e.target.value)} /></label><p>Matched path: {evaluateCondition(sampleValue, String(config.operator), String(config.value ?? ''), fields.find(f => f.fieldId === config.fieldId)?.type ?? 'text') ? 'match' : 'default'}. Empty input is missing, never zero.</p></>}
      {preset === 'parallel' && <>{select('Paired Merge node', 'joinId', nodes.filter(n => n.type === 'merge').map(n => [n.id, String(n.data.name)]))}<p>All branches must finish at the paired Merge node. An error blocks the join while other branches may finish.</p>{config.joinId && <Button variant="outline" onClick={() => setNodes(current => current.map(n => ({ ...n, selected: n.id === config.joinId })))}>Locate paired Merge</Button>}</>}
      {preset === 'duration' && <>{select('Wait until', 'waitMode', [['duration', 'Elapsed duration'], ['date', 'Specified date and time'], ['field', 'Date field']])}{config.waitMode === 'duration' ? input('Hours to wait', 'durationHours', 'number') : config.waitMode === 'field' ? select('Date field', 'dateFieldId', fields.filter(f => ['date', 'datetime'].includes(f.type)).map(f => [f.fieldId, f.name])) : input('Resume at', 'resumeAt', 'datetime-local')}{input('Timezone', 'timezone')}<p>Resolve the date on entering this step. A past date continues immediately.</p></>}
      {['success', 'terminated'].includes(preset) && <>{input('Result name', 'result')}{text('Result summary', 'summary')}{preset === 'terminated' && <>{text('Termination reason', 'reason')}<p>Cancel unfinished tasks and waits. Keep previous results; external effects are not undone.</p></>}</>}
      </details>
      {['manual', 'fillForm', 'completeTask', 'approval'].includes(preset) && <details open><summary>{preset === 'manual' ? 'Start form' : 'Form and fields'}</summary><p>{form ? `${form.name} · version ${form.version} · ${form.bindings.length} fields` : 'No form selected'}</p><div className="phase2-actions"><Button variant="outline" onClick={() => { try { setForms(readForms()); } catch (e) { setMessage((e as Error).message); } }}>Choose saved form</Button><Button variant="outline" onClick={() => setDesigning(emptyForm())}>New form</Button>{form && <Button variant="outline" onClick={() => setDesigning(form)}>Edit form</Button>}</div>{forms.length > 0 && <label>Saved form<select value="" onChange={e => { const chosen = forms.find(f => `${f.id}:${f.version}` === e.target.value); if (chosen) { update('form', bindForm(chosen)); setForms([]); } }}><option value="">Choose form and version…</option>{forms.map(f => <option key={`${f.id}:${f.version}`} value={`${f.id}:${f.version}`}>{f.name} · v{f.version}</option>)}</select></label>}{form?.bindings.map(b => <p key={b.key}>{b.name} · {b.type} · {b.access}{b.required ? ' · required' : ''}</p>)}</details>}
      {['fillForm', 'completeTask', 'approval'].includes(preset) && <details><summary>Timing and reminders</summary>{input('Due after hours (optional)', 'dueHours', 'number')}{input('Remind hours before due (optional)', 'remindHours', 'number')}<p>Natural elapsed hours. Overdue tasks remain pending; approval never passes automatically.</p></details>}
      <details open><summary>Outputs and paths</summary><p>Form fields are available to later steps. Submission records retain the values at the time of submission.</p>{edges.filter(e => e.source === node.id).map(edge => <label key={edge.id}>Path to {String(nodes.find(n => n.id === edge.target)?.data.name ?? edge.target)}{['ifElse', 'approval'].includes(preset) ? <select value={String(edge.data?.outlet ?? '')} onChange={e => setEdges(current => current.map(item => item.id === edge.id ? { ...item, label: e.target.value, data: { ...item.data, outlet: e.target.value } } : item))}><option value="">Assign path…</option>{(preset === 'ifElse' ? ['match', 'default'] : ['approved', 'rejected']).map(v => <option key={v}>{v}</option>)}</select> : <input value={String(edge.label ?? '')} onChange={e => setEdges(current => current.map(item => item.id === edge.id ? { ...item, label: e.target.value } : item))} />}</label>)}</details>
    </>}
    {designing && <FormDesigner key={designing.id} form={designing} fields={fields} onSave={saved => update('form', bindForm(saved))} onClose={() => setDesigning(null)} />}
  </aside>;
}
