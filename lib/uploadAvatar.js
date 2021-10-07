import { supabase } from '@/lib/db-client/supabase'

export default async function uploadAvatar(file) {
  const user = supabase.auth.user()
  const ext = file.name.split('.').pop()
  const filename = `avatar-${user.id}-${Date.now()}.${ext}`

  let { error: uploadError } = await supabase.storage.from('avatars').upload(filename, file, { upsert: true })
  if (uploadError) {
    throw uploadError
  }

  return filename
}
