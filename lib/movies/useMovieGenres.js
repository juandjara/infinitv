import { useEffect } from 'react'
import useSWR from 'swr'
import config from '@/lib/config'
import { useAlert } from '@/components/alert/AlertContext'

const tmdbURL = config.tmdbApiUrl
const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_KEY

async function fetchMovieGenres() {
  const url = `${tmdbURL}/genre/movie/list?api_key=${tmdbApiKey}&language=${navigator.language}`
  const res = await fetch(url)
  if (res.ok) {
    const data = await res.json()
    return data.genres
  } else {
    throw new Error(`Request failed with status code ${res.status}`)
  }
}

export default function useMovieGenres() {
  const { data, error } = useSWR('moviegenres', fetchMovieGenres)
  const { setAlert } = useAlert()

  useEffect(() => {
    if (error) {
      setAlert(error.message)
    }
  }, [setAlert, error])

  return {
    genres: data || [],
    loading: !error && !data,
    error
  }
}