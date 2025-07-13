'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

interface EditUserDialogProps {
  user: AdminUser | null;
  onClose: () => void;
  onSave: (updatedUser: AdminUser) => void;
}

export function EditUserDialog({ user, onClose, onSave }: EditUserDialogProps) {
  const [editUserForm, setEditUserForm] = useState({ name: '', email: '', role: 'admin', status: 'active' });

  useEffect(() => {
    if (user) {
      setEditUserForm({ name: user.name, email: user.email, role: user.role, status: user.status });
    }
  }, [user]);

  return (
    <Dialog open={!!user} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Admin User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-user-name">Name</Label>
            <Input id="edit-user-name" value={editUserForm.name} onChange={e => setEditUserForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-user-email">Email</Label>
            <Input id="edit-user-email" value={editUserForm.email} onChange={e => setEditUserForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-user-role">Role</Label>
            <Select value={editUserForm.role} onValueChange={v => setEditUserForm(f => ({ ...f, role: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-user-status">Status</Label>
            <Select value={editUserForm.status} onValueChange={v => setEditUserForm(f => ({ ...f, status: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => {
            if (user) {
              const updatedUser: AdminUser = {
                ...user,
                name: editUserForm.name,
                email: editUserForm.email,
                role: editUserForm.role as 'super_admin' | 'admin' | 'moderator',
                status: editUserForm.status as 'active' | 'inactive' | 'suspended'
              };
              onSave(updatedUser);
            }
          }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 