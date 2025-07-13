'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  Users, 
  Shield, 
  Activity, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  UserPlus,
  Lock,
  Globe,
  Database,
  Server,
  Network,
  Bell,
  Mail,
  Zap,
  Key,
  RotateCcw,
  Plus,
  X,
  Save,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

import { mockUsers, mockAuditLogs, mockSystemLogs } from './admin-settings/mock-data';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

// Types for dynamic data
interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  permissions: string[];
  createdAt: string;
}

interface NotificationConfig {
  email: boolean;
  systemAlerts: boolean;
  auditLogs: boolean;
  securityEvents: boolean;
  maintenanceMode: boolean;
  emailRecipients: string[];
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed: string;
  status: 'active' | 'inactive' | 'expired';
}

interface SystemSettings {
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

// Add ActivityLog type at the top level
export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

// Local Storage Keys
const STORAGE_KEYS = {
  ADMIN_USERS: 'admin_users',
  NOTIFICATION_CONFIG: 'notification_config',
  API_KEYS: 'api_keys',
  SYSTEM_SETTINGS: 'system_settings',
  ACTIVITY_LOGS: 'activity_logs'
};

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('system-settings');
  const [isLoading, setIsLoading] = useState(false);
  
  // State for dynamic data
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [notificationConfig, setNotificationConfig] = useState<NotificationConfig>({
    email: true,
    systemAlerts: true,
    auditLogs: false,
    securityEvents: true,
    maintenanceMode: false,
    emailRecipients: ['admin@sheetsway.com']
  });
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: 'SheetsWay Admin',
    adminEmail: 'admin@sheetsway.com',
    timezone: 'UTC',
    maintenanceMode: false,
    twoFactorAuth: true,
    sessionTimeout: 30,
    ipWhitelist: false,
    ipAddresses: [],
    cacheEnabled: true,
    cacheTTL: 3600,
    debugMode: false
  });
  // Add this state for activity logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(mockAuditLogs);

  // Dialog states
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showAddApiKeyDialog, setShowAddApiKeyDialog] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editingApiKey, setEditingApiKey] = useState<ApiKey | null>(null);

  // Form states
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'admin' as const,
    permissions: [] as string[]
  });

  const [newApiKey, setNewApiKey] = useState({
    name: '',
    permissions: [] as string[]
  });

  const [newEmail, setNewEmail] = useState('');

  // Add state for bulk selection
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedLogIds, setSelectedLogIds] = useState<string[]>([]);

  // Add state for search/filter
  const [logSearch, setLogSearch] = useState('');
  const [logUserFilter, setLogUserFilter] = useState('__all__');
  const [logActionFilter, setLogActionFilter] = useState('__all__');

  // Add state for editing user
  const [editUserForm, setEditUserForm] = useState({ name: '', email: '', role: 'admin', status: 'active' });

  // Add pagination for system logs
  const [systemLogPage, setSystemLogPage] = useState(0);
  const [systemLogRowsPerPage, setSystemLogRowsPerPage] = useState(10);
  const systemLogPageCount = Math.ceil(mockSystemLogs.length / systemLogRowsPerPage);
  const paginatedSystemLogs = mockSystemLogs.slice(systemLogPage * systemLogRowsPerPage, (systemLogPage + 1) * systemLogRowsPerPage);

  // Load data from localStorage on component mount
  useEffect(() => {
    loadDataFromStorage();
  }, []);

  // Reset filters when switching to activity log tab
  useEffect(() => {
    if (activeTab === 'activity-log') {
      setLogUserFilter('__all__');
      setLogActionFilter('__all__');
      setLogSearch('');
    }
  }, [activeTab]);

  const loadDataFromStorage = () => {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEYS.ADMIN_USERS);
      const storedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_CONFIG);
      const storedApiKeys = localStorage.getItem(STORAGE_KEYS.API_KEYS);
      const storedSettings = localStorage.getItem(STORAGE_KEYS.SYSTEM_SETTINGS);
      const storedActivityLogs = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);

      if (storedUsers) {
        setAdminUsers(JSON.parse(storedUsers));
      } else {
        // Initialize with mock data
        setAdminUsers(mockUsers);
      }

      if (storedNotifications) {
        setNotificationConfig(JSON.parse(storedNotifications));
      }

      if (storedApiKeys) {
        setApiKeys(JSON.parse(storedApiKeys));
      } else {
        // Initialize with sample API keys
        setApiKeys([
          {
            id: '1',
            name: 'Production API Key',
            key: 'sk_live_1234567890abcdef',
            permissions: ['read', 'write'],
            createdAt: '2024-01-01',
            lastUsed: '2024-01-15 14:30:00',
            status: 'active'
          },
          {
            id: '2',
            name: 'Development API Key',
            key: 'sk_test_abcdef1234567890',
            permissions: ['read'],
            createdAt: '2024-01-10',
            lastUsed: '2024-01-14 09:15:00',
            status: 'active'
          }
        ]);
      }

      if (storedSettings) {
        setSystemSettings(JSON.parse(storedSettings));
      }

      if (storedActivityLogs) {
        setActivityLogs(JSON.parse(storedActivityLogs));
      } else {
        setActivityLogs(mockAuditLogs);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  };

  const saveToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Add a helper to add a log entry
  const addActivityLog = (log: ActivityLog) => {
    const updatedLogs = [log, ...activityLogs];
    setActivityLogs(updatedLogs);
    saveToStorage(STORAGE_KEYS.ACTIVITY_LOGS, updatedLogs);
  };

  // Note: useDataTable hooks removed as they were not being used in the component

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Data refreshed successfully');
    }, 1000);
  };

  // Admin Users Management
  const handleAddUser = () => {
    console.log('handleAddUser called');
    if (!newUser.name || !newUser.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    const user: AdminUser = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'active',
      lastLogin: 'Never',
      permissions: newUser.permissions,
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...adminUsers, user];
    setAdminUsers(updatedUsers);
    console.log('adminUsers after add:', updatedUsers);
    saveToStorage(STORAGE_KEYS.ADMIN_USERS, updatedUsers);
    
    // Add activity log
    addActivityLog({
      id: Date.now().toString(),
      action: 'Add Admin User',
      user: user.name,
      timestamp: new Date().toISOString(),
      details: `Added admin user: ${user.email}`
    });

    setNewUser({ name: '', email: '', role: 'admin', permissions: [] });
    setShowAddUserDialog(false);
    toast.success('Admin user added successfully');
  };

  const handleDeleteUser = (userId: string) => {
    const user = adminUsers.find(u => u.id === userId);
    const updatedUsers = adminUsers.filter(user => user.id !== userId);
    setAdminUsers(updatedUsers);
    saveToStorage(STORAGE_KEYS.ADMIN_USERS, updatedUsers);
    if (user) {
      addActivityLog({
        id: Date.now().toString(),
        action: 'Delete Admin User',
        user: user.name,
        timestamp: new Date().toISOString(),
        details: `Deleted admin user: ${user.email}`
      });
    }
    toast.success('User deleted successfully');
  };

  const handleToggleUserStatus = (userId: string) => {
    const updatedUsers = adminUsers.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'suspended' as 'suspended' : 'active' as 'active' }
        : user
    );
    setAdminUsers(updatedUsers);
    saveToStorage(STORAGE_KEYS.ADMIN_USERS, updatedUsers);
    toast.success('User status updated');
  };

  // API Keys Management
  const handleAddApiKey = () => {
    if (!newApiKey.name) {
      toast.error('Please enter a name for the API key');
      return;
    }

    const apiKey: ApiKey = {
      id: Date.now().toString(),
      name: newApiKey.name,
      key: `sk_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`,
      permissions: newApiKey.permissions,
      createdAt: new Date().toISOString(),
      lastUsed: 'Never',
      status: 'active'
    };

    const updatedApiKeys = [...apiKeys, apiKey];
    setApiKeys(updatedApiKeys);
    saveToStorage(STORAGE_KEYS.API_KEYS, updatedApiKeys);
    
    setNewApiKey({ name: '', permissions: [] });
    setShowAddApiKeyDialog(false);
    toast.success('API key created successfully');
  };

  const handleRotateApiKey = (keyId: string) => {
    const updatedApiKeys = apiKeys.map(key => 
      key.id === keyId 
        ? { 
            ...key, 
            key: `sk_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`,
            lastUsed: new Date().toISOString()
          }
        : key
    );
    setApiKeys(updatedApiKeys);
    saveToStorage(STORAGE_KEYS.API_KEYS, updatedApiKeys);
    toast.success('API key rotated successfully');
  };

  const handleDeleteApiKey = (keyId: string) => {
    const updatedApiKeys = apiKeys.filter(key => key.id !== keyId);
    setApiKeys(updatedApiKeys);
    saveToStorage(STORAGE_KEYS.API_KEYS, updatedApiKeys);
    toast.success('API key deleted successfully');
  };

  // Notification Configuration
  const handleNotificationConfigChange = (key: keyof NotificationConfig, value: any) => {
    const updatedConfig = { ...notificationConfig, [key]: value };
    setNotificationConfig(updatedConfig);
    saveToStorage(STORAGE_KEYS.NOTIFICATION_CONFIG, updatedConfig);
  };

  const handleAddEmailRecipient = () => {
    if (!newEmail || notificationConfig.emailRecipients.includes(newEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const updatedRecipients = [...notificationConfig.emailRecipients, newEmail];
    handleNotificationConfigChange('emailRecipients', updatedRecipients);
    setNewEmail('');
    toast.success('Email recipient added');
  };

  const handleRemoveEmailRecipient = (email: string) => {
    const updatedRecipients = notificationConfig.emailRecipients.filter(e => e !== email);
    handleNotificationConfigChange('emailRecipients', updatedRecipients);
    toast.success('Email recipient removed');
  };

  // System Settings
  const handleSystemSettingChange = (key: keyof SystemSettings, value: any) => {
    const updatedSettings = { ...systemSettings, [key]: value };
    setSystemSettings(updatedSettings);
    saveToStorage(STORAGE_KEYS.SYSTEM_SETTINGS, updatedSettings);
  };

  const handleSaveSettings = () => {
    saveToStorage(STORAGE_KEYS.SYSTEM_SETTINGS, systemSettings);
    toast.success('Settings saved successfully');
  };

  // Export functionality
  const handleExportLogs = () => {
    const exportData = {
      adminUsers,
      auditLogs: activityLogs,
      systemLogs: mockSystemLogs,
      notificationConfig,
      apiKeys,
      systemSettings,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-settings-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully');
  };

  // Add pagination state for Admin Users
  const [userPage, setUserPage] = useState(0);
  const [userRowsPerPage, setUserRowsPerPage] = useState(10);
  const userPageCount = Math.ceil(adminUsers.length / userRowsPerPage);
  const paginatedUsers = adminUsers.slice(userPage * userRowsPerPage, (userPage + 1) * userRowsPerPage);

  // Add pagination state for Activity Logs
  const [logPage, setLogPage] = useState(0);
  const [logRowsPerPage, setLogRowsPerPage] = useState(10);
  const logPageCount = Math.ceil(activityLogs.length / logRowsPerPage);
  const paginatedLogs = activityLogs.slice(logPage * logRowsPerPage, (logPage + 1) * logRowsPerPage);

  // Filtered activity logs
  const filteredLogs = activityLogs.filter(log => {
    return (
      (!logSearch || log.details.toLowerCase().includes(logSearch.toLowerCase()) || log.user.toLowerCase().includes(logSearch.toLowerCase())) &&
      (logUserFilter === '__all__' || log.user === logUserFilter) &&
      (logActionFilter === '__all__' || log.action === logActionFilter)
    );
  });
  const filteredPaginatedLogs = filteredLogs.slice(logPage * logRowsPerPage, (logPage + 1) * logRowsPerPage);
  const filteredLogPageCount = Math.ceil(filteredLogs.length / logRowsPerPage);

  // Add state for viewing details
  const [viewUser, setViewUser] = useState<AdminUser | null>(null);
  const [viewSystemLog, setViewSystemLog] = useState<any | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings & Logs</h1>
          <p className="text-muted-foreground">
            Manage system settings, users, and monitor system activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center"><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Refreshing...</span>
            ) : (
              <><RefreshCw className="h-4 w-4 mr-2" />Refresh</>
            )}
          </Button>
          <Button onClick={handleExportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Tabs rendering */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex w-full gap-x-2">
          <TabsTrigger value="system-settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            System Settings
          </TabsTrigger>
          <TabsTrigger value="admin-users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Admin Users
          </TabsTrigger>
          <TabsTrigger value="activity-log" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activity Log
          </TabsTrigger>
          <TabsTrigger value="system-logs" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            System Logs
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
        </TabsList>

        {/* System Settings Tab */}
        <TabsContent value="system-settings" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Configure basic system settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input 
                    id="site-name" 
                    value={systemSettings.siteName}
                    onChange={(e) => handleSystemSettingChange('siteName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input 
                    id="admin-email" 
                    type="email" 
                    value={systemSettings.adminEmail}
                    onChange={(e) => handleSystemSettingChange('adminEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input 
                    id="timezone" 
                    value={systemSettings.timezone}
                    onChange={(e) => handleSystemSettingChange('timezone', e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable maintenance mode to restrict access
                    </p>
                  </div>
                  <Switch 
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked) => handleSystemSettingChange('maintenanceMode', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure security and authentication settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all users
                    </p>
                  </div>
                  <Switch 
                    checked={systemSettings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSystemSettingChange('twoFactorAuth', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input 
                    id="session-timeout" 
                    type="number" 
                    value={systemSettings.sessionTimeout}
                    onChange={(e) => handleSystemSettingChange('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>IP Whitelist</Label>
                    <p className="text-sm text-muted-foreground">
                      Restrict access to specific IPs
                    </p>
                  </div>
                  <Switch 
                    checked={systemSettings.ipWhitelist}
                    onCheckedChange={(checked) => handleSystemSettingChange('ipWhitelist', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Performance Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance Settings
                </CardTitle>
                <CardDescription>
                  Configure system performance and caching
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Caching</Label>
                    <p className="text-sm text-muted-foreground">
                      Cache frequently accessed data
                    </p>
                  </div>
                  <Switch 
                    checked={systemSettings.cacheEnabled}
                    onCheckedChange={(checked) => handleSystemSettingChange('cacheEnabled', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cache-ttl">Cache TTL (seconds)</Label>
                  <Input 
                    id="cache-ttl" 
                    type="number" 
                    value={systemSettings.cacheTTL}
                    onChange={(e) => handleSystemSettingChange('cacheTTL', parseInt(e.target.value))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable debug logging
                    </p>
                  </div>
                  <Switch 
                    checked={systemSettings.debugMode}
                    onCheckedChange={(checked) => handleSystemSettingChange('debugMode', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  Save Settings
                </CardTitle>
                <CardDescription>
                  Save all configuration changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleSaveSettings} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save All Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Admin Users Tab */}
        <TabsContent value="admin-users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Role-Based Admin Users</CardTitle>
                  <CardDescription>Manage system administrators and their permissions</CardDescription>
                </div>
                <Button onClick={() => setShowAddUserDialog(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Admin User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Bulk Action Bar */}
              {selectedUserIds.length > 0 && (
                <div className="mb-2 flex items-center gap-2 bg-muted p-2 rounded">
                  <span>{selectedUserIds.length} selected</span>
                  <Button variant="destructive" size="sm" onClick={() => {
                    setAdminUsers(users => users.filter(u => !selectedUserIds.includes(u.id)));
                    setSelectedUserIds([]);
                  }}>Delete Selected</Button>
                </div>
              )}
              {/* Admin Users Table (compact) */}
              <div className="overflow-x-auto pr-4">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background z-10 whitespace-nowrap">Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center w-32">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-4">No users found.</TableCell></TableRow>
                    ) : (
                      paginatedUsers.map(user => (
                        <TableRow key={user.id}>
                          <TableCell className="sticky left-0 bg-background z-10 whitespace-nowrap">{user.name}</TableCell>
                          <TableCell className="truncate max-w-[180px] whitespace-nowrap">{user.email}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>{user.status}</TableCell>
                          <TableCell className="text-center w-32 p-1">
                            <Button size="sm" variant="outline" onClick={() => setViewUser(user)}>View</Button>
                            <Button size="sm" variant="outline" onClick={() => {
                              setEditingUser(user);
                              setEditUserForm({ name: user.name, email: user.email, role: user.role, status: user.status });
                            }}>Edit</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span>Rows per page</span>
                  <Select value={userRowsPerPage.toString()} onValueChange={v => { setUserRowsPerPage(Number(v)); setUserPage(0); }}>
                    <SelectTrigger className="h-8 w-[4.5rem]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[5, 10, 20, 50].map(size => (
                        <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setUserPage(0)} disabled={userPage === 0}>&laquo;</Button>
                  <Button variant="outline" size="icon" onClick={() => setUserPage(p => Math.max(0, p - 1))} disabled={userPage === 0}>&lsaquo;</Button>
                  <span>Page {userPage + 1} of {userPageCount || 1}</span>
                  <Button variant="outline" size="icon" onClick={() => setUserPage(p => Math.min(userPageCount - 1, p + 1))} disabled={userPage >= userPageCount - 1}>&rsaquo;</Button>
                  <Button variant="outline" size="icon" onClick={() => setUserPage(userPageCount - 1)} disabled={userPage >= userPageCount - 1}>&raquo;</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Edit User Dialog */}
          <Dialog open={!!editingUser} onOpenChange={open => { if (!open) setEditingUser(null); }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Admin User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-user-name">Name</Label>
                  <Input id="edit-user-name" value={editUserForm.name} onChange={e => setEditUserForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-user-email">Email</Label>
                  <Input id="edit-user-email" value={editUserForm.email} onChange={e => setEditUserForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-user-role">Role</Label>
                  <Select value={editUserForm.role} onValueChange={v => setEditUserForm(f => ({ ...f, role: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-user-status">Status</Label>
                  <Select value={editUserForm.status} onValueChange={v => setEditUserForm(f => ({ ...f, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
                <Button onClick={() => {
                  setAdminUsers(users => users.map(u =>
                    u.id === editingUser?.id
                      ? {
                          ...u,
                          name: editUserForm.name,
                          email: editUserForm.email,
                          role: editUserForm.role as 'super_admin' | 'admin' | 'moderator',
                          status: editUserForm.status as 'active' | 'inactive' | 'suspended'
                        }
                      : u
                  ));
                  setEditingUser(null);
                }}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity-log" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>Monitor auditor, client, and admin actions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filter/Search Bar */}
              <div className="flex flex-wrap gap-2 mb-2 items-center">
                <Input placeholder="Search logs..." value={logSearch} onChange={e => setLogSearch(e.target.value)} className="w-48" />
                <Select value={logUserFilter} onValueChange={setLogUserFilter}>
                  <SelectTrigger className="w-40"><SelectValue placeholder="Filter by user" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Users</SelectItem>
                    {Array.from(new Set(activityLogs.map(l => l.user))).map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={logActionFilter} onValueChange={setLogActionFilter}>
                  <SelectTrigger className="w-40"><SelectValue placeholder="Filter by action" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Actions</SelectItem>
                    {Array.from(new Set(activityLogs.map(l => l.action))).map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {/* Bulk Action Bar */}
              {selectedLogIds.length > 0 && (
                <div className="mb-2 flex items-center gap-2 bg-muted p-2 rounded">
                  <span>{selectedLogIds.length} selected</span>
                  <Button variant="destructive" size="sm" onClick={() => {
                    setActivityLogs(logs => logs.filter(l => !selectedLogIds.includes(l.id)));
                    setSelectedLogIds([]);
                  }}>Delete Selected</Button>
                </div>
              )}
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <input type="checkbox" checked={selectedLogIds.length === filteredPaginatedLogs.length && filteredPaginatedLogs.length > 0} onChange={e => {
                          if (e.target.checked) setSelectedLogIds(filteredPaginatedLogs.map(l => l.id));
                          else setSelectedLogIds([]);
                        }} />
                      </TableHead>
                      <TableHead className="sticky left-0 bg-background z-10 whitespace-nowrap">Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPaginatedLogs.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-4">No activity logs found.</TableCell></TableRow>
                    ) : (
                      filteredPaginatedLogs.map(log => (
                        <TableRow key={log.id} data-state={selectedLogIds.includes(log.id) ? 'selected' : undefined}>
                          <TableCell>
                            <input type="checkbox" checked={selectedLogIds.includes(log.id)} onChange={e => {
                              if (e.target.checked) setSelectedLogIds(ids => [...ids, log.id]);
                              else setSelectedLogIds(ids => ids.filter(id => id !== log.id));
                            }} />
                          </TableCell>
                          <TableCell className="sticky left-0 bg-background z-10 whitespace-nowrap">{log.timestamp}</TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell>{log.details}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span>Rows per page</span>
                  <Select value={logRowsPerPage.toString()} onValueChange={v => { setLogRowsPerPage(Number(v)); setLogPage(0); }}>
                    <SelectTrigger className="h-8 w-[4.5rem]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[5, 10, 20, 50].map(size => (
                        <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setLogPage(0)} disabled={logPage === 0}>&laquo;</Button>
                  <Button variant="outline" size="icon" onClick={() => setLogPage(p => Math.max(0, p - 1))} disabled={logPage === 0}>&lsaquo;</Button>
                  <span>Page {logPage + 1} of {filteredLogPageCount || 1}</span>
                  <Button variant="outline" size="icon" onClick={() => setLogPage(p => Math.min(filteredLogPageCount - 1, p + 1))} disabled={logPage >= filteredLogPageCount - 1}>&rsaquo;</Button>
                  <Button variant="outline" size="icon" onClick={() => setLogPage(filteredLogPageCount - 1)} disabled={logPage >= filteredLogPageCount - 1}>&raquo;</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Logs Tab */}
        <TabsContent value="system-logs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>System Logs</CardTitle>
                  <CardDescription>Monitor system-level events and errors</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* System Logs Table (compact, recommended pattern) */}
              <div className="overflow-x-auto pr-4">
                <Table className="w-full">
                  <TableHeader className="sticky top-0 z-10 bg-background">
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background z-10 whitespace-nowrap">Timestamp</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Component</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead className="text-center w-32">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSystemLogs.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-4">No system logs found.</TableCell></TableRow>
                    ) : (
                      paginatedSystemLogs.map(log => (
                        <TableRow key={log.id}>
                          <TableCell className="sticky left-0 bg-background z-10 whitespace-nowrap">{log.timestamp}</TableCell>
                          <TableCell>{log.level}</TableCell>
                          <TableCell className="truncate max-w-[140px] whitespace-nowrap">{log.component}</TableCell>
                          <TableCell className="truncate max-w-[180px] whitespace-nowrap">{log.message}</TableCell>
                          <TableCell className="text-center w-32 p-1">
                            <Button size="sm" variant="outline" onClick={() => setViewSystemLog(log)}>View</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span>Rows per page</span>
                  <Select value={systemLogRowsPerPage.toString()} onValueChange={v => { setSystemLogRowsPerPage(Number(v)); setSystemLogPage(0); }}>
                    <SelectTrigger className="h-8 w-[4.5rem]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[5, 10, 20, 50].map(size => (
                        <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setSystemLogPage(0)} disabled={systemLogPage === 0}>&laquo;</Button>
                  <Button variant="outline" size="icon" onClick={() => setSystemLogPage(p => Math.max(0, p - 1))} disabled={systemLogPage === 0}>&lsaquo;</Button>
                  <span>Page {systemLogPage + 1} of {systemLogPageCount || 1}</span>
                  <Button variant="outline" size="icon" onClick={() => setSystemLogPage(p => Math.min(systemLogPageCount - 1, p + 1))} disabled={systemLogPage >= systemLogPageCount - 1}>&rsaquo;</Button>
                  <Button variant="outline" size="icon" onClick={() => setSystemLogPage(systemLogPageCount - 1)} disabled={systemLogPage >= systemLogPageCount - 1}>&raquo;</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Configuration Panel
              </CardTitle>
              <CardDescription>
                Configure system notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Notification Types</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Send notifications via email
                        </p>
                      </div>
                      <Switch 
                        checked={notificationConfig.email}
                        onCheckedChange={(checked) => handleNotificationConfigChange('email', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>System Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Show system alerts in dashboard
                        </p>
                      </div>
                      <Switch 
                        checked={notificationConfig.systemAlerts}
                        onCheckedChange={(checked) => handleNotificationConfigChange('systemAlerts', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Audit Log Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Notify on security events
                        </p>
                      </div>
                      <Switch 
                        checked={notificationConfig.auditLogs}
                        onCheckedChange={(checked) => handleNotificationConfigChange('auditLogs', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Security Events</Label>
                        <p className="text-sm text-muted-foreground">
                          Notify on security incidents
                        </p>
                      </div>
                      <Switch 
                        checked={notificationConfig.securityEvents}
                        onCheckedChange={(checked) => handleNotificationConfigChange('securityEvents', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Notify when maintenance mode is enabled
                        </p>
                      </div>
                      <Switch 
                        checked={notificationConfig.maintenanceMode}
                        onCheckedChange={(checked) => handleNotificationConfigChange('maintenanceMode', checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Email Recipients</h3>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Enter email address"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddEmailRecipient()}
                      />
                      <Button onClick={handleAddEmailRecipient} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {notificationConfig.emailRecipients.map((email, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">{email}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveEmailRecipient(email)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Keys and Audit Log Exporter
                  </CardTitle>
                  <CardDescription>
                    Manage API credentials and integrations
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAddApiKeyDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add API Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{apiKey.name}</h3>
                        <Badge variant={apiKey.status === 'active' ? 'default' : 'secondary'}>
                          {apiKey.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Key: {apiKey.key.substring(0, 12)}...
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Created: {apiKey.createdAt} | Last Used: {apiKey.lastUsed}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          handleRotateApiKey(apiKey.id);
                          toast.success('API key rotated!');
                        }}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Rotate
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(apiKey.key);
                          toast.success('API key copied!');
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          handleDeleteApiKey(apiKey.id);
                          toast.success('API key deleted!');
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Admin User</DialogTitle>
            <DialogDescription>
              Add a new administrator to the system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">Name</Label>
              <Input 
                id="user-name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">Email</Label>
              <Input 
                id="user-email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role">Role</Label>
              <Select 
                value={newUser.role} 
                onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add API Key Dialog */}
      <Dialog open={showAddApiKeyDialog} onOpenChange={setShowAddApiKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add API Key</DialogTitle>
            <DialogDescription>
              Create a new API key for integrations
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key-name">Name</Label>
              <Input 
                id="api-key-name"
                value={newApiKey.name}
                onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
                placeholder="e.g., Production API Key"
              />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="space-y-2">
                {['read', 'write', 'delete', 'admin'].map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={permission}
                      checked={newApiKey.permissions.includes(permission)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewApiKey({
                            ...newApiKey,
                            permissions: [...newApiKey.permissions, permission]
                          });
                        } else {
                          setNewApiKey({
                            ...newApiKey,
                            permissions: newApiKey.permissions.filter(p => p !== permission)
                          });
                        }
                      }}
                    />
                    <Label htmlFor={permission} className="text-sm">
                      {permission.charAt(0).toUpperCase() + permission.slice(1)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddApiKeyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddApiKey}>
              Create API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={!!viewUser} onOpenChange={open => { if (!open) setViewUser(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {viewUser && (
            <div className="space-y-2">
              <div><b>Name:</b> {viewUser.name}</div>
              <div><b>Email:</b> {viewUser.email}</div>
              <div><b>Role:</b> {viewUser.role}</div>
              <div><b>Status:</b> {viewUser.status}</div>
              <div><b>Last Login:</b> {viewUser.lastLogin}</div>
              <div><b>Created:</b> {viewUser.createdAt}</div>
              <div><b>Permissions:</b> {viewUser.permissions?.join(', ')}</div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewUser(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View System Log Dialog */}
      <Dialog open={!!viewSystemLog} onOpenChange={open => { if (!open) setViewSystemLog(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>System Log Details</DialogTitle>
          </DialogHeader>
          {viewSystemLog && (
            <div className="space-y-2">
              <div><b>Timestamp:</b> {viewSystemLog.timestamp}</div>
              <div><b>Level:</b> {viewSystemLog.level}</div>
              <div><b>Component:</b> {viewSystemLog.component}</div>
              <div><b>Message:</b> {viewSystemLog.message}</div>
              <div><b>Details:</b> {viewSystemLog.details}</div>
              <div><b>Environment:</b> {viewSystemLog.environment}</div>
              <div><b>Request ID:</b> {viewSystemLog.requestId}</div>
              {viewSystemLog.stackTrace && <div><b>Stack Trace:</b> <pre className="whitespace-pre-wrap">{viewSystemLog.stackTrace}</pre></div>}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewSystemLog(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 