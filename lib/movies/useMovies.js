import { useEffect } from 'react'
import useSWR from 'swr'
import config from '@/lib/config'
import { useAlert } from '@/components/alert/AlertContext'
import axios from 'axios'

const tmdbURL = config.tmdbApiUrl
const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_KEY

const keyMapping = {
  q: 'query',
  g: 'with_genres',
  c: 'with_companies'
}

async function fetchMoviesFromTMDB(key) {
  const query = key.split('?')[1] || ''
  const queryParams = Object.fromEntries(
    Array.from(new URLSearchParams(query)).map(entry => [
      keyMapping[entry[0]] || entry[0],
      entry[1]
    ])
  )

  const hasFilters = Boolean(
    queryParams.sk || queryParams.st || queryParams.with_genres || queryParams.with_companies
  )

  const { sk, st, ...otherParams } = queryParams
  const sort = `${sk || 'popularity'}.${st || 'desc'}`

  let url = `${tmdbURL}/trending/movie/week`
  if (hasFilters) {
    url = `${tmdbURL}/discover/movie`
  }

  if (otherParams.query) {
    url = `${tmdbURL}/search/movie`
  }

  const params = {
    api_key: tmdbApiKey,
    language: navigator.language,
    sort_by: sort,
    include_adult: false,
    include_video: false,
    'vote_count.gte': 5,
    ...otherParams
  }
  const res = await axios.get(url, { params })
  return res.data.results
}

export default function useTVSeries(query) {
  const key = `movies?${query || ''}`
  const { data, error } = useSWR(key, fetchMoviesFromTMDB)
  const { setAlert } = useAlert()

  useEffect(() => {
    if (error) {
      setAlert(error.message)
    }
  }, [setAlert, error])

  return {
    data: data || [],
    loading: !error && !data,
    error
  }
}
