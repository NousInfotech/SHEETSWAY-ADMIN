'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../components/layout/providers';
import { paymentService } from '../services/paymentService';
import type {
  Payment,
  PaymentWithEscrow,
  PaymentFilter,
  PaymentStats
} from '../types';

export function usePayments() {
  const { user, loading: authLoading } = useAuth();
  
  // State for payments data
  const [payments, setPayments] = useState<Payment[]>([]);
  const [escrowPayments, setEscrowPayments] = useState<PaymentWithEscrow[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  
  // Loading states
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [loadingEscrowPayments, setLoadingEscrowPayments] = useState(false);
  const [loadingPaymentDetails, setLoadingPaymentDetails] = useState(false);
  
  // Filter and pagination state
  const [filter, setFilter] = useState<PaymentFilter>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Payment statistics
  const [stats, setStats] = useState<PaymentStats>({
    totalPayments: 0,
    totalAmount: 0,
    currency: 'USD',
    pendingPayments: 0,
    successfulPayments: 0,
    failedPayments: 0,
    refundedPayments: 0,
    averagePaymentValue: 0,
  });

  // Load all payments
  const loadPayments = useCallback(async () => {
    if (!user) {
      console.log('🔐 User not authenticated, skipping payments load');
      return;
    }

    try {
      setLoadingPayments(true);
      const data = await paymentService.getPayments(filter);
      console.log('📊 Raw payments data:', data);
      
      // Filter out any invalid data
      const validPayments = data.filter(payment => 
        payment && typeof payment === 'object' && payment.id && payment.status
      );
      console.log('✅ Valid payments:', validPayments.length, 'Invalid:', data.length - validPayments.length);
      
      setPayments(validPayments);
      
      // Calculate and update stats
      const paymentStats = paymentService.calculatePaymentStats(validPayments);
      setStats(paymentStats);
      
      console.log('✅ Payments loaded successfully:', validPayments.length);
    } catch (error) {
      console.error('❌ Error loading payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoadingPayments(false);
    }
  }, [user, filter]);

  // Load escrow payments
  const loadEscrowPayments = useCallback(async () => {
    if (!user) {
      console.log('🔐 User not authenticated, skipping escrow payments load');
      return;
    }

    try {
      setLoadingEscrowPayments(true);
      const data = await paymentService.getEscrowStatusesWithPayments(filter);
      console.log('📊 Raw escrow payments data:', data);
      
      if (data.length === 0) {
        console.log('⚠️ No escrow payments data received - this is due to backend Prisma validation error');
        console.log('🔍 Backend Error: PrismaClientValidationError - Invalid nested where clause in escrowStatus.findMany()');
        console.log('🔧 Frontend Workaround: Returning empty array to prevent UI crashes');
        setEscrowPayments([]);
        return;
      }
      
      // Filter out any invalid data
      const validEscrowPayments = data.filter(escrowPayment => 
        escrowPayment && 
        typeof escrowPayment === 'object' && 
        escrowPayment.id && 
        escrowPayment.escrow && 
        escrowPayment.escrow.id
      );
      console.log('✅ Valid escrow payments:', validEscrowPayments.length, 'Invalid:', data.length - validEscrowPayments.length);
      
      setEscrowPayments(validEscrowPayments);
      console.log('✅ Escrow payments loaded successfully:', validEscrowPayments.length);
    } catch (error) {
      console.error('❌ Error loading escrow payments:', error);
      toast.error('Failed to load escrow payments. Please try again later.');
      setEscrowPayments([]); // Set empty array on error
    } finally {
      setLoadingEscrowPayments(false);
    }
  }, [user, filter]);

  // Get payment by ID
  const getPaymentById = useCallback(async (paymentId: string) => {
    if (!user) {
      console.log('🔐 User not authenticated, cannot fetch payment details');
      return null;
    }

    try {
      setLoadingPaymentDetails(true);
      const payment = await paymentService.getPaymentById(paymentId);
      return payment;
    } catch (error) {
      console.error('❌ Error fetching payment details:', error);
      toast.error('Failed to fetch payment details');
      return null;
    } finally {
      setLoadingPaymentDetails(false);
    }
  }, [user]);

  // Get payment by escrow ID
  const getPaymentByEscrowId = useCallback(async (escrowId: string) => {
    if (!user) {
      console.log('🔐 User not authenticated, cannot fetch escrow payment');
      return null;
    }

    try {
      const payment = await paymentService.getPaymentByEscrowId(escrowId);
      return payment;
    } catch (error) {
      console.error('❌ Error fetching escrow payment:', error);
      toast.error('Failed to fetch escrow payment');
      return null;
    }
  }, [user]);

  // Get payments by role
  const getPaymentsByRole = useCallback(async (role: 'USER' | 'AUDITFIRM', roleId: string) => {
    if (!user) {
      console.log('🔐 User not authenticated, cannot fetch role-based payments');
      return [];
    }

    try {
      const data = await paymentService.getPaymentsByRoleId(role, roleId);
      return data;
    } catch (error) {
      console.error('❌ Error fetching role-based payments:', error);
      toast.error('Failed to fetch role-based payments');
      return [];
    }
  }, [user]);

  // Filter payments
  const getFilteredPayments = useCallback(() => {
    let filtered = [...payments];
    
    if (filter.status) {
      filtered = filtered.filter(payment => payment.status === filter.status);
    }
    
    if (filter.paymentMethod) {
      filtered = filtered.filter(payment => payment.paymentMethod === filter.paymentMethod);
    }
    
    if (filter.engagementId) {
      filtered = filtered.filter(payment => 
        payment.escrow?.engagementId === filter.engagementId
      );
    }
    
    return filtered;
  }, [payments, filter]);

  // Get paginated payments
  const getPaginatedPayments = useCallback(() => {
    const filtered = getFilteredPayments();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }, [getFilteredPayments, currentPage, itemsPerPage]);

  // Get paginated escrow payments
  const getPaginatedEscrowPayments = useCallback(() => {
    let filtered = [...escrowPayments];
    
    if (filter.status) {
      filtered = filtered.filter(escrow => escrow.status === filter.status);
    }
    
    if (filter.engagementId) {
      filtered = filtered.filter(escrow => escrow.escrow?.engagementId === filter.engagementId);
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }, [escrowPayments, filter, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(getFilteredPayments().length / itemsPerPage);
  const totalEscrowPages = Math.ceil(escrowPayments.length / itemsPerPage);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((newFilter: Partial<PaymentFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
    setCurrentPage(1); // Reset to first page when filter changes
  }, []);

  // Handle view payment
  const handleViewPayment = useCallback((payment: Payment) => {
    setSelectedPayment(payment);
  }, []);

  // Handle view escrow
  const handleViewEscrow = useCallback((escrowPayment: PaymentWithEscrow) => {
    setSelectedPayment(escrowPayment);
  }, []);

  // Refresh data
  const refreshData = useCallback(async () => {
    if (user) {
      await Promise.all([
        loadPayments(),
        loadEscrowPayments()
      ]);
      toast.success('Data refreshed successfully');
    }
  }, [user, loadPayments, loadEscrowPayments]);

  // Load data when user is authenticated
  useEffect(() => {
    if (user && !authLoading) {
      console.log('🔐 User authenticated, loading payments data...');
      loadPayments();
      loadEscrowPayments();
    }
  }, [user, authLoading, loadPayments, loadEscrowPayments]);

  // Update stats when payments change
  useEffect(() => {
    if (payments.length > 0) {
      const paymentStats = paymentService.calculatePaymentStats(payments);
      setStats(paymentStats);
    }
  }, [payments]);

  return {
    // Data
    payments: getPaginatedPayments(),
    escrowPayments: getPaginatedEscrowPayments(),
    selectedPayment,
    stats,
    
    // Loading states
    loadingPayments,
    loadingEscrowPayments,
    loadingPaymentDetails,
    authLoading,
    
    // Filter and pagination
    filter,
    currentPage,
    totalPages,
    totalEscrowPages,
    itemsPerPage,
    
    // Actions
    loadPayments,
    loadEscrowPayments,
    getPaymentById,
    getPaymentByEscrowId,
    getPaymentsByRole,
    refreshData,
    
    // Event handlers
    onFilterChange: handleFilterChange,
    onPageChange: handlePageChange,
    onViewPayment: handleViewPayment,
    onViewEscrow: handleViewEscrow,
    
    // Utility functions
    getFilteredPayments,
    getPaginatedPayments,
    getPaginatedEscrowPayments,
  };
}
