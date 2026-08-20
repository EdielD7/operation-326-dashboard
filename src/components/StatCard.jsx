import { statIcons } from './statIcons'

/**
 * Statistic card used by the "Stats Bar Section".
 *
 * Figma: horizontal flex, gap 16, padding 32.
 * 40x40 icon in #b81d25 · figure Inter Bold 36/40 in #111827
 * · label Inter Medium 12/15 in #4b5563 (wraps onto two lines).
 *
 * `icon` accepts a key from `statIcons` or any lucide component.
 */
export default function StatCard({ icon, value, label, className = '' }) {
  const Icon = typeof icon === 'string' ? statIcons[icon] : icon

  const classes = ['flex items-center gap-4 p-8', className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      {Icon ? (
        <Icon className="size-10 shrink-0 text-brand" strokeWidth={1.5} aria-hidden="true" />
      ) : null}

      <div className="flex flex-col">
        <span className="mb-1 text-4xl leading-10 font-bold text-gray-900">{value}</span>
        <span className="text-xs leading-[15px] font-medium whitespace-pre-line text-gray-600">
          {label}
        </span>
      </div>
    </div>
  )
}
