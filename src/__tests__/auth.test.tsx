import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import SignIn from '../app/auth/signin/page';
import { supabase } from '../lib/supabase/client';
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock Supabase client
jest.mock('../lib/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
    },
  },
}));

describe('SignIn Component', () => {
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should handle successful login for manager user', async () => {
    const mockSession = {
      data: {
        session: {
          user: {
            email: 'skillshare20020@gmail.com',
            user_metadata: { role: 'manager' },
          },
        },
      },
      error: null,
    };

    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce(mockSession);

    render(<SignIn />);

    // Fill in the login form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'skillshare20020@gmail.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'kirebhai' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Verify redirect to manager dashboard
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/manager');
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  it('should handle invalid credentials', async () => {
    const mockError = {
      data: { session: null },
      error: { message: 'Invalid login credentials' },
    };

    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce(mockError);

    render(<SignIn />);

    // Fill in the login form with invalid credentials
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@email.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });

  it('should handle session check on component mount', async () => {
    const mockSession = {
      data: {
        session: {
          user: {
            email: 'skillshare20020@gmail.com',
            user_metadata: { role: 'staff' },
          },
        },
      },
    };

    (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce(mockSession);
    (supabase.auth.getUser as jest.Mock).mockResolvedValueOnce({
      data: { user: mockSession.data.session.user },
    });

    render(<SignIn />);

    // Verify redirect if session exists
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/staff');
    });
  });
});