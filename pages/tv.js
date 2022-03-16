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
import { tmdbIdToImdbId } from '@/lib/tv/tvUtils'
import { useState } from 'react'
import { CheckIcon } from '@heroicons/react/outline'
import useMutation from '@/lib/useMutation'

const tmdbImageURL = config.tmdbImageUrl

export default function TV() {
  const router = useRouter()
  const { params } = useQueryParams()
  const { genres } = useTVGenres()
  const page = Number(params.page || 1)

  function handlePageChange(page) {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, page }
      },
      null,
      { scroll: false }
    )
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
  const [imdbId, setImdbId] = useState(null)
  const [loading, fetchImdbId] = useMutation(async () => {
    const id = await tmdbIdToImdbId(item.id)
    setImdbId(id)
  })

  const { series: sonarr } = useSonarrSeries()

  const isSelected = sonarr.find(s => s.imdbId === imdbId)

  function getGenreNames(ids) {
    return genres.filter(g => ids.indexOf(g.id) !== -1).map(g => g.name)
  }

  function handleHover() {
    if (!imdbId && !loading) {
      fetchImdbId()
    }
  }

  return (
    <Link href={`/tv/${item.id}`}>
      <a
        className="block relative h-full border border-gray-300 rounded-xl transition-transform transform-gpu scale-100 hover:scale-105 group"
        style={{ minHeight: 240 }}>
        <div className="h-full w-full overflow-hidden relative rounded-xl">
          <img
            alt={item.name}
            src={`${tmdbImageURL}/w300/${item.poster_path}`}
            className="bg-gray-300 w-full h-full rounded-xl object-cover"
          />
          {isSelected ? (
            <div
              style={{ border: '48px solid transparent', borderTopColor: 'rgb(59, 130, 246)' }}
              className="absolute top-0 right-0 w-0 h-0 bg-transparent transform translate-x-1/2">
              <CheckIcon className="w-6 h-6" style={{ transform: 'translate(-26px, -46px)' }} />
            </div>
          ) : null}
        </div>
        <div
          onMouseEnter={handleHover}
          className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end absolute inset-0 w-full p-3 bg-gray-600 bg-opacity-60 rounded-xl">
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
