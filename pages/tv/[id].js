import config from '@/lib/config'
import useTVDetails from '@/lib/tv/useTVDetails'
import { useQueryParams } from '@/lib/useQueryParams'
import { StarIcon } from '@heroicons/react/solid'
import { AdjustmentsIcon } from '@heroicons/react/outline'
import BackButton from '@/components/common/BackButton'
import Spinner from '@/components/common/Spinner'
import Button from '@/components/common/Button'
import { useState } from 'react'
import SeriesEditModal from '@/components/tvDetails/SeriesEditModal'
import Networks from '@/components/tvDetails/Networks'
import WatchProviders from '@/components/tvDetails/WatchProviders'
import SeasonCard from '@/components/tvDetails/SeasonCard'
import PersonCard from '@/components/tvDetails/PersonCard'

export default function TvDetails() {
  const { params } = useQueryParams()
  const { data, loading, error } = useTVDetails(params.id)
  const watchRegion =
    typeof navigator !== 'undefined' && navigator.language.split('-').pop().toUpperCase()

  const [editModalOpen, setEditModalOpen] = useState(false)

  const firstSeasonNumber = data?.seasons[0]?.season_number

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size={16} />
      </div>
    )
  }

  if (error) {
    return null
  }

  return (
    <main>
      <SeriesEditModal open={editModalOpen} setOpen={setEditModalOpen} />
      <div
        className="bg-cover bg-no-repeat"
        style={{ backgroundImage: `url('${config.tmdbImageUrl}/w1280${data.backdrop_path}')` }}>
        <div className="bg-gray-900 bg-opacity-50">
          <div className="container mx-auto pt-5 px-4">
            <BackButton colors="bg-opacity-20 text-white bg-gray-50 hover:bg-opacity-50" />
          </div>
          <header className="container mx-auto px-3 pt-4 pb-10 flex flex-col md:flex-row justify-center md:space-x-6 md:space-y-0 space-x-0 space-y-6">
            <div>
              <img
                alt="poster"
                className="rounded-xl block mx-auto"
                src={`${config.tmdbImageUrl}/w342${data.poster_path}`}
              />
            </div>
            <div className="flex-grow space-y-2 pt-6">
              <p className="text-lg font-medium">
                {data.first_air_date && new Date(data.first_air_date).getFullYear()}
              </p>
              <p className="text-4xl font-semibold text-accent-100">
                <span>{data.name} </span>
                {data.original_name !== data.name && (
                  <span className="text-xl font-medium text-gray-100">{data.original_name}</span>
                )}
              </p>
              <p className="text-lg">{data.genres.map(d => d.name).join(', ')}</p>
              <p className="text-lg">
                {data.status} - {data.number_of_episodes} Episodios, {data.number_of_seasons}{' '}
                Temporadas
              </p>
              <p className="text-xl flex items-center space-x-2">
                <StarIcon className="w-8 h-8 text-yellow-200" />
                <span>{data.vote_average} / 10</span>
              </p>
              <p className="text-2xl text-gray-300 pt-8">{data.tagline}</p>
              <p className="text-base max-w-prose leading-relaxed">{data.overview}</p>
            </div>
          </header>
        </div>
      </div>
      <div className="container mx-auto px-3 py-6 flex flex-col md:flex-row justify-center md:space-x-6 space-x-0 space-y-6 md:space-y-0">
        <div style={{ width: 342 }} className="space-y-8 flex-shrink-0">
          <Networks networks={data.networks} />
          <WatchProviders watchProviders={data['watch/providers']['results'][watchRegion]} />
          <div>
            <p className="mb-2 ml-1 text-lg text-accent-100">Reparto</p>
            <ul className="space-y-4">
              {data.credits.cast.map(p => (
                <PersonCard key={p.credit_id} person={p} />
              ))}
            </ul>
          </div>
        </div>
        <div className="order-first md:order-none flex-grow space-y-8 mt-10 pb-4">
          <div className="px-1 flex justify-between items-center">
            <p className="text-3xl">Temporadas</p>
            <Button
              hasIcon="only"
              title="Editar serie"
              background="bg-transparent bg-gray-100 bg-opacity-50 hover:bg-opacity-100"
              border="border-none"
              onClick={() => setEditModalOpen(true)}>
              <AdjustmentsIcon className="text-gray-500 w-6 h-6" />
            </Button>
          </div>
          {data.seasons
            .filter(s => s.season_number > 0)
            .map(s => (
              <SeasonCard key={s.id} firstSeason={firstSeasonNumber} season={s} />
            ))}
        </div>
      </div>
    </main>
  )
}
