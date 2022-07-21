import axios from '@/lib/axios'
import config from '@/lib/config'

export async function runEpisodeSearch(sonarrEpisode) {
  const command = {
    name: 'EpisodeSearch',
    episodeIds: [sonarrEpisode.id]
  }
  const res = await axios.post('/api/sonarr/command', command)
  return res.data
}

export async function editSonarrEpisodeMonitoring(sonarrEpisode) {
  sonarrEpisode = {
    ...sonarrEpisode,
    monitored: !sonarrEpisode.monitored
  }
  return await axios.put('/api/sonarr/editEpisode', sonarrEpisode).then(res => res.data)
}

export const SEARCH_TASK_TITLE = 'Lanzar tarea de búsqueda y descarga'

export async function editSeries(series) {
  return await axios.post('/api/sonarr/editSeries', series).then(res => res.data)
}

export async function editSonarrSeasonMonitoring(sonarrSeries, seasonNumber) {
  sonarrSeries.seasons = sonarrSeries.seasons.map(s => {
    if (s.seasonNumber === seasonNumber) {
      s.monitored = !s.monitored
    }
    return s
  })
  return editSeries(sonarrSeries)
}

export async function imdbIdToTmdbId(imdbId) {
  const tmdbURL = config.tmdbApiUrl
  const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_KEY

  if (!imdbId) {
    return null
  }

  const url = `${tmdbURL}/find/${imdbId}`
  const params = {
    api_key: tmdbApiKey,
    language: navigator.language,
    external_source: 'imdb_id'
  }

  const res = await axios.get(url, { params })
  const firstShow = res.data.tv_results[0]
  return firstShow && firstShow.id
}

export async function tmdbIdToImdbId(tmdbId) {
  const tmdbURL = config.tmdbApiUrl
  const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_KEY

  const url = `${tmdbURL}/tv/${tmdbId}/external_ids?api_key=${tmdbApiKey}`
  const res = await axios.get(url)
  return res.data.imdb_id
}

export async function fetchTVSeason(id, season) {
  const tmdbURL = config.tmdbApiUrl
  const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_KEY

  if (!id) {
    return null
  }

  const url = `${tmdbURL}/tv/${id}/season/${season}`

  const params = {
    api_key: tmdbApiKey,
    language: navigator.language
    // append_to_response: 'external_ids,watch/providers,aggregate_credits'
  }

  const res = await axios.get(url, { params })
  return res.data
}

export function isSeasonMonitored(sonarrData, seasonNumber) {
  if (!sonarrData) {
    return false
  }

  const season = sonarrData.seasons.find(s => s.seasonNumber === seasonNumber)
  return season && season.monitored
}

export function getSonarrEpisode(sonarrData, seasonNumber, episodeNumber) {
  if (!sonarrData) {
    return null
  }

  return sonarrData.episodes.find(
    e => e.seasonNumber === seasonNumber && e.episodeNumber === episodeNumber
  )
}

export function isEpisodeMonitored(sonarrData, seasonNumber, episodeNumber) {
  const episode = getSonarrEpisode(sonarrData, seasonNumber, episodeNumber)
  return episode && episode.monitored
}

export function episodeHasFile(sonarrData, seasonNumber, episodeNumber) {
  const episode = getSonarrEpisode(sonarrData, seasonNumber, episodeNumber)
  return episode && episode.hasFile
}
