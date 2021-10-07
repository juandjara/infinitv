import { supabase } from '../db-client/supabase'

export default async function updateSettings(settings) {
  const { data, error } = await supabase.from('settings').update({ settings }).single()
  if (error) {
    throw error
  }

  return data
}
