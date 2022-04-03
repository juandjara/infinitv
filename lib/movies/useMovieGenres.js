import useSWR from 'swr'
import config from '@/lib/config'

const tmdbURL = config.tmdbApiUrl
const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_KEY

async function fetchMovieGenres() {
  const url = `${tmdbURL}/genre/movie/list?api_key=${tmdbApiKey}&language=${navigator.language}`
  const res = await fetch(url)
  if (res.ok) {
    const data = await res.json()
    return data.genres
  } else {
    throw new Error('Error fetching movie genres from TMDB. Check browser console for more info')
  }
}

export default function useMovieGenres() {
  const { data, error } = useSWR('moviegenres', fetchMovieGenres)

  return {
    genres: data || [],
    loading: !error && !data,
    error
  }
}
