'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Key, Plus, RotateCcw, Copy, Trash2 } from 'lucide-react';
import { ApiKey } from '../types';
import { toast } from 'sonner';

interface ApiKeysPanelProps {
  apiKeys: ApiKey[];
  onAddApiKey: () => void;
  onRotateApiKey: (keyId: string) => void;
  onDeleteApiKey: (keyId: string) => void;
  newApiKey: {
    name: string;
    permissions: string[];
  };
  setNewApiKey: (apiKey: any) => void;
  showAddApiKeyDialog: boolean;
  setShowAddApiKeyDialog: (show: boolean) => void;
}

export function ApiKeysPanel({
  apiKeys,
  onAddApiKey,
  onRotateApiKey,
  onDeleteApiKey,
  newApiKey,
  setNewApiKey,
  showAddApiKeyDialog,
  setShowAddApiKeyDialog
}: ApiKeysPanelProps) {
  const handleCopyApiKey = async (apiKey: string) => {
    try {
      await navigator.clipboard.writeText(apiKey);
      toast.success('API key copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy API key');
    }
  };

  return (
    <>
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
                      onRotateApiKey(apiKey.id);
                    }}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Rotate
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCopyApiKey(apiKey.key)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      onDeleteApiKey(apiKey.id);
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
            <Button onClick={onAddApiKey}>
              Create API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 