import Heading from '@/components/common/Heading'
import MediaServerSettings from '@/components/settings/MediaServerSettings'
import RadarrSettings from '@/components/settings/RadarrSettings'
import SonarrSettings from '@/components/settings/SonarrSettings'
import useSettings from '@/lib/settings/useSettings'
import { Tab } from '@headlessui/react'

const tabs = [
  { key: 'sonarr', label: 'Sonarr', component: SonarrSettings },
  { key: 'radarr', label: 'Radarr', component: RadarrSettings },
  { key: 'mediaServer', label: 'Media Server', component: MediaServerSettings }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Settings() {
  const { settings } = useSettings()

  return (
    <main className="flex-auto my-4 container mx-auto px-3">
      <Heading className="mb-4 mt-16">Ajustes</Heading>
      <Tab.Group>
        <Tab.List className="rounded-t-lg flex bg-white border-opacity-20 border-gray-500 border-b-2">
          {tabs.map(tab => (
            <Tab
              key={tab.label}
              style={{ marginBottom: -2 }}
              className={({ selected }) =>
                classNames(
                  'py-3 px-4 text-sm leading-5 font-medium',
                  'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-primary-400 ring-white ring-opacity-60',
                  selected
                    ? 'shadow text-primary-500 border-primary-500 border-b-2'
                    : 'text-gray-700 hover:bg-white hover:bg-opacity-20'
                )
              }>
              {tab.label}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {tabs.map(tab => (
            <Tab.Panel key={tab.label} className={classNames('bg-white rounded-b-lg')}>
              {<tab.component settingsKey={tab.key} settings={settings} />}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </main>
  )
}
