import config from '@/lib/config'

export default function PersonCard({ person }) {
  return (
    <li className="flex px-1 items-center space-x-2 bg-white text-gray-700 rounded-md shadow-md">
      <div className="flex-shrink-0 m-2 w-20 h-20 rounded-full">
        <img
          alt="avatar"
          className="rounded-full w-full h-full object-cover"
          src={`${config.tmdbImageUrl}/w185${person.profile_path}`}
        />
      </div>
      <div className="px-1">
        <p className="text-gray-400">{person.name}</p>
        <p className="font-medium">{person.character}</p>
      </div>
    </li>
  )
}
