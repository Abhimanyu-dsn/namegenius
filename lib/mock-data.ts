import { applyBrandMatch, type BrandInputs } from "./brand-match"

export type DomainStatus = "available" | "taken"

export interface TldOption {
  tld: string
  status: DomainStatus
}

export interface NameSuggestion {
  id: string
  name: string
  primaryDomain: string
  domainStatus: DomainStatus
  tldOptions: TldOption[]
  brandMatch: number
  matchContext: string
}

export const emptyFormValues: BrandInputs = {
  concept: "",
  competitors: "",
  description: "",
}

export const defaultFormValues = {
  concept: "ForgeVault",
  competitors:
    "fintech, security, mint, asset-lock, robust, premium",
  description:
    "A next-generation digital asset vault for founders who need institutional-grade security without enterprise complexity. Built for solo operators and small teams managing high-value IP, credentials, and strategic documents.",
}

type SuggestionTemplate = Omit<NameSuggestion, "brandMatch">

export const SUPPORTED_TLDS = [".com", ".ai", ".co", ".io", ".app"] as const

export const RESULTS_BATCH_SIZE = 5

const TLD_LIST = SUPPORTED_TLDS

function slugifyName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "")
}

function buildDomainFields(name: string, comAvailable: boolean) {
  const slug = slugifyName(name)

  return {
    primaryDomain: `${slug}.com`,
    domainStatus: (comAvailable ? "available" : "taken") as DomainStatus,
    tldOptions: TLD_LIST.map((tld) => ({
      tld,
      status: (tld === ".com" && comAvailable ? "available" : "taken") as DomainStatus,
    })),
  }
}

function createTemplate(
  id: string,
  name: string,
  comAvailable: boolean,
  matchContext: string
): SuggestionTemplate {
  return {
    id,
    name,
    matchContext,
    ...buildDomainFields(name, comAvailable),
  }
}

const mockSuggestionTemplates: SuggestionTemplate[] = [
  createTemplate(
    "1",
    "BrandForge",
    true,
    "creative engine brand forge premium industrial"
  ),
  createTemplate(
    "2",
    "NameCraft",
    false,
    "artisanal craft naming premium studio"
  ),
  createTemplate(
    "3",
    "IdeaVault",
    true,
    "enterprise vault secure scalable naming"
  ),
  createTemplate("4", "OwnMark", true, "trademark ownable mark recall"),
  createTemplate("5", "Vaultline", false, "fintech vault asset security edge"),
]

const mockSuggestionTemplatesAlt: SuggestionTemplate[] = [
  createTemplate(
    "alt-1",
    "SecureMint",
    true,
    "fintech security mint premium asset"
  ),
  createTemplate(
    "alt-2",
    "Lockspire",
    false,
    "security vault credential lockspire robust"
  ),
  createTemplate(
    "alt-3",
    "Vaultory",
    true,
    "enterprise vault institutional founder"
  ),
  createTemplate(
    "alt-4",
    "Assetloom",
    true,
    "asset digital premium builder stack"
  ),
  createTemplate(
    "alt-5",
    "Fortibase",
    false,
    "security robust systems durable brand"
  ),
]

const mockSuggestionTemplatesThird: SuggestionTemplate[] = [
  createTemplate(
    "c-1",
    "Trustloom",
    true,
    "trust premium secure naming founder"
  ),
  createTemplate(
    "c-2",
    "Cipherbase",
    false,
    "cipher security vault institutional base"
  ),
  createTemplate("c-3", "Nestmark", true, "mark nest ownable trademark recall"),
  createTemplate(
    "c-4",
    "Holdsmith",
    true,
    "hold asset premium builder smith"
  ),
  createTemplate(
    "c-5",
    "Rampvault",
    false,
    "ramp vault fintech growth secure"
  ),
]

const suggestionPools = [
  mockSuggestionTemplates,
  mockSuggestionTemplatesAlt,
  mockSuggestionTemplatesThird,
]

export function generateSuggestions(
  inputs: BrandInputs = defaultFormValues,
  seed = 0
): NameSuggestion[] {
  const pool = suggestionPools[seed % suggestionPools.length].slice(
    0,
    RESULTS_BATCH_SIZE
  )
  const withIds = pool.map((suggestion, index) => ({
    ...suggestion,
    id: `${seed}-${suggestion.id}-${index}`,
  }))

  return applyBrandMatch(withIds, inputs, seed).map((suggestion) =>
    suggestion.name === "BrandForge" ? { ...suggestion, brandMatch: 92 } : suggestion
  )
}

export const mockSuggestions = generateSuggestions()

export function filterTldOptions(
  tldOptions: TldOption[],
  preference: "any" | string[]
): TldOption[] {
  if (preference === "any") {
    return tldOptions
  }

  return tldOptions.filter((option) => preference.includes(option.tld))
}
