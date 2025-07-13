'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { ActivityLog } from '../types';

interface ActivityLogTableProps {
  logs: ActivityLog[];
  onDeleteLogs: (logIds: string[]) => void;
}

export function ActivityLogTable({ logs, onDeleteLogs }: ActivityLogTableProps) {
  const [logPage, setLogPage] = useState(0);
  const [logRowsPerPage, setLogRowsPerPage] = useState(10);
  const [selectedLogIds, setSelectedLogIds] = useState<string[]>([]);
  const [logSearch, setLogSearch] = useState('');
  const [logUserFilter, setLogUserFilter] = useState('__all__');
  const [logActionFilter, setLogActionFilter] = useState('__all__');

  const logPageCount = Math.ceil(logs.length / logRowsPerPage);
  const paginatedLogs = logs.slice(logPage * logRowsPerPage, (logPage + 1) * logRowsPerPage);

  // Filtered activity logs
  const filteredLogs = logs.filter(log => {
    return (
      (!logSearch || log.details.toLowerCase().includes(logSearch.toLowerCase()) || log.user.toLowerCase().includes(logSearch.toLowerCase())) &&
      (logUserFilter === '__all__' || log.user === logUserFilter) &&
      (logActionFilter === '__all__' || log.action === logActionFilter)
    );
  });
  const filteredPaginatedLogs = filteredLogs.slice(logPage * logRowsPerPage, (logPage + 1) * logRowsPerPage);
  const filteredLogPageCount = Math.ceil(filteredLogs.length / logRowsPerPage);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>Monitor auditor, client, and admin actions</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filter/Search Bar */}
        <div className="flex flex-wrap gap-2 mb-2 items-center">
          <Input placeholder="Search logs..." value={logSearch} onChange={e => setLogSearch(e.target.value)} className="w-48" />
          <Select value={logUserFilter} onValueChange={setLogUserFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Filter by user" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Users</SelectItem>
              {Array.from(new Set(logs.map(l => l.user))).map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={logActionFilter} onValueChange={setLogActionFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Filter by action" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Actions</SelectItem>
              {Array.from(new Set(logs.map(l => l.action))).map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        
        {/* Bulk Action Bar */}
        {selectedLogIds.length > 0 && (
          <div className="mb-2 flex items-center gap-2 bg-muted p-2 rounded">
            <span>{selectedLogIds.length} selected</span>
            <Button variant="destructive" size="sm" onClick={() => {
              onDeleteLogs(selectedLogIds);
              setSelectedLogIds([]);
            }}>Delete Selected</Button>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>
                  <input type="checkbox" checked={selectedLogIds.length === filteredPaginatedLogs.length && filteredPaginatedLogs.length > 0} onChange={e => {
                    if (e.target.checked) setSelectedLogIds(filteredPaginatedLogs.map(l => l.id));
                    else setSelectedLogIds([]);
                  }} />
                </TableHead>
                <TableHead className="sticky left-0 bg-background z-10 whitespace-nowrap">Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPaginatedLogs.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-4">No activity logs found.</TableCell></TableRow>
              ) : (
                filteredPaginatedLogs.map(log => (
                  <TableRow key={log.id} data-state={selectedLogIds.includes(log.id) ? 'selected' : undefined}>
                    <TableCell>
                      <input type="checkbox" checked={selectedLogIds.includes(log.id)} onChange={e => {
                        if (e.target.checked) setSelectedLogIds(ids => [...ids, log.id]);
                        else setSelectedLogIds(ids => ids.filter(id => id !== log.id));
                      }} />
                    </TableCell>
                    <TableCell className="sticky left-0 bg-background z-10 whitespace-nowrap">{log.timestamp}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.details}</TableCell>
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
            <Select value={logRowsPerPage.toString()} onValueChange={v => { setLogRowsPerPage(Number(v)); setLogPage(0); }}>
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
            <Button variant="outline" size="icon" onClick={() => setLogPage(0)} disabled={logPage === 0}>&laquo;</Button>
            <Button variant="outline" size="icon" onClick={() => setLogPage(p => Math.max(0, p - 1))} disabled={logPage === 0}>&lsaquo;</Button>
            <span>Page {logPage + 1} of {filteredLogPageCount || 1}</span>
            <Button variant="outline" size="icon" onClick={() => setLogPage(p => Math.min(filteredLogPageCount - 1, p + 1))} disabled={logPage >= filteredLogPageCount - 1}>&rsaquo;</Button>
            <Button variant="outline" size="icon" onClick={() => setLogPage(filteredLogPageCount - 1)} disabled={logPage >= filteredLogPageCount - 1}>&raquo;</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 