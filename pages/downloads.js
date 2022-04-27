import Heading from '@/components/common/Heading'
import { imdbIdToTmdbId } from '@/lib/tv/tvUtils'
import useSonarrSeries from '@/lib/tv/useSonarrSeries'
import { useRouter } from 'next/router'

export default function Downloads() {
  const { series, loading } = useSonarrSeries()

  return (
    <div className="my-4 container mx-auto px-3">
      <header className="-mx-3 mt-16 mb-2 px-3 py-1 sticky top-0 z-10 flex">
        <Heading className="px-1">Mis series</Heading>
      </header>
      <main>
        {series.length === 0 && (
          <p className="my-6 font-medium text-lg">No hay ninguna descarga guardada</p>
        )}
        <ul className="grid grid-cols-cards gap-x-4 gap-y-4">
          {loading && (
            <>
              <SkeletonVideoCard />
              <SkeletonVideoCard />
              <SkeletonVideoCard />
            </>
          )}
          {series.map(s => (
            <li key={s.id}>
              <SonarrVideoCard item={s} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

function SkeletonVideoCard() {
  return (
    <div className="border border-gray-300 bg-gray-200 rounded-xl" style={{ height: 430 }}></div>
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
