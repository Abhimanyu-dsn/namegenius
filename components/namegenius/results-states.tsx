"use client"

const messageClass =
  "font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-landing-muted sm:text-xs"

const actionClass =
  "font-mono text-[10px] uppercase tracking-[0.12em] text-landing-fg underline-offset-4 transition-opacity hover:opacity-70 hover:underline sm:text-xs"

function StateFrame({
  title,
  children,
  role,
}: {
  title: string
  children: React.ReactNode
  role?: "status" | "alert"
}) {
  return (
    <div
      role={role}
      className="flex min-h-[280px] flex-col justify-center gap-4 rounded-xl border border-landing-fg/20 px-6 py-8 sm:min-h-[360px]"
    >
      <h2 className="font-sans text-xl font-black uppercase leading-tight tracking-tight sm:text-2xl">
        {title}
      </h2>
      {children}
    </div>
  )
}

export function ResultsLoading() {
  return (
    <div
      role="status"
      aria-label="Generating names"
      className="flex min-h-[280px] flex-col gap-3 px-1 py-6 sm:min-h-[360px]"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="grid animate-pulse grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border border-landing-fg/15 px-4 py-4 sm:px-5 sm:py-5"
        >
          <span className="font-mono text-xs text-landing-muted/60 sm:text-sm">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-5 w-2/3 rounded bg-landing-fg/15" />
          <span className="h-3 w-8 rounded bg-landing-fg/10" />
        </div>
      ))}
    </div>
  )
}

export function ResultsEmpty({
  onRetry,
  onEdit,
  canRetry,
}: {
  onRetry: () => void
  onEdit: () => void
  canRetry: boolean
}) {
  return (
    <StateFrame title="No names came back.">
      <p className={messageClass}>
        {canRetry
          ? "Try again, or adjust your brief."
          : "Add your idea to get started."}
      </p>
      <div className="flex items-center gap-6">
        {canRetry ? (
          <button type="button" onClick={onRetry} className={actionClass}>
            Try again
          </button>
        ) : null}
        <button type="button" onClick={onEdit} className={actionClass}>
          Edit search
        </button>
      </div>
    </StateFrame>
  )
}

export function ResultsError({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <StateFrame title="Something went wrong." role="alert">
      <p className={messageClass}>{message}</p>
      <div>
        <button type="button" onClick={onRetry} className={actionClass}>
          Try again
        </button>
      </div>
    </StateFrame>
  )
}

export function ResultsRateLimit() {
  return (
    <StateFrame title="Daily limit reached." role="alert">
      <p className={messageClass}>
        Today&apos;s free Gemini limit is used up.
        <br />
        Try again tomorrow.
      </p>
    </StateFrame>
  )
}
