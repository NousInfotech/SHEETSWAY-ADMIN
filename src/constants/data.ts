import { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Auditor Vetting & Management',
    url: '/dashboard/vetting',
    icon: 'userCheck', 
    isActive: false,
    shortcut: ['v', 'v'],
    items: []
  },
  {
    title: 'Client Request Viewer',
    url: '/dashboard/client-requests',
    icon: 'request', 
    isActive: false,
    shortcut: ['r', 'r'],
    items: []
  },
  {
    title: 'Engagement Oversight',
    url: '/dashboard/engagements',
    icon: 'engagements', 
    isActive: false,
    shortcut: ['e', 'e'],
    items: []
  },
  {
    title: 'Disputes & Escalation Center',
    url: '/dashboard/disputes',
    icon: 'gavel', 
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Compliance Monitoring',
    url: '/dashboard/compliance',
    icon: 'history', 
    isActive: false,
    shortcut: ['c', 'c'],
    items: []
  },
  {
    title: 'Payments Oversight',
    url: '/dashboard/payments',
    icon: 'payments', 
    shortcut: ['p', 'p'],
    isActive: false,
    items: []
  },
  {
    title: 'Settings & Logs',
    url: '/dashboard/settings',
    icon: 'settings', 
    shortcut: ['s', 's'],
    isActive: false,
    items: []
  }
];


export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];






export const BACKEND_URL = "http://localhost:5000";
