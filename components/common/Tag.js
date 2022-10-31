export default function Tag({ uppercase = true, children, color = 'blue', title }) {
  const upper = uppercase ? 'uppercase' : ''
  return (
    <span
      title={title}
      className={`my-1 ${upper} inline-block text-xs px-1 tracking-wide leading-5 rounded-md text-${color}-900 bg-${color}-100`}>
      {children}
    </span>
  )
}
