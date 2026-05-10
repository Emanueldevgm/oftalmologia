'use client'

import { Stethoscope, GraduationCap } from 'lucide-react'
import { motion } from 'framer-motion'

const MEDICOS = [
  {
    nome: 'Dr. João Silva',
    crm: 'CRM-12345',
    especialidade: 'Oftalmologia Geral',
    turnos: 'Manhã e Tarde',
  },
  {
    nome: 'Dra. Maria Santos',
    crm: 'CRM-67890',
    especialidade: 'Retina e Vítreo',
    turnos: 'Manhã',
  },
  {
    nome: 'Dr. António Francisco',
    crm: 'CRM-ANG-001',
    especialidade: 'Catarata e Glaucoma',
    turnos: 'Manhã',
  },
  {
    nome: 'Dra. Ana Rita',
    crm: 'CRM-004',
    especialidade: 'Oftalmologia Pediátrica',
    turnos: 'Manhã',
  },
  {
    nome: 'Dr. Carlos Mendes',
    crm: 'CRM-005',
    especialidade: 'Córnea e Superfície Ocular',
    turnos: 'Tarde',
  },
]

export default function Doctors() {
  return (
    <section className="bg-surface-container">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4">Equipa Médica</h2>
          <p className="mx-auto max-w-2xl text-body-lg text-on-surface-variant">
            Conheça os especialistas dedicados à sua saúde ocular no Hospital
            Geral do Uíge.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {MEDICOS.map((medico, index) => (
            <motion.div
              key={medico.crm}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group rounded-xl border border-outline-variant bg-white p-6 text-center transition-all duration-300 hover:shadow-card-hover"
            >
              {/* Avatar */}
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary-container/10">
                <Stethoscope size={40} className="text-primary-container" />
              </div>

              <h3 className="mb-1 text-lg font-semibold">{medico.nome}</h3>
              <p className="mb-3 text-sm text-on-surface-variant">
                {medico.especialidade}
              </p>

              <div className="space-y-2 border-t border-outline-variant pt-3">
                <div className="flex items-center justify-center gap-2 text-xs text-on-surface-variant">
                  <GraduationCap size={14} />
                  <span>{medico.crm}</span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Turno: {medico.turnos}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}