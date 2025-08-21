'use client';
import { useState } from 'react';
import { z } from 'zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { BACKEND_URL } from '@/constants/data';

const AdminSignInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' })
});

type AdminSignInFormValues = z.infer<typeof AdminSignInSchema>;

interface AdminSignInViewPageProps {
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export default function AdminSignInViewPage({
  isDark = false,
  onToggleTheme
}: AdminSignInViewPageProps) {
  const [formData, setFormData] = useState<AdminSignInFormValues>({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState<Record<
    keyof AdminSignInFormValues,
    string | undefined
  > | null>(null);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Authenticate with Firebase and verify admin role with backend
  const authenticateAndVerifyAdmin = async (user: any) => {
    const idToken = await user.getIdToken();
    const backendUrl = `${BACKEND_URL}/api/v1/admins/admin`;
    
    try {
      await axios.get(backendUrl, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'active-role': 'ADMIN'
        }
      });
      
      // Store admin info in localStorage or context
      localStorage.setItem('adminRole', 'ADMIN');
      localStorage.setItem('adminId', user.uid);
      
      router.push('/dashboard/overview');
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 403) {
          throw new Error('Access denied. Admin role required.');
        } else if (error.response.status === 404) {
          throw new Error('Admin profile not found.');
        } else {
          throw new Error(error.response.data?.message || 'Admin verification failed.');
        }
      }
      throw new Error('Failed to verify admin access.');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setFormErrors(null);

    const validationResult = AdminSignInSchema.safeParse(formData);
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      setFormErrors({ 
        email: errors.email?.[0], 
        password: errors.password?.[0] 
      });
      return;
    }

    setLoading(true);
    try {
      const { email, password } = validationResult.data;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await authenticateAndVerifyAdmin(userCredential.user);
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setApiError(err.response.data?.message || 'Admin verification failed.');
      } else if (err.code) {
        // Firebase Auth errors
        switch (err.code) {
          case 'auth/user-not-found':
            setApiError('No account found with this email.');
            break;
          case 'auth/wrong-password':
            setApiError('Incorrect password.');
            break;
          case 'auth/invalid-email':
            setApiError('Invalid email format.');
            break;
          case 'auth/too-many-requests':
            setApiError('Too many failed attempts. Please try again later.');
            break;
          default:
            setApiError(err.message || 'Authentication failed.');
        }
      } else {
        setApiError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
      {/* Left side - Admin Panel Info */}
      <div
        className={`hidden lg:flex lg:w-1/2 ${isDark ? 'bg-black' : 'bg-black'} flex-col justify-between p-12`}
      >
        <div className='flex items-center space-x-3'>
          <Image
            src={'/assets/sheetswaylogo.png'}
            alt='Sheetsway Logo'
            width={180}
            height={40}
            priority
            className='object-contain'
          />
        </div>

        {/* Admin Panel Description */}
        <div className='space-y-6'>
          <div className='space-y-4'>
            <h2 className='text-2xl font-bold text-white'>Admin Panel</h2>
            <p className='text-lg leading-relaxed text-gray-300'>
              Access the comprehensive admin dashboard to manage auditors, 
              monitor compliance, oversee engagements, and maintain system integrity.
            </p>
          </div>

          <div className='space-y-3'>
            <div className='flex items-center space-x-3 text-white'>
              <div className='h-2 w-2 rounded-full bg-green-400'></div>
              <span>Auditor Vetting & Management</span>
            </div>
            <div className='flex items-center space-x-3 text-white'>
              <div className='h-2 w-2 rounded-full bg-blue-400'></div>
              <span>Compliance Monitoring</span>
            </div>
            <div className='flex items-center space-x-3 text-white'>
              <div className='h-2 w-2 rounded-full bg-purple-400'></div>
              <span>System Administration</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='text-sm text-gray-500'>
          © 2024 Sheetsway. Admin access only.
        </div>
      </div>

      {/* Right side - Admin Sign In Form */}
      <div
        className={`flex flex-1 flex-col ${isDark ? 'bg-gray-950' : 'bg-white'} relative`}
      >
        {/* Theme Toggle Button */}
        {onToggleTheme && (
          <div className='absolute top-6 right-6'>
            <Button
              variant='ghost'
              size='icon'
              onClick={onToggleTheme}
              className={`${isDark ? 'text-white hover:bg-gray-800' : 'text-gray-900 hover:bg-gray-100'}`}
            >
              {isDark ? (
                <svg
                  className='h-5 w-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
                  />
                </svg>
              ) : (
                <svg
                  className='h-5 w-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
                  />
                </svg>
              )}
            </Button>
          </div>
        )}

        {/* Form Container */}
        <div className='flex flex-1 items-center justify-center p-8'>
          <div className='w-full max-w-md space-y-6'>
            {/* Header */}
            <div className='space-y-2 text-center'>
              <h1
                className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                Admin Sign In
              </h1>
              <p
                className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Access the admin dashboard with your credentials.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignIn} className='space-y-4'>
              {/* Email Input */}
              <div className='space-y-2'>
                <label
                  htmlFor='email'
                  className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  Email
                </label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='Enter admin email'
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className={`w-full h-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark 
                      ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:bg-gray-700' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:bg-white'
                  }`}
                />
                {formErrors?.email && (
                  <p className='text-sm text-red-500'>{formErrors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className='space-y-2'>
                <label
                  htmlFor='password'
                  className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  Password
                </label>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  placeholder='Enter admin password'
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className={`w-full h-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark 
                      ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:bg-gray-700' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:bg-white'
                  }`}
                />
                {formErrors?.password && (
                  <p className='text-sm text-red-500'>{formErrors.password}</p>
                )}
              </div>

              {/* Error Message */}
              {apiError && (
                <div className='text-center text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800'>
                  {apiError}
                </div>
              )}

              {/* Sign In Button */}
              <Button
                type='submit'
                className="w-full bg-white text-black hover:bg-gray-100"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Admin Sign In'}
              </Button>
            </form>

            {/* Security Notice */}
            <div className={`text-center text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              This is a secure admin portal. Unauthorized access is prohibited.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
