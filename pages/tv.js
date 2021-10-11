import config from '@/lib/config'
import useTVSeries from '@/lib/useTVSeries'
import useTVGenres from '@/lib/useTVGenres'
import { useEffect } from 'react'
import { useQueryParams } from '@/lib/useQueryParams'
import SearchBox from '@/components/common/SearchBox'
import TVFiltersPanel from '@/components/tv/TVFiltersPanel'

const tmdbImageURL = config.tmdbImageUrl

export default function TV() {
  const { query } = useQueryParams()
  const { data } = useTVSeries(query)
  const { genres } = useTVGenres()

  useEffect(() => {
    console.log(genres)
  }, [genres])

  return (
    <main className="my-4 container mx-auto px-3">
      <header className="mt-16 mb-2 flex">
        <h1 className="flex-1 font-bold text-4xl leading-tight text-transparent bg-clip-text bg-gradient-to-br from-primary-700 to-primary-300">
          Series
        </h1>
        <SearchBox route="/tv" />
        <TVFiltersPanel />
      </header>
      <ul className="grid grid-cols-cards gap-x-4 gap-y-4">
        {data.map(d => (
          <li key={d.id}>
            <VideoCard item={d} genres={genres} />
          </li>
        ))}
      </ul>
    </main>
  )
}

function VideoCard({ item, genres }) {
  function getGenreNames(ids) {
    return genres.filter(g => ids.indexOf(g.id) !== -1).map(g => g.name)
  }

  async function checkSonarr() {
    const res = await fetch('/api/sonarr/series')
    if (res.ok) {
      const json = await res.json()
      console.log(json)
    } else {
      console.error(`Request failed with status code ${res.status}`)
    }
  }

  return (
    <div
      className="transition-transform transform-gpu scale-100 hover:scale-105 group relative border border-gray-300 rounded-xl"
      style={{ minHeight: 240 }}
      onClick={checkSonarr}>
      <div className="w-full">
        <img
          alt={item.name}
          src={`${tmdbImageURL}/w300/${item.poster_path}`}
          className="w-full h-full rounded-xl object-cover"
        />
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end absolute inset-0 w-full p-3 bg-gray-600 bg-opacity-60 rounded-xl">
        <p className="text-lg font-medium">
          {item.first_air_date && new Date(item.first_air_date).getFullYear()}
        </p>
        <p className="line-clamp-1">{getGenreNames(item.genre_ids).join(', ')}</p>
        <p className="text-2xl font-bold text-primary-100">{item.name}</p>
        <p className="mt-2 line-clamp-4">{item.overview}</p>
      </div>
    </div>
  )
}
