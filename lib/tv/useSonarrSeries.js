import axios from '@/lib/axios'
import useSWR from 'swr'

async function fetchSonarrSeries() {
  try {
    const { data } = await axios.get('/api/sonarr/series')
    return data[0]
  } catch (err) {
    throw new Error('Error fetching series from Sonarr. Check browser console for more info')
  }
}

export default function useSonarrSeries() {
  const { data, error } = useSWR('sonarr-series', fetchSonarrSeries)

  return {
    series: data || [],
    loading: !error && !data,
    error
  }
}
