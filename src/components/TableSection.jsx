import { useEffect, useMemo, useRef, useState } from 'react'
import { ClipboardList, Download, FilterX, Loader2, Search, X } from 'lucide-react'
import Button from './Button'
import FilterSelect from './FilterSelect'
import { peopleGroups, REGIONS, STATUSES, countriesFor } from '../data/peopleGroups'

/**
 * Explore People Groups Section.
 *
 * Figma: 1280x641 section (64/48 padding), header SPACE_BETWEEN aligned to the
 * baseline, then a HORIZONTAL gap of 32 between the list (828) and the side
 * card (324).
 *
 * Table: header background #b81d25 (Inter Bold 12/16, white), 63px rows
 * alternating #ffffff / #fcfcfc, #f3f4f6 borders, rounded top corners only (6px).
 */

const statusDot = {
  Unreached: 'bg-brand',
  Researching: 'bg-brand-light',
  Reached: 'bg-gray-300',
}

// The border belongs on the cell, not the <tr>: with border-separate (required
// for the sticky header) browsers do not paint borders on table rows.
const cell = 'border-b border-gray-100 text-sm leading-5 text-gray-600'

/**
 * Population and Priority are intentionally omitted: they are null across all
 * 281 records in the current dataset and were taking up 27% of the width to
 * display nothing but dashes. To bring them back, restore the entries here plus
 * the matching <td> elements.
 *
 * The 210px freed up were redistributed across the four remaining columns:
 *   300 (People Group) · 200 (Country) · 190 (Status) · 138 (Action) = 828
 *
 * The 24px horizontal padding lives only on the row edges (not on every cell),
 * so it is folded into the first and last columns — matching the Figma. Action
 * keeps 138-24 = 114 of content width, enough for the 105px button.
 */
const columns = [
  { label: 'People Group', width: '36.232%', pad: 'pl-6' },
  { label: 'Country', width: '24.155%', pad: '' },
  { label: 'Status', width: '22.947%', pad: '' },
  { label: 'Action', width: '16.666%', pad: 'pr-6', center: true },
]

const toOptions = (values, allLabel) => [
  { value: '', label: allLabel },
  ...values.map((value) => ({ value, label: value })),
]

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** Real file extension from a URL; falls back to jpg when the URL has none. */
const extensionOf = (url) => {
  const match = url.split('?')[0].match(/\.([a-z0-9]{3,4})$/i)
  return match ? match[1].toLowerCase() : 'jpg'
}

export default function TableSection({ filters, onFilterChange, onClearFilters }) {
  // Filters come from App: RegionSection writes to them as well.
  const { search, region, country, status } = filters
  const hasActiveFilter = Boolean(search || region || country || status)

  const [activeCardUrl, setActiveCardUrl] = useState(null)
  // Stored alongside the URL to name the downloaded file and label the modal.
  const [activeCardName, setActiveCardName] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const closeButtonRef = useRef(null)

  const openCard = (group) => {
    setActiveCardUrl(group.cardUrl)
    setActiveCardName(group.name)
  }

  /**
   * Forces the download of a cross-origin image.
   *
   * The <a download> attribute is ignored for cross-origin URLs: the browser
   * navigates instead of downloading. Fetching the file as a blob brings it
   * into the same origin, which makes `download` effective again.
   *
   * If the origin server does not send permissive CORS headers the fetch fails,
   * and we fall back to opening the image in a new tab so the user can save it
   * manually.
   */
  const handleDownload = async (url, filename) => {
    setIsDownloading(true)

    let objectUrl = null
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const blob = await response.blob()
      objectUrl = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = objectUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch {
      window.open(url, '_blank', 'noopener,noreferrer')
    } finally {
      // Revoke only well after the click, otherwise the blob is released before
      // the download has a chance to start.
      if (objectUrl) setTimeout(() => URL.revokeObjectURL(objectUrl), 10000)
      setIsDownloading(false)
    }
  }

  // While the modal is open: Escape closes it, body scrolling is locked (so the
  // page does not scroll behind the overlay) and focus moves to the close button.
  useEffect(() => {
    if (!activeCardUrl) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setActiveCardUrl(null)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeCardUrl])

  // The country dropdown narrows to the selected region.
  const countryOptions = useMemo(() => countriesFor(region), [region])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()

    return peopleGroups.filter((group) => {
      const matchesTerm =
        !term ||
        group.name.toLowerCase().includes(term) ||
        group.country.toLowerCase().includes(term)

      return (
        matchesTerm &&
        (!region || group.region === region) &&
        (!country || group.country === country) &&
        (!status || group.status === status)
      )
    })
  }, [search, region, country, status])

  return (
    <section id="people-groups" className="mx-auto w-full max-w-[1280px] px-12 pt-32">
      {/* ---- Header + filters ---- */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[399px]">
          <p className="mb-2 text-xs leading-4 font-bold tracking-[1.2px] text-brand uppercase">
            People Group Directory
          </p>

          <h2 className="mb-2 max-w-[269px] font-display text-display leading-[50px] font-normal text-gray-900">
            Explore People Groups
          </h2>

          <p className="text-sm leading-5 text-gray-500">
            Search and filter to find specific people groups and their status.
          </p>
        </div>

        {/* A real <form>: filtering is already live, but this keeps Enter working
            inside the search field without reloading the page. */}
        <form onSubmit={(event) => event.preventDefault()} className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <label htmlFor="pg-search" className="sr-only">
                Search people groups or countries
              </label>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400"
              />
              <input
                id="pg-search"
                type="search"
                value={search}
                onChange={(event) => onFilterChange('search', event.target.value)}
                placeholder="Search people groups..."
                className="h-[38px] w-56 rounded-md border border-gray-200 bg-white pr-4 pl-9 text-sm leading-5 text-gray-700 transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-brand focus:ring-2 focus:ring-brand/30 focus:outline-none"
              />
            </div>

            {/* Fixed widths from the Figma (132/143/122). Without them a native
                <select> sizes itself to its longest option — "Middle East &
                North Africa" pushed the control to 233px and wrapped the row. */}
            <FilterSelect
              label="Filter by region"
              value={region}
              onChange={(event) => onFilterChange('region', event.target.value)}
              options={toOptions(REGIONS, 'All Regions')}
              className="w-[132px]"
            />

            <FilterSelect
              label="Filter by country"
              value={country}
              onChange={(event) => onFilterChange('country', event.target.value)}
              options={toOptions(countryOptions, 'All Countries')}
              className="w-[143px]"
            />

            <FilterSelect
              label="Filter by status"
              value={status}
              onChange={(event) => onFilterChange('status', event.target.value)}
              options={toOptions(STATUSES, 'All Status')}
              className="w-[122px]"
            />
          </div>

          <div>
            {/* Outline variant, disabled while no filter is active: this is an
                undo action and should not compete with the red CTAs on the page. */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              disabled={!hasActiveFilter}
            >
              <FilterX className="size-4" aria-hidden="true" />
              Clear Filters
            </Button>
          </div>
        </form>
      </div>

      {/* ---- List + side card ---- */}
      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-1">
          {/* This div is the scroll context the sticky <th> anchors to.
              border-separate (not collapse) is required — with border-collapse
              Chrome stops painting the borders of sticky cells and the header
              visually bleeds over the rows. */}
          <div className="max-h-[600px] overflow-auto rounded-t-md border border-gray-100">
            <table className="w-full min-w-[828px] table-fixed border-separate border-spacing-0">
              <colgroup>
                {columns.map((col) => (
                  <col key={col.label} style={{ width: col.width }} />
                ))}
              </colgroup>

              <thead>
                <tr>
                  {/* bg-brand goes on each <th>, not on the <tr>: a sticky cell
                      with a transparent background would let rows show through
                      as the user scrolls. */}
                  {columns.map((col) => (
                    <th
                      key={col.label}
                      scope="col"
                      className={
                        'sticky top-0 z-10 bg-brand py-[14px] text-xs leading-4 font-bold text-white ' +
                        (col.center ? 'text-center ' : 'text-left ') +
                        col.pad
                      }
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.map((group, index) => (
                  <tr
                    key={group.id}
                    className={'h-[63px] ' + (index % 2 === 1 ? 'bg-paper' : 'bg-white')}
                  >
                    <td className="border-b border-gray-100 pl-6 text-sm leading-5 font-medium text-brand">
                      {group.name}
                    </td>
                    <td className={cell}>{group.country}</td>
                    <td className={cell}>
                      <span className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className={'size-2 shrink-0 rounded-full ' + statusDot[group.status]}
                        />
                        {group.status}
                      </span>
                    </td>
                    <td className="border-b border-gray-100 pr-6">
                      {/* Without a cardUrl there is no prayer card: a dash takes
                          the button's place, preserving row height and alignment. */}
                      {group.cardUrl ? (
                        // flex instead of text-center: the button (105px) is wider
                        // than its column (78px) and has to overflow symmetrically,
                        // as it does in the Figma (centred at x=764).
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => openCard(group)}
                            aria-label={`View prayer card for ${group.name}`}
                            className="cursor-pointer rounded-md border border-brand px-4 py-1.5 text-xs leading-4 font-medium whitespace-nowrap text-brand transition-colors hover:bg-brand hover:text-white focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
                          >
                            View Details
                          </button>
                        </div>
                      ) : (
                        <span className="block text-center text-sm leading-5 text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr className="bg-white">
                    <td
                      colSpan={columns.length}
                      className="h-[63px] px-6 text-center text-sm text-gray-500"
                    >
                      No people groups match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* ---- Side card ---- */}
        {/* self-start prevents flex-row stretching: without it the card matches
            the table's height (1396px with 20 rows) instead of the Figma's 309px. */}
        <aside className="flex w-full flex-col items-center rounded-xl border border-gray-100 bg-gray-50 p-8 text-center lg:w-[324px] lg:shrink-0 lg:self-start">
          <span className="mb-5 flex size-12 items-center justify-center rounded-lg bg-brand-surface">
            <ClipboardList className="size-6 text-brand" strokeWidth={2} aria-hidden="true" />
          </span>

          <h3 className="mb-3 text-lg leading-[24.75px] font-bold text-gray-900">
            Do you have an update on one of these people groups?
          </h3>

          <p className="mb-6 text-sm leading-[22.75px] text-gray-500">
            Your updates help us keep the data accurate and guide mission efforts.
          </p>

          <Button
            as="a"
            href="https://ocfep.com/operation-326/research/report/"
            target="_blank"
            rel="noopener noreferrer"
            fullWidth
            className="font-semibold"
          >
            Send an Update
          </Button>
        </aside>
      </div>

      {/* ---- Prayer Card modal ---- */}
      {activeCardUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Prayer card: ${activeCardName}`}
          // Comparing target with currentTarget matters: without it, clicking the
          // image itself would bubble up here and close the modal.
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveCardUrl(null)
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <div className="relative flex max-h-full flex-col items-center gap-4">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setActiveCardUrl(null)}
              aria-label="Close prayer card"
              className="absolute -top-3 -right-3 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full bg-white text-gray-800 shadow-lg transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              <X className="size-5" aria-hidden="true" />
            </button>

            <img
              src={activeCardUrl}
              alt={`Prayer card for ${activeCardName}`}
              className="max-h-[80vh] w-auto rounded-lg object-contain"
            />

            {/* Kept as an <a href>: it still works without JavaScript and allows
                "save link as". The onClick intercepts to force a blob download. */}
            <Button
              as="a"
              href={activeCardUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              size="md"
              aria-busy={isDownloading}
              onClick={(event) => {
                event.preventDefault()
                if (isDownloading) return
                handleDownload(
                  activeCardUrl,
                  `${slugify(activeCardName)}-prayer-card.${extensionOf(activeCardUrl)}`,
                )
              }}
              className={isDownloading ? 'pointer-events-none opacity-80' : ''}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="size-4" aria-hidden="true" />
                  Download Prayer Card
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
