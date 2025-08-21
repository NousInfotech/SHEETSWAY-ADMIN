import { useState, useEffect, useCallback } from 'react';
import { auditFirmService, AuditFirm, Auditor, AuditFirmStatusUpdate } from '../services/auditFirmService';

export const useAuditFirms = () => {
  const [auditFirms, setAuditFirms] = useState<AuditFirm[]>([]);
  const [auditors, setAuditors] = useState<Auditor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFirm, setSelectedFirm] = useState<AuditFirm | null>(null);
  const [selectedAuditor, setSelectedAuditor] = useState<Auditor | null>(null);

  // Fetch all audit firms
  const fetchAuditFirms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const firms = await auditFirmService.getAllAuditFirms();
      setAuditFirms(firms);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch audit firms';
      setError(errorMessage);
      
      // If it's an authentication error, don't retry automatically
      if (errorMessage.includes('authentication') || errorMessage.includes('not authenticated')) {
        console.warn('Authentication error - user may need to sign in again');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all auditors
  const fetchAuditors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const auditorList = await auditFirmService.getAllAuditors();
      setAuditors(auditorList);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch auditors';
      setError(errorMessage);
      
      // If it's an authentication error, don't retry automatically
      if (errorMessage.includes('authentication') || errorMessage.includes('not authenticated')) {
        console.warn('Authentication error - user may need to sign in again');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Get audit firm by ID
  const getAuditFirm = useCallback(async (firmId: string) => {
    setLoading(true);
    setError(null);
    try {
      const firm = await auditFirmService.getAuditFirm(firmId);
      setSelectedFirm(firm);
      return firm;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch audit firm');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Change audit firm status
  const changeAuditFirmStatus = useCallback(async (updateData: AuditFirmStatusUpdate) => {
    setLoading(true);
    setError(null);
    try {
      await auditFirmService.changeAuditFirmStatus(updateData);
      // Refresh the list after status change
      await fetchAuditFirms();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update audit firm status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAuditFirms]);

  // Change auditor status
  const changeAuditorStatus = useCallback(async (auditorId: string, status: string, reason?: string) => {
    setLoading(true);
    setError(null);
    try {
      await auditFirmService.changeAuditorStatus(auditorId, status, reason);
      // Refresh the list after status change
      await fetchAuditors();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update auditor status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAuditors]);

  // Get audit firms by status
  const getAuditFirmsByStatus = useCallback(async (status: string) => {
    setLoading(true);
    setError(null);
    try {
      const firms = await auditFirmService.getAuditFirmsByStatus(status);
      setAuditFirms(firms);
      return firms;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch audit firms by status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get auditors by vetted status
  const getAuditorsByVettedStatus = useCallback(async (status: string) => {
    setLoading(true);
    setError(null);
    try {
      const auditorList = await auditFirmService.getAuditorsByVettedStatus(status);
      setAuditors(auditorList);
      return auditorList;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch auditors by vetted status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search audit firms
  const searchAuditFirms = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      await fetchAuditFirms();
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const firms = await auditFirmService.searchAuditFirms(searchTerm);
      setAuditFirms(firms);
      return firms;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search audit firms');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAuditFirms]);

  // Filter audit firms by status
  const getPendingAuditFirms = useCallback(() => {
    if (!auditFirms || auditFirms.length === 0) {
      return [];
    }
    
    // Show all firms that have auditors (since we're grouping by firm)
    // This will show firms even if their auditors are NOT_APPLIED
    const pending = auditFirms.filter(firm => 
      firm.auditors && Array.isArray(firm.auditors) && firm.auditors.length > 0
    );
    
    return pending;
  }, [auditFirms]);

  const getApprovedAuditFirms = useCallback(() => {
    if (!auditFirms || auditFirms.length === 0) {
      return [];
    }
    
    // Show firms where ALL auditors are VERIFIED
    const approved = auditFirms.filter(firm => 
      firm.auditors && Array.isArray(firm.auditors) && 
      firm.auditors.length > 0 &&
      firm.auditors.every(auditor => auditor.vettedStatus === 'VERIFIED')
    );
    
    return approved;
  }, [auditFirms]);

  const getRejectedAuditFirms = useCallback(() => {
    if (!auditFirms || auditFirms.length === 0) {
      return [];
    }
    
    // Show firms where ANY auditor is REJECTED
    const rejected = auditFirms.filter(firm => 
      firm.auditors && Array.isArray(firm.auditors) && 
      firm.auditors.some(auditor => auditor.vettedStatus === 'REJECTED')
    );
    
    return rejected;
  }, [auditFirms]);

  // Filter auditors by vetted status
  const getPendingAuditors = useCallback(() => {
    if (!auditors || auditors.length === 0) return [];
    return auditors.filter(auditor => auditor.vettedStatus === 'PENDING');
  }, [auditors]);

  const getApprovedAuditors = useCallback(() => {
    if (!auditors || auditors.length === 0) return [];
    return auditors.filter(auditor => auditor.vettedStatus === 'VERIFIED');
  }, [auditors]);

  const getRejectedAuditors = useCallback(() => {
    if (!auditors || auditors.length === 0) return [];
    return auditors.filter(auditor => auditor.vettedStatus === 'REJECTED');
  }, [auditors]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear selections
  const clearSelections = useCallback(() => {
    setSelectedFirm(null);
    setSelectedAuditor(null);
  }, []);

  // Initial data fetch - only when component is mounted
  useEffect(() => {
    // Don't fetch data immediately - let the component handle it
    // This prevents the "No authentication token found" error on initial load
  }, []);

  return {
    // State
    auditFirms,
    auditors,
    loading,
    error,
    selectedFirm,
    selectedAuditor,
    
    // Actions
    fetchAuditFirms,
    fetchAuditors,
    getAuditFirm,
    changeAuditFirmStatus,
    changeAuditorStatus,
    getAuditFirmsByStatus,
    getAuditorsByVettedStatus,
    searchAuditFirms,
    
    // Filtered data
    getPendingAuditFirms,
    getApprovedAuditFirms,
    getRejectedAuditFirms,
    getPendingAuditors,
    getApprovedAuditors,
    getRejectedAuditors,
    
    // Utility
    clearError,
    clearSelections,
    setSelectedFirm,
    setSelectedAuditor
  };
};
