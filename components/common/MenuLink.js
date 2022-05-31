import Link from 'next/link'

export function getMenuLinkStyle({ active = false, className = '' }) {
  const style = `hover:no-underline block px-4 py-2 text-sm ${className || ''}`
  const extra = active ? 'text-white bg-primary-600 bg-opacity-75' : 'text-gray-700'
  return `${style} ${extra}`
}

export default function MenuLink({ active, href, className, children, as, ...props }) {
  return (
    <Link href={href} as={as}>
      <a className={getMenuLinkStyle({ active, className })} {...props}>
        {children}
      </a>
    </Link>
  )
}
