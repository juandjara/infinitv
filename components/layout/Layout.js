import Head from 'next/head'
import Header from './Header'
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
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-col flex-auto h-full pb-4">{children}</div>
      </div>
    </div>
  )
}
