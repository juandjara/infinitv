import config from '@/lib/config'
import useTVDetails from '@/lib/tv/useTVDetails'
import { useQueryParams } from '@/lib/useQueryParams'
import { StarIcon } from '@heroicons/react/solid'
import { useEffect } from 'react'

export default function TvDetails() {
  const { params } = useQueryParams()
  const { data, loading } = useTVDetails(params.id)
  const watchRegion = typeof navigator !== 'undefined' && navigator.language.split('-').pop().toUpperCase()

  useEffect(() => {
    console.log(data)
  }, [data])

  if (loading) {
    return null
  }

  return (
    <main>
      <div
        className="bg-cover bg-no-repeat"
        style={{ backgroundImage: `url('${config.tmdbImageUrl}/w1280${data.backdrop_path}')` }}>
        <div className="bg-gray-900 bg-opacity-50">
          <header className="container mx-auto px-3 py-10 flex justify-center space-x-6">
            <img alt="poster" src={`${config.tmdbImageUrl}/w342${data.poster_path}`} />
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
                {data.status} - {data.episode_run_time}min - {data.number_of_episodes} Episodios,{' '}
                {data.number_of_seasons} Temporadas
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
      <div className="container mx-auto px-3 py-6 flex justify-center space-x-6">
        <div style={{ width: 342 }}>
          <ul className="space-y-4">
            {data['watch/providers']['results'][watchRegion] &&
              data['watch/providers']['results'][watchRegion].flatrate.map(wp => (
                <li key={wp.provider_id}>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4"
                    href={data['watch/providers']['results'][watchRegion].link}>
                    <img
                      width="52"
                      height="52"
                      alt="log"
                      className="rounded-xl"
                      src={`${config.tmdbImageUrl}/w92/${wp.logo_path}`}
                    />
                    <span className="text-lg font-medium">Ver en {wp.provider_name}</span>
                  </a>
                </li>
              ))}
          </ul>
          <div className="mt-8">
            <p className="text-xl text-gray-100">Reparto</p>
            <ul className="mt-4 space-y-6">
              {data.credits.cast.map(p => (
                <li key={p.credit_id} className="flex items-center space-x-4 bg-white text-gray-700 rounded-md shadow-md">
                  <img alt="avatar" className="rounded-md" src={`${config.tmdbImageUrl}/w138_and_h175_face${p.profile_path}`} />
                  <div>
                    <p className="text-gray-500">{p.name}</p>
                    <p className="text-lg font-medium mt-1">{p.character}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex-grow"></div>
      </div>
    </main>
  )
}
