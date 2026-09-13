import type { Node, Edge } from '@xyflow/react';
export interface WorkflowDocument { nodes: Node[]; edges: Edge[] }
export function readDocument(id: string): WorkflowDocument {
  const raw = localStorage.getItem(`workflow.document.${id}`);
  if (!raw) return { nodes: [], edges: [] };
  const value = JSON.parse(raw) as WorkflowDocument;
  if (!Array.isArray(value.nodes) || !Array.isArray(value.edges)
    || value.nodes.some(n => !n || typeof n.id !== 'string' || !Number.isFinite(n.position?.x) || !Number.isFinite(n.position?.y) || !n.data)
    || value.edges.some(e => !e || typeof e.id !== 'string' || typeof e.source !== 'string' || typeof e.target !== 'string')) throw new Error('Invalid workflow canvas data');
  return value;
}
export function saveDocument(id: string, document: WorkflowDocument) {
  localStorage.setItem(`workflow.document.${id}`, serializeDocument(document));
}
export function copyDocument(from: string, to: string) { saveDocument(to, readDocument(from)); }
export function serializeDocument(document: WorkflowDocument) {
  const nodes = document.nodes.map(node => { const next = { ...node }; delete next.selected; delete next.dragging; delete next.measured; return next; });
  const edges = document.edges.map(edge => { const next = { ...edge }; delete next.selected; return next; });
  return JSON.stringify({ nodes, edges });
}
