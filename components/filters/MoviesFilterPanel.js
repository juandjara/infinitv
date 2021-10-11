import { useQueryParams } from '@/lib/useQueryParams'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import Button from '@/components/common/Button'
import { AdjustmentsIcon as FilterIcon, ArrowLeftIcon as BackIcon } from '@heroicons/react/solid'
import Select from '@/components/common/Select'
import studios from '@/lib/config/studios'
import useMovieGenres from '@/lib/movies/useMovieGenres'

const SORT_OPTIONS = [
  { label: 'Popularidad', value: null },
  { label: 'Valoración', value: 'vote_average' },
  { label: 'Fecha de estreno', value: 'primary_release_date' },
  { label: 'Título', value: 'title' }
]
const SORT_TYPES = [
  { label: 'De mayor a menor', value: null },
  { label: 'De menor a mayor', value: 'asc' }
]

function initialFilterState(params) {
  return {
    sortKey: params.sk || SORT_OPTIONS[0].value,
    sortType: params.st || SORT_TYPES[0].value,
    genre: params.g,
    company: params.c
  }
}

export default function MoviesFiltersPanel() {
  const router = useRouter()
  const { params } = useQueryParams()
  const { genres } = useMovieGenres()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)
  const hasFilters = Boolean(params.sk || params.st || params.g || params.n || params.c)

  const [filters, setFilters] = useState(() => initialFilterState(params))
  const { genre, company, sortKey, sortType } = filters

  const genreOptions = genres.map(g => ({ value: String(g.id), label: g.name }))
  const selectedGenre = genreOptions.find(opt => opt.value === genre)

  const companyOptions = studios.map(s => ({ value: s.id, label: s.name, image: s.image }))
  const selectedCompany = companyOptions.find(opt => opt.value === company)

  const selectedSortKey = SORT_OPTIONS.find(opt => opt.value === sortKey)
  const selectedSortType = SORT_TYPES.find(opt => opt.value === sortType)

  useEffect(() => {
    setFilters(initialFilterState(params))
  }, [params])

  useEffect(
    function handleClickOutside() {
      function handler(ev) {
        if (!wrapperRef.current.contains(ev.target)) {
          setOpen(false)
        }
      }

      if (open) {
        document.addEventListener('pointerdown', handler)
      }

      return () => document.removeEventListener('pointerdown', handler)
    },
    [open]
  )

  function update(key, value) {
    setFilters(state => ({ ...state, [key]: value }))
  }

  function apply() {
    setOpen(false)
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: 1,
        sk: sortKey,
        st: sortType,
        g: genre,
        c: company
      }
    })
  }

  function clear() {
    setOpen(false)
    const query = { ...router.query, page: 1 }
    delete query.sk
    delete query.st
    delete query.g
    delete query.c

    router.push({ pathname: router.pathname, query })
  }

  return (
    <div className="md:relative" ref={wrapperRef}>
      <Button
        small
        hasIcon="only"
        className="relative my-1 mr-2"
        background={open ? 'bg-primary-700' : 'bg-primary-900 hover:bg-primary-700'}
        color="text-white"
        border="border-none"
        onClick={() => setOpen(!open)}>
        <FilterIcon width={20} height={20} />
        <span className="md:inline hidden">Filtros</span>
        {hasFilters && (
          <span className="flex h-2 w-2 absolute -top-1 -right-1 rounded-full bg-primary-200"></span>
        )}
      </Button>
      <div
        className={`${
          open ? 'scale-x-100 visible' : 'scale-x-0 invisible'
        } space-y-4 rounded-md bg-primary-900 bg-opacity-90 z-20 fixed md:absolute top-0 md:top-full right-0 h-full md:h-auto w-full md:w-96 md:mr-2 py-2 px-3 md:origin-right transition-transform`}>
        <header className="flex items-center -mr-2">
          <Button
            small
            hasIcon="only"
            color="text-white"
            background="hover:bg-primary-800"
            border="border-none"
            className="mr-2 md:hidden"
            onClick={() => setOpen(false)}>
            <BackIcon height={20} width={20} />
          </Button>
          <p className="flex-grow text-xl font-medium">Filtros</p>
          <Button
            small
            className="mx-1"
            background="hover:bg-gray-100 hover:bg-opacity-20"
            color="text-gray-100"
            border="border-none"
            onClick={clear}>
            <span>Limpiar</span>
          </Button>
          <Button
            small
            className="mx-1"
            background="bg-primary-100 bg-opacity-30 hover:bg-opacity-40"
            color="text-white"
            border="border-none"
            onClick={apply}>
            <span>Aplicar</span>
          </Button>
        </header>
        <section>
          <Select
            label="Género"
            noSelectionLabel="Todos"
            className="w-64"
            options={genreOptions}
            selected={selectedGenre}
            onChange={ev => update('genre', ev.value)}
          />
        </section>
        <section>
          <Select
            label="Estudio"
            noSelectionLabel="Todos"
            className="w-64"
            options={companyOptions}
            selected={selectedCompany}
            onChange={ev => update('company', ev.value)}
          />
        </section>
        <section>
          <p className="text-sm text-gray-100 mb-1">Ordenar por</p>
          <div className="flex space-x-2">
            <Select
              className="flex-grow"
              options={SORT_OPTIONS}
              selected={selectedSortKey}
              onChange={ev => update('sortKey', ev.value)}
            />
            <Select
              className="flex-grow"
              options={SORT_TYPES}
              selected={selectedSortType}
              onChange={ev => update('sortType', ev.value)}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
