import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Create a Supabase client for server-side operations
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove: (name, options) => {
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Check if the user is authenticated
    const isAuthenticated = !!session;

    // Define protected routes
    const isProtectedRoute = 
      req.nextUrl.pathname.startsWith('/boxes') ||
      req.nextUrl.pathname.startsWith('/items') ||
      req.nextUrl.pathname.startsWith('/search');

    // Redirect to login if accessing a protected route without authentication
    if (isProtectedRoute && !isAuthenticated) {
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Redirect to home if accessing auth pages while authenticated
    if (isAuthenticated && 
        (req.nextUrl.pathname === '/login' || 
         req.nextUrl.pathname === '/signup' || 
         req.nextUrl.pathname === '/reset-password')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  } catch (error) {
    console.error('Middleware error:', error);
  }

  return res;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
