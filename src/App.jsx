import { useState } from 'react'
import { ArrowUp, Menu } from 'lucide-react'
import Button from './components/Button'
import HeroSection from './components/HeroSection'
import MapSection from './components/MapSection'
import RegionSection from './components/RegionSection'
import TableSection from './components/TableSection'

const navLinks = [
  { label: 'Reach Next', href: '#reach-next' },
  { label: 'Browse by Region', href: '#regions' },
  { label: 'People Groups', href: '#people-groups' },
]

/**
 * Header / Navbar — Figma: height 77 (py 20 + content 36 + 1px border),
 * horizontal padding 48, white background, bottom border #f3f4f6.
 * Logo: 32x32 red mark + "Pentecostal Church" (Semi Bold 14/17.5, #111827)
 * above "of God" (Regular 14/17.5, #4b5563).
 * Nav: gap 32, Inter Medium 14/20 in #1f2937.
 */
function Header() {
  return (
    <header className="w-full border-b border-gray-100 bg-white px-12 py-5">
      <div className="flex items-center justify-between">
        <a href="#" className="flex items-center gap-3">
          <img
            src="/img/pcg-logo.svg"
            alt=""
            aria-hidden="true"
            className="size-8 shrink-0 object-contain"
          />
          {/* The alt text carries the name because this image IS the wordmark.
              No invert filter needed: the SVG ships as rgb(74,85,101), which
              reads clearly against the white header. */}
          <img
            src="/img/PCG-logo-white-text.svg"
            alt="Pentecostal Church of God"
            className="h-9 w-auto object-contain"
          />
        </a>

        <div className="flex items-center gap-8">
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm leading-5 font-medium text-gray-800 transition-colors hover:text-brand"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            aria-label="Open menu"
            className="flex size-6 items-center justify-center text-gray-800 transition-colors hover:text-brand"
          >
            <Menu className="size-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  )
}

const EMPTY_FILTERS = { search: '', region: '', country: '', status: '' }

export default function App() {
  /**
   * Filter state lives here rather than inside TableSection because
   * RegionSection also writes to it (clicking a card filters the table).
   */
  const [filters, setFilters] = useState(EMPTY_FILTERS)

  const updateFilter = (key, value) =>
    setFilters((previous) => ({
      ...previous,
      [key]: value,
      // Changing region invalidates the selected country — the rule lives in
      // exactly one place so both entry points stay consistent.
      ...(key === 'region' ? { country: '' } : {}),
    }))

  const clearFilters = () => setFilters(EMPTY_FILTERS)

  /** Filters the table by region (empty string = all) and scrolls the user to it. */
  const showRegionInTable = (region) => {
    updateFilter('region', region)
    document.getElementById('people-groups')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-svh bg-white font-sans">
      <Header />
      <main>
        <HeroSection />
        <MapSection />
        <RegionSection onSelectRegion={showRegionInTable} />
        <TableSection
          filters={filters}
          onFilterChange={updateFilter}
          onClearFilters={clearFilters}
        />

        {/* Page-level control, deliberately outside the max-w-[1280px] sections:
            inside the table column it centred on that column (828px) and sat
            186px left of the page centre on a 2560px display. */}
        <div className="flex w-full justify-center py-12">
          <Button
            type="button"
            variant="outline"
            size="wide"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ArrowUp className="size-4" aria-hidden="true" />
            Back to Top
          </Button>
        </div>
      </main>
    </div>
  )
}
