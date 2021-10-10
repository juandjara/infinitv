import { useAlert } from '@/components/alert/AlertContext'
import { useEffect } from 'react'
import useSWR from 'swr'
import { supabase } from '../db-client/supabase'

const defaultSettings = {
  sonarr: {
    url: '',
    apikey: ''
  },
  radarr: {
    url: '',
    apikey: ''
  },
  mediaServer: {
    url: '',
    apikey: ''
  }
}

async function fetchSettings() {
  const { data, error } = await supabase.from('settings').select('settings').single()
  if (error && error.name !== 'AbortError') {
    console.error(error)
    throw error
  }

  const settings = (data && data.settings) || {}
  return {
    ...defaultSettings,
    ...settings
  }
}

export default function useSettings() {
  const { data, error } = useSWR('settings', fetchSettings)
  const { setAlert } = useAlert()

  useEffect(() => {
    if (error) {
      setAlert(error.message)
    }
  }, [setAlert, error])

  return {
    settings: data || defaultSettings,
    loading: !error && !data,
    error: error
  }
}