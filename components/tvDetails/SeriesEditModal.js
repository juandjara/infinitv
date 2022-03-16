import useQualityProfiles from '@/lib/settings/useQualityProfiles'
import { editSeries } from '@/lib/tv/tvUtils'
import useTVDetails from '@/lib/tv/useTVDetails'
import useMutation from '@/lib/useMutation'
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
  const { data: profiles } = useQualityProfiles()
  const { data: details, mutate } = useTVDetails(params.id)

  const [form, setForm] = useState({
    seasons: [],
    profileId: null,
    seriesType: 'standard'
  })

  useEffect(() => {
    if (details.sonarr) {
      setForm({
        ...details.sonarr,
        seasons: details.sonarr.seasons || [],
        profileId: details.sonarr.profileId || null,
        seriesType: details.sonarr.seriesType || 'standard'
      })
    }
  }, [details.sonarr])

  const selectedProfile = profiles.find(p => p.value === form.profileId)
  const selectedType = TYPE_OPTIONS.find(t => t.value === form.seriesType)

  const [loading, updateSeries] = useMutation(async () => {
    await editSeries(form)
    await mutate()
  })

  async function handleSubmit(ev) {
    ev.preventDefault()
    await updateSeries()
    setOpen(false)
  }

  function update(key, value) {
    setForm(form => ({ ...form, [key]: value }))
  }

  return (
    <Modal
      title={form.isLookup ? 'Añadir a mis series' : 'Editar serie'}
      open={open}
      onClose={() => setOpen(false)}>
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
          <SeasonMonitoringTable form={form} onEdit={setForm} />
        </div>

        <div className="space-x-2 flex justify-start">
          <Button
            type="submit"
            disabled={loading || !form.profileId}
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
