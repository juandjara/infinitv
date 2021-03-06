import useSWR from 'swr'
import axios from 'axios'
import config from '@/lib/config'

const tmdbURL = config.tmdbApiUrl
const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_KEY

const keyMapping = {
  q: 'query',
  g: 'with_genres',
  n: 'with_networks'
}

async function fetchTVFromTMDB(key) {
  const query = key.split('?')[1] || ''
  const queryParams = Object.fromEntries(
    Array.from(new URLSearchParams(query)).map(entry => [
      keyMapping[entry[0]] || entry[0],
      entry[1]
    ])
  )

  const hasFilters = Boolean(
    queryParams.sk || queryParams.st || queryParams.with_genres || queryParams.with_networks
  )

  const { sk, st, ...otherParams } = queryParams
  const sort = `${sk || 'popularity'}.${st || 'desc'}`

  let url = `${tmdbURL}/trending/tv/week`
  if (hasFilters) {
    url = `${tmdbURL}/discover/tv`
  }

  if (otherParams.query) {
    url = `${tmdbURL}/search/tv`
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
  const key = `tvseries?${query || ''}`
  const { data, error } = useSWR(key, fetchTVFromTMDB)

  return {
    data: data || [],
    loading: !error && !data,
    error
  }
}
