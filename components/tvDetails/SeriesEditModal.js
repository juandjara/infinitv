import useProfiles from '@/lib/settings/useProfiles'
import useTVDetails from '@/lib/tv/useTVDetails'
import { useQueryParams } from '@/lib/useQueryParams'
import { useEffect, useState } from 'react'
import Button from '../common/Button'
import Modal from '../common/Modal'
import Select from '../common/Select'

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

const MONITOR_OPTIONS = [
  { label: 'Primera temporada', value: 'first_season' },
  { label: 'Última temporada', value: 'last_season' },
  { label: 'Solo el primer episodio', value: 'pilot' },
  { label: 'Episodios futuros', value: 'future' },
  { label: 'Todo', value: 'all' }
]

function getMonitoringOption() {
  return 'all'
}

export default function SeriesEditModal({ open, setOpen }) {
  const { params } = useQueryParams()
  const { data: profiles } = useProfiles()
  const { data: details } = useTVDetails(params.id)
  const sonarr = details && details.sonarr

  const [form, setForm] = useState({
    profile: null,
    type: 'standard',
    monitoring: 'all'
  })

  useEffect(() => {
    setForm({
      profile: sonarr.profileId || null,
      type: sonarr.seriesType || 'standard',
      monitoring: getMonitoringOption(sonarr)
    })
  }, [sonarr])

  const selectedProfile = profiles.find(p => p.value === form.profile)
  const selectedType = TYPE_OPTIONS.find(t => t.value === form.type)
  const selectedMonitoring = MONITOR_OPTIONS.find(m => m.value === form.monitoring)

  function update(key, value) {
    setForm(form => ({ ...form, [key]: value }))
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
  }

  return (
    <Modal
      as="form"
      title="Editar serie"
      className="space-y-4"
      open={open}
      onClose={() => setOpen(false)}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Select
          className="w-full"
          label="Calidad"
          options={profiles}
          selected={selectedProfile}
          onChange={opt => update('profile', opt.value)}
        />
        <Select
          className="w-full"
          label="Tipo de serie"
          options={TYPE_OPTIONS}
          selected={selectedType}
          onChange={opt => update('type', opt.value)}
        />
        <Select
          className="w-full"
          label="Seguimiento"
          options={MONITOR_OPTIONS}
          selected={selectedMonitoring}
          onChange={opt => update('monitoring', opt.value)}
        />

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
