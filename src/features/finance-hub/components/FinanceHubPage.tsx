'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Shield, 
  Users, 
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useFinanceHub } from '../hooks/useFinanceHub';
import { EscrowLedger } from './EscrowLedger';
import { MilestonePaymentStatus } from './MilestonePaymentStatus';
import { PlatformRevenueTracker } from './PlatformRevenueTracker';
import { FailedDisputedPanel } from './FailedDisputedPanel';
import { FinanceStats } from './FinanceStats';
import * as XLSX from 'xlsx';

export default function FinanceHubPage() {
  const {
    financeStats,
    getFilteredEscrowTransactions,
    getFilteredMilestonePayments,
    getFilteredFailedTransactions,
    getFilteredDisputedTransactions,
    loadDataFromStorage
  } = useFinanceHub();

  const handleRefresh = () => {
    loadDataFromStorage();
    toast.success('Finance data refreshed successfully');
  };

  const handleExportData = () => {
    // Prepare data
    const escrow = getFilteredEscrowTransactions().data;
    const milestones = getFilteredMilestonePayments().data;
    const failed = getFilteredFailedTransactions().data;
    const disputed = getFilteredDisputedTransactions().data;
    const stats = [financeStats];

    // Create workbook and add sheets
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(escrow), 'Escrow');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(milestones), 'Milestones');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(failed), 'Failed');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(disputed), 'Disputed');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(stats), 'Stats');

    // Export to file
    XLSX.writeFile(wb, `finance-hub-export-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Finance data exported as Excel file!');
  };

  return (
    <div className="space-y-6 p-6 h-screen overflow-y-scroll">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance Hub</h1>
          <p className="text-muted-foreground">
            Monitor escrow funds, track payments, and manage financial operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Finance Stats Overview */}
      <FinanceStats stats={financeStats} />

      {/* Main Content Tabs */}
      <Tabs defaultValue="escrow-ledger" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="escrow-ledger" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Escrow Ledger
          </TabsTrigger>
          <TabsTrigger value="milestone-payments" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Milestone Payments
          </TabsTrigger>
          <TabsTrigger value="revenue-tracker" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Revenue Tracker
          </TabsTrigger>
          <TabsTrigger value="failed-disputed" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Failed & Disputed
          </TabsTrigger>
        </TabsList>

        {/* Escrow Ledger Tab */}
        <TabsContent value="escrow-ledger" className="space-y-6">
          <EscrowLedger />
        </TabsContent>

        {/* Milestone Payment Status Tab */}
        <TabsContent value="milestone-payments" className="space-y-6">
          <MilestonePaymentStatus />
        </TabsContent>

        {/* Platform Revenue Tracker Tab */}
        <TabsContent value="revenue-tracker" className="space-y-6">
          <PlatformRevenueTracker />
        </TabsContent>

        {/* Failed & Disputed Transactions Tab */}
        <TabsContent value="failed-disputed" className="space-y-6">
          <FailedDisputedPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}