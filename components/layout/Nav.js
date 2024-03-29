import { useRef } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { buttonFocusStyle } from '@/components/common/Button'
import { XIcon as CloseIcon, MenuIcon } from '@heroicons/react/solid'
import NavLink from '@/components/common/NavLink'
import useProfile from '@/lib/auth/useProfile'

function TransitionMenuIcon({ as: Component, show }) {
  return (
    <Component
      width={24}
      height={24}
      className={`absolute top-1/2 left-1/2 -mt-3 -ml-3 transition duration-300 transform ${
        show ? '' : 'opacity-0 scale-50'
      }`}
    />
  )
}

const links = [
  { href: '/', text: 'Inicio', exact: true },
  { href: '/tv', text: 'Series' },
  { href: '/movies', text: 'Peliculas' },
  { href: '/calendar', text: 'Calendario' },
  { href: '/downloads', text: 'Descargas' },
  { role: 'superadmin', href: '/users', text: 'Usuarios' },
  { role: 'superadmin', href: '/settings', text: 'Ajustes' }
]

export default function Nav() {
  const menuToggleRef = useRef()
  const { user } = useProfile()
  const filteredLinks = links.filter(link => {
    if (!link.role) {
      return true
    }
    return user ? user.role === link.role : false
  })

  function handleClick() {
    if (menuToggleRef.current) {
      menuToggleRef.current.click()
    }
  }

  return (
    <>
      <div className="pl-4 hidden md:flex md:space-x-2">
        {filteredLinks.map(l => (
          <NavLink key={l.href} href={l.href} exact={l.exact}>
            {l.text}
          </NavLink>
        ))}
      </div>
      <div className="md:hidden z-20 relative">
        <Menu>
          {({ open }) => (
            <>
              <Menu.Button
                ref={menuToggleRef}
                className={`relative m-2 w-10 h-10 rounded-lg ${buttonFocusStyle}`}>
                <span className="sr-only">Mobile nav menu</span>
                <TransitionMenuIcon as={CloseIcon} show={open} />
                <TransitionMenuIcon as={MenuIcon} show={!open} />
              </Menu.Button>
              <Transition
                show={open}
                enter="transition transform duration-200 ease-out"
                enterFrom="scale-y-50 opacity-0"
                enterTo="scale-y-100 opacity-100"
                leave="transition transform duration-200 ease-out"
                leaveFrom="scale-y-100 opacity-100"
                leaveTo="scale-y-50 opacity-0">
                <Menu.Items
                  static
                  className={`absolute flex flex-col left-2 w-48 p-2 rounded-md shadow-lg bg-primary-900 bg-opacity-75`}>
                  {filteredLinks.map(l => (
                    <Menu.Item key={l.href}>
                      {({ active }) => (
                        <NavLink onClick={handleClick} active={active} key={l.href} href={l.href}>
                          {l.text}
                        </NavLink>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </div>
    </>
  )
}
