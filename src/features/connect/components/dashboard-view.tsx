'use client';

import React from 'react';
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Headphones,
  MessageSquare,
  Phone,
  Star,
  Users,
  User
} from 'lucide-react';
import { Meeting, Contact } from '@/types/connect';
import {
  getTypeColor,
  getStatusColor,
  getStatusIcon
} from '@/lib/connect-utils';

interface DashboardViewProps {
  meetings: Meeting[];
  contacts: Contact[];
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  meetings,
  contacts,
  onNavigate
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className='space-y-8'>
      <div className='bg-card border-border rounded-2xl border p-8 transition-colors'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-foreground mb-2 text-3xl font-bold'>
              Welcome to Global Communication Hub
            </h1>
            <p className='text-muted-foreground text-lg'>
              Connect with our team, schedule meetings, and get the support you
              need.
            </p>
          </div>
          <div className='hidden md:block'>
            <div className='bg-primary/10 flex h-24 w-24 items-center justify-center rounded-full'>
              <MessageSquare className='text-primary h-12 w-12' />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <div
          onClick={() => onNavigate('schedule')}
          className='group bg-card border-border hover:border-primary/30 cursor-pointer rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl'
        >
          <div className='mb-4 flex items-center gap-4'>
            <div className='bg-primary/10 group-hover:bg-primary/20 flex h-14 w-14 items-center justify-center rounded-xl transition-colors'>
              <Phone className='text-primary h-7 w-7' />
            </div>
            <div>
              <h3 className='text-foreground text-lg font-semibold'>
                Schedule Meeting
              </h3>
              <p className='text-muted-foreground text-sm'>
                Book time with our team
              </p>
            </div>
          </div>
          <p className='text-muted-foreground mb-4'>
            Schedule calls with onboarding, support, or audit teams based on
            your needs.
          </p>
          <div className='text-primary group-hover:text-primary/80 flex items-center font-medium transition-colors'>
            Schedule now{' '}
            <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
          </div>
        </div>

        <div
          onClick={() => onNavigate('chat')}
          className='group bg-card border-border cursor-pointer rounded-2xl border p-6 transition-all duration-300 hover:border-green-500/30 hover:shadow-xl'
        >
          <div className='mb-4 flex items-center gap-4'>
            <div className='flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10 transition-colors group-hover:bg-green-500/20'>
              <MessageSquare className='h-7 w-7 text-green-500' />
            </div>
            <div>
              <h3 className='text-foreground text-lg font-semibold'>
                Start Chat
              </h3>
              <p className='text-muted-foreground text-sm'>
                Get instant support
              </p>
            </div>
          </div>
          <p className='text-muted-foreground mb-4'>
            Connect with our support agents for immediate assistance with your
            questions.
          </p>
          <div className='flex items-center font-medium text-green-500 transition-colors group-hover:text-green-600'>
            Start chatting{' '}
            <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
          </div>
        </div>

        <div
          onClick={() => onNavigate('calendar')}
          className='group bg-card border-border cursor-pointer rounded-2xl border p-6 transition-all duration-300 hover:border-purple-500/30 hover:shadow-xl'
        >
          <div className='mb-4 flex items-center gap-4'>
            <div className='flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/10 transition-colors group-hover:bg-purple-500/20'>
              <Calendar className='h-7 w-7 text-purple-500' />
            </div>
            <div>
              <h3 className='text-foreground text-lg font-semibold'>
                View Calendar
              </h3>
              <p className='text-muted-foreground text-sm'>
                Manage appointments
              </p>
            </div>
          </div>
          <p className='text-muted-foreground mb-4'>
            View your scheduled meetings, audit consultations, and upcoming
            appointments.
          </p>
          <div className='flex items-center font-medium text-purple-500 transition-colors group-hover:text-purple-600'>
            View calendar{' '}
            <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
        <div className='bg-card border-border rounded-2xl border p-6'>
          <div className='mb-3 flex items-center gap-3'>
            <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg'>
              <Clock className='text-primary h-5 w-5' />
            </div>
            <div>
              <p className='text-muted-foreground text-sm'>Response Time</p>
              <p className='text-foreground text-2xl font-bold'>2 min</p>
            </div>
          </div>
        </div>

        <div className='bg-card border-border rounded-2xl border p-6'>
          <div className='mb-3 flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10'>
              <CheckCircle className='h-5 w-5 text-green-500' />
            </div>
            <div>
              <p className='text-muted-foreground text-sm'>Success Rate</p>
              <p className='text-foreground text-2xl font-bold'>98.5%</p>
            </div>
          </div>
        </div>

        <div className='bg-card border-border rounded-2xl border p-6'>
          <div className='mb-3 flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10'>
              <Users className='h-5 w-5 text-purple-500' />
            </div>
            <div>
              <p className='text-muted-foreground text-sm'>Active Agents</p>
              <p className='text-foreground text-2xl font-bold'>12</p>
            </div>
          </div>
        </div>

        <div className='bg-card border-border rounded-2xl border p-6'>
          <div className='mb-3 flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10'>
              <Star className='h-5 w-5 text-yellow-500' />
            </div>
            <div>
              <p className='text-muted-foreground text-sm'>Satisfaction</p>
              <p className='text-foreground text-2xl font-bold'>4.9/5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <div className='bg-card border-border rounded-2xl border p-6'>
          <h3 className='text-foreground mb-4 text-lg font-semibold'>
            Recent Meetings
          </h3>
          <div className='space-y-4'>
            {meetings.slice(0, 3).map((meeting) => (
              <div
                key={meeting.id}
                className='bg-secondary flex items-center gap-4 rounded-xl p-4'
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${getTypeColor(meeting.type)}`}
                >
                  {meeting.type === 'onboarding' ? (
                    <Phone className='h-5 w-5' />
                  ) : meeting.type === 'support' ? (
                    <Headphones className='h-5 w-5' />
                  ) : (
                    <FileText className='h-5 w-5' />
                  )}
                </div>
                <div className='flex-1'>
                  <p className='text-foreground font-medium'>{meeting.title}</p>
                  <p className='text-muted-foreground text-sm'>
                    {formatDate(meeting.date)} at {formatTime(meeting.time)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(meeting.status)}`}
                >
                  {meeting.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-card border-border rounded-2xl border p-6'>
          <h3 className='text-foreground mb-4 text-lg font-semibold'>
            Team Status
          </h3>
          <div className='space-y-4'>
            {contacts.slice(0, 4).map((contact) => (
              <div
                key={contact.id}
                className='bg-secondary flex items-center gap-4 rounded-xl p-4'
              >
                <div className='bg-primary/10 relative flex h-10 w-10 items-center justify-center rounded-full'>
                  <User className='text-primary h-5 w-5' />
                  <div className='absolute -right-1 -bottom-1'>
                    <div
                      className={`h-2 w-2 rounded-full ${getStatusIcon(contact.status)}`}
                    ></div>
                  </div>
                </div>
                <div className='flex-1'>
                  <p className='text-foreground font-medium'>{contact.name}</p>
                  <p className='text-muted-foreground text-sm'>
                    {contact.role}
                  </p>
                </div>
                <span className='text-muted-foreground text-sm'>
                  {contact.status === 'offline'
                    ? contact.lastSeen
                    : contact.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
