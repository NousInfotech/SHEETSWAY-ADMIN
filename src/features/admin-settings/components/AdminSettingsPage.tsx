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
import { toast } from 'sonner';

// Import subcomponents
import { AdminUsersTable } from './AdminUsersTable';
import { ActivityLogTable } from './ActivityLogTable';
import { SystemLogsTable } from './SystemLogsTable';
import { NotificationPanel } from './NotificationPanel';
import { ApiKeysPanel } from './ApiKeysPanel';
import { EditUserDialog } from './EditUserDialog';
import { ViewUserDialog } from './ViewUserDialog';
import { ViewSystemLogDialog } from './ViewSystemLogDialog';

// Import types and constants
import { AdminUser, NotificationConfig, ApiKey, SystemSettings, ActivityLog } from '../types';
import { STORAGE_KEYS, mockUsers, mockAuditLogs, mockSystemLogs } from '../constants';

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
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(mockAuditLogs);

  // Dialog states
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showAddApiKeyDialog, setShowAddApiKeyDialog] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editingApiKey, setEditingApiKey] = useState<ApiKey | null>(null);
  const [viewUser, setViewUser] = useState<AdminUser | null>(null);
  const [viewSystemLog, setViewSystemLog] = useState<any | null>(null);

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

  // Load data from localStorage on component mount
  useEffect(() => {
    loadDataFromStorage();
  }, []);

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
        setAdminUsers(mockUsers);
      }

      if (storedNotifications) {
        setNotificationConfig(JSON.parse(storedNotifications));
      }

      if (storedApiKeys) {
        setApiKeys(JSON.parse(storedApiKeys));
      } else {
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

  const addActivityLog = (log: ActivityLog) => {
    const updatedLogs = [log, ...activityLogs];
    setActivityLogs(updatedLogs);
    saveToStorage(STORAGE_KEYS.ACTIVITY_LOGS, updatedLogs);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Data refreshed successfully');
    }, 1000);
  };

  // Admin Users Management
  const handleAddUser = () => {
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
    saveToStorage(STORAGE_KEYS.ADMIN_USERS, updatedUsers);
    
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
    const updatedRecipients = notificationConfig.emailRecipients.filter((e: string) => e !== email);
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
          <AdminUsersTable 
            users={adminUsers}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
            onToggleUserStatus={handleToggleUserStatus}
            onEditUser={setEditingUser}
            onViewUser={setViewUser}
            newUser={newUser}
            setNewUser={setNewUser}
            showAddUserDialog={showAddUserDialog}
            setShowAddUserDialog={setShowAddUserDialog}
          />
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity-log" className="space-y-6">
          <ActivityLogTable 
            logs={activityLogs}
            onDeleteLogs={(logIds: string[]) => {
              setActivityLogs(logs => logs.filter(l => !logIds.includes(l.id)));
            }}
          />
        </TabsContent>

        {/* System Logs Tab */}
        <TabsContent value="system-logs" className="space-y-6">
          <SystemLogsTable 
            logs={mockSystemLogs}
            onViewLog={setViewSystemLog}
          />
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <NotificationPanel 
            config={notificationConfig}
            onConfigChange={handleNotificationConfigChange}
            onAddEmailRecipient={handleAddEmailRecipient}
            onRemoveEmailRecipient={handleRemoveEmailRecipient}
            newEmail={newEmail}
            setNewEmail={setNewEmail}
          />
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-6">
          <ApiKeysPanel 
            apiKeys={apiKeys}
            onAddApiKey={handleAddApiKey}
            onRotateApiKey={handleRotateApiKey}
            onDeleteApiKey={handleDeleteApiKey}
            newApiKey={newApiKey}
            setNewApiKey={setNewApiKey}
            showAddApiKeyDialog={showAddApiKeyDialog}
            setShowAddApiKeyDialog={setShowAddApiKeyDialog}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <EditUserDialog 
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={(updatedUser: AdminUser) => {
          setAdminUsers(users => users.map(u =>
            u.id === editingUser?.id ? updatedUser : u
          ));
          setEditingUser(null);
        }}
      />

      <ViewUserDialog 
        user={viewUser}
        onClose={() => setViewUser(null)}
      />

      <ViewSystemLogDialog 
        log={viewSystemLog}
        onClose={() => setViewSystemLog(null)}
      />
    </div>
  );
} 