import axios from 'axios'
import wrapAsync from '@/lib/api/wrapAsync'
import authMiddleware from '../../../lib/api/authMiddleware'
import fetchSonarrConfig from '@/lib/api/fetchSonarrConfig'

export default wrapAsync(async (req, res) => {
  await authMiddleware(req, res)
  const id = Number(req.query.tvdbid)
  const { url, apikey } = await fetchSonarrConfig()
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
      isSaved: false,
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
  details.isSaved = true

  res.json(details)
})
