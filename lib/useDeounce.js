// taken from here: https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci
import { useEffect, useState } from 'react'

export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [value, delay])

  return debouncedValue
}
