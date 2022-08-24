import axios from '@/lib/axios'
import useSWR from 'swr'
import { useSettings } from './useSettings'

function fetchLanguagesProfiles(key, hasSettings) {
  if (!hasSettings) {
    return []
  }

  return axios
    .get('/api/sonarr/langprofiles')
    .then(res => res.data.map(d => ({ label: d.name, value: d.id })))
}

export default function useLanguagesProfiles() {
  const { hasSonarr, loading } = useSettings()
  const { data, error } = useSWR(['langprofiles', hasSonarr], fetchLanguagesProfiles)

  return {
    data: data || [],
    loading: loading || (!error && !data),
    error
  }
}
