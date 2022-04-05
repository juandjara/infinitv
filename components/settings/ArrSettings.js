import { useEffect, useState } from 'react'
import { mutate } from 'swr'
import updateSettings from '@/lib/settings/updateSettings'
import { useAlert } from '@/components/alert/AlertContext'
import Button from '@/components/common/Button'
import Label from '@/components/common/Label'
import PasswordInput from '@/components/password/PasswordInput'
import axios from 'axios'
import useMutation from '@/lib/useMutation'
import { InformationCircleIcon } from '@heroicons/react/outline'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ArrSettings({ settings, settingsKey, label = '', description = '' }) {
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
    <form className="px-4 py-6 mb-6" onSubmit={handleSubmit}>
      {description && (
        <div className="bg-blue-50 text-blue-900 rounded-xl flex items-center p-3 space-x-3 mb-6">
          <InformationCircleIcon className="text-blue-900 w-12 h-12 p-3 bg-blue-200 rounded-full" />
          <p>{description}</p>
        </div>
      )}
      <div className="flex flex-wrap items-center md:space-x-4">
        <div className="flex-grow mb-6">
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
        <div className="flex-grow mb-6">
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
      <div className="flex items-center justify-end space-x-4">
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
