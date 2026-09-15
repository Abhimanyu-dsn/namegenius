import { Suspense } from "react"

import { ResultsPage } from "@/components/namegenius/results-page"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ResultsPage />
    </Suspense>
  )
}
