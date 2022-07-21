import axios from 'axios'
import wrapAsync from '@/lib/api/wrapAsync'
import authMiddleware from '@/lib/api/authMiddleware'
import fetchSonarrConfig from '@/lib/api/fetchSonarrConfig'
import filterSeries from '@/lib/api/filterSeries'

export default wrapAsync(async (req, res) => {
  const user = await authMiddleware(req, res)
  const id = Number(req.query.tvdbid)
  const { url, apikey } = await fetchSonarrConfig()
  const data = await axios.get(`${url}/api/series`, { params: { apikey } }).then(res => res.data)
  const isDownloaded = data.some(d => d.tvdbId === id)
  const userSeries = await filterSeries(data, user)
  const details = userSeries.find(d => d.tvdbId === id)
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
      isDownloaded,
      isSaved: false,
      seasonFolder: true,
      addOptions: {
        monitor: 'missing',
        searchForCutoffUnmetEpisodes: false,
        searchForMissingEpisodes: true
      },
      rootFolderPath: '/hdd/media/tv', // TODO: make this configurable
      languageProfileId: 1 // default to use english language profile
    })
  }

  const seriesId = details.id
  const episodes = await axios
    .get(`${url}/api/episode`, { params: { seriesId, apikey } })
    .then(res => res.data)
  details.episodes = episodes
  details.isSaved = true
  details.isDownloaded = isDownloaded

  res.json(details)
})
