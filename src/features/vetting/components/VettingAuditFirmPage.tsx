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
import {
  FileText,
  FileImage,
  FileCode,
  CheckCircle2,
  Clock,
  XCircle,
  Flag,
  UserX,
  Search,
  Loader2,
  AlertTriangle,
  Building2,
  Users,
  Eye,
  CheckCircle,
  XCircle as XCircleIcon
} from 'lucide-react';
import { useAuditFirms } from '../hooks/useAuditFirms';
import { AuditFirm, Auditor } from '../services/auditFirmService';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Custom hook for media query (SSR-safe version)
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

// Helper Components
const VettedStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'VERIFIED':
      return (
        <Badge className='bg-green-100 text-green-800 border border-green-200 px-3 py-1 text-xs font-medium rounded-full'>
          ✓ Verified
        </Badge>
      );
    case 'PENDING':
      return (
        <Badge className='bg-yellow-100 text-yellow-800 border border-yellow-200 px-3 py-1 text-xs font-medium rounded-full'>
          ⏳ Pending
        </Badge>
      );
    case 'REJECTED':
      return (
        <Badge className='bg-red-100 text-red-800 border border-red-200 px-3 py-1 text-xs font-medium rounded-full'>
          ✗ Rejected
        </Badge>
      );
    case 'NOT_APPLIED':
      return (
        <Badge className='bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 text-xs font-medium rounded-full'>
          📝 Not Applied
        </Badge>
      );
    default:
      return (
        <Badge className='bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 text-xs font-medium rounded-full'>
          ❓ {status || 'Unknown'}
        </Badge>
      );
  }
};

const FirmSizeBadge = ({ size }: { size: string }) => {
  const getSizeColor = (size: string) => {
    switch (size) {
      case 'SMALL':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LARGE':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Badge className={`${getSizeColor(size)} border px-3 py-1 text-xs font-medium rounded-full`}>
      {size}
    </Badge>
  );
};

const DocumentStatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'Verified':
      return <CheckCircle2 className='h-5 w-5 text-green-500' />;
    case 'Pending':
      return <Clock className='h-5 w-5 text-yellow-500' />;
    case 'Rejected':
      return <XCircle className='h-5 w-5 text-red-500' />;
    default:
      return <Clock className='h-5 w-5 text-gray-500' />;
  }
};

// Main Component
export default function VettingAuditFirmPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [statusUpdateReason, setStatusUpdateReason] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('APPROVED');
  
  // New filter states
  const [firmSizeFilter, setFirmSizeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [minAuditorsFilter, setMinAuditorsFilter] = useState<number>(0);
  
  // Auditor list popup state
  const [showAuditorList, setShowAuditorList] = useState(false);
  const [selectedFirmForAuditors, setSelectedFirmForAuditors] = useState<AuditFirm | null>(null);
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const {
    auditFirms,
    auditors,
    loading,
    error,
    selectedFirm,
    selectedAuditor,
    fetchAuditFirms,
    fetchAuditors,
    changeAuditFirmStatus,
    changeAuditorStatus,
    searchAuditFirms,
    getPendingAuditFirms,
    getApprovedAuditFirms,
    getRejectedAuditFirms,
    getPendingAuditors,
    getApprovedAuditors,
    getRejectedAuditors,
    setSelectedFirm,
    setSelectedAuditor,
    clearError
  } = useAuditFirms();

  useEffect(() => {
    setIsClient(true);
    
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
      
      // If user is authenticated, fetch data
      if (user) {
        fetchAuditFirms();
        fetchAuditors();
      }
    });
    
    return () => unsubscribe();
  }, [fetchAuditFirms, fetchAuditors]);

  // Handle search
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      await searchAuditFirms(term);
    }
  };

  // Handle status change for audit firm
  const handleAuditFirmStatusChange = async (firmId: string, status: string) => {
    try {
      await changeAuditFirmStatus({
        firmId,
        status: status as any,
        reason: statusUpdateReason
      });
      setStatusUpdateReason('');
      setSelectedFirm(null);
    } catch (err) {
      console.error('Failed to update audit firm status:', err);
    }
  };

  // Handle status change for auditor
  const handleAuditorStatusChange = async (auditorId: string, status: string) => {
    try {
      await changeAuditorStatus(auditorId, status, statusUpdateReason);
      setStatusUpdateReason('');
      setSelectedAuditor(null);
    } catch (err) {
      console.error('Failed to update auditor status:', err);
    }
  };

  // Get current data based on active tab and filters
  const getCurrentData = () => {
    if (loading || !auditFirms || auditFirms.length === 0) {
      return [];
    }
    
    let filteredData: AuditFirm[] = [];
    
    // First apply tab-based filtering
    switch (activeTab) {
      case 'pending':
        filteredData = getPendingAuditFirms();
        break;
      case 'verified':
        filteredData = getApprovedAuditFirms();
        break;
      case 'rejected':
        filteredData = getRejectedAuditFirms();
        break;
      default:
        filteredData = auditFirms;
    }
    
    // Apply additional filters
    if (firmSizeFilter !== 'all') {
      filteredData = filteredData.filter(firm => firm.firmSize === firmSizeFilter);
    }
    
    if (statusFilter !== 'all') {
      filteredData = filteredData.filter(firm => 
        firm.auditors && firm.auditors.some(auditor => auditor.vettedStatus === statusFilter)
      );
    }
    
    if (minAuditorsFilter > 0) {
      filteredData = filteredData.filter(firm => 
        (firm.auditors?.length || 0) >= minAuditorsFilter
      );
    }
    
    return filteredData;
  };

  const currentData = getCurrentData();

  const TABS = [
    { value: 'pending', label: `All Firms (${loading ? '...' : getPendingAuditFirms().length})` },
    { value: 'verified', label: `Verified (${loading ? '...' : getApprovedAuditFirms().length})` },
    { value: 'rejected', label: `Rejected (${loading ? '...' : getRejectedAuditFirms().length})` }
  ];

  const renderTabs = () => {
    if (!isClient) return <div className='h-10 w-full border-b'></div>;
    if (isMobile) {
      return (
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className='w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500'>
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg'>
          {TABS.map((tab) => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value}
              className='data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm font-medium transition-all duration-200'
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    );
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className='flex h-[400px] w-full items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        <span className='ml-2 text-muted-foreground'>Checking authentication...</span>
      </div>
    );
  }

  // Show message if user is not authenticated
  if (!user) {
    return (
      <div className='flex h-[400px] w-full items-center justify-center'>
        <div className='text-center'>
          <AlertTriangle className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <h3 className='text-lg font-medium mb-2'>Authentication Required</h3>
          <p className='text-muted-foreground'>Please sign in to access the vetting center.</p>
        </div>
      </div>
    );
  }

  if (loading && (!auditFirms || auditFirms.length === 0)) {
    return (
      <div className='flex h-[400px] w-full items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    );
  }

  return (
    <div className='flex-1 space-y-6 p-6 md:p-8 bg-gray-50 min-h-screen'>
      {/* Header Section */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
        <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-gray-900'>Audit Firm Vetting Center</h1>
            <p className='text-gray-600 mt-2'>
              Manage and vet audit firms and their auditors. Review applications, approve or reject based on compliance requirements.
            </p>
          </div>
          <div className='flex items-center space-x-3'>
            <div className='p-3 bg-blue-100 rounded-lg'>
              <Building2 className='h-6 w-6 text-blue-600' />
            </div>
            <div className='text-right'>
              <p className='text-sm font-medium text-gray-900'>Total Firms</p>
              <p className='text-2xl font-bold text-blue-600'>{auditFirms?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-xl p-4'>
          <div className='flex'>
            <AlertTriangle className='h-5 w-5 text-red-400' />
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-red-800'>Error</h3>
              <div className='mt-2 text-sm text-red-700'>{error}</div>
              {error.includes('authentication') && (
                <div className='mt-2 text-xs text-red-600'>
                  Please ensure you are signed in as an admin user.
                </div>
              )}
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={clearError}
              className='ml-auto text-red-700 hover:text-red-800 hover:bg-red-100'
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Status Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-4'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <Building2 className='h-5 w-5 text-blue-600' />
            </div>
            <div>
              <p className='text-sm font-medium text-gray-600'>Total Firms</p>
              <p className='text-2xl font-bold text-gray-900'>{auditFirms?.length || 0}</p>
            </div>
          </div>
        </div>
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-4'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-green-100 rounded-lg'>
              <Users className='h-5 w-5 text-green-600' />
            </div>
            <div>
              <p className='text-sm font-medium text-gray-600'>Total Auditors</p>
              <p className='text-2xl font-bold text-gray-900'>{auditors?.length || 0}</p>
            </div>
          </div>
        </div>
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-4'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-yellow-100 rounded-lg'>
              <Clock className='h-5 w-5 text-yellow-600' />
            </div>
            <div>
              <p className='text-sm font-medium text-gray-600'>Pending Review</p>
              <p className='text-2xl font-bold text-gray-900'>{getPendingAuditFirms().length}</p>
            </div>
          </div>
        </div>
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-4'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-green-100 rounded-lg'>
              <CheckCircle className='h-5 w-5 text-green-600' />
            </div>
            <div>
              <p className='text-sm font-medium text-gray-600'>Verified</p>
              <p className='text-2xl font-bold text-gray-900'>{getApprovedAuditFirms().length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters Section */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
        <div className='space-y-4'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <div className='flex-1 max-w-md'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  placeholder='Search audit firms...'
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className='pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
            </div>
            <div className='w-full sm:w-auto'>
              {renderTabs()}
            </div>
          </div>
          
          {/* Additional Filters */}
          <div className='flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100'>
            <div className='flex items-center space-x-2'>
              <Label className='text-sm font-medium text-gray-700'>Firm Size:</Label>
              <Select value={firmSizeFilter} onValueChange={setFirmSizeFilter}>
                <SelectTrigger className='w-32 border-gray-200'>
                  <SelectValue placeholder='All Sizes' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Sizes</SelectItem>
                  <SelectItem value='SMALL'>Small</SelectItem>
                  <SelectItem value='MEDIUM'>Medium</SelectItem>
                  <SelectItem value='LARGE'>Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className='flex items-center space-x-2'>
              <Label className='text-sm font-medium text-gray-700'>Status:</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className='w-32 border-gray-200'>
                  <SelectValue placeholder='All Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Status</SelectItem>
                  <SelectItem value='NOT_APPLIED'>Not Applied</SelectItem>
                  <SelectItem value='PENDING'>Pending</SelectItem>
                  <SelectItem value='VERIFIED'>Verified</SelectItem>
                  <SelectItem value='REJECTED'>Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className='flex items-center space-x-2'>
              <Label className='text-sm font-medium text-gray-700'>Min Auditors:</Label>
              <Input 
                type='number' 
                placeholder='0' 
                className='w-20 border-gray-200'
                min='0'
                value={minAuditorsFilter}
                onChange={(e) => setMinAuditorsFilter(parseInt(e.target.value) || 0)}
              />
            </div>
            
            <Button
              variant='outline'
              size='sm'
              onClick={() => {
                setFirmSizeFilter('all');
                setStatusFilter('all');
                setMinAuditorsFilter(0);
              }}
              className='border-gray-200 text-gray-700 hover:bg-gray-50'
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Audit Firms Table */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
        <div className='relative w-full overflow-auto'>
          <Table>
            <TableHeader>
              <TableRow className='bg-gray-50'>
                <TableHead className='font-semibold text-gray-700'>Firm Name</TableHead>
                <TableHead className='font-semibold text-gray-700'>License Number</TableHead>
                <TableHead className='font-semibold text-gray-700'>Size</TableHead>
                <TableHead className='font-semibold text-gray-700'>Auditor Count</TableHead>
                <TableHead className='font-semibold text-gray-700'>Auditor Details</TableHead>
                <TableHead className='font-semibold text-gray-700'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData && currentData.length > 0 ? (
                currentData.map((firm) => (
                <TableRow key={firm.id} className='hover:bg-gray-50 border-b border-gray-100'>
                  <TableCell className='py-4'>
                    <div className='flex items-center space-x-3'>
                      <div className='p-2 bg-blue-100 rounded-lg'>
                        <Building2 className='h-5 w-5 text-blue-600' />
                      </div>
                      <div>
                        <p className='font-semibold text-gray-900'>{firm.name}</p>
                        <p className='text-xs text-gray-500'>ID: {firm.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='py-4'>
                    <span className='px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium'>
                      {firm.licenseNumber}
                    </span>
                  </TableCell>
                  <TableCell className='py-4'>
                    <FirmSizeBadge size={firm.firmSize} />
                  </TableCell>
                  <TableCell className='py-4'>
                    <div className='flex items-center space-x-2'>
                      <div className='p-2 bg-green-100 rounded-lg'>
                        <Users className='h-4 w-4 text-green-600' />
                      </div>
                      <span className='font-semibold text-gray-900'>{firm.auditors?.length || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell className='py-4'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        setSelectedFirmForAuditors(firm);
                        setShowAuditorList(true);
                      }}
                      className='border-purple-200 text-purple-700 hover:bg-purple-50 flex items-center space-x-2'
                      disabled={!firm.auditors || firm.auditors.length === 0}
                    >
                      <Users className='h-4 w-4' />
                      <span>View Auditors ({firm.auditors?.length || 0})</span>
                    </Button>
                  </TableCell>
                  <TableCell className='py-4'>
                    <div className='flex space-x-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setSelectedFirm(firm)}
                        className='border-blue-200 text-blue-700 hover:bg-blue-50'
                      >
                        <Eye className='h-4 w-4 mr-1' />
                        View Firm
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                ))
              ) : null}
              {(!currentData || currentData.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className='text-center py-12 text-muted-foreground'>
                    <div className='space-y-3'>
                      <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto'>
                        <Building2 className='h-8 w-8 text-gray-400' />
                      </div>
                      <div>
                        <h3 className='text-lg font-medium text-gray-900'>No audit firms found</h3>
                        <p className='text-gray-500'>No audit firms match the selected criteria.</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {currentData && currentData.length > 0 && (
                <TableRow className='bg-gradient-to-r from-blue-50 to-indigo-50 border-t-2 border-blue-200'>
                  <TableCell colSpan={6} className='py-4'>
                    <div className='flex justify-center items-center space-x-8 text-sm'>
                      <div className='flex items-center space-x-2'>
                        <Building2 className='h-4 w-4 text-blue-600' />
                        <span className='font-semibold text-blue-900'>Total Firms: {currentData.length}</span>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Users className='h-4 w-4 text-green-600' />
                        <span className='font-semibold text-green-900'>Total Auditors: {currentData.reduce((sum, firm) => sum + (firm.auditors?.length || 0), 0)}</span>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <div className='w-3 h-3 bg-gray-400 rounded-full'></div>
                        <span className='font-semibold text-gray-900'>
                          Status: {(() => {
                            const statusCounts = { NOT_APPLIED: 0, PENDING: 0, VERIFIED: 0, REJECTED: 0 };
                            currentData.forEach(firm => {
                              firm.auditors?.forEach(auditor => {
                                statusCounts[auditor.vettedStatus]++;
                              });
                            });
                            return Object.entries(statusCounts)
                              .filter(([_, count]) => count > 0)
                              .map(([status, count]) => `${status}: ${count}`)
                              .join(', ');
                          })()}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Audit Firm Detail Modal */}
      <Dialog
        open={selectedFirm !== null}
        onOpenChange={(isOpen) => !isOpen && setSelectedFirm(null)}
      >
        <DialogContent className='flex max-h-[90vh] flex-col sm:max-w-4xl'>
          {selectedFirm && (
            <>
              <DialogHeader>
                <DialogTitle className='text-2xl'>
                  {selectedFirm.name} - Audit Firm Details
                </DialogTitle>
                <DialogDescription>
                  Review firm information, auditors, and take vetting actions.
                </DialogDescription>
              </DialogHeader>
              <div className='grid flex-1 grid-cols-1 gap-6 overflow-y-auto py-4 pr-4 lg:grid-cols-3'>
                <div className='space-y-6 lg:col-span-2'>
                  {/* Firm Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Firm Information</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <Label className='text-sm font-medium'>License Number</Label>
                          <p className='text-sm text-muted-foreground'>{selectedFirm.licenseNumber}</p>
                        </div>
                        <div>
                          <Label className='text-sm font-medium'>Registered In</Label>
                          <p className='text-sm text-muted-foreground'>{selectedFirm.registeredIn}</p>
                        </div>
                        <div>
                          <Label className='text-sm font-medium'>Firm Size</Label>
                          <FirmSizeBadge size={selectedFirm.firmSize} />
                        </div>
                        <div>
                          <Label className='text-sm font-medium'>Registration Date</Label>
                          <p className='text-sm text-muted-foreground'>
                            {new Date(selectedFirm.registeredOn).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <Label className='text-sm font-medium'>Specialties</Label>
                        <div className='flex flex-wrap gap-2 mt-1'>
                          {selectedFirm.specialties && selectedFirm.specialties.length > 0 ? (
                            selectedFirm.specialties.map((specialty, index) => (
                              <Badge key={index} variant='outline'>{specialty}</Badge>
                            ))
                          ) : (
                            <span className='text-sm text-muted-foreground'>No specialties listed</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className='text-sm font-medium'>Languages</Label>
                        <div className='flex flex-wrap gap-2 mt-1'>
                          {selectedFirm.languages && selectedFirm.languages.length > 0 ? (
                            selectedFirm.languages.map((language, index) => (
                              <Badge key={index} variant='outline'>{language}</Badge>
                            ))
                          ) : (
                            <span className='text-sm text-muted-foreground'>No languages listed</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Auditors List */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Auditors ({selectedFirm.auditors?.length || 0})</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      {selectedFirm.auditors && selectedFirm.auditors.length > 0 ? (
                        selectedFirm.auditors.map((auditor) => (
                        <div key={auditor.id} className='border rounded-lg p-4'>
                          <div className='flex items-center justify-between mb-2'>
                            <h4 className='font-medium'>{auditor.name}</h4>
                            <VettedStatusBadge status={auditor.vettedStatus} />
                          </div>
                          <div className='grid grid-cols-2 gap-4 text-sm'>
                            <div>
                              <Label className='text-xs font-medium'>Experience</Label>
                              <p className='text-muted-foreground'>{auditor.yearsExperience} years</p>
                            </div>
                            <div>
                              <Label className='text-xs font-medium'>Rating</Label>
                              <p className='text-muted-foreground'>{auditor.rating}/5</p>
                            </div>
                          </div>
                          <div className='mt-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => setSelectedAuditor(auditor)}
                            >
                              <Eye className='h-4 w-4 mr-1' />
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))
                      ) : (
                        <div className='text-center py-4 text-muted-foreground'>
                          No auditors found for this firm.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Actions Panel */}
                <div className='space-y-6'>
                  <Card>
                    <CardHeader>
                      <CardTitle>Vetting Actions</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div>
                        <Label htmlFor='status'>New Status</Label>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                                                     <SelectContent>
                             <SelectItem value='VERIFIED'>Verify</SelectItem>
                             <SelectItem value='REJECTED'>Reject</SelectItem>
                             <SelectItem value='PENDING'>Mark as Pending</SelectItem>
                             <SelectItem value='SUSPENDED'>Suspend</SelectItem>
                             <SelectItem value='BANNED'>Ban</SelectItem>
                           </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor='reason'>Reason (Optional)</Label>
                        <Textarea
                          id='reason'
                          placeholder='Enter reason for status change...'
                          value={statusUpdateReason}
                          onChange={(e) => setStatusUpdateReason(e.target.value)}
                        />
                      </div>

                      <Button
                        onClick={() => handleAuditFirmStatusChange(selectedFirm.id, selectedStatus)}
                        className='w-full'
                      >
                        Update Status
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Auditor List Popup */}
      <Dialog
        open={showAuditorList}
        onOpenChange={(isOpen) => !isOpen && setShowAuditorList(false)}
      >
        <DialogContent className='flex max-h-[80vh] flex-col sm:max-w-3xl'>
          {selectedFirmForAuditors && (
            <>
              <DialogHeader>
                <DialogTitle className='text-2xl flex items-center space-x-2'>
                  <Building2 className='h-6 w-6 text-blue-600' />
                  <span>{selectedFirmForAuditors.name}</span>
                </DialogTitle>
                <DialogDescription>
                  View all auditors for this audit firm and their current vetting status.
                </DialogDescription>
              </DialogHeader>
              <div className='flex-1 overflow-y-auto py-4'>
                <div className='space-y-4'>
                  {/* Firm Info Summary */}
                  <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                      <div>
                        <span className='text-gray-600 font-medium'>Total Auditors:</span>
                        <p className='text-lg font-semibold text-gray-900'>{selectedFirmForAuditors.auditors?.length || 0}</p>
                      </div>
                      <div>
                        <span className='text-gray-600 font-medium'>Firm Size:</span>
                        <p className='text-lg font-semibold text-gray-900'>{selectedFirmForAuditors.firmSize}</p>
                      </div>
                      <div>
                        <span className='text-gray-600 font-medium'>License:</span>
                        <p className='text-lg font-semibold text-gray-900'>{selectedFirmForAuditors.licenseNumber}</p>
                      </div>
                      <div>
                        <span className='text-gray-600 font-medium'>Registered:</span>
                        <p className='text-lg font-semibold text-gray-900'>{selectedFirmForAuditors.registeredIn}</p>
                      </div>
                    </div>
                  </div>

                  {/* Auditors Table */}
                  <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
                    <div className='px-4 py-3 bg-gray-50 border-b border-gray-200'>
                      <h3 className='font-semibold text-gray-900'>Auditor List</h3>
                    </div>
                    <div className='divide-y divide-gray-200'>
                      {selectedFirmForAuditors.auditors && selectedFirmForAuditors.auditors.length > 0 ? (
                        selectedFirmForAuditors.auditors.map((auditor, index) => (
                          <div key={auditor.id} className='px-4 py-4 hover:bg-gray-50 transition-colors'>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center space-x-3'>
                                <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600'>
                                  {index + 1}
                                </div>
                                <div>
                                  <h4 className='font-semibold text-gray-900'>{auditor.name}</h4>
                                  <p className='text-sm text-gray-500'>ID: {auditor.id.slice(0, 8)}...</p>
                                </div>
                              </div>
                              <div className='flex items-center space-x-4'>
                                <div className='text-right'>
                                  <p className='text-sm text-gray-600'>Experience</p>
                                  <p className='font-semibold text-gray-900'>{auditor.yearsExperience} years</p>
                                </div>
                                <div className='text-right'>
                                  <p className='text-sm text-gray-600'>Rating</p>
                                  <p className='font-semibold text-gray-900'>{auditor.rating}/5</p>
                                </div>
                                <VettedStatusBadge status={auditor.vettedStatus} />
                              </div>
                            </div>
                            
                            {/* Auditor Details Row */}
                            <div className='mt-3 pt-3 border-t border-gray-100'>
                              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                                <div>
                                  <span className='text-gray-600'>License:</span>
                                  <p className='font-medium text-gray-900'>{auditor.licenseNumber}</p>
                                </div>
                                <div>
                                  <span className='text-gray-600'>Success Count:</span>
                                  <p className='font-medium text-gray-900'>{auditor.successCount}</p>
                                </div>
                                <div>
                                  <span className='text-gray-600'>Specialties:</span>
                                  <p className='font-medium text-gray-900'>
                                    {auditor.specialties && auditor.specialties.length > 0 
                                      ? auditor.specialties.slice(0, 2).join(', ') + (auditor.specialties.length > 2 ? '...' : '')
                                      : 'None'
                                    }
                                  </p>
                                </div>
                                <div>
                                  <span className='text-gray-600'>Languages:</span>
                                  <p className='font-medium text-gray-900'>
                                    {auditor.languages && auditor.languages.length > 0 
                                      ? auditor.languages.slice(0, 2).join(', ') + (auditor.languages.length > 2 ? '...' : '')
                                      : 'None'
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className='px-4 py-8 text-center text-gray-500'>
                          <Users className='h-12 w-12 text-gray-300 mx-auto mb-3' />
                          <p>No auditors found for this firm</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className='border-t border-gray-200 pt-4'>
                <Button
                  variant='outline'
                  onClick={() => setShowAuditorList(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setSelectedFirm(selectedFirmForAuditors);
                    setShowAuditorList(false);
                  }}
                  className='bg-blue-600 hover:bg-blue-700'
                >
                  <Eye className='h-4 w-4 mr-2' />
                  View Full Firm Details
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
