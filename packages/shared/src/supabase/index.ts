// Re-export Supabase utilities for client-side use
// Note: Server client is NOT exported from here to avoid importing 'next/headers' in client components
// Import server client directly: import { createClient } from '@repo/shared/supabase/server'
export { createClient as createBrowserClient } from './client';
export * from './middleware';

