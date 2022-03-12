import config from '@/lib/config'

export default function PersonCard({ person }) {
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
