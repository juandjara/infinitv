import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/db-client/supabase'
import translateErrorMessage from '@/lib/translateErrorMessages'
import Button from '@/components/common/Button'
import Label from '@/components/common/Label'
import Spinner from '@/components/common/Spinner'
import { useAlert } from '@/components/alert/AlertContext'
import { LockClosedIcon as LockIcon, MailIcon } from '@heroicons/react/solid'
import PasswordInput from '@/components/password/PasswordInput'
import WeakPasswordWarning from '@/components/password/WeakPasswordWarning'
import BackButton from '@/components/common/BackButton'

function EmailForm({ header, className, style }) {
  const inputRef = useRef()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { setAlert } = useAlert()

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  async function handleSubmit(ev) {
    ev.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.api.resetPasswordForEmail(email)
    if (error) {
      // TODO: fix security concern, do not tell if email exists or not
      console.error(error)
      setAlert(translateErrorMessage(error.message))
    } else {
      return router.push({
        pathname: 'mailSent',
        query: {
          action: 'recovery',
          to: email.split('@')[1]
        }
      })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className={className} style={style}>
      {header}
      <div className="mb-6">
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
      <Button
        disabled={loading || !email}
        hasIcon="left"
        type="submit"
        className="w-full hover:shadow-md border-primary-500 hover:border-primary-600"
        color="text-white"
        background="bg-primary-500 hover:bg-primary-600">
        {loading ? <Spinner size={6} color="white" /> : <MailIcon width={20} height={20} />}
        <span>Enviar correo de recuperaci&oacute;n</span>
      </Button>
      <p className="text-sm mt-2">
        Enviaremos un correo a tu direcci&oacute;n con un enlace &uacute;nico para que puedas cambiar tu contraseña
      </p>
    </form>
  )
}

function PasswordForm({ header, className, style }) {
  const inputRef = useRef()
  const router = useRouter()
  const hash = router.asPath.split('#')[1]
  const token = new URLSearchParams(hash).get('t')
  const [password, setPassword] = useState('')
  const [passwordValid, setPasswordValid] = useState(true)
  const [loading, setLoading] = useState(false)
  const { setAlert } = useAlert()

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  async function handleSubmit(ev) {
    ev.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.api.updateUser(token, { password })
    if (error) {
      console.error(error)
      setAlert(translateErrorMessage(error.message))
    } else {
      setAlert({ type: 'success', text: 'Contraseña actualizada correctamente' })
      return router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className={className} style={style}>
      {header}
      <div className="mb-6">
        <Label name="password" text="Nueva contraseña" />
        <PasswordInput
          inputRef={inputRef}
          id="password"
          placeholder="Escribe tu contraseña nueva"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          onValidityChange={setPasswordValid}
          required
        />
      </div>
      <Button
        disabled={loading || !password || !passwordValid}
        hasIcon="left"
        type="submit"
        className="w-full hover:shadow-md border-primary-500 hover:border-primary-600"
        color="text-white"
        background="bg-primary-500 hover:bg-primary-600">
        {loading ? <Spinner size={6} color="white" /> : <LockIcon width={20} height={20} />}
        <span>Cambiar contraseña</span>
      </Button>
      {!passwordValid && <WeakPasswordWarning margin="mt-4" />}
    </form>
  )
}

export default function Recovery() {
  const router = useRouter()
  const form = router.query.form

  const header =
    form === 'email' ? (
      <header className="flex items-center mb-6">
        <BackButton />
        <h1 className="text-lg pl-2">Recuperar contraseña</h1>
      </header>
    ) : (
      <h1 className="text-lg mb-6">Recuperar contraseña</h1>
    )
  const formCN = 'mb-4 flex flex-col justify-center text-left md:px-6 px-4 py-4'
  const formStyle = { width: '28rem', maxWidth: 'calc(100vw - 24px)' } // width from max-w-md

  return (
    <main className="flex flex-col items-center justify-center flex-auto my-4 px-3">
      <div
        style={{ maxHeight: 'var(--login-card-height)' }}
        className="flex md:h-full justify-between bg-white text-gray-700 rounded-lg">
        <div className="bg-gray-100 rounded-l-lg px-4 hidden md:flex flex-col justify-center">
          <Image
            width={346}
            height={400}
            title="Ojo! Cuidado, la seguridad es tema serio"
            alt="dibujo sobre seguridad. Ojo! Cuidado, la seguridad es tema serio"
            className="opacity-75"
            src="/img/illustration_security.png"
            priority
          />
        </div>
        {form === 'email' && <EmailForm style={formStyle} className={formCN} header={header} />}
        {form === 'pass' && <PasswordForm style={formStyle} className={formCN} header={header} />}
      </div>
    </main>
  )
}
