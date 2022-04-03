import supabase from '@/lib/db-client/supabaseAdmin'

export default async function authMiddleware(req, res) {
  const token = req.headers['authorization'].replace('Bearer ', '')
  const data = await supabase.auth.api.getUser(token)
  if (data.error) {
    res.status(403).json({
      code: 403,
      message: '[authMiddleware] Error verifyinh user token',
      details: data.error.message
    })
  } else {
    return data.user
  }
}
