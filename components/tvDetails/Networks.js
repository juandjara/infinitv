import Link from 'next/link'
import config from '@/lib/config'

export default function Networks({ networks }) {
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
