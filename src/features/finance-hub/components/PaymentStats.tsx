import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  RotateCcw 
} from 'lucide-react';
import type { PaymentStats } from '../types';

interface PaymentStatsProps {
  stats: PaymentStats;
  isLoading?: boolean;
}

export function PaymentStats({ stats, isLoading = false }: PaymentStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }



  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: stats.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Payments */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
          <div className="p-2 bg-blue-100 rounded-full">
            <CreditCard className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{stats.totalPayments.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            All time payments
          </p>
        </CardContent>
      </Card>

      {/* Total Amount */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          <div className="p-2 bg-green-100 rounded-full">
            <DollarSign className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{formatCurrency(stats.totalAmount)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.currency} total value
          </p>
        </CardContent>
      </Card>

      {/* Average Payment Value */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Payment</CardTitle>
          <div className="p-2 bg-purple-100 rounded-full">
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-600">{formatCurrency(stats.averagePaymentValue)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Per transaction
          </p>
        </CardContent>
      </Card>

      {/* Payment Status Breakdown */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status Breakdown</CardTitle>
          <div className="p-2 bg-orange-100 rounded-full">
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Successful</span>
            </div>
            <Badge variant="secondary" className="text-sm font-bold bg-green-100 text-green-800">
              {stats.successfulPayments.toLocaleString()}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <Badge variant="secondary" className="text-sm font-bold bg-yellow-100 text-yellow-800">
              {stats.pendingPayments.toLocaleString()}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Failed</span>
            </div>
            <Badge variant="secondary" className="text-sm font-bold bg-red-100 text-red-800">
              {stats.failedPayments.toLocaleString()}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Refunded</span>
            </div>
            <Badge variant="secondary" className="text-sm font-bold bg-blue-100 text-blue-800">
              {stats.refundedPayments.toLocaleString()}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
