import { Suspense } from "react"

import { BriefPage } from "@/components/namegenius/brief-page"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <BriefPage />
    </Suspense>
  )
}
