import { useAlert } from '@/components/alert/AlertContext'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import useSWR from 'swr'

async function fetchSonarrSeries() {
  try {
    const { data } = await axios.get('/api/sonarr/series')
    return data[0]
  } catch (err) {
    throw new Error(`"/api/sonarr/series" ${err}`)
  }
}

export default function useSonarrSeries() {
  const { data, error } = useSWR('sonarr-series', fetchSonarrSeries)

  const { setAlert } = useAlert()

  useEffect(() => {
    if (error) {
      setAlert(error.message)
    }
  }, [setAlert, error])

  return {
    series: data || [],
    loading: !error && !data,
    error
  }
}
