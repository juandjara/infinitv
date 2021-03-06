function getPadding({ hasIcon, small }) {
  let padding = ''
  if (small) {
    if (hasIcon) {
      padding = hasIcon === 'only' ? 'p-2' : 'px-3 py-2'
    } else {
      padding = 'px-3 py-1'
    }
  } else {
    padding = 'px-4 py-2'
    if (hasIcon === 'left') padding += ' pl-3'
    if (hasIcon === 'right') padding += ' pr-3'
    if (hasIcon === 'only') padding = 'p-3'
  }

  return padding
}

export const buttonFocusStyle =
  'focus:outline-none focus:ring focus:ring-offset-0 focus:ring-blue-500 focus:ring-offset-transparent'

export function getButtonStyle({
  layout,
  small,
  hasIcon,
  color,
  background,
  border,
  disabled
} = {}) {
  const _color = color || 'text-primary-900'
  const _background = background || 'bg-white hover:bg-primary-50'
  const _border = border || 'border-white border-2 hover:border-primary-200'
  const _layout = layout || (hasIcon ? `inline-flex justify-center items-center space-x-2` : '')
  const _padding = getPadding({ hasIcon, small })
  const _font = small ? 'text-sm font-medium' : 'text-base font-semibold'
  const _disabled = disabled ? 'opacity-50 pointer-events-none' : ''
  const base = 'transition-colors rounded-md'

  return `${_color} ${_background} ${_padding} ${_border} ${_disabled} ${_font} ${_layout} ${buttonFocusStyle} ${base}`
}

export default function Button({
  as: Component = 'button',
  layout = '',
  className = '',
  children,
  hasIcon,
  color = '',
  background = '',
  border = '',
  disabled,
  small,
  ...props
}) {
  const classes = `${className} ${getButtonStyle({
    layout,
    hasIcon,
    color,
    background,
    border,
    disabled,
    small
  })}`
  return (
    <Component disabled={disabled} className={classes} {...props}>
      {children}
    </Component>
  )
}
