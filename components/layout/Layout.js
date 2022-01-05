import Head from 'next/head'
import Link from 'next/link'
import Nav from './Nav'
import UserMenu from './UserMenu'
import config from '@/lib/config'
import useAuthGuard from '@/lib/auth/useAuthGuard'
import { useRouter } from 'next/router'

export default function Layout({ children }) {
  const router = useRouter()
  useAuthGuard(/^\/login/.test(router.pathname) === false)

  return (
    <div className="text-white font-sans">
      <Head>
        <meta name="theme-color" content="#c0392b" />
        <meta name="description" content={config.appDescription} />
        <title>{config.appTitle}</title>
      </Head>
      <div className="bgimage">
        {/* <Image src="/img/dice-bg.jpg" priority layout="fill" objectFit="cover" /> */}
      </div>
      <div className="h-full">
        <nav
          style={{ minWidth: 'var(--nav-min-width)' }}
          className="bg-blue-600 flex items-center justify-center">
          <Link href="/">
            <a className="text-4xl leading-none p-1 rounded-full mx-3 bg-black bg-opacity-20">∞</a>
          </Link>
          <Nav />
          <UserMenu />
        </nav>
        <div className="flex-auto pb-4">{children}</div>
      </div>
    </div>
  )
}
