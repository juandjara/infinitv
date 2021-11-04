import supabase from '@/lib/db-client/supabaseAdmin'
import axios from 'axios'

export default async function sonarrSeries(req, res) {
  const { data: settingsRow, error } = await supabase.from('settings').select('settings').single()

  if (error) {
    res.status(500).json({ details: error.details, message: error.message })
    return
  }

  try {
    const id = req.query.tvdbid
    const { url, apikey } = settingsRow.settings.sonarr
    const fullUrl = `${url}/api/series/lookup?term=tvdb:${id}&apikey=${apikey}`
    console.log(fullUrl)
    const data = await axios.get(fullUrl).then(res => res.data)
    res.json(data)
  } catch (err) {
    res.status(500).json({ code: error.code, message: error.message })
  }
}
