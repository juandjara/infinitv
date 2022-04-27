import buildError from '@/lib/api/buildError'
import { supabase } from '@/lib/db-client/supabase'

export default async function authMiddleware(req) {
  const token = req.headers['authorization']?.replace('Bearer ', '')
  if (!token) {
    throw buildError({
      code: 401,
      message: '[authMiddleware] No token found in headers'
    })
  }

  const data = await supabase.auth.api.getUser(token)
  if (data.error) {
    throw data.error
  }

  return data.user
}
