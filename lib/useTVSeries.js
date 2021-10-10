import { useEffect } from 'react'
import useSWR from 'swr'
import config from '@/lib/config'
import { useAlert } from '@/components/alert/AlertContext'
import axios from 'axios'

const tmdbURL = config.tmdbApiUrl
const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_KEY

async function fetchTVFromTMDB() {
  const url = `${tmdbURL}/discover/tv`
  const params = {
    api_key: tmdbApiKey,
    language: navigator.language
  }
  const res = await axios.get(url, { params })
  return res.data.results
}

export default function useTVSeries() {
  const { data, error } = useSWR('tvseries', fetchTVFromTMDB)
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
