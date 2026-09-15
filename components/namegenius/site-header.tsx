import Link from "next/link"



import { Badge } from "@/components/ui/badge"

import { buttonVariants } from "@/components/ui/button"

import { cn } from "@/lib/utils"



export function SiteHeader({
  shortlistCount = 0,
  className,
}: {
  shortlistCount?: number
  className?: string
}) {
  return (
    <header
      className={cn(
        "mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >

      <div className="flex items-start gap-4">

        <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-xl font-bold text-white shadow-sm">

          N

        </div>

        <div>

          <h1 className="text-2xl font-semibold tracking-tight">NameGenius</h1>

          <p className="mt-1 text-muted-foreground">Find a name you can own</p>

        </div>

      </div>



      <div className="flex flex-wrap items-center gap-3 self-start">

        <Link

          href="/shortlist"

          className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}

        >

          Shortlist

          {shortlistCount > 0 ? (

            <Badge className="bg-orange-500 text-white hover:bg-orange-500">

              {shortlistCount}

            </Badge>

          ) : null}

        </Link>



        <Badge

          variant="outline"

          className="rounded-full px-3 py-1.5 text-xs font-normal text-muted-foreground"

        >

          Prototype · mock data

        </Badge>

      </div>

    </header>

  )

}


