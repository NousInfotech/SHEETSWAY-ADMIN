'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle,
  DollarSign,
  Clock,
  User,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useFinanceHub } from '../hooks/useFinanceHub';
import { MilestonePayment } from '../types';

export function MilestonePaymentStatus() {
  const {
    getFilteredMilestonePayments,
    milestoneFilter,
    setMilestoneFilter,
    milestonePage,
    setMilestonePage,
    rowsPerPage,
    setRowsPerPage,
    approveMilestone,
    disputeMilestone
  } = useFinanceHub();

  const [selectedMilestone, setSelectedMilestone] = useState<MilestonePayment | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'dispute' | null>(null);
  const [disputeReason, setDisputeReason] = useState('');

  const { data: milestones, total, pageCount } = getFilteredMilestonePayments();

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
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      completed: 'default',
      disputed: 'destructive',
      failed: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleAction = (milestone: MilestonePayment, action: 'approve' | 'dispute') => {
    setSelectedMilestone(milestone);
    setActionType(action);
    setShowActionDialog(true);
  };

  const confirmAction = () => {
    if (selectedMilestone && actionType) {
      if (actionType === 'approve') {
        approveMilestone(selectedMilestone.id);
      } else {
        disputeMilestone(selectedMilestone.id, disputeReason);
      }
      setShowActionDialog(false);
      setSelectedMilestone(null);
      setActionType(null);
      setDisputeReason('');
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Milestone Payment Status
              </CardTitle>
              <CardDescription>
                Track milestone payments and manage approvals
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{total} milestones</Badge>
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
                value={milestoneFilter.clientName || ''}
                onChange={(e) => setMilestoneFilter({ ...milestoneFilter, clientName: e.target.value })}
                className="w-64"
              />
            </div>
            <Select value={milestoneFilter.status || 'all'} onValueChange={(value) => setMilestoneFilter({ ...milestoneFilter, status: value === 'all' ? undefined : value })}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMilestoneFilter({})}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>

          {/* Milestones Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Milestone</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Freelancer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {milestones.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No milestone payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  milestones.map((milestone) => (
                    <TableRow key={milestone.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {milestone.milestoneNumber} of {milestone.totalMilestones}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {milestone.clientName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {milestone.freelancerName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          {formatCurrency(milestone.amount)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={milestone.progress} className="w-20" />
                          <span className="text-sm text-muted-foreground">{milestone.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {formatDate(milestone.dueDate)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(milestone.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedMilestone(milestone);
                              setShowDetailsDialog(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {milestone.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleAction(milestone, 'approve')}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleAction(milestone, 'dispute')}
                              >
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Dispute
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
              <Select value={rowsPerPage.toString()} onValueChange={(value) => { setRowsPerPage(Number(value)); setMilestonePage(0); }}>
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
              <Button variant="outline" size="icon" onClick={() => setMilestonePage(0)} disabled={milestonePage === 0}>&laquo;</Button>
              <Button variant="outline" size="icon" onClick={() => setMilestonePage(p => Math.max(0, p - 1))} disabled={milestonePage === 0}>&lsaquo;</Button>
              <span className="text-sm">Page {milestonePage + 1} of {pageCount || 1}</span>
              <Button variant="outline" size="icon" onClick={() => setMilestonePage(p => Math.min(pageCount - 1, p + 1))} disabled={milestonePage >= pageCount - 1}>&rsaquo;</Button>
              <Button variant="outline" size="icon" onClick={() => setMilestonePage(pageCount - 1)} disabled={milestonePage >= pageCount - 1}>&raquo;</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestone Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Milestone Details</DialogTitle>
          </DialogHeader>
          {selectedMilestone && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Milestone ID</label>
                  <p className="text-sm text-muted-foreground">{selectedMilestone.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedMilestone.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Client</label>
                  <p className="text-sm text-muted-foreground">{selectedMilestone.clientName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Freelancer</label>
                  <p className="text-sm text-muted-foreground">{selectedMilestone.freelancerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Amount</label>
                  <p className="text-sm text-muted-foreground">{formatCurrency(selectedMilestone.amount)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Currency</label>
                  <p className="text-sm text-muted-foreground">{selectedMilestone.currency}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <p className="text-sm text-muted-foreground">{formatDate(selectedMilestone.dueDate)}</p>
                </div>
                {selectedMilestone.completedDate && (
                  <div>
                    <label className="text-sm font-medium">Completed Date</label>
                    <p className="text-sm text-muted-foreground">{formatDate(selectedMilestone.completedDate)}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Progress</label>
                <div className="flex items-center gap-2 mt-2">
                  <Progress value={selectedMilestone.progress} className="flex-1" />
                  <span className="text-sm text-muted-foreground">{selectedMilestone.progress}%</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <p className="text-sm text-muted-foreground mt-1">{selectedMilestone.description}</p>
              </div>
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
              {actionType === 'approve' ? 'Approve Milestone Payment' : 'Dispute Milestone Payment'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' 
                ? 'Are you sure you want to approve this milestone payment?'
                : 'Please provide a reason for disputing this milestone payment.'
              }
            </DialogDescription>
          </DialogHeader>
          {selectedMilestone && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Amount:</span>
                  <span className="text-lg font-bold">{formatCurrency(selectedMilestone.amount)}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-foreground">Client:</span>
                  <span className="text-sm">{selectedMilestone.clientName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Freelancer:</span>
                  <span className="text-sm">{selectedMilestone.freelancerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Progress:</span>
                  <span className="text-sm">{selectedMilestone.progress}%</span>
                </div>
              </div>
              {actionType === 'dispute' && (
                <div>
                  <label className="text-sm font-medium">Dispute Reason</label>
                  <Textarea
                    placeholder="Enter the reason for disputing this milestone..."
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="mt-2"
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>Cancel</Button>
            <Button 
              variant={actionType === 'approve' ? 'default' : 'destructive'}
              onClick={confirmAction}
              disabled={actionType === 'dispute' && !disputeReason.trim()}
            >
              {actionType === 'approve' ? 'Approve Payment' : 'Dispute Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 