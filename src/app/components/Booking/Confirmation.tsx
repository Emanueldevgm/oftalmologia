/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { Calendar, Clock, User, ArrowLeft, CheckCircle } from 'lucide-react'

interface SlotSelecionado {
  medicoId: string
  medicoNome: string
  data: string
  horaInicio: string
  horaFim: string
}

interface DadosConsulta {
  nome: string
  bi: string
  dataNascimento: string
  email: string
  telefone: string
  motivo: string
}

interface ConfirmationProps {
  slot: SlotSelecionado
  date: string
  onConfirm: (data: DadosConsulta) => void
  onBack: () => void
  isLoading: boolean
}

export default function Confirmation() {
  // Componente simplificado - a lógica real está na página
  return null
}