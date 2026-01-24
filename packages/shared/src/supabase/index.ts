// Re-export Supabase utilities
// Note: Server utilities (createServerClient) should NOT be re-exported here
// because they use next/headers which only works in Server Components.
// Import directly from '@repo/shared/supabase/server' when needed.
export { createClient as createBrowserClient } from "./client";
export * from "./middleware";
