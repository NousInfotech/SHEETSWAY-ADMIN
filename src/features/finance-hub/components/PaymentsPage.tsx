'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { 
  CreditCard, 
  Lock, 
  TrendingUp, 
  RefreshCw,
  Download,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { usePayments } from '../hooks/usePayments';
import { PaymentStats } from './PaymentStats';
import { PaymentTable } from './PaymentTable';
import { EscrowPaymentsTable } from './EscrowPaymentsTable';
import { PaymentDetailsModal } from './PaymentDetailsModal';
import type { PaymentFilter } from '../types';

export function PaymentsPage() {
  const {
    // Data
    payments,
    escrowPayments,
    stats,
    
    // Loading states
    loadingPayments,
    loadingEscrowPayments,
    authLoading,
    
    // Filter and pagination
    filter,
    currentPage,
    totalPages,
    totalEscrowPages,
    
    // Actions
    loadPayments,
    loadEscrowPayments,
    refreshData,
    
    // Event handlers
    onFilterChange,
    onPageChange,
    onViewPayment,
    onViewEscrow,
  } = usePayments();

  // Modal state
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Handle payment view
  const handleViewPayment = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setIsPaymentModalOpen(true);
  };

  // Handle escrow view
  const handleViewEscrow = (escrowId: string) => {
    // This could open an escrow details modal or navigate to escrow page
    console.log('Viewing escrow:', escrowId);
  };

  // Handle filter changes
  const handlePaymentFilterChange = (newFilter: PaymentFilter) => {
    onFilterChange(newFilter);
  };

  const handleEscrowFilterChange = (newFilter: PaymentFilter) => {
    onFilterChange(newFilter);
  };

  // Handle page changes
  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  return (
    <div className="w-full bg-background p-6 space-y-6 h-[calc(100vh-120px)] overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Payments Management</h1>
          <p className="text-muted-foreground max-w-2xl">
            Monitor and manage all payment transactions and escrow statuses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={refreshData}
            disabled={loadingPayments || loadingEscrowPayments}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${(loadingPayments || loadingEscrowPayments) ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Error Banner for Backend Issues */}
      {/* {!loadingPayments && !loadingEscrowPayments && !authLoading && 
       (payments.length === 0 || escrowPayments.length === 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-amber-800">
                Backend Database Query Issue
              </h3>
              <p className="text-sm text-amber-700 mt-1">
                Escrow payments are not loading due to a backend database query error. 
                This is a known Prisma validation issue with nested where clauses. 
                Regular payments are working fine. Our team is investigating the fix.
              </p>
              <div className="mt-2 text-xs text-amber-600">
                <strong>Technical Details:</strong> PrismaClientValidationError - Invalid nested where clause in escrowStatus.findMany()
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Loading State - Show skeleton while data is loading */}
      {(loadingPayments || loadingEscrowPayments || authLoading) && (
        <div className="space-y-6">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-muted rounded-lg animate-pulse" />
        </div>
      )}

      {/* Only show content when not loading */}
      {!loadingPayments && !loadingEscrowPayments && !authLoading && (
        <>
          {/* Payment Statistics */}
          <PaymentStats 
            stats={stats} 
            isLoading={false} 
          />

          {/* Main Content Tabs */}
          <Tabs defaultValue="payments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            All Payments
          </TabsTrigger>
          <TabsTrigger value="escrow" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Escrow & Payments
          </TabsTrigger>
        </TabsList>

        {/* All Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Transactions
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                View and manage all payment transactions across the platform
              </p>
            </CardHeader>
            <CardContent>
              <PaymentTable
                payments={payments}
                isLoading={loadingPayments}
                filter={filter}
                onFilterChange={handlePaymentFilterChange}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onViewPayment={handleViewPayment}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Escrow & Payments Tab */}
        <TabsContent value="escrow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Escrow Statuses with Payments
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Monitor escrow funds and payment statuses for engagements
              </p>
            </CardHeader>
            <CardContent>
              <EscrowPaymentsTable
                escrowPayments={escrowPayments}
                isLoading={loadingEscrowPayments}
                filter={filter}
                onFilterChange={handleEscrowFilterChange}
                currentPage={currentPage}
                totalPages={totalEscrowPages}
                onPageChange={handlePageChange}
                onViewPayment={handleViewPayment}
                onViewEscrow={handleViewEscrow}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </>
      )}

      {/* Payment Details Modal */}
      <PaymentDetailsModal
        paymentId={selectedPaymentId}
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedPaymentId(null);
        }}
      />
    </div>
  );
}
