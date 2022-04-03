import useSWR from 'swr'
import config from '@/lib/config'

const tmdbURL = config.tmdbApiUrl
const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_KEY

async function fetchTVGenres() {
  const url = `${tmdbURL}/genre/tv/list?api_key=${tmdbApiKey}&language=${navigator.language}`
  const res = await fetch(url)
  if (res.ok) {
    const data = await res.json()
    return data.genres
  } else {
    throw new Error(`Error fetching TV genres from TMDB. Check browser console for more info`)
  }
}

export default function useTVGenres() {
  const { data, error } = useSWR('tvgenres', fetchTVGenres)

  return {
    genres: data || [],
    loading: !error && !data,
    error
  }
}
