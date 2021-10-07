import { useRouter } from 'next/router'
import Link from 'next/link'

// taken from here: https://github.com/vercel/next.js/blob/canary/examples/active-class-name/components/ActiveLink.js
export default function NavLink({
  href,
  display = 'block',
  active = false,
  children,
  as,
  className = '',
  onClick
}) {
  const { asPath } = useRouter()

  // props.href will be matched by routes like `/catalog`
  // props.as will be matched by routes like `/posts/1234`
  const routeActive = asPath.indexOf(href) !== -1 || asPath.indexOf(as) !== -1
  const style = `m-2 mb-0 py-1 px-2 ${display} rounded-md border-b-2 border-transparent text-white text-lg  hover:no-underline`
  const activeStyle =
    active || routeActive
      ? 'bg-primary-500 bg-opacity-75'
      : 'hover:bg-primary-500 hover:bg-opacity-75'

  return (
    <Link href={href} as={as}>
      {/* eslint-disable-next-line */}
      <a onClick={onClick} className={`${style} ${activeStyle} ${className}`}>
        {children}
      </a>
    </Link>
  )
}
