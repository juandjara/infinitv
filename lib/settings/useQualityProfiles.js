import axios from 'axios'
import useSWR from 'swr'

export default function useQualityProfiles() {
  const { data, error } = useSWR('profiles', () =>
    axios
      .get('/api/sonarr/profiles')
      .then(res => res.data.map(d => ({ label: d.name, value: d.id })))
  )

  return {
    data: data || [],
    loading: !error && !data,
    error
  }
}
