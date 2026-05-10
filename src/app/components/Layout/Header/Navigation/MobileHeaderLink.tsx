import Link from 'next/link'

interface MobileHeaderLinkProps {
  href: string
  label: string
  onClick?: () => void
}

export default function MobileHeaderLink({
  href,
  label,
  onClick,
}: MobileHeaderLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-lg px-4 py-3 text-base font-medium text-on-surface-variant transition-colors duration-200 hover:bg-surface-container hover:text-primary"
    >
      {label}
    </Link>
  )
}