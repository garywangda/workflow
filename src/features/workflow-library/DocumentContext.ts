import { createContext } from 'react';
import type { WorkflowDocument } from './document';
export const DocumentContext = createContext<{ id?: string; initial: WorkflowDocument; onChange: (document: WorkflowDocument) => void } | null>(null);
