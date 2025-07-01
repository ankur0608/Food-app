import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // ✅ Keeps user logged in
    autoRefreshToken: true, // ✅ Refreshes session when token expires
    detectSessionInUrl: true, // ✅ Captures session after OAuth redirect
  },
});
