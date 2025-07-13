'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, AlertTriangle, Shield, User, Database } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ActivityLog } from '../AdminSettingsPage';

export const columns: ColumnDef<ActivityLog>[] = [
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
    accessorKey: 'user',
    header: 'User',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
            <User className="h-3 w-3" />
          </div>
          <span className="font-medium">{row.getValue('user')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => {
      return (
        <span className="font-medium">{row.getValue('action')}</span>
      );
    },
  },
  {
    accessorKey: 'details',
    header: 'Details',
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground">
          {row.getValue('details')}
        </div>
      );
    },
  },
]; 