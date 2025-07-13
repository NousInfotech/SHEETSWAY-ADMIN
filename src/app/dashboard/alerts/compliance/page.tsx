import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { complianceAlerts, priorityColors } from '../../lib/data'; // Import from shared data file
import PageContainer from '@/components/layout/page-container';

export default function ComplianceAlertsPage() {
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
                Compliance Alerts
              </h1>
              <p className='text-muted-foreground'>
                All items requiring compliance review or action.
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Alerts</CardTitle>
              <CardDescription>
                Showing {complianceAlerts.length} total compliance alerts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col gap-4'>
                {complianceAlerts.map((alert) => (
                  <a
                    key={alert.id}
                    href={`/dashboard/compliance/${alert.id}`}
                    className={`hover:bg-muted/50 block rounded-lg border-l-4 p-3 transition-colors ${
                      priorityColors[alert.priority]
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <alert.icon className='h-5 w-5 flex-shrink-0' />
                        <div>
                          <p className='text-sm font-medium'>{alert.title}</p>
                          <p className='text-muted-foreground text-xs'>
                            {alert.details}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant='outline'
                        className={priorityColors[alert.priority]}
                      >
                        {alert.priority}
                      </Badge>
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
