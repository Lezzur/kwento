import { createBrowserClient, SupabaseClient } from '@supabase/ssr'

let client: SupabaseClient | null = null

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // During build time, env vars may not be available - return null
    // This allows static generation to complete
    if (typeof window === 'undefined') {
      return null as unknown as SupabaseClient
    }
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
  }

  if (!client) {
    client = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }

  return client
}
