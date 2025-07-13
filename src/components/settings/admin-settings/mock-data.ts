export const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@sheetsway.com',
    role: 'super_admin' as const,
    status: 'active' as const,
    lastLogin: '2024-01-15 14:30:00',
    permissions: ['read', 'write', 'delete', 'admin'],
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@sheetsway.com',
    role: 'admin' as const,
    status: 'active' as const,
    lastLogin: '2024-01-14 09:15:00',
    permissions: ['read', 'write'],
    createdAt: '2024-01-05'
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@sheetsway.com',
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
    user: 'John Doe',
    timestamp: '2024-01-15 14:30:00',
    details: 'User logged in successfully'
  },
  {
    id: '2',
    action: 'Add Admin User',
    user: 'John Doe',
    timestamp: '2024-01-15 13:45:00',
    details: 'Added admin user: jane@sheetsway.com'
  },
  {
    id: '3',
    action: 'Delete Admin User',
    user: 'Jane Smith',
    timestamp: '2024-01-15 12:20:00',
    details: 'Deleted admin user: olduser@sheetsway.com'
  },
  {
    id: '4',
    action: 'System Settings Update',
    user: 'John Doe',
    timestamp: '2024-01-15 11:15:00',
    details: 'Updated maintenance mode settings'
  },
  {
    id: '5',
    action: 'API Key Rotation',
    user: 'Jane Smith',
    timestamp: '2024-01-15 10:30:00',
    details: 'Rotated production API key'
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
    requestId: 'req_123456'
  },
  {
    id: '2',
    timestamp: '2024-01-15 14:25:00',
    level: 'WARNING',
    component: 'Database',
    message: 'Slow query detected',
    details: 'Query took 2.5 seconds to execute',
    environment: 'production',
    requestId: 'req_123455'
  },
  {
    id: '3',
    timestamp: '2024-01-15 14:20:00',
    level: 'ERROR',
    component: 'API',
    message: 'Rate limit exceeded',
    details: 'User exceeded API rate limit of 100 requests per minute',
    environment: 'production',
    requestId: 'req_123454'
  },
  {
    id: '4',
    timestamp: '2024-01-15 14:15:00',
    level: 'INFO',
    component: 'Cache',
    message: 'Cache miss',
    details: 'Cache miss for key: user_profile_123',
    environment: 'production',
    requestId: 'req_123453'
  },
  {
    id: '5',
    timestamp: '2024-01-15 14:10:00',
    level: 'DEBUG',
    component: 'System',
    message: 'Memory usage normal',
    details: 'Memory usage at 65%',
    environment: 'production',
    requestId: 'req_123452'
  }
]; 