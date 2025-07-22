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

// Function to check if user is authenticated
function isAuthenticated(request: NextRequest): boolean {
  // Check for access token in cookies
  const accessToken = request.cookies.get('access_token')?.value;
  
  if (!accessToken) {
    return false;
  }

  // Basic token validation (you might want to add JWT verification here)
  try {
    // Simple check - in production, you'd verify JWT signature and expiration
    return accessToken.length > 0;
  } catch (error) {
    return false;
  }
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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check authentication status once
  const authenticated = isAuthenticated(request);
  
  // If user is authenticated and trying to access login/signup, redirect to dashboard
  if (authenticated && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Allow static files and API routes
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/api') ||
      pathname.includes('.') || 
      pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  if (requiresAuth(pathname)) {
    if (!authenticated) {
      // Redirect to login page with return URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      
      return NextResponse.redirect(loginUrl);
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