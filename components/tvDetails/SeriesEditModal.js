import useLanguagesProfiles from '@/lib/settings/useLanguageProfiles'
import useQualityProfiles from '@/lib/settings/useQualityProfiles'
import { editSeries } from '@/lib/tv/tvUtils'
import useTVDetails from '@/lib/tv/useTVDetails'
import useMutation from '@/lib/useMutation'
import { useQueryParams } from '@/lib/useQueryParams'
import Link from 'next/link'
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

const MONITOR_OPTIONS = [
  { value: 'pilot', label: 'Episodio piloto' },
  { value: 'future', label: 'Episodios futuros' },
  { value: 'missing', label: 'Todos los episodios' },
  { value: 'firstSeason', label: 'Primera Temporada' },
  { value: 'lastSeason', label: 'Última temporada' },
  { value: 'none', label: 'Ninguno' }
]

export default function SeriesEditModal({ open, onClose }) {
  const { params } = useQueryParams()
  const { data: profiles } = useQualityProfiles()
  const { data: langs } = useLanguagesProfiles()
  const { data: details, mutate } = useTVDetails(params.id)

  const [form, setForm] = useState({
    addOptions: { monitor: 'missing' },
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
        languageProfileId: details.sonarr.languageProfileId || null,
        seriesType: details.sonarr.seriesType || 'standard'
      })
    }
  }, [details.sonarr])

  const selectedProfile = profiles.find(p => p.value === form.profileId)
  const selectedLang = langs.find(l => l.value === form.languageProfileId)
  const selectedType = TYPE_OPTIONS.find(t => t.value === form.seriesType)
  const selectedMonitoring = MONITOR_OPTIONS.find(opt => opt.value === form?.addOptions?.monitor)

  const [loading, updateSeries] = useMutation(async () => {
    await editSeries(form)
    await mutate()
  })

  async function handleSubmit(ev) {
    ev.preventDefault()
    await updateSeries()
    onClose()
  }

  function update(key, value) {
    setForm(form => ({ ...form, [key]: value }))
  }

  function handleMonitoringChange(value) {
    setForm(form => ({
      ...form,
      addOptions: {
        ...form.addOptions,
        monitor: value
      }
    }))
  }

  if (!details.sonarr) {
    return (
      <Modal title="Añadir a descargas" open={open} onClose={onClose}>
        <p className="text-white pt-2 pb-8">
          No hay ningun servidor Sonarr configurado para las descargas de series. Puedes añadir uno
          en la secci&oacute;n <em>Ajustes</em>
        </p>
        <Link href="/settings">
          <a>
            <Button>Ir a Ajustes</Button>
          </a>
        </Link>
      </Modal>
    )
  }

  return (
    <Modal
      title={form.isSaved ? 'Editar serie' : 'Añadir a descargas'}
      open={open}
      onClose={onClose}>
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
          label="Lenguaje"
          options={langs}
          selected={selectedLang}
          onChange={opt => update('languageProfileId', opt.value)}
        />
        <Select
          className="w-full"
          label="Tipo de serie"
          options={TYPE_OPTIONS}
          selected={selectedType}
          onChange={opt => update('seriesType', opt.value)}
        />
        {details.sonarr?.isSaved ? (
          <div>
            <p className="text-sm text-gray-100 mb-1">Seguimiento</p>
            <SeasonMonitoringTable form={form} onEdit={setForm} />
          </div>
        ) : (
          <Select
            className="w-full"
            label="Seguimiento"
            options={MONITOR_OPTIONS}
            selected={selectedMonitoring}
            onChange={opt => handleMonitoringChange(opt.value)}
          />
        )}
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
            onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  )
}
