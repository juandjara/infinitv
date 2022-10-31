import Link from 'next/link'
import { useRouter } from 'next/router'
import NavLink from '../common/NavLink'
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
    <nav
      className="sticky z-20 top-0 flex items-center justify-between"
      style={{ minWidth: 'var(--nav-min-width)' }}>
      <Nav />
      <UserMenu />
    </nav>
  )
}
