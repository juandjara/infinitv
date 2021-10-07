import { useState } from 'react'
import Button from '../common/Button'
import Label from '../common/Label'
import PasswordInput from '../password/PasswordInput'

const defaultSettings = {
  address: '',
  apikey: ''
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function RadarrSettings() {
  const [form, setForm] = useState(defaultSettings)

  function update(key, value) {
    setForm(form => ({ ...form, [key]: value }))
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
  }

  async function tryConnection() {
    try {
      const url = `${form.address}/api/system/status?apikey=${form.apikey}`
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

  const formReady = !!(form.address && form.apikey)

  return (
    <div className="p-6">
      <h2 className="text-2xl leading-8 font-bold mb-8">Ajustes de Radarr</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center space-x-6">
          <div className="max-w-md flex-1">
            <Label name="address" text="URL completa" />
            <input
              id="address"
              type="url"
              className={classNames(
                'w-full h-10 px-3 text-base text-gray-700 placeholder-gray-500 border border-gray-300 rounded-md',
                'focus:outline-none focus:ring-1 focus:ring-primary-700 focus:border-primary-700'
              )}
              placeholder="https://"
              value={form?.address || ''}
              onChange={ev => update('address', ev.target.value)}
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
            disabled={!formReady}
            border="border-none"
            background="bg-primary-500 hover:bg-primary-600"
            color="text-white">
            Guardar
          </Button>
          <Button
            onClick={tryConnection}
            disabled={!formReady}
            border="border-none"
            background="bg-green-500 hover:bg-green-600"
            color="text-white">
            Probar conexión
          </Button>
        </div>
      </form>
    </div>
  )
}