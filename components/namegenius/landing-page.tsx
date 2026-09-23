"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

import { LandingDomainShowcase } from "./landing-domain-showcase"
import { MarketingHeader } from "./marketing-header"

export function LandingPage() {
  return (
    <div
      className={cn(
        "landing flex min-h-svh flex-col bg-landing-bg text-landing-fg"
      )}
    >
      <MarketingHeader />

      <main
        className={cn(
          "flex flex-1 flex-col justify-end px-6 pb-10 sm:px-8 sm:pb-12",
          "lg:justify-center lg:items-start"
        )}
      >
        <div
          className="mx-auto flex w-full max-w-7xl flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-8"
        >
          <div className="flex max-w-xl flex-col">
            <h1
              className="font-sans text-[clamp(2.75rem,10vw,4.5rem)] font-black uppercase leading-[0.92] tracking-[-0.04em] lg:text-[72px]"
            >
              Ideas Deserve
              <br />
              Great Names.
            </h1>

            <Link
              href="/brief"
              className="mt-10 inline-flex items-center gap-3 self-start rounded-full bg-landing-cta-bg px-8 py-4 font-mono text-xs font-medium uppercase tracking-[0.15em] text-landing-cta-fg transition-opacity hover:opacity-90 sm:text-sm"
            >
              Start your brief
              <ArrowRight className="size-4" strokeWidth={2} />
            </Link>

            <Link
              href="/recent-searches"
              className="mt-6 self-start font-mono text-[10px] uppercase tracking-[0.12em] text-landing-muted underline-offset-4 transition-colors hover:text-landing-fg hover:underline sm:text-xs"
            >
              Recent searches
            </Link>
          </div>

          <div className="w-full min-w-0 lg:max-w-[520px] lg:flex-1">
            <LandingDomainShowcase variant="focus" />
          </div>
        </div>
      </main>

      <footer className="flex items-end justify-between gap-6 px-6 pb-8 sm:px-8 sm:pb-10">
        <div className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.15em] text-landing-muted sm:text-xs">
          <p>Domain checked · AI assisted</p>
          <p className="mt-1">Globally relevant</p>
        </div>

        <div className="text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.15em] text-landing-muted sm:text-xs">
          <p>Simple</p>
          <p className="mt-1">Memorable</p>
          <p className="mt-1">Meaningful</p>
        </div>
      </footer>
    </div>
  )
}
