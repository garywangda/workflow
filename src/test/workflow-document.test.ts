import { beforeEach, expect, it } from 'vitest';
import { readDocument, saveDocument, copyDocument } from '../features/workflow-library/document';
beforeEach(() => localStorage.clear());
it('isolates and persists the canvas for each workflow', () => {
  saveDocument('one', { nodes: [{ id: 'a', position: { x: 10, y: 20 }, data: { name: '采购步骤' } }], edges: [] });
  expect(readDocument('two').nodes).toEqual([]);
  expect(readDocument('one').nodes[0].data.name).toBe('采购步骤');
});
it('copies content into an independent document', () => {
  saveDocument('one', { nodes: [{ id: 'a', position: { x: 10, y: 20 }, data: { name: '原始步骤' } }], edges: [] });
  copyDocument('one', 'copy');
  saveDocument('one', { nodes: [], edges: [] });
  expect(readDocument('copy').nodes).toHaveLength(1);
});
it('reports damaged canvas data instead of silently opening an empty canvas', () => {
  localStorage.setItem('workflow.document.bad', '{');
  expect(() => readDocument('bad')).toThrow();
  expect(localStorage.getItem('workflow.document.bad')).toBe('{');
});
