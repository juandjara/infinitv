import useProfiles from '@/lib/settings/useProfiles'
import useTVDetails from '@/lib/tv/useTVDetails'
import { useQueryParams } from '@/lib/useQueryParams'
import { useEffect, useState } from 'react'
import Button from '../common/Button'
import Modal from '../common/Modal'
import Select from '../common/Select'
import SeasonMonitoringTable from './SeasonMonitoringTable'

const TYPE_OPTIONS = [
  {
    label: (
      <span>
        Estándar{' '}
        <small className="text-gray-500 text-xs">- episodios organizados en temporadas</small>
      </span>
    ),
    value: 'standard'
  },
  {
    label: (
      <span>
        Anime{' '}
        <small className="text-gray-500 text-xs">- episodios que usan numeración absoluta</small>
      </span>
    ),
    value: 'anime'
  }
]

export default function SeriesEditModal({ open, setOpen }) {
  const { params } = useQueryParams()
  const { data: profiles } = useProfiles()
  const { data: details } = useTVDetails(params.id)
  const sonarr = details && details.sonarr

  const [form, setForm] = useState({
    profile: null,
    type: 'standard'
  })

  useEffect(() => {
    setForm({
      ...sonarr,
      profileId: sonarr.profileId || null,
      seriesType: sonarr.seriesType || 'standard'
    })
  }, [sonarr])

  const selectedProfile = profiles.find(p => p.value === form.profileId)
  const selectedType = TYPE_OPTIONS.find(t => t.value === form.seriesType)

  function update(key, value) {
    setForm(form => ({ ...form, [key]: value }))
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
  }

  return (
    <Modal title="Editar serie" open={open} onClose={() => setOpen(false)}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Select
          className="w-full"
          label="Calidad"
          options={profiles}
          selected={selectedProfile}
          onChange={opt => update('profileId', opt.value)}
        />
        <Select
          className="w-full"
          label="Tipo de serie"
          options={TYPE_OPTIONS}
          selected={selectedType}
          onChange={opt => update('seriesType', opt.value)}
        />

        <div>
          <p className="text-sm text-gray-100 mb-1">Seguimiento</p>
          <SeasonMonitoringTable sonarr={form} onEdit={setForm} />
        </div>

        <div className="space-x-2 flex justify-start">
          <Button
            type="submit"
            border="border border-transparent"
            color="text-blue-900"
            background="bg-blue-100 hover:bg-blue-200">
            Confirmar
          </Button>
          <Button
            type="button"
            border="border border-transparent"
            background="bg-white bg-opacity-20 hover:bg-opacity-30"
            color="text-white"
            onClick={() => setOpen(false)}>
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  )
}
