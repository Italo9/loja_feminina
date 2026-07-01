import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { BreadcrumbListJsonLd } from "./JsonLd"

export interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const allItems = [{ label: "Início", href: "/" }, ...items]

  return (
    <>
      <BreadcrumbListJsonLd items={allItems} />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm">
          <BreadcrumbLink item={allItems[0]} isHome />
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-espresso-300 flex-shrink-0" />
              {item.href ? (
                <BreadcrumbLink item={item} />
              ) : (
                <span className="text-espresso-700 font-medium truncate max-w-[200px]">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}

function BreadcrumbLink({ item, isHome }: { item: BreadcrumbItem; isHome?: boolean }) {
  if (!item.href) {
    return (
      <span className="text-espresso-700 font-medium truncate max-w-[200px]">
        {item.label}
      </span>
    )
  }

  return (
    <Link
      href={item.href}
      className={`inline-flex items-center gap-1 text-espresso-400 hover:text-rose-500 transition-colors ${
        isHome ? "" : "max-w-[200px] truncate"
      }`}
    >
      {isHome && <Home className="w-3.5 h-3.5" />}
      {!isHome && <span>{item.label}</span>}
    </Link>
  )
}
