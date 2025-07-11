// app/dashboard/page.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
          </CardContent>
        </Card>
      </div>

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