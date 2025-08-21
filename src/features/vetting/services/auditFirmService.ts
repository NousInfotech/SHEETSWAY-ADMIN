import axios from 'axios';
import { BACKEND_URL } from '@/constants/data';
import { auth } from '@/lib/firebase';

/**
 * AUDIT FIRM VETTING SERVICE
 * 
 * This service provides comprehensive audit firm and auditor management functionality.
 * 
 * CURRENT STATUS: Connected to backend API endpoints
 * 
 * BACKEND ENDPOINTS:
 * - GET /api/v1/auditors/audit-firm/data - Get all audit firms
 * - GET /api/v1/auditors/audit-firm/:firmId - Get specific audit firm
 * - GET /api/v1/auditors - Get all auditors
 * - PATCH /api/v1/auditors/audit-firm/:firmId/status - Update firm status
 * - PATCH /api/v1/auditors/:auditorId/status - Update auditor status
 */



export interface AuditFirm {
  id: string;
  name: string;
  licenseNumber: string;
  registeredOn: string;
  registeredIn: string;
  operatingCountries: string[];
  firmSize: string;
  languages: string[];
  specialties: string[];
  stripeAccountId?: string;
  payoutCurrency?: string;
  portfolioLinks: string[];
  supportingDocs: string[];
  auditors: Auditor[];
  createdAt: string;
  updatedAt: string;
}

export interface Auditor {
  id: string;
  name: string;
  licenseNumber: string;
  yearsExperience: number;
  specialties: string[];
  languages: string[];
  avgResponseTime?: number;
  avgCompletion?: number;
  successCount: number;
  rating: number;
  reviewsCount: number;
  portfolioLinks: string[];
  supportingDocs: string[];
  accountStatus: string;
  vettedStatus: 'NOT_APPLIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  stripeAccountId?: string;
  payoutCurrency?: string;
  auditFirmId?: string; // Add this field to match backend data
  createdAt: string;
  updatedAt: string;
}

export interface AuditFirmStatusUpdate {
  firmId: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED' | 'BANNED';
  reason?: string;
}

class AuditFirmService {
  private baseURL = `${BACKEND_URL}/api/v1`;

  // Get all audit firms
  async getAllAuditFirms(): Promise<AuditFirm[]> {
    try {
      // Check if user is authenticated
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }
      
      const token = await this.getAuthToken();
      
      // First, get all auditors
      const auditorsResponse = await axios.get(`${this.baseURL}/auditors`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'active-role': 'ADMIN'
        }
      });
      
      const auditors = auditorsResponse.data.data || [];
      
      // Group auditors by audit firm ID to create audit firm objects
      const auditFirmMap = new Map<string, AuditFirm>();
      
      auditors.forEach((auditor: any) => {
        const firmId = auditor.auditFirmId || 'unknown';
        
        if (!auditFirmMap.has(firmId)) {
          // Create a new audit firm entry
          auditFirmMap.set(firmId, {
            id: firmId,
            name: auditor.auditFirmName || `Audit Firm ${firmId}`,
            licenseNumber: auditor.auditFirmLicenseNumber || 'N/A',
            registeredOn: auditor.auditFirmRegisteredOn || new Date().toISOString(),
            registeredIn: auditor.auditFirmRegisteredIn || 'Unknown',
            operatingCountries: auditor.auditFirmOperatingCountries || [],
            firmSize: auditor.auditFirmSize || 'MEDIUM',
            languages: auditor.auditFirmLanguages || ['English'],
            specialties: auditor.auditFirmSpecialties || [],
            stripeAccountId: auditor.auditFirmStripeAccountId,
            payoutCurrency: auditor.auditFirmPayoutCurrency,
            portfolioLinks: auditor.auditFirmPortfolioLinks || [],
            supportingDocs: auditor.auditFirmSupportingDocs || [],
            auditors: [],
            createdAt: auditor.auditFirmCreatedAt || new Date().toISOString(),
            updatedAt: auditor.auditFirmUpdatedAt || new Date().toISOString()
          });
        }
        
        // Add auditor to the firm
        const firm = auditFirmMap.get(firmId)!;
        firm.auditors.push({
          id: auditor.id,
          name: auditor.name,
          licenseNumber: auditor.licenseNumber,
          yearsExperience: auditor.yearsExperience || 0,
          specialties: auditor.specialties || [],
          languages: auditor.languages || [],
          avgResponseTime: auditor.avgResponseTime,
          avgCompletion: auditor.avgCompletion,
          successCount: auditor.successCount || 0,
          rating: auditor.rating || 0,
          reviewsCount: auditor.reviewsCount || 0,
          portfolioLinks: auditor.portfolioLinks || [],
          supportingDocs: auditor.supportingDocs || [],
          accountStatus: auditor.accountStatus || 'ACTIVE',
          vettedStatus: auditor.vettedStatus || 'NOT_APPLIED',
          stripeAccountId: auditor.stripeAccountId,
          payoutCurrency: auditor.payoutCurrency,
          auditFirmId: auditor.auditFirmId, // Add this line
          createdAt: auditor.createdAt || new Date().toISOString(),
          updatedAt: auditor.updatedAt || new Date().toISOString()
        });
      });
      
      return Array.from(auditFirmMap.values());
      
    } catch (error: any) {
      console.error('Error fetching audit firms:', error);
      
      // Handle specific error types
      if (error?.response?.status === 404) {
        throw new Error('Audit firms endpoint not found. Please check if the backend is running.');
      }
      if (error?.response?.status === 401) {
        throw new Error('Authentication failed. Please sign in again.');
      }
      if (error?.response?.status === 403) {
        throw new Error('Access denied. You do not have permission to view audit firms.');
      }
      if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
        throw new Error('Cannot connect to backend server. Please check if the server is running.');
      }
      if (error instanceof Error && error.message.includes('authentication')) {
        throw error;
      }
      
      throw new Error(`Failed to fetch audit firms: ${error?.message || 'Unknown error'}`);
    }
  }

  // Get audit firm by ID
  async getAuditFirm(firmId: string): Promise<AuditFirm> {
    try {
      const token = await this.getAuthToken();
      
      const response = await axios.get(`${this.baseURL}/auditors/audit-firm/${firmId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'active-role': 'ADMIN'
        }
      });
      return response.data.data;
      
    } catch (error) {
      console.error('Error fetching audit firm:', error);
      throw new Error('Failed to fetch audit firm');
    }
  }

  // Get all auditors (including their audit firm info)
  async getAllAuditors(): Promise<Auditor[]> {
    try {
      // Check if user is authenticated
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }
      
      const token = await this.getAuthToken();
      
      const response = await axios.get(`${this.baseURL}/auditors`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'active-role': 'ADMIN'
        }
      });
      
      const auditors = response.data.data || [];
      
      // Transform and validate the auditor data
      return auditors.map((auditor: any) => ({
        id: auditor.id || 'unknown',
        name: auditor.name || 'Unknown Auditor',
        licenseNumber: auditor.licenseNumber || 'N/A',
        yearsExperience: auditor.yearsExperience || 0,
        specialties: Array.isArray(auditor.specialties) ? auditor.specialties : [],
        languages: Array.isArray(auditor.languages) ? auditor.languages : ['English'],
        avgResponseTime: auditor.avgResponseTime || null,
        avgCompletion: auditor.avgCompletion || null,
        successCount: auditor.successCount || 0,
        rating: auditor.rating || 0,
        reviewsCount: auditor.reviewsCount || 0,
        portfolioLinks: Array.isArray(auditor.portfolioLinks) ? auditor.portfolioLinks : [],
        supportingDocs: Array.isArray(auditor.supportingDocs) ? auditor.supportingDocs : [],
        accountStatus: auditor.accountStatus || 'ACTIVE',
        vettedStatus: auditor.vettedStatus || 'NOT_APPLIED',
        stripeAccountId: auditor.stripeAccountId || null,
        payoutCurrency: auditor.payoutCurrency || null,
        auditFirmId: auditor.auditFirmId || null, // Add this line
        createdAt: auditor.createdAt || new Date().toISOString(),
        updatedAt: auditor.updatedAt || new Date().toISOString()
      }));
      
    } catch (error: any) {
      console.error('Error fetching auditors:', error);
      
      // Handle specific error types
      if (error?.response?.status === 404) {
        throw new Error('Auditors endpoint not found. Please check if the backend is running.');
      }
      if (error?.response?.status === 401) {
        throw new Error('Authentication failed. Please sign in again.');
      }
      if (error?.response?.status === 403) {
        throw new Error('Access denied. You do not have permission to view auditors.');
      }
      if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
        throw new Error('Cannot connect to backend server. Please check if the server is running.');
      }
      if (error instanceof Error && error.message.includes('authentication')) {
        throw error;
      }
      
      throw new Error(`Failed to fetch auditors: ${error?.message || 'Unknown error'}`);
    }
  }

  // Change audit firm status
  async changeAuditFirmStatus(updateData: AuditFirmStatusUpdate): Promise<void> {
    try {
      const token = await this.getAuthToken();
      await axios.patch(`${this.baseURL}/auditors/audit-firm/${updateData.firmId}/status`, {
        status: updateData.status,
        reason: updateData.reason
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'active-role': 'ADMIN'
        }
      });
    } catch (error) {
      console.error('Error updating audit firm status:', error);
      throw new Error('Failed to update audit firm status');
    }
  }

  // Change auditor status
  async changeAuditorStatus(auditorId: string, status: string, reason?: string): Promise<void> {
    try {
      const token = await this.getAuthToken();
      await axios.patch(`${this.baseURL}/auditors/${auditorId}/status`, {
        vettedStatus: status,
        reason: reason
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'active-role': 'ADMIN'
        }
      });
    } catch (error) {
      console.error('Error updating auditor status:', error);
      throw new Error('Failed to update auditor status');
    }
  }

  // Get audit firms by status
  async getAuditFirmsByStatus(status: string): Promise<AuditFirm[]> {
    try {
      const token = await this.getAuthToken();
      
      const response = await axios.get(`${this.baseURL}/auditors/audit-firm/data?status=${status}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'active-role': 'ADMIN'
        }
      });
      return response.data.data || [];
      
    } catch (error) {
      console.error('Error fetching audit firms by status:', error);
      throw new Error('Failed to fetch audit firms by status');
    }
  }

  // Get auditors by vetted status
  async getAuditorsByVettedStatus(status: string): Promise<Auditor[]> {
    try {
      const token = await this.getAuthToken();
      
      const response = await axios.get(`${this.baseURL}/auditors?vettedStatus=${status}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'active-role': 'ADMIN'
        }
      });
      return response.data.data || [];
      
    } catch (error) {
      console.error('Error fetching auditors by vetted status:', error);
      throw new Error('Failed to fetch auditors by vetted status');
    }
  }

  // Search audit firms
  async searchAuditFirms(searchTerm: string): Promise<AuditFirm[]> {
    try {
      const token = await this.getAuthToken();
      
      const response = await axios.get(`${this.baseURL}/auditors/search/${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'active-role': 'ADMIN'
        }
      });
      return response.data.data || [];
      
    } catch (error: any) {
      console.error('Error searching audit firms:', error);
      
      // Handle specific error types
      if (error?.response?.status === 404) {
        throw new Error('Search endpoint not found. Please check if the backend is running.');
      }
      if (error?.response?.status === 401) {
        throw new Error('Authentication failed. Please sign in again.');
      }
      if (error?.response?.status === 403) {
        throw new Error('Access denied. You do not have permission to search audit firms.');
      }
      if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
        throw new Error('Cannot connect to backend server. Please check if the server is running.');
      }
      
      throw new Error(`Failed to search audit firms: ${error?.message || 'Unknown error'}`);
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

export const auditFirmService = new AuditFirmService();
export default auditFirmService;
