import Image from 'next/image'
import Link from 'next/link'

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        src="/images/logo/logo.svg"
        alt="Hospital Geral do Uíge"
        width={48}
        height={48}
        className="h-12 w-auto"
        priority
      />
      <div className="hidden sm:block">
        <p className="text-sm font-semibold leading-tight text-primary">
          Hospital Geral do Uíge
        </p>
        <p className="text-xs text-on-surface-variant">
          Serviço de Oftalmologia
        </p>
      </div>
    </Link>
  )
}