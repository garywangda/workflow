import type { ReactNode } from "react";

interface EditorToolGroupProps {
  ariaLabel: string;
  children: ReactNode;
}

export function EditorToolGroup({ ariaLabel, children }: EditorToolGroupProps) {
  return (
    <div className="editor-toolbox__group" role="group" aria-label={ariaLabel}>
      {children}
    </div>
  );
}
