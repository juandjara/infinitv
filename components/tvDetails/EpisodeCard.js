import { editSonarrEpisodeMonitoring, getSonarrEpisode } from '@/lib/tv/tvUtils'
import useSonarrDetails from '@/lib/tv/useSonarrDetails'
import useMutation from '@/lib/useMutation'
import config from '@/lib/config'
import { useSettings } from '@/lib/settings/useSettings'
import ActionsMenu from './ActionsMenu'

export default function EpisodeCard({ ep }) {
  const { settings } = useSettings()
  const { sonarr, mutate } = useSonarrDetails()
  const sonarrEpisode = getSonarrEpisode(sonarr, ep.season_number, ep.episode_number)
  const monitored = sonarrEpisode?.monitored

  const [loading, updateMonitoring] = useMutation(async () => {
    await editSonarrEpisodeMonitoring(sonarrEpisode)
    await mutate()
  })

  function getFileLink() {
    if (!sonarrEpisode?.hasFile) {
      return null
    }

    // TODO make this '/hdd' configurable
    const path = sonarrEpisode.episodeFile.path.replace('/hdd', '')
    return settings.fileServer ? `${settings.fileServer}${path}` : ''
  }

  return (
    <li className="px-4 py-3 md:flex items-center md:space-x-3 space-x-0 space-y-3 md:space-y-0">
      {ep.still_path && (
        <img
          className="w-full md:w-auto block mx-auto rounded-lg"
          alt="still"
          src={`${config.tmdbImageUrl}/w300${ep.still_path}`}
        />
      )}
      <div className="flex-grow flex items-start space-x-2">
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
          <ActionsMenu
            loading={loading}
            monitored={monitored}
            fileLink={getFileLink()}
            updateMonitoring={updateMonitoring}
          />
        )}
      </div>
    </li>
  )
}
