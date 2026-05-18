import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  href?: string
  alt?: string
  imageClassName?: string
  className?: string
  labelClassName?: string
  accentClassName?: string
  subtitle?: string
  subtitleClassName?: string
  showLabel?: boolean
  showSubtitle?: boolean
  title?: string
  accentText?: string
}

export default function Logo({
  href = '/',
  alt = 'HGU Oftalmologia',
  imageClassName = 'h-9 w-auto',
  className = 'flex items-center gap-2.5',
  labelClassName = 'text-lg font-bold tracking-tight text-text-primary',
  accentClassName = 'text-primary',
  subtitle = 'Oftalmologia',
  subtitleClassName = 'text-[10px] text-white/30',
  showLabel = true,
  showSubtitle = false,
  title = 'HGU',
  accentText = 'Oftalmo',
}: LogoProps) {
  return (
    <Link href={href} className={className}>
      <Image
        src="/logo.png"
        alt={alt}
        width={40}
        height={40}
        className={imageClassName}
        priority
      />
      {showLabel && (
        <div>
          <span className={labelClassName}>
            {title}
            {accentText ? <span className={accentClassName}>{accentText}</span> : null}
          </span>
          {showSubtitle && <p className={subtitleClassName}>{subtitle}</p>}
        </div>
      )}
    </Link>
  )
}
