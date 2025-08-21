'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../../components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../../components/ui/select';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '../../../components/ui/pagination';
import { 
  Search, 
  Eye, 
  Download, 
  RefreshCw, 
  Lock, 
  Unlock, 
  AlertTriangle 
} from 'lucide-react';
import type { PaymentWithEscrow, PaymentFilter } from '../types';

interface EscrowPaymentsTableProps {
  escrowPayments: PaymentWithEscrow[];
  isLoading?: boolean;
  filter: PaymentFilter;
  onFilterChange: (filter: PaymentFilter) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewPayment: (paymentId: string) => void;
  onViewEscrow: (escrowId: string) => void;
}

export function EscrowPaymentsTable({
  escrowPayments,
  isLoading = false,
  filter = {}, // Add default empty object
  onFilterChange,
  currentPage,
  totalPages,
  onPageChange,
  onViewPayment,
  onViewEscrow
}: EscrowPaymentsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (key: keyof PaymentFilter, value: any) => {
    onFilterChange({ ...filter, [key]: value });
  };

  const handleSearch = () => {
    // Implement search logic if needed
    console.log('Searching for:', searchTerm);
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      succeeded: { variant: 'default' as const, label: 'Success' },
      pending: { variant: 'secondary' as const, label: 'Pending' },
      failed: { variant: 'destructive' as const, label: 'Failed' },
      refunded: { variant: 'outline' as const, label: 'Refunded' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { 
      variant: 'secondary' as const, 
      label: status 
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getEscrowStatusBadge = (escrow: PaymentWithEscrow['escrow']) => {
    if (escrow.underDispute) {
      return <Badge variant="destructive">Disputed</Badge>;
    }
    
    if (escrow.isReleased) {
      return <Badge variant="default">Released</Badge>;
    }
    
    return <Badge variant="secondary">Held</Badge>;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Escrow Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Escrow Payments</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor escrow funds and payment statuses
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search escrow payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          
                     <Select
             value={filter?.status || 'all'}
             onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
           >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="succeeded">Success</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

                     <Select
             value={filter?.engagementId || 'all'}
             onValueChange={(value) => handleFilterChange('engagementId', value === 'all' ? undefined : value)}
           >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Engagements" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Engagements</SelectItem>
              {/* This could be populated with actual engagement IDs */}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="px-6 py-4 font-semibold">Escrow ID</TableHead>
                <TableHead className="px-6 py-4 font-semibold">Engagement ID</TableHead>
                <TableHead className="px-6 py-4 font-semibold">Payment Amount</TableHead>
                <TableHead className="px-6 py-4 font-semibold">Payment Status</TableHead>
                <TableHead className="px-6 py-4 font-semibold">Escrow Status</TableHead>
                <TableHead className="px-6 py-4 font-semibold">Created</TableHead>
                <TableHead className="px-6 py-4 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
                         <TableBody>
               {escrowPayments.length === 0 ? (
                 <TableRow>
                   <TableCell colSpan={7} className="text-center py-8">
                     <div className="flex flex-col items-center gap-2 text-muted-foreground">
                       <div className="text-sm">
                         {isLoading ? 'Loading escrow payments...' : 'No escrow payments found'}
                       </div>
                       {/* {!isLoading && (
                         <div className="text-xs text-muted-foreground/70">
                           This is due to a known backend Prisma validation error with nested where clauses. 
                           Our team is working on the fix.
                         </div>
                       )} */}
                     </div>
                   </TableCell>
                 </TableRow>
               ) : (
                                 escrowPayments
                   .filter(payment => payment && typeof payment === 'object' && payment.escrow && payment.escrow.id)
                   .map((payment) => (
                     <TableRow key={payment.escrow.id} className="hover:bg-muted/30 transition-colors">
                       <TableCell className="px-6 py-4 font-mono text-sm">
                         {payment.escrow.id?.slice(0, 8) || 'N/A'}...
                       </TableCell>
                       <TableCell className="px-6 py-4">
                         <div className="space-y-1">
                           <div className="font-medium text-muted-foreground">
                             Engagement ID
                           </div>
                           <div className="text-xs text-muted-foreground font-mono">
                             {payment.escrow.engagementId?.slice(0, 8) || 'N/A'}...
                           </div>
                         </div>
                       </TableCell>
                       <TableCell className="px-6 py-4 font-medium">
                         {payment.amount && payment.currency ? formatCurrency(payment.amount, payment.currency) : 'N/A'}
                       </TableCell>
                       <TableCell className="px-6 py-4">
                         {payment.status ? getPaymentStatusBadge(payment.status) : <span className="text-muted-foreground">-</span>}
                       </TableCell>
                       <TableCell className="px-6 py-4">
                         <div className="flex items-center gap-2">
                           {payment.escrow ? getEscrowStatusBadge(payment.escrow) : <span className="text-muted-foreground">-</span>}
                           {payment.escrow?.isReleased && (
                             <Unlock className="h-4 w-4 text-green-600" />
                           )}
                           {payment.escrow && !payment.escrow.isReleased && !payment.escrow.underDispute && (
                             <Lock className="h-4 w-4 text-yellow-600" />
                           )}
                           {payment.escrow?.underDispute && (
                             <AlertTriangle className="h-4 w-4 text-red-600" />
                           )}
                         </div>
                       </TableCell>
                       <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                         {payment.escrow?.createdAt ? formatDate(payment.escrow.createdAt) : 'N/A'}
                       </TableCell>
                       <TableCell className="px-6 py-4">
                         <div className="flex items-center gap-2">
                           <Button
                             variant="ghost"
                             size="sm"
                             onClick={() => onViewPayment(payment.id)}
                             className="hover:bg-primary hover:text-primary-foreground"
                           >
                             <Eye className="h-4 w-4" />
                           </Button>
                           <Button
                             variant="ghost"
                             size="sm"
                             onClick={() => onViewEscrow(payment.escrow.id)}
                             className="hover:bg-primary hover:text-primary-foreground"
                           >
                             <Lock className="h-4 w-4" />
                           </Button>
                         </div>
                       </TableCell>
                     </TableRow>
                   ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 py-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => onPageChange(i + 1)}
                      isActive={currentPage === i + 1}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
