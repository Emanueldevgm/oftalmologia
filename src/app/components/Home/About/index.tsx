/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Building2, MapPin, Phone, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { SITE_CONFIG } from '@/config/site'
import { contactList } from '@/config/contact'

const address = contactList.find((item) => item.label === 'Endereço')?.value ?? ''
const phone = contactList.find((item) => item.label === 'Telefone')?.value ?? ''
const email = contactList.find((item) => item.label === 'Email')?.value ?? ''

const INFO = [
  {
    icon: Building2,
    title: SITE_CONFIG.fullName,
    description:
      'Unidade de referência em saúde no norte de Angola, servindo a população com dedicação há mais de três décadas.',
  },
  {
    icon: MapPin,
    title: 'Localização Central',
    description: `Situado no ${address}, com fácil acesso para todos os munícipes do Uíge e arredores.`,
  },
  {
    icon: Clock,
    title: 'Horário Alargado',
    description:
      'Funcionamento de Segunda a Sexta-feira, com dois turnos: manhã (08h-12h) e tarde (13h30-16h).',
  },
  {
    icon: Phone,
    title: 'Contacto Direto',
    description: `Disponível através do telefone ${phone} e email ${email}.`,
  },
]

export default function About() {
  return (
    <section id="sobre" className="bg-white py-20 sm:py-24">
      <div className="container max-w-6xl">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Image / Visual */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl bg-primary-container p-8 text-white">
              <div className="mb-6 flex items-center gap-3">
                <Building2 size={40} className="text-white/80" />
                <div>
                  <p className="text-sm text-white/70">Desde {SITE_CONFIG.founded}</p>
                  <p className="text-xl font-semibold">{SITE_CONFIG.fullName}</p>
                </div>
              </div>
              <p className="text-body-md text-white/80">
                Comprometidos com a excelência no atendimento de saúde,
                oferecendo cuidados de qualidade a todos os cidadãos.
              </p>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            
          </motion.div>
        </div>
      </div>
    </section>
  )
}