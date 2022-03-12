import { fetchTVSeason } from '@/lib/tv/tvUtils'
import { useQueryParams } from '@/lib/useQueryParams'
import useSWR from 'swr'
import EpisodeCard from './EpisodeCard'

export default function SeasonDetails({ season }) {
  const { params } = useQueryParams()
  const { data: details, error } = useSWR(
    `season-details?id=${params.id}&s=${season.season_number}`,
    () => fetchTVSeason(params.id, season.season_number)
  )

  if (!details || error) {
    return null
  }

  return (
    <div className="bg-opacity-80 text-gray-900 bg-white rounded-b-xl">
      {details.overview && <p className="max-w-prose mb-4 px-4">{details.overview}</p>}
      <ul className="rounded-b-xl py-1 divide-y divide-blue-300 border-t border-blue-300">
        {details.episodes.map(ep => (
          <EpisodeCard key={ep.id} ep={ep} />
        ))}
      </ul>
    </div>
  )
}
