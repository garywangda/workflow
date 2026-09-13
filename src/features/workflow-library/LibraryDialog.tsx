import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
export function LibraryDialog({ title, description, closeLabel = '关闭', drawer = false, onClose, children }: {
  title: string; description: string; closeLabel?: string; drawer?: boolean; onClose: () => void; children: ReactNode;
}) {
  return <AlertDialog open onOpenChange={open => { if (!open) onClose(); }}>
    <AlertDialogContent className={`library-dialog ${drawer ? 'library-dialog--drawer' : ''}`} onEscapeKeyDown={onClose}>
      <div className="library-dialog-heading"><AlertDialogTitle>{title}</AlertDialogTitle><Button variant="ghost" size="icon" aria-label={closeLabel} onClick={onClose}><X size={18} /></Button></div>
      <AlertDialogDescription>{description}</AlertDialogDescription>{children}
    </AlertDialogContent>
  </AlertDialog>;
}
