import { supabase } from '../db-client/supabase'

export default async function fetchUserSeries(user) {
  const { data, error } = await supabase.from('user_series').select('*').eq('user_id', user.id)
  if (error) {
    throw error
  }

  return data.map(d => d.series_id)
}
