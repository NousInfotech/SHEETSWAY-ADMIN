import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  EscrowTransaction,
  MilestonePayment,
  PlatformRevenue,
  FailedTransaction,
  DisputedTransaction,
  FinanceStats,
  TransactionFilter
} from '../types';
import {
  STORAGE_KEYS,
  mockEscrowTransactions,
  mockMilestonePayments,
  mockPlatformRevenue,
  mockFailedTransactions,
  mockDisputedTransactions,
  mockFinanceStats
} from '../constants';

export function useFinanceHub() {
  // State for all finance data
  const [escrowTransactions, setEscrowTransactions] = useState<EscrowTransaction[]>([]);
  const [milestonePayments, setMilestonePayments] = useState<MilestonePayment[]>([]);
  const [platformRevenue, setPlatformRevenue] = useState<PlatformRevenue[]>([]);
  const [failedTransactions, setFailedTransactions] = useState<FailedTransaction[]>([]);
  const [disputedTransactions, setDisputedTransactions] = useState<DisputedTransaction[]>([]);
  const [financeStats, setFinanceStats] = useState<FinanceStats>(mockFinanceStats);

  // Filter states
  const [escrowFilter, setEscrowFilter] = useState<TransactionFilter>({});
  const [milestoneFilter, setMilestoneFilter] = useState<TransactionFilter>({});
  const [failedFilter, setFailedFilter] = useState<TransactionFilter>({});
  const [disputedFilter, setDisputedFilter] = useState<TransactionFilter>({});

  // Pagination states
  const [escrowPage, setEscrowPage] = useState(0);
  const [milestonePage, setMilestonePage] = useState(0);
  const [failedPage, setFailedPage] = useState(0);
  const [disputedPage, setDisputedPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Load data from localStorage on mount
  useEffect(() => {
    loadDataFromStorage();
  }, []);

  const loadDataFromStorage = () => {
    try {
      const storedEscrow = localStorage.getItem(STORAGE_KEYS.ESCROW_TRANSACTIONS);
      const storedMilestones = localStorage.getItem(STORAGE_KEYS.MILESTONE_PAYMENTS);
      const storedRevenue = localStorage.getItem(STORAGE_KEYS.PLATFORM_REVENUE);
      const storedFailed = localStorage.getItem(STORAGE_KEYS.FAILED_TRANSACTIONS);
      const storedDisputed = localStorage.getItem(STORAGE_KEYS.DISPUTED_TRANSACTIONS);
      const storedStats = localStorage.getItem(STORAGE_KEYS.FINANCE_STATS);

      if (storedEscrow) {
        setEscrowTransactions(JSON.parse(storedEscrow));
      } else {
        setEscrowTransactions(mockEscrowTransactions);
      }

      if (storedMilestones) {
        setMilestonePayments(JSON.parse(storedMilestones));
      } else {
        setMilestonePayments(mockMilestonePayments);
      }

      if (storedRevenue) {
        setPlatformRevenue(JSON.parse(storedRevenue));
      } else {
        setPlatformRevenue(mockPlatformRevenue);
      }

      if (storedFailed) {
        setFailedTransactions(JSON.parse(storedFailed));
      } else {
        setFailedTransactions(mockFailedTransactions);
      }

      if (storedDisputed) {
        setDisputedTransactions(JSON.parse(storedDisputed));
      } else {
        setDisputedTransactions(mockDisputedTransactions);
      }

      if (storedStats) {
        setFinanceStats(JSON.parse(storedStats));
      } else {
        setFinanceStats(mockFinanceStats);
      }
    } catch (error) {
      console.error('Error loading finance data from localStorage:', error);
    }
  };

  const saveToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Escrow Transaction Operations
  const releaseEscrow = (transactionId: string) => {
    const updatedTransactions = escrowTransactions.map(transaction =>
      transaction.id === transactionId
        ? { ...transaction, status: 'released' as const, updatedAt: new Date().toISOString() }
        : transaction
    );
    setEscrowTransactions(updatedTransactions);
    saveToStorage(STORAGE_KEYS.ESCROW_TRANSACTIONS, updatedTransactions);
    toast.success('Escrow funds released successfully');
  };

  const refundEscrow = (transactionId: string) => {
    const updatedTransactions = escrowTransactions.map(transaction =>
      transaction.id === transactionId
        ? { ...transaction, status: 'refunded' as const, updatedAt: new Date().toISOString() }
        : transaction
    );
    setEscrowTransactions(updatedTransactions);
    saveToStorage(STORAGE_KEYS.ESCROW_TRANSACTIONS, updatedTransactions);
    toast.success('Escrow funds refunded successfully');
  };

  // Milestone Payment Operations
  const approveMilestone = (milestoneId: string) => {
    const updatedMilestones = milestonePayments.map(milestone =>
      milestone.id === milestoneId
        ? { 
            ...milestone, 
            status: 'completed' as const, 
            completedDate: new Date().toISOString(),
            progress: 100
          }
        : milestone
    );
    setMilestonePayments(updatedMilestones);
    saveToStorage(STORAGE_KEYS.MILESTONE_PAYMENTS, updatedMilestones);
    toast.success('Milestone payment approved');
  };

  const disputeMilestone = (milestoneId: string, reason: string) => {
    const updatedMilestones = milestonePayments.map(milestone =>
      milestone.id === milestoneId
        ? { ...milestone, status: 'disputed' as const }
        : milestone
    );
    setMilestonePayments(updatedMilestones);
    saveToStorage(STORAGE_KEYS.MILESTONE_PAYMENTS, updatedMilestones);
    toast.success('Milestone payment disputed');
  };

  // Failed Transaction Operations
  const resolveFailedTransaction = (transactionId: string, resolution: string) => {
    const updatedFailed = failedTransactions.map(transaction =>
      transaction.id === transactionId
        ? { 
            ...transaction, 
            status: 'resolved' as const, 
            resolvedAt: new Date().toISOString(),
            adminNotes: resolution
          }
        : transaction
    );
    setFailedTransactions(updatedFailed);
    saveToStorage(STORAGE_KEYS.FAILED_TRANSACTIONS, updatedFailed);
    toast.success('Failed transaction resolved');
  };

  const refundFailedTransaction = (transactionId: string) => {
    const updatedFailed = failedTransactions.map(transaction =>
      transaction.id === transactionId
        ? { 
            ...transaction, 
            status: 'refunded' as const, 
            resolvedAt: new Date().toISOString(),
            adminNotes: 'Full refund issued to client'
          }
        : transaction
    );
    setFailedTransactions(updatedFailed);
    saveToStorage(STORAGE_KEYS.FAILED_TRANSACTIONS, updatedFailed);
    toast.success('Failed transaction refunded');
  };

  // Disputed Transaction Operations
  const resolveDispute = (disputeId: string, resolution: string, action: 'release' | 'refund') => {
    const updatedDisputed = disputedTransactions.map(dispute =>
      dispute.id === disputeId
        ? { 
            ...dispute, 
            status: 'resolved' as const, 
            resolvedAt: new Date().toISOString(),
            adminNotes: resolution
          }
        : dispute
    );
    setDisputedTransactions(updatedDisputed);
    saveToStorage(STORAGE_KEYS.DISPUTED_TRANSACTIONS, updatedDisputed);
    
    // Also update the related escrow transaction
    if (action === 'release') {
      const dispute = disputedTransactions.find(d => d.id === disputeId);
      if (dispute) {
        const updatedEscrow = escrowTransactions.map(transaction =>
          transaction.id === dispute.transactionId
            ? { ...transaction, status: 'released' as const, updatedAt: new Date().toISOString() }
            : transaction
        );
        setEscrowTransactions(updatedEscrow);
        saveToStorage(STORAGE_KEYS.ESCROW_TRANSACTIONS, updatedEscrow);
      }
    }
    
    toast.success(`Dispute resolved - ${action === 'release' ? 'funds released' : 'refund issued'}`);
  };

  // Filter functions
  const filterTransactions = <T extends { status: string; amount: number; clientName: string; freelancerName: string }>(
    transactions: T[],
    filter: TransactionFilter
  ): T[] => {
    return transactions.filter(transaction => {
      if (filter.status && transaction.status !== filter.status) return false;
      if (filter.clientName && !transaction.clientName.toLowerCase().includes(filter.clientName.toLowerCase())) return false;
      if (filter.freelancerName && !transaction.freelancerName.toLowerCase().includes(filter.freelancerName.toLowerCase())) return false;
      if (filter.amountRange) {
        if (transaction.amount < filter.amountRange.min || transaction.amount > filter.amountRange.max) return false;
      }
      if (filter.dateRange && 'createdAt' in transaction) {
        const transactionDate = new Date((transaction as any).createdAt);
        const startDate = new Date(filter.dateRange.start);
        const endDate = new Date(filter.dateRange.end);
        if (transactionDate < startDate || transactionDate > endDate) return false;
      }
      return true;
    });
  };

  // Get filtered and paginated data
  const getFilteredEscrowTransactions = () => {
    const filtered = filterTransactions(escrowTransactions, escrowFilter);
    const start = escrowPage * rowsPerPage;
    const end = start + rowsPerPage;
    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      pageCount: Math.ceil(filtered.length / rowsPerPage)
    };
  };

  const getFilteredMilestonePayments = () => {
    const filtered = filterTransactions(milestonePayments, milestoneFilter);
    const start = milestonePage * rowsPerPage;
    const end = start + rowsPerPage;
    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      pageCount: Math.ceil(filtered.length / rowsPerPage)
    };
  };

  const getFilteredFailedTransactions = () => {
    const filtered = filterTransactions(failedTransactions, failedFilter);
    const start = failedPage * rowsPerPage;
    const end = start + rowsPerPage;
    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      pageCount: Math.ceil(filtered.length / rowsPerPage)
    };
  };

  const getFilteredDisputedTransactions = () => {
    const filtered = filterTransactions(disputedTransactions, disputedFilter);
    const start = disputedPage * rowsPerPage;
    const end = start + rowsPerPage;
    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      pageCount: Math.ceil(filtered.length / rowsPerPage)
    };
  };

  return {
    // State
    escrowTransactions,
    milestonePayments,
    platformRevenue,
    failedTransactions,
    disputedTransactions,
    financeStats,
    
    // Filters
    escrowFilter,
    setEscrowFilter,
    milestoneFilter,
    setMilestoneFilter,
    failedFilter,
    setFailedFilter,
    disputedFilter,
    setDisputedFilter,
    
    // Pagination
    escrowPage,
    setEscrowPage,
    milestonePage,
    setMilestonePage,
    failedPage,
    setFailedPage,
    disputedPage,
    setDisputedPage,
    rowsPerPage,
    setRowsPerPage,
    
    // Operations
    releaseEscrow,
    refundEscrow,
    approveMilestone,
    disputeMilestone,
    resolveFailedTransaction,
    refundFailedTransaction,
    resolveDispute,
    
    // Filtered data
    getFilteredEscrowTransactions,
    getFilteredMilestonePayments,
    getFilteredFailedTransactions,
    getFilteredDisputedTransactions,
    
    // Utilities
    loadDataFromStorage,
    saveToStorage
  };
} 