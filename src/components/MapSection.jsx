import StatCard from './StatCard'
import { peopleGroups, REGIONS, countriesFor } from '../data/peopleGroups'

/**
 * Stats Bar + Map Section.
 *
 * Figma (absolute positions):
 *   Hero ends at 676 · Stats Bar 724-864 · Map 976-1444
 *   -> 48px between hero and stats, 112px between stats and map.
 *
 * Stats Bar: 1184x140, white background, #f3f4f6 border, radius 12, five items
 *   with a #e5e7eb left divider from the second one onwards.
 * Map row: HORIZONTAL gap 64 · 288 text column · map area with radius 16.
 */

/**
 * unreachedGroups filters by status, not just by presence in the dataset: the
 * 281 records include 73 already "Reached", so a plain peopleGroups.length
 * would overstate the headline figure by that many (281 vs. the correct 208).
 */
const unreachedGroups = peopleGroups.filter((group) => group.status === 'Unreached')

/**
 * The first three figures come from the live dataset (countriesFor() with no
 * argument returns every unique country). The last two remain static: the
 * dataset has no field representing "being researched" or "reports submitted".
 */
const stats = [
  { icon: 'unreached', value: unreachedGroups.length, label: 'Unreached\nPeople Groups' },
  { icon: 'regions', value: REGIONS.length, label: 'Regions\nWorldwide' },
  { icon: 'countries', value: countriesFor().length, label: 'Countries\nIdentified' },
  { icon: 'researching', value: '38', label: 'Groups Currently\nBeing Researched' },
  { icon: 'reports', value: '87', label: 'Mission Reports\nSubmitted' },
]

/**
 * Marker coordinates, expressed as percentages of the map image.
 *
 * These only line up because the wrapper is sized BY the image (block w-full,
 * automatic height): any object-cover/contain would crop the map or add
 * letterboxing, pushing the markers off their continents.
 */
const HOTSPOT_COORDS = {
  'Latin America': { top: '65%', left: '28%' },
  'West & Central Africa': { top: '44%', left: '51%' },
  'North Africa & Middle East': { top: '40%', left: '53%' },
  'East & Southern Africa': { top: '47%', left: '59%' },
  'Eastern Europe & Eurasia': { top: '20%', left: '60%' },
  'Central Asia': { top: '30%', left: '65%' },
  'South Asia': { top: '45%', left: '70%' },
  'Northeast Asia': { top: '35%', left: '78%' },
  'Southeast Asia': { top: '59%', left: '82%' },
}

/**
 * Derived from REGIONS (the dataset) rather than from the keys above: if the
 * data gains a region without coordinates it is skipped instead of breaking
 * the map.
 */
/**
 * Filtered by status here too: the tooltip below reads "{count} Unreached
 * People Groups", so it must count the same subset as the stats bar rather
 * than every group in the region regardless of status.
 */
const hotspots = REGIONS.filter((region) => HOTSPOT_COORDS[region]).map((region) => ({
  name: region,
  ...HOTSPOT_COORDS[region],
  count: unreachedGroups.filter((group) => group.region === region).length,
}))

export default function MapSection() {
  return (
    <section id="reach-next" className="mx-auto w-full max-w-[1280px] px-12 pt-12">
      {/* ---- Stats Bar ---- */}
      <div className="grid grid-cols-1 rounded-xl border border-gray-100 bg-white sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <StatCard
            key={stat.value + stat.label}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            className="border-gray-200 lg:border-l lg:first:border-l-0"
          />
        ))}
      </div>

      {/* ---- Map row ---- */}
      <div className="mt-28 flex flex-col gap-16 lg:flex-row">
        <div className="w-full lg:w-72 lg:shrink-0">
          <p className="mb-3 text-xs leading-4 font-bold tracking-[1.2px] text-brand uppercase">
            Explore the Unreached
          </p>

          <h2 className="mb-5 font-display text-display leading-[50px] font-normal text-gray-900">
            Where can we Reach Next?
          </h2>

          <p className="text-sm leading-[22.75px] text-gray-500">
            Explore the map to see unreached people groups around the world. Click on a country to
            view the people groups and their status.
          </p>
        </div>

        {/* The image sizes the wrapper - that is what keeps the marker
            percentages aligned to the continents at any screen width.
            No overflow-hidden here: it would clip the tooltips that rise above
            the map, so the rounding goes on the image itself. */}
        <div className="relative w-full flex-1 self-start">
          <img
            src="/img/world-map.png"
            alt="World map highlighting regions with unreached people groups"
            className="block w-full rounded-2xl bg-gray-50"
          />

          {hotspots.map((spot) => (
            <div
              key={spot.name}
              style={{ top: spot.top, left: spot.left }}
              className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 hover:z-30 focus-within:z-30"
            >
              <button
                type="button"
                aria-label={`${spot.name}: ${spot.count} unreached people groups`}
                className="block size-4 cursor-pointer rounded-full bg-brand ring-2 ring-white transition-transform duration-200 hover:scale-125 focus-visible:ring-4 focus-visible:outline-none"
              />

              {/* focus-within alongside hover: with :hover alone the tooltip
                  would be unreachable by keyboard. */}
              <div className="absolute bottom-full left-1/2 mb-3 hidden -translate-x-1/2 group-focus-within:block group-hover:block">
                <div className="relative rounded-lg border border-gray-100 bg-white px-4 py-3 whitespace-nowrap shadow-[0_4px_14px_rgba(0,0,0,0.15)]">
                  <p className="text-[15px] leading-[22.5px] font-bold text-gray-900">{spot.name}</p>
                  <p className="mt-1 text-xs leading-4 font-medium text-gray-500">
                    {spot.count} Unreached People Groups
                  </p>

                  {/* Pointer: a square rotated 45 degrees, showing two of its borders */}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-[5px] left-1/2 size-2.5 -translate-x-1/2 rotate-45 border-r border-b border-gray-100 bg-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
