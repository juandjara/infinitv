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
  fileServer: ''
}

async function fetchSettings() {
  const { data, error } = await supabase.from('settings').select('settings')
  if (error && error.name !== 'AbortError') {
    console.error(error)
    throw error
  }

  const settings = data?.[0]?.settings || {}
  return {
    empty: !data,
    ...defaultSettings,
    ...settings
  }
}

export default function useSettings() {
  const { data, error } = useSWR('settings', fetchSettings)

  return {
    settings: data || defaultSettings,
    loading: !error && !data,
    error: error
  }
}
