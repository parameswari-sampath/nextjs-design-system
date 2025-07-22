import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/design-system',
  '/layouts',
  '/samples',
  '/sidebar'
];

// Define routes that require authentication
const protectedRoutes = [
  '/dashboard'
];

// Function to refresh token using refresh token
async function refreshToken(refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: refreshToken
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.access;
    }
    return null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
}

// Function to validate token with API
async function validateToken(accessToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/profile/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Function to check if user is authenticated
async function isAuthenticated(request: NextRequest): Promise<{ authenticated: boolean; newAccessToken?: string }> {
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshTokenValue = request.cookies.get('refresh_token')?.value;
  
  if (!accessToken) {
    return { authenticated: false };
  }

  // Validate current access token
  const isValid = await validateToken(accessToken);
  
  if (isValid) {
    return { authenticated: true };
  }

  // Access token is invalid, try to refresh
  if (refreshTokenValue) {
    const newAccessToken = await refreshToken(refreshTokenValue);
    if (newAccessToken) {
      return { authenticated: true, newAccessToken };
    }
  }

  return { authenticated: false };
}

// Function to check if route requires authentication
function requiresAuth(pathname: string): boolean {
  // Check if it's a protected route (starts with any protected path)
  return protectedRoutes.some(route => pathname.startsWith(route)) ||
         pathname.startsWith('/(authenticated)');
}

// Function to check if route is public
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.includes(pathname) || 
         pathname.startsWith('/_next') || 
         pathname.startsWith('/api') ||
         pathname.includes('.') || // Static files (images, icons, etc.)
         pathname === '/favicon.ico';
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow static files and API routes
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/api') ||
      pathname.includes('.') || 
      pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  // Check authentication status
  const authResult = await isAuthenticated(request);
  
  // If user is authenticated and trying to access login/signup, redirect to dashboard
  if (authResult.authenticated && (pathname === '/login' || pathname === '/signup')) {
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    
    // If we got a new access token, set it in cookies
    if (authResult.newAccessToken) {
      response.cookies.set('access_token', authResult.newAccessToken, {
        path: '/',
        sameSite: 'lax'
      });
    }
    
    return response;
  }
  
  // Check authentication for protected routes
  if (requiresAuth(pathname)) {
    if (!authResult.authenticated) {
      // Clear invalid tokens
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('access_token');
      response.cookies.delete('refresh_token');
      return response;
    }
    
    // If we got a new access token, set it in cookies
    if (authResult.newAccessToken) {
      const response = NextResponse.next();
      response.cookies.set('access_token', authResult.newAccessToken, {
        path: '/',
        sameSite: 'lax'
      });
      return response;
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};