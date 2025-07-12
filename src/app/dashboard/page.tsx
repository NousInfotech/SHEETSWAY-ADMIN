'use client';
import { useAuth } from '@/components/layout/providers';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
// Removed unused React import

export default function Dashboard() {
  const { user, loading } = useAuth();
  useEffect(() => {
    if (!loading) {
      if (!user) {
        redirect('/auth/sign-in');
      } else {
        redirect('/dashboard/overview');
      }
    }
  }, [user, loading]);
  return null;
}
