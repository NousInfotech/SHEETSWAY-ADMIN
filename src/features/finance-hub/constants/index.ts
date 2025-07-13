import { 
  EscrowTransaction, 
  MilestonePayment, 
  PlatformRevenue, 
  FailedTransaction, 
  DisputedTransaction,
  FinanceStats 
} from '../types';

export const STORAGE_KEYS = {
  ESCROW_TRANSACTIONS: 'finance_escrow_transactions',
  MILESTONE_PAYMENTS: 'finance_milestone_payments',
  PLATFORM_REVENUE: 'finance_platform_revenue',
  FAILED_TRANSACTIONS: 'finance_failed_transactions',
  DISPUTED_TRANSACTIONS: 'finance_disputed_transactions',
  FINANCE_STATS: 'finance_stats'
};

export const mockEscrowTransactions: EscrowTransaction[] = [
  {
    id: 'ESC-001',
    engagementId: 'ENG-001',
    clientName: 'TechCorp Inc.',
    freelancerName: 'John Developer',
    amount: 5000,
    currency: 'USD',
    status: 'pending',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    description: 'Website development milestone 1',
    milestoneNumber: 1,
    totalMilestones: 3,
    escrowFee: 250,
    platformFee: 500
  },
  {
    id: 'ESC-002',
    engagementId: 'ENG-002',
    clientName: 'Design Studio',
    freelancerName: 'Sarah Designer',
    amount: 3000,
    currency: 'USD',
    status: 'released',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-16T09:15:00Z',
    description: 'Logo design project',
    milestoneNumber: 1,
    totalMilestones: 2,
    escrowFee: 150,
    platformFee: 300
  },
  {
    id: 'ESC-003',
    engagementId: 'ENG-003',
    clientName: 'Marketing Agency',
    freelancerName: 'Mike Writer',
    amount: 2000,
    currency: 'USD',
    status: 'disputed',
    createdAt: '2024-01-13T16:45:00Z',
    updatedAt: '2024-01-17T11:30:00Z',
    description: 'Content writing services',
    milestoneNumber: 2,
    totalMilestones: 4,
    escrowFee: 100,
    platformFee: 200
  },
  {
    id: 'ESC-004',
    engagementId: 'ENG-004',
    clientName: 'StartupXYZ',
    freelancerName: 'Lisa Developer',
    amount: 8000,
    currency: 'USD',
    status: 'failed',
    createdAt: '2024-01-12T12:00:00Z',
    updatedAt: '2024-01-15T08:45:00Z',
    description: 'Mobile app development',
    milestoneNumber: 1,
    totalMilestones: 5,
    escrowFee: 400,
    platformFee: 800
  }
];

export const mockMilestonePayments: MilestonePayment[] = [
  {
    id: 'MIL-001',
    engagementId: 'ENG-001',
    milestoneNumber: 1,
    totalMilestones: 3,
    clientName: 'TechCorp Inc.',
    freelancerName: 'John Developer',
    amount: 5000,
    currency: 'USD',
    status: 'pending',
    dueDate: '2024-01-25T00:00:00Z',
    description: 'Website development milestone 1',
    progress: 75
  },
  {
    id: 'MIL-002',
    engagementId: 'ENG-002',
    milestoneNumber: 2,
    totalMilestones: 2,
    clientName: 'Design Studio',
    freelancerName: 'Sarah Designer',
    amount: 3000,
    currency: 'USD',
    status: 'completed',
    dueDate: '2024-01-20T00:00:00Z',
    completedDate: '2024-01-18T15:30:00Z',
    description: 'Logo design project',
    progress: 100
  },
  {
    id: 'MIL-003',
    engagementId: 'ENG-003',
    milestoneNumber: 3,
    totalMilestones: 4,
    clientName: 'Marketing Agency',
    freelancerName: 'Mike Writer',
    amount: 1500,
    currency: 'USD',
    status: 'disputed',
    dueDate: '2024-01-22T00:00:00Z',
    description: 'Content writing services',
    progress: 60
  },
  {
    id: 'MIL-004',
    engagementId: 'ENG-004',
    milestoneNumber: 1,
    totalMilestones: 5,
    clientName: 'StartupXYZ',
    freelancerName: 'Lisa Developer',
    amount: 8000,
    currency: 'USD',
    status: 'failed',
    dueDate: '2024-01-30T00:00:00Z',
    description: 'Mobile app development',
    progress: 25
  }
];

export const mockPlatformRevenue: PlatformRevenue[] = [
  {
    id: 'REV-001',
    period: '2024-01',
    totalRevenue: 45000,
    currency: 'USD',
    escrowFees: 2250,
    platformFees: 4500,
    transactionCount: 45,
    successfulTransactions: 38,
    failedTransactions: 4,
    disputedTransactions: 3,
    averageTransactionValue: 1000
  },
  {
    id: 'REV-002',
    period: '2023-12',
    totalRevenue: 38000,
    currency: 'USD',
    escrowFees: 1900,
    platformFees: 3800,
    transactionCount: 38,
    successfulTransactions: 32,
    failedTransactions: 3,
    disputedTransactions: 3,
    averageTransactionValue: 1000
  },
  {
    id: 'REV-003',
    period: '2023-11',
    totalRevenue: 42000,
    currency: 'USD',
    escrowFees: 2100,
    platformFees: 4200,
    transactionCount: 42,
    successfulTransactions: 36,
    failedTransactions: 4,
    disputedTransactions: 2,
    averageTransactionValue: 1000
  }
];

export const mockFailedTransactions: FailedTransaction[] = [
  {
    id: 'FAIL-001',
    transactionId: 'ESC-004',
    type: 'escrow',
    clientName: 'StartupXYZ',
    freelancerName: 'Lisa Developer',
    amount: 8000,
    currency: 'USD',
    failureReason: 'Insufficient funds in client account',
    errorCode: 'INSUFFICIENT_FUNDS',
    status: 'pending',
    createdAt: '2024-01-15T08:45:00Z'
  },
  {
    id: 'FAIL-002',
    transactionId: 'MIL-004',
    type: 'milestone',
    clientName: 'StartupXYZ',
    freelancerName: 'Lisa Developer',
    amount: 8000,
    currency: 'USD',
    failureReason: 'Payment gateway timeout',
    errorCode: 'GATEWAY_TIMEOUT',
    status: 'resolved',
    createdAt: '2024-01-14T16:20:00Z',
    resolvedAt: '2024-01-16T10:30:00Z',
    adminNotes: 'Payment retried successfully'
  },
  {
    id: 'FAIL-003',
    transactionId: 'ESC-005',
    type: 'escrow',
    clientName: 'Digital Solutions',
    freelancerName: 'Alex Designer',
    amount: 2500,
    currency: 'USD',
    failureReason: 'Invalid payment method',
    errorCode: 'INVALID_PAYMENT_METHOD',
    status: 'pending',
    createdAt: '2024-01-13T11:15:00Z'
  }
];

export const mockDisputedTransactions: DisputedTransaction[] = [
  {
    id: 'DISP-001',
    transactionId: 'ESC-003',
    type: 'escrow',
    clientName: 'Marketing Agency',
    freelancerName: 'Mike Writer',
    amount: 2000,
    currency: 'USD',
    disputeReason: 'Quality of work not meeting requirements',
    status: 'under_review',
    createdAt: '2024-01-17T11:30:00Z',
    evidence: ['client_feedback.pdf', 'work_samples.zip']
  },
  {
    id: 'DISP-002',
    transactionId: 'MIL-003',
    type: 'milestone',
    clientName: 'Marketing Agency',
    freelancerName: 'Mike Writer',
    amount: 1500,
    currency: 'USD',
    disputeReason: 'Delayed delivery',
    status: 'open',
    createdAt: '2024-01-16T14:45:00Z'
  },
  {
    id: 'DISP-003',
    transactionId: 'ESC-006',
    type: 'escrow',
    clientName: 'Creative Studio',
    freelancerName: 'Emma Developer',
    amount: 6000,
    currency: 'USD',
    disputeReason: 'Scope creep - additional work not agreed',
    status: 'resolved',
    createdAt: '2024-01-10T09:20:00Z',
    resolvedAt: '2024-01-15T16:30:00Z',
    adminNotes: 'Partial refund issued to client'
  }
];

export const mockFinanceStats: FinanceStats = {
  totalEscrowAmount: 18000,
  totalRevenue: 45000,
  pendingTransactions: 8,
  failedTransactions: 3,
  disputedTransactions: 3,
  averageTransactionValue: 1000,
  monthlyGrowth: 18.4
}; 