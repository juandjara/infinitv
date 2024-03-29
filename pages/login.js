import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/db-client/supabase'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { LockClosedIcon as LockIcon, MailIcon } from '@heroicons/react/solid'
import { useAlert } from '@/components/alert/AlertContext'
import Button from '@/components/common/Button'
import Spinner from '@/components/common/Spinner'
import GoogleLoginButton from '@/components/common/GoogleLoginButton'
import Label from '@/components/common/Label'
import { useSession } from '@/lib/auth/AuthContext'
import { useQueryParams } from '@/lib/useQueryParams'
import translateErrorMessage from '@/lib/translateErrorMessages'
import PasswordInput from '@/components/password/PasswordInput'

export default function Login() {
  const inputRef = useRef()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const { params } = useQueryParams()
  const next = params.next
  const router = useRouter()
  const session = useSession()
  const { setAlert } = useAlert()

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (session) {
      if (next) {
        router.replace(next)
      } else {
        router.push('/dashboard')
      }
    }
  }, [session, next, router, setAlert])

  async function handleSubmit(ev) {
    ev.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signIn(
      { email, password },
      { redirectTo: window.location.origin }
    )
    if (error) {
      console.error(error)
      setAlert(translateErrorMessage(error.message))
    } else {
      if (!password) {
        return router.push({
          pathname: 'login/mailSent',
          query: {
            action: 'login',
            to: email.split('@')[1]
          }
        })
      }
    }
    setLoading(false)
  }

  return (
    <main className="h-full flex flex-col items-center justify-center flex-auto my-4 px-3">
      <div
        style={{ maxHeight: 'var(--login-card-height)' }}
        className="flex h-full justify-between bg-white text-gray-700 rounded-lg">
        <div className="bg-gray-100 rounded-l-lg px-4 hidden md:flex flex-col justify-center">
          <Image
            width="346"
            height="400"
            title="Hola! Me alegro de verte"
            alt="mano que dice Hola! Me alegro de verte"
            className="opacity-75"
            src="/img/illustration_hello.png"
            priority
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col text-left max-w-md md:px-6 px-4 py-4">
          <div className="flex-auto"></div>
          <h1 className="text-lg mb-6">Iniciar sesi&oacute;n</h1>
          <div>
            <Label name="email" text="E-mail" />
            <input
              ref={inputRef}
              id="email"
              type="email"
              className="w-full h-10 px-3 text-base placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-700 focus:border-primary-700"
              placeholder="Escribe tu correo"
              value={email}
              onChange={ev => setEmail(ev.target.value)}
              required
            />
          </div>
          <div className="my-8">
            <div className="flex justify-between items-end mb-1">
              <Label margin="mb-0" name="password" text="Contraseña" />
              <Link href="/login/recovery?form=email" className="text-sm text-blue-500">
                <a className="text-sm text-blue-500">Olvid&eacute; mi contraseña</a>
              </Link>
            </div>
            <PasswordInput
              id="password"
              placeholder="Escribe tu contraseña"
              autoComplete="current-password"
              value={password}
              onChange={setPassword}
              showMeter={false}
            />
          </div>
          <div className="space-y-4">
            <Button
              disabled={loading || !email || !password}
              hasIcon="left"
              type="submit"
              className="w-full hover:shadow-md border-primary-500 hover:border-primary-600"
              color="text-white"
              background="bg-primary-500 hover:bg-primary-600">
              {loading ? <Spinner size={6} color="white" /> : <LockIcon width={20} height={20} />}
              <span>Entrar con tu contraseña</span>
            </Button>
            <Button
              disabled={loading || !email}
              hasIcon="left"
              type="submit"
              className="w-full hover:shadow-md border-blue-500 hover:border-blue-600"
              color="text-white"
              background="bg-blue-500 hover:bg-blue-600">
              {loading ? <Spinner size={6} color="white" /> : <MailIcon width={20} height={20} />}
              <span>Enviar enlace &uacute;nico*</span>
            </Button>
            <GoogleLoginButton />
          </div>
          <p className="mt-4 text-sm space-x-1">
            <span>¿Nuevo en la plataforma?</span>
            <span role="img" aria-label="dedo apuntando">
              👉
            </span>
            <Link href="/login/signup">
              <a className="text-blue-500">Crear cuenta</a>
            </Link>
          </p>
          <div className="flex-auto"></div>
          <p className="mt-6 mb-2 text-xs">
            <em>
              * Un enlace único es un enlace que se envia a tu dirección de correo para que puedas
              entrar sin necesidad de recordar una contraseña.
            </em>
          </p>
        </form>
      </div>
    </main>
  )
}
