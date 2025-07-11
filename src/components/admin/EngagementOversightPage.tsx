"use client";

import React, { useState } from "react";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock Data
const engagements = [
  {
    id: "ENG-101",
    client: "ABC Corp",
    auditor: "John Doe",
    status: "Planning",
    paymentStatus: "Pending",
    contractStatus: "Unsigned",
    disputeFlag: false,
    workspaceLink: "#"
  },
  {
    id: "ENG-102",
    client: "XYZ Ltd",
    auditor: "Jane Smith",
    status: "Active",
    paymentStatus: "Paid",
    contractStatus: "Signed",
    disputeFlag: true,
    workspaceLink: "#"
  },
  {
    id: "ENG-103",
    client: "Global Inc",
    auditor: "Emily Chan",
    status: "Final Review",
    paymentStatus: "Pending",
    contractStatus: "Signed",
    disputeFlag: false,
    workspaceLink: "#"
  }
];

const EngagementOversightPage = () => {
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredEngagements =
    statusFilter === "all"
      ? engagements
      : engagements.filter((e) => e.status === statusFilter);

  return (
    <div className="p-6 space-y-6">
      <Heading
        title="Engagement Tracker"
        description="Monitor audit progress across engagements"
      />

      <Separator />

      {/* Filter Tabs */}
      <Tabs defaultValue="all" onValueChange={setStatusFilter}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Planning">Planning</TabsTrigger>
          <TabsTrigger value="Active">Active</TabsTrigger>
          <TabsTrigger value="Final Review">Final Review</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Engagement Table */}
      <Card>
        <CardContent className="p-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Engagement ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Auditor</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead>Dispute</TableHead>
                <TableHead>Workspace</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEngagements.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{e.status}</Badge>
                  </TableCell>
                  <TableCell>{e.client}</TableCell>
                  <TableCell>{e.auditor}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        e.paymentStatus === "Paid" ? "default" : "destructive"
                      }
                    >
                      {e.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        e.contractStatus === "Signed" ? "default" : "secondary"
                      }
                    >
                      {e.contractStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {e.disputeFlag ? (
                      <Badge variant="destructive">⚠ Flagged</Badge>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Separator />

      {/* Notes */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Engagement Monitoring</h2>
        <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
          <li>Review active audit engagements</li>
          <li>Use filters to identify flagged or overdue projects</li>
          <li>Use "View" to access workspace (view-only)</li>
        </ul>
      </div>
    </div>
  );
};

export default EngagementOversightPage;
