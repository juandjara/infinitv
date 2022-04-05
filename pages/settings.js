import Heading from '@/components/common/Heading'
import MediaServerSettings from '@/components/settings/MediaServerSettings'
import ArrSettings from '@/components/settings/ArrSettings'
import { useSettings } from '@/lib/settings/useSettings'

export default function Settings() {
  const { settings } = useSettings()

  return (
    <main className="flex-auto my-4 container max-w-screen-md mx-auto px-3">
      <Heading className="mb-4 mt-16">Ajustes</Heading>
      <div className="bg-white rounded-lg">
        <ArrSettings settingsKey="sonarr" label="Sonarr" settings={settings} />
        <ArrSettings settingsKey="radarr" label="Radarr" settings={settings} />
        <MediaServerSettings settingsKey="fileServer" settings={settings} />
      </div>
    </main>
  )
}
