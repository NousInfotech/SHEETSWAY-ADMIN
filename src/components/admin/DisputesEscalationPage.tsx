"use client";

import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import {
  UserIcon,
  BriefcaseIcon,
  CalendarIcon,
  FileTextIcon,
  MessageSquareIcon,
  ShieldCheckIcon
} from "lucide-react";

export default function DisputesEscalationPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Page Heading */}
      <Heading
        title="Dispute Manager"
        description="Review, manage, and resolve disputes between clients and auditors."
      />

      {/* Dispute Table Section - Full Width */}
      <section className="w-full">
        <Tabs defaultValue="open" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
          </TabsList>

          <TabsContent value="open">
            <Card>
              <CardContent className="p-6 text-muted-foreground">
                <FileTextIcon className="inline w-5 h-5 mr-2" />
                Open dispute cases will be listed here.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resolved">
            <Card>
              <CardContent className="p-6 text-muted-foreground">
                <ShieldCheckIcon className="inline w-5 h-5 mr-2" />
                Resolved disputes will appear here.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardContent className="p-6 text-muted-foreground">
                <CalendarIcon className="inline w-5 h-5 mr-2" />
                Pending review disputes will appear here.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Separator />

      {/* 3 Column Full Width Section */}
      <section className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Engagement Snapshot */}
          <Card className="w-full h-full">
            <CardContent className="p-6 space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BriefcaseIcon className="w-5 h-5" /> Engagement Snapshot
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  <UserIcon className="inline w-4 h-4 mr-2 text-primary" />
                  Client: <span className="text-foreground">ABC Pvt Ltd</span>
                </li>
                <li>
                  <UserIcon className="inline w-4 h-4 mr-2 text-primary" />
                  Auditor: <span className="text-foreground">John Doe</span>
                </li>
                <li>
                  <FileTextIcon className="inline w-4 h-4 mr-2 text-primary" />
                  Service: <span className="text-foreground">Tax Filing</span>
                </li>
                <li>
                  <CalendarIcon className="inline w-4 h-4 mr-2 text-primary" />
                  Submitted: <span className="text-foreground">June 25, 2025</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Message Log Preview */}
          <Card className="w-full h-full">
            <CardContent className="p-6 space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquareIcon className="w-5 h-5" /> Message Log Preview
              </h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  <span className="text-blue-600 font-semibold">[Client]</span>: This report seems inaccurate.
                </p>
                <p>
                  <span className="text-green-600 font-semibold">[Auditor]</span>: Please clarify which section?
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Admin Ruling Panel */}
          <Card className="w-full h-full">
            <CardContent className="p-6 space-y-5">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5" /> Admin Ruling Panel
              </h3>

              <div className="space-y-2">
                <Label htmlFor="notes">Resolution Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter your notes or observations..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select outcome status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="escalated">Escalated</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2">
                <Button className="w-full sm:w-auto">Submit Ruling</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
