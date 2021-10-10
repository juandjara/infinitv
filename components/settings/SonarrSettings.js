import { useEffect, useState } from 'react'
import { mutate } from 'swr'
import updateSettings from '@/lib/settings/updateSettings'
import { useAlert } from '@/components/alert/AlertContext'
import Button from '@/components/common/Button'
import Label from '@/components/common/Label'
import PasswordInput from '@/components/password/PasswordInput'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function SonarrSettings({ settings, settingsKey }) {
  const sectionSettings = settings[settingsKey]
  const [form, setForm] = useState(sectionSettings)
  const [loading, setLoading] = useState(false)
  const { setAlert } = useAlert()

  useEffect(() => {
    setForm(sectionSettings)
  }, [sectionSettings])

  function update(key, value) {
    setForm(form => ({ ...form, [key]: value }))
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    setLoading(true)
    try {
      await mutate('settings', async settings => {
        const newSettings = {
          ...settings,
          [settingsKey]: form
        }
        await updateSettings(newSettings)
        return newSettings
      })
    } catch (err) {
      console.error(err)
      setAlert(err.message)
    }
    setLoading(false)
  }

  async function tryConnection() {
    try {
      const url = `${form.url}/api/system/status?apikey=${form.apikey}`
      const res = await fetch(url)
      if (res.ok) {
        const status = await res.json()
        console.log(status)
        alert('Connection OK!')
      } else {
        console.error(res)
        alert('Connection Error!')
      }
    } catch (err) {
      console.error(err)
      alert('Connection Error!')
    }
  }

  const formReady = !loading && !!(form.url && form.apikey)

  return (
    <form className="p-4 pt-8" onSubmit={handleSubmit}>
      <div className="flex items-center space-x-6">
        <div className="max-w-md flex-1">
          <Label name="url" text="URL completa" />
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
          <Label name="apikey" text="API Key" />
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
      <div className="flex space-x-4 mt-6">
        <Button
          type="submit"
          disabled={!formReady}
          border="border-none"
          background="bg-primary-500 hover:bg-primary-600"
          color="text-white">
          Guardar
        </Button>
        <Button
          type="button"
          onClick={tryConnection}
          disabled={!formReady}
          border="border-none"
          background="bg-green-500 hover:bg-green-600"
          color="text-white">
          Probar conexión
        </Button>
      </div>
    </form>
  )
}
