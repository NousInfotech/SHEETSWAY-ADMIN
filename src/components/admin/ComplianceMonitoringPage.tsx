"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ComplianceMonitoringPage = () => {
  return (
    <div className="p-6 space-y-6">
      <Heading
        title="Compliance Panel"
        description="Track platform-wide compliance metrics, documents, and alerts."
      />

      {/* Expiry Tracker */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Expiry Tracker</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Licenses", value: "12 expiring soon", color: "secondary" },
            { label: "KYB", value: "5 expired", color: "destructive" },
            { label: "VAT IDs", value: "8 valid", color: "default" },
          ].map((item, idx) => (
            <Card key={idx}>
              <CardContent className="py-5 space-y-2">
                <h3 className="text-md font-medium">{item.label}</h3>
                <div className="text-lg font-semibold">{item.value}</div>
                <Badge variant={item.color as "default" | "destructive" | "outline" | "secondary"}>{item.label} Status</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Risk Flags */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Risk Flags</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="py-5 space-y-2">
              <h4 className="font-medium">Invalid Documents</h4>
              <p>4 submissions failed validation</p>
              <Badge variant="destructive">Immediate Action Required</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-5 space-y-2">
              <h4 className="font-medium">Expiring Soon</h4>
              <p>10 documents expiring in next 7 days</p>
              <Badge variant="secondary">Review Needed</Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      {/* Compliance Scoreboard */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Compliance Scoreboard</h2>
        <Card>
          <CardContent className="py-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left font-semibold border-b">
                  <th className="py-2">Auditor</th>
                  <th>Firm</th>
                  <th>Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: "Priya Kapoor",
                    firm: "AuditEdge",
                    score: "92%",
                    status: "Compliant",
                  },
                  {
                    name: "Ravi Mehta",
                    firm: "Mehta & Co",
                    score: "76%",
                    status: "Warning",
                  },
                  {
                    name: "Alisha Roy",
                    firm: "FinCheck",
                    score: "58%",
                    status: "At Risk",
                  },
                ].map((a, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2">{a.name}</td>
                    <td>{a.firm}</td>
                    <td>{a.score}</td>
                    <td>
                      <Badge
                        variant={
                          a.status === "Compliant"
                            ? "default"
                            : a.status === "Warning"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {a.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Warning Log */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Warning Log</h2>
        <Card>
          <CardContent className="py-4 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">AuditEdge License expired</p>
                <p className="text-sm text-muted-foreground">
                  Re-verification triggered · Reminder sent
                </p>
              </div>
              <Badge variant="secondary">Pending</Badge>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Mehta & Co missing KYB</p>
                <p className="text-sm text-muted-foreground">
                  Suspended temporarily · Notified
                </p>
              </div>
              <Badge variant="destructive">Suspended</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComplianceMonitoringPage;
