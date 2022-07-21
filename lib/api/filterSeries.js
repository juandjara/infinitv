import fetchUserSeries from './fetchUserSeries'

export default async function filterSeries(series = [], user) {
  const userSeries = await fetchUserSeries(user)
  return series.filter(s => userSeries.indexOf(s.id) !== -1)
}
