import axios from 'axios'
import wrapAsync from '@/lib/api/wrapAsync'
import authMiddleware from '../../../lib/api/authMiddleware'
import fetchSonarrConfig from '@/lib/api/fetchSonarrConfig'
import addMonths from 'date-fns/addMonths'

export default wrapAsync(async (req, res) => {
  await authMiddleware(req, res)
  const now = new Date()
  const start = addMonths(now, -6)
  const end = addMonths(now, 6)

  const startDate = start.toISOString().split('T')[0]
  const endDate = end.toISOString().split('T')[0]

  const { url, apikey } = await fetchSonarrConfig()
  const params = {
    apikey,
    start: startDate,
    end: endDate
  }
  const data = await axios.get(`${url}/api/calendar`, { params }).then(res => res.data)
  res.json(data)
})
