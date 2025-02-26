import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://euaofmmcwnlpymwmkhbh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1YW9mbW1jd25scHltd21raGJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2MDEwODksImV4cCI6MjA1NjE3NzA4OX0.1ezy609Hj2ypea41iE7YqKmrz-y8RZwM9jHIzqbz-bc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})