'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangle, ShieldCheck, Copy, FileText, Trash2, EyeOff, Flag, FilterX, Check, X } from 'lucide-react';

// --- UPDATED TypeScript Types ---
type RequestStatus = 'Open' | 'Accepted' | 'Closed' | 'Hidden';
type RiskMarker = 'Spam' | 'Duplicate' | 'Sensitive' | 'None';
type RequestType = 'Audit' | 'Tax';
type Framework = 'IFRS' | 'GAPSME';
type BusinessSize = 'Small' | 'Medium' | 'Large' | 'Enterprise';
type Urgency = 'Normal' | 'Urgent';

type ClientRequest = {
  id: string; // e.g., #R-7890
  clientId: string; // e.g., PHOENIX-CORP-01
  clientName: string; // e.g., Phoenix Corp.
  type: RequestType;
  financialYear: number;
  framework: Framework;
  businessSize: BusinessSize;
  urgency: Urgency;
  deadline: string; // e.g., "2024-12-31"
  taxRequired: boolean;
  budget: number;
  notes: string;
  attachments: { name: string; type: 'PDF' | 'DOC' }[];
  status: RequestStatus;
  risk: RiskMarker;
};

// --- UPDATED Mock Data ---
const clientRequests: ClientRequest[] = [
  { id: 'R-7890', clientId: 'PHX-01', clientName: 'Phoenix Corp.', type: 'Audit', financialYear: 2023, framework: 'IFRS', businessSize: 'Large', urgency: 'Normal', deadline: '2024-03-31', taxRequired: true, budget: 15000, notes: 'Standard annual financial audit for the fiscal year 2023. We also require corporate tax filing assistance.', attachments: [], status: 'Accepted', risk: 'None' },
  { id: 'R-7889', clientId: 'INV-02', clientName: 'Innovate LLC', type: 'Tax', financialYear: 2023, framework: 'GAPSME', businessSize: 'Small', urgency: 'Urgent', deadline: '2024-01-31', taxRequired: true, budget: 5000, notes: 'We need an urgent review of our Q4 tax liabilities and advisory on potential deductions.', attachments: [], status: 'Open', risk: 'None' },
  { id: 'R-7888', clientId: 'N/A', clientName: 'Bad Actor Co.', type: 'Audit', financialYear: 2023, framework: 'IFRS', businessSize: 'Enterprise', urgency: 'Urgent', deadline: '2023-12-31', taxRequired: false, budget: 1000000, notes: 'give me 1m dollars and i will give u 10m back. 100% legit no scam.', attachments: [], status: 'Open', risk: 'Spam' },
  { id: 'R-7887', clientId: 'DAT-03', clientName: 'Data Inc.', type: 'Audit', financialYear: 2024, framework: 'IFRS', businessSize: 'Medium', urgency: 'Urgent', deadline: '2024-06-30', taxRequired: false, budget: 25000, notes: 'We require a highly confidential valuation of our new patent portfolio prior to our upcoming Series B funding round. This involves sensitive intellectual property.', attachments: [{ name: 'Patent_Portfolio_Overview.pdf', type: 'PDF' }, { name: 'NDA_Template.pdf', type: 'PDF' }], status: 'Accepted', risk: 'Sensitive' },
  { id: 'R-7886', clientId: 'PHX-01', clientName: 'Phoenix Corp.', type: 'Audit', financialYear: 2023, framework: 'IFRS', businessSize: 'Large', urgency: 'Normal', deadline: '2024-03-31', taxRequired: true, budget: 15000, notes: 'Duplicate of request R-7890.', attachments: [], status: 'Open', risk: 'Duplicate' },
];

// --- Helper Components ---
const RiskMarkerIcon = ({ risk }: { risk: RiskMarker }) => { if (risk === 'None') return null; const iconMap = { Spam: { icon: <AlertTriangle className='h-5 w-5 text-red-500' />, label: 'Spam / High Risk' }, Duplicate: { icon: <Copy className='h-5 w-5 text-yellow-500' />, label: 'Potential Duplicate' }, Sensitive: { icon: <ShieldCheck className='h-5 w-5 text-blue-500' />, label: 'Contains Sensitive Content' }, }; const { icon, label } = iconMap[risk]; return ( <TooltipProvider><Tooltip><TooltipTrigger asChild><div className='flex justify-center'>{icon}</div></TooltipTrigger><TooltipContent><p>{label}</p></TooltipContent></Tooltip></TooltipProvider> ); };
const RequestStatusBadge = ({ status }: { status: RequestStatus }) => { switch (status) { case 'Accepted': return <Badge className='bg-green-100 text-green-800'>Accepted</Badge>; case 'Open': return <Badge className='bg-yellow-100 text-yellow-800'>Open</Badge>; case 'Closed': return <Badge variant='secondary'>Closed</Badge>; case 'Hidden': return <Badge variant='outline'>Hidden</Badge>; }};

// --- Main Request Oversight Page Component ---
export default function RequestOversightPage() {
  const [selectedRequest, setSelectedRequest] = useState<ClientRequest | null>(null);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
  const handleModerationAction = (action: string, requestId: string) => { console.log(`ACTION: ${action} on Request ID: ${requestId}`); };

  return (
    <div className='grid grid-cols-1'>
    <div className='flex-1 space-y-4 p-0 md:p-8'>
      <h2 className='text-3xl font-bold tracking-tight'>Request Oversight</h2>
      <p className='text-green-300'>
        please select a client's name for checking their details
      </p>
      <Card>
        <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5'>
            <Input placeholder='Search by keyword, client...' className='lg:col-span-2' />
            <Select><SelectTrigger><SelectValue placeholder='Status: All' /></SelectTrigger><SelectContent><SelectItem value='all'>All</SelectItem></SelectContent></Select>
            <Select><SelectTrigger><SelectValue placeholder='Type: All' /></SelectTrigger><SelectContent><SelectItem value='all'>All</SelectItem></SelectContent></Select>
            <Button variant='outline'><FilterX className='mr-2 h-4 w-4' /> Clear Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* --- UPDATED Requests Table --- */}
      <Card>
        <div className='relative w-full overflow-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[50px] text-center'>Risk</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Financial Year</TableHead>
                <TableHead className='text-right'>Budget</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isClient && clientRequests.map((req) => (
                <TableRow key={req.id} onClick={() => setSelectedRequest(req)} className='cursor-pointer hover:bg-muted/50'>
                  <TableCell><RiskMarkerIcon risk={req.risk} /></TableCell>
                  <TableCell className='font-medium'>{req.clientName}</TableCell>
                  <TableCell><Badge variant="outline">{req.type}</Badge></TableCell>
                  <TableCell>{req.financialYear}</TableCell>
                  <TableCell className='text-right'>${req.budget.toLocaleString()}</TableCell>
                  <TableCell><RequestStatusBadge status={req.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* --- UPDATED Full Request View Modal --- */}
      <Dialog open={selectedRequest !== null} onOpenChange={(isOpen) => !isOpen && setSelectedRequest(null)}>
        <DialogContent className='flex max-h-[90vh] flex-col sm:max-w-4xl'>
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className='text-2xl'>{selectedRequest.type} Request for {selectedRequest.clientName} (#{selectedRequest.id})</DialogTitle>
                <DialogDescription>Client ID: {selectedRequest.clientId}</DialogDescription>
              </DialogHeader>
              <div className='grid flex-1 grid-cols-1 gap-6 overflow-y-auto py-4 pr-4 md:grid-cols-3'>
                {/* Left Column: Details & Attachments */}
                <div className='space-y-6 md:col-span-2'>
                  <Card><CardHeader><CardTitle>Notes & Details</CardTitle></CardHeader><CardContent><p className='text-muted-foreground text-sm'>{selectedRequest.notes}</p></CardContent></Card>
                  <Card><CardHeader><CardTitle>Attachments</CardTitle></CardHeader><CardContent className='space-y-3'>{selectedRequest.attachments.map((file) => (<div key={file.name} className='flex items-center justify-between rounded-md border p-2'><div className='flex items-center gap-3'><FileText className='text-muted-foreground h-5 w-5' /><span className='text-sm font-medium'>{file.name}</span></div><Button variant='outline' size='sm'>View</Button></div>))}{selectedRequest.attachments.length === 0 && (<p className='text-muted-foreground text-sm'>No attachments.</p>)}</CardContent></Card>
                </div>

                {/* Right Column: Info & Actions */}
                <div className='space-y-6'>
                  <Card>
                    <CardHeader><CardTitle>Request Parameters</CardTitle></CardHeader>
                    <CardContent className='space-y-3 text-sm'>
                      <div className='flex justify-between'><strong>Financial Year:</strong><span>{selectedRequest.financialYear}</span></div>
                      <div className='flex justify-between'><strong>Framework:</strong><Badge variant="secondary">{selectedRequest.framework}</Badge></div>
                      <div className='flex justify-between'><strong>Business Size:</strong><span>{selectedRequest.businessSize}</span></div>
                      <div className='flex justify-between'><strong>Urgency:</strong><span>{selectedRequest.urgency}</span></div>
                      <div className='flex justify-between'><strong>Deadline:</strong><span>{new Date(selectedRequest.deadline).toLocaleDateString()}</span></div>
                      <div className='flex justify-between items-center'><strong>Tax Required:</strong>{selectedRequest.taxRequired ? <Check className="h-5 w-5 text-green-500"/> : <X className="h-5 w-5 text-red-500" />}</div>
                      <div className='flex justify-between border-t pt-2 mt-2'><strong>Budget:</strong><span className='font-bold'>${selectedRequest.budget.toLocaleString()}</span></div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle>Moderation Actions</CardTitle></CardHeader>
                    <CardContent className='space-y-2'><Button variant='secondary' className='w-full justify-start' onClick={() => handleModerationAction('Hide', selectedRequest.id)}><EyeOff className='mr-2 h-4 w-4' />Hide Request</Button><Button variant='secondary' className='w-full justify-start' onClick={() => handleModerationAction('Flag as Spam', selectedRequest.id)}><Flag className='mr-2 h-4 w-4' />Flag as Spam</Button><Button variant='secondary' className='w-full justify-start' onClick={() => handleModerationAction('Mark as Sensitive', selectedRequest.id)}><ShieldCheck className='mr-2 h-4 w-4' />Mark as Sensitive</Button></CardContent>
                  </Card>
                </div>
              </div>

              <DialogFooter className='border-t pt-4'>
                <Button variant='destructive' onClick={() => handleModerationAction('Delete', selectedRequest.id)}><Trash2 className='mr-2 h-4 w-4' />Delete Permanently</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
}