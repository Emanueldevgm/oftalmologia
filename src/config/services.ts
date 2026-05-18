import {
  Eye,
  Stethoscope,
  ClipboardCheck,
  Microscope,
  Syringe,
  Heart,
  type LucideIcon,
} from 'lucide-react'

interface Service {
  icon: LucideIcon
  title: string
  description: string
}

export const servicos: Service[] = [
  {
    icon: Eye,
    title: 'Consulta de Rotina',
    description:
      'Avaliação clínica geral para identificar necessidades de saúde e oferecer orientações.',
  },
  {
    icon: Microscope,
    title: 'Exames Diagnósticos',
    description:
      'Exames laboratoriais e de imagem com equipamentos modernos para apoio diagnóstico.',
  },
  {
    icon: Stethoscope,
    title: 'Diagnóstico Especializado',
    description:
      'Avaliação especializada e encaminhamento para tratamentos quando necessário.',
  },
  {
    icon: Syringe,
    title: 'Tratamentos Clínicos',
    description:
      'Administração de terapias e acompanhamento farmacológico conforme indicação.',
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