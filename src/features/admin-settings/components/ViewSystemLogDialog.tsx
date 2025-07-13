'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SystemLog {
  id: string;
  timestamp: string;
  level: string;
  component: string;
  message: string;
  details?: string;
  environment?: string;
  requestId?: string;
  stackTrace?: string;
}

interface ViewSystemLogDialogProps {
  log: SystemLog | null;
  onClose: () => void;
}

export function ViewSystemLogDialog({ log, onClose }: ViewSystemLogDialogProps) {
  return (
    <Dialog open={!!log} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>System Log Details</DialogTitle>
        </DialogHeader>
        {log && (
          <div className="space-y-2">
            <div><b>Timestamp:</b> {log.timestamp}</div>
            <div><b>Level:</b> {log.level}</div>
            <div><b>Component:</b> {log.component}</div>
            <div><b>Message:</b> {log.message}</div>
            {log.details && <div><b>Details:</b> {log.details}</div>}
            {log.environment && <div><b>Environment:</b> {log.environment}</div>}
            {log.requestId && <div><b>Request ID:</b> {log.requestId}</div>}
            {log.stackTrace && <div><b>Stack Trace:</b> <pre className="whitespace-pre-wrap">{log.stackTrace}</pre></div>}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 