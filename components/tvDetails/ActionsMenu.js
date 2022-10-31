import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { getMenuLinkStyle } from '../common/MenuLink'
import {
  BookmarkIcon,
  DotsVerticalIcon,
  LinkIcon,
  CloudDownloadIcon as CloudDownloadAltIcon
} from '@heroicons/react/solid'
import {
  CloudDownloadIcon,
  BookmarkIcon as BookmarkIconOutline,
  ArchiveIcon
} from '@heroicons/react/outline'
import { getButtonStyle } from '../common/Button'
import Spinner from '../common/Spinner'

export default function ActionsMenu({
  fileLink,
  loading,
  monitored,
  updateMonitoring,
  toggleHistory,
  toggleManualSearch,
  runSearchCommand
}) {
  const MonitorStatusIcon = monitored ? BookmarkIcon : BookmarkIconOutline
  const monitorStatusTitle = monitored
    ? 'Eliminar de la lista de seguimiento'
    : 'Añadir a la lista de seguimiento'

  function toggleMonitoring(ev) {
    ev.preventDefault()
    ev.stopPropagation()
    updateMonitoring()
  }

  const menuItemsClassName = [
    loading ? 'opacity-50 pointers-none' : '',
    'flex flex-col justify-start items-start mt-2 z-10 absolute right-0 origin-top-right rounded-md bg-white shadow-lg'
  ].join(' ')

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          title="Actions"
          aria-label="Actions"
          disabled={loading}
          className={getButtonStyle({
            small: true,
            background: 'bg-transparent bg-gray-100 bg-opacity-75 hover:bg-opacity-100',
            color: 'text-gray-600',
            hasIcon: 'only',
            border: 'border-none'
          })}>
          {loading ? (
            <Spinner color="blue-400" size={8} />
          ) : (
            <DotsVerticalIcon className="text-gray-600 w-5 h-5" />
          )}
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <Menu.Items className={menuItemsClassName}>
          {fileLink && (
            <Menu.Item>
              {({ active }) => (
                <a
                  title="Descargar archivo de video"
                  className={getMenuLinkStyle({
                    className: 'rounded-t-md space-x-2 w-full flex items-center',
                    active
                  })}
                  href={fileLink}>
                  <LinkIcon className={`text-gray-${active ? '100' : '500'} w-6 h-6`} />
                  <p className="whitespace-nowrap">Enlace de video</p>
                </a>
              )}
            </Menu.Item>
          )}
          <Menu.Item>
            {({ active }) => (
              <button
                title="Mostrar historico"
                onClick={toggleHistory}
                className={getMenuLinkStyle({
                  className: 'space-x-2 w-full flex items-center',
                  active
                })}>
                <ArchiveIcon className={`text-gray-${active ? '100' : '500'} w-6 h-6`} />
                <p className="whitespace-nowrap">Hist&oacute;rico</p>
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                title="Descargar todos los capitulos monitorizados"
                onClick={toggleManualSearch}
                className={getMenuLinkStyle({
                  className: 'space-x-2 w-full flex items-center',
                  active
                })}>
                <CloudDownloadIcon className={`text-gray-${active ? '100' : '500'} w-6 h-6`} />
                <p className="whitespace-nowrap">Descarga manual</p>
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={runSearchCommand}
                className={getMenuLinkStyle({
                  className: 'space-x-2 w-full flex items-center',
                  active
                })}>
                <CloudDownloadAltIcon className={`text-gray-${active ? '100' : '500'} w-6 h-6`} />
                <p className="whitespace-nowrap">Descarga autom&aacute;tica</p>
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={getMenuLinkStyle({
                  className: 'rounded-b-md space-x-2 w-full flex items-center',
                  active
                })}
                onClick={toggleMonitoring}>
                <MonitorStatusIcon className={`text-gray-${active ? '100' : '500'} w-6 h-6`} />
                <p className="whitespace-nowrap">{monitorStatusTitle}</p>
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
