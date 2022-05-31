import useSWR from 'swr'
import axios from '@/lib/axios'
import config from '@/lib/config'
import { useSettings } from '../settings/useSettings'

const tmdbURL = config.tmdbApiUrl
const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_KEY

async function fetchTVDetails(key, hasSettings) {
  const id = key.split('/')[1] || ''
  if (!id) {
    return null
  }

  const url = `${tmdbURL}/tv/${id}`

  const params = {
    api_key: tmdbApiKey,
    language: navigator.language,
    append_to_response: 'external_ids,watch/providers,credits'
  }

  const res = await axios.get(url, { params })
  const tmbdData = res.data
  const tvdbId = tmbdData.external_ids.tvdb_id

  const sonarrSeries = hasSettings
    ? await axios.get(`/api/sonarr/details?tvdbid=${tvdbId}`).then(res => res.data)
    : null

  tmbdData.seasons.reverse()

  return {
    ...tmbdData,
    sonarr: sonarrSeries
  }
}

export default function useTVDetails(id) {
  const key = `tvdetails/${id || ''}`
  const { hasSonarr } = useSettings()
  const { data, error, mutate } = useSWR([key, hasSonarr], fetchTVDetails)

  return {
    data,
    loading: !error && !data,
    error,
    mutate
  }
}
