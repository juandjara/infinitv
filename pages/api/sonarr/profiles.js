import supabase from '@/lib/db-client/supabaseAdmin'
import axios from 'axios'

export default async function sonarProfiles(req, res) {
  const { data: settingsRow, error } = await supabase.from('settings').select('settings').single()

  if (error) {
    res.status(500).json({ details: error.details, message: error.message })
    return
  }

  try {
    const { url, apikey } = settingsRow.settings.sonarr
    const data = await axios.get(`${url}/api/profile?apikey=${apikey}`).then(res => res.data)
    res.json(data)
  } catch (err) {
    res.status(500).json({ code: err.code, message: err.message })
  }
}
