import Head from 'next/head'
import Link from 'next/link'
import Nav from './Nav'
import UserMenu from './UserMenu'
import { CogIcon as SettingsIcon } from '@heroicons/react/solid'
import NavLink from '@/components/common/NavLink'
import config from '@/lib/config'

export default function Layout({ children }) {
  return (
    <div className="relative flex flex-col text-white h-screen font-sans">
      <Head>
        <meta name="theme-color" content="#c0392b" />
        <meta name="description" content={config.appDescription} />
        <title>{config.appTitle}</title>
      </Head>
      <div className="bgimage">
        {/* <Image src="/img/dice-bg.jpg" priority layout="fill" objectFit="cover" /> */}
      </div>
      <div className="h-full md:flex align-stretch">
        <nav
          style={{ minWidth: 'var(--nav-min-width)' }}
          className="md:pb-4 flex md:flex-col items-start justify-center md:bg-gray-700 md:bg-opacity-25">
          <Link href="/">
            <a className="h-20 hidden md:flex items-center px-4 hover:opacity-75">
              <p className="text-3xl mr-4 tracking-wider">InfiniTV</p>
              {/* <Image src="/img/index_bg.png" width={75} height={75} /> */}
            </a>
          </Link>
          <Nav />
          <NavLink href="/settings" className="flex items-center space-x-2 md:w-full pr-0 mr-0 mt-4">
            <SettingsIcon className="w-10 h-10" />
            <p className="hidden md:block">Ajustes</p>
          </NavLink>
          <UserMenu />
        </nav>
        {children}
      </div>
    </div>
  )
}
