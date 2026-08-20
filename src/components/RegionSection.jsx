import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from './Button'
import RegionCard from './RegionCard'
import { peopleGroups, REGIONS } from '../data/peopleGroups'

/**
 * Browse by Region Section.
 *
 * Figma: 1184x336, HORIZONTAL gap 48 · 288 text column · 848 carousel.
 * Cards are 220x320 with a gap of 16 (x = 0, 236, 472, 708, 944) inside a
 * container that clips its content (clipsContent: true).
 *
 * ARROW ARCHITECTURE
 * The arrows are siblings of the scroller, not children. This is mandatory:
 * `overflow-x-auto` creates a clipping context, so an arrow placed inside it
 * would (a) scroll away with the cards and (b) be cut off as it bleeds out.
 * Living in the `relative` wrapper (which has no overflow) lets them float on
 * top and cross the boundary - which is what makes the bleed effect possible.
 */

const plural = (count, singular, pluralForm) =>
  `${count} ${count === 1 ? singular : pluralForm}`

/**
 * "East & Southern Africa" -> "east-southern-africa"
 * The "&" becomes a space before hyphenation, otherwise a double hyphen would
 * be left behind. The .webp extension matches the real files in
 * public/img/regions.
 */
const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Cards derived from the live dataset rather than hard-coded from the Figma.
 *
 * Computed once at import time (peopleGroups and REGIONS are module constants),
 * so no useMemo is needed inside the component.
 *
 * Pluralisation matters here: Northeast Asia has 86 groups but only one country
 * (China), and the card would otherwise read "1 Countries".
 */
const regions = REGIONS.map((region) => {
  const groups = peopleGroups.filter((group) => group.region === region)
  const countries = new Set(groups.map((group) => group.country)).size

  return {
    name: region,
    imageUrl: `/img/regions/${slugify(region)}.webp`,
    stats: [
      plural(groups.length, 'People Group', 'People Groups'),
      plural(countries, 'Country', 'Countries'),
    ],
  }
})

const CARD_STEP = 236 // 220 card width + 16 gap, measured in the Figma

const arrowBase =
  'absolute top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center ' +
  'rounded-full border border-gray-100 bg-white text-gray-800 ' +
  'shadow-[0_4px_14px_rgba(0,0,0,0.15)] transition-all duration-200 ' +
  'hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40'

export default function RegionSection({ onSelectRegion }) {
  const scrollerRef = useRef(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const sync = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    // 1px tolerance: browsers report fractional scroll offsets
    setCanPrev(el.scrollLeft > 1)
    setCanNext(el.scrollLeft < max - 1)
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    sync()
    el.addEventListener('scroll', sync, { passive: true })

    // Recalculate when the container changes width (resize / zoom)
    const ro = new ResizeObserver(sync)
    ro.observe(el)

    return () => {
      el.removeEventListener('scroll', sync)
      ro.disconnect()
    }
  }, [sync])

  const step = (direction) => {
    scrollerRef.current?.scrollBy({ left: direction * CARD_STEP, behavior: 'smooth' })
  }

  return (
    <section id="regions" className="mx-auto w-full max-w-[1280px] px-12 pt-32">
      <div className="flex flex-col gap-12 lg:flex-row">
        {/* ---- Text column (288) ---- */}
        <div className="w-full lg:w-72 lg:shrink-0">
          <p className="mb-3 text-xs leading-4 font-bold tracking-[1.2px] text-brand uppercase">
            Explore by Region
          </p>

          <h2 className="mb-4 max-w-[185px] font-display text-display leading-[50px] font-normal text-gray-900">
            Browse by Region
          </h2>

          <p className="mb-8 max-w-[264px] text-sm leading-[22.75px] text-gray-500">
            Select a region to see the countries and people groups we are praying for and
            researching.
          </p>

          {/* Empty region = "All Regions": clears the filter and scrolls to the table */}
          <Button type="button" size="md" onClick={() => onSelectRegion?.('')}>
            View All Regions
          </Button>
        </div>

        {/* ---- Carousel ---- */}
        {/* `relative` wrapper with NO overflow: this is what lets the arrow bleed */}
        <div className="relative min-w-0 flex-1">
          <div
            ref={scrollerRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
          >
            {regions.map((region) => (
              <RegionCard
                key={region.name}
                name={region.name}
                imageUrl={region.imageUrl}
                stats={region.stats}
                onClick={() => onSelectRegion?.(region.name)}
                aria-label={`View ${region.name} people groups in the table`}
                className="snap-start"
              />
            ))}
          </div>

          {/* Left arrow: hidden at the starting position (scrollLeft === 0) */}
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={!canPrev}
            aria-label="Previous region"
            className={`${arrowBase} -left-6 disabled:pointer-events-none disabled:opacity-0`}
          >
            <ChevronLeft className="size-4" strokeWidth={2.5} aria-hidden="true" />
          </button>

          {/* Right arrow with bleed: -right-6 = half of its 48px outside the box */}
          <button
            type="button"
            onClick={() => step(1)}
            disabled={!canNext}
            aria-label="Next region"
            className={`${arrowBase} -right-6 disabled:pointer-events-none disabled:opacity-0`}
          >
            <ChevronRight className="size-4" strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}
