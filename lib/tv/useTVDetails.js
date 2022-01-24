import { useEffect } from 'react'
import useSWR from 'swr'
import axios from 'axios'
import config from '@/lib/config'
import { useAlert } from '@/components/alert/AlertContext'

const tmdbURL = config.tmdbApiUrl
const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_KEY

async function fetchTVDetails(key) {
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

  const sonarrSeries = await axios.get(`/api/sonarr/details?tvdbid=${tvdbId}`).then(res => res.data)
  tmbdData.seasons.reverse()

  console.log(sonarrSeries)

  return {
    ...tmbdData,
    sonarr: sonarrSeries
  }
}

export default function useTVDetails(id) {
  const key = `tvdetails/${id || ''}`
  const { data, error, mutate } = useSWR(key, fetchTVDetails)
  const { setAlert } = useAlert()

  useEffect(() => {
    if (error) {
      setAlert(error.message)
    }
  }, [setAlert, error])

  return {
    data,
    loading: !error && !data,
    error,
    mutate
  }
}
