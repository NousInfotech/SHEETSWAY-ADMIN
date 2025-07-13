export interface EscrowTransaction {
  id: string;
  engagementId: string;
  clientName: string;
  freelancerName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'released' | 'refunded' | 'disputed' | 'failed';
  createdAt: string;
  updatedAt: string;
  description: string;
  milestoneNumber?: number;
  totalMilestones?: number;
  escrowFee: number;
  platformFee: number;
}

export interface MilestonePayment {
  id: string;
  engagementId: string;
  milestoneNumber: number;
  totalMilestones: number;
  clientName: string;
  freelancerName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'disputed' | 'failed';
  dueDate: string;
  completedDate?: string;
  description: string;
  progress: number; // 0-100
}

export interface PlatformRevenue {
  id: string;
  period: string; // e.g., "2024-01"
  totalRevenue: number;
  currency: string;
  escrowFees: number;
  platformFees: number;
  transactionCount: number;
  successfulTransactions: number;
  failedTransactions: number;
  disputedTransactions: number;
  averageTransactionValue: number;
}

export interface FailedTransaction {
  id: string;
  transactionId: string;
  type: 'escrow' | 'milestone' | 'payout';
  clientName: string;
  freelancerName: string;
  amount: number;
  currency: string;
  failureReason: string;
  errorCode: string;
  status: 'pending' | 'resolved' | 'refunded';
  createdAt: string;
  resolvedAt?: string;
  adminNotes?: string;
}

export interface DisputedTransaction {
  id: string;
  transactionId: string;
  type: 'escrow' | 'milestone';
  clientName: string;
  freelancerName: string;
  amount: number;
  currency: string;
  disputeReason: string;
  status: 'open' | 'under_review' | 'resolved' | 'refunded';
  createdAt: string;
  resolvedAt?: string;
  adminNotes?: string;
  evidence?: string[];
}

export interface FinanceStats {
  totalEscrowAmount: number;
  totalRevenue: number;
  pendingTransactions: number;
  failedTransactions: number;
  disputedTransactions: number;
  averageTransactionValue: number;
  monthlyGrowth: number;
}

export interface TransactionFilter {
  status?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  clientName?: string;
  freelancerName?: string;
} 