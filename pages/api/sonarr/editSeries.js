import supabase from '@/lib/db-client/supabaseAdmin'
import axios from 'axios'

export default async function sonarrSeriesEdit(req, res) {
  const { data: settingsRow, error } = await supabase.from('settings').select('settings').single()

  if (error) {
    res.status(500).json({ details: error.details, message: error.message })
    return
  }

  try {
    const series = req.body
    const { url, apikey } = settingsRow.settings.sonarr
    const data = await axios.put(`${url}/api/series?apikey=${apikey}`, series).then(res => res.data)
    res.json(data)
  } catch (err) {
    res.status(500).json({ code: err.code, message: err.message })
  }
}
