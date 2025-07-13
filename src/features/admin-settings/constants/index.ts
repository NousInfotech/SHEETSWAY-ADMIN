export const STORAGE_KEYS = {
  ADMIN_USERS: 'admin_users',
  NOTIFICATION_CONFIG: 'notification_config',
  API_KEYS: 'api_keys',
  SYSTEM_SETTINGS: 'system_settings',
  ACTIVITY_LOGS: 'activity_logs'
};

export const mockUsers = [
  {
    id: '1',
    name: 'John Admin',
    email: 'john@sheetsway.com',
    role: 'super_admin' as const,
    status: 'active' as const,
    lastLogin: '2024-01-15 14:30:00',
    permissions: ['read', 'write', 'delete', 'admin'],
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Sarah Manager',
    email: 'sarah@sheetsway.com',
    role: 'admin' as const,
    status: 'active' as const,
    lastLogin: '2024-01-14 09:15:00',
    permissions: ['read', 'write'],
    createdAt: '2024-01-05'
  },
  {
    id: '3',
    name: 'Mike Moderator',
    email: 'mike@sheetsway.com',
    role: 'moderator' as const,
    status: 'inactive' as const,
    lastLogin: '2024-01-10 16:45:00',
    permissions: ['read'],
    createdAt: '2024-01-08'
  }
];

export const mockAuditLogs = [
  {
    id: '1',
    action: 'Login',
    user: 'John Admin',
    timestamp: '2024-01-15 14:30:00',
    details: 'User logged in successfully'
  },
  {
    id: '2',
    action: 'Add Admin User',
    user: 'John Admin',
    timestamp: '2024-01-15 13:45:00',
    details: 'Added new admin user: sarah@sheetsway.com'
  },
  {
    id: '3',
    action: 'Delete User',
    user: 'Sarah Manager',
    timestamp: '2024-01-14 11:20:00',
    details: 'Deleted user account: olduser@sheetsway.com'
  },
  {
    id: '4',
    action: 'Update Settings',
    user: 'John Admin',
    timestamp: '2024-01-14 10:15:00',
    details: 'Updated system maintenance mode settings'
  },
  {
    id: '5',
    action: 'Export Data',
    user: 'Sarah Manager',
    timestamp: '2024-01-13 16:30:00',
    details: 'Exported user data for compliance audit'
  }
];

export const mockSystemLogs = [
  {
    id: '1',
    timestamp: '2024-01-15 14:30:00',
    level: 'INFO',
    component: 'Authentication',
    message: 'User login successful',
    details: 'User john@sheetsway.com logged in from IP 192.168.1.100',
    environment: 'production',
    requestId: 'req_123456789'
  },
  {
    id: '2',
    timestamp: '2024-01-15 13:45:00',
    level: 'WARNING',
    component: 'Database',
    message: 'Slow query detected',
    details: 'Query took 2.5 seconds to execute',
    environment: 'production',
    requestId: 'req_123456788'
  },
  {
    id: '3',
    timestamp: '2024-01-15 12:20:00',
    level: 'ERROR',
    component: 'API',
    message: 'Rate limit exceeded',
    details: 'User exceeded API rate limit of 100 requests per minute',
    environment: 'production',
    requestId: 'req_123456787'
  },
  {
    id: '4',
    timestamp: '2024-01-15 11:15:00',
    level: 'INFO',
    component: 'System',
    message: 'Backup completed',
    details: 'Daily backup completed successfully',
    environment: 'production',
    requestId: 'req_123456786'
  },
  {
    id: '5',
    timestamp: '2024-01-15 10:30:00',
    level: 'ERROR',
    component: 'Email Service',
    message: 'Failed to send email',
    details: 'SMTP connection timeout',
    environment: 'production',
    requestId: 'req_123456785',
    stackTrace: 'Error: SMTP timeout\n    at EmailService.send (/app/services/email.js:45:12)\n    at async processEmail (/app/controllers/email.js:23:8)'
  }
];



