'use client';

import { GalleryVerticalEnd } from 'lucide-react';
import * as React from 'react';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';

interface StaticOrgDisplayProps {
  name?: string;
  app?: string;
}

export function StaticOrgDisplay({
  name = 'Sheetsway',
  app = 'Audit Software'
}: StaticOrgDisplayProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size='lg' disabled className='cursor-default '>
          <div className='bg-primary flex aspect-square size-8 items-center justify-center rounded-lg'>
            <GalleryVerticalEnd className='size-4' />
          </div>
          <div className='flex flex-col gap-0.5 leading-none'>
            <span className='font-semibold'>{app}</span>
            <span>{name}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
