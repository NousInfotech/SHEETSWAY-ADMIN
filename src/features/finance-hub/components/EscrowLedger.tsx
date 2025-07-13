'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Shield, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle,
  DollarSign,
  Calendar,
  User,
  FileText
} from 'lucide-react';
import { useFinanceHub } from '../hooks/useFinanceHub';
import { EscrowTransaction } from '../types';

export function EscrowLedger() {
  const {
    getFilteredEscrowTransactions,
    escrowFilter,
    setEscrowFilter,
    escrowPage,
    setEscrowPage,
    rowsPerPage,
    setRowsPerPage,
    releaseEscrow,
    refundEscrow
  } = useFinanceHub();

  const [selectedTransaction, setSelectedTransaction] = useState<EscrowTransaction | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<'release' | 'refund' | null>(null);

  const { data: transactions, total, pageCount } = getFilteredEscrowTransactions();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      released: 'default',
      refunded: 'destructive',
      disputed: 'outline',
      failed: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleAction = (transaction: EscrowTransaction, action: 'release' | 'refund') => {
    setSelectedTransaction(transaction);
    setActionType(action);
    setShowActionDialog(true);
  };

  const confirmAction = () => {
    if (selectedTransaction && actionType) {
      if (actionType === 'release') {
        releaseEscrow(selectedTransaction.id);
      } else {
        refundEscrow(selectedTransaction.id);
      }
      setShowActionDialog(false);
      setSelectedTransaction(null);
      setActionType(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Escrow Ledger
              </CardTitle>
              <CardDescription>
                Monitor escrow funds and manage payouts
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{total} transactions</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by client or freelancer..."
                value={escrowFilter.clientName || ''}
                onChange={(e) => setEscrowFilter({ ...escrowFilter, clientName: e.target.value })}
                className="w-64"
              />
            </div>
            <Select value={escrowFilter.status || 'all'} onValueChange={(value) => setEscrowFilter({ ...escrowFilter, status: value === 'all' ? undefined : value })}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="released">Released</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEscrowFilter({})}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Freelancer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No escrow transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {transaction.clientName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {transaction.freelancerName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          {formatCurrency(transaction.amount)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(transaction.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setShowDetailsDialog(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {transaction.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleAction(transaction, 'release')}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Release
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleAction(transaction, 'refund')}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Refund
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page</span>
              <Select value={rowsPerPage.toString()} onValueChange={(value) => { setRowsPerPage(Number(value)); setEscrowPage(0); }}>
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
              <Button variant="outline" size="icon" onClick={() => setEscrowPage(0)} disabled={escrowPage === 0}>&laquo;</Button>
              <Button variant="outline" size="icon" onClick={() => setEscrowPage(p => Math.max(0, p - 1))} disabled={escrowPage === 0}>&lsaquo;</Button>
              <span className="text-sm">Page {escrowPage + 1} of {pageCount || 1}</span>
              <Button variant="outline" size="icon" onClick={() => setEscrowPage(p => Math.min(pageCount - 1, p + 1))} disabled={escrowPage >= pageCount - 1}>&rsaquo;</Button>
              <Button variant="outline" size="icon" onClick={() => setEscrowPage(pageCount - 1)} disabled={escrowPage >= pageCount - 1}>&raquo;</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Transaction ID</label>
                  <p className="text-sm text-muted-foreground">{selectedTransaction.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedTransaction.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Client</label>
                  <p className="text-sm text-muted-foreground">{selectedTransaction.clientName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Freelancer</label>
                  <p className="text-sm text-muted-foreground">{selectedTransaction.freelancerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Amount</label>
                  <p className="text-sm text-muted-foreground">{formatCurrency(selectedTransaction.amount)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Currency</label>
                  <p className="text-sm text-muted-foreground">{selectedTransaction.currency}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Escrow Fee</label>
                  <p className="text-sm text-muted-foreground">{formatCurrency(selectedTransaction.escrowFee)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Platform Fee</label>
                  <p className="text-sm text-muted-foreground">{formatCurrency(selectedTransaction.platformFee)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Created</label>
                  <p className="text-sm text-muted-foreground">{formatDate(selectedTransaction.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Updated</label>
                  <p className="text-sm text-muted-foreground">{formatDate(selectedTransaction.updatedAt)}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <p className="text-sm text-muted-foreground mt-1">{selectedTransaction.description}</p>
              </div>
              {selectedTransaction.milestoneNumber && (
                <div>
                  <label className="text-sm font-medium">Milestone</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedTransaction.milestoneNumber} of {selectedTransaction.totalMilestones}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'release' ? 'Release Escrow Funds' : 'Refund Escrow Funds'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'release' 
                ? 'Are you sure you want to release the escrow funds to the freelancer?'
                : 'Are you sure you want to refund the escrow funds to the client?'
              }
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Amount:</span>
                  <span className="text-lg font-bold">{formatCurrency(selectedTransaction.amount)}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-foreground">Client:</span>
                  <span className="text-sm">{selectedTransaction.clientName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Freelancer:</span>
                  <span className="text-sm">{selectedTransaction.freelancerName}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>Cancel</Button>
            <Button 
              variant={actionType === 'release' ? 'default' : 'destructive'}
              onClick={confirmAction}
            >
              {actionType === 'release' ? 'Release Funds' : 'Refund Funds'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 