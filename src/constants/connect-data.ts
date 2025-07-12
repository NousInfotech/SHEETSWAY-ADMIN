import { ChatMessage, Meeting, Contact } from '@/types/connect';

// Mock chat messages for different channels
export const initialChatMessages: Record<string, ChatMessage[]> = {
  support: [
    {
      id: '1',
      sender: 'bot',
      message: 'Hello! How can we help you today?',
      time: '10:30 AM',
      timestamp: Date.now() - 3600000
    },
    {
      id: '2',
      sender: 'user',
      message: 'I have a question about my invoice #5021.',
      time: '10:31 AM',
      timestamp: Date.now() - 3500000
    },
    {
      id: '3',
      sender: 'agent',
      message: 'I can help you with that. Let me pull up your account details.',
      time: '10:32 AM',
      timestamp: Date.now() - 3400000
    }
  ],
  onboarding: [
    {
      id: '1',
      sender: 'bot',
      message: 'Welcome to Sheetsway! Ready to get started?',
      time: '9:15 AM',
      timestamp: Date.now() - 7200000
    },
    {
      id: '2',
      sender: 'user',
      message: 'Yes, I need help setting up my account.',
      time: '9:16 AM',
      timestamp: Date.now() - 7100000
    },
    {
      id: '3',
      sender: 'agent',
      message: "Perfect! I'll walk you through the setup process step by step.",
      time: '9:17 AM',
      timestamp: Date.now() - 7000000
    }
  ],
  audit: [
    {
      id: '1',
      sender: 'bot',
      message: 'Welcome to audit consultation chat.',
      time: '2:00 PM',
      timestamp: Date.now() - 1800000
    },
    {
      id: '2',
      sender: 'user',
      message: 'I need to schedule an audit review.',
      time: '2:01 PM',
      timestamp: Date.now() - 1700000
    },
    {
      id: '3',
      sender: 'agent',
      message:
        'I can help you schedule that. What type of audit review do you need?',
      time: '2:02 PM',
      timestamp: Date.now() - 1600000
    }
  ]
};

// Mock meetings data
export const initialMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Onboarding Call',
    date: '2024-01-15',
    time: '10:00',
    duration: 60,
    type: 'onboarding',
    status: 'scheduled',
    attendees: ['john.doe@example.com', 'support@sheetsway.com'],
    description: 'Initial onboarding and account setup'
  },
  {
    id: '2',
    title: 'Support Session',
    date: '2024-01-16',
    time: '14:00',
    duration: 30,
    type: 'support',
    status: 'completed',
    attendees: ['john.doe@example.com', 'support@sheetsway.com'],
    description: 'Technical support for integration issues'
  },
  {
    id: '3',
    title: 'Audit Consultation',
    date: '2024-01-18',
    time: '11:00',
    duration: 90,
    type: 'audit',
    status: 'scheduled',
    attendees: ['john.doe@example.com', 'audit@sheetsway.com'],
    description: 'Monthly audit review and compliance check'
  }
];

// Mock contacts data
export const contacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Onboarding Specialist',
    email: 'sarah@sheetsway.com',
    status: 'online'
  },
  {
    id: '2',
    name: 'Mike Chen',
    role: 'Support Agent',
    email: 'mike@sheetsway.com',
    status: 'busy'
  },
  {
    id: '3',
    name: 'Lisa Rodriguez',
    role: 'Audit Consultant',
    email: 'lisa@sheetsway.com',
    status: 'online'
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Technical Support',
    email: 'david@sheetsway.com',
    status: 'offline',
    lastSeen: '2 hours ago'
  }
];

// Available time slots for scheduling
export const availableSlots = [
  { date: '2024-01-15', time: '10:00', available: true, type: 'onboarding' },
  { date: '2024-01-15', time: '14:00', available: true, type: 'support' },
  { date: '2024-01-16', time: '11:00', available: false, type: 'audit' },
  { date: '2024-01-16', time: '15:00', available: true, type: 'support' },
  { date: '2024-01-17', time: '09:00', available: true, type: 'onboarding' },
  { date: '2024-01-17', time: '13:00', available: true, type: 'audit' },
  { date: '2024-01-18', time: '10:00', available: true, type: 'support' },
  { date: '2024-01-18', time: '16:00', available: true, type: 'audit' }
];
