import { createClient } from '@supabase/supabase-js'

//export const supabase = createClient('https://toztwtlkcpaxhvmqtbdu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvenR3dGxrY3BheGh2bXF0YmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIxNDkzNzUsImV4cCI6MjAyNzcyNTM3NX0.PaC-KCagfiF3Sbm0soD9o3ah5XJmByDCB-JkkdINi0c')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
