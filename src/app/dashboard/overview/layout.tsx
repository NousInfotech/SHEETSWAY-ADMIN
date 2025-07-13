'use client';

import DashboardPage from '@/components/admin/DashboardPage';
import PageContainer from '@/components/layout/page-container';
import { useAuth } from '@/components/layout/providers';
import React from 'react';

export default function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <PageContainer>
      <div className='w-full grid grid-cols-1'>
        <div className='container mx-auto space-y-2'>
          <div className='flex items-center justify-between space-y-2'>
            <h2 className='text-2xl font-bold tracking-tight'>
              Hi, Welcome Back {user?.displayName}&nbsp;👋
            </h2>
          </div>

          <div>
            <DashboardPage />
          </div>

          {/* CHARTS BELOW */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
            <div className='col-span-4'>{bar_stats}</div>
            <div className='col-span-4 md:col-span-3'>{sales}</div>
            <div className='col-span-4'>{area_stats}</div>
            <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
