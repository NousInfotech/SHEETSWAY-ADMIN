'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, AlertTriangle, Info, XCircle, CheckCircle, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type SystemLog = {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info' | 'debug';
  component: string;
  message: string;
  details: string;
  stackTrace?: string;
  environment: 'production' | 'staging' | 'development';
  requestId?: string;
};

export const columns: ColumnDef<SystemLog>[] = [
  {
    accessorKey: 'timestamp',
    header: 'Timestamp',
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground">
          {row.getValue('timestamp')}
        </div>
      );
    },
  },
  {
    accessorKey: 'level',
    header: 'Level',
    cell: ({ row }) => {
      const level = row.getValue('level') as string;
      const levelColors = {
        error: 'bg-red-100 text-red-800',
        warning: 'bg-yellow-100 text-yellow-800',
        info: 'bg-blue-100 text-blue-800',
        debug: 'bg-gray-100 text-gray-800',
      };
      const levelIcons = {
        error: <XCircle className="h-4 w-4" />,
        warning: <AlertTriangle className="h-4 w-4" />,
        info: <Info className="h-4 w-4" />,
        debug: <Clock className="h-4 w-4" />,
      };
      
      return (
        <div className="flex items-center gap-2">
          {levelIcons[level as keyof typeof levelIcons]}
          <Badge className={levelColors[level as keyof typeof levelColors]}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'component',
    header: 'Component',
    cell: ({ row }) => {
      return (
        <div className="text-sm font-medium">
          {row.getValue('component')}
        </div>
      );
    },
  },
  {
    accessorKey: 'message',
    header: 'Message',
    cell: ({ row }) => {
      const message = row.getValue('message') as string;
      return (
        <div className="max-w-md">
          <div className="text-sm font-medium truncate">
            {message.length > 100 ? `${message.substring(0, 100)}...` : message}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'environment',
    header: 'Environment',
    cell: ({ row }) => {
      const environment = row.getValue('environment') as string;
      const envColors = {
        production: 'bg-red-100 text-red-800',
        staging: 'bg-yellow-100 text-yellow-800',
        development: 'bg-green-100 text-green-800',
      };
      return (
        <Badge className={envColors[environment as keyof typeof envColors]}>
          {environment.charAt(0).toUpperCase() + environment.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'requestId',
    header: 'Request ID',
    cell: ({ row }) => {
      const requestId = row.original.requestId;
      if (!requestId) return <div className="text-sm text-muted-foreground">-</div>;
      return (
        <div className="text-sm text-muted-foreground font-mono">
          {requestId.substring(0, 8)}...
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Flag for Investigation
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Resolved
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]; 