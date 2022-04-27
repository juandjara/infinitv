import { editSonarrEpisodeMonitoring, getSonarrEpisode, SEARCH_TASK_TITLE } from '@/lib/tv/tvUtils'
import useSonarrDetails from '@/lib/tv/useSonarrDetails'
import useMutation from '@/lib/useMutation'
import { BookmarkIcon, LinkIcon } from '@heroicons/react/solid'
import { CloudDownloadIcon, BookmarkIcon as BookmarkIconOutline } from '@heroicons/react/outline'
import config from '@/lib/config'
import Button from '../common/Button'
import Spinner from '../common/Spinner'
import { useSettings } from '@/lib/settings/useSettings'

export default function EpisodeCard({ ep }) {
  const { settings } = useSettings()
  const { sonarr, mutate } = useSonarrDetails()
  const sonarrEpisode = getSonarrEpisode(sonarr, ep.season_number, ep.episode_number)
  const monitored = sonarrEpisode?.monitored
  const MonitorStatusIcon = monitored ? BookmarkIcon : BookmarkIconOutline
  const monitorStatusTitle = monitored
    ? 'Eliminar de la lista de seguimiento'
    : 'Añadir a la lista de seguimiento'

  const hasFile = sonarrEpisode?.hasFile

  const [loading, updateMonitoring] = useMutation(async () => {
    await editSonarrEpisodeMonitoring(sonarrEpisode)
    await mutate()
  })

  function getFileLink(ep) {
    // TODO make this '/hdd' configurable
    const path = ep.episodeFile.path.replace('/hdd', '')
    return settings.fileServer ? `${settings.fileServer}${path}` : ''
  }

  return (
    <li className="group px-4 py-3 md:flex items-center md:space-x-3 space-x-0 space-y-3 md:space-y-0">
      {ep.still_path && (
        <img
          className="w-full md:w-auto block mx-auto rounded-lg"
          alt="still"
          src={`${config.tmdbImageUrl}/w300${ep.still_path}`}
        />
      )}
      <div className="flex-grow">
        <p className="flex items-center space-x-2">
          <span className="text-primary-600">
            Ep. {ep.episode_number} - {ep.name}
          </span>
          <br />
          <span className="text-gray-500 text-sm">
            {new Date(ep.air_date).toLocaleDateString()}
          </span>
        </p>
        <p className="mt-2 max-w-prose">{ep.overview}</p>
      </div>
      {sonarr?.isSaved && (
        <>
          <div className="flex items-center justify-end">
            {hasFile && (
              <Button
                hasIcon="only"
                className="md:opacity-0 group-hover:opacity-100 transition-opacity"
                background="bg-transparent bg-gray-100 bg-opacity-50 hover:bg-opacity-100"
                border="border-none"
                title="Descargar archivo de video"
                as="a"
                href={getFileLink(sonarrEpisode)}>
                <LinkIcon className="text-gray-500 w-6 h-6" />
              </Button>
            )}
            <Button
              hasIcon="only"
              className="ml-2 md:opacity-0 group-hover:opacity-100 transition-opacity"
              background="bg-transparent bg-gray-100 bg-opacity-50 hover:bg-opacity-100"
              border="border-none"
              title={SEARCH_TASK_TITLE}>
              <CloudDownloadIcon className="text-gray-500 w-6 h-6" />
            </Button>
            {loading ? (
              <Spinner color="blue-400" size={8} />
            ) : (
              <Button
                hasIcon="only"
                className="ml-2 md:opacity-0 group-hover:opacity-100 transition-opacity"
                background="bg-transparent bg-gray-100 bg-opacity-50 hover:bg-opacity-100"
                border="border-none"
                title={monitorStatusTitle}
                onClick={updateMonitoring}>
                <MonitorStatusIcon className="text-gray-500 w-6 h-6" />
              </Button>
            )}
          </div>
        </>
      )}
    </li>
  )
}
