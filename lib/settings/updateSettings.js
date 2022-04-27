import { supabase } from '../db-client/supabase'

export default async function updateSettings(settings) {
  const { data, error } = await supabase.from('settings').upsert({ id: 1, settings }).single()
  if (error) {
    throw error
  }

  return data
}
