import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://toztwtlkcpaxhvmqtbdu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvenR3dGxrY3BheGh2bXF0YmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIxNDkzNzUsImV4cCI6MjAyNzcyNTM3NX0.PaC-KCagfiF3Sbm0soD9o3ah5XJmByDCB-JkkdINi0c";

export const supabase = createClient(supabaseUrl, supabaseAnonKey)