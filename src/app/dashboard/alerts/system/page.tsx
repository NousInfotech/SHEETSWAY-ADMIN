import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { systemAlerts } from '../../lib/data'; // Import from shared data file
import PageContainer from '@/components/layout/page-container';

export default function SystemAlertsPage() {
  return (
    <PageContainer>
      <div className='container mx-auto'>
        <main className='bg-muted/40 flex flex-1 flex-col gap-6 rounded-lg p-4 md:p-6 lg:p-8'>
          <div className='flex items-center gap-4'>
            <Button variant='outline' size='icon' asChild>
              <Link href='/dashboard/overview'>
                <ArrowLeft className='h-4 w-4' />
                <span className='sr-only'>Back to Dashboard</span>
              </Link>
            </Button>
            <div>
              <h1 className='text-2xl font-bold tracking-tight lg:text-3xl'>
                System Alerts
              </h1>
              <p className='text-muted-foreground'>
                A complete log of all system-level alerts and notifications.
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Alerts</CardTitle>
              <CardDescription>
                Showing {systemAlerts.length} total system alerts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='divide-border flex flex-col divide-y'>
                {systemAlerts.map((alert) => (
                  <a
                    key={alert.id}
                    href={`/dashboard/disputes/${alert.id}`}
                    className='hover:bg-muted -mx-2 block rounded-lg px-2 py-4 transition-colors'
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        <alert.icon className='h-6 w-6 flex-shrink-0 text-red-500' />
                        <div>
                          <p className='text-sm font-medium'>
                            {alert.title}{' '}
                            <span className='text-muted-foreground font-normal'>
                              #{alert.id}
                            </span>
                          </p>
                          <p className='text-muted-foreground text-xs'>
                            {alert.timestamp}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className='text-muted-foreground h-4 w-4' />
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </PageContainer>
  );
}
