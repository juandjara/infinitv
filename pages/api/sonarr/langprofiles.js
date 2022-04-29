import axios from 'axios'
import wrapAsync from '@/lib/api/wrapAsync'
import authMiddleware from '../../../lib/api/authMiddleware'
import fetchSonarrConfig from '@/lib/api/fetchSonarrConfig'

export default wrapAsync(async (req, res) => {
  await authMiddleware(req, res)
  const { url, apikey } = await fetchSonarrConfig()
  const data = await axios
    .get(`${url}/api/v3/languageprofile?apikey=${apikey}`)
    .then(res => res.data)
  res.json(data)
})
