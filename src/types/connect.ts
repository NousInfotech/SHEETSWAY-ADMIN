export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user' | 'agent';
  message: string;
  time: string;
  timestamp: number;
  type?: 'text' | 'image' | 'file';
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  type: 'onboarding' | 'support' | 'audit';
  status: 'scheduled' | 'completed' | 'cancelled';
  attendees: string[];
  description?: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'online' | 'offline' | 'busy';
  avatar?: string;
  lastSeen?: string;
}
