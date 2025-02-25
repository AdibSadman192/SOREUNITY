'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface AuthError {
  message: string;
}

interface SignInFormData {
  email: string;
  password: string;
}

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthenticationStatus();
  }, [router]);

  const checkAuthenticationStatus = async () => {
    try {
      const response = await supabase.auth.getSession();
      const session = response?.data?.session;
      
      if (session?.user) {
        const role = session.user.user_metadata?.role || 'staff';
        const dashboardPath = role === 'manager' ? '/dashboard/manager' : '/dashboard/staff';
        await router.push(dashboardPath);
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
  };

  const handleRoleBasedRedirect = async (role: string) => {
    const roleRoutes = {
      manager: '/dashboard/manager',
      staff: '/dashboard/staff',
      default: '/dashboard'
    };
    const route = roleRoutes[role as keyof typeof roleRoutes] || roleRoutes.default;
    await router.push(route);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password');
      return false;
    }
    return true;
  };

  const handleAuthError = (error: AuthError) => {
    const errorMessages = {
      'Invalid login credentials': 'Invalid email or password',
      'Email not confirmed': 'Please verify your email before signing in'
    };
    const message = errorMessages[error.message as keyof typeof errorMessages] || error.message || 'Failed to sign in';
    toast.error(message);
    setError(message);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    const loadingToast = toast.loading('Signing in...');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        toast.dismiss(loadingToast);
        handleAuthError(authError);
        return;
      }

      if (data?.session) {
        const role = data.session.user.user_metadata?.role || 'staff';
        toast.dismiss(loadingToast);
        toast.success('Successfully signed in!');

        try {
          const dashboardPath = role === 'manager' ? '/dashboard/manager' : '/dashboard/staff';
          await router.push(dashboardPath);
          router.refresh();
        } catch (routerError) {
          console.error('Navigation error:', routerError);
          toast.error('Failed to redirect to dashboard');
          await router.push('/dashboard');
        }
      } else {
        toast.dismiss(loadingToast);
        toast.error('No session created after login');
        setError('Authentication failed');
      }
    } catch (err: any) {
      toast.dismiss(loadingToast);
      console.error('Sign in error:', err);
      setError(err.message || 'An error occurred during sign in');
      toast.error(err.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}