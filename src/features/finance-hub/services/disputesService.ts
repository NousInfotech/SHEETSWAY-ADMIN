import axios from 'axios';
import { BACKEND_URL } from '@/constants/data';
import { auth } from '@/lib/firebase';

/**
 * DISPUTES SERVICE
 * 
 * This service provides comprehensive dispute management functionality for admins.
 * 
 * BACKEND ENDPOINTS:
 * - GET /api/v1/disputes - Get all disputes
 * - GET /api/v1/disputes/:disputeId - Get specific dispute
 * - PATCH /api/v1/disputes/:disputeId/status - Update dispute status
 * - PATCH /api/v1/disputes/:disputeId/resolve - Resolve dispute
 */

export interface Dispute {
  id: string;
  transactionId: string;
  type: 'escrow' | 'milestone' | 'payment';
  clientName: string;
  freelancerName: string;
  amount: number;
  currency: string;
  disputeReason: string;
  status: 'open' | 'under_review' | 'resolved' | 'refunded';
  createdAt: string;
  resolvedAt?: string;
  adminNotes?: string;
  evidence?: string[];
  engagementId?: string;
  auditFirmId?: string;
  auditorId?: string;
}

export interface DisputeStatusUpdate {
  disputeId: string;
  status: 'open' | 'under_review' | 'resolved' | 'refunded';
  adminNotes?: string;
  action?: 'release' | 'refund' | 'hold';
}

export interface DisputeFilters {
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

class DisputesService {
  private baseURL = `${BACKEND_URL}/api/v1`;

  // Get all disputes with optional filtering
  async getAllDisputes(filters?: DisputeFilters): Promise<Dispute[]> {
    try {
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }
      
      const token = await this.getAuthToken();
      
      // Build query parameters
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.minAmount) params.append('minAmount', filters.minAmount.toString());
      if (filters?.maxAmount) params.append('maxAmount', filters.maxAmount.toString());
      
      const response = await axios.get(`${this.baseURL}/disputes?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'active-role': 'ADMIN'
        }
      });
      
      return response.data.data || [];
      
    } catch (error: any) {
      console.error('Error fetching disputes:', error);
      
      if (error?.response?.status === 404) {
        throw new Error('Disputes endpoint not found. Please check if the backend is running.');
      }
      if (error?.response?.status === 401) {
        throw new Error('Authentication failed. Please sign in again.');
      }
      if (error?.response?.status === 403) {
        throw new Error('Access denied. You do not have permission to view disputes.');
      }
      
      throw new Error(`Failed to fetch disputes: ${error?.message || 'Unknown error'}`);
    }
  }

  // Get dispute by ID
  async getDispute(disputeId: string): Promise<Dispute> {
    try {
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }
      
      const token = await this.getAuthToken();
      
      const response = await axios.get(`${this.baseURL}/disputes/${disputeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'active-role': 'ADMIN'
        }
      });
      
      return response.data.data;
      
    } catch (error: any) {
      console.error('Error fetching dispute:', error);
      
      if (error?.response?.status === 404) {
        throw new Error('Dispute not found.');
      }
      if (error?.response?.status === 401) {
        throw new Error('Authentication failed. Please sign in again.');
      }
      if (error?.response?.status === 403) {
        throw new Error('Access denied. You do not have permission to view this dispute.');
      }
      
      throw new Error(`Failed to fetch dispute: ${error?.message || 'Unknown error'}`);
    }
  }

  // Update dispute status
  async updateDisputeStatus(updateData: DisputeStatusUpdate): Promise<Dispute> {
    try {
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }
      
      const token = await this.getAuthToken();
      
      const response = await axios.patch(`${this.baseURL}/disputes/${updateData.disputeId}/status`, {
        status: updateData.status,
        adminNotes: updateData.adminNotes,
        action: updateData.action
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'active-role': 'ADMIN'
        }
      });
      
      return response.data.data;
      
    } catch (error: any) {
      console.error('Error updating dispute status:', error);
      
      if (error?.response?.status === 404) {
        throw new Error('Dispute not found.');
      }
      if (error?.response?.status === 400) {
        throw new Error('Invalid status update data.');
      }
      if (error?.response?.status === 401) {
        throw new Error('Authentication failed. Please sign in again.');
      }
      if (error?.response?.status === 403) {
        throw new Error('Access denied. You do not have permission to update this dispute.');
      }
      
      throw new Error(`Failed to update dispute status: ${error?.message || 'Unknown error'}`);
    }
  }

  // Resolve dispute
  async resolveDispute(disputeId: string, resolution: string, action: 'release' | 'refund' | 'hold'): Promise<Dispute> {
    try {
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }
      
      const token = await this.getAuthToken();
      
      const response = await axios.patch(`${this.baseURL}/disputes/${disputeId}/resolve`, {
        resolution,
        action,
        resolvedAt: new Date().toISOString()
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'active-role': 'ADMIN'
        }
      });
      
      return response.data.data;
      
    } catch (error: any) {
      console.error('Error resolving dispute:', error);
      
      if (error?.response?.status === 404) {
        throw new Error('Dispute not found.');
      }
      if (error?.response?.status === 400) {
        throw new Error('Invalid resolution data.');
      }
      if (error?.response?.status === 401) {
        throw new Error('Authentication failed. Please sign in again.');
      }
      if (error?.response?.status === 403) {
        throw new Error('Access denied. You do not have permission to resolve this dispute.');
      }
      
      throw new Error(`Failed to resolve dispute: ${error?.message || 'Unknown error'}`);
    }
  }

  // Get dispute statistics
  async getDisputeStats(): Promise<{
    total: number;
    open: number;
    underReview: number;
    resolved: number;
    refunded: number;
    totalAmount: number;
  }> {
    try {
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }
      
      const token = await this.getAuthToken();
      
      const response = await axios.get(`${this.baseURL}/disputes/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'active-role': 'ADMIN'
        }
      });
      
      return response.data.data || {
        total: 0,
        open: 0,
        underReview: 0,
        resolved: 0,
        refunded: 0,
        totalAmount: 0
      };
      
    } catch (error: any) {
      console.error('Error fetching dispute stats:', error);
      
      // Return default stats if endpoint not available
      return {
        total: 0,
        open: 0,
        underReview: 0,
        resolved: 0,
        refunded: 0,
        totalAmount: 0
      };
    }
  }

  // Get auth token from Firebase
  private async getAuthToken(): Promise<string> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user found');
      }
      
      const token = await user.getIdToken();
      if (!token) {
        throw new Error('Failed to get ID token');
      }
      
      return token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      throw new Error('Authentication failed. Please sign in again.');
    }
  }
}

export const disputesService = new DisputesService();
export default disputesService;
