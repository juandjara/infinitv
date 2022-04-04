import Head from 'next/head'
import Header from './Header'
import config from '@/lib/config'
import AuthGuard from './AuthGuard'

export default function Layout({ children }) {
  return (
    <div className="text-white font-sans">
      <Head>
        <meta name="theme-color" content="#c0392b" />
        <meta name="description" content={config.appDescription} />
        <title>{config.appTitle}</title>
      </Head>
      <div className="bgimage"></div>
      <AuthGuard>
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex flex-col flex-auto h-full pb-4">{children}</div>
        </div>
      </AuthGuard>
    </div>
  )
}
