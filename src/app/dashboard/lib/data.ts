import {
  Users,
  Shield,
  Briefcase,
  Activity,
  UserPlus,
  Flag,
  CircleDollarSign,
  CalendarClock,
  FileClock,
  ArrowRight,
  PlusCircle,
  Megaphone,
  CheckCircle2,
  ListTodo,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

// --- TypeScript Types for our Data ---

export type Kpi = {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
};

export type QuickAction = {
  title: string;
  icon: React.ElementType;
  href: string;
};

export type SystemAlert = {
  id: string;
  title: string;
  timestamp: string;
  icon: React.ElementType;
};

export type ComplianceAlert = {
  id: string;
  title: string;
  details: string;
  icon: React.ElementType;
  priority: 'High' | 'Medium' | 'Low';
};

export type RecentActivity = {
  id: string;
  description: string;
  timestamp: string;
  icon: React.ElementType;
  actor: {
    name: string;
    avatarUrl?: string;
  };
};

export type OnboardingStep = {
  stage: string;
  count: number;
  total: number;
};

// --- Mock Data (Replace with API data later) ---

export const kpis: Kpi[] = [
  { title: 'Total Clients', value: '1,482', change: '+12.5%', icon: Users },
  { title: 'Total Auditors', value: '241', change: '+2.1%', icon: Shield },
  { title: 'Active Engagements', value: '76', change: '-5', icon: Briefcase }
];

export const quickActions: QuickAction[] = [
  { title: 'Verify Auditor', icon: CheckCircle2, href: '/dashboard/vetting' },
  { title: 'New Engagement', icon: PlusCircle, href: '/dashboard/engagements' },
  { title: 'Create Announcement', icon: Megaphone, href: '/' }
];

export const systemAlerts: SystemAlert[] = [
  {
    id: 'E-1055',
    title: 'New Dispute Raised',
    timestamp: '2m ago',
    icon: Flag
  },
  {
    id: 'P-2043',
    title: 'Payment Hold Flagged',
    timestamp: '1h ago',
    icon: CircleDollarSign
  },
  {
    id: 'S-0012',
    title: 'Unusual Login Activity',
    timestamp: '3h ago',
    icon: AlertTriangle
  },
  { id: 'E-1012', title: 'Dispute Escalated', timestamp: '4h ago', icon: Flag },
  {
    id: 'S-0011',
    title: 'System Maintenance Scheduled',
    timestamp: '1d ago',
    icon: Activity
  },
  {
    id: 'P-2042',
    title: 'Large Transaction Processed',
    timestamp: '2d ago',
    icon: CircleDollarSign
  }
];

export const complianceAlerts: ComplianceAlert[] = [
  {
    id: 'Axiom Inc.',
    title: 'License Expiring Soon',
    details: 'Axiom Inc. - Expires in 7 days',
    icon: CalendarClock,
    priority: 'High'
  },
  {
    id: 'Veritas Global',
    title: 'Missed Deadline',
    details: 'KYB Re-verification Overdue',
    icon: FileClock,
    priority: 'High'
  },
  {
    id: 'FinTrust',
    title: 'License Expiring',
    details: 'FinTrust - Expires in 25 days',
    icon: CalendarClock,
    priority: 'Medium'
  },
  {
    id: 'AuditPro',
    title: 'Info Request Pending',
    details: 'Awaiting documents for 3 days',
    icon: ListTodo,
    priority: 'Low'
  },
  {
    id: 'SecureCorp',
    title: 'Policy Update Required',
    details: 'Review new data privacy policy',
    icon: Shield,
    priority: 'Low'
  },
  {
    id: 'Nexus Solutions',
    title: 'License Expiring',
    details: 'Nexus Solutions - Expires in 45 days',
    icon: CalendarClock,
    priority: 'Low'
  }
];

export const recentActivities: RecentActivity[] = [
  {
    id: 'act1',
    description: 'raised a dispute on Engagement #E-1055.',
    timestamp: '2m ago',
    icon: Flag,
    actor: { name: 'Client Corp' }
  },
  {
    id: 'act2',
    description: 'completed verification.',
    timestamp: '15m ago',
    icon: CheckCircle2,
    actor: {
      name: 'Alice Auditor',
      avatarUrl: 'https://i.pravatar.cc/40?u=alice'
    }
  },
  {
    id: 'act3',
    description: 'signed up as a new auditor.',
    timestamp: '45m ago',
    icon: UserPlus,
    actor: { name: 'Bob Verifier', avatarUrl: 'https://i.pravatar.cc/40?u=bob' }
  },
  {
    id: 'act4',
    description: 'funded an engagement for €15,000.',
    timestamp: '1h ago',
    icon: CircleDollarSign,
    actor: { name: 'Innovate LLC' }
  }
];

export const onboardingFunnel: OnboardingStep[] = [
  { stage: 'Application Submitted', count: 25, total: 25 },
  { stage: 'Initial Screening', count: 18, total: 25 },
  { stage: 'Document Verification', count: 11, total: 25 },
  { stage: 'Final Review', count: 5, total: 25 },
  { stage: 'Approved', count: 3, total: 25 }
];

export const priorityColors = {
  High: 'border-red-500/80 bg-red-500/10 text-red-500',
  Medium: 'border-amber-500/80 bg-amber-500/10 text-amber-500',
  Low: 'border-sky-500/80 bg-sky-500/10 text-sky-500'
};
