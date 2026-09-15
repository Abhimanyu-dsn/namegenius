"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import {
  LANDING_FOCUS_CYCLE_MS,
  LANDING_FOCUS_ROW_INDEX,
  LANDING_HERO_HIGHLIGHT_INDEX,
  LANDING_SHOWCASE_DOMAINS,
} from "@/lib/landing-showcase"
import { cn } from "@/lib/utils"

const VISIBLE_ROW_COUNT = 5

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const onChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener("change", onChange)
    return () => mediaQuery.removeEventListener("change", onChange)
  }, [])

  return prefersReducedMotion
}

function ShowcaseRow({
  index,
  slug,
  tld,
  inFocusSlot = false,
  borderInRow = true,
}: {
  index: number
  slug: string
  tld: string
  inFocusSlot?: boolean
  borderInRow?: boolean
}) {
  return (
    <div
      className={cn(
        "flex w-full shrink-0 items-center gap-3 rounded-xl border px-5 py-4 sm:py-5",
        inFocusSlot && borderInRow
          ? "border-landing-fg opacity-100"
          : "border-transparent opacity-50",
        inFocusSlot && !borderInRow && "opacity-100"
      )}
    >
      <span
        className={cn(
          "w-6 shrink-0 font-mono text-xs sm:text-sm",
          inFocusSlot ? "text-landing-fg" : "text-landing-muted"
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        className={cn(
          "min-w-0 flex-1 truncate font-sans font-black uppercase tracking-tight",
          inFocusSlot ? "text-[28px] leading-8" : "text-xl"
        )}
      >
        {slug}
      </span>
      <span
        className={cn(
          "font-mono text-xs sm:text-sm",
          inFocusSlot ? "text-landing-fg" : "text-landing-muted"
        )}
      >
        {tld}
      </span>
      <span
        className={cn(
          "inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest sm:text-xs",
          inFocusSlot ? "text-landing-fg" : "text-landing-muted"
        )}
      >
        <span className="size-2 rounded-full bg-results-accent" aria-hidden />
        Available
      </span>
    </div>
  )
}

function getDomainIndexAtRow(focusDomainIndex: number, row: number) {
  const count = LANDING_SHOWCASE_DOMAINS.length
  return (focusDomainIndex - LANDING_FOCUS_ROW_INDEX + row + count * 10) % count
}

function FocusSlotShowcase() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [focusDomainIndex, setFocusDomainIndex] = useState(
    LANDING_HERO_HIGHLIGHT_INDEX
  )
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [slideUp, setSlideUp] = useState(false)
  const [rowHeight, setRowHeight] = useState<number>()
  const rowRef = useRef<HTMLDivElement>(null)

  const domainCount = LANDING_SHOWCASE_DOMAINS.length

  useEffect(() => {
    if (!rowRef.current) return
    setRowHeight(rowRef.current.offsetHeight)
  }, [focusDomainIndex, isTransitioning])

  useEffect(() => {
    if (prefersReducedMotion) return

    const timer = window.setTimeout(() => {
      setIsTransitioning(true)
      requestAnimationFrame(() => setSlideUp(true))
    }, LANDING_FOCUS_CYCLE_MS)

    return () => window.clearTimeout(timer)
  }, [prefersReducedMotion, focusDomainIndex])

  const handleTransitionEnd = useCallback(
    (event: React.TransitionEvent<HTMLDivElement>) => {
      if (event.propertyName !== "transform") return
      if (!isTransitioning || !slideUp) return

      setFocusDomainIndex((index) => (index + 1) % domainCount)
      setIsTransitioning(false)
      setSlideUp(false)
    },
    [domainCount, isTransitioning, slideUp]
  )

  if (prefersReducedMotion) {
    return (
      <aside aria-hidden="true" className="relative w-full min-w-0">
        <div className="flex flex-col gap-0">
          {LANDING_SHOWCASE_DOMAINS.map((domain, index) => (
            <ShowcaseRow
              key={domain.slug}
              index={index}
              slug={domain.slug}
              tld={domain.tld}
              inFocusSlot={index === LANDING_HERO_HIGHLIGHT_INDEX}
            />
          ))}
        </div>
      </aside>
    )
  }

  const rowCount = isTransitioning ? VISIBLE_ROW_COUNT + 1 : VISIBLE_ROW_COUNT
  const rows = Array.from({ length: rowCount }, (_, row) => {
    if (isTransitioning && row === VISIBLE_ROW_COUNT) {
      const enteringIndex =
        (focusDomainIndex - LANDING_FOCUS_ROW_INDEX + VISIBLE_ROW_COUNT) %
        domainCount
      return {
        row,
        domainIndex: enteringIndex,
        domain: LANDING_SHOWCASE_DOMAINS[enteringIndex],
      }
    }

    const domainIndex = getDomainIndexAtRow(focusDomainIndex, row)
    return {
      row,
      domainIndex,
      domain: LANDING_SHOWCASE_DOMAINS[domainIndex],
    }
  })

  const viewportHeight = rowHeight ? rowHeight * VISIBLE_ROW_COUNT : undefined
  const focusFrameTop = rowHeight ? rowHeight * LANDING_FOCUS_ROW_INDEX : undefined

  return (
    <aside aria-hidden="true" className="relative w-full min-w-0">
      {rowHeight && focusFrameTop !== undefined ? (
        <div
          className="pointer-events-none absolute inset-x-0 z-10 rounded-xl border border-landing-fg"
          style={{ top: focusFrameTop, height: rowHeight }}
        />
      ) : null}

      <div className="overflow-hidden" style={{ height: viewportHeight }}>
        <div
          className={cn(
            "flex flex-col",
            slideUp && rowHeight
              ? "landing-focus-track"
              : "landing-focus-track--instant"
          )}
          style={
            slideUp && rowHeight
              ? { transform: `translateY(-${rowHeight}px)` }
              : undefined
          }
          onTransitionEnd={handleTransitionEnd}
        >
          {rows.map(({ row, domainIndex, domain }) => {
            const focusRow = slideUp
              ? LANDING_FOCUS_ROW_INDEX + 1
              : LANDING_FOCUS_ROW_INDEX

            return (
              <div
                key={`${domain.slug}-${row}-${focusDomainIndex}`}
                ref={row === 0 ? rowRef : undefined}
              >
                <ShowcaseRow
                  index={domainIndex}
                  slug={domain.slug}
                  tld={domain.tld}
                  inFocusSlot={row === focusRow}
                  borderInRow={false}
                />
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

export function LandingDomainShowcase({
  variant = "marquee",
  highlightIndex = LANDING_HERO_HIGHLIGHT_INDEX,
  showLabel = true,
}: {
  variant?: "marquee" | "static" | "focus"
  highlightIndex?: number
  showLabel?: boolean
}) {
  if (variant === "focus") {
    return <FocusSlotShowcase />
  }

  if (variant === "static") {
    return (
      <aside aria-hidden="true" className="relative w-full min-w-0">
        <div className="flex flex-col gap-0">
          {LANDING_SHOWCASE_DOMAINS.map((domain, index) => (
            <ShowcaseRow
              key={domain.slug}
              index={index}
              slug={domain.slug}
              tld={domain.tld}
              inFocusSlot={index === highlightIndex}
            />
          ))}
        </div>
      </aside>
    )
  }

  const loopedDomains = [...LANDING_SHOWCASE_DOMAINS, ...LANDING_SHOWCASE_DOMAINS]

  return (
    <aside
      aria-hidden="true"
      className={cn(
        "relative w-full min-w-0",
        showLabel
          ? "max-h-[min(40vh,320px)]"
          : "max-h-[min(65vh,520px)]"
      )}
    >
      {showLabel ? (
        <>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-landing-muted sm:text-xs">
            Available domains
          </p>
          <div className="mt-2 h-px w-12 bg-landing-fg/30" />
        </>
      ) : null}

      <div
        className={cn(
          "relative overflow-hidden",
          showLabel ? "mt-6 h-[min(40vh,320px)]" : "h-[min(65vh,520px)]",
          "[mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]"
        )}
      >
        <div className="landing-domain-marquee-track flex flex-col gap-3 motion-reduce:gap-3">
          {loopedDomains.map((domain, index) => (
            <ShowcaseRow
              key={`${domain.slug}-${index}`}
              index={index % LANDING_SHOWCASE_DOMAINS.length}
              slug={domain.slug}
              tld={domain.tld}
            />
          ))}
        </div>
      </div>
    </aside>
  )
}
