// eslint-disable-next-line @typescript-eslint/no-unused-vars
'use client';
import React from 'react';
import {
  Calendar,
  Clock,
  Phone,
  Headphones,
  FileText,
  ArrowLeft,
  Users
} from 'lucide-react';
import { Meeting } from '@/types/connect';
import { getTypeColor, getStatusColor } from '@/lib/connect-utils';

interface ScheduleViewProps {
  selectedDate: string;
  selectedTime: string;
  meetings: Meeting[];
  availableSlots: Array<{
    date: string;
    time: string;
    available: boolean;
    type: string;
  }>;
  setSelectedDate: (date: string) => void;
  setSelectedTime: (time: string) => void;
  handleScheduleMeeting: (type: 'onboarding' | 'support' | 'audit') => void;
  onBack: () => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  selectedDate,
  selectedTime,
  meetings,
  availableSlots,
  setSelectedDate,
  setSelectedTime,
  handleScheduleMeeting,
  onBack
}) => {
  const meetingTypes = [
    {
      id: 'onboarding',
      name: 'Onboarding Call',
      description: 'Get help setting up your account and learning the platform',
      duration: 60,
      icon: Phone,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 'support',
      name: 'Support Session',
      description: 'Technical support and troubleshooting assistance',
      duration: 30,
      icon: Headphones,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      id: 'audit',
      name: 'Audit Consultation',
      description: 'Professional audit review and compliance guidance',
      duration: 90,
      icon: FileText,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

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
      {/* Header */}
      <div className='flex items-center gap-4'>
        <button
          onClick={onBack}
          className='hover:bg-secondary rounded-lg p-2 transition-colors'
        >
          <ArrowLeft className='text-muted-foreground h-5 w-5' />
        </button>
        <div>
          <h1 className='text-foreground text-2xl font-bold'>
            Schedule Meeting
          </h1>
          <p className='text-muted-foreground'>Book time with our team</p>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        {/* Meeting Type Selection */}
        <div className='space-y-6'>
          <div>
            <h2 className='text-foreground mb-4 text-lg font-semibold'>
              Select Meeting Type
            </h2>
            <div className='space-y-4'>
              {meetingTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.id}
                    className='border-border hover:border-primary/30 cursor-pointer rounded-xl border p-4 transition-colors'
                  >
                    <div className='flex items-start gap-4'>
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg ${type.bgColor}`}
                      >
                        <Icon className={`h-6 w-6 ${type.color}`} />
                      </div>
                      <div className='flex-1'>
                        <h3 className='text-foreground font-semibold'>
                          {type.name}
                        </h3>
                        <p className='text-muted-foreground mb-2 text-sm'>
                          {type.description}
                        </p>
                        <div className='text-muted-foreground flex items-center gap-4 text-xs'>
                          <span className='flex items-center gap-1'>
                            <Clock className='h-3 w-3' />
                            {type.duration} minutes
                          </span>
                          <span className='flex items-center gap-1'>
                            <Users className='h-3 w-3' />
                            Up to 4 people
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Date and Time Selection */}
          <div>
            <h2 className='text-foreground mb-4 text-lg font-semibold'>
              Select Date & Time
            </h2>
            <div className='space-y-4'>
              <div>
                <label className='text-foreground mb-2 block text-sm font-medium'>
                  Date
                </label>
                <input
                  type='date'
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className='bg-secondary border-border focus:ring-primary w-full rounded-lg border px-4 py-3 focus:ring-2 focus:outline-none'
                />
              </div>
              <div>
                <label className='text-foreground mb-2 block text-sm font-medium'>
                  Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className='bg-secondary border-border focus:ring-primary w-full rounded-lg border px-4 py-3 focus:ring-2 focus:outline-none'
                >
                  <option value=''>Select a time</option>
                  {availableSlots
                    .filter(
                      (slot) => slot.date === selectedDate && slot.available
                    )
                    .map((slot) => (
                      <option key={slot.time} value={slot.time}>
                        {formatTime(slot.time)}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Schedule Buttons */}
          <div className='space-y-3'>
            <button
              onClick={() => handleScheduleMeeting('onboarding')}
              disabled={!selectedDate || !selectedTime}
              className='w-full rounded-xl bg-blue-500 p-4 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50'
            >
              Schedule Onboarding Call
            </button>
            <button
              onClick={() => handleScheduleMeeting('support')}
              disabled={!selectedDate || !selectedTime}
              className='w-full rounded-xl bg-green-500 p-4 text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50'
            >
              Schedule Support Session
            </button>
            <button
              onClick={() => handleScheduleMeeting('audit')}
              disabled={!selectedDate || !selectedTime}
              className='w-full rounded-xl bg-purple-500 p-4 text-white transition-colors hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50'
            >
              Schedule Audit Consultation
            </button>
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div>
          <h2 className='text-foreground mb-4 text-lg font-semibold'>
            Upcoming Meetings
          </h2>
          <div className='space-y-4'>
            {meetings
              .filter((meeting) => meeting.status === 'scheduled')
              .slice(0, 5)
              .map((meeting) => (
                <div
                  key={meeting.id}
                  className='border-border bg-card rounded-xl border p-4'
                >
                  <div className='flex items-start gap-4'>
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
                      <h3 className='text-foreground font-semibold'>
                        {meeting.title}
                      </h3>
                      <p className='text-muted-foreground mb-2 text-sm'>
                        {formatDate(meeting.date)} at {formatTime(meeting.time)}
                      </p>
                      <div className='flex items-center gap-4 text-xs'>
                        <span className='text-muted-foreground flex items-center gap-1'>
                          <Clock className='h-3 w-3' />
                          {meeting.duration} min
                        </span>
                        <span className='text-muted-foreground flex items-center gap-1'>
                          <Users className='h-3 w-3' />
                          {meeting.attendees.length} attendees
                        </span>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(meeting.status)}`}
                    >
                      {meeting.status}
                    </span>
                  </div>
                </div>
              ))}

            {meetings.filter((meeting) => meeting.status === 'scheduled')
              .length === 0 && (
              <div className='text-muted-foreground py-8 text-center'>
                <Calendar className='mx-auto mb-4 h-12 w-12 opacity-50' />
                <p>No upcoming meetings</p>
                <p className='text-sm'>
                  Schedule your first meeting to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
