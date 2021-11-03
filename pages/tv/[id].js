import config from '@/lib/config'
import useTVDetails from '@/lib/tv/useTVDetails'
import { useQueryParams } from '@/lib/useQueryParams'
import { StarIcon } from '@heroicons/react/solid'
import { useEffect } from 'react'
import Link from 'next/link'
import BackButton from '@/components/common/BackButton'

export default function TvDetails() {
  const { params } = useQueryParams()
  const { data, loading } = useTVDetails(params.id)
  const watchRegion =
    typeof navigator !== 'undefined' && navigator.language.split('-').pop().toUpperCase()

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
          <div className="container mx-auto pt-5 px-4">
            <BackButton colors="bg-opacity-20 text-white bg-gray-50 hover:bg-opacity-50" />
          </div>
          <header className="container mx-auto px-3 pt-4 pb-10 flex justify-center space-x-6">
            <div>
              <img
                alt="poster"
                className="rounded-xl"
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
      <div className="container mx-auto px-3 py-6 flex justify-center space-x-6">
        <div style={{ width: 342 }} className="space-y-8">
          <div>
            <p className="mb-2 ml-1 text-lg text-accent-100">Cadenas</p>
            <ul className="bg-accent-100 bg-opacity-20 rounded-xl p-3 items-baseline grid grid-cols-3 gap-y-6 gap-x-2">
              {data.networks.map(n => (
                <li key={n.id} className="flex-shrink-0">
                  <Link href={`/networks/${n.id}`}>
                    <a className="">
                      <img
                        title={n.name}
                        alt={n.name}
                        src={`${config.tmdbImageUrl}/w92/${n.logo_path}`}
                        className="block mx-auto"
                      />
                      <p className="text-center mt-2 text-sm font-medium">{n.name}</p>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {data['watch/providers']['results'][watchRegion] && (
            <div>
              <p className="mb-2 ml-1 leading-tight text-lg text-accent-100">
                <span>Ahora en streaming en</span>
                <br />
                <span className="text-sm text-gray-300">Data by JustWatch</span>
              </p>
              <ul className="bg-accent-100 bg-opacity-20 rounded-xl p-3 grid grid-cols-4 gap-y-6 gap-x-2">
                {data['watch/providers']['results'][watchRegion].flatrate.map(wp => (
                  <li key={wp.provider_id} className="flex-shrink-0">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={data['watch/providers']['results'][watchRegion].link}>
                      <img
                        title={wp.provider_name}
                        alt={wp.provider_name}
                        src={`${config.tmdbImageUrl}/w92/${wp.logo_path}`}
                        className="block mx-auto rounded-xl w-14 h-14"
                      />
                      <p className="text-center mt-2 text-sm font-medium">{wp.provider_name}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <p className="mb-2 ml-1 text-lg text-accent-100">Reparto</p>
            <ul className="space-y-6">
              {data.credits.cast.map(p => (
                <li
                  key={p.credit_id}
                  className="flex items-center space-x-4 bg-white text-gray-700 rounded-md shadow-md">
                  <img
                    alt="avatar"
                    className="rounded-md"
                    src={`${config.tmdbImageUrl}/w138_and_h175_face${p.profile_path}`}
                  />
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
