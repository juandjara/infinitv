import { useAlert } from '@/components/alert/AlertContext'
import { useEffect } from 'react'
import useSWR from 'swr'

async function fetchSonarrSeries() {
  const res = await fetch('/api/sonarr/series')
  if (res.ok) {
    const json = await res.json()
    console.log(json[0])
    return json
  } else {
    throw new Error(`"/api/sonarr/series" endpoint failed with status code ${res.status}`)
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
