import { ChatMessage, Meeting, Contact, AvailableSlot } from '../types';

// Initial Chat Messages
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

// Initial Meetings
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

// Initial Contacts
export const initialContacts: Contact[] = [
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

// Available Time Slots
export const availableSlots: AvailableSlot[] = [
  { date: '2024-01-15', time: '10:00', available: true, type: 'onboarding' },
  { date: '2024-01-15', time: '14:00', available: true, type: 'support' },
  { date: '2024-01-16', time: '11:00', available: false, type: 'audit' },
  { date: '2024-01-16', time: '15:00', available: true, type: 'support' },
  { date: '2024-01-17', time: '09:00', available: true, type: 'onboarding' },
  { date: '2024-01-17', time: '13:00', available: true, type: 'audit' },
  { date: '2024-01-18', time: '10:00', available: true, type: 'support' },
  { date: '2024-01-18', time: '16:00', available: true, type: 'audit' }
];

// Meeting Types Configuration
export const meetingTypes = [
  {
    type: 'onboarding',
    title: 'Onboarding Call',
    duration: '60 min',
    description: 'Get started with your account setup',
    color: 'blue'
  },
  {
    type: 'support',
    title: 'Support Session',
    duration: '30 min',
    description: 'Get help with technical issues',
    color: 'green'
  },
  {
    type: 'audit',
    title: 'Audit Consultation',
    duration: '90 min',
    description: 'Review compliance and audit requirements',
    color: 'purple'
  }
];

// Chat Channels Configuration
export const chatChannels = [
  { id: 'support', name: 'General Support', color: 'text-green-500' },
  { id: 'onboarding', name: 'Onboarding', color: 'text-blue-500' },
  { id: 'audit', name: 'Audit Support', color: 'text-purple-500' }
];

// Navigation Tabs
export const navigationTabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'chat', label: 'Chat' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'calendar', label: 'Calendar' }
];

// Time Options for Scheduling
export const timeOptions = [
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '16:00', label: '4:00 PM' }
];
