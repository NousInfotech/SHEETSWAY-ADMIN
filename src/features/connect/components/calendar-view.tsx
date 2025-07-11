'use client';
import React from 'react';
import {
  Calendar,
  Clock,
  Phone,
  Headphones,
  FileText,
  ArrowLeft,
  XCircle,
  Plus,
  Users,
  Mail,
  Edit3,
  MoreHorizontal
} from 'lucide-react';
import { Meeting, Contact } from '@/types/connect';
import {
  getTypeColor,
  getStatusColor,
  getStatusIcon
} from '@/lib/connect-utils';

interface CalendarViewProps {
  meetings: Meeting[];
  contacts: Contact[];
  cancelMeeting: (id: string) => void;
  onBack: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  meetings,
  contacts,
  cancelMeeting,
  onBack
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

  const getStatusIconComponent = (status: string) => {
    const statusClass = getStatusIcon(status);
    return <div className={`h-2 w-2 rounded-full ${statusClass}`}></div>;
  };

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <button
          onClick={onBack}
          className='hover:bg-secondary rounded-lg p-2 transition-colors'
        >
          <ArrowLeft className='text-muted-foreground h-5 w-5' />
        </button>
        <div>
          <h1 className='text-foreground text-2xl font-bold'>Calendar</h1>
          <p className='text-muted-foreground'>
            Manage your meetings and appointments
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        {/* Calendar View */}
        <div className='lg:col-span-2'>
          <div className='bg-card border-border rounded-2xl border p-6'>
            <div className='mb-6 flex items-center justify-between'>
              <h2 className='text-foreground text-lg font-semibold'>
                Upcoming Meetings
              </h2>
              <button className='hover:bg-secondary rounded-lg p-2 transition-colors'>
                <Plus className='text-muted-foreground h-4 w-4' />
              </button>
            </div>

            <div className='space-y-4'>
              {meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className='border-border bg-secondary rounded-xl border p-4'
                >
                  <div className='flex items-start gap-4'>
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg ${getTypeColor(meeting.type)}`}
                    >
                      {meeting.type === 'onboarding' ? (
                        <Phone className='h-6 w-6' />
                      ) : meeting.type === 'support' ? (
                        <Headphones className='h-6 w-6' />
                      ) : (
                        <FileText className='h-6 w-6' />
                      )}
                    </div>
                    <div className='flex-1'>
                      <div className='mb-2 flex items-center justify-between'>
                        <h3 className='text-foreground font-semibold'>
                          {meeting.title}
                        </h3>
                        <div className='flex items-center gap-2'>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(meeting.status)}`}
                          >
                            {meeting.status}
                          </span>
                          <button className='hover:bg-background rounded p-1 transition-colors'>
                            <MoreHorizontal className='text-muted-foreground h-4 w-4' />
                          </button>
                        </div>
                      </div>
                      <p className='text-muted-foreground mb-3 text-sm'>
                        {formatDate(meeting.date)} at {formatTime(meeting.time)}
                      </p>
                      <div className='text-muted-foreground mb-3 flex items-center gap-4 text-xs'>
                        <span className='flex items-center gap-1'>
                          <Clock className='h-3 w-3' />
                          {meeting.duration} minutes
                        </span>
                        <span className='flex items-center gap-1'>
                          <Users className='h-3 w-3' />
                          {meeting.attendees.length} attendees
                        </span>
                      </div>
                      {meeting.description && (
                        <p className='text-muted-foreground text-sm'>
                          {meeting.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='border-border mt-4 flex items-center gap-2 border-t pt-4'>
                    <button className='flex items-center gap-2 rounded-lg px-3 py-1 text-xs text-blue-500 transition-colors hover:bg-blue-500/10'>
                      <Edit3 className='h-3 w-3' />
                      Edit
                    </button>
                    {meeting.status === 'scheduled' && (
                      <button
                        onClick={() => cancelMeeting(meeting.id)}
                        className='flex items-center gap-2 rounded-lg px-3 py-1 text-xs text-red-500 transition-colors hover:bg-red-500/10'
                      >
                        <XCircle className='h-3 w-3' />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {meetings.length === 0 && (
                <div className='text-muted-foreground py-12 text-center'>
                  <Calendar className='mx-auto mb-4 h-16 w-16 opacity-50' />
                  <p className='mb-2 text-lg font-medium'>
                    No meetings scheduled
                  </p>
                  <p className='text-sm'>
                    Schedule your first meeting to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Team Status */}
        <div>
          <div className='bg-card border-border rounded-2xl border p-6'>
            <h2 className='text-foreground mb-4 text-lg font-semibold'>
              Team Status
            </h2>
            <div className='space-y-4'>
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className='bg-secondary flex items-center gap-3 rounded-xl p-3'
                >
                  <div className='relative'>
                    <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
                      <span className='text-primary text-sm font-medium'>
                        {contact.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                    <div className='absolute -right-1 -bottom-1'>
                      {getStatusIconComponent(contact.status)}
                    </div>
                  </div>
                  <div className='flex-1'>
                    <p className='text-foreground font-medium'>
                      {contact.name}
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      {contact.role}
                    </p>
                    {contact.lastSeen && (
                      <p className='text-muted-foreground text-xs'>
                        Last seen {contact.lastSeen}
                      </p>
                    )}
                  </div>
                  <button className='hover:bg-background rounded-lg p-2 transition-colors'>
                    <Mail className='text-muted-foreground h-4 w-4' />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className='bg-card border-border mt-6 rounded-2xl border p-6'>
            <h2 className='text-foreground mb-4 text-lg font-semibold'>
              Meeting Stats
            </h2>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground text-sm'>
                  Total Meetings
                </span>
                <span className='text-foreground font-semibold'>
                  {meetings.length}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground text-sm'>Scheduled</span>
                <span className='font-semibold text-blue-500'>
                  {meetings.filter((m) => m.status === 'scheduled').length}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground text-sm'>Completed</span>
                <span className='font-semibold text-green-500'>
                  {meetings.filter((m) => m.status === 'completed').length}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground text-sm'>Cancelled</span>
                <span className='font-semibold text-red-500'>
                  {meetings.filter((m) => m.status === 'cancelled').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
