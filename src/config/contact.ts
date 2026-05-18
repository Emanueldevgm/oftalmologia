import { Phone, Mail, MapPin, Globe, Clock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface ContactInfo {
  icon: LucideIcon
  label: string
  value: string
  href?: string
}

export const contactList: ContactInfo[] = [
  {
    icon: MapPin,
    label: 'Endereço',
    value: 'Bairro Popular, Uíge, Angola',
  },
  {
    icon: Phone,
    label: 'Telefone',
    value: '+244 934 567 890',
    href: 'tel:+244934567890',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'contato@hgu.gov.ao',
    href: 'mailto:contato@hgu.gov.ao',
  },
  {
    icon: Globe,
    label: 'Website',
    value: 'hgu.gov.ao',
    href: 'https://hgu.gov.ao',
  },
  {
    icon: Clock,
    label: 'Horário',
    value: 'Seg-Sex: 08h00 - 16h00',
  },
]

export const PHONE_NUMBER = '+244 934 567 890'
export const EMAIL_CONTACT = 'contato@hgu.gov.ao'
export const HOSPITAL_ADDRESS = 'Bairro Popular, Uíge, Angola'