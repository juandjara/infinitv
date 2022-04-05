import { useRouter } from 'next/router'
import { Menu, Transition } from '@headlessui/react'
import { supabase } from '@/lib/db-client/supabase'
import useProfile from '@/lib/auth/useProfile'
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
    { label: 'Mi cuenta', href: '/users/edit' },
    { label: 'Cerrar sesión', href: '/', onClick: handleLogout }
  ]

  if (!user) {
    return null
  }

  return (
    <div className="z-20 relative flex-shrink-0">
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button
              title="Open user menu"
              className={`w-full flex items-center p-2 px-3 md:px-2 group`}>
              <span className="sr-only">Open user menu</span>
              <p className="hidden md:block mr-4 group-hover:underline">{user.name}</p>
              <Avatar user={user} size={44} border="group-hover:border-blue-200 border-white" />
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
