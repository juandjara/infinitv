import { useState } from 'react'
import { useAlert } from '@/components/alert/AlertContext'

export default function useMutation(callback) {
  const [loading, setLoading] = useState(false)
  const { setAlert } = useAlert()

  async function run() {
    setLoading(true)
    try {
      await callback()
    } catch (err) {
      console.log('[useMutation] Error running mutation', err)
      setAlert(err.message)
    }
    setLoading(false)
  }

  return [loading, run]
}
