'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle,
  DollarSign,
  Calendar,
  User,
  FileText,
  AlertCircle,
  Shield,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { useFinanceHub } from '../hooks/useFinanceHub';
import { FailedTransaction, DisputedTransaction } from '../types';

export function FailedDisputedPanel() {
  const {
    getFilteredFailedTransactions,
    getFilteredDisputedTransactions,
    failedFilter,
    setFailedFilter,
    disputedFilter,
    setDisputedFilter,
    failedPage,
    setFailedPage,
    disputedPage,
    setDisputedPage,
    rowsPerPage,
    setRowsPerPage,
    resolveFailedTransaction,
    refundFailedTransaction,
    resolveDispute
  } = useFinanceHub();

  const [selectedFailed, setSelectedFailed] = useState<FailedTransaction | null>(null);
  const [selectedDisputed, setSelectedDisputed] = useState<DisputedTransaction | null>(null);
  const [showFailedDetailsDialog, setShowFailedDetailsDialog] = useState(false);
  const [showDisputedDetailsDialog, setShowDisputedDetailsDialog] = useState(false);
  const [showFailedActionDialog, setShowFailedActionDialog] = useState(false);
  const [showDisputedActionDialog, setShowDisputedActionDialog] = useState(false);
  const [actionType, setActionType] = useState<'resolve' | 'refund' | 'release' | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const { data: failedTransactions, total: failedTotal, pageCount: failedPageCount } = getFilteredFailedTransactions();
  const { data: disputedTransactions, total: disputedTotal, pageCount: disputedPageCount } = getFilteredDisputedTransactions();

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
      resolved: 'default',
      refunded: 'destructive',
      open: 'outline',
      under_review: 'secondary'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </Badge>
    );
  };

  const handleFailedAction = (transaction: FailedTransaction, action: 'resolve' | 'refund') => {
    setSelectedFailed(transaction);
    setActionType(action);
    setShowFailedActionDialog(true);
  };

  const handleDisputedAction = (transaction: DisputedTransaction, action: 'release' | 'refund') => {
    setSelectedDisputed(transaction);
    setActionType(action);
    setShowDisputedActionDialog(true);
  };

  const confirmFailedAction = () => {
    if (selectedFailed && actionType) {
      if (actionType === 'resolve') {
        resolveFailedTransaction(selectedFailed.id, resolutionNotes);
      } else {
        refundFailedTransaction(selectedFailed.id);
      }
      setShowFailedActionDialog(false);
      setSelectedFailed(null);
      setActionType(null);
      setResolutionNotes('');
    }
  };

  const confirmDisputedAction = () => {
    if (selectedDisputed && actionType && (actionType === 'release' || actionType === 'refund')) {
      resolveDispute(selectedDisputed.id, resolutionNotes, actionType);
      setShowDisputedActionDialog(false);
      setSelectedDisputed(null);
      setActionType(null);
      setResolutionNotes('');
    }
  };

  return (
    <>
      <Tabs defaultValue="failed" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="failed" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Failed Transactions ({failedTotal})
          </TabsTrigger>
          <TabsTrigger value="disputed" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Disputed Transactions ({disputedTotal})
          </TabsTrigger>
        </TabsList>

        {/* Failed Transactions Tab */}
        <TabsContent value="failed" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Failed Transactions
                  </CardTitle>
                  <CardDescription>
                    Monitor and resolve failed payment transactions
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">{failedTotal} failed</Badge>
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
                    value={failedFilter.clientName || ''}
                    onChange={(e) => setFailedFilter({ ...failedFilter, clientName: e.target.value })}
                    className="w-64"
                  />
                </div>
                <Select value={failedFilter.status || 'all'} onValueChange={(value) => setFailedFilter({ ...failedFilter, status: value === 'all' ? undefined : value })}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFailedFilter({})}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>

              {/* Failed Transactions Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Txn ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {failedTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No failed transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      failedTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-mono text-xs">{transaction.transactionId}</TableCell>
                          <TableCell className="truncate max-w-[120px]">
                            {transaction.clientName}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              {formatCurrency(transaction.amount)}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button size="icon" variant="outline" onClick={() => { setSelectedFailed(transaction); setShowFailedDetailsDialog(true); }} title="View Details">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {transaction.status === 'pending' && (
                                <>
                                  <Button size="icon" variant="default" onClick={() => handleFailedAction(transaction, 'resolve')} title="Resolve">
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button size="icon" variant="destructive" onClick={() => handleFailedAction(transaction, 'refund')} title="Refund">
                                    <XCircle className="h-4 w-4" />
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
                  <Select value={rowsPerPage.toString()} onValueChange={(value) => { setRowsPerPage(Number(value)); setFailedPage(0); }}>
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
                  <Button variant="outline" size="icon" onClick={() => setFailedPage(0)} disabled={failedPage === 0}>&laquo;</Button>
                  <Button variant="outline" size="icon" onClick={() => setFailedPage(p => Math.max(0, p - 1))} disabled={failedPage === 0}>&lsaquo;</Button>
                  <span className="text-sm">Page {failedPage + 1} of {failedPageCount || 1}</span>
                  <Button variant="outline" size="icon" onClick={() => setFailedPage(p => Math.min(failedPageCount - 1, p + 1))} disabled={failedPage >= failedPageCount - 1}>&rsaquo;</Button>
                  <Button variant="outline" size="icon" onClick={() => setFailedPage(failedPageCount - 1)} disabled={failedPage >= failedPageCount - 1}>&raquo;</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Disputed Transactions Tab */}
        <TabsContent value="disputed" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-orange-500" />
                    Disputed Transactions
                  </CardTitle>
                  <CardDescription>
                    Review and resolve payment disputes
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-orange-600">{disputedTotal} disputed</Badge>
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
                    value={disputedFilter.clientName || ''}
                    onChange={(e) => setDisputedFilter({ ...disputedFilter, clientName: e.target.value })}
                    className="w-64"
                  />
                </div>
                <Select value={disputedFilter.status || 'all'} onValueChange={(value) => setDisputedFilter({ ...disputedFilter, status: value === 'all' ? undefined : value })}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDisputedFilter({})}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>

              {/* Disputed Transactions Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Txn ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {disputedTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No disputed transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      disputedTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-mono text-xs">{transaction.transactionId}</TableCell>
                          <TableCell className="truncate max-w-[120px]">
                            {transaction.clientName}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              {formatCurrency(transaction.amount)}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button size="icon" variant="outline" onClick={() => { setSelectedDisputed(transaction); setShowDisputedDetailsDialog(true); }} title="View Details">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {transaction.status === 'open' && (
                                <>
                                  <Button size="icon" variant="default" onClick={() => handleDisputedAction(transaction, 'release')} title="Release">
                                    <Shield className="h-4 w-4" />
                                  </Button>
                                  <Button size="icon" variant="destructive" onClick={() => handleDisputedAction(transaction, 'refund')} title="Refund">
                                    <XCircle className="h-4 w-4" />
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
                  <Select value={rowsPerPage.toString()} onValueChange={(value) => { setRowsPerPage(Number(value)); setDisputedPage(0); }}>
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
                  <Button variant="outline" size="icon" onClick={() => setDisputedPage(0)} disabled={disputedPage === 0}>&laquo;</Button>
                  <Button variant="outline" size="icon" onClick={() => setDisputedPage(p => Math.max(0, p - 1))} disabled={disputedPage === 0}>&lsaquo;</Button>
                  <span className="text-sm">Page {disputedPage + 1} of {disputedPageCount || 1}</span>
                  <Button variant="outline" size="icon" onClick={() => setDisputedPage(p => Math.min(disputedPageCount - 1, p + 1))} disabled={disputedPage >= disputedPageCount - 1}>&rsaquo;</Button>
                  <Button variant="outline" size="icon" onClick={() => setDisputedPage(disputedPageCount - 1)} disabled={disputedPage >= disputedPageCount - 1}>&raquo;</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Failed Transaction Details Dialog */}
      <Dialog open={showFailedDetailsDialog} onOpenChange={setShowFailedDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Failed Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedFailed && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Transaction ID</label>
                  <p className="text-sm text-muted-foreground">{selectedFailed.transactionId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <p className="text-sm text-muted-foreground">{selectedFailed.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Client</label>
                  <p className="text-sm text-muted-foreground">{selectedFailed.clientName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Freelancer</label>
                  <p className="text-sm text-muted-foreground">{selectedFailed.freelancerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Amount</label>
                  <p className="text-sm text-muted-foreground">{formatCurrency(selectedFailed.amount)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Currency</label>
                  <p className="text-sm text-muted-foreground">{selectedFailed.currency}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedFailed.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Error Code</label>
                  <p className="text-sm text-muted-foreground">{selectedFailed.errorCode}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Created</label>
                  <p className="text-sm text-muted-foreground">{formatDate(selectedFailed.createdAt)}</p>
                </div>
                {selectedFailed.resolvedAt && (
                  <div>
                    <label className="text-sm font-medium">Resolved</label>
                    <p className="text-sm text-muted-foreground">{formatDate(selectedFailed.resolvedAt)}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Failure Reason</label>
                <p className="text-sm text-muted-foreground mt-1">{selectedFailed.failureReason}</p>
              </div>
              {selectedFailed.adminNotes && (
                <div>
                  <label className="text-sm font-medium">Admin Notes</label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedFailed.adminNotes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFailedDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disputed Transaction Details Dialog */}
      <Dialog open={showDisputedDetailsDialog} onOpenChange={setShowDisputedDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disputed Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedDisputed && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Transaction ID</label>
                  <p className="text-sm text-muted-foreground">{selectedDisputed.transactionId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <p className="text-sm text-muted-foreground">{selectedDisputed.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Client</label>
                  <p className="text-sm text-muted-foreground">{selectedDisputed.clientName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Freelancer</label>
                  <p className="text-sm text-muted-foreground">{selectedDisputed.freelancerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Amount</label>
                  <p className="text-sm text-muted-foreground">{formatCurrency(selectedDisputed.amount)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Currency</label>
                  <p className="text-sm text-muted-foreground">{selectedDisputed.currency}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedDisputed.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Created</label>
                  <p className="text-sm text-muted-foreground">{formatDate(selectedDisputed.createdAt)}</p>
                </div>
                {selectedDisputed.resolvedAt && (
                  <div>
                    <label className="text-sm font-medium">Resolved</label>
                    <p className="text-sm text-muted-foreground">{formatDate(selectedDisputed.resolvedAt)}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Dispute Reason</label>
                <p className="text-sm text-muted-foreground mt-1">{selectedDisputed.disputeReason}</p>
              </div>
              {selectedDisputed.adminNotes && (
                <div>
                  <label className="text-sm font-medium">Admin Notes</label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedDisputed.adminNotes}</p>
                </div>
              )}
              {selectedDisputed.evidence && selectedDisputed.evidence.length > 0 && (
                <div>
                  <label className="text-sm font-medium">Evidence Files</label>
                  <div className="mt-2 space-y-1">
                    {selectedDisputed.evidence.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        {file}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisputedDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Failed Transaction Action Dialog */}
      <Dialog open={showFailedActionDialog} onOpenChange={setShowFailedActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'resolve' ? 'Resolve Failed Transaction' : 'Refund Failed Transaction'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'resolve' 
                ? 'Please provide resolution notes for this failed transaction.'
                : 'Are you sure you want to refund this failed transaction to the client?'
              }
            </DialogDescription>
          </DialogHeader>
          {selectedFailed && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Amount:</span>
                  <span className="text-lg font-bold">{formatCurrency(selectedFailed.amount)}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-foreground">Client:</span>
                  <span className="text-sm">{selectedFailed.clientName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Freelancer:</span>
                  <span className="text-sm">{selectedFailed.freelancerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Failure Reason:</span>
                  <span className="text-sm">{selectedFailed.failureReason}</span>
                </div>
              </div>
              {actionType === 'resolve' && (
                <div>
                  <label className="text-sm font-medium">Resolution Notes</label>
                  <Textarea
                    placeholder="Enter resolution notes..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    className="mt-2"
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFailedActionDialog(false)}>Cancel</Button>
            <Button 
              variant={actionType === 'resolve' ? 'default' : 'destructive'}
              onClick={confirmFailedAction}
              disabled={actionType === 'resolve' && !resolutionNotes.trim()}
            >
              {actionType === 'resolve' ? 'Resolve Transaction' : 'Refund Transaction'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disputed Transaction Action Dialog */}
      <Dialog open={showDisputedActionDialog} onOpenChange={setShowDisputedActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'release' ? 'Release Funds' : 'Refund Funds'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'release' 
                ? 'Are you sure you want to release the funds to the freelancer?'
                : 'Are you sure you want to refund the funds to the client?'
              }
            </DialogDescription>
          </DialogHeader>
          {selectedDisputed && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Amount:</span>
                  <span className="text-lg font-bold">{formatCurrency(selectedDisputed.amount)}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-foreground">Client:</span>
                  <span className="text-sm">{selectedDisputed.clientName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Freelancer:</span>
                  <span className="text-sm">{selectedDisputed.freelancerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Dispute Reason:</span>
                  <span className="text-sm">{selectedDisputed.disputeReason}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Resolution Notes</label>
                <Textarea
                  placeholder="Enter resolution notes..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisputedActionDialog(false)}>Cancel</Button>
            <Button 
              variant={actionType === 'release' ? 'default' : 'destructive'}
              onClick={confirmDisputedAction}
              disabled={!resolutionNotes.trim()}
            >
              {actionType === 'release' ? 'Release Funds' : 'Refund Funds'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 