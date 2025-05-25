import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // if the user is logged in and tries to access the login, register page
    if (
      token &&
      (req.nextUrl.pathname === '/sign-in' ||
        req.nextUrl.pathname === '/sign-up')
    ) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (
          pathname.startsWith('/_next/') ||
          pathname.includes('.') || // Files with extensions
          pathname.startsWith('/favicon.ico') ||
          pathname.startsWith('/images/') ||
          pathname.startsWith('/icons/')
        ) {
          return true;
        }

        if (
          pathname === '/' ||
          pathname === '/sign-in' ||
          pathname === '/sign-up' ||
          pathname === '/questions'
        ) {
          return true;
        }

        if (pathname.startsWith('/questions/') && pathname !== '/questions') {
          return !!token;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/',
    '/sign-in',
    '/sign-up',
    '/ask-question',
    '/collection',
    '/questions',
    '/questions/(.*)',
    '/profile/(.*)',
  ],
};
