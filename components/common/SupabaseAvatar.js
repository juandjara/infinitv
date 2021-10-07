import Skeleton from 'react-loading-skeleton'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/db-client/supabase'
import { useAlert } from '../alert/AlertContext'

export default function SupabaseAvatar({ url, className, style }) {
  const [fullURL, setFullURL] = useState(null)
  const { setAlert } = useAlert()

  useEffect(() => {
    if (url) fetchFullURL(url)
    // eslint-disable-next-line
  }, [url])

  async function fetchFullURL(baseURL) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(baseURL)
      if (error) {
        throw error
      }

      const url = URL.createObjectURL(data)
      setFullURL(url)
    } catch (err) {
      console.error(err)
      setAlert(err.message)
    }
  }

  return fullURL ? (
    <img alt="avatar" src={fullURL} className={className} style={style} />
  ) : (
    <Skeleton className={className} width={style.width} height={style.height} circle />
  )
}
