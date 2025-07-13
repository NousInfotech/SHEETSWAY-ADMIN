'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

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

interface SystemLogsTableProps {
  logs: SystemLog[];
  onViewLog: (log: SystemLog | null) => void;
}

export function SystemLogsTable({ logs, onViewLog }: SystemLogsTableProps) {
  const [systemLogPage, setSystemLogPage] = useState(0);
  const [systemLogRowsPerPage, setSystemLogRowsPerPage] = useState(10);

  const systemLogPageCount = Math.ceil(logs.length / systemLogRowsPerPage);
  const paginatedSystemLogs = logs.slice(systemLogPage * systemLogRowsPerPage, (systemLogPage + 1) * systemLogRowsPerPage);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>System Logs</CardTitle>
            <CardDescription>Monitor system-level events and errors</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* System Logs Table */}
        <div className="overflow-x-auto pr-4">
          <Table className="w-full">
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow>
                <TableHead className="sticky left-0 bg-background z-10 whitespace-nowrap">Timestamp</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Component</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="text-center w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSystemLogs.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-4">No system logs found.</TableCell></TableRow>
              ) : (
                paginatedSystemLogs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell className="sticky left-0 bg-background z-10 whitespace-nowrap">{log.timestamp}</TableCell>
                    <TableCell>{log.level}</TableCell>
                    <TableCell className="truncate max-w-[140px] whitespace-nowrap">{log.component}</TableCell>
                    <TableCell className="truncate max-w-[180px] whitespace-nowrap">{log.message}</TableCell>
                    <TableCell className="text-center w-32 p-1">
                      <Button size="sm" variant="outline" onClick={() => onViewLog(log)}>View</Button>
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
            <Select value={systemLogRowsPerPage.toString()} onValueChange={v => { setSystemLogRowsPerPage(Number(v)); setSystemLogPage(0); }}>
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
            <Button variant="outline" size="icon" onClick={() => setSystemLogPage(0)} disabled={systemLogPage === 0}>&laquo;</Button>
            <Button variant="outline" size="icon" onClick={() => setSystemLogPage(p => Math.max(0, p - 1))} disabled={systemLogPage === 0}>&lsaquo;</Button>
            <span>Page {systemLogPage + 1} of {systemLogPageCount || 1}</span>
            <Button variant="outline" size="icon" onClick={() => setSystemLogPage(p => Math.min(systemLogPageCount - 1, p + 1))} disabled={systemLogPage >= systemLogPageCount - 1}>&rsaquo;</Button>
            <Button variant="outline" size="icon" onClick={() => setSystemLogPage(systemLogPageCount - 1)} disabled={systemLogPage >= systemLogPageCount - 1}>&raquo;</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 