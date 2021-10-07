import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAlert } from '@/components/alert/AlertContext'
import { supabase } from '@/lib/db-client/supabase'
import useProfile from '@/lib/auth/useProfile'
import Button from '@/components/common/Button'
import Label from '@/components/common/Label'
import Spinner from '@/components/common/Spinner'
import PasswordInput from '@/components/password/PasswordInput'
import WeakPasswordWarning from '@/components/password/WeakPasswordWarning'

export default function CredentialsEdit() {
  const [email, setEmail] = useState(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordValid, setPasswordValid] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const router = useRouter()
  const { user } = useProfile(router.query.id)
  const { setAlert } = useAlert()

  const savedEmail = router.query.id ? user?.email : user?.sessionEmail
  const emailValue = (email === null ? savedEmail : email) || ''

  async function verifyCredentials(email, password) {
    const { data, error } = await supabase.auth.api.signInWithEmail(email, password)
    if (error) {
      throw error
    } else {
      return data
    }
  }

  async function updateCredentials(session, password) {
    const { data, error } = await supabase.auth.api.updateUser(session.access_token, { password })
    if (error) {
      throw error
    } else {
      return data
    }
  }

  async function handlePasswordSubmit(ev) {
    ev.preventDefault()

    setError(false)
    setLoading(true)
    try {
      const session = await verifyCredentials(user.email, currentPassword)
      await updateCredentials(session, newPassword)
      setAlert({ type: 'success', text: 'Credenciales actualizadas correctamente' })
    } catch (error) {
      console.error(error)
      setError(true)
    }
    setLoading(false)
  }

  useEffect(() => {
    let id = null
    if (error) {
      id = setTimeout(() => {
        setError(false)
      }, 3000)
    }
    return () => {
      if (id) {
        clearTimeout(id)
      }
    }
  }, [error])

  return (
    <>
      <h2 className="text-xl font-medium">Credenciales</h2>
      <p className="mt-1 mb-6 text-sm text-gray-600">
        Informaci&oacute;n de inicio de sesi&oacute;n
      </p>
      <form className="space-y-6" onSubmit={handlePasswordSubmit}>
        <div className="md:w-1/2">
          <Label name="email" text="Email" />
          <input
            disabled
            id="email"
            type="email"
            className="text-gray-500 bg-gray-100 w-full h-10 px-3 text-base placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-700 focus:border-primary-700"
            placeholder="Escribe tu correo"
            value={emailValue}
            onChange={ev => setEmail(ev.target.value)}
            required
          />
        </div>
        <div className="md:flex md:items-start md:space-x-2 space-y-4">
          <div className="w-full mt-4">
            <Label name="current_password" text="Contraseña actual" />
            <PasswordInput
              id="current_password"
              autoComplete="current-password"
              placeholder="****"
              showMeter={false}
              value={currentPassword}
              onChange={setCurrentPassword}
              required
            />
          </div>
          <div className="w-full">
            <Label name="new_password" text="Contraseña nueva" />
            <PasswordInput
              id="new_password"
              autoComplete="new-password"
              placeholder="****"
              value={newPassword}
              onChange={setNewPassword}
              onValidityChange={setPasswordValid}
              required
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            {error && (
              <p className="text-primary-700 text-xs mt-1 mr-2">
                La contraseña actual no es correcta
              </p>
            )}
            {!passwordValid && <WeakPasswordWarning />}
          </div>
          <Button
            type="submit"
            disabled={loading || !newPassword || !passwordValid}
            hasIcon={loading ? 'left' : null}
            border="border-none"
            color="text-white"
            background="bg-primary-500 hover:bg-primary-600 hover:shadow-md">
            {loading ? (
              <>
                <Spinner size={5} color="white" />
                <span>Guardar</span>
              </>
            ) : (
              'Guardar'
            )}
          </Button>
        </div>
      </form>
    </>
  )
}
