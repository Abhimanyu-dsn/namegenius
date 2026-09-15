export type LandingShowcaseDomain = {
  slug: string
  tld: string
}

export const LANDING_SHOWCASE_DOMAINS: LandingShowcaseDomain[] = [
  { slug: "brandforge", tld: ".com" },
  { slug: "ownmark", tld: ".com" },
  { slug: "ideavault", tld: ".com" },
  { slug: "securemint", tld: ".ai" },
  { slug: "vaultory", tld: ".io" },
]

export const LANDING_HERO_HIGHLIGHT_INDEX = 2

export const LANDING_FOCUS_ROW_INDEX = 2

export const LANDING_FOCUS_CYCLE_MS = 4000
