import { describe, expect, it } from 'vitest';
import { createPresetNodes, validateWorkflow, saveFormVersion, bindForm, publishVersion, renderSchema, evaluateCondition, type FormAsset } from '../features/workflow-editor/phase2/model';

describe('phase two configuration contracts', () => {
  it('blocks concurrent writes to the same field in separate parallel branches', () => {
    const [split, join] = createPresetNodes('parallel', { x: 0, y: 0 });
    const [left] = createPresetNodes('updateData', { x: 0, y: 100 });
    const [right] = createPresetNodes('updateData', { x: 100, y: 100 });
    left.data.config.fieldId = 'amount'; right.data.config.fieldId = 'amount';
    const edges = [{ id: 'a', source: split.id, target: left.id }, { id: 'b', source: split.id, target: right.id }, { id: 'c', source: left.id, target: join.id }, { id: 'd', source: right.id, target: join.id }];
    expect(validateWorkflow({ nodes: [split, join, left, right], edges }).some(i => i.message.includes('parallel branches write'))).toBe(true);
  });
  it('blocks an approval without a rejection outlet and a non-numeric value for a numeric field', () => {
    const [approval] = createPresetNodes('approval', { x: 0, y: 0 });
    approval.data.config.assignees = 'reviewer';
    expect(validateWorkflow({ nodes: [approval], edges: [] }).some(i => i.message.includes('approved and rejected'))).toBe(true);
    const [update] = createPresetNodes('updateData', { x: 0, y: 0 });
    update.data.config = { ...update.data.config, fieldId: 'amount', value: 'hello', form: { id: 'f', name: 'Request', version: 1, schema: { components: [{ type: 'number', key: 'amount', input: true }] }, bindings: [{ key: 'amount', fieldId: 'amount', name: 'Amount', type: 'number', access: 'write', required: false }] } };
    expect(validateWorkflow({ nodes: [update], edges: [] }).some(i => i.field === 'value')).toBe(true);
  });
  it('renders node-level permissions and required rules without mutating the shared form', () => {
    const form: FormAsset = { id: 'f', name: 'Request', version: 1, schema: { components: [{ key: 'reason', type: 'textfield', input: true }] }, bindings: [{ key: 'reason', fieldId: 'reason', name: 'Reason', type: 'text', access: 'read', required: false }] };
    expect(renderSchema(form).components[0]).toMatchObject({ disabled: true, validate: { required: false } });
    expect(form.schema.components[0].disabled).toBeUndefined();
  });
  it('never treats a missing amount as zero or compares numbers as strings', () => {
    expect(evaluateCondition(undefined, 'less', '5000', 'number')).toBe(false);
    expect(evaluateCondition(900, 'greater', '1000', 'number')).toBe(false);
    expect(evaluateCondition(900, 'less', '1000', 'number')).toBe(true);
    expect(evaluateCondition(null, 'empty', '', 'number')).toBe(true);
  });
  it('creates a manual start with a fixed empty form, without sharing data between nodes', () => {
    const [a] = createPresetNodes('manual', { x: 0, y: 0 });
    const [b] = createPresetNodes('manual', { x: 0, y: 0 });
    expect(a.data.config.form).toMatchObject({ schema: { components: [] }, bindings: [] });
    expect(a.data.config.form).not.toBe(b.data.config.form);
    expect(validateWorkflow({ nodes: [a], edges: [] }).some(i => i.field === 'form')).toBe(true);
  });
  it('creates a paired parallel join and never enables external presets', () => {
    const [start, join] = createPresetNodes('parallel', { x: 0, y: 0 });
    expect(start.data.config.joinId).toBe(join.id);
    expect(join.data.config.parallelId).toBe(start.id);
    expect(() => createPresetNodes('event', { x: 0, y: 0 })).toThrow();
  });
  it('pins form versions and stable field bindings when a shared form is edited', () => {
    const form: FormAsset = { id: 'f', name: 'Request', version: 1, schema: { components: [{ type: 'number', key: 'amount', label: 'Amount', input: true }] }, bindings: [{ key: 'amount', fieldId: 'field-1', name: 'Amount', type: 'number', access: 'write', required: true }] };
    const pinned = bindForm(form);
    const next = saveFormVersion(form, { ...form, name: 'Updated' });
    expect(next.version).toBe(2);
    expect(pinned.name).toBe('Request');
    expect(next.bindings[0].fieldId).toBe('field-1');
    expect(() => saveFormVersion(form, { ...form, bindings: [{ ...form.bindings[0], type: 'text' }] })).toThrow(/type/i);
    expect(() => saveFormVersion(form, { ...form, bindings: [{ ...form.bindings[0], access: 'read' }] })).toThrow(/required/i);
  });
  it('blocks disconnected paths and preserves immutable published snapshots', () => {
    const [start] = createPresetNodes('manual', { x: 0, y: 0 });
    const [end] = createPresetNodes('success', { x: 0, y: 200 });
    start.data.config.form = { id: 'f', name: 'Request', version: 1, schema: { components: [{ key: 'reason', type: 'textfield', input: true }] }, bindings: [{ key: 'reason', fieldId: 'reason', name: 'Reason', type: 'text', access: 'write', required: true }] };
    const doc = { nodes: [start, end], edges: [{ id: 'e', source: start.id, target: end.id }] };
    expect(validateWorkflow(doc)).toEqual([]);
    const published = publishVersion(doc, []);
    start.data.name = 'Changed draft';
    expect(published.document.nodes[0].data.name).not.toBe('Changed draft');
    expect(() => publishVersion({ ...doc, edges: [] }, [])).toThrow();
  });
});
