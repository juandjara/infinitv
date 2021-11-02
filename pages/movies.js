import config from '@/lib/config'
import useMovies from '@/lib/movies/useMovies'
import useMovieGenres from '@/lib/movies/useMovieGenres'
import { useQueryParams } from '@/lib/useQueryParams'
import SearchBox from '@/components/common/SearchBox'
import MoviesFiltersPanel from '@/components/filters/MoviesFilterPanel'
import Link from 'next/link'
import Button from '@/components/common/Button'
import { useRouter } from 'next/router'

const tmdbImageURL = config.tmdbImageUrl

export default function Movies() {
  const router = useRouter()
  const { params } = useQueryParams()
  const { genres } = useMovieGenres()
  const page = Number(params.page || 1)

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
    <main className="my-4 container mx-auto px-3">
      <header className="-mx-3 mt-16 mb-2 px-3 py-1 sticky top-0 z-10 flex">
        <h1 className="flex-1 font-bold text-4xl leading-tight text-transparent bg-clip-text bg-gradient-to-br from-accent-700 to-accent-300">
          Películas
        </h1>
        <SearchBox route="/movies" />
        <MoviesFiltersPanel />
      </header>
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
  )
}

function VideoPage({ page, genres }) {
  const { params } = useQueryParams()
  const query = new URLSearchParams({ ...params, page }).toString()
  const { data, loading } = useMovies(query)

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

  // async function checkSonarr() {
  //   const res = await fetch('/api/sonarr/series')
  //   if (res.ok) {
  //     const json = await res.json()
  //     console.log(json)
  //   } else {
  //     console.error(`Request failed with status code ${res.status}`)
  //   }
  // }

  return (
    <Link href={`/movies/${item.id}`}>
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
          <p className="text-lg font-medium">
            {item.release_date && new Date(item.release_date).getFullYear()}
          </p>
          <p className="line-clamp-1">{getGenreNames(item.genre_ids).join(', ')}</p>
          <p className="text-2xl font-bold text-accent-100">{item.title}</p>
          <p className="mt-2 line-clamp-4">{item.overview}</p>
        </div>
      </a>
    </Link>
  )
}
