import type { DomainStatus, TldOption } from "./mock-data"
import {
  SUPPORTED_TLDS,
  applyTldPreference,
  orderTldOptions,
  slugifyName,
} from "./mock-data"
import type { TldPreference } from "./search-params"

const RDAP_TIMEOUT_MS = 5_000

const RDAP_BASE_URLS: Partial<Record<(typeof SUPPORTED_TLDS)[number], string>> =
  {
    ".com": "https://rdap.verisign.com/com/v1/domain/",
    ".io": "https://rdap.nic.io/domain/",
    ".co": "https://rdap.nic.co/domain/",
    ".ai": "https://rdap.identitydigital.services/rdap/domain/",
    ".app": "https://pubapi.registry.google/rdap/domain/",
  }

function isRegisteredDomainPayload(payload: unknown): boolean {
  if (typeof payload !== "object" || payload === null) {
    return false
  }

  const record = payload as Record<string, unknown>
  return (
    record.objectClassName === "domain" ||
    typeof record.ldhName === "string" ||
    typeof record.handle === "string"
  )
}

export async function checkDomainViaRdap(
  slug: string,
  tld: string
): Promise<DomainStatus> {
  const baseUrl = RDAP_BASE_URLS[tld as (typeof SUPPORTED_TLDS)[number]]
  if (!baseUrl || !slug) {
    return "unavailable"
  }

  const fqdn = `${slug}${tld}`

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), RDAP_TIMEOUT_MS)

    const response = await fetch(`${baseUrl}${fqdn}`, {
      signal: controller.signal,
      headers: {
        Accept: "application/rdap+json, application/json",
      },
    })

    clearTimeout(timer)

    if (response.status === 404) {
      return "available"
    }

    if (response.status === 200) {
      const payload = await response.json()
      return isRegisteredDomainPayload(payload) ? "taken" : "unavailable"
    }

    return "unavailable"
  } catch {
    return "unavailable"
  }
}

export async function buildTldOptionsForSlug(
  slug: string,
  tlds: TldPreference = "any"
): Promise<TldOption[]> {
  const statuses = await Promise.all(
    SUPPORTED_TLDS.map(async (tld) => ({
      tld: tld as string,
      status: await checkDomainViaRdap(slug, tld),
    }))
  )

  return orderTldOptions(statuses, tlds)
}

export async function buildDomainFieldsFromRdap(
  name: string,
  tlds: TldPreference = "any"
) {
  const slug = slugifyName(name)
  const tldOptions = await buildTldOptionsForSlug(slug, tlds)

  return applyTldPreference(slug, tldOptions, tlds)
}
