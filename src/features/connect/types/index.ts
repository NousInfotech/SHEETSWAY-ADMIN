// Chat Types
export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user' | 'agent';
  message: string;
  time: string;
  timestamp: number;
  type?: 'text' | 'image' | 'file';
}

// Meeting Types
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

// Contact Types
export interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'online' | 'offline' | 'busy';
  avatar?: string;
  lastSeen?: string;
}

// Available Slot Types
export interface AvailableSlot {
  date: string;
  time: string;
  available: boolean;
  type: 'onboarding' | 'support' | 'audit';
}

// UI State Types
export interface ConnectUIState {
  currentView: string;
  isDark: boolean;
  activeChat: string;
  message: string;
  selectedDate: string;
  selectedTime: string;
  searchTerm: string;
  notifications: boolean;
}

// Store Types
export interface ConnectStore extends ConnectUIState {
  // Data State
  chatMessages: Record<string, ChatMessage[]>;
  meetings: Meeting[];
  contacts: Contact[];

  // Actions
  setCurrentView: (view: string) => void;
  toggleTheme: () => void;
  setActiveChat: (chat: string) => void;
  setMessage: (message: string) => void;
  setSelectedDate: (date: string) => void;
  setSelectedTime: (time: string) => void;
  setSearchTerm: (term: string) => void;
  setNotifications: (enabled: boolean) => void;

  // Chat actions
  sendMessage: (chatId: string, message: string) => void;
  addChatMessage: (chatId: string, message: ChatMessage) => void;

  // Meeting actions
  addMeeting: (meeting: Meeting) => void;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  cancelMeeting: (id: string) => void;
  deleteMeeting: (id: string) => void;

  // Contact actions
  updateContact: (id: string, updates: Partial<Contact>) => void;
}
