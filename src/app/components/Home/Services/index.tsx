'use client'

import { Eye, Stethoscope, ClipboardCheck, Microscope, Syringe, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

const SERVICOS = [
  {
    icon: Eye,
    title: 'Consulta de Rotina',
    description:
      'Exame oftalmológico completo para avaliar a saúde ocular e detectar problemas de visão.',
  },
  {
    icon: Microscope,
    title: 'Exames Especializados',
    description:
      'Tonometria, fundoscopia, campimetria e outros exames com equipamentos modernos.',
  },
  {
    icon: Stethoscope,
    title: 'Diagnóstico Avançado',
    description:
      'Diagnóstico preciso de glaucoma, catarata, retinopatia e outras patologias oculares.',
  },
  {
    icon: Syringe,
    title: 'Tratamentos Clínicos',
    description:
      'Administração de medicamentos, colírios e tratamentos para diversas condições.',
  },
  {
    icon: ClipboardCheck,
    title: 'Acompanhamento',
    description:
      'Seguimento personalizado para pacientes crónicos com consultas de retorno programadas.',
  },
  {
    icon: Heart,
    title: 'Atendimento Humanizado',
    description:
      'Equipa dedicada e empática, focada no bem-estar e conforto de cada paciente.',
  },
]

export default function Services() {
  return (
    <section id="servicos" className="bg-surface-container">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4">Os Nossos Serviços</h2>
          <p className="mx-auto max-w-2xl text-body-lg text-on-surface-variant">
            Oferecemos uma gama completa de cuidados oftalmológicos para a
            população do Uíge, com qualidade e dedicação.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICOS.map((servico, index) => (
            <motion.div
              key={servico.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group rounded-xl border border-outline-variant bg-white p-6 transition-all duration-300 hover:shadow-card-hover"
            >
              <div className="mb-4 inline-flex rounded-full bg-primary-fixed/30 p-3 text-primary-container">
                <servico.icon size={24} />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{servico.title}</h3>
              <p className="text-body-md text-on-surface-variant">
                {servico.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}