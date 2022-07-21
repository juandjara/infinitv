import axios from 'axios'
import wrapAsync from '@/lib/api/wrapAsync'
import authMiddleware from '@/lib/api/authMiddleware'
import fetchSonarrConfig from '@/lib/api/fetchSonarrConfig'
import supabase from '@/lib/db-client/supabaseAdmin'
import fetchUserSeries from '@/lib/api/fetchUserSeries'

export default wrapAsync(async (req, res) => {
  const user = await authMiddleware(req, res)
  const userSeries = await fetchUserSeries(user)

  const series = req.body
  const userHasSerie = userSeries.some(s => s === series.id)
  if (!userHasSerie) {
    await supabase.from('user_series').insert([{ user_id: user.id, series }])
  }

  const { url, apikey } = await fetchSonarrConfig()
  const method = series.isDownloaded ? 'put' : 'post'
  const response = await axios[method](`${url}/api/series?apikey=${apikey}`, series)
  res.json(response.data)
})
