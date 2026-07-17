import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uhzynxvtafzncckaehvs.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoenlueHZ0YWZ6bmNja2FlaHZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MjAyMTksImV4cCI6MjA5NzE5NjIxOX0.QOOPmyDqZ_S4eOfxAK-PBU7DJTu7jZ89yi-1Omj2CAo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
