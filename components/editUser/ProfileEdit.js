import { useEffect, useState } from 'react'
import { mutate } from 'swr'
import { useRouter } from 'next/router'
import useProfile from '@/lib/auth/useProfile'
import { updateProfile } from '@/lib/auth/authService'
import { useAlert } from '@/components/alert/AlertContext'
import Button from '@/components/common/Button'
import Label from '@/components/common/Label'
import Spinner from '@/components/common/Spinner'
// import uploadImage from '@/lib/images/uploadImage'
// import PhotoEdit from './PhotoEdit'

function uploadImage() {}

export default function ProfileEdit() {
  const router = useRouter()
  const { user, loading } = useProfile(router.query.id)
  const { setAlert } = useAlert()
  const [form, setForm] = useState(user)

  useEffect(() => {
    if (user) {
      setForm(user)
    }
  }, [user])

  function update(key, value) {
    setForm(form => ({ ...form, [key]: value }))
  }

  // function handleAvatarChange({ url, filename }) {
  //   update('avatar', filename || null)
  //   update('avatar_url', url || null)
  // }

  async function handleSubmit(ev) {
    ev.preventDefault()
    try {
      let avatar = form.avatar
      if (avatar && avatar !== user.avatar) {
        const newAvatar = await uploadImage({
          url: form.avatar_url,
          folder: 'avatar',
          filename: avatar
        })
        avatar = newAvatar
      }
      await mutate(`profile/${user.id}`, async user => {
        const data = await updateProfile({ ...form, avatar })
        return { ...user, ...data }
      })
      setAlert({ type: 'success', text: 'Perfil actualizado correctamente' })
    } catch (error) {
      console.error(error)
      setAlert(error.message)
    }
  }

  const NAME_MAXLENGTH = 50
  const BIO_MAXLENGTH = 250

  return (
    <form className="space-y-6 flex-auto" onSubmit={handleSubmit}>
      {/* <PhotoEdit user={form} onChange={handleAvatarChange} /> */}
      <div className="max-w-sm">
        <div className="mb-1 w-full flex items-center justify-between">
          <Label name="name" text="Nombre" />
          <p className="text-xs text-gray-500">
            {form?.name.length || 0} / {NAME_MAXLENGTH}
          </p>
        </div>
        <input
          id="name"
          type="text"
          className="w-full h-10 px-3 text-base placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-700 focus:border-primary-700"
          placeholder="Escribe tu nombre"
          maxLength={NAME_MAXLENGTH}
          value={form?.name || ''}
          onChange={ev => update('name', ev.target.value)}
          required
        />
      </div>
      <div className="max-w-lg">
        <div className="mb-1 flex items-center justify-between">
          <Label name="bio" text="Bio" />
          <p className="text-xs text-gray-500">
            {form?.bio?.length || 0} / {BIO_MAXLENGTH}
          </p>
        </div>
        <textarea
          rows="3"
          id="bio"
          value={form?.bio}
          maxLength={BIO_MAXLENGTH}
          onChange={ev => update('bio', ev.target.value)}
          className="shadow-sm block w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-700 focus:border-primary-700"
        />
        <p className="text-sm text-gray-500 mt-1">Breve descripci&oacute;n de tu perfil</p>
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading || !user}
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
  )
}
