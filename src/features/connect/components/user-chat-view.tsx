// eslint-disable-next-line @typescript-eslint/no-unused-vars
'use client';
import React, { useState, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Headphones,
  Video,
  PhoneCall,
  Settings,
  ArrowLeft,
  Paperclip,
  Image as IMG,
  File,
  Smile
} from 'lucide-react';
import { ChatMessage } from '@/types/connect';

interface UserChatViewProps {
  onBack: () => void;
}

export const UserChatView: React.FC<UserChatViewProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userName] = useState('User');

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('userChatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Initialize with welcome message
      const welcomeMessage: ChatMessage = {
        id: '1',
        sender: 'bot',
        message:
          'Hello! Welcome to Sheetsway Support. How can we help you today?',
        time: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        timestamp: Date.now()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('userChatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        message: message.trim(),
        time: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        timestamp: Date.now()
      };

      setMessages((prev) => [...prev, newMessage]);
      setMessage('');
      setIsTyping(true);

      // Simulate agent response
      setTimeout(() => {
        const responses = [
          "Thank you for your message. I'm reviewing your request and will get back to you shortly.",
          'I understand your concern. Let me check our system for the best solution.',
          "That's a great question! Let me connect you with the right team member.",
          "I'm here to help! Can you provide a bit more detail about your issue?",
          "Thanks for reaching out. I'll escalate this to our technical team.",
          "I can see you're having trouble. Let me guide you through this step by step."
        ];

        const randomResponse =
          responses[Math.floor(Math.random() * responses.length)];

        const agentResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          message: randomResponse,
          time: new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          timestamp: Date.now()
        };

        setMessages((prev) => [...prev, agentResponse]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const getSenderIcon = (sender: string) => {
    switch (sender) {
      case 'bot':
        return <Bot className='h-5 w-5 text-blue-500' />;
      case 'user':
        return <User className='h-5 w-5 text-green-500' />;
      case 'agent':
        return <Headphones className='h-5 w-5 text-purple-500' />;
      default:
        return <User className='h-5 w-5 text-gray-500' />;
    }
  };

  const getSenderName = (sender: string) => {
    switch (sender) {
      case 'bot':
        return 'AI Assistant';
      case 'user':
        return userName;
      case 'agent':
        return 'Support Agent';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className='flex h-full flex-col'>
      {/* Chat Header */}
      <div className='bg-card border-border border-b p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <button
              onClick={onBack}
              className='hover:bg-secondary rounded-lg p-2 transition-colors'
            >
              <ArrowLeft className='text-muted-foreground h-5 w-5' />
            </button>
            <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
              <Headphones className='text-primary h-5 w-5' />
            </div>
            <div>
              <h3 className='text-foreground font-semibold'>
                Customer Support
              </h3>
              <p className='text-muted-foreground text-sm'>
                We&apos;re here to help
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <button className='hover:bg-secondary rounded-lg p-2 transition-colors'>
              <Video className='text-muted-foreground h-4 w-4' />
            </button>
            <button className='hover:bg-secondary rounded-lg p-2 transition-colors'>
              <PhoneCall className='text-muted-foreground h-4 w-4' />
            </button>
            <button className='hover:bg-secondary rounded-lg p-2 transition-colors'>
              <Settings className='text-muted-foreground h-4 w-4' />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className='flex-1 space-y-4 overflow-y-auto p-6'>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender !== 'user' && (
              <div className='bg-secondary flex h-8 w-8 items-center justify-center rounded-full'>
                {getSenderIcon(msg.sender)}
              </div>
            )}
            <div
              className={`max-w-xs rounded-2xl p-4 lg:max-w-md ${
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground'
              }`}
            >
              <div className='mb-2 flex items-center gap-2'>
                <span className='text-xs font-medium opacity-70'>
                  {getSenderName(msg.sender)}
                </span>
                <span className='text-xs opacity-50'>{msg.time}</span>
              </div>
              <p className='text-sm'>{msg.message}</p>
            </div>
            {msg.sender === 'user' && (
              <div className='bg-primary flex h-8 w-8 items-center justify-center rounded-full'>
                <User className='text-primary-foreground h-4 w-4' />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className='flex justify-start gap-3'>
            <div className='bg-secondary flex h-8 w-8 items-center justify-center rounded-full'>
              <Headphones className='h-4 w-4 text-purple-500' />
            </div>
            <div className='bg-secondary text-foreground rounded-2xl p-4'>
              <div className='mb-2 flex items-center gap-2'>
                <span className='text-xs font-medium opacity-70'>
                  Support Agent
                </span>
                <span className='text-xs opacity-50'>typing...</span>
              </div>
              <div className='flex gap-1'>
                <div className='bg-muted-foreground h-2 w-2 animate-bounce rounded-full'></div>
                <div
                  className='bg-muted-foreground h-2 w-2 animate-bounce rounded-full'
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className='bg-muted-foreground h-2 w-2 animate-bounce rounded-full'
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className='border-border bg-card border-t p-6'>
        <div className='flex items-center gap-3'>
          <button className='hover:bg-secondary rounded-lg p-2 transition-colors'>
            <Paperclip className='text-muted-foreground h-4 w-4' />
          </button>
          <button className='hover:bg-secondary rounded-lg p-2 transition-colors'>
            <IMG className='text-muted-foreground h-4 w-4'/>
          </button>
          <button className='hover:bg-secondary rounded-lg p-2 transition-colors'>
            <File className='text-muted-foreground h-4 w-4' />
          </button>
          <div className='relative flex-1'>
            <input
              type='text'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder='Type your message...'
              className='bg-secondary border-border focus:ring-primary w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:outline-none'
            />
          </div>
          <button className='hover:bg-secondary rounded-lg p-2 transition-colors'>
            <Smile className='text-muted-foreground h-4 w-4' />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl p-3 transition-colors disabled:cursor-not-allowed disabled:opacity-50'
          >
            <Send className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  );
};
