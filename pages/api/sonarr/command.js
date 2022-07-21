import axios from 'axios'
import wrapAsync from '@/lib/api/wrapAsync'
import fetchSonarrConfig from '@/lib/api/fetchSonarrConfig'
import authMiddleware from '@/lib/api/authMiddleware'
import buildError from '@/lib/api/buildError'

const COMMAND_WHITELIST = ['EpisodeSearch']

export default wrapAsync(async (req, res) => {
  await authMiddleware(req, res)
  const { url, apikey } = await fetchSonarrConfig()

  if (req.body.name && COMMAND_WHITELIST.indexOf(req.body.name) === -1) {
    throw buildError({
      code: 400,
      message: `/api/sonarr/command received command not allowed "${req.body.name}"`
    })
  }

  const method = req.body ? 'post' : 'get'
  const response = await axios({
    url: `${url}/api/command`,
    method,
    params: { apikey },
    data: req.body
  }).then(res => res.data)

  res.json(response)
})
