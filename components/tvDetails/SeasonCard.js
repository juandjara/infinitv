import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/solid'
import useMutation from '@/lib/useMutation'
import { editSonarrSeasonMonitoring, isSeasonMonitored } from '@/lib/tv/tvUtils'
import { Disclosure } from '@headlessui/react'
import useSonarrDetails from '@/lib/tv/useSonarrDetails'
import SeasonDetails from './SeasonDetails'
import ActionsMenu from './ActionsMenu'
import { useContext } from 'react'
import { ModalContext } from '../common/Modal'

export default function SeasonCard({ season, firstSeason = 1 }) {
  const { sonarr, mutate } = useSonarrDetails()
  const monitored = isSeasonMonitored(sonarr, season.season_number)
  const setModal = useContext(ModalContext)

  const [loading, updateSeasonMonitoring] = useMutation(async () => {
    await editSonarrSeasonMonitoring(sonarr, season.season_number)
    await mutate()
  })

  function toggleHistory() {
    setModal({ key: 'history', data: { type: 'season', season } })
  }

  return (
    <section>
      <Disclosure defaultOpen={season.season_number === firstSeason}>
        {({ open }) => (
          <>
            <div
              className={[
                open ? 'rounded-t-xl' : 'rounded-xl',
                'flex items-center w-full px-4 py-3 bg-opacity-80 bg-white text-primary-700'
              ].join(' ')}>
              <Disclosure.Button className="text-left flex items-center flex-grow">
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
              </Disclosure.Button>
              {sonarr?.isSaved && (
                <ActionsMenu
                  loading={loading}
                  monitored={monitored}
                  updateMonitoring={updateSeasonMonitoring}
                  toggleHistory={toggleHistory}
                />
              )}
            </div>
            <Disclosure.Panel unmount={false}>
              <SeasonDetails season={season} />
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </section>
  )
}
