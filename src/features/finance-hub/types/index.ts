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

// New Payment Types based on Backend Schema
export interface Payment {
  id: string;
  stripePaymentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  paymentMethod?: string;
  paymentMeta?: any;
  createdAt: string;
  updatedAt: string;
  escrow?: EscrowStatus;
}

export interface EscrowStatus {
  id: string;
  engagementId: string;
  paymentId: string;
  isReleased: boolean;
  releaseDate?: string;
  underDispute: boolean;
  createdAt: string;
  engagement?: Engagement;
  payment?: Payment;
}

export interface Engagement {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  userId?: string;
  auditFirmId?: string;
  clientName?: string;
  auditorName?: string;
}

export interface PaymentWithEscrow extends Payment {
  escrow: EscrowStatus & {
    engagement: Engagement;
  };
}

export interface PaymentFilter {
  status?: string;
  paymentMethod?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  engagementId?: string;
  role?: 'USER' | 'AUDITFIRM';
  roleId?: string;
}

export interface PaymentStats {
  totalPayments: number;
  totalAmount: number;
  currency: string;
  pendingPayments: number;
  successfulPayments: number;
  failedPayments: number;
  refundedPayments: number;
  averagePaymentValue: number;
} 