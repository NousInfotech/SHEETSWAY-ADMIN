'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';
import { 
  CreditCard, 
  Calendar, 
  Hash, 
  DollarSign, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  ExternalLink,
  Copy,
  Download,
  Clock,
  Shield,
  Info,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { paymentService } from '../services/paymentService';
import type { Payment, PaymentWithEscrow } from '../types';

interface PaymentDetailsModalProps {
  paymentId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentDetailsModal({ 
  paymentId, 
  isOpen, 
  onClose 
}: PaymentDetailsModalProps) {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && paymentId) {
      loadPaymentDetails();
    }
  }, [isOpen, paymentId]);

  const loadPaymentDetails = async () => {
    if (!paymentId) return;
    
    try {
      setIsLoading(true);
      const paymentData = await paymentService.getPaymentById(paymentId);
      setPayment(paymentData);
    } catch (error) {
      console.error('Error loading payment details:', error);
      toast.error('Failed to load payment details');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="h-7 w-7 text-green-600" />;
      case 'pending':
        return <Clock className="h-7 w-7 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-7 w-7 text-red-600" />;
      case 'refunded':
        return <RotateCcw className="h-7 w-7 text-blue-600" />;
      default:
        return <AlertCircle className="h-7 w-7 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      succeeded: { 
        variant: 'default' as const, 
        label: 'Payment Successful', 
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="h-4 w-4 mr-2" />
      },
      pending: { 
        variant: 'secondary' as const, 
        label: 'Payment Pending', 
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Clock className="h-4 w-4 mr-2" />
      },
      failed: { 
        variant: 'destructive' as const, 
        label: 'Payment Failed', 
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className="h-4 w-4 mr-2" />
      },
      refunded: { 
        variant: 'outline' as const, 
        label: 'Payment Refunded', 
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <RotateCcw className="h-4 w-4 mr-2" />
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { 
      variant: 'secondary' as const, 
      label: status,
      className: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: <AlertCircle className="h-4 w-4 mr-2" />
    };

    return (
      <Badge variant={config.variant} className={`${config.className} px-4 py-2 text-sm font-semibold flex items-center`}>
        {config.icon}
        {config.label}
      </Badge>
    );
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleClose = () => {
    setPayment(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-0">
        <DialogHeader className="px-8 py-8 border-b bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <DialogTitle className="flex items-center gap-4 text-3xl font-bold text-gray-900">
            <div className="p-3 bg-white rounded-xl shadow-lg">
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <div>Payment Details</div>
              <div className="text-sm font-normal text-gray-600 mt-1">
                Transaction Information & Status
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="p-8 space-y-8">
            {/* Payment Status Header Skeleton */}
            <div className="border-0 shadow-xl bg-gradient-to-r from-white to-gray-50 rounded-xl p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 bg-gray-200 rounded-full animate-pulse" />
                  <div className="space-y-3">
                    <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="text-center lg:text-right">
                  <div className="h-16 w-40 bg-gray-200 rounded animate-pulse mb-3" />
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mx-auto lg:ml-auto" />
                </div>
              </div>
            </div>
            
            {/* Payment Information Skeleton */}
            <div className="border-0 shadow-lg rounded-xl p-8">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
                    <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
              </div>
            </div>
          </div>
        ) : payment ? (
          <div className="p-8 space-y-8">
            {/* Payment Status Header */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-white rounded-full shadow-lg">
                    {getStatusIcon(payment.status)}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                          {getStatusBadge(payment.status)}
                        </h2>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <span className="text-base font-medium">{formatDate(payment.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center lg:text-right">
                    <div className="text-5xl font-bold text-gray-900 mb-2">
                      {formatCurrency(payment.amount, payment.currency)}
                    </div>
                    <div className="flex items-center justify-center lg:justify-end gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <p className="text-lg text-gray-600 font-semibold uppercase">{payment.currency}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
              <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Hash className="h-6 w-6 text-blue-600" />
                  </div>
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                      <Hash className="h-4 w-4 text-blue-500" />
                      Payment ID
                    </label>
                    <div className="flex items-center gap-3">
                      <code className="flex-1 text-sm bg-gray-100 px-4 py-3 rounded-xl font-mono text-gray-800 border-2 border-gray-200 break-all">
                        {payment.id}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(payment.id)}
                        className="hover:bg-blue-100 hover:text-blue-700 flex-shrink-0 p-3"
                      >
                        <Copy className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-green-500" />
                      Stripe Payment ID
                    </label>
                    <div className="flex items-center gap-3">
                      <code className="flex-1 text-sm bg-gray-100 px-4 py-3 rounded-xl font-mono text-gray-800 border-2 border-gray-200 break-all">
                        {payment.stripePaymentId}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(payment.stripePaymentId)}
                        className="hover:bg-green-100 hover:text-green-700 flex-shrink-0 p-3"
                      >
                        <Copy className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-purple-500" />
                      Payment Method
                    </label>
                    <div className="mt-2">
                      {payment.paymentMethod ? (
                        <Badge variant="outline" className="capitalize px-4 py-3 text-base font-semibold bg-purple-50 text-purple-700 border-purple-200">
                          {payment.paymentMethod.replace('_', ' ')}
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-500">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="italic">Not specified</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      Created
                    </label>
                    <div className="mt-2 text-base text-gray-800 bg-orange-50 px-4 py-3 rounded-xl border border-orange-200">
                      {formatDate(payment.createdAt)}
                    </div>
                  </div>
                </div>

                {payment.updatedAt !== payment.createdAt && (
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      Last Updated
                    </label>
                    <div className="mt-2 text-base text-gray-800 bg-blue-50 px-4 py-3 rounded-xl border border-blue-200">
                      {formatDate(payment.updatedAt)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Escrow Information */}
            {payment.escrow && payment.escrow.id && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl overflow-hidden">
                <CardHeader className="pb-6 bg-gradient-to-r from-green-100 to-emerald-100">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                    <div className="p-2 bg-green-200 rounded-lg">
                      <Shield className="h-6 w-6 text-green-700" />
                    </div>
                    Escrow Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        Escrow ID
                      </label>
                      <div className="flex items-center gap-3">
                        <code className="flex-1 text-sm bg-white px-4 py-3 rounded-xl font-mono text-gray-800 border-2 border-green-300 break-all">
                          {payment.escrow?.id}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(payment.escrow?.id || '')}
                          className="hover:bg-green-200 hover:text-green-800 flex-shrink-0 p-3"
                        >
                          <Copy className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                        <Hash className="h-4 w-4 text-emerald-600" />
                        Engagement ID
                      </label>
                      <div className="flex items-center gap-3">
                        <code className="flex-1 text-sm bg-white px-4 py-3 rounded-xl font-mono text-gray-800 border-2 border-green-300 break-all">
                          {payment.escrow?.engagementId}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(payment.escrow?.engagementId || '')}
                          className="hover:bg-green-200 hover:text-green-800 flex-shrink-0 p-3"
                        >
                          <Copy className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        Status
                      </label>
                      <div className="mt-2">
                        <div className="flex items-center gap-3">
                          {payment.escrow?.isReleased ? (
                            <Badge className="px-4 py-3 bg-green-100 text-green-800 border-2 border-green-300 text-base font-semibold flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              Released
                            </Badge>
                          ) : payment.escrow?.underDispute ? (
                            <Badge className="px-4 py-3 bg-red-100 text-red-800 border-2 border-red-300 text-base font-semibold flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              Under Dispute
                            </Badge>
                          ) : (
                            <Badge className="px-4 py-3 bg-yellow-100 text-yellow-800 border-2 border-yellow-300 text-base font-semibold flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              Held
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-teal-600" />
                        Created
                      </label>
                      <div className="mt-2 text-base text-gray-800 bg-white px-4 py-3 rounded-xl border-2 border-green-300">
                        {formatDate(payment.escrow?.createdAt || '')}
                      </div>
                    </div>
                  </div>

                  {payment.escrow?.releaseDate && (
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        Release Date
                      </label>
                      <div className="mt-2 text-base text-gray-800 bg-white px-4 py-3 rounded-xl border-2 border-green-300">
                        {formatDate(payment.escrow.releaseDate)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Payment Metadata */}
            {payment.paymentMeta && Object.keys(payment.paymentMeta).length > 0 && (
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="pb-6 bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Info className="h-6 w-6 text-purple-600" />
                    </div>
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="bg-gray-100 p-6 rounded-xl border-2 border-gray-200 overflow-hidden">
                    <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
                    {JSON.stringify(payment.paymentMeta, null, 2)}
                  </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-8 border-t-2 border-gray-200">
              <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto px-8 py-3 text-base font-semibold">
                Close
              </Button>
              <Button className="w-full sm:w-auto px-8 py-3 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                <Download className="h-5 w-5 mr-3" />
                Export Details
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <AlertCircle className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <p className="text-gray-600 text-xl font-semibold">Payment not found</p>
            <p className="text-gray-500 text-base mt-2">The requested payment could not be loaded</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
