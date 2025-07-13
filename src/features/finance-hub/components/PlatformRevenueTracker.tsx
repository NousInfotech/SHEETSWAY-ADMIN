'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  TrendingUp, 
  DollarSign, 
  BarChart3,
  Calendar,
  Eye,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Shield
} from 'lucide-react';
import { useFinanceHub } from '../hooks/useFinanceHub';
import { PlatformRevenue } from '../types';

export function PlatformRevenueTracker() {
  const {
    platformRevenue,
    financeStats
  } = useFinanceHub();

  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedRevenue, setSelectedRevenue] = useState<PlatformRevenue | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getGrowthIcon = (current: number, previous: number) => {
    if (current > previous) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (current < previous) return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getGrowthColor = (current: number, previous: number) => {
    if (current > previous) return 'text-green-600';
    if (current < previous) return 'text-red-600';
    return 'text-gray-600';
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const getFilteredRevenue = () => {
    if (!selectedPeriod || selectedPeriod === 'all') return platformRevenue;
    return platformRevenue.filter(revenue => revenue.period === selectedPeriod);
  };

  const filteredRevenue = getFilteredRevenue();
  const currentPeriod = filteredRevenue[0];
  const previousPeriod = platformRevenue.find(r => r.period !== currentPeriod?.period);

  return (
    <>
      <div className="grid gap-6">
        {/* Revenue Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentPeriod ? formatCurrency(currentPeriod.totalRevenue) : formatCurrency(0)}
              </div>
              {currentPeriod && previousPeriod && (
                <div className="flex items-center space-x-2 mt-2">
                  {getGrowthIcon(currentPeriod.totalRevenue, previousPeriod.totalRevenue)}
                  <span className={`text-sm ${getGrowthColor(currentPeriod.totalRevenue, previousPeriod.totalRevenue)}`}>
                    {formatPercentage(calculateGrowth(currentPeriod.totalRevenue, previousPeriod.totalRevenue))}
                  </span>
                  <span className="text-xs text-muted-foreground">vs previous period</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Escrow Fees</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentPeriod ? formatCurrency(currentPeriod.escrowFees) : formatCurrency(0)}
              </div>
              {currentPeriod && previousPeriod && (
                <div className="flex items-center space-x-2 mt-2">
                  {getGrowthIcon(currentPeriod.escrowFees, previousPeriod.escrowFees)}
                  <span className={`text-sm ${getGrowthColor(currentPeriod.escrowFees, previousPeriod.escrowFees)}`}>
                    {formatPercentage(calculateGrowth(currentPeriod.escrowFees, previousPeriod.escrowFees))}
                  </span>
                  <span className="text-xs text-muted-foreground">vs previous period</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentPeriod ? formatCurrency(currentPeriod.platformFees) : formatCurrency(0)}
              </div>
              {currentPeriod && previousPeriod && (
                <div className="flex items-center space-x-2 mt-2">
                  {getGrowthIcon(currentPeriod.platformFees, previousPeriod.platformFees)}
                  <span className={`text-sm ${getGrowthColor(currentPeriod.platformFees, previousPeriod.platformFees)}`}>
                    {formatPercentage(calculateGrowth(currentPeriod.platformFees, previousPeriod.platformFees))}
                  </span>
                  <span className="text-xs text-muted-foreground">vs previous period</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentPeriod ? formatCurrency(currentPeriod.averageTransactionValue) : formatCurrency(0)}
              </div>
              {currentPeriod && previousPeriod && (
                <div className="flex items-center space-x-2 mt-2">
                  {getGrowthIcon(currentPeriod.averageTransactionValue, previousPeriod.averageTransactionValue)}
                  <span className={`text-sm ${getGrowthColor(currentPeriod.averageTransactionValue, previousPeriod.averageTransactionValue)}`}>
                    {formatPercentage(calculateGrowth(currentPeriod.averageTransactionValue, previousPeriod.averageTransactionValue))}
                  </span>
                  <span className="text-xs text-muted-foreground">vs previous period</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Revenue Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Revenue Details
                </CardTitle>
                <CardDescription>
                  Detailed breakdown of platform revenue by period
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedPeriod || 'all'} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Periods</SelectItem>
                    {platformRevenue.map(revenue => (
                      <SelectItem key={revenue.period} value={revenue.period}>
                        {revenue.period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => setSelectedPeriod('')}>
                  <Filter className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Total Revenue</TableHead>
                    <TableHead>Escrow Fees</TableHead>
                    <TableHead>Platform Fees</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Avg Transaction</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRevenue.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No revenue data found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRevenue.map((revenue) => (
                      <TableRow key={revenue.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{revenue.period}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            {formatCurrency(revenue.totalRevenue)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            {formatCurrency(revenue.escrowFees)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            {formatCurrency(revenue.platformFees)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{revenue.transactionCount}</span>
                            <Badge variant="outline" className="text-xs">
                              {revenue.successfulTransactions} successful
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {Math.round((revenue.successfulTransactions / revenue.transactionCount) * 100)}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            {formatCurrency(revenue.averageTransactionValue)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRevenue(revenue);
                              setShowDetailsDialog(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Transaction Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Successful</span>
                <Badge variant="default" className="text-xs">
                  {currentPeriod?.successfulTransactions || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Failed</span>
                <Badge variant="destructive" className="text-xs">
                  {currentPeriod?.failedTransactions || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Disputed</span>
                <Badge variant="outline" className="text-xs">
                  {currentPeriod?.disputedTransactions || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Escrow Fees</span>
                <span className="text-sm font-medium">
                  {currentPeriod ? Math.round((currentPeriod.escrowFees / currentPeriod.totalRevenue) * 100) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Platform Fees</span>
                <span className="text-sm font-medium">
                  {currentPeriod ? Math.round((currentPeriod.platformFees / currentPeriod.totalRevenue) * 100) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Net Revenue</span>
                <span className="text-sm font-medium">
                  {currentPeriod ? Math.round(((currentPeriod.totalRevenue - currentPeriod.escrowFees - currentPeriod.platformFees) / currentPeriod.totalRevenue) * 100) : 0}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="text-sm font-medium text-green-600">
                  {currentPeriod ? Math.round((currentPeriod.successfulTransactions / currentPeriod.transactionCount) * 100) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Transaction</span>
                <span className="text-sm font-medium">
                  {currentPeriod ? formatCurrency(currentPeriod.averageTransactionValue) : formatCurrency(0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Volume</span>
                <span className="text-sm font-medium">
                  {currentPeriod ? formatCurrency(currentPeriod.totalRevenue) : formatCurrency(0)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Revenue Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revenue Details - {selectedRevenue?.period}</DialogTitle>
          </DialogHeader>
          {selectedRevenue && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Period</label>
                  <p className="text-sm text-muted-foreground">{selectedRevenue.period}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Currency</label>
                  <p className="text-sm text-muted-foreground">{selectedRevenue.currency}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Total Revenue</label>
                  <p className="text-sm text-muted-foreground">{formatCurrency(selectedRevenue.totalRevenue)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Escrow Fees</label>
                  <p className="text-sm text-muted-foreground">{formatCurrency(selectedRevenue.escrowFees)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Platform Fees</label>
                  <p className="text-sm text-muted-foreground">{formatCurrency(selectedRevenue.platformFees)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Transaction Count</label>
                  <p className="text-sm text-muted-foreground">{selectedRevenue.transactionCount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Successful Transactions</label>
                  <p className="text-sm text-muted-foreground">{selectedRevenue.successfulTransactions}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Failed Transactions</label>
                  <p className="text-sm text-muted-foreground">{selectedRevenue.failedTransactions}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Disputed Transactions</label>
                  <p className="text-sm text-muted-foreground">{selectedRevenue.disputedTransactions}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Average Transaction Value</label>
                  <p className="text-sm text-muted-foreground">{formatCurrency(selectedRevenue.averageTransactionValue)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Success Rate</label>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((selectedRevenue.successfulTransactions / selectedRevenue.transactionCount) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 