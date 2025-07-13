'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox'; // <-- Import Checkbox
import {
  FileText,
  FileImage,
  FileCode,
  CheckCircle2,
  Clock,
  XCircle,
  Flag,
  UserX,
  Mail,
  UserPlus,
  Loader2,
  AlertTriangle
} from 'lucide-react';

// --- Custom Hook for Media Query (SSR-safe version) ---
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    listener();
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  return matches;
}

// --- ENHANCED TypeScript Types ---
type DocumentStatus = 'Verified' | 'Pending' | 'Rejected';
type AuditorStatus =
  | 'Pending'
  | 'Action Required'
  | 'Active'
  | 'Needs Re-verification'
  | 'Suspended';
type RiskTag = 'High-Risk' | 'Watchlist' | 'New';
type Specialization = 'Audit' | 'Tax' | 'Consulting' | 'Compliance';
type KycDocument = {
  name: string;
  type: 'PDF' | 'JPG' | 'DOC';
  status: DocumentStatus;
};
type InternalNote = { author: string; date: string; note: string };
type Auditor = {
  id: string;
  name: string;
  submitted: string;
  status: AuditorStatus;
  documents: KycDocument[];
  notes: InternalNote[];
  expiryDate?: string;
  riskTags?: RiskTag[];
};

// --- ENHANCED Mock Data ---
const pendingAuditors: Auditor[] = [
  {
    id: 'axiom-audit',
    name: 'Axiom Audit Inc.',
    submitted: 'Oct 26, 2023',
    status: 'Pending',
    documents: [
      { name: 'business_license.pdf', type: 'PDF', status: 'Verified' },
      { name: 'director_id_card.jpg', type: 'JPG', status: 'Verified' },
      { name: 'insurance_cert.pdf', type: 'PDF', status: 'Pending' },
      { name: 'articles_of_inc.doc', type: 'DOC', status: 'Rejected' }
    ],
    notes: [
      {
        author: 'Admin Jane',
        date: 'Oct 25',
        note: 'Insurance cert is pending manual verification.'
      },
      {
        author: 'Admin John',
        date: 'Oct 24',
        note: 'Flagged for review due to document mismatch.'
      }
    ],
    riskTags: ['New']
  },
  {
    id: 'veritas-global',
    name: 'Veritas Global',
    submitted: 'Oct 25, 2023',
    status: 'Pending',
    documents: [
      { name: 'business_license.pdf', type: 'PDF', status: 'Verified' },
      { name: 'director_id_card.jpg', type: 'JPG', status: 'Verified' },
      { name: 'insurance_cert.pdf', type: 'PDF', status: 'Pending' },
      { name: 'articles_of_inc.doc', type: 'DOC', status: 'Rejected' }
    ],
    notes: [],
    riskTags: ['New']
  },
  {
    id: 'secure-ledger',
    name: 'Secure Ledger LLC',
    submitted: 'Oct 24, 2023',
    status: 'Action Required',
    documents: [],
    notes: [],
    riskTags: ['New']
  }
];
const activeAuditors: Auditor[] = [
  {
    id: 'trust-inc',
    name: 'Trust Inc.',
    submitted: 'Jan 15, 2023',
    status: 'Active',
    documents: [],
    notes: [],
    expiryDate: 'Jan 15, 2025',
    riskTags: []
  },
  {
    id: 'audit-corp',
    name: 'Audit Corp',
    submitted: 'Feb 20, 2023',
    status: 'Active',
    documents: [],
    notes: [],
    expiryDate: 'Feb 20, 2025',
    riskTags: ['Watchlist']
  }
];
const needsReverificationAuditors: Auditor[] = [
  {
    id: 'fin-secure',
    name: 'Fin Secure',
    submitted: 'Mar 01, 2022',
    status: 'Needs Re-verification',
    documents: [],
    notes: [],
    expiryDate: 'Mar 01, 2024',
    riskTags: ['High-Risk']
  }
];

// --- Helper Components ---
const DocumentStatusIcon = ({ status }: { status: DocumentStatus }) => {
  switch (status) {
    case 'Verified':
      return <CheckCircle2 className='h-5 w-5 text-green-500' />;
    case 'Pending':
      return <Clock className='h-5 w-5 text-yellow-500' />;
    case 'Rejected':
      return <XCircle className='h-5 w-5 text-red-500' />;
  }
};
const AuditorStatusBadge = ({ status }: { status: AuditorStatus }) => {
  switch (status) {
    case 'Pending':
      return <Badge variant='secondary'>Pending</Badge>;
    case 'Action Required':
      return <Badge variant='destructive'>Action Required</Badge>;
    case 'Active':
      return (
        <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>
          Active
        </Badge>
      );
    case 'Needs Re-verification':
      return (
        <Badge className='bg-yellow-100 text-yellow-800 hover:bg-yellow-100'>
          Needs Re-verification
        </Badge>
      );
    case 'Suspended':
      return (
        <Badge variant='destructive' className='bg-gray-500'>
          Suspended
        </Badge>
      );
  }
};
const RiskTagBadge = ({ tag }: { tag: RiskTag }) => {
  switch (tag) {
    case 'High-Risk':
      return <Badge variant='destructive'>High-Risk</Badge>;
    case 'Watchlist':
      return <Badge className='bg-orange-100 text-orange-800'>Watchlist</Badge>;
    case 'New':
      return <Badge variant='outline'>New</Badge>;
    default:
      return null;
  }
};
const PendingAuditorTable = ({
  auditors,
  onRowClick
}: {
  auditors: Auditor[];
  onRowClick: (auditor: Auditor) => void;
}) => (
  <Card>
    <div className='relative w-full overflow-auto'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Auditor Name</TableHead>
            <TableHead className='hidden sm:table-cell'>Submitted</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auditors.map((auditor) => (
            <TableRow
              key={auditor.id}
              onClick={() => onRowClick(auditor)}
              className='hover:bg-muted/50 cursor-pointer'
            >
              <TableCell className='font-medium'>{auditor.name}</TableCell>
              <TableCell className='hidden sm:table-cell'>
                {auditor.submitted}
              </TableCell>
              <TableCell>
                <AuditorStatusBadge status={auditor.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </Card>
);
const ActiveAuditorTable = ({
  auditors,
  onRowClick
}: {
  auditors: Auditor[];
  onRowClick: (auditor: Auditor) => void;
}) => (
  <Card>
    <div className='relative w-full overflow-auto'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Auditor Name</TableHead>
            <TableHead className='hidden md:table-cell'>Risk Tags</TableHead>
            <TableHead>Verification Expiry</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auditors.map((auditor) => (
            <TableRow
              key={auditor.id}
              onClick={() => onRowClick(auditor)}
              className='hover:bg-muted/50 cursor-pointer'
            >
              <TableCell className='font-medium'>{auditor.name}</TableCell>
              <TableCell className='hidden md:table-cell'>
                <div className='flex gap-1'>
                  {auditor.riskTags?.map((tag) => (
                    <RiskTagBadge key={tag} tag={tag} />
                  ))}
                </div>
              </TableCell>
              <TableCell>{auditor.expiryDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </Card>
);
const TablePlaceholder = () => (
  <Card>
    <div className='flex h-[250px] w-full items-center justify-center'>
      <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
    </div>
  </Card>
);

// --- Main Vetting Center Component ---
export default function VettingCenterPage() {
  const [selectedAuditor, setSelectedAuditor] = useState<Auditor | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [isClient, setIsClient] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [currentAuditors, setCurrentAuditors] = useState<Auditor[]>([]);

  // State for the invite form
  const [inviteForm, setInviteForm] = useState({
    fullName: '',
    email: '',
    firmName: '',
    licenseId: '',
    vatId: '',
    specializations: [] as Specialization[]
  });

  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    switch (activeTab) {
      case 'pending':
        setCurrentAuditors(pendingAuditors);
        break;
      case 'active':
        setCurrentAuditors(activeAuditors);
        break;
      case 're-verification':
        setCurrentAuditors(needsReverificationAuditors);
        break;
      default:
        setCurrentAuditors(pendingAuditors);
    }
  }, [activeTab]);

  // --- Page Operations ---
  const handleApprove = (auditorId: string) => {
    console.log(`ACTION: Approve Auditor ID: ${auditorId}`);
    setSelectedAuditor(null);
  };
  const handleReject = (auditorId: string) => {
    console.log(`ACTION: Reject Auditor ID: ${auditorId}`);
    setSelectedAuditor(null);
  };
  const handleFlag = (auditorId: string) =>
    console.log(`ACTION: Flag Auditor ID: ${auditorId} for review`);
  const handleSuspend = (auditorId: string) =>
    console.log(`ACTION: Suspend Auditor ID: ${auditorId}`);
  const handleSendInvitation = () => {
    console.log('SENDING INVITATION:', inviteForm);
    // Here you would typically make an API call.
    // Reset form or close dialog on success.
  };

  const handleSpecializationChange = (
    spec: Specialization,
    checked: boolean
  ) => {
    setInviteForm((prev) => ({
      ...prev,
      specializations: checked
        ? [...prev.specializations, spec]
        : prev.specializations.filter((s) => s !== spec)
    }));
  };

  const TABS = [
    { value: 'pending', label: `Pending (${pendingAuditors.length})` },
    { value: 'active', label: `Active (${activeAuditors.length})` },
    {
      value: 're-verification',
      label: `Re-verification Tracker (${needsReverificationAuditors.length})`
    }
  ];
  const SPECIALIZATIONS: Specialization[] = [
    'Audit',
    'Tax',
    'Consulting',
    'Compliance'
  ];

  const renderTabs = () => {
    if (!isClient) return <div className='h-10 w-full border-b'></div>;
    if (isMobile) {
      return (
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger>
            <SelectValue placeholder='Select a category...' />
          </SelectTrigger>
          <SelectContent>
            {TABS.map((tab) => (
              <SelectItem key={tab.value} value={tab.value}>
                {tab.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    return (
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    );
  };

  return (
    <div className='flex-1 space-y-4 p-4 md:p-8'>
      <div className='flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center'>
        <h2 className='text-3xl font-bold tracking-tight'>Vetting Center</h2>

        {/* --- UPDATED Invite Auditor Dialog --- */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className='mr-2 h-4 w-4' /> Invite Auditor
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Invite New Auditor</DialogTitle>
              <DialogDescription>
                Enter the auditor's details to create their profile and send an
                invitation.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='full-name'>Contact Full Name</Label>
                  <Input
                    id='full-name'
                    placeholder='John Doe'
                    value={inviteForm.fullName}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, fullName: e.target.value })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='firm-name'>Firm Name</Label>
                  <Input
                    id='firm-name'
                    placeholder='Axiom Audit Inc.'
                    value={inviteForm.firmName}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, firmName: e.target.value })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='email'>Contact Email</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='contact@axiom.com'
                    value={inviteForm.email}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, email: e.target.value })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='license-id'>License ID</Label>
                  <Input
                    id='license-id'
                    placeholder='AB-12345'
                    value={inviteForm.licenseId}
                    onChange={(e) =>
                      setInviteForm({
                        ...inviteForm,
                        licenseId: e.target.value
                      })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='vat-id'>VAT ID</Label>
                  <Input
                    id='vat-id'
                    placeholder='IE1234567T'
                    value={inviteForm.vatId}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, vatId: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className='space-y-2 pt-2'>
                <Label>Specializations</Label>
                <div className='grid grid-cols-2 gap-4 rounded-md border p-4 md:grid-cols-4'>
                  {SPECIALIZATIONS.map((spec) => (
                    <div key={spec} className='flex items-center space-x-2'>
                      <Checkbox
                        id={spec}
                        onCheckedChange={(checked) =>
                          handleSpecializationChange(spec, checked as boolean)
                        }
                      />
                      <Label htmlFor={spec} className='font-normal'>
                        {spec}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type='submit' onClick={handleSendInvitation}>
                <Mail className='mr-2 h-4 w-4' />
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <p className='text-green-300'>
<<<<<<< HEAD
        please select an auditor for checking their details
=======
        please select an auditor for checking their details and verify them
>>>>>>> origin/devbysiva
      </p>

      {renderTabs()}
      <div className='mt-4'>
        {!isClient ? (
          <TablePlaceholder />
        ) : activeTab === 'pending' ? (
          <PendingAuditorTable
            auditors={pendingAuditors}
            onRowClick={setSelectedAuditor}
          />
        ) : (
          <ActiveAuditorTable
            auditors={
              activeTab === 'active'
                ? activeAuditors
                : needsReverificationAuditors
            }
            onRowClick={setSelectedAuditor}
          />
        )}
      </div>

      {/* --- Review Panel Modal --- */}
      <Dialog
        open={selectedAuditor !== null}
        onOpenChange={(isOpen) => !isOpen && setSelectedAuditor(null)}
      >
        <DialogContent className='flex max-h-[90vh] flex-col sm:max-w-4xl'>
          {selectedAuditor && (
            <>
              <DialogHeader>
                <DialogTitle className='text-2xl'>
                  {selectedAuditor.name} - Review Panel
                </DialogTitle>
                <DialogDescription>
                  Review documents, notes, and profile status to take action.
                </DialogDescription>
              </DialogHeader>
              <div className='grid flex-1 grid-cols-1 gap-6 overflow-y-auto py-4 pr-4 lg:grid-cols-3'>
                <div className='space-y-6 lg:col-span-2'>
                  <Card>
                    <CardHeader>
                      <CardTitle>KYC/KYB Upload Viewer</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-3'>
                      {selectedAuditor.documents.map((doc) => (
                        <div
                          key={doc.name}
                          className='flex flex-col flex-wrap items-center justify-center gap-2 rounded-md border p-2 md:flex md:flex-row md:flex-nowrap md:justify-between'
                        >
                          <div className='flex items-center gap-3'>
                            {doc.type === 'PDF' && (
                              <FileText className='text-muted-foreground h-5 w-5' />
                            )}
                            {doc.type === 'JPG' && (
                              <FileImage className='text-muted-foreground h-5 w-5' />
                            )}
                            {doc.type === 'DOC' && (
                              <FileCode className='text-muted-foreground h-5 w-5' />
                            )}
                            <span className='text-sm font-medium'>
                              {doc.name}
                            </span>
                          </div>
                          <div className='flex items-center gap-4'>
                            <button className='rounded px-3 py-1 text-xs text-blue-600 duration-300 ease-in-out hover:brightness-50 sm:text-sm md:border'>
                              View
                            </button>
                            <DocumentStatusIcon status={doc.status} />
                          </div>
                        </div>
                      ))}
                      {selectedAuditor.documents.length === 0 && (
                        <p className='text-muted-foreground py-4 text-center text-sm'>
                          No documents uploaded yet.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Internal Notes Panel</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <Textarea placeholder='Add a new note for the team...' />
                      <Button size='sm'>Add Note</Button>
                      <div className='space-y-3 pt-2'>
                        {selectedAuditor.notes.map((note, index) => (
                          <div key={index} className='border-l-2 pl-3 text-sm'>
                            <p className='font-medium'>{note.note}</p>
                            <p className='text-muted-foreground text-xs'>
                              - {note.author}, {note.date}
                            </p>
                          </div>
                        ))}
                        {selectedAuditor.notes.length === 0 && (
                          <p className='text-muted-foreground py-4 text-center text-sm'>
                            No internal notes recorded.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className='space-y-6'>
                  <Card className='border-l-4 border-yellow-400'>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <AlertTriangle className='h-5 w-5 text-yellow-500' />
                        Profile Status & Risk
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-3 text-sm'>
                      <div className='flex justify-between'>
                        <strong>Status:</strong>
                        <AuditorStatusBadge status={selectedAuditor.status} />
                      </div>
                      {selectedAuditor.expiryDate && (
                        <div className='flex justify-between'>
                          <strong>Expiry:</strong>
                          <span>{selectedAuditor.expiryDate}</span>
                        </div>
                      )}
                      <div className='flex justify-between'>
                        <strong>Risk Tags:</strong>
                        <div className='flex flex-wrap justify-end gap-1'>
                          {selectedAuditor.riskTags?.map((tag) => (
                            <RiskTagBadge key={tag} tag={tag} />
                          )) || 'None'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Actions</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                      <Button
                        variant='secondary'
                        className='w-full'
                        onClick={() => handleFlag(selectedAuditor.id)}
                      >
                        <Flag className='mr-2 h-4 w-4' />
                        Flag for Review
                      </Button>
                      <Button
                        variant='secondary'
                        className='w-full'
                        onClick={() => handleSuspend(selectedAuditor.id)}
                      >
                        <UserX className='mr-2 h-4 w-4' />
                        Suspend Profile
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <DialogFooter className='border-t pt-4'>
                <div className='grid w-full grid-cols-2 gap-2'>
                  <Button
                    variant='destructive'
                    onClick={() => handleReject(selectedAuditor.id)}
                  >
                    Reject Application
                  </Button>
                  <Button onClick={() => handleApprove(selectedAuditor.id)}>
                    Approve Application
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
