"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { useRecentSearches } from "@/hooks/use-recent-searches"
import {
  buildResultsUrl,
  parseTldPreference,
  type TldPreference,
} from "@/lib/search-params"
import {
  BriefShell,
  type BriefFooterContent,
} from "./brief-shell"
import {
  BriefChip,
  BriefContinueButton,
  BriefHeading,
  BriefInputField,
  BriefSkipButton,
  BriefSubtext,
} from "./brief-ui"

const TOTAL_STEPS = 4

const NAMING_CATEGORIES = [
  "Company",
  "Product",
  "App",
  "Project",
  "Website",
] as const

type NamingCategory = (typeof NAMING_CATEGORIES)[number]

const STEP_FOOTERS: Record<number, BriefFooterContent> = {
  1: {
    left: ["You can start with just this.", "We'll take it from here."],
    right: ["A little context", "goes a long way."],
  },
  2: {
    left: ["You can start with just this.", "We'll take it from here."],
    right: ["A little context", "goes a long way."],
  },
  3: {
    left: ["Real ideas", "lead to", "bolder names."],
    right: ["Or skip now.", "We'll still", "find great names."],
  },
  4: {
    left: ["Popular extensions.", "Bigger possibilities."],
    right: ["We'll check", "availability", "in real time."],
  },
}

const PRIMARY_TLDS = [".com", ".ai", ".io", ".co", ".app"] as const

function parseStep(value: string | null): number {
  const step = Number(value ?? "1")
  if (!Number.isFinite(step) || step < 1 || step > TOTAL_STEPS) {
    return 1
  }
  return step
}

function parseCategory(value: string | null): NamingCategory {
  if (value && NAMING_CATEGORIES.includes(value as NamingCategory)) {
    return value as NamingCategory
  }
  return "Product"
}

function buildBriefStepUrl(
  step: number,
  data: {
    concept: string
    description: string
    competitors: string
    category: NamingCategory
    tlds: TldPreference
  }
) {
  const query = new URLSearchParams()
  query.set("step", String(step))

  if (data.concept) query.set("concept", data.concept)
  if (data.description) query.set("description", data.description)
  if (data.competitors) query.set("competitors", data.competitors)
  if (data.category) query.set("category", data.category)

  if (data.tlds === "any") {
    query.set("tlds", "any")
  } else if (data.tlds.length > 0) {
    query.set("tlds", data.tlds.join(","))
  }

  return `/brief?${query.toString()}`
}

export function BriefPage() {
  const router = useRouter()
  const urlSearchParams = useSearchParams()

  const step = parseStep(urlSearchParams.get("step"))
  const [concept, setConcept] = useState("")
  const [description, setDescription] = useState("")
  const [competitors, setCompetitors] = useState("")
  const [category, setCategory] = useState<NamingCategory>("Product")
  const [tldPreference, setTldPreference] = useState<TldPreference>([".com"])
  const [showMoreTlds, setShowMoreTlds] = useState(false)
  const { add: addRecentSearch } = useRecentSearches()

  useEffect(() => {
    setConcept(urlSearchParams.get("concept") ?? "")
    setDescription(urlSearchParams.get("description") ?? "")
    setCompetitors(urlSearchParams.get("competitors") ?? "")
    setCategory(parseCategory(urlSearchParams.get("category")))
    setTldPreference(parseTldPreference(urlSearchParams.get("tlds") || ".com"))
  }, [urlSearchParams])

  const formData = useMemo(
    () => ({
      concept,
      description,
      competitors,
      category,
      tlds: tldPreference,
    }),
    [concept, description, competitors, category, tldPreference]
  )

  function goToStep(nextStep: number, overrides?: Partial<typeof formData>) {
    const data = { ...formData, ...overrides }
    router.push(buildBriefStepUrl(nextStep, data))
  }

  function handleFindNames() {
    addRecentSearch({
      concept,
      competitors,
      description,
      tlds: tldPreference,
    })
    router.push(
      buildResultsUrl({
        concept,
        competitors,
        description,
        tlds: tldPreference,
      })
    )
  }

  function toggleTld(tld: string) {
    if (tldPreference === "any") {
      setTldPreference([tld])
      return
    }

    const isSelected = tldPreference.includes(tld)
    const next = isSelected
      ? tldPreference.filter((item) => item !== tld)
      : [...tldPreference, tld]

    setTldPreference(next.length > 0 ? next : [".com"])
  }

  const canContinueStep1 = concept.trim().length > 0
  const canContinueStep2 = description.trim().length > 0
  const canFindNames =
    tldPreference === "any" ||
    (Array.isArray(tldPreference) && tldPreference.length > 0)

  return (
    <BriefShell step={step} footer={STEP_FOOTERS[step]}>
      {step === 1 && (
        <section>
          <BriefHeading>Your idea</BriefHeading>
          <BriefSubtext>
            What are you naming? The name you already have, or the core concept
            you want to name.
          </BriefSubtext>

          <BriefInputField
            id="concept"
            value={concept}
            onChange={setConcept}
            placeholder="an AI tool for designers"
            onSubmit={() => canContinueStep1 && goToStep(2)}
          />

          <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
            {NAMING_CATEGORIES.map((item) => (
              <BriefChip
                key={item}
                label={item}
                selected={category === item}
                onClick={() => setCategory(item)}
              />
            ))}
          </div>

          <BriefContinueButton
            label="Continue"
            disabled={!canContinueStep1}
            onClick={() => goToStep(2)}
          />
        </section>
      )}

      {step === 2 && (
        <section>
          <BriefHeading>
            What you&apos;re
            <br />
            building
          </BriefHeading>
          <BriefSubtext>
            Tell us what the company, product or project does.
          </BriefSubtext>

          <BriefInputField
            id="description"
            value={description}
            onChange={setDescription}
            placeholder="Helps designers generate UI ideas using AI"
            multiline
            onSubmit={() => canContinueStep2 && goToStep(3)}
          />

          <BriefContinueButton
            label="Continue"
            disabled={!canContinueStep2}
            onClick={() => goToStep(3)}
          />
        </section>
      )}

      {step === 3 && (
        <section>
          <BriefHeading>
            Competitors
            <br />
            &amp; keywords
          </BriefHeading>
          <BriefSubtext>
            Add relevant competitors, words, concepts or references. (optional)
          </BriefSubtext>

          <BriefInputField
            id="competitors"
            value={competitors}
            onChange={setCompetitors}
            placeholder="Figma, Framer, design, AI"
            onSubmit={() => goToStep(4)}
          />

          <BriefSkipButton onClick={() => goToStep(4, { competitors: "" })} />

          <BriefContinueButton label="Continue" onClick={() => goToStep(4)} />
        </section>
      )}

      {step === 4 && (
        <section>
          <BriefHeading>
            Preferred
            <br />
            domains
          </BriefHeading>
          <BriefSubtext>
            Which domain extensions do you want to prioritize?
          </BriefSubtext>

          <div className="mt-8 flex flex-wrap gap-2 sm:gap-3">
            {PRIMARY_TLDS.map((tld) => {
              const selected =
                tldPreference !== "any" && tldPreference.includes(tld)

              return (
                <BriefChip
                  key={tld}
                  label={tld}
                  selected={selected}
                  onClick={() => toggleTld(tld)}
                />
              )
            })}

            <BriefChip
              label="+ More"
              selected={showMoreTlds || tldPreference === "any"}
              onClick={() => {
                setShowMoreTlds((current) => !current)
                if (!showMoreTlds) {
                  setTldPreference("any")
                } else {
                  setTldPreference([".com"])
                }
              }}
            />
          </div>

          <BriefContinueButton
            label="Find names"
            disabled={!canFindNames}
            onClick={handleFindNames}
          />
        </section>
      )}
    </BriefShell>
  )
}
