/**
 * Card used by the "Browse by Region" section.
 *
 * Figma: 220x320, radius 16, image covering the background, dark gradient on
 * top and content aligned to the bottom (padding 20).
 * Title Inter Bold 16.8/21 white · meta Inter Medium 12/19.5 in #d1d5db.
 *
 * Uses a real <img> with object-cover, so swapping `imageUrl` is all it takes
 * to drop in the final photography.
 */
const PLACEHOLDER = 'https://placehold.co/440x640/2a2a2a/ffffff?text=Region'

export default function RegionCard({
  name,
  imageUrl = PLACEHOLDER,
  stats = [],
  className = '',
  onClick,
  ...props
}) {
  // With onClick the whole card becomes a <button>: keyboard focus and the
  // correct control semantics come for free, which an <article> would not give.
  const Root = onClick ? 'button' : 'article'

  const classes = [
    'group relative h-80 w-[220px] shrink-0 overflow-hidden rounded-2xl',
    onClick
      ? 'cursor-pointer text-left focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none'
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Root
      className={classes}
      {...(onClick ? { type: 'button', onClick } : {})}
      {...props}
    >
      <img
        src={imageUrl}
        alt={name ? `${name} region` : ''}
        loading="lazy"
        className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Gradient that keeps the text readable over the photograph */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent"
      />

      <div className="relative flex h-full flex-col justify-end p-5">
        <h3 className="mb-2 text-[16.8px] leading-[21px] font-bold whitespace-pre-line text-white">
          {name}
        </h3>

        {stats.map((stat) => (
          <p key={stat} className="text-xs leading-[19.5px] font-medium text-gray-300">
            {stat}
          </p>
        ))}
      </div>
    </Root>
  )
}
