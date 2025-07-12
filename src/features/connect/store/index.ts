// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ConnectStore } from '../types';
import {
  initialChatMessages,
  initialMeetings,
  initialContacts
} from '../constants';

// Create store
export const useConnectStore = create<ConnectStore>()(
  persist(
    (set) => ({
      // Initial state
      currentView: 'dashboard',
      isDark: false,
      activeChat: 'support',
      message: '',
      selectedDate: '',
      selectedTime: '',
      searchTerm: '',
      notifications: true,
      chatMessages: initialChatMessages,
      meetings: initialMeetings,
      contacts: initialContacts,

      // UI Actions
      setCurrentView: (view) => set({ currentView: view }),
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
      setActiveChat: (chat) => set({ activeChat: chat }),
      setMessage: (message) => set({ message }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedTime: (time) => set({ selectedTime: time }),
      setSearchTerm: (term) => set({ searchTerm: term }),
      setNotifications: (enabled) => set({ notifications: enabled }),

      // Chat Actions
      sendMessage: (chatId, messageText) => {
        if (!messageText.trim()) return;

        const newMessage = {
          id: Date.now().toString(),
          sender: 'user' as const,
          message: messageText.trim(),
          time: new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          timestamp: Date.now()
        };

        set((state) => ({
          chatMessages: {
            ...state.chatMessages,
            [chatId]: [...(state.chatMessages[chatId] || []), newMessage]
          }
        }));

        // Simulate agent response
        setTimeout(() => {
          const agentResponse = {
            id: (Date.now() + 1).toString(),
            sender: 'agent' as const,
            message:
              "Thank you for your message. I'm reviewing your request and will get back to you shortly.",
            time: new Date().toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }),
            timestamp: Date.now()
          };

          set((state) => ({
            chatMessages: {
              ...state.chatMessages,
              [chatId]: [...(state.chatMessages[chatId] || []), agentResponse]
            }
          }));
        }, 2000);
      },

      addChatMessage: (chatId, message) => {
        set((state) => ({
          chatMessages: {
            ...state.chatMessages,
            [chatId]: [...(state.chatMessages[chatId] || []), message]
          }
        }));
      },

      // Meeting Actions
      addMeeting: (meeting) => {
        set((state) => ({
          meetings: [...state.meetings, meeting]
        }));
      },

      updateMeeting: (id, updates) => {
        set((state) => ({
          meetings: state.meetings.map((meeting) =>
            meeting.id === id ? { ...meeting, ...updates } : meeting
          )
        }));
      },

      cancelMeeting: (id) => {
        set((state) => ({
          meetings: state.meetings.map((meeting) =>
            meeting.id === id
              ? { ...meeting, status: 'cancelled' as const }
              : meeting
          )
        }));
      },

      deleteMeeting: (id) => {
        set((state) => ({
          meetings: state.meetings.filter((meeting) => meeting.id !== id)
        }));
      },

      // Contact Actions
      updateContact: (id, updates) => {
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.id === id ? { ...contact, ...updates } : contact
          )
        }));
      }
    }),
    {
      name: 'connect-store',
      partialize: (state) => ({
        isDark: state.isDark,
        chatMessages: state.chatMessages,
        meetings: state.meetings,
        contacts: state.contacts
      })
    }
  )
);
