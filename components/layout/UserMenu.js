import Link from 'next/link'
import { useRouter } from 'next/router'
import { Menu, Transition } from '@headlessui/react'
import { supabase } from '@/lib/db-client/supabase'
import useProfile from '@/lib/auth/useProfile'
import Button, { buttonFocusStyle } from '@/components/common/Button'
import RoleTags from '@/components/common/RoleTags'
import MenuLink from '@/components/common/MenuLink'
import Avatar from '@/components/common/Avatar'

export default function UserMenu() {
  const { user } = useProfile()
  const router = useRouter()

  async function handleLogout(ev) {
    ev.preventDefault()
    await router.push('/')
    await supabase.auth.signOut()
  }

  const menuItems = [
    { label: 'Mi cuenta', href: '/settings' },
    { label: 'Mis partidas', href: '/dashboard#posts' },
    { label: 'Cerrar sesión', href: '/', onClick: handleLogout }
  ]

  if (!user) {
    return (
      <div className="flex-1">
        <Link href="/login">
          <a>
            <Button small className="block ml-auto mr-2 mt-2">
              Entrar
            </Button>
          </a>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex-1 z-20">
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button title="Open user menu" className={`m-2 ml-auto block rounded-full ${buttonFocusStyle}`}>
              <span className="sr-only">Open user menu</span>
              <Avatar user={user} size={44} border="border-white" />
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
                className="absolute right-2 w-48 rounded-md shadow-lg py-2 bg-white ring-1 ring-black ring-opacity-5">
                <div className="mb-2 pt-1 pb-3 px-4 text-gray-900 border-b border-1 border-gray-300">
                  <p className="mb-1 text-sm font-semibold truncate">{user.name}</p>
                  <p className="space-x-1 font-semibold">
                    <RoleTags user={user} />
                  </p>
                </div>
                {menuItems.map(m => (
                  <Menu.Item key={m.href}>
                    {({ active }) => (
                      <MenuLink active={active} href={m.href} onClick={m.onClick}>
                        {m.label}
                      </MenuLink>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  )
}
