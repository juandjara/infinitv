import supabase from '../db-client/supabaseAdmin'

export default async function fetchSonarrConfig() {
  const { data: settingsRow, error } = await supabase.from('settings').select('settings').single()
  if (error) {
    throw error
  }
  return settingsRow.settings.sonarr
}
