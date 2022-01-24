import config from '@/lib/config'
import useTVSeries from '@/lib/tv/useTVSeries'
import useTVGenres from '@/lib/tv/useTVGenres'
import { useQueryParams } from '@/lib/useQueryParams'
import SearchBox from '@/components/common/SearchBox'
import TVFiltersPanel from '@/components/filters/TVFiltersPanel'
import Button from '@/components/common/Button'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useSonarrSeries from '@/lib/tv/useSonarrSeries'
import Spinner from '@/components/common/Spinner'
import { imdbIdToTmdbId } from '@/lib/tv/tvUtils'

const tmdbImageURL = config.tmdbImageUrl

export default function TV() {
  const router = useRouter()
  const { params } = useQueryParams()
  const { genres } = useTVGenres()
  const page = Number(params.page || 1)
  const { series, loading, error } = useSonarrSeries()

  function handlePageChange(page) {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page }
    })
  }

  const pages = []
  for (let i = 1; i <= page; i++) {
    pages.push(<VideoPage genres={genres} page={i} key={i} />)
  }

  return (
    <div className="my-4 container mx-auto px-3">
      <section>
        <header className="-mx-3 mt-16 mb-2 px-3 py-1 sticky top-0 z-10 flex">
          <h1 className="px-1 flex-1 font-bold text-4xl leading-tight text-transparent bg-clip-text bg-gradient-to-br from-accent-700 to-accent-300">
            Mis series
          </h1>
        </header>
        <main>
          {loading && !error && (
            <div className="flex items-center justify-center py-6">
              <Spinner size={16} />
            </div>
          )}
          <ul className="grid grid-cols-cards gap-x-4 gap-y-4">
            {series.map(s => (
              <li key={s.id}>
                <SonarrVideoCard item={s} />
              </li>
            ))}
          </ul>
        </main>
      </section>
      <section>
        <header className="-mx-3 mt-16 mb-2 px-3 py-1 sticky top-0 z-10 flex">
          <h1 className="px-1 flex-1 font-bold text-4xl leading-tight text-transparent bg-clip-text bg-gradient-to-br from-accent-700 to-accent-300">
            Cat&aacute;logo de series
          </h1>
          <SearchBox route="/tv" />
          <TVFiltersPanel />
        </header>
        <main>
          <ul className="grid grid-cols-cards gap-x-4 gap-y-4">{pages}</ul>
          {page > 5 ? (
            <p className="text-center mx-auto mt-8 py-8 text-xl max-w-prose">
              ¿No encuentras lo que estás buscando? Prueba a usar el buscador en la esquina superior
              derecha
            </p>
          ) : (
            <Button className="block mx-auto my-6" onClick={() => handlePageChange(page + 1)}>
              Cargar más
            </Button>
          )}
        </main>
      </section>
    </div>
  )
}

function VideoPage({ page, genres }) {
  const { params } = useQueryParams()
  const query = new URLSearchParams({ ...params, page }).toString()
  const { data, loading } = useTVSeries(query)

  if (loading) {
    return (
      <>
        <SkeletonVideoCard />
        <SkeletonVideoCard />
        <SkeletonVideoCard />
      </>
    )
  }

  return data.map(d => (
    <li key={d.id}>
      <VideoCard item={d} genres={genres} />
    </li>
  ))
}

function SkeletonVideoCard() {
  return (
    <div className="border border-gray-300 bg-gray-200 rounded-xl" style={{ height: 430 }}></div>
  )
}

function VideoCard({ item, genres }) {
  function getGenreNames(ids) {
    return genres.filter(g => ids.indexOf(g.id) !== -1).map(g => g.name)
  }

  return (
    <Link href={`/tv/${item.id}`}>
      <a
        className="block relative h-full border border-gray-300 rounded-xl transition-transform transform-gpu scale-100 hover:scale-105 group"
        style={{ minHeight: 240 }}>
        <div className="h-full w-full">
          <img
            alt={item.name}
            src={`${tmdbImageURL}/w300/${item.poster_path}`}
            className="bg-gray-300 w-full h-full rounded-xl object-cover"
          />
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end absolute inset-0 w-full p-3 bg-gray-600 bg-opacity-60 rounded-xl">
          <p className="text-lg font-medium">
            {item.first_air_date && new Date(item.first_air_date).getFullYear()}
          </p>
          <p className="line-clamp-1">{getGenreNames(item.genre_ids).join(', ')}</p>
          <p className="text-2xl font-bold text-accent-100">{item.name}</p>
          <p className="mt-2 line-clamp-4">{item.overview}</p>
        </div>
      </a>
    </Link>
  )
}

function SonarrVideoCard({ item }) {
  const router = useRouter()
  const poster = item.images.find(i => i.coverType === 'poster').remoteUrl

  async function navigateSonarrLink() {
    const id = await imdbIdToTmdbId(item.imdbId)
    await router.push(`/tv/${id}`)
  }

  return (
    <div
      role="button"
      onClick={navigateSonarrLink}
      tabIndex="-1"
      onKeyUp={ev => ev.key === 'Enter' && navigateSonarrLink()}
      className="block relative h-full border border-gray-300 rounded-xl transition-transform transform-gpu scale-100 hover:scale-105 group"
      style={{ minHeight: 240 }}>
      <div className="h-full w-full">
        <img
          alt={item.title}
          src={poster}
          className="bg-gray-300 w-full h-full rounded-xl object-cover"
        />
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end absolute inset-0 w-full p-3 bg-gray-600 bg-opacity-60 rounded-xl">
        <p className="text-lg font-medium">{item.year}</p>
        <p className="line-clamp-1">{item.genres.join(', ')}</p>
        <p className="text-2xl font-bold text-accent-100">{item.title}</p>
        <p className="mt-2 line-clamp-4">{item.overview}</p>
      </div>
    </div>
  )
}
