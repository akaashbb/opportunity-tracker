import { NextResponse } from 'next/server'

// Auth is handled by server components (app/(app)/layout.jsx and app/page.jsx)
// Middleware intentionally left as no-op to avoid Vercel edge runtime issues
export function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: [], // Match nothing — middleware disabled
}
