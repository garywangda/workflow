import type { XYPosition } from '@xyflow/react';
import { createWorkflowNode } from '../factories/create-workflow-node';
import type { WorkflowNode, WorkflowNodeType } from '../types/workflow-node';
import type { WorkflowDocument } from '../../workflow-library/document';

export type FieldType = 'text' | 'number' | 'boolean' | 'date' | 'datetime' | 'select' | 'person' | 'attachment' | 'rows';
export interface FieldBinding { key: string; fieldId: string; name: string; type: FieldType; access: 'write' | 'read' | 'hidden'; required: boolean }
export interface FormComponent { type: string; key: string; label?: string; input?: boolean; components?: FormComponent[]; [key: string]: unknown }
export interface FormAsset { id: string; name: string; version: number; schema: { components: FormComponent[] }; bindings: FieldBinding[] }
export interface Issue { nodeId: string; field: string; message: string }
export interface PublishedVersion { version: number; createdAt: string; document: WorkflowDocument }
export const PRESETS: Record<string, { type: WorkflowNodeType; label: string; defaults?: Record<string, unknown>; disabled?: boolean }> = {
  manual: { type: 'trigger', label: 'Manual', defaults: { initiators: 'everyone', titleRule: '{{workflow}} · {{initiator}} · {{startedAt}}' } },
  schedule: { type: 'trigger', label: 'On a schedule', defaults: { recurrence: 'once', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, overlap: 'skip' } },
  event: { type: 'trigger', label: 'On an event', disabled: true },
  fillForm: { type: 'form', label: 'Fill out a form', defaults: { assignmentSource: 'person', assignmentMode: 'single' } },
  completeTask: { type: 'task', label: 'Complete a task', defaults: { assignmentSource: 'person', assignmentMode: 'single', evidence: false } },
  approval: { type: 'approval', label: 'Approval', defaults: { assignmentSource: 'person', approvalRule: 'all', returnEnabled: false, rejectionReason: true } },
  sendMessage: { type: 'action', label: 'Send notification', defaults: { channel: 'inApp', assignmentSource: 'person' } },
  updateData: { type: 'action', label: 'Update workflow data', defaults: { overwrite: 'always' } },
  external: { type: 'action', label: 'Call external service', disabled: true },
  ifElse: { type: 'condition', label: 'Condition branch', defaults: { operator: 'equals', defaultLabel: 'Otherwise' } },
  parallel: { type: 'parallel', label: 'Parallel branches', defaults: { joinRule: 'all', failure: 'blockJoin' } },
  duration: { type: 'wait', label: 'Wait for time', defaults: { waitMode: 'duration', durationHours: 24, pastTime: 'continue', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone } },
  waitEvent: { type: 'wait', label: 'Wait for event', disabled: true },
  success: { type: 'end', label: 'Normal end', defaults: { result: 'Completed' } },
  terminated: { type: 'end', label: 'Early end', defaults: { result: 'Terminated', unfinished: 'cancel' } },
};
export function emptyForm(): FormAsset { return { id: crypto.randomUUID(), name: 'Start form', version: 1, schema: { components: [] }, bindings: [] }; }
export function createPresetNodes(presetId: string, position: XYPosition, options: { name?: string; config?: Record<string, unknown> } = {}): WorkflowNode[] {
  const preset = PRESETS[presetId];
  if (!preset || preset.disabled) throw new Error('This preset is not available in this round');
  const node = createWorkflowNode({ type: preset.type, position });
  node.data = { ...node.data, name: options.name ?? preset.label, description: '', assignee: undefined, config: { presetId, ...structuredClone(preset.defaults ?? {}), ...structuredClone(options.config ?? {}) } };
  if (presetId === 'manual' || presetId === 'fillForm') node.data.config.form = emptyForm();
  if (presetId !== 'parallel') return [node];
  const join = createWorkflowNode({ type: 'merge', position: { x: position.x, y: position.y + 360 } });
  join.selected = false;
  join.data.name = 'Join all branches';
  join.data.config = { parallelId: node.id, joinRule: 'all' };
  node.data.config.joinId = join.id;
  return [node, join];
}
export function bindForm(form: FormAsset): FormAsset { return structuredClone(form); }
export function saveFormVersion(previous: FormAsset | undefined, draft: FormAsset): FormAsset {
  if (!draft.name.trim()) throw new Error('Enter a form name');
  const keys = new Set<string>();
  for (const binding of draft.bindings) {
    if (!binding.fieldId || keys.has(binding.key)) throw new Error('Every input must have a unique field binding');
    keys.add(binding.key);
    if (binding.required && binding.access !== 'write') throw new Error('A read-only or hidden field cannot be required');
    const old = previous?.bindings.find(b => b.fieldId === binding.fieldId);
    if (old && old.type !== binding.type) throw new Error('Field type changes require a new field');
  }
  return { ...structuredClone(draft), version: previous ? previous.version + 1 : 1 };
}
export function formInputs(components: FormComponent[]): FormComponent[] {
  return components.flatMap(c => c.type === 'button' ? [] : c.input ? [c] : formInputs(c.components ?? []));
}
export function componentType(c: FormComponent): FieldType {
  if (c.workflowType === 'person') return 'person';
  if (c.type === 'datagrid') return 'rows';
  if (c.type === 'number' || c.type === 'currency') return 'number';
  if (c.type === 'checkbox') return 'boolean';
  if (c.type === 'datetime') return c.enableTime === false ? 'date' : 'datetime';
  if (c.type === 'select' || c.type === 'radio' || c.type === 'selectboxes') return 'select';
  if (c.type === 'file') return 'attachment';
  return 'text';
}
export function renderSchema(form: FormAsset): FormAsset['schema'] {
  const schema = structuredClone(form.schema);
  const apply = (components: FormComponent[]) => components.forEach(c => {
    const binding = form.bindings.find(b => b.key === c.key);
    if (binding) {
      c.disabled = binding.access === 'read';
      c.hidden = binding.access === 'hidden';
      c.validate = { ...(c.validate as object ?? {}), required: binding.required && binding.access === 'write' };
    }
    if (c.components) apply(c.components);
  });
  apply(schema.components);
  return schema;
}
export function evaluateCondition(actual: unknown, operator: string, expected: string, type: FieldType): boolean {
  const missing = actual === undefined || actual === null || actual === '';
  if (operator === 'empty') return missing;
  if (operator === 'notEmpty') return !missing;
  if (missing) return false;
  let left: string | number = String(actual), right: string | number = expected;
  if (type === 'number') { left = Number(actual); right = Number(expected); if (!Number.isFinite(left) || !Number.isFinite(right)) return false; }
  if (type === 'date' || type === 'datetime') { left = Date.parse(String(actual)); right = Date.parse(expected); if (!Number.isFinite(left) || !Number.isFinite(right)) return false; }
  if (operator === 'equals') return left === right;
  if (operator === 'notEquals') return left !== right;
  if (operator === 'greater') return left > right;
  if (operator === 'less') return left < right;
  return false;
}
export function workflowFields(nodes: WorkflowDocument['nodes']): FieldBinding[] {
  const fields = new Map<string, FieldBinding>();
  for (const node of nodes) {
    const form = (node.data.config as Record<string, unknown> | undefined)?.form as FormAsset | undefined;
    for (const binding of form?.bindings ?? []) fields.set(binding.fieldId, binding);
  }
  return [...fields.values()];
}
export function validateWorkflow(doc: WorkflowDocument): Issue[] {
  const issues: Issue[] = [];
  const semantic = doc.nodes.filter(n => n.type && !n.type.startsWith('diagram:'));
  const fields = workflowFields(doc.nodes);
  const add = (nodeId: string, field: string, message: string) => issues.push({ nodeId, field, message });
  const starts = semantic.filter(n => n.type === 'trigger');
  if (starts.length !== 1) add(starts[0]?.id ?? '', 'start', 'A workflow must have exactly one start');
  if (!semantic.some(n => n.type === 'end')) add('', 'end', 'Add an end node');
  for (const node of semantic) {
    const config = (node.data.config ?? {}) as Record<string, unknown>;
    const presetId = config.presetId as string;
    const require = (field: string, message: string) => { if (config[field] === undefined || config[field] === null || String(config[field]).trim() === '') add(node.id, field, message); };
    if (PRESETS[presetId]?.disabled) add(node.id, 'presetId', 'External services and events are deferred');
    if (node.type !== 'merge' && node.type !== 'condition-branch' && !PRESETS[presetId]) add(node.id, 'presetId', 'Choose a supported preset for this legacy node');
    if (!String(node.data.name ?? '').trim() && node.type !== 'condition-branch') add(node.id, 'name', 'Enter a node name');
    const outgoing = doc.edges.filter(e => e.source === node.id);
    if (node.type !== 'end' && outgoing.length === 0) add(node.id, 'outlet', 'Connect this step to its next step');
    if (node.type === 'end' && outgoing.length) add(node.id, 'outlet', 'An end cannot have an outgoing connection');
    if (presetId === 'manual' || presetId === 'fillForm' || config.form) {
      const form = config.form as FormAsset | undefined;
      if (!form || formInputs(form.schema.components).length === 0) add(node.id, 'form', 'Design a form with at least one input');
      else {
        for (const input of formInputs(form.schema.components)) {
          const binding = form.bindings.find(b => b.key === input.key);
          if (!binding || binding.type !== componentType(input)) add(node.id, 'form', `Bind ${input.label ?? input.key} to a compatible field`);
        }
        try { saveFormVersion(undefined, form); } catch (error) { add(node.id, 'form', (error as Error).message); }
      }
    }
    if (presetId === 'manual' && config.initiators !== 'everyone') require('initiatorIds', 'Specify permitted initiators');
    if (['fillForm', 'completeTask', 'approval', 'sendMessage'].includes(presetId)) require('assignees', 'Specify people, a role, or a person field');
    if (presetId === 'completeTask') require('instructions', 'Describe the work to complete');
    if (presetId === 'approval' && config.returnEnabled) {
      const target = doc.nodes.find(n => n.id === config.returnTarget);
      if (!target || (target.data.config as Record<string, unknown>)?.presetId !== 'fillForm') add(node.id, 'returnTarget', 'Select a fill-out-form step for controlled resubmission');
    }
    if (presetId === 'approval' && ['approved', 'rejected'].some(outlet => outgoing.filter(e => e.data?.outlet === outlet).length !== 1)) add(node.id, 'outlet', 'Assign exactly one approved and rejected path');
    if (config.assignmentSource === 'field' && !fields.some(f => f.fieldId === config.assignees && f.type === 'person')) add(node.id, 'assignees', 'Select an existing person field');
    if (config.dueHours !== undefined && config.dueHours !== '' && !(Number(config.dueHours) > 0)) add(node.id, 'dueHours', 'Due duration must be greater than zero');
    if (config.remindHours !== undefined && config.remindHours !== '' && (!(Number(config.remindHours) >= 0) || !(Number(config.dueHours) > Number(config.remindHours)))) add(node.id, 'remindHours', 'A reminder must fall before a configured due time');
    if (presetId === 'schedule' || presetId === 'duration') {
      try { new Intl.DateTimeFormat('en', { timeZone: String(config.timezone) }).format(); } catch { add(node.id, 'timezone', 'Enter a valid timezone, such as Pacific/Auckland'); }
    }
    if (presetId === 'sendMessage') { require('subject', 'Enter a notification title'); require('message', 'Enter a notification message'); }
    if (presetId === 'schedule') { require('startAt', 'Choose the first scheduled time'); require('timezone', 'Choose a timezone'); }
    if (presetId === 'duration' && config.waitMode === 'duration' && !(Number(config.durationHours) > 0)) add(node.id, 'durationHours', 'Wait duration must be greater than zero');
    if (presetId === 'duration' && config.waitMode === 'date') require('resumeAt', 'Choose a resume time');
    if (presetId === 'duration' && config.waitMode === 'field' && !fields.some(f => f.fieldId === config.dateFieldId && ['date', 'datetime'].includes(f.type))) add(node.id, 'dateFieldId', 'Select an existing date field');
    if (presetId === 'terminated') require('reason', 'Explain the business termination reason');
    if (presetId === 'ifElse' || presetId === 'updateData') {
      if (!fields.some(f => f.fieldId === config.fieldId)) add(node.id, 'fieldId', 'Select an existing workflow field');
      const field = fields.find(f => f.fieldId === config.fieldId);
      if (field?.type === 'number' && config.value !== undefined && config.value !== '' && !Number.isFinite(Number(config.value))) add(node.id, 'value', 'Enter a valid numeric value');
      if (presetId === 'ifElse' && ['greater', 'less'].includes(String(config.operator)) && field && !['number', 'date', 'datetime'].includes(field.type)) add(node.id, 'operator', 'This operator requires a numeric or date field');
      if (presetId === 'ifElse') {
        if (!outgoing.some(e => e.data?.outlet === 'match') || !outgoing.some(e => e.data?.outlet === 'default')) add(node.id, 'outlet', 'Assign both a matching path and a default path');
      }
      if (presetId === 'updateData' || !['empty', 'notEmpty'].includes(String(config.operator))) require('value', 'Enter a value');
    }
    if (presetId === 'parallel') {
      const join = doc.nodes.find(n => n.id === config.joinId && n.type === 'merge');
      if (!join) add(node.id, 'joinId', 'Restore the paired join node');
      if (outgoing.length < 2) add(node.id, 'outlet', 'Connect at least two parallel branches');
      const reaches = (id: string, seen = new Set<string>()): boolean => {
        if (id === join?.id) return true;
        if (seen.has(id)) return false;
        const next = doc.edges.filter(e => e.source === id);
        return next.length > 0 && next.every(e => reaches(e.target, new Set([...seen, id])));
      };
      if (join && outgoing.some(e => !reaches(e.target))) add(node.id, 'joinId', 'Every parallel branch must reach its paired join');
    }
  }
  for (const split of semantic.filter(node => (node.data.config as Record<string, unknown>)?.presetId === 'parallel')) {
    const splitConfig = split.data.config as Record<string, unknown>;
    const joinId = String(splitConfig.joinId ?? '');
    const writesUntilJoin = (nodeId: string, seen = new Set<string>()): Set<string> => {
      if (nodeId === joinId || seen.has(nodeId)) return new Set();
      const branchNode = doc.nodes.find(node => node.id === nodeId);
      const branchConfig = (branchNode?.data.config ?? {}) as Record<string, unknown>;
      const writes = new Set<string>();
      if (branchConfig.presetId === 'updateData' && branchConfig.fieldId) writes.add(String(branchConfig.fieldId));
      const branchForm = branchConfig.form as FormAsset | undefined;
      for (const binding of branchForm?.bindings ?? []) if (binding.access === 'write') writes.add(binding.fieldId);
      for (const edge of doc.edges.filter(edge => edge.source === nodeId)) {
        for (const fieldId of writesUntilJoin(edge.target, new Set([...seen, nodeId]))) writes.add(fieldId);
      }
      return writes;
    };
    const previousWrites = new Set<string>();
    for (const edge of doc.edges.filter(edge => edge.source === split.id)) {
      for (const fieldId of writesUntilJoin(edge.target)) {
        if (previousWrites.has(fieldId)) add(split.id, 'fieldId', 'Two parallel branches write the same workflow field; merge data explicitly after the join');
        previousWrites.add(fieldId);
      }
    }
  }
  for (const edge of doc.edges) if (!doc.nodes.some(n => n.id === edge.source) || !doc.nodes.some(n => n.id === edge.target)) add(edge.source, 'outlet', 'Connection references a deleted node');
  if (starts.length === 1) {
    const visited = new Set<string>();
    const visit = (id: string, stack: Set<string>) => {
      if (stack.has(id)) { add(id, 'outlet', 'Arbitrary loops are not supported; use approval resubmission settings'); return; }
      if (visited.has(id)) return;
      visited.add(id);
      for (const edge of doc.edges.filter(e => e.source === id)) visit(edge.target, new Set([...stack, id]));
    };
    visit(starts[0].id, new Set());
    for (const node of semantic) if (!visited.has(node.id)) add(node.id, 'outlet', 'This step is not reachable from the start');
  }
  return issues;
}
export function publishVersion(document: WorkflowDocument, history: PublishedVersion[]): PublishedVersion {
  const issues = validateWorkflow(document);
  if (issues.length) throw new Error(`Resolve ${issues.length} workflow issues before publishing`);
  return { version: (history.at(-1)?.version ?? 0) + 1, createdAt: new Date().toISOString(), document: structuredClone(document) };
}
