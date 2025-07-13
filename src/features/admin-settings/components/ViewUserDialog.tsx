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

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  permissions: string[];
  createdAt: string;
}

interface ViewUserDialogProps {
  user: AdminUser | null;
  onClose: () => void;
}

export function ViewUserDialog({ user, onClose }: ViewUserDialogProps) {
  return (
    <Dialog open={!!user} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        {user && (
          <div className="space-y-2">
            <div><b>Name:</b> {user.name}</div>
            <div><b>Email:</b> {user.email}</div>
            <div><b>Role:</b> {user.role}</div>
            <div><b>Status:</b> {user.status}</div>
            <div><b>Last Login:</b> {user.lastLogin}</div>
            <div><b>Created:</b> {user.createdAt}</div>
            <div><b>Permissions:</b> {user.permissions?.join(', ')}</div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 