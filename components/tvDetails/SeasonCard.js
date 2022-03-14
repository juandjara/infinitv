import { BookmarkIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/solid'
import { CloudDownloadIcon } from '@heroicons/react/outline'
import { BookmarkIcon as BookmarkIconOutline } from '@heroicons/react/outline'
import useMutation from '@/lib/useMutation'
import { editSonarrSeasonMonitoring, isSeasonMonitored, SEARCH_TASK_TITLE } from '@/lib/tv/tvUtils'
import { Disclosure } from '@headlessui/react'
import Button from '../common/Button'
import Spinner from '../common/Spinner'
import useSonarrDetails from '@/lib/tv/useSonarrDetails'
import SeasonDetails from './SeasonDetails'

export default function SeasonCard({ season, firstSeason = 1 }) {
  const { sonarr, mutate } = useSonarrDetails()
  const monitored = isSeasonMonitored(sonarr, season.season_number)
  const MonitorStatusIcon = monitored ? BookmarkIcon : BookmarkIconOutline
  const monitorStatusTitle = monitored
    ? 'Eliminar de la lista de seguimiento'
    : 'Añadir a la lista de seguimiento'

  const [loading, runMutation] = useMutation(async () => {
    await editSonarrSeasonMonitoring(sonarr, season.season_number)
    await mutate()
  })

  function toggleMonitoring(ev) {
    ev.preventDefault()
    ev.stopPropagation()
    runMutation()
  }

  return (
    <section>
      <Disclosure defaultOpen={season.season_number === firstSeason}>
        {({ open }) => (
          <>
            <Disclosure.Button
              className={[
                open ? 'rounded-t-xl' : 'rounded-xl',
                'flex text-left items-center w-full px-4 py-3 bg-opacity-80 bg-white text-primary-700'
              ].join(' ')}>
              {open ? (
                <ChevronDownIcon className="w-6 h-6 text-gray-500" />
              ) : (
                <ChevronRightIcon className="w-6 h-6 text-gray-500" />
              )}
              <div className="ml-2">
                <p>
                  T{season.season_number}: {season.name}
                </p>
                <p className="text-gray-500 text-sm">
                  {season.episode_count} Episodios
                  {season.air_date && ' - ' + new Date(season.air_date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex-grow"></div>
              <Button
                hasIcon="only"
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
                  title={monitorStatusTitle}
                  className="ml-2"
                  background="bg-transparent bg-gray-100 bg-opacity-50 hover:bg-opacity-100"
                  border="border-none"
                  onClick={toggleMonitoring}>
                  <MonitorStatusIcon className="text-gray-500 w-6 h-6" />
                </Button>
              )}
            </Disclosure.Button>
            <Disclosure.Panel unmount>
              <SeasonDetails season={season} />
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </section>
  )
}
