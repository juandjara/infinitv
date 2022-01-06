import Link from 'next/link'
import { useRouter } from 'next/router'
import Nav from './Nav'
import UserMenu from './UserMenu'

export default function Header() {
  const router = useRouter()
  const [route, id] = router.pathname.split('/').slice(1)
  const hideHeader = (route === 'tv' || route === 'movies') && !!id

  if (hideHeader) {
    return null
  }

  return (
    <nav style={{ minWidth: 'var(--nav-min-width)' }} className="flex items-center justify-center">
      <Link href="/">
        <a className="text-4xl leading-none p-1 rounded-full mx-3 bg-black bg-opacity-20">∞</a>
      </Link>
      <Nav />
      <UserMenu />
    </nav>
  )
}
