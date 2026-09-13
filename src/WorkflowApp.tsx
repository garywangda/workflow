import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WorkflowLibrary } from './features/workflow-library/WorkflowLibrary';
import { WorkflowEditorPage } from './features/workflow-editor/WorkflowEditorPage';
import { DocumentContext } from './features/workflow-library/DocumentContext';
import { readDocument, saveDocument, serializeDocument, type WorkflowDocument } from './features/workflow-library/document';
import { LIBRARY_KEY, loadLibrary, type WorkflowFile } from './features/workflow-library/model';
import { Button } from './components/ui/button';

export function WorkflowApp() {
  const [file, setFile] = useState<WorkflowFile | null>(null);
  const [revision, setRevision] = useState(0);
  return <><div hidden={!!file} style={{ height: '100%' }}><WorkflowLibrary revision={revision} onOpen={setFile} /></div>
    {file && <DocumentEditor key={file.id} file={file} onBack={() => { setFile(null); setRevision(r => r + 1); }} />}</>;
}

function DocumentEditor({ file, onBack }: { file: WorkflowFile; onBack: () => void }) {
  const [loaded] = useState(() => { try { return { document: readDocument(file.id), error: '' }; } catch { return { document: null, error: '无法打开这份流程，画布数据可能损坏或无法读取。原内容未被覆盖。' }; } });
  const [error, setError] = useState('');
  const pending = useRef<WorkflowDocument | null>(null);
  const signature = useRef(loaded.document ? serializeDocument(loaded.document) : '');
  const save = useCallback((document: WorkflowDocument) => {
    pending.current = document;
    const serialized = serializeDocument(document);
    if (serialized === signature.current) { pending.current = null; setError(''); return; }
    try {
      const library = loadLibrary();
      if (library.error) throw new Error(library.error);
      saveDocument(file.id, document);
      localStorage.setItem(LIBRARY_KEY, JSON.stringify({ ...library.data, workflows: library.data.workflows.map(w => w.id === file.id ? { ...w, updatedAt: Date.now(), status: w.status === 'published' ? 'changes' : w.status } : w) }));
      signature.current = serialized;
      pending.current = null;
      setError('');
    } catch { setError('保存失败，请重试。返回流程库前需要成功保存。'); }
  }, [file.id]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (pending.current) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, []);
  const value = useMemo(() => loaded.document ? { initial: loaded.document, onChange: save } : null, [loaded.document, save]);
  if (!value) return <main className="library-empty"><p role="alert">{loaded.error}</p><Button onClick={onBack}>返回流程库</Button></main>;
  return <DocumentContext.Provider value={value}>
    <WorkflowEditorPage title={file.name} onBack={() => { if (pending.current) save(pending.current); if (!pending.current) onBack(); }} />
    <div className="document-save-state" role={error ? 'alert' : 'status'}>{error || '已保存到此浏览器'}{error && <Button variant="outline" onClick={() => { if (pending.current) save(pending.current); }}>重试保存</Button>}</div>
  </DocumentContext.Provider>;
}
