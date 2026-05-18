import Link from 'next/link'
import type { HTMLAttributes, DetailedHTMLProps } from 'react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items, className = '', ...props }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className={`flex flex-wrap items-center gap-2 text-sm ${className}`} {...props}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
            {item.href && !isLast ? (
              <Link href={item.href} className="text-primary hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'font-semibold text-on-surface' : 'text-on-surface-variant'}>{item.label}</span>
            )}
            {!isLast && <span className="text-on-surface-variant">/</span>}
          </span>
        )
      })}
    </nav>
  )
}
