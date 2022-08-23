import Heading from '@/components/common/Heading'
import config from '@/lib/config'
import useTVSeries from '@/lib/tv/useTVSeries'
import useTVGenres from '@/lib/tv/useTVGenres'
import { useQueryParams } from '@/lib/useQueryParams'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { imdbIdToTmdbId } from '@/lib/tv/tvUtils'
import useSonarrSeries from '@/lib/tv/useSonarrSeries'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/solid'
import { ArrowCircleRightIcon } from '@heroicons/react/outline'
import { useRef } from 'react'
import useMovieGenres from '@/lib/movies/useMovieGenres'
import useMovies from '@/lib/movies/useMovies'

const tmdbImageURL = config.tmdbImageUrl

export default function Index() {
  return (
    <div className="my-4 container mx-auto px-3 md:px-6">
      {/* <section>
        <Heading className="mt-16 px-1">Mis series</Heading>
      </section> */}
      <section>
        <header className="mt-16 mb-2 flex items-center justify-between">
          <Heading className="px-1">Añadido recientemente</Heading>
          <ArrowCircleRightIcon className="h-8 w-8" />
        </header>
        <SonarrSeries />
      </section>
      <section>
        <header className="mt-16 mb-2 flex items-center justify-between">
          <Heading className="px-1">Tendencias en series</Heading>
          <ArrowCircleRightIcon className="h-8 w-8" />
        </header>
        <TrendingSeries />
      </section>
      <section>
        <header className="mt-16 mb-2 flex items-center justify-between">
          <Heading className="px-1">Tendencias en peliculas</Heading>
          <ArrowCircleRightIcon className="h-8 w-8" />
        </header>
        <TrendingMovies />
      </section>
    </div>
  )
}

const CARD_WIDTH = 240
const CARD_HEIGHT = 350

function Scroller({ children, ...props }) {
  const ulRef = useRef()

  function scrollUL(amount) {
    if (ulRef.current) {
      ulRef.current.scrollBy({ left: amount, behavior: 'smooth' })
    }
  }

  return (
    <div className="relative" {...props}>
      <ul
        ref={ulRef}
        style={{ WebkitOverflowScrolling: 'touch' }}
        className="hide-scrollbar py-2 flex items-stretch justify-start overflow-x-auto max-w-full space-x-4">
        {children}
      </ul>
      <div className="pointer-events-none absolute inset-0 w-full h-full flex items-center justify-between">
        <button
          onClick={() => scrollUL(-CARD_WIDTH)}
          className="pointer-events-auto -ml-3 md:-ml-6 rounded-full p-2 bg-opacity-20 text-white bg-gray-200 hover:bg-opacity-50">
          <p className="sr-only">Scroll Left</p>
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <button
          onClick={() => scrollUL(CARD_WIDTH)}
          className="pointer-events-auto -mr-3 md:-mr-6 rounded-full p-2 bg-opacity-20 text-white bg-gray-200 hover:bg-opacity-50">
          <p className="sr-only">Scroll Right</p>
          <ArrowRightIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

function SonarrSeries() {
  const { series, loading } = useSonarrSeries()

  return (
    <Scroller>
      {loading && (
        <>
          <SkeletonVideoCard />
          <SkeletonVideoCard />
          <SkeletonVideoCard />
        </>
      )}
      {series.map(s => (
        <li key={s.id} className="flex-shrink-0 w-60">
          <SonarrVideoCard item={s} />
        </li>
      ))}
    </Scroller>
  )
}

function TrendingSeries() {
  const { genres } = useTVGenres()
  const { params } = useQueryParams()
  const query = new URLSearchParams({ ...params, page: 1 }).toString()
  const { data, loading } = useTVSeries(query)

  let children

  if (loading) {
    children = (
      <>
        <SkeletonVideoCard />
        <SkeletonVideoCard />
        <SkeletonVideoCard />
      </>
    )
  } else {
    children = data.map(d => (
      <li key={d.id} className="flex-shrink-0 w-60">
        <VideoCard item={d} genres={genres} />
      </li>
    ))
  }

  return <Scroller>{children}</Scroller>
}

function TrendingMovies() {
  const { genres } = useMovieGenres()
  const { params } = useQueryParams()
  const query = new URLSearchParams({ ...params, page: 1 }).toString()
  const { data, loading } = useMovies(query)

  let children

  if (loading) {
    children = (
      <>
        <SkeletonVideoCard />
        <SkeletonVideoCard />
        <SkeletonVideoCard />
      </>
    )
  } else {
    children = data.map(d => (
      <li key={d.id} className="flex-shrink-0 w-60">
        <VideoCard item={d} genres={genres} />
      </li>
    ))
  }

  return <Scroller>{children}</Scroller>
}

function SkeletonVideoCard() {
  return (
    <div
      className="border border-gray-300 bg-gray-200 rounded-xl"
      style={{ height: CARD_HEIGHT, width: CARD_WIDTH }}></div>
  )
}

function VideoCard({ item, genres }) {
  function getGenreNames(ids) {
    return genres.filter(g => ids.indexOf(g.id) !== -1).map(g => g.name)
  }

  const date = item.first_air_date || item.release_date
  const name = item.name || item.title

  return (
    <Link href={`/tv/${item.id}`}>
      <a
        className="block relative h-full border border-gray-300 rounded-xl transition-transform transform-gpu scale-100 hover:scale-105 group"
        style={{ minHeight: 240 }}>
        <div className="w-full h-full">
          <img
            alt={item.name}
            src={`${tmdbImageURL}/w300/${item.poster_path}`}
            className="w-full h-full rounded-xl object-cover"
          />
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end absolute inset-0 w-full p-3 bg-gray-600 bg-opacity-60 rounded-xl">
          <p className="text-lg font-medium">{date && new Date(date).getFullYear()}</p>
          <p className="line-clamp-1">{getGenreNames(item.genre_ids).join(', ')}</p>
          <p className="text-2xl font-bold text-accent-100">{name}</p>
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

// export function getServerSideProps() {
//   return {
//     redirect: {
//       destination: '/tv'
//     }
//   }
// }
