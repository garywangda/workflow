import { useState } from "react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface WorkflowDeleteDialogProps {
  nodeCount: number;
  edgeCount: number;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
}

/** 删除确认窗口；Escape 只取消，不把 Enter 注册为删除快捷键。 */
export function WorkflowDeleteDialog({ nodeCount, edgeCount, onCancel, onConfirm }: WorkflowDeleteDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targetLabel = nodeCount === 1 ? "this node" : `${nodeCount} selected nodes`;
  const connectedEdgeLabel = edgeCount > 0 || nodeCount > 0 ? " Any connected edges will also be removed." : "";

  const handleConfirm = async () => {
    setIsConfirming(true);
    setError(null);
    try {
      await onConfirm();
    } catch {
      setError("The selection could not be deleted. Please try again.");
      setIsConfirming(false);
    }
  };

  return (
    <AlertDialog open onOpenChange={(open) => { if (!open && !isConfirming) onCancel(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {targetLabel}?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.{connectedEdgeLabel}</AlertDialogDescription>
          {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild><Button variant="outline" disabled={isConfirming}>Cancel</Button></AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" disabled={isConfirming} aria-busy={isConfirming} onClick={(event) => { event.preventDefault(); void handleConfirm(); }}>
              {isConfirming ? "Deleting…" : "Delete"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
