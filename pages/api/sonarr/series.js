import axios from 'axios'
import wrapAsync from '@/lib/api/wrapAsync'
import authMiddleware from '@/lib/api/authMiddleware'
import fetchSonarrConfig from '@/lib/api/fetchSonarrConfig'
import filterSeries from '@/lib/api/filterSeries'

export default wrapAsync(async (req, res) => {
  const user = await authMiddleware(req)
  const { url, apikey } = await fetchSonarrConfig()
  const data = await axios.get(`${url}/api/series?apikey=${apikey}`).then(res => res.data)
  const filtered = await filterSeries(data, user)
  res.json(filtered)
})
