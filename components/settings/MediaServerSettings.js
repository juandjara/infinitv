import { useEffect, useState } from 'react'
import { mutate } from 'swr'
import updateSettings from '@/lib/settings/updateSettings'
import { useAlert } from '@/components/alert/AlertContext'
import Button from '@/components/common/Button'
import Label from '@/components/common/Label'
import useMutation from '@/lib/useMutation'
import axios from 'axios'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function MediaServerSettings({ settings, settingsKey }) {
  const sectionSettings = settings[settingsKey]
  const [url, setURL] = useState(sectionSettings)
  const { setAlert } = useAlert()

  const [saveLoading, saveSettings] = useMutation(() => {
    return mutate('settings', async settings => {
      const newSettings = {
        ...settings,
        [settingsKey]: url
      }
      await updateSettings(newSettings)
      return newSettings
    })
  })

  const [testLoading, testConnection] = useMutation(async () => {
    const { data } = await axios.get(url)
    console.log(data)
    setAlert({ type: 'success', text: 'Todo bien 👌' })
  })

  useEffect(() => {
    setURL(sectionSettings)
  }, [sectionSettings])

  async function handleSubmit(ev) {
    ev.preventDefault()
    saveSettings()
  }

  const formReady = !saveLoading && !!url

  return (
    <form className="p-4 pt-8" onSubmit={handleSubmit}>
      <div className="max-w-md flex-1">
        <Label name="url" text="File Server URL" />
        <input
          id="url"
          type="url"
          className={classNames(
            'w-full h-10 px-3 text-base text-gray-700 placeholder-gray-500 border border-gray-300 rounded-md',
            'focus:outline-none focus:ring-1 focus:ring-primary-700 focus:border-primary-700'
          )}
          placeholder="https://"
          value={url}
          onChange={ev => setURL(ev.target.value)}
          required
        />
      </div>
      <div className="flex items-center justify-end space-x-4 mt-6">
        <Button
          type="button"
          onClick={testConnection}
          disabled={!formReady || testLoading}
          background="bg-blue-50 hover:bg-blue-100"
          border="border-none">
          Probar conexión
        </Button>
        <Button
          type="submit"
          disabled={!formReady}
          border="border-none"
          background="bg-primary-500 hover:bg-primary-600"
          color="text-white">
          Guardar
        </Button>
      </div>
    </form>
  )
}
