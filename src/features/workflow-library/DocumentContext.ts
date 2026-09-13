import { createContext } from 'react';
import type { WorkflowDocument } from './document';
export const DocumentContext = createContext<{ initial: WorkflowDocument; onChange: (document: WorkflowDocument) => void } | null>(null);
