// 顶部栏只承载编辑器标题和全局操作入口，不拥有画布编辑状态。
export function EditorHeader() {
  return (
    <header className="editor-header">
      <button className="editor-header__back" type="button" aria-label="Back" title="Back">
        <span aria-hidden="true">‹</span>
      </button>
      <div className="editor-header__title" aria-label="Workflow title">
        Untitled workflow
      </div>
      <div className="editor-header__reserved" aria-hidden="true" />
    </header>
  );
}
