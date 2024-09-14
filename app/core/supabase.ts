import { createClient } from '@supabase/supabase-js'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
if (!supabaseKey) {
  throw new Error('Missing SUPABASE_KEY')
}
if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL')
}
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
