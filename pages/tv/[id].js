import config from '@/lib/config'
import useTVDetails from '@/lib/tv/useTVDetails'
import { useQueryParams } from '@/lib/useQueryParams'
import { ChevronDownIcon, ChevronRightIcon, StarIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import BackButton from '@/components/common/BackButton'
import axios from 'axios'
import useSWR from 'swr'
import { Disclosure } from '@headlessui/react'
import { useEffect, useState } from 'react'

function useSonarrSeries(id) {
  const { data, error } = useSWR(`sonarr-series/${id}`, key => {
    const id = key.split('/').pop()
    return axios.get(`/api/sonarr/details?tvdbid=${id}`).then(res => res.data[0])
  })

  return {
    series: data,
    loading: !error && !data,
    error
  }
}

async function fetchTVSeason(id, season) {
  const tmdbURL = config.tmdbApiUrl
  const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_KEY

  if (!id) {
    return null
  }

  const url = `${tmdbURL}/tv/${id}/season/${season}`

  const params = {
    api_key: tmdbApiKey,
    language: navigator.language
    // append_to_response: 'external_ids,watch/providers,aggregate_credits'
  }

  const res = await axios.get(url, { params })
  return res.data
}

export default function TvDetails() {
  const { params } = useQueryParams()
  const { data, loading } = useTVDetails(params.id)
  // const { series } = useSonarrSeries(data && data.external_ids.tvdb_id)
  const watchRegion =
    typeof navigator !== 'undefined' && navigator.language.split('-').pop().toUpperCase()

  // useEffect(() => {
  //   console.log('tmdb details', data)
  // }, [data])

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
        <div style={{ width: 342 }} className="space-y-8 flex-shrink-0">
          <Networks networks={data.networks} />
          <WatchProviders watchProviders={data['watch/providers']['results'][watchRegion]} />
          <div>
            <p className="mb-2 ml-1 text-lg text-accent-100">Reparto</p>
            <ul className="space-y-6">
              {data.credits.cast.map(p => (
                <PersonCard key={p.credit_id} person={p} />
              ))}
            </ul>
          </div>
        </div>
        <div className="flex-grow space-y-8 mt-10">
          {data.seasons
            .filter(s => s.season_number > 0)
            .map(s => (
              <SeasonCard key={s.id} id={params.id} season={s} />
            ))}
        </div>
      </div>
    </main>
  )
}

function SeasonCard({ id, season }) {
  return (
    <section>
      <Disclosure defaultOpen={season.season_number === 1}>
        {({ open }) => (
          <>
            <Disclosure.Button
              className={[
                open ? 'rounded-t-xl' : 'rounded-xl',
                'flex text-left items-center space-x-3 w-full px-4 py-3 bg-opacity-80 bg-white text-primary-700'
              ].join(' ')}>
              {open ? (
                <ChevronDownIcon className="w-6 h-6 text-gray-500" />
              ) : (
                <ChevronRightIcon className="w-6 h-6 text-gray-500" />
              )}
              <div>
                <p>
                  T{season.season_number}: {season.name}
                </p>
                <p className="text-gray-500 text-sm">
                  {season.episode_count} Episodios
                  {season.air_date && ' - ' + new Date(season.air_date).toLocaleDateString()}
                </p>
              </div>
            </Disclosure.Button>
            <Disclosure.Panel unmount>
              <SeasonDetails id={id} season={season} />
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </section>
  )
}

function SeasonDetails({ id, season }) {
  const [details, setDetails] = useState(null)

  useEffect(() => {
    async function process() {
      const data = await fetchTVSeason(id, season.season_number)
      console.log(data)
      setDetails(data)
    }
    process()
  }, [id, season.season_number])

  return (
    <div className="flex items-start space-x-4 bg-opacity-80 text-gray-900 bg-white rounded-b-xl p-3">
      <img
        alt="poster"
        className="rounded-xl"
        width="240"
        height="240"
        src={`${config.tmdbImageUrl}/w342${season.poster_path}`}
      />
      {details && (
        <div className="flex-grow">
          <p className="max-w-prose mb-4">{details.overview}</p>
          <ul className="space-y-4">
            {details.episodes.map(e => (
              <Disclosure as="li" key={e.id}>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="w-full text-left">
                      <p
                        key={e.id}
                        className={[
                          open ? 'rounded-t-xl' : 'rounded-xl',
                          'bg-white px-4 py-3'
                        ].join(' ')}>
                        <span>
                          Ep. {e.episode_number} - {e.name}
                        </span>
                        <br />
                        <span className="text-gray-500 text-sm">
                          {new Date(e.air_date).toLocaleDateString()}
                        </span>
                      </p>
                    </Disclosure.Button>
                    <Disclosure.Panel className="bg-white rounded-b-xl p-3 pb-6 flex items-start space-x-4">
                      <img
                        alt="still"
                        className="rounded-xl"
                        src={`${config.tmdbImageUrl}/w300${e.still_path}`}
                      />
                      <p className="max-w-prose">{e.overview}</p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function Networks({ networks }) {
  return (
    <div>
      <p className="mb-2 ml-1 text-lg text-accent-100">Cadenas</p>
      <ul className="bg-accent-100 bg-opacity-20 rounded-xl p-3 items-baseline grid grid-cols-3 gap-y-6 gap-x-2">
        {networks.map(n => (
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
  )
}

function WatchProviders({ watchProviders }) {
  if (!watchProviders) {
    return null
  }

  return (
    <div>
      <p className="mb-2 ml-1 leading-tight text-lg text-accent-100">
        <span>Ahora en streaming en</span>
        <br />
        <span className="text-sm text-gray-300">Data by JustWatch</span>
      </p>
      <ul className="bg-accent-100 bg-opacity-20 rounded-xl p-3 grid grid-cols-4 gap-y-6 gap-x-2">
        {watchProviders.flatrate.map(wp => (
          <li key={wp.provider_id} className="flex-shrink-0">
            <a target="_blank" rel="noopener noreferrer" href={watchProviders.link}>
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
  )
}

function PersonCard({ person }) {
  return (
    <li className="flex items-center space-x-4 bg-white text-gray-700 rounded-md shadow-md">
      <img
        alt="avatar"
        className="rounded-md"
        src={`${config.tmdbImageUrl}/w138_and_h175_face${person.profile_path}`}
      />
      <div>
        <p className="text-gray-500">{person.name}</p>
        <p className="text-lg font-medium mt-1">{person.character}</p>
      </div>
    </li>
  )
}
