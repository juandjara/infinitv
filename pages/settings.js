import Heading from '@/components/common/Heading'
import MediaServerSettings from '@/components/settings/MediaServerSettings'
import ArrSettings from '@/components/settings/ArrSettings'
import useSettings from '@/lib/settings/useSettings'

export default function Settings() {
  const { settings } = useSettings()

  return (
    <main className="flex-auto">
      <Heading className="mb-4 mt-16 max-w-screen-md mx-auto">Ajustes</Heading>
      <div className="bg-white rounded-lg max-w-screen-md mx-auto space-y-4">
        <ArrSettings settingsKey="sonarr" label="Sonarr" settings={settings} />
        <ArrSettings settingsKey="radarr" label="Radarr" settings={settings} />
        <MediaServerSettings settingsKey="fileServer" settings={settings} />
      </div>
    </main>
  )
}
