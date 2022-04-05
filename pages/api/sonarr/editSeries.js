import axios from 'axios'
import wrapAsync from '@/lib/api/wrapAsync'
import authMiddleware from '../../../lib/api/authMiddleware'
import fetchSonarrConfig from '@/lib/api/fetchSonarrConfig'

export default wrapAsync(async (req, res) => {
  await authMiddleware(req, res)
  const series = req.body
  const { url, apikey } = await fetchSonarrConfig()
  const method = series.isSaved ? 'put' : 'post'
  const response = await axios[method](`${url}/api/series?apikey=${apikey}`, series)
  res.json(response.data)
})
