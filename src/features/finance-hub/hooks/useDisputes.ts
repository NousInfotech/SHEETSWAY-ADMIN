import { useState, useEffect, useCallback } from 'react';
import { disputesService, Dispute, DisputeStatusUpdate, DisputeFilters } from '../services/disputesService';

export const useDisputes = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    underReview: 0,
    resolved: 0,
    refunded: 0,
    totalAmount: 0
  });

  // Fetch all disputes
  const fetchDisputes = useCallback(async (filters?: DisputeFilters) => {
    setLoading(true);
    setError(null);
    try {
      const disputesList = await disputesService.getAllDisputes(filters);
      setDisputes(disputesList);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch disputes';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch dispute by ID
  const fetchDispute = useCallback(async (disputeId: string) => {
    setLoading(true);
    setError(null);
    try {
      const dispute = await disputesService.getDispute(disputeId);
      setSelectedDispute(dispute);
      return dispute;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dispute';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update dispute status
  const updateDisputeStatus = useCallback(async (updateData: DisputeStatusUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const updatedDispute = await disputesService.updateDisputeStatus(updateData);
      
      // Update the disputes list
      setDisputes(prev => prev.map(dispute => 
        dispute.id === updateData.disputeId ? updatedDispute : dispute
      ));
      
      // Update selected dispute if it's the one being updated
      if (selectedDispute?.id === updateData.disputeId) {
        setSelectedDispute(updatedDispute);
      }
      
      return updatedDispute;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update dispute status';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedDispute]);

  // Resolve dispute
  const resolveDispute = useCallback(async (disputeId: string, resolution: string, action: 'release' | 'refund' | 'hold') => {
    setLoading(true);
    setError(null);
    try {
      const resolvedDispute = await disputesService.resolveDispute(disputeId, resolution, action);
      
      // Update the disputes list
      setDisputes(prev => prev.map(dispute => 
        dispute.id === disputeId ? resolvedDispute : dispute
      ));
      
      // Update selected dispute if it's the one being resolved
      if (selectedDispute?.id === disputeId) {
        setSelectedDispute(resolvedDispute);
      }
      
      return resolvedDispute;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resolve dispute';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedDispute]);

  // Fetch dispute statistics
  const fetchDisputeStats = useCallback(async () => {
    try {
      const disputeStats = await disputesService.getDisputeStats();
      setStats(disputeStats);
    } catch (err) {
      console.warn('Failed to fetch dispute stats:', err);
      // Don't set error for stats as it's not critical
    }
  }, []);

  // Get disputes by status
  const getDisputesByStatus = useCallback((status: string) => {
    return disputes.filter(dispute => dispute.status === status);
  }, [disputes]);

  // Get disputes by type
  const getDisputesByType = useCallback((type: string) => {
    return disputes.filter(dispute => dispute.type === type);
  }, [disputes]);

  // Search disputes
  const searchDisputes = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return disputes;
    
    const term = searchTerm.toLowerCase();
    return disputes.filter(dispute => 
      dispute.clientName.toLowerCase().includes(term) ||
      dispute.freelancerName.toLowerCase().includes(term) ||
      dispute.disputeReason.toLowerCase().includes(term) ||
      dispute.transactionId.toLowerCase().includes(term)
    );
  }, [disputes]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedDispute(null);
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchDisputes();
    fetchDisputeStats();
  }, [fetchDisputes, fetchDisputeStats]);

  return {
    // State
    disputes,
    loading,
    error,
    selectedDispute,
    stats,
    
    // Actions
    fetchDisputes,
    fetchDispute,
    updateDisputeStatus,
    resolveDispute,
    fetchDisputeStats,
    
    // Filtered data
    getDisputesByStatus,
    getDisputesByType,
    searchDisputes,
    
    // Utility
    clearError,
    clearSelection,
    setSelectedDispute
  };
};
