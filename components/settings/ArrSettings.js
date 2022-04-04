import { useEffect, useState } from 'react'
import { mutate } from 'swr'
import updateSettings from '@/lib/settings/updateSettings'
import { useAlert } from '@/components/alert/AlertContext'
import Button from '@/components/common/Button'
import Label from '@/components/common/Label'
import PasswordInput from '@/components/password/PasswordInput'
import axios from 'axios'
import useMutation from '@/lib/useMutation'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ArrSettings({ settings, settingsKey, label = '' }) {
  const sectionSettings = settings[settingsKey]
  const [form, setForm] = useState(sectionSettings)
  const { setAlert } = useAlert()

  const [saveLoading, saveSettings] = useMutation(() => {
    return mutate('settings', async settings => {
      const newSettings = {
        ...settings,
        [settingsKey]: form
      }
      await updateSettings(newSettings)
      return newSettings
    })
  })

  const [testLoading, testConnection] = useMutation(async () => {
    const url = `${form.url}/api/system/status?apikey=${form.apikey}`
    const { data } = await axios.get(url)
    console.log(data)
    setAlert({ type: 'success', text: 'Todo bien 👌' })
  })

  useEffect(() => {
    setForm(sectionSettings)
  }, [sectionSettings])

  function update(key, value) {
    setForm(form => ({ ...form, [key]: value }))
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    saveSettings()
  }

  const formReady = !saveLoading && !!(form.url && form.apikey)

  return (
    <form className="p-4 pt-8" onSubmit={handleSubmit}>
      <div className="flex items-center space-x-6">
        <div className="max-w-md flex-1">
          <Label name="url" text={`${label} URL`} />
          <input
            id="url"
            type="url"
            className={classNames(
              'w-full h-10 px-3 text-base text-gray-700 placeholder-gray-500 border border-gray-300 rounded-md',
              'focus:outline-none focus:ring-1 focus:ring-primary-700 focus:border-primary-700'
            )}
            placeholder="https://"
            value={form?.url || ''}
            onChange={ev => update('url', ev.target.value)}
            required
          />
        </div>
        <div className="max-w-md flex-1">
          <Label name="apikey" text={`${label} API Key`} />
          <PasswordInput
            id="apikey"
            placeholder="****"
            showMeter={false}
            value={form?.apikey || ''}
            onChange={ev => update('apikey', ev)}
            required
          />
        </div>
      </div>
      <div className="flex items-center justify-end space-x-4 mt-8">
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