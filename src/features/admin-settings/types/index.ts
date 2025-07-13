export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  permissions: string[];
  createdAt: string;
}

export interface NotificationConfig {
  email: boolean;
  systemAlerts: boolean;
  auditLogs: boolean;
  securityEvents: boolean;
  maintenanceMode: boolean;
  emailRecipients: string[];
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed: string;
  status: 'active' | 'inactive' | 'expired';
}

export interface SystemSettings {
  siteName: string;
  adminEmail: string;
  timezone: string;
  maintenanceMode: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  ipWhitelist: boolean;
  ipAddresses: string[];
  cacheEnabled: boolean;
  cacheTTL: number;
  debugMode: boolean;
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}



