import { useAlert } from '@/components/alert/AlertContext'
import { SearchIcon } from '@heroicons/react/solid'
import { useEffect } from 'react'
import useSWR from 'swr'

const tmdbURL = process.env.NEXT_PUBLIC_TMDB_URL
const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_KEY
const tmdbImageURL = process.env.NEXT_PUBLIC_TMBD_IMAGE_URL

async function fetchTVFromTMDB() {
  const url = `${tmdbURL}/trending/tv/week?api_key=${tmdbApiKey}`
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
        <div className="relative mt-4 mb-6">
          <SearchIcon className="w-5 h-5 absolute top-1/2 left-4 text-gray-400" style={{ transform: 'translateY(-50%)' }} />
          <input
            type="search"
            placeholder="Search TV"
            className="w-full text-xl bg-white rounded-xl pl-10 pr-6 py-4 text-gray-700"
          />
        </div>
        <ul className="grid grid-cols-cards gap-x-6 gap-y-4">
          {data.map(d => (
            <li key={d.id}>
              <VideoCard {...d} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

function VideoCard(d) {
  return (
    <div className="relative border border-gray-300 rounded" style={{ minHeight: 240 }}>
      <div className="w-full">
        <img src={`${tmdbImageURL}/w300/${d.poster_path}`} className="w-full h-full rounded object-cover" />
      </div>
      <div className="absolute bottom-0 left-0 w-full p-2 bg-white bg-opacity-50 rounded-b-md">
        <p className="text-primary-100">{d.name}</p>
      </div>
    </div>
  )
}
