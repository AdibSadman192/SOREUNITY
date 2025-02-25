import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        async get(name: string): Promise<string | undefined> {
          return (await cookieStore).get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions): Promise<void> {
          try {
            (await cookieStore).set({ name, value, ...options });
          } catch (error) {
            // Handle cookie setting error
          }
        },
        async remove(name: string, options: CookieOptions): Promise<void> {
          try {
            (await cookieStore).set({ name, value: '', ...options });
          } catch (error) {
            // Handle cookie removal error
          }
        },
      },
    }
  );
}