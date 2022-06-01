import axios from 'axios'
import wrapAsync from '@/lib/api/wrapAsync'
import fetchSonarrConfig from '@/lib/api/fetchSonarrConfig'

export default wrapAsync(async (req, res) => {
  const { url, apikey } = await fetchSonarrConfig()
  const method = req.body ? 'post' : 'get'
  const response = await axios({
    url: `${url}/api/command`,
    method,
    params: { apikey },
    data: req.body
  }).then(res => res.data)

  res.json(response)
})
