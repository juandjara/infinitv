export default function Heading({ className = '', as: Component = 'h1', children, ...props }) {
  const cn = `${className} font-semibold text-4xl leading-tight text-transparent bg-clip-text bg-gradient-to-br from-accent-300 to-accent-50`
  return (
    <Component className={cn} {...props}>
      {children}
    </Component>
  )
}
