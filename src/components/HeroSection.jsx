import Button from './Button'

/**
 * Hero Section — Figma: 1920x600, dark background artwork (#2a2a2a) with a
 * 50% black overlay.
 *
 * Content container 1280 with 48 horizontal padding (1184 inner), text block
 * capped at 672 (exactly max-w-2xl) and vertically centred.
 *
 * Figma spacing (gap 20 plus the padding of the ":margin" wrappers):
 *   tagline → title        20px
 *   title → description    20 + 8  = 28px
 *   description → CTA      20 + 24 = 44px
 */
export default function HeroSection({ imageUrl = '/img/hero.webp' }) {
  return (
    <section className="relative h-[600px] w-full overflow-hidden bg-ink">
      <img
        src={imageUrl}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover"
      />

      {/* Dark overlay for contrast — #000000 at 50% */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/50" />

      <div className="relative mx-auto flex h-full w-full max-w-[1280px] items-center px-12">
        <div className="max-w-2xl">
          <p className="text-sm leading-5 font-bold tracking-[1.4px] text-brand uppercase">One Chance</p>

          <h1 className="mt-5 font-display text-hero leading-[61.6px] font-normal text-white">
            Every people group deserves one chance to hear the Gospel.
          </h1>

          <p className="mt-7 max-w-[605px] text-lg leading-[29.25px] text-gray-100">
            Our Task Force teams have identified 326 unreached people groups where there has been
            no work since the cross. You can be part of changing that.
          </p>

          <div className="mt-11 flex flex-wrap gap-4">
            <Button
              as="a"
              href="https://www.pcg.org/missions/onechance#birthright"
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
            >
              Sponsor and Give
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
