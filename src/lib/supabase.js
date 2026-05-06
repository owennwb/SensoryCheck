import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yidxgspnczekrjiucitx.supabase.co'
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpZHhnc3BuY3pla3JqaXVjaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNTI1ODUsImV4cCI6MjA5MzYyODU4NX0.Qf3pxKf6pW6Rf-T8BYrxua_cvhX-KS7ODKS5REIWCXw"
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
