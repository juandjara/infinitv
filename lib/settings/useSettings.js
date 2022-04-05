import useSWR from 'swr'
import { supabase } from '../db-client/supabase'

export const defaultSettings = {
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

export async function fetchSettings() {
  const { data, error } = await supabase.from('settings').select('settings')
  if (error && error.name !== 'AbortError') {
    console.error(error)
    throw error
  }

  const savedSettings = data?.[0]?.settings
  return {
    ...defaultSettings,
    ...savedSettings
  }
}

export function useSettings() {
  const { data, error } = useSWR('settings', fetchSettings)
  const settings = data || defaultSettings

  return {
    settings,
    hasSonarr: !!(settings.sonarr.url && settings.sonarr.apikey),
    hasRadarr: !!(settings.radarr.url && settings.radarr.apikey),
    hasFileServer: !!settings.fileServer,
    loading: !error && !data,
    error: error
  }
}
