import Layout from '@/components/layout/Layout'
import Alert from '@/components/alert/Alert'
import dynamic from 'next/dynamic'
import { AlertProvider, useAlert } from '@/components/alert/AlertContext'
import { AuthProvider } from '@/lib/auth/AuthContext'
import { SWRConfig } from 'swr'
import '../styles/globals.css'
import 'core-js-pure/features/object/from-entries'

const ProgressBar = dynamic(() => import('@/components/common/NProgressBar'), { ssr: false })

function CustomSWRConfig({ children }) {
  const { setAlert } = useAlert()
  const config = {
    revalidateOnFocus: false,
    errorRetryCount: 1,
    onError: error => {
      if (error.status !== 403 && error.status !== 404) {
        setAlert(error.message)
      }
    }
  }
  return <SWRConfig value={config}>{children}</SWRConfig>
}

function App({ Component, pageProps }) {
  return (
    <AlertProvider>
      <AuthProvider>
        <CustomSWRConfig>
          <Layout>
            <ProgressBar />
            <Alert />
            <Component {...pageProps} />
          </Layout>
        </CustomSWRConfig>
      </AuthProvider>
    </AlertProvider>
  )
}

export default App
