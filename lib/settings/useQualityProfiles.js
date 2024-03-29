import axios from '@/lib/axios'
import useSWR from 'swr'
import { useSettings } from './useSettings'

function fetchQualityProfiles(key, hasSettings) {
  if (!hasSettings) {
    return []
  }

  return axios
    .get('/api/sonarr/profiles')
    .then(res => res.data.map(d => ({ label: d.name, value: d.id })))
}

export default function useQualityProfiles() {
  const { hasSonarr, loading } = useSettings()
  const { data, error } = useSWR(['profiles', hasSonarr], fetchQualityProfiles)

  return {
    data: data || [],
    loading: loading || (!error && !data),
    error
  }
}
