import axios from 'axios'
import wrapAsync from '@/lib/api/wrapAsync'
import authMiddleware from '../../../lib/api/authMiddleware'
import fetchSonarrConfig from '@/lib/api/fetchSonarrConfig'

export default wrapAsync(async (req, res) => {
  await authMiddleware(req, res)
  const episode = req.body
  const { url, apikey } = await fetchSonarrConfig()
  const data = await axios.put(`${url}/api/episode?apikey=${apikey}`, episode).then(res => res.data)
  res.json(data)
})
