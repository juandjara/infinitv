import supabase from '@/lib/db-client/supabaseAdmin'
import axios from 'axios'
import addMonths from 'date-fns/addMonths'
import authMiddleware from './_authMiddleware'

export default async function sonarrCalendar(req, res) {
  await authMiddleware(req, res)

  const { data: settingsRow, error } = await supabase.from('settings').select('settings').single()

  if (error) {
    res.status(500).json({ details: error.details, message: error.message })
    return
  }

  try {
    const now = new Date()
    const start = addMonths(now, -6)
    const end = addMonths(now, 6)

    const startDate = start.toISOString().split('T')[0]
    const endDate = end.toISOString().split('T')[0]

    const { url, apikey } = settingsRow.settings.sonarr
    const params = {
      apikey,
      start: startDate,
      end: endDate
    }
    const data = await axios.get(`${url}/api/calendar`, { params }).then(res => res.data)
    res.json(data)
  } catch (err) {
    res.status(500).json({ code: err.code, message: err.message })
  }
}
