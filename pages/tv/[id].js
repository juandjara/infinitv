import config from '@/lib/config'
import useTVDetails from '@/lib/tv/useTVDetails'
import { useQueryParams } from '@/lib/useQueryParams'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  StarIcon,
  BookmarkIcon,
  LinkIcon,
  SearchIcon
} from '@heroicons/react/solid'
import { BookmarkIcon as BookmarkIconOutline } from '@heroicons/react/outline'
import Link from 'next/link'
import BackButton from '@/components/common/BackButton'
import { Disclosure } from '@headlessui/react'
import useSWR from 'swr'
import Spinner from '@/components/common/Spinner'
import {
  editSonarrEpisodeMonitoring,
  editSonarrSeasonMonitoring,
  fetchTVSeason,
  getSonarrEpisode,
  isSeasonMonitored
} from '@/lib/tv/tvUtils'
import Button from '@/components/common/Button'
import useMutation from '@/lib/useMutation'

function useSonarrData() {
  const { params } = useQueryParams()
  const { data, mutate } = useTVDetails(params.id)

  return {
    sonarr: data && data.sonarr,
    mutate
  }
}

export default function TvDetails() {
  const { params } = useQueryParams()
  const { data, loading, error } = useTVDetails(params.id)
  const watchRegion =
    typeof navigator !== 'undefined' && navigator.language.split('-').pop().toUpperCase()

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
          <div className="px-1">
            <p className="text-3xl">Temporadas</p>
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

function SeasonCard({ season, firstSeason = 1 }) {
  const { sonarr, mutate } = useSonarrData()
  const monitored = isSeasonMonitored(sonarr, season.season_number)
  const MonitorStatusIcon = monitored ? BookmarkIcon : BookmarkIconOutline
  const monitorStatusTitle = monitored
    ? 'Eliminar de la lista de seguimiento'
    : 'Añadir a la lista de seguimiento'

  const [loading, runMutation] = useMutation(async () => {
    await editSonarrSeasonMonitoring(sonarr, season.season_number)
    await mutate()
  })

  function toggleMonitoring(ev) {
    ev.preventDefault()
    ev.stopPropagation()
    runMutation()
  }

  return (
    <section>
      <Disclosure defaultOpen={season.season_number === firstSeason}>
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
              <div className="flex-grow"></div>
              <Button
                hasIcon="only"
                background="bg-transparent hover:bg-gray-100"
                border="border-none"
                title="Lanzar tarea de búsqueda">
                <SearchIcon className="text-gray-500 w-6 h-6" />
              </Button>
              {loading ? (
                <Spinner color="blue-400" size={8} />
              ) : (
                <Button
                  hasIcon="only"
                  title={monitorStatusTitle}
                  background="bg-transparent hover:bg-gray-100"
                  border="border-none"
                  onClick={toggleMonitoring}>
                  <MonitorStatusIcon className="text-gray-500 w-6 h-6" />
                </Button>
              )}
            </Disclosure.Button>
            <Disclosure.Panel unmount>
              <SeasonDetails season={season} />
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </section>
  )
}

function SeasonDetails({ season }) {
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
      <ul className="rounded-b-xl py-1">
        {details.episodes.map(ep => (
          <EpisodeCard key={ep.id} ep={ep} />
        ))}
      </ul>
    </div>
  )
}

function EpisodeCard({ ep }) {
  const { sonarr, mutate } = useSonarrData()
  const sonarrEpisode = getSonarrEpisode(sonarr, ep.season_number, ep.episode_number)
  const monitored = sonarrEpisode?.monitored
  const MonitorStatusIcon = monitored ? BookmarkIcon : BookmarkIconOutline
  const monitorStatusTitle = monitored
    ? 'Eliminar de la lista de seguimiento'
    : 'Añadir a la lista de seguimiento'

  const hasFile = sonarrEpisode?.hasFile

  const [loading, updateMonitoring] = useMutation(async () => {
    await editSonarrEpisodeMonitoring(sonarrEpisode)
    await mutate()
  })

  function getFileLink(ep) {
    const base = 'https://cloud.fuken.xyz'
    const path = ep.episodeFile.path
    return `${base}/${path.replace('/media/completed', 'tv')}`
  }

  return (
    <li className="group px-4 py-3 md:flex items-start md:space-x-4 space-x-0 space-y-4 md:space-y-0">
      {ep.still_path && (
        <img
          className="w-full md:w-auto block mx-auto rounded-lg"
          alt="still"
          src={`${config.tmdbImageUrl}/w300${ep.still_path}`}
        />
      )}
      <div className="flex-grow">
        <div className="flex items-center space-x-2">
          <p>
            <span className="text-primary-600">
              Ep. {ep.episode_number} - {ep.name}
            </span>
            <br />
            <span className="text-gray-500 text-sm">
              {new Date(ep.air_date).toLocaleDateString()}
            </span>
          </p>
          <div className="flex-grow"></div>
          {hasFile && (
            <Button
              hasIcon="only"
              className="md:opacity-0 group-hover:opacity-100 transition-opacity"
              background="bg-transparent hover:bg-gray-100"
              border="border-none"
              title="Descargar archivo de video"
              as="a"
              href={getFileLink(sonarrEpisode)}>
              <LinkIcon className="text-gray-500 w-6 h-6" />
            </Button>
          )}
          <Button
            hasIcon="only"
            className="md:opacity-0 group-hover:opacity-100 transition-opacity"
            background="bg-transparent hover:bg-gray-100"
            border="border-none"
            title="Lanzar tarea de búsqueda">
            <SearchIcon className="text-gray-500 w-6 h-6" />
          </Button>
          {loading ? (
            <Spinner color="blue-400" size={8} />
          ) : (
            <Button
              hasIcon="only"
              className="md:opacity-0 group-hover:opacity-100 transition-opacity"
              background="bg-transparent hover:bg-gray-100"
              border="border-none"
              title={monitorStatusTitle}
              onClick={updateMonitoring}>
              <MonitorStatusIcon className="text-gray-500 w-6 h-6" />
            </Button>
          )}
        </div>
        <p className="mt-4 max-w-prose">{ep.overview}</p>
      </div>
    </li>
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
      <p className="mb-2 ml-1 leading-tight text-lg text-accent-100">Ahora en streaming en</p>
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
      <p className="my-2 ml-1 leading-tight text-sm text-gray-300">Data by JustWatch</p>
    </div>
  )
}

function PersonCard({ person }) {
  return (
    <li className="flex items-center space-x-2 bg-white text-gray-700 rounded-md shadow-md">
      <div className="m-2 w-20 h-20 rounded-full">
        <img
          alt="avatar"
          className="rounded-full w-full h-full object-cover"
          src={`${config.tmdbImageUrl}/w185${person.profile_path}`}
        />
      </div>
      <div>
        <p className="text-gray-500">{person.name}</p>
        <p className="text-lg font-medium mt-1">{person.character}</p>
      </div>
    </li>
  )
}
