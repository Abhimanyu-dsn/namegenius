import { NextResponse } from "next/server"

import { generateLiveSuggestions } from "@/lib/generate-live-suggestions"
import { generateSuggestions } from "@/lib/mock-data"
import {
  parseTldPreference,
  toBrandInputs,
  type SearchParams,
  type TldPreference,
} from "@/lib/search-params"

function parseRequestTlds(value: unknown): TldPreference {
  if (value === "any") {
    return "any"
  }

  if (Array.isArray(value)) {
    const selected = value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean)

    return selected.length > 0 ? selected : "any"
  }

  if (typeof value === "string") {
    return parseTldPreference(value)
  }

  return "any"
}

export async function POST(request: Request) {
  let body: Partial<SearchParams>

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      {
        error: "Invalid request body.",
        code: "GENERATION_FAILED",
      },
      { status: 400 }
    )
  }

  const seed = Number(body.seed ?? 0)
  const params = {
    concept: typeof body.concept === "string" ? body.concept : "",
    competitors: typeof body.competitors === "string" ? body.competitors : "",
    description: typeof body.description === "string" ? body.description : "",
    tlds: parseRequestTlds(body.tlds),
    seed: Number.isFinite(seed) && seed >= 0 ? seed : 0,
  }

  if (params.concept.trim().length === 0) {
    return NextResponse.json(
      { error: "Add your idea to get names.", code: "EMPTY_BRIEF" },
      { status: 400 }
    )
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim()

  if (!apiKey) {
    const brandInputs = toBrandInputs(params)
    return NextResponse.json({
      suggestions: generateSuggestions(brandInputs, params.seed),
    })
  }

  const result = await generateLiveSuggestions(
    toBrandInputs(params),
    params.tlds,
    params.seed
  )

  if (result.error) {
    return NextResponse.json(
      { error: result.error, code: result.code ?? "GENERATION_FAILED" },
      { status: result.code === "QUOTA_EXHAUSTED" ? 429 : 500 }
    )
  }

  return NextResponse.json({ suggestions: result.suggestions })
}
