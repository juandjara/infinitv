import Layout from '@/components/layout/Layout'
import Alert from '@/components/alert/Alert'
import { AlertProvider } from '@/components/alert/AlertContext'
import { AuthProvider } from '@/lib/auth/AuthContext'
import dynamic from 'next/dynamic'
import '../styles/globals.css'
import 'core-js-pure/features/object/from-entries'
import { SWRConfig } from 'swr'
import { SWRDevTools } from 'swr-devtools'

const ProgressBar = dynamic(() => import('@/components/common/NProgressBar'), { ssr: false })

function App({ Component, pageProps }) {
  return (
    <SWRDevTools>
      <SWRConfig value={{ revalidateOnFocus: false }}>
        <AlertProvider>
          <AuthProvider>
            <Layout>
              <ProgressBar />
              <Alert />
              <Component {...pageProps} />
            </Layout>
          </AuthProvider>
        </AlertProvider>
      </SWRConfig>
    </SWRDevTools>
  )
}

export default App
