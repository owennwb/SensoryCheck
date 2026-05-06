import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yidxgspnczekrjiucitx.supabase.co'
const supabaseAnonKey = sb_publishable_TcmOETQ8ocLZ6pAsJOHwIA_aGtszuto
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
