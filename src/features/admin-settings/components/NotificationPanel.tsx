'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, Plus, X } from 'lucide-react';
import { NotificationConfig } from '../types';

interface NotificationPanelProps {
  config: NotificationConfig;
  onConfigChange: (key: keyof NotificationConfig, value: any) => void;
  onAddEmailRecipient: () => void;
  onRemoveEmailRecipient: (email: string) => void;
  newEmail: string;
  setNewEmail: (email: string) => void;
}

export function NotificationPanel({
  config,
  onConfigChange,
  onAddEmailRecipient,
  onRemoveEmailRecipient,
  newEmail,
  setNewEmail
}: NotificationPanelProps) {
  return (
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
                  checked={config.email}
                  onCheckedChange={(checked) => onConfigChange('email', checked)}
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
                  checked={config.systemAlerts}
                  onCheckedChange={(checked) => onConfigChange('systemAlerts', checked)}
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
                  checked={config.auditLogs}
                  onCheckedChange={(checked) => onConfigChange('auditLogs', checked)}
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
                  checked={config.securityEvents}
                  onCheckedChange={(checked) => onConfigChange('securityEvents', checked)}
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
                  checked={config.maintenanceMode}
                  onCheckedChange={(checked) => onConfigChange('maintenanceMode', checked)}
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
                  onKeyPress={(e) => e.key === 'Enter' && onAddEmailRecipient()}
                />
                <Button onClick={onAddEmailRecipient} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {config.emailRecipients.map((email, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">{email}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onRemoveEmailRecipient(email)}
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
  );
} 