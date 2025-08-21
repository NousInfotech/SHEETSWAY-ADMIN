"use client";

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  UserIcon,
  BriefcaseIcon,
  CalendarIcon,
  FileTextIcon,
  MessageSquareIcon,
  ShieldCheckIcon,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  AlertCircle
} from "lucide-react";

import { useDisputes } from "@/features/finance-hub/hooks/useDisputes";
import { Dispute } from "@/features/finance-hub/services/disputesService";

export default function DisputesEscalationPage() {
  const [activeTab, setActiveTab] = useState('open');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDisputeDetails, setShowDisputeDetails] = useState(false);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolutionAction, setResolutionAction] = useState<'release' | 'refund' | 'hold'>('hold');

  const {
    disputes,
    loading,
    error,
    stats,
    updateDisputeStatus,
    resolveDispute,
    clearError,
    getDisputesByStatus,
    searchDisputes
  } = useDisputes();

  // Get filtered disputes based on active tab
  const getCurrentDisputes = () => {
    if (activeTab === 'all') return disputes;
    return getDisputesByStatus(activeTab);
  };

  // Get searched disputes
  const getSearchedDisputes = () => {
    if (!searchTerm.trim()) return getCurrentDisputes();
    return searchDisputes(searchTerm);
  };

  const currentDisputes = getSearchedDisputes();

  // Handle dispute resolution
  const handleResolveDispute = async () => {
    if (!selectedDispute) return;
    
    try {
      await resolveDispute(selectedDispute.id, resolutionNotes, resolutionAction);
      setShowResolveDialog(false);
      setSelectedDispute(null);
      setResolutionNotes('');
      setResolutionAction('hold');
    } catch (error) {
      console.error('Failed to resolve dispute:', error);
    }
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Open</Badge>;
      case 'under_review':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Under Review</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Resolved</Badge>;
      case 'refunded':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get type badge
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'escrow':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Escrow</Badge>;
      case 'milestone':
        return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">Milestone</Badge>;
      case 'payment':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Payment</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Page Heading */}
      <Heading
        title="Dispute Manager"
        description="Review, manage, and resolve disputes between clients and auditors."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Disputes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Open</p>
                <p className="text-2xl font-bold text-red-600">{stats.open}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.underReview}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(stats.totalAmount, 'USD')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-red-800">{error}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={clearError}>
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search & Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search disputes by client, freelancer, or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setSearchTerm('')}
              disabled={!searchTerm}
            >
              Clear Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dispute Table Section */}
      <section className="w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All ({disputes.length})</TabsTrigger>
            <TabsTrigger value="open">Open ({stats.open})</TabsTrigger>
            <TabsTrigger value="under_review">Under Review ({stats.underReview})</TabsTrigger>
            <TabsTrigger value="resolved">Resolved ({stats.resolved})</TabsTrigger>
            <TabsTrigger value="refunded">Refunded ({stats.refunded})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <Card>
              <CardContent className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading disputes...</p>
                  </div>
                ) : currentDisputes.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Transaction ID</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Freelancer</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentDisputes.map((dispute) => (
                          <TableRow key={dispute.id}>
                            <TableCell className="font-mono text-xs">{dispute.transactionId}</TableCell>
                            <TableCell>{getTypeBadge(dispute.type)}</TableCell>
                            <TableCell className="truncate max-w-[120px]">
                              {dispute.clientName}
                            </TableCell>
                            <TableCell className="truncate max-w-[120px]">
                              {dispute.freelancerName}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                {formatCurrency(dispute.amount, dispute.currency)}
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(dispute.status)}</TableCell>
                            <TableCell>{formatDate(dispute.createdAt)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedDispute(dispute);
                                    setShowDisputeDetails(true);
                                  }}
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {dispute.status === 'open' && (
                                  <>
                                    <Button
                                      size="icon"
                                      variant="default"
                                      onClick={() => {
                                        setSelectedDispute(dispute);
                                        setResolutionAction('release');
                                        setShowResolveDialog(true);
                                      }}
                                      title="Release Funds"
                                    >
                                      <ShieldCheckIcon className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="destructive"
                                      onClick={() => {
                                        setSelectedDispute(dispute);
                                        setResolutionAction('refund');
                                        setShowResolveDialog(true);
                                      }}
                                      title="Refund Client"
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileTextIcon className="inline w-8 h-8 mr-2" />
                    {searchTerm ? 'No disputes found matching your search.' : 'No disputes found for the selected status.'}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Dispute Details Dialog */}
      <Dialog open={showDisputeDetails} onOpenChange={setShowDisputeDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dispute Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected dispute.
            </DialogDescription>
          </DialogHeader>
          {selectedDispute && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Transaction ID</Label>
                  <p className="text-sm text-gray-900 font-mono">{selectedDispute.transactionId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <div className="mt-1">{getTypeBadge(selectedDispute.type)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Client</Label>
                  <p className="text-sm text-gray-900">{selectedDispute.clientName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Freelancer</Label>
                  <p className="text-sm text-gray-900">{selectedDispute.freelancerName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Amount</Label>
                  <p className="text-sm text-gray-900">
                    {formatCurrency(selectedDispute.amount, selectedDispute.currency)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedDispute.status)}</div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Dispute Reason</Label>
                <p className="text-sm text-gray-900 mt-1">{selectedDispute.disputeReason}</p>
              </div>
              
              {selectedDispute.evidence && selectedDispute.evidence.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Evidence</Label>
                  <div className="mt-1 space-y-1">
                    {selectedDispute.evidence.map((evidence, index) => (
                      <Badge key={index} variant="outline" className="mr-2">
                        {evidence}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedDispute.adminNotes && (
                <div>
                  <Label className="text-sm font-medium">Admin Notes</Label>
                  <p className="text-sm text-gray-900 mt-1">{selectedDispute.adminNotes}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="text-sm text-gray-900">{formatDate(selectedDispute.createdAt)}</p>
                </div>
                {selectedDispute.resolvedAt && (
                  <div>
                    <Label className="text-sm font-medium">Resolved</Label>
                    <p className="text-sm text-gray-900">{formatDate(selectedDispute.resolvedAt)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisputeDetails(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Dispute Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Dispute</DialogTitle>
            <DialogDescription>
              {resolutionAction === 'release' && 'Release funds to the freelancer.'}
              {resolutionAction === 'refund' && 'Refund the client.'}
              {resolutionAction === 'hold' && 'Hold the funds for further review.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="resolution-notes">Resolution Notes</Label>
              <Textarea
                id="resolution-notes"
                placeholder="Enter detailed notes about the resolution..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResolveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleResolveDispute}>
              {resolutionAction === 'release' && 'Release Funds'}
              {resolutionAction === 'refund' && 'Refund Client'}
              {resolutionAction === 'hold' && 'Hold Funds'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
