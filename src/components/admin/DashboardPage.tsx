<<<<<<< HEAD
// app/dashboard/page.tsx
=======
>>>>>>> origin/devbysiva
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
<<<<<<< HEAD
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Shield,
  Briefcase,
  Activity,
  UserPlus,
  Flag,
  CircleDollarSign,
  CalendarClock,
  FileClock,
  ArrowRight,
} from "lucide-react";

// --- TypeScript Types for our Data ---
type Kpi = {
  title: string;
  value: string;
  icon: React.ElementType;
};

type LiveStat = {
  title: string;
  value: string;
  icon: React.ElementType;
};

type SystemAlert = {
  id: string;
  title: string;
  timestamp: string;
  icon: React.ElementType;
};

type ComplianceAlert = {
  id: string;
  title: string;
  details: string;
  icon: React.ElementType;
  priority: "High" | "Medium" | "Low";
};

// --- Mock Data (Replace with API data later) ---
const kpis: Kpi[] = [
  { title: "Total Clients", value: "1,482", icon: Users },
  { title: "Total Auditors", value: "241", icon: Shield },
  { title: "Active Engagements", value: "76", icon: Briefcase },
];

const liveStats: LiveStat[] = [
  { title: "New Requests (Today)", value: "12", icon: Activity },
  { title: "New Auditor Signups", value: "3", icon: UserPlus },
];

const systemAlerts: SystemAlert[] = [
  { id: "E-1055", title: "New Dispute Raised on Engagement", timestamp: "2m ago", icon: Flag },
  { id: "P-2043", title: "Payment Hold Flag on Transaction", timestamp: "1h ago", icon: CircleDollarSign },
  { id: "E-1012", title: "New Dispute Raised on Engagement", timestamp: "4h ago", icon: Flag },
];

const complianceAlerts: ComplianceAlert[] = [
  { id: "Axiom Inc.", title: "Expiring License: Axiom Inc.", details: "Expires in 7 days", icon: CalendarClock, priority: "High" },
  { id: "Veritas Global", title: "Missed Deadline: Veritas Global", details: "KYB Re-verification", icon: FileClock, priority: "Medium" },
  { id: "FinTrust", title: "Expiring License: FinTrust", details: "Expires in 25 days", icon: CalendarClock, priority: "Low" },
];


export default function DashboardPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40 rounded-lg">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {/* === Platform KPIs Card === */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Platform KPIs</CardTitle>
            <CardDescription>An overview of key platform metrics.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {kpis.map((kpi) => (
              <div key={kpi.title} className="flex items-center gap-4">
                <kpi.icon className="h-6 w-6 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                  <p className="text-xl font-bold">{kpi.value}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* === Live Stats & Escrow Combined Card === */}
        <Card>
          <CardHeader>
            <CardTitle>Live Stats</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            {liveStats.map((stat) => (
              <div key={stat.title} className="flex items-center gap-4">
                <stat.icon className="h-6 w-6 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Escrow Fund Summary</CardTitle>
            <CardDescription>Total funds held in escrow.</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-3xl font-bold">€1,250,430.50</p>
=======
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CircleDollarSign } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// --- Import all types and data from the centralized file ---
import {
  kpis,
  quickActions,
  systemAlerts,
  complianceAlerts,
  recentActivities,
  onboardingFunnel,
  priorityColors
} from '../../app/dashboard/lib/data';

export default function DashboardPage() {
  return (
    <main className='bg-muted/40 flex flex-1 flex-col gap-6 rounded-lg p-4 md:p-6 lg:p-8'>
      {/* === Page Header & Quick Actions === */}
      <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight lg:text-3xl'>
            Super Admin Overview
          </h1>
          <p className='text-muted-foreground'>
            Welcome back! Here's a real-time view of your platform's health.
          </p>
        </div>
        <div className='flex flex-col gap-2 md:flex md:flex-row md:items-center'>
          {quickActions.map((action) => (
            <Button key={action.title} variant='outline' size='sm' asChild>
              <a href={action.href}>
                <action.icon className='mr-2 h-4 w-4' />
                {action.title}
              </a>
            </Button>
          ))}
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {/* === Platform KPIs === */}
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>{kpi.title}</CardTitle>
              <kpi.icon className='text-muted-foreground h-5 w-5' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{kpi.value}</div>
              <p
                className={`text-xs ${kpi.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}
              >
                {kpi.change} vs last month
              </p>
            </CardContent>
          </Card>
        ))}

        {/* === Escrow Fund Summary === */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Escrow Fund Summary
            </CardTitle>
            <CircleDollarSign className='text-muted-foreground h-5 w-5' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>€1,250,430.50</div>
            <p className='text-muted-foreground text-xs'>+€120k this week</p>
>>>>>>> origin/devbysiva
          </CardContent>
        </Card>
      </div>

<<<<<<< HEAD
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        {/* === System Alerts Card === */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>System Alerts</CardTitle>
              <span className="flex h-3 w-3 rounded-full bg-red-500" />
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                <div className="flex items-center gap-3">
                  <alert.icon className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">{alert.title} #{alert.id}</p>
                    <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
        
        {/* === Compliance Alerts Card === */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>Compliance Alerts</CardTitle>
              <span className="flex h-3 w-3 rounded-full bg-amber-500" />
            </div>
             <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {complianceAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                <div className="flex items-center gap-3">
                  <alert.icon className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.details}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
=======
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {/* === System & Compliance Alerts Column === */}
        <div className='flex flex-col gap-6 lg:col-span-1'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-4'>
              <div className='flex items-center gap-2'>
                <CardTitle className='text-lg'>System Alerts</CardTitle>
                <span className='flex h-3 w-3 rounded-full bg-red-500' />
              </div>
              <Button variant='outline' size='sm' asChild>
                <a href='/dashboard/alerts/system'>View All</a>
              </Button>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
              {systemAlerts.slice(0, 4).map(
                (
                  alert // Use .slice(0, 4) to show only a few on the dashboard
                ) => (
                  <a
                    key={alert.id}
                    href={`/dashboard/disputes/${alert.id}`}
                    className='hover:bg-muted -m-3 block rounded-lg p-3 transition-colors'
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <alert.icon className='h-5 w-5 flex-shrink-0 text-red-500' />
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
                )
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-4'>
              <div className='flex items-center gap-2'>
                <CardTitle className='text-lg'>Compliance Alerts</CardTitle>
                <span className='flex h-3 w-3 rounded-full bg-amber-500' />
              </div>
              <Button variant='outline' size='sm' asChild>
                <a href='/dashboard/alerts/compliance'>View All</a>
              </Button>
            </CardHeader>
            <CardContent className='flex flex-col gap-3'>
              {complianceAlerts.slice(0, 4).map(
                (
                  alert // Use .slice(0, 4) to show only a few
                ) => (
                  <a
                    key={alert.id}
                    href={`/dashboard/compliance/${alert.id}`}
                    className={`hover:bg-muted/50 -m-3 block rounded-lg border-l-4 p-3 transition-colors ${priorityColors[alert.priority]}`}
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
                )
              )}
            </CardContent>
          </Card>
        </div>

        {/* === Main Content Column === */}
        <div className='flex flex-col gap-6 lg:col-span-2'>
          {/* === Recent Activity Feed === */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                A live feed of important platform events.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                {recentActivities.map((activity) => (
                  <div key={activity.id} className='flex items-start gap-4'>
                    <Avatar className='h-9 w-9 border'>
                      {activity.actor.avatarUrl && (
                        <AvatarImage
                          src={activity.actor.avatarUrl}
                          alt={activity.actor.name}
                        />
                      )}
                      <AvatarFallback>
                        {activity.actor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1'>
                      <p className='text-sm'>
                        <span className='font-semibold'>
                          {activity.actor.name}
                        </span>{' '}
                        {activity.description}
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        {activity.timestamp}
                      </p>
                    </div>
                    <activity.icon className='text-muted-foreground h-5 w-5' />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* === Auditor Onboarding Funnel === */}
          <Card>
            <CardHeader>
              <CardTitle>Auditor Onboarding Funnel</CardTitle>
              <CardDescription>
                Tracking new auditor signups through the verification pipeline.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {onboardingFunnel.map((step) => {
                const percentage = (step.count / step.total) * 100;
                return (
                  <div key={step.stage}>
                    <div className='mb-1 flex items-center justify-between'>
                      <p className='text-sm font-medium'>{step.stage}</p>
                      <p className='text-muted-foreground text-sm'>
                        {step.count} / {step.total}
                      </p>
                    </div>
                    <Progress value={percentage} className='h-2' />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
>>>>>>> origin/devbysiva
