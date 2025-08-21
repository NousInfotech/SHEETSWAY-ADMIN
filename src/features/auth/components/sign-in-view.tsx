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

const SignInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' })
});

type SignInFormValues = z.infer<typeof SignInSchema>;

interface SignInViewPageProps {
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export default function SignInViewPage({
  isDark = false,
  onToggleTheme
}: SignInViewPageProps) {
  const [formData, setFormData] = useState<SignInFormValues>({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState<Record<
    keyof SignInFormValues,
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

    const validationResult = SignInSchema.safeParse(formData);
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
      {/* Left side - Testimonial */}
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

      {/* Right side - Sign In Form */}
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

              {/* Security Notice */}
              <div className={`text-center text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                This is a secure admin portal. Unauthorized access is prohibited.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}










//######################################################################################



// 'use client';

// import { useState } from 'react';
// import { z } from 'zod';
// import {
//   signInWithEmailAndPassword,
//   GoogleAuthProvider,
//   signInWithPopup
// } from 'firebase/auth';
// import { auth } from '@/lib/firebase';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import Image from 'next/image';
// import axios from 'axios';
// // import { BACKEND_URL } from '@/constants/data'; 

// const SignInSchema = z.object({
//   email: z.string().email({ message: 'Please enter a valid email.' }),
//   password: z.string().min(1, { message: 'Password is required.' })
// });

// type SignInFormValues = z.infer<typeof SignInSchema>;

// interface SignInViewPageProps {
//   isDark?: boolean;
//   onToggleTheme?: () => void;
// }

// export default function SignInViewPage({
//   isDark = false,
//   onToggleTheme
// }: SignInViewPageProps) {
//   const [formData, setFormData] = useState<SignInFormValues>({
//     email: '',
//     password: ''
//   });
//   const [formErrors, setFormErrors] = useState<Record<
//     keyof SignInFormValues,
//     string | undefined
//   > | null>(null);
//   const [apiError, setApiError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // This function is structured correctly based on the middlewares from backend.
//   // It provides the two required headers for your backend to process.
//   const authenticateAndVerify = async (user: any) => {
//     const idToken = await user.getIdToken();
//     const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admins/admin`;
    
//     await axios.get(backendUrl, {
//       headers: {
//         'Authorization': `Bearer ${idToken}`,
//         'active-role': 'ADMIN'
//       }
//     });

//     router.push('/dashboard/overview');
//   };

//   const handleSignIn = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setApiError('');
//     setFormErrors(null);

//     const validationResult = SignInSchema.safeParse(formData);
//     if (!validationResult.success) {
//       const errors = validationResult.error.flatten().fieldErrors;
//       setFormErrors({ email: errors.email?.[0], password: errors.password?.[0] });
//       return;
//     }

//     setLoading(true);
//     try {
//       const { email, password } = validationResult.data;
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       await authenticateAndVerify(userCredential.user);

//     } catch (err: any) {


//       // --- ENHANCED ERROR HANDLING ---
//       if (axios.isAxiosError(err) && err.response) {
//         // This is an error from YOUR backend.
//         console.error("Backend Error:", err.response.data);
//         console.error("Status Code:", err.response.status);
//         // Display the specific message from your backend's sendError function.
//         setApiError(err.response.data.message || 'An error occurred during verification.');
//       } else if (err.code) {
//         // This is an error from Firebase Authentication itself.
//         console.error("Firebase Auth Error:", err.code);
//         setApiError('Invalid email or password.');
//       } else {
//         // A generic network or other unexpected error.
//         console.error("Generic Error:", err);
//         setApiError('An unexpected error occurred. Please check the console.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     setLoading(true);
//     setApiError('');
//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       await authenticateAndVerify(result.user);

//     } catch (err: any) {
//       // --- ENHANCED ERROR HANDLING  ---
//       if (axios.isAxiosError(err) && err.response) {
//         console.error("Backend Error (Google Sign-In):", err.response.data);
//         console.error("Status Code (Google Sign-In):", err.response.status);
//         setApiError(err.response.data.message || 'Could not verify your Google session.');
//       } else {
//         console.error("Generic Error (Google Sign-In):", err);
//         setApiError(err.message || 'An unexpected error occurred during Google sign-in.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
    
//     <div className={`flex min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
//       {/* Left side - Testimonial */}
//       <div
//         className={`hidden lg:flex lg:w-1/2 ${isDark ? 'bg-black' : 'bg-black'} flex-col justify-between p-12`}
//       >
//         <div className='flex items-center space-x-3'>
//           <Image
//             src={'/assets/sheetswaylogo.png'}
//             alt='Sheetsway Logo'
//             width={180}
//             height={40}
//             priority
//             className='object-contain'
//           />
//         </div>
//         <div className='space-y-6'>
//           <blockquote className='text-lg leading-relaxed text-white'>
//             “Shadcn UI Kit for Figma has completely transformed our design
//             process. It's incredibly intuitive and saves us so much time.
//             The components are beautifully crafted and customizable.”
//           </blockquote>
//           <div className='flex items-center space-x-4'>
//             <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500'>
//               <span className='text-sm font-semibold text-white'>ST</span>
//             </div>
//             <div>
//               <div className='font-semibold text-white'>Sarah Thompson</div>
//               <div className='text-sm text-gray-400'>
//                 Lead UX Designer at BrightWave Solutions
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className='text-sm text-gray-500'>
//           © 2024 ShadcnUI. All rights reserved.
//         </div>
//       </div>

//       {/* Right side - Sign In Form */}
//       <div
//         className={`flex flex-1 flex-col ${isDark ? 'bg-gray-950' : 'bg-white'} relative`}
//       >
//         <div className='flex flex-1 items-center justify-center p-8'>
//           <div className='w-full max-w-md space-y-6'>
//             <div className='space-y-2 text-center'>
//               <h1
//                 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
//               >
//                 Sign in
//               </h1>
//               <p
//                 className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
//               >
//                 Log in to unlock tailored content and stay connected with your
//                 community.
//               </p>
//             </div>
//             <form onSubmit={handleSignIn} className='space-y-4'>
//               <div className='space-y-2'>
//                 <label
//                   htmlFor='email'
//                   className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
//                 >
//                   Email
//                 </label>
//                 <Input
//                   id='email'
//                   name='email'
//                   type='email'
//                   placeholder='Enter your email'
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   disabled={loading}
//                   className={`${isDark ? 'border-gray-700 bg-black text-white placeholder-gray-500' : 'border-gray-300 bg-white text-gray-900'}`}
//                 />
//                 {formErrors?.email && (
//                   <p className='text-sm text-red-500'>{formErrors.email}</p>
//                 )}
//               </div>
//               <div className='space-y-2'>
//                 <div className='flex items-center justify-between'>
//                   <label
//                     htmlFor='password'
//                     className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
//                   >
//                     Password
//                   </label>
//                   <Link
//                     href='/forgot-password'
//                     className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} underline`}
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>
//                 <Input
//                   id='password'
//                   name='password'
//                   type='password'
//                   placeholder='Enter your password'
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   disabled={loading}
//                   className={`${isDark ? 'border-gray-700 bg-black text-white placeholder-gray-500' : 'border-gray-300 bg-white text-gray-900'}`}
//                 />
//                 {formErrors?.password && (
//                   <p className='text-sm text-red-500'>{formErrors.password}</p>
//                 )}
//               </div>
//               {apiError && (
//                 <div className='text-center text-sm text-red-500'>
//                   {apiError}
//                 </div>
//               )}
//               <Button
//                 type='submit'
//                 className='w-full bg-white text-black hover:bg-gray-100'
//                 disabled={loading}
//               >
//                 {loading ? 'Signing in...' : 'Sign in'}
//               </Button>
//               <div className='relative my-6'>
//                 <div className='absolute inset-0 flex items-center'>
//                   <span
//                     className={`w-full border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}
//                   />
//                 </div>
//                 <div className='relative flex justify-center text-xs uppercase'>
//                   <span
//                     className={`${isDark ? 'bg-gray-950 text-gray-400' : 'bg-white text-gray-500'} px-2`}
//                   >
//                     OR CONTINUE WITH
//                   </span>
//                 </div>
//               </div>
//               <Button
//                 type='button'
//                 variant='outline'
//                 onClick={handleGoogleSignIn}
//                 disabled={loading}
//                 className={`w-full flex items-center justify-center gap-2 ${isDark ? 'border-gray-700 bg-black text-white hover:bg-gray-800' : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-900'}`}
//               >
//                 <svg className='h-5 w-5' viewBox='0 0 24 24'>
//                   <path
//                     fill='#4285F4'
//                     d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
//                   />
//                   <path
//                     fill='#34A853'
//                     d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
//                   />
//                   <path
//                     fill='#FBBC05'
//                     d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
//                   />
//                   <path
//                     fill='#EA4335'
//                     d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
//                   />
//                 </svg>
//                 <span>Continue with Google</span>
//               </Button>
//               <div
//                 className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
//               >
//                 Don't have an account?{' '}
//                 <Link
//                   href='/auth/sign-up'
//                   className={`font-medium ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'} underline`}
//                 >
//                   Sign up
//                 </Link>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }