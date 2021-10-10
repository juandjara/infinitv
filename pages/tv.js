import { useAlert } from '@/components/alert/AlertContext'
import { SearchIcon } from '@heroicons/react/solid'
import { useEffect } from 'react'
import useSWR from 'swr'

const tmdbURL = process.env.NEXT_PUBLIC_TMDB_URL
const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_KEY
const tmdbImageURL = process.env.NEXT_PUBLIC_TMBD_IMAGE_URL

async function fetchTVFromTMDB() {
  const url = `${tmdbURL}/trending/tv/week?api_key=${tmdbApiKey}&language=${navigator.language}`
  const res = await fetch(url)
  if (res.ok) {
    const data = await res.json()
    console.log(data.results)
    return data.results
  } else {
    throw new Error(`Request failed with status code ${res.status}`)
  }
}

function useTVSeries() {
  const { data, error } = useSWR('tvseries', fetchTVFromTMDB, { revalidateOnFocus: false })
  const { setAlert } = useAlert()

  useEffect(() => {
    if (error) {
      setAlert(error.message)
    }
  }, [setAlert, error])

  return {
    data: data || [],
    loading: !error && !data,
    error
  }
}

export default function TV() {
  const { data } = useTVSeries()

  return (
    <div className="h-screen overflow-y-auto flex-auto">
      <main className="my-4 container mx-auto px-3">
        <h1 className="mt-16 font-bold text-4xl leading-tight text-transparent bg-clip-text bg-gradient-to-br from-primary-700 to-primary-300">
          Series
        </h1>
        <div className="relative mt-2 mb-6">
          <SearchIcon className="w-5 h-5 absolute top-1/2 left-4 text-gray-400" style={{ transform: 'translateY(-50%)' }} />
          <input
            type="search"
            placeholder="Buscar en la lista"
            className="w-full text-xl rounded-xl pl-12 pr-6 py-4 bg-white text-gray-700 placeholder-gray-500 placeholder-opacity-50"
          />
        </div>
        <ul className="grid grid-cols-cards gap-x-4 gap-y-4">
          {data.map(d => (
            <li key={d.id}>
              <VideoCard item={d} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

function VideoCard({ item }) {
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
    <div className="transition-transform transform-gpu scale-100 hover:scale-105 group relative border border-gray-300 rounded-xl" style={{ minHeight: 240 }} onClick={checkSonarr}>
      <div className="w-full">
        <img src={`${tmdbImageURL}/w300/${item.poster_path}`} className="w-full h-full rounded-xl object-cover" />
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end absolute inset-0 w-full p-3 bg-gray-500 bg-opacity-50 rounded-xl">
        <p className="text-lg font-medium">{new Date(item.first_air_date).getFullYear()}</p>
        <p className="text-2xl font-bold text-primary-100">{item.name}</p>
        <p className="mt-1 line-clamp-4">{item.overview}</p>
      </div>
    </div>
  )
}
