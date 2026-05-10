import Link from 'next/link'

interface HeaderLinkProps {
  href: string
  label: string
}

export default function HeaderLink({ href, label }: HeaderLinkProps) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-on-surface-variant transition-colors duration-200 hover:text-primary"
    >
      {label}
    </Link>
  )
}