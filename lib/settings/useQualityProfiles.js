import axios from 'axios'
import useSWR from 'swr'
import { useEffect } from 'react'
import { useAlert } from '@/components/alert/AlertContext'

export default function useQualityProfiles() {
  const { data, error } = useSWR('profiles', () =>
    axios
      .get('/api/sonarr/profiles')
      .then(res => res.data.map(d => ({ label: d.name, value: d.id })))
  )

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
