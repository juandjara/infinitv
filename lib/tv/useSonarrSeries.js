import axios from '@/lib/axios'
import useSWR from 'swr'
import { useSettings } from '../settings/useSettings'

async function fetchSonarrSeries(key, hasSettings) {
  if (!hasSettings) {
    return []
  }

  try {
    const { data } = await axios.get('/api/sonarr/series')
    return data
  } catch (err) {
    throw new Error('Error fetching series from Sonarr. Check browser console for more info')
  }
}

export default function useSonarrSeries() {
  const { hasSonarr } = useSettings()
  const { data, error } = useSWR(['sonarr-series', hasSonarr], fetchSonarrSeries)

  return {
    series: data || [],
    loading: !error && !data,
    error
  }
}
