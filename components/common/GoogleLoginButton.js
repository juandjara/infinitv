import { useState } from 'react'
import { useAlert } from '@/components/alert/AlertContext'
import { supabase } from '@/lib/db-client/supabase'
import IconGoogle from '@/images/google.svg'
import Button from '@/components/common/Button'
import Spinner from '@/components/common/Spinner'

export default function GoogleLoginButton({ onLoggedIn = () => {} }) {
  const [loading, setLoading] = useState()
  const { setAlert } = useAlert()

  async function login() {
    setLoading(true)
    const { error } = await supabase.auth.signIn({ provider: 'google' })
    if (error) {
      console.error(error)
      setAlert(error.message)
    } else {
      onLoggedIn()
    }
    setLoading(false)
  }

  return (
    <Button
      type="button"
      onClick={login}
      disabled={loading}
      hasIcon="left"
      className="w-full"
      color="text-gray-700"
      background="bg-white hover:shadow-md"
      border="border-2 border-gray-200 hover:border-gray-300">
      {loading ? <Spinner size={6} color="white" /> : <IconGoogle width={20} height={20} />}
      <span>Entrar con Google</span>
    </Button>
  )
}
