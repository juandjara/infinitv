import { useEffect } from 'react'
import axios from '@/lib/axios'
import useSWR from 'swr'
import { useAlert } from '@/components/alert/AlertContext'
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import es from 'date-fns/locale/es'
import Heading from '@/components/common/Heading'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { es }
})

function useCalendar() {
  const { data, error } = useSWR('calendar', () =>
    axios.get('/api/sonarr/calendar').then(res => res.data)
  )

  const { setAlert } = useAlert()

  useEffect(() => {
    if (error) {
      setAlert('Error fetching calendar from Sonarr. Check browser console for more info')
    }
  }, [setAlert, error])

  return {
    data: data || [],
    loading: !error && !data,
    error
  }
}

function formatEpNumber(ev) {
  if (ev.seasonNumber === 1 && ev.series.seriesType === 'anime') {
    return `Ep. ${ev.episodeNumber}`
  }

  const s = ev.seasonNumber < 10 ? `0${ev.seasonNumber}` : ev.seasonNumber
  const e = ev.episodeNumber < 10 ? `0${ev.episodeNumber}` : ev.episodeNumber
  return `S${s}E${e}`
}

export default function Calendar() {
  const { data } = useCalendar()

  return (
    <main className="text-gray-500 my-4 container mx-auto px-3">
      <Heading className="mt-16 mb-2">Calendario</Heading>
      <div className="p-6 bg-white rounded-xl">
        <BigCalendar
          culture="es"
          views={['month']}
          localizer={localizer}
          events={data}
          titleAccessor={ev => (
            <div className="my-1">
              <p title={ev.series.title} className="text-sm">
                {ev.series.title}
              </p>
              <p title={ev.title}>
                <span className="text-sm"> {formatEpNumber(ev)} </span>
                <span> {ev.title} </span>
              </p>
            </div>
          )}
          startAccessor="airDateUtc"
          endAccessor="airDateUtc"
          style={{ height: 500 }}
        />
      </div>
    </main>
  )
}
