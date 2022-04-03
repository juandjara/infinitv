import supabase from '@/lib/db-client/supabaseAdmin'
import axios from 'axios'
import authMiddleware from './_authMiddleware'

export default async function sonarrSeries(req, res) {
  await authMiddleware(req, res)

  const { data: settingsRow, error } = await supabase.from('settings').select('settings').single()

  if (error) {
    res.status(500).json({ details: error.details, message: error.message })
    return
  }

  try {
    const id = Number(req.query.tvdbid)
    const { url, apikey } = settingsRow.settings.sonarr
    const data = await axios.get(`${url}/api/series`, { params: { apikey } }).then(res => res.data)
    const details = data.find(d => d.tvdbId === id)
    if (!details) {
      const lookup = await axios
        .get(`${url}/api/series/lookup`, { params: { apikey, term: `tvdb:${id}` } })
        .then(res => res.data)

      const show = lookup[0]
      if (!show) {
        return res.json(null)
      }

      return res.json({
        ...show,
        episodes: [],
        isLookup: true,
        seasonFolder: true,
        addOptions: {
          monitor: 'missing',
          searchForCutoffUnmetEpisodes: false,
          searchForMissingEpisodes: true
        },
        rootFolderPath: '/media/completed', // always use same root folder (TODO: read from config)
        languageProfileId: 1 // force to use english language profile
      })
    }

    const seriesId = details.id
    const episodes = await axios
      .get(`${url}/api/episode`, { params: { seriesId, apikey } })
      .then(res => res.data)
    details.episodes = episodes

    res.json(details)
  } catch (err) {
    res.status(500).json({ code: err.code, message: err.message })
  }
}
