export function EditorToolRail() {
  return (
    <aside className="editor-tool-rail" aria-label="Editor tools">
      <button
        className="editor-tool-rail__button editor-tool-rail__button--active"
        type="button"
        aria-label="Pointer tool"
        aria-pressed="true"
        title="Pointer"
      >
        <span aria-hidden="true">↖</span>
      </button>
    </aside>
  );
}
