'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AdminUser } from '../types';

interface AdminUsersTableProps {
  users: AdminUser[];
  onAddUser: () => void;
  onDeleteUser: (userId: string) => void;
  onToggleUserStatus: (userId: string) => void;
  onEditUser: (user: AdminUser | null) => void;
  onViewUser: (user: AdminUser | null) => void;
  newUser: {
    name: string;
    email: string;
    role: 'admin' | 'moderator' | 'super_admin';
    permissions: string[];
  };
  setNewUser: (user: any) => void;
  showAddUserDialog: boolean;
  setShowAddUserDialog: (show: boolean) => void;
}

export function AdminUsersTable({
  users,
  onAddUser,
  onDeleteUser,
  onToggleUserStatus,
  onEditUser,
  onViewUser,
  newUser,
  setNewUser,
  showAddUserDialog,
  setShowAddUserDialog
}: AdminUsersTableProps) {
  const [userPage, setUserPage] = useState(0);
  const [userRowsPerPage, setUserRowsPerPage] = useState(10);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const userPageCount = Math.ceil(users.length / userRowsPerPage);
  const paginatedUsers = users.slice(userPage * userRowsPerPage, (userPage + 1) * userRowsPerPage);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Role-Based Admin Users</CardTitle>
              <CardDescription>Manage system administrators and their permissions</CardDescription>
            </div>
            <Button onClick={() => setShowAddUserDialog(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Admin User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Bulk Action Bar */}
          {selectedUserIds.length > 0 && (
            <div className="mb-2 flex items-center gap-2 bg-muted p-2 rounded">
              <span>{selectedUserIds.length} selected</span>
              <Button variant="destructive" size="sm" onClick={() => {
                selectedUserIds.forEach(id => onDeleteUser(id));
                setSelectedUserIds([]);
              }}>Delete Selected</Button>
            </div>
          )}
          
          {/* Admin Users Table */}
          <div className="overflow-x-auto pr-4">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <input type="checkbox" checked={selectedUserIds.length === paginatedUsers.length && paginatedUsers.length > 0} onChange={e => {
                      if (e.target.checked) setSelectedUserIds(paginatedUsers.map(u => u.id));
                      else setSelectedUserIds([]);
                    }} />
                  </TableHead>
                  <TableHead className="sticky left-0 bg-background z-10 whitespace-nowrap">Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-4">No users found.</TableCell></TableRow>
                ) : (
                  paginatedUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <input type="checkbox" checked={selectedUserIds.includes(user.id)} onChange={e => {
                          if (e.target.checked) setSelectedUserIds(ids => [...ids, user.id]);
                          else setSelectedUserIds(ids => ids.filter(id => id !== user.id));
                        }} />
                      </TableCell>
                      <TableCell className="sticky left-0 bg-background z-10 whitespace-nowrap">{user.name}</TableCell>
                      <TableCell className="truncate max-w-[180px] whitespace-nowrap">{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell className="text-center w-32 p-1">
                        <Button size="sm" variant="outline" onClick={() => onViewUser(user)}>View</Button>
                        <Button size="sm" variant="outline" onClick={() => onEditUser(user)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => onDeleteUser(user.id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <Select value={userRowsPerPage.toString()} onValueChange={v => { setUserRowsPerPage(Number(v)); setUserPage(0); }}>
                <SelectTrigger className="h-8 w-[4.5rem]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 50].map(size => (
                    <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setUserPage(0)} disabled={userPage === 0}>&laquo;</Button>
              <Button variant="outline" size="icon" onClick={() => setUserPage(p => Math.max(0, p - 1))} disabled={userPage === 0}>&lsaquo;</Button>
              <span>Page {userPage + 1} of {userPageCount || 1}</span>
              <Button variant="outline" size="icon" onClick={() => setUserPage(p => Math.min(userPageCount - 1, p + 1))} disabled={userPage >= userPageCount - 1}>&rsaquo;</Button>
              <Button variant="outline" size="icon" onClick={() => setUserPage(userPageCount - 1)} disabled={userPage >= userPageCount - 1}>&raquo;</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Admin User</DialogTitle>
            <DialogDescription>
              Add a new administrator to the system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">Name</Label>
              <Input 
                id="user-name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">Email</Label>
              <Input 
                id="user-email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role">Role</Label>
              <Select 
                value={newUser.role} 
                onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
              Cancel
            </Button>
            <Button onClick={onAddUser}>
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 