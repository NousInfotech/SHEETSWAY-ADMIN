import { BACKEND_URL } from '../../../constants/data';
import { auth } from '../../../lib/firebase';
import type { 
  Payment, 
  PaymentWithEscrow, 
  PaymentFilter, 
  PaymentStats 
} from '../types';

class PaymentService {
  private baseURL = `${BACKEND_URL}/api/v1`;

  // Helper method to get authenticated headers
  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      // Get current Firebase user
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        console.warn('🔐 No authenticated user found');
        throw new Error('User not authenticated');
      }

      // Get fresh ID token
      const idToken = await currentUser.getIdToken();
      
      // Get admin role from localStorage (set during login)
      const adminRole = localStorage.getItem('adminRole');
      
      if (!adminRole) {
        console.warn('🔐 No admin role found in localStorage');
        throw new Error('Admin role not found');
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
        'active-role': adminRole
      };

      console.log('🔐 Auth Headers:', {
        hasToken: !!idToken,
        tokenLength: idToken?.length,
        role: adminRole,
        headers
      });

      return headers;
    } catch (error) {
      console.error('🔐 Error getting auth headers:', error);
      throw new Error('Authentication failed');
    }
  }

  // Get all payments with optional filters
  async getPayments(filters?: PaymentFilter): Promise<Payment[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.paymentMethod) queryParams.append('paymentMethod', filters.paymentMethod);
      if (filters?.engagementId) queryParams.append('engagementId', filters.engagementId);
      if (filters?.role) queryParams.append('role', filters.role);
      if (filters?.roleId) queryParams.append('roleId', filters.roleId);
      
      if (filters?.dateRange) {
        queryParams.append('startDate', filters.dateRange.start);
        queryParams.append('endDate', filters.dateRange.end);
      }
      
      if (filters?.amountRange) {
        queryParams.append('minAmount', filters.amountRange.min.toString());
        queryParams.append('maxAmount', filters.amountRange.max.toString());
      }

      const response = await fetch(`${this.baseURL}/payments?${queryParams.toString()}`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  }

  // Get a single payment by ID
  async getPaymentById(paymentId: string): Promise<Payment | null> {
    try {
      const response = await fetch(`${this.baseURL}/payments/${paymentId}`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  }

  // Get payments by role and role ID
  async getPaymentsByRoleId(role: 'USER' | 'AUDITFIRM', roleId: string): Promise<Payment[]> {
    try {
      const response = await fetch(`${this.baseURL}/payments/by-role/filter?role=${role}&roleId=${roleId}`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching payments by role:', error);
      throw error;
    }
  }

  // Get escrow statuses with payments (from engagement routes)
  async getEscrowStatusesWithPayments(filters?: PaymentFilter): Promise<PaymentWithEscrow[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.engagementId) queryParams.append('engagementId', filters.engagementId);
      
      if (filters?.dateRange) {
        queryParams.append('startDate', filters.dateRange.start);
        queryParams.append('endDate', filters.dateRange.end);
      }

      const response = await fetch(`${this.baseURL}/engagements/escrow/payments/?${queryParams.toString()}`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 500) {
          console.error('Backend server error (500)');
          return []; // Return empty array instead of throwing error
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching escrow statuses with payments:', error);
      // Return empty array for any other errors to prevent UI crashes
      return [];
    }
  }

  // Get payment by escrow ID
  async getPaymentByEscrowId(escrowId: string): Promise<Payment | null> {
    try {
      const response = await fetch(`${this.baseURL}/engagements/escrow/${escrowId}/payment`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error('Error fetching payment by escrow ID:', error);
      throw error;
    }
  }

  // Calculate payment statistics
  calculatePaymentStats(payments: Payment[]): PaymentStats {
    const totalPayments = payments.length;
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const currency = payments[0]?.currency || 'USD';
    
    const statusCounts = payments.reduce((acc, payment) => {
      acc[payment.status] = (acc[payment.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averagePaymentValue = totalPayments > 0 ? totalAmount / totalPayments : 0;

    return {
      totalPayments,
      totalAmount,
      currency,
      pendingPayments: statusCounts.pending || 0,
      successfulPayments: statusCounts.succeeded || 0,
      failedPayments: statusCounts.failed || 0,
      refundedPayments: statusCounts.refunded || 0,
      averagePaymentValue,
    };
  }
}

export const paymentService = new PaymentService();
