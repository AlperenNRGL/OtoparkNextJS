import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Singleton pattern - Client'ı cache'le (her istekte yeniden oluşturma)
let supabaseAdminInstance = null

// Client-side için (browser)
export const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Server-side için (admin işlemleri) - Singleton pattern ile optimize
// Service role key varsa onu kullan, yoksa anon key kullan
export const createSupabaseAdmin = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  // Eğer zaten bir instance varsa onu kullan (cache)
  if (supabaseAdminInstance) {
    return supabaseAdminInstance
  }
  
  // Service role key varsa onu kullan (daha güçlü yetkiler)
  if (supabaseServiceKey) {
    supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: { 'x-client-info': 'nextjs-api' },
      },
    })
  } else {
    // Yoksa anon key kullan (RLS politikalarına dikkat!)
    supabaseAdminInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: { 'x-client-info': 'nextjs-api' },
      },
    })
  }
  
  return supabaseAdminInstance
}

