'use client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Building2, MapPin, Phone, Mail, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

const INFO = [
  {
    icon: Building2,
    title: 'Hospital Geral do Uíge',
    description:
      'Unidade de referência em saúde no norte de Angola, servindo a população com dedicação há mais de três décadas.',
  },
  {
    icon: MapPin,
    title: 'Localização Central',
    description:
      'Situado no Bairro Popular, com fácil acesso para todos os munícipes do Uíge e arredores.',
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
    description:
      'Disponível através do telefone +244 934 567 890 e email oftalmologia@hgu.gov.ao.',
  },
]

export default function About() {
  return (
    <section id="sobre" className="bg-white">
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
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
                  <p className="text-sm text-white/70">Desde 1990</p>
                  <p className="text-xl font-semibold">Hospital Geral do Uíge</p>
                </div>
              </div>
              <p className="text-body-md text-white/80">
                Comprometidos com a excelência no atendimento oftalmológico,
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
            <h2 className="mb-4">Sobre o Serviço</h2>
            <p className="mb-8 text-body-lg text-on-surface-variant">
              O Serviço de Oftalmologia do HGU nasceu da necessidade de oferecer
              cuidados especializados em saúde ocular à população do Uíge. Com
              uma equipa dedicada e equipamentos modernos, realizamos consultas
              gratuitas para todos.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {INFO.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-outline-variant p-4"
                >
                  <div className="mb-2 inline-flex rounded-full bg-primary-fixed/30 p-2 text-primary-container">
                    <item.icon size={18} />
                  </div>
                  <h3 className="mb-1 text-sm font-semibold">{item.title}</h3>
                  <p className="text-xs text-on-surface-variant">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}