"use client"

import { cn } from "@/lib/utils"

import { MarketingHeader } from "./marketing-header"

export type BriefFooterContent = {
  left: string[]
  right: string[]
}

export function BriefProgress({ step, total = 4 }: { step: number; total?: number }) {
  const progress = (step / total) * 100

  return (
    <div className="mb-10 sm:mb-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-landing-fg">
        {String(step).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </p>
      <div className="mt-3 h-px w-full bg-landing-fg/20">
        <div
          className="h-px bg-landing-fg transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export function BriefFooter({ content }: { content: BriefFooterContent }) {
  return (
    <footer className="flex items-end justify-between gap-6 px-6 pb-8 sm:px-8 sm:pb-10">
      <div className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.15em] text-landing-muted sm:text-xs">
        {content.left.map((line, index) => (
          <p key={line} className={index > 0 ? "mt-1" : undefined}>
            {line}
          </p>
        ))}
      </div>

      <div className="text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.15em] text-landing-muted sm:text-xs">
        {content.right.map((line, index) => (
          <p key={line} className={index > 0 ? "mt-1" : undefined}>
            {line}
          </p>
        ))}
      </div>
    </footer>
  )
}

export function BriefShell({
  step,
  footer,
  children,
  className,
}: {
  step: number
  footer: BriefFooterContent
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex min-h-svh flex-col bg-landing-bg text-landing-fg", className)}>
      <MarketingHeader />

      <main className="flex flex-1 flex-col items-center justify-center px-6 sm:px-8">
        <div className="flex w-full max-w-3xl flex-1 flex-col items-center justify-center">
          <div className="w-full self-stretch">
            <BriefProgress step={step} />
            {children}
          </div>
        </div>
      </main>

      <BriefFooter content={footer} />
    </div>
  )
}
