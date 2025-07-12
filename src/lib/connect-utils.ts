// eslint-disable-next-line @typescript-eslint/no-unused-vars
// Local storage utilities
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    // TODO: Implement proper error handling
    console.error(`Error loading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const saveToLocalStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // TODO: Implement proper error handling
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
};

// Status and color utilities
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'text-blue-500 bg-blue-500/10';
    case 'completed':
      return 'text-green-500 bg-green-500/10';
    case 'cancelled':
      return 'text-red-500 bg-red-500/10';
    default:
      return 'text-gray-500 bg-gray-500/10';
  }
};

export const getTypeColor = (type: string) => {
  switch (type) {
    case 'onboarding':
      return 'text-blue-500 bg-blue-500/10';
    case 'support':
      return 'text-green-500 bg-green-500/10';
    case 'audit':
      return 'text-purple-500 bg-purple-500/10';
    default:
      return 'text-gray-500 bg-gray-500/10';
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'busy':
      return 'bg-yellow-500';
    case 'offline':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

// Meeting duration utilities
export const getMeetingDuration = (
  type: 'onboarding' | 'support' | 'audit'
) => {
  switch (type) {
    case 'audit':
      return 90;
    case 'onboarding':
      return 60;
    case 'support':
      return 30;
    default:
      return 30;
  }
};

// Time formatting utilities
export const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Generate meeting title
export const generateMeetingTitle = (
  type: 'onboarding' | 'support' | 'audit'
) => {
  return `${type.charAt(0).toUpperCase() + type.slice(1)} Meeting`;
};
