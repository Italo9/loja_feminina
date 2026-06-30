import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  buildHref: (page: number) => string
}

export function Pagination({ currentPage, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: (number | "dots")[] = []
  const maxVisible = 5

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push("dots")
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (currentPage < totalPages - 2) pages.push("dots")
    pages.push(totalPages)
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-10">
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="w-9 h-9 rounded-full flex items-center justify-center border border-cream-200 text-espresso-500 hover:border-rose-300 hover:text-rose-500 transition-colors"
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <span className="w-9 h-9 rounded-full flex items-center justify-center border border-cream-100 text-cream-300">
          <ChevronLeft className="w-4 h-4" />
        </span>
      )}

      {pages.map((p, i) => {
        if (p === "dots") {
          return (
            <span
              key={`dots-${i}`}
              className="w-9 h-9 flex items-center justify-center text-espresso-300"
            >
              ...
            </span>
          )
        }
        return (
          <Link
            key={p}
            href={buildHref(p)}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              p === currentPage
                ? "bg-rose-500 text-white"
                : "border border-cream-200 text-espresso-500 hover:border-rose-300 hover:text-rose-500"
            }`}
          >
            {p}
          </Link>
        )
      })}

      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="w-9 h-9 rounded-full flex items-center justify-center border border-cream-200 text-espresso-500 hover:border-rose-300 hover:text-rose-500 transition-colors"
          aria-label="Próxima página"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="w-9 h-9 rounded-full flex items-center justify-center border border-cream-100 text-cream-300">
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  )
}
