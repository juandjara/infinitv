import Spinner from './Spinner'

export default function FullPageLoading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner size={16} />
    </div>
  )
}
