/**
 * Reusable button — styles taken from the "Original" Figma file.
 *
 * solid   -> "Apply Filters" / "CTA Button": #b81d25 background, white text, full radius
 * outline -> "button.border-brand-red": 1px #b81d25 border, #b81d25 text, full radius
 */

const base =
  'inline-flex items-center justify-center gap-2 rounded-full text-sm leading-5 ' +
  'transition-colors focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-brand/40 focus-visible:ring-offset-2 ' +
  'disabled:pointer-events-none disabled:opacity-50'

const variants = {
  solid: 'bg-brand font-medium text-white hover:bg-brand-dark',
  outline:
    'border border-brand bg-transparent font-semibold text-brand hover:bg-brand hover:text-white',
}

// Exact paddings from the Figma: sm 8/24, md 12/28, lg 15/28, wide 10/32
const sizes = {
  sm: 'px-6 py-2',
  md: 'px-7 py-3',
  lg: 'px-7 py-[15px]',
  wide: 'px-8 py-2.5',
}

export default function Button({
  variant = 'solid',
  size = 'md',
  as: Tag = 'button',
  fullWidth = false,
  className = '',
  children,
  ...props
}) {
  const classes = [
    base,
    variants[variant] ?? variants.solid,
    sizes[size] ?? sizes.md,
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  )
}
