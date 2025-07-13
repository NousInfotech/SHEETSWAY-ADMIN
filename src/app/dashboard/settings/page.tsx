import AdminSettingsPage from '@/features/admin-settings/components/AdminSettingsPage';
import PageContainer from '@/components/layout/page-container';
import React from 'react';

export default function AdminSettingsPageWrapper() {
  return (
    <PageContainer>
      <div className="container mx-auto">
        <AdminSettingsPage />
      </div>
    </PageContainer>
  );
} 