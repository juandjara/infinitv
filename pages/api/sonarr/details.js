import supabase from '@/lib/db-client/supabaseAdmin'
import axios from 'axios'

export default async function sonarrSeries(req, res) {
  const { data: settingsRow, error } = await supabase.from('settings').select('settings').single()

  if (error) {
    res.status(500).json({ details: error.details, message: error.message })
    return
  }

  try {
    const id = Number(req.query.tvdbid)
    const { url, apikey } = settingsRow.settings.sonarr
    const data = await axios.get(`${url}/api/series?apikey=${apikey}`).then(res => res.data)
    const details = data.find(d => d.tvdbId === id)
    if (!details) {
      res.json(null)
      return
    }

    const surl = `${url}/api/episode?seriesId=${details.id}&apikey=${apikey}`
    const episodes = await axios.get(surl).then(res => res.data)
    details.episodes = episodes

    res.json(details)
  } catch (err) {
    res.status(500).json({ code: err.code, message: err.message })
  }
}
