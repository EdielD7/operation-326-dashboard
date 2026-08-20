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
        {/* items-end anchors the One Chance logo to the bottom of the text block,
            which is the CTA's baseline — no magic offset, so it survives any
            reflow of the headline. justify-between pins it to the container's
            right edge, inheriting the same px-12 as the copy. */}
        <div className="flex w-full items-end justify-between gap-8">
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

          {/* h-9 matches the header wordmark exactly. Hidden below md, where the
              headline already uses the full width and the logo would crowd it. */}
          <img
            src="/img/one-chance-logo.png"
            alt="One Chance"
            className="hidden h-9 w-auto shrink-0 object-contain md:block"
          />
        </div>
      </div>
    </section>
  )
}
