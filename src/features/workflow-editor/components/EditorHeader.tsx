import { ArrowLeft, MoreHorizontal } from "lucide-react";

import { AppIconButton } from "@/components/app/AppIconButton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// 顶部栏只承载编辑器标题和全局操作入口，不拥有画布编辑状态。
export function EditorHeader() {
  return (
    <header className="editor-header">
      <AppIconButton label="Back" tooltip="Back" className="justify-self-center text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" />
      </AppIconButton>
      <div className="editor-header__title" aria-label="Workflow title">
        Untitled workflow
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <AppIconButton label="More workflow actions" tooltip="More actions" className="justify-self-center text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </AppIconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Workflow actions</DropdownMenuLabel>
          <DropdownMenuItem disabled>No actions available</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
