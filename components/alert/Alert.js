import { useEffect } from 'react'
import { useAlert } from '@/components/alert/AlertContext'

const DEFAULT_DELAY = 5000

function getAlertColor(type) {
  if (type === 'error') {
    return 'red'
  }
  if (type === 'success') {
    return 'green'
  }
  return 'red'
}

export default function Alert() {
  const { alert, setAlert } = useAlert()
  useEffect(() => {
    let timeout
    if (alert) {
      timeout = window.setTimeout(() => setAlert(null), DEFAULT_DELAY)
    }
    return () => window.clearTimeout(timeout)
  }, [alert, setAlert])

  const alertText = typeof alert === 'string' ? alert : alert?.text
  const alertType = alert?.type || 'error'
  const color = getAlertColor(alertType)

  const validAlert = alertText !== 'JWT expired'

  // taken from here: https://tailwindcomponents.com/component/alert-component-with-tailwind-css
  return (
    alert &&
    validAlert && (
      <div
        className={`z-20 animation-alert fixed top-0 left-1/2 transform -translate-x-1/2 w-3/4 xl:w-2/4 max-w-xl mt-6 p-4 rounded-md bg-${color}-100 text-base flex items-center`}>
        {/* <AlertIcon className={`text-${color}-700 w-5 h-5 mr-3`} /> */}
        <span className="sr-only">{alertType}:</span>
        <span className={`text-${color}-700`}>{alertText}</span>
      </div>
    )
  )
}
