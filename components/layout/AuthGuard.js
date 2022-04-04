import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from '@/lib/auth/AuthContext'
import { getSavedSession, isTokenExpired } from '@/lib/auth/authService'
import FullPageLoading from '@/components/common/FullPageLoading'

function checkSession(session) {
  if (!session) {
    const savedSession = getSavedSession()
    const validToken = !isTokenExpired(savedSession?.access_token)
    return validToken
  }
  return true
}

export default function AuthGuard({ children }) {
  const router = useRouter()
  const isLoginRoute = /^\/login/.test(router.asPath)
  const session = useSession()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const newLoggedState = checkSession(session)
    setLoggedIn(newLoggedState)
    if (!newLoggedState && !isLoginRoute) {
      router.replace({
        pathname: '/login',
        query: {
          next: router.asPath
        }
      })
    }
  }, [router, isLoginRoute, session])

  return loggedIn || isLoginRoute ? children : <FullPageLoading />
}
