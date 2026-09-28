import { GoogleGenerativeAI } from "@google/generative-ai"

import type { BrandInputs } from "./brand-match"
import { slugifyName } from "./mock-data"
import type { TldPreference } from "./search-params"
import { formatTldPreferenceLabel } from "./search-params"

export interface GeneratedNameCandidate {
  name: string
  matchContext: string
}

export class GeminiQuotaError extends Error {
  constructor(message = "Gemini quota exhausted") {
    super(message)
    this.name = "GeminiQuotaError"
  }
}

export class GeminiGenerationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "GeminiGenerationError"
  }
}

const GEMINI_TIMEOUT_MS = 60_000
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-flash-lite-latest"

function getErrorStatus(error: unknown): number | undefined {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status: unknown }).status
    return typeof status === "number" ? status : undefined
  }

  return undefined
}

function mapGeminiError(error: unknown): GeminiGenerationError | GeminiQuotaError {
  if (error instanceof GeminiGenerationError || error instanceof GeminiQuotaError) {
    return error
  }

  if (isGeminiQuotaError(error)) {
    return new GeminiQuotaError()
  }

  const status = getErrorStatus(error)
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase()

  if (status === 503 || message.includes("overloaded") || message.includes("unavailable")) {
    return new GeminiGenerationError(
      "Gemini is temporarily busy. Please try again in a moment."
    )
  }

  if (status === 400 && message.includes("api key")) {
    return new GeminiGenerationError(
      "Your Gemini API key is invalid. Check GEMINI_API_KEY in .env.local and restart the dev server."
    )
  }

  if (message.includes("timed out")) {
    return new GeminiGenerationError(
      "Name generation is taking too long. Please try again."
    )
  }

  return new GeminiGenerationError(
    "Something went wrong generating names. Try again."
  )
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

export function isGeminiQuotaError(error: unknown): boolean {
  if (error instanceof GeminiQuotaError) return true

  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase()

  const status =
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status: unknown }).status === "number"
      ? (error as { status: number }).status
      : undefined

  const code =
    typeof error === "object" && error !== null && "status" in error
      ? String((error as { status: unknown }).status)
      : ""

  return (
    status === 429 ||
    code === "RESOURCE_EXHAUSTED" ||
    message.includes("quota") ||
    message.includes("quota exceeded") ||
    message.includes("generaterequestsperday") ||
    message.includes("resource_exhausted")
  )
}

function buildPrompt(
  inputs: BrandInputs,
  tlds: TldPreference,
  seed: number
): string {
  const parts: string[] = [
    "Generate exactly 5 brandable company/product names suitable as domain labels.",
    "Return JSON only, no markdown, in this shape:",
    '{"names":[{"name":"ExampleName","matchContext":"keyword1 keyword2 keyword3"}, ...]}',
    "Rules:",
    "- name: 3-20 characters, letters and numbers only, no spaces or punctuation",
    "- matchContext: 4-8 lowercase keywords describing the name fit",
    "- All 5 names must be unique",
    `- Variation seed: ${seed} (use for diversity on refresh)`,
  ]

  if (inputs.concept.trim()) {
    parts.push(`Concept / working name: ${inputs.concept.trim()}`)
  }
  if (inputs.description.trim()) {
    parts.push(`Description: ${inputs.description.trim()}`)
  }
  if (inputs.competitors.trim()) {
    parts.push(`Competitors / keywords: ${inputs.competitors.trim()}`)
  }
  if (tlds !== "any") {
    parts.push(`Preferred TLDs: ${formatTldPreferenceLabel(tlds)}`)
    parts.push(
      "Names must be optimized for these TLDs: keep them short (ideally 4-10 characters), easy to spell, and make each read well as a full domain such as name" +
        `${tlds[0]}. Favor names likely to be unregistered on these TLDs.`
    )
  }

  parts.push(
    "If only one input field is provided, still return 5 strong names based on that context."
  )

  return parts.join("\n")
}

function extractJsonPayload(text: string): unknown {
  const trimmed = text.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const jsonText = fenced ? fenced[1].trim() : trimmed
  return JSON.parse(jsonText)
}

function parseCandidates(payload: unknown): GeneratedNameCandidate[] {
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("names" in payload) ||
    !Array.isArray((payload as { names: unknown }).names)
  ) {
    throw new GeminiGenerationError("Invalid response shape from Gemini")
  }

  const names = (payload as { names: unknown[] }).names
  const candidates: GeneratedNameCandidate[] = []

  for (const entry of names) {
    if (
      typeof entry !== "object" ||
      entry === null ||
      typeof (entry as { name?: unknown }).name !== "string"
    ) {
      continue
    }

    const name = (entry as { name: string }).name.trim()
    const matchContext =
      typeof (entry as { matchContext?: unknown }).matchContext === "string"
        ? (entry as { matchContext: string }).matchContext.trim()
        : name.toLowerCase()

    const slug = slugifyName(name)
    if (!slug || slug.length < 3 || slug.length > 63) {
      continue
    }

    candidates.push({ name, matchContext })
  }

  return candidates
}

async function requestGeminiNames(
  prompt: string,
  apiKey: string
): Promise<GeneratedNameCandidate[]> {
  const client = new GoogleGenerativeAI(apiKey)
  const model = client.getGenerativeModel({ model: GEMINI_MODEL })

  let timeoutId: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(
        new GeminiGenerationError(
          "Name generation is taking too long. Please try again."
        )
      )
    }, GEMINI_TIMEOUT_MS)
  })

  try {
    const result = await Promise.race([model.generateContent(prompt), timeout])
    if (timeoutId) clearTimeout(timeoutId)

    const text = result.response.text()
    const payload = extractJsonPayload(text)
    const candidates = parseCandidates(payload)

    if (candidates.length < 3) {
      throw new GeminiGenerationError(
        "Not enough usable names were generated. Try editing your brief."
      )
    }

    return candidates.slice(0, 5)
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId)

    if (error instanceof SyntaxError) {
      throw new GeminiGenerationError(
        "We couldn't read name suggestions. Try again."
      )
    }

    throw mapGeminiError(error)
  }
}

export async function generateNamesFromGemini(
  inputs: BrandInputs,
  tlds: TldPreference,
  seed: number
): Promise<GeneratedNameCandidate[]> {
  const apiKey = process.env.GEMINI_API_KEY?.trim()
  if (!apiKey) {
    throw new GeminiGenerationError("GEMINI_API_KEY is not configured")
  }

  const prompt = buildPrompt(inputs, tlds, seed)
  let lastError: unknown

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await requestGeminiNames(prompt, apiKey)
    } catch (error) {
      lastError = error
      const status = getErrorStatus(error)

      if (attempt === 0 && (status === 503 || status === 429)) {
        await sleep(2000)
        continue
      }

      throw mapGeminiError(error)
    }
  }

  throw mapGeminiError(lastError)
}
