// 'use client';
// import { useState } from 'react';
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

// interface SignInViewPageProps {
//   isDark?: boolean;
//   onToggleTheme?: () => void;
// }

// export default function SignInViewPage({
//   isDark = false,
//   onToggleTheme
// }: SignInViewPageProps) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleSignIn = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       router.push('/dashboard/overview');
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const provider = new GoogleAuthProvider();
//       await signInWithPopup(auth, provider);
//       router.push('/dashboard/overview');
//     } catch (err: any) {
//       setError(err.message);
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
//             src={'/assets/maltaxplorelogo.svg'}
//             alt='Sheetsway Logo'
//             width={180}
//             height={40}
//             priority
//             className='object-contain'
//           />
//         </div>

//         {/* Testimonial */}
//         <div className='space-y-6'>
//           <blockquote className='text-lg leading-relaxed text-white'>
//             &ldquo;Shadcn UI Kit for Figma has completely transformed our design
//             process. It&apos;s incredibly intuitive and saves us so much time.
//             The components are beautifully crafted and customizable.&rdquo;
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

//         {/* Footer */}
//         <div className='text-sm text-gray-500'>
//           © 2024 ShadcnUI. All rights reserved.
//         </div>
//       </div>

//       {/* Right side - Sign In Form */}
//       <div
//         className={`flex flex-1 flex-col ${isDark ? 'bg-gray-950' : 'bg-white'} relative`}
//       >
//         {/* Theme Toggle Button */}
//         {onToggleTheme && (
//           <div className='absolute top-6 right-6'>
//             <Button
//               variant='ghost'
//               size='icon'
//               onClick={onToggleTheme}
//               className={`${isDark ? 'text-white hover:bg-gray-800' : 'text-gray-900 hover:bg-gray-100'}`}
//             >
//               {isDark ? (
//                 <svg
//                   className='h-5 w-5'
//                   fill='none'
//                   stroke='currentColor'
//                   viewBox='0 0 24 24'
//                 >
//                   <path
//                     strokeLinecap='round'
//                     strokeLinejoin='round'
//                     strokeWidth={2}
//                     d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
//                   />
//                 </svg>
//               ) : (
//                 <svg
//                   className='h-5 w-5'
//                   fill='none'
//                   stroke='currentColor'
//                   viewBox='0 0 24 24'
//                 >
//                   <path
//                     strokeLinecap='round'
//                     strokeLinejoin='round'
//                     strokeWidth={2}
//                     d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
//                   />
//                 </svg>
//               )}
//             </Button>
//           </div>
//         )}

//         {/* Form Container */}
//         <div className='flex flex-1 items-center justify-center p-8'>
//           <div className='w-full max-w-md space-y-6'>
//             {/* Header */}
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

//             {/* Form */}
//             <form onSubmit={handleSignIn} className='space-y-4'>
//               {/* Email Input */}
//               <div className='space-y-2'>
//                 <label
//                   htmlFor='email'
//                   className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
//                 >
//                   Email
//                 </label>
//                 <Input
//                   id='email'
//                   type='email'
//                   placeholder='Email or username'
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   disabled={loading}
//                   className={`w-full h-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     isDark 
//                       ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:bg-gray-700' 
//                       : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:bg-white'
//                   }`}
//                 />
//               </div>

//               {/* Password Input */}
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
//                   type='password'
//                   placeholder='Password'
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   disabled={loading}
//                   className={`w-full h-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     isDark 
//                       ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:bg-gray-700' 
//                       : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:bg-white'
//                   }`}
//                 />
//               </div>

//               {/* Error Message */}
//               {error && (
//                 <div className='text-center text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800'>
//                   {error}
//                 </div>
//               )}

//               {/* Sign In Button */}
//               <Button
//                 type='submit'
//                 className="w-full bg-white text-black hover:bg-gray-100"
//                 disabled={loading}
//               >
//                 {loading ? 'Signing in...' : 'Sign in'}
//               </Button>

//               {/* Divider */}
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

//               {/* Google Sign In Button */}
//               <Button
//                 type='button'
//                 variant='outline'
//                 onClick={handleGoogleSignIn}
//                 disabled={loading}
//                 className={`w-full h-10 font-medium rounded-md transition-colors flex items-center justify-center gap-3 ${
//                   isDark 
//                     ? 'border-gray-600 bg-gray-800 text-white hover:bg-gray-700' 
//                     : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
//                 }`}
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
//                 {loading ? 'Signing in...' : 'Continue with Google'}
//               </Button>

//               {/* Sign Up Link */}
//               <div
//                 className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
//               >
//                 Don&apos;t have an account?{' '}
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







//##################################################################################################################


















'use client';

import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Sun,
  Moon,
  Mail,
  Lock,
  Loader2,
  ChromeIcon,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils'; 


const Icons = {
  google: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' {...props}>
      <path
        d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
        fill='#4285F4'
      />
      <path
        d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
        fill='#34A853'
      />
      <path
        d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.63 2.82h.01z'
        fill='#FBBC05'
      />
      <path
        d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
        fill='#EA4335'
      />
      <path d='M1 1h22v22H1z' fill='none' />
    </svg>
  )
};

interface SignInViewPageProps {
  isDark?: boolean; 
  onToggleTheme?: () => void;
}

export default function SignInViewPage({ onToggleTheme }: SignInViewPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard/overview');
    } catch (err: any) {
      setError(
        err.code === 'auth/invalid-credential'
          ? 'Invalid email or password.'
          : 'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/dashboard/overview');
    } catch (err: any) {
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const FADE_IN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950'>
      <div className='relative flex h-full w-full max-w-4xl flex-row overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-black'>
        
        <div className='hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black relative'>
            <div className='absolute inset-0 bg-[url(/assets/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]'></div>
            <div className='relative z-10'>
                <Link href="/" className='flex items-center space-x-3'>
                <Image
                    src={'/assets/maltaxplorelogo.svg'}
                    alt='Company Logo'
                    width={180}
                    height={40}
                    priority
                    className='object-contain'
                />
                </Link>

                <div className='mt-32 space-y-6'>
                <blockquote className='text-2xl leading-relaxed'>
                    “Booking with Malta Explore was the best decision we made. our trip was absolutely seamless.”
                </blockquote>

                <div className='flex items-center space-x-4'>
                    <Image src="https://i.pravatar.cc/48?u=sarah" alt="Avatar" width={48} height={48} className="rounded-full" />
                    <div>
                    <div className='font-semibold'>Sarah Thompson</div>
                    <div className='text-sm text-gray-400'>
                        Traveller Amelia
                    </div>
                    </div>
                </div>
                </div>
            </div>

            <div className='text-sm text-gray-500 relative z-10'>
                © {new Date().getFullYear()} Company Inc. All rights reserved.
            </div>
        </div>


        {/* Right side - Sign In Form */}
        <div className='flex flex-1 flex-col justify-center p-6 sm:p-12 lg:p-14 relative'>
          {onToggleTheme && (
            <div className='absolute top-6 right-6'>
              <Button variant='ghost' size='icon' onClick={onToggleTheme}>
                <Sun className='h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
                <Moon className='absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
                <span className='sr-only'>Toggle theme</span>
              </Button>
            </div>
          )}

          <motion.div
            className='w-full max-w-md'
            initial='hidden'
            animate='show'
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
          >
            <Card className='w-full border-0 bg-transparent shadow-none'>
              <CardHeader className='text-center p-0 mb-8'>
                <motion.div variants={FADE_IN_ANIMATION_VARIANTS}>
                  <CardTitle className='text-3xl font-bold tracking-tight'>
                    Welcome Back
                  </CardTitle>
                </motion.div>
                <motion.div variants={FADE_IN_ANIMATION_VARIANTS}>
                  <CardDescription className='mt-2'>
                    Enter your credentials to access your account.
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent className='space-y-4 p-0'>
                <form onSubmit={handleSignIn} className='space-y-4'>
                  <motion.div
                    variants={FADE_IN_ANIMATION_VARIANTS}
                    className='relative'
                  >
                    <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                    <Input
                      id='email'
                      type='email'
                      placeholder='name@example.com'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading || googleLoading}
                      className='pl-10 h-11'
                    />
                  </motion.div>

                  <motion.div
                    variants={FADE_IN_ANIMATION_VARIANTS}
                    className='relative'
                  >
                    <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                    <Input
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading || googleLoading}
                      className='pl-10 pr-10 h-11'
                    />
                     <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                  </motion.div>

                  <div className='flex items-center justify-end'>
                    <Link
                      href='/forgot-password'
                      className='text-sm font-medium text-primary hover:underline'
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='text-center text-sm font-medium text-red-600 dark:text-red-500'
                    >
                      {error}
                    </motion.p>
                  )}

                  <motion.div variants={FADE_IN_ANIMATION_VARIANTS}>
                    <Button
                      type='submit'
                      className='w-full h-11 text-base'
                      disabled={loading || googleLoading}
                    >
                      {loading && (
                        <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                      )}
                      Sign In
                    </Button>
                  </motion.div>
                </form>

                <div className='relative my-6'>
                  <div className='absolute inset-0 flex items-center'>
                    <span className='w-full border-t' />
                  </div>
                  <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-white px-2 text-muted-foreground dark:bg-black'>
                      Or continue with
                    </span>
                  </div>
                </div>

                <motion.div variants={FADE_IN_ANIMATION_VARIANTS}>
                  <Button
                    variant='outline'
                    type='button'
                    onClick={handleGoogleSignIn}
                    disabled={loading || googleLoading}
                    className='w-full h-11'
                  >
                    {googleLoading ? (
                      <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                    ) : (
                      <Icons.google className='mr-2 h-5 w-5' />
                    )}
                    Google
                  </Button>
                </motion.div>
              </CardContent>
              <CardFooter className='justify-center p-0 mt-8'>
                <motion.p
                  variants={FADE_IN_ANIMATION_VARIANTS}
                  className='text-sm text-muted-foreground'
                >
                  Don't have an account?{' '}
                  <Link
                    href='/auth/sign-up'
                    className='font-semibold text-primary hover:underline'
                  >
                    Sign up
                  </Link>
                </motion.p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}