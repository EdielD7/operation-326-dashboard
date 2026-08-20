import { useId } from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * Dropdown used in the filter bar above the table.
 *
 * The height is set explicitly with h-[38px]: a <select> ignores line-height
 * when sizing itself and falls back to the control's intrinsic height (40px),
 * which would miss the Figma's 38px.
 *
 * Figma ("select.appearance-none"): height 38, white background, 1px #e5e7eb
 * border, radius 6, padding 8/40/8/16, Inter Regular 14/20 text in #374151 and
 * a 16x16 chevron in #9ca3af.
 *
 * `options` accepts plain strings or { value, label } objects.
 */
export default function FilterSelect({
  label,
  options = [],
  value,
  onChange,
  className = '',
  ...props
}) {
  const id = useId()

  const normalized = options.map((opt) =>
    typeof opt === 'object' && opt !== null ? opt : { value: opt, label: opt },
  )

  return (
    <div className={['relative inline-flex', className].filter(Boolean).join(' ')}>
      {label ? (
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
      ) : null}

      <select
        id={id}
        value={value}
        onChange={onChange}
        className="h-[38px] w-full appearance-none rounded-md border border-gray-200 bg-white pr-10 pl-4 text-sm leading-5 text-gray-700 transition-colors hover:border-gray-300 focus:border-brand focus:ring-2 focus:ring-brand/30 focus:outline-none"
        {...props}
      >
        {normalized.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-400"
        strokeWidth={1.33}
      />
    </div>
  )
}
