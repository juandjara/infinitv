import { useRouter } from 'next/router'
import { buttonFocusStyle } from './Button'
import { ArrowLeftIcon as BackIcon } from '@heroicons/react/solid'

export default function BackButton({
  icon,
  title = 'Volver',
  colors = 'bg-opacity-20 text-gray-600 bg-gray-200 hover:bg-opacity-50',
  ...props
}) {
  const router = useRouter()
  const Icon = icon || <BackIcon height={20} width={20} />

  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={() => router.back()}
      className={`rounded-full p-2 ${colors} ${buttonFocusStyle}`}
      {...props}>
      {Icon}
    </button>
  )
}
