import { Suspense } from "react"
import { redirect } from "next/navigation"

import { LandingPage } from "@/components/namegenius/landing-page"
import { BRIEF_PARAM_KEYS } from "@/lib/search-params"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const hasBriefParams = BRIEF_PARAM_KEYS.some((key) => key in params && params[key])

  if (hasBriefParams) {
    const query = new URLSearchParams()
    for (const key of BRIEF_PARAM_KEYS) {
      const value = params[key]
      if (typeof value === "string") {
        query.set(key, value)
      }
    }
    query.set("step", "1")
    redirect(`/brief?${query.toString()}`)
  }

  return (
    <Suspense fallback={null}>
      <LandingPage />
    </Suspense>
  )
}
