'use client'

import { useState } from 'react'
import BookingStepper from '@/app/components/Booking/BookingStepper'
import Calendar from '@/app/components/Booking/Calendar'
import SlotSelector from '@/app/components/Booking/SlotSelector'
import PatientForm from '@/app/components/Booking/PatientForm'
import { Calendar as CalendarIcon, Clock, User, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface SlotSelecionado {
  medicoId: string
  medicoNome: string
  data: string
  horaInicio: string
  horaFim: string
}

interface DadosPaciente {
  nome: string
  bi: string
  dataNascimento: string
  email: string
  telefone: string
  motivo: string
}

export default function AgendarPage() {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedSlot, setSelectedSlot] = useState<SlotSelecionado | null>(null)
  const [patientData, setPatientData] = useState<DadosPaciente | null>(null)
  const [confirmedConsult, setConfirmedConsult] = useState<{
    id: string
    data: string
    hora: string
    status: string
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const formatDisplayDate = (dateStr: string): string => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('pt', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleSlotSelect = (slot: SlotSelecionado) => {
    setSelectedSlot(slot)
    setStep(2)
  }

  const handlePatientSubmit = (data: DadosPaciente) => {
    setPatientData(data)
    setStep(3)
  }

  const handleConfirm = async () => {
    if (!selectedSlot || !patientData) return

    setLoading(true)

    try {
      const dataHora = `${selectedDate}T${selectedSlot.horaInicio}:00.000Z`

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: patientData.nome,
          bi: patientData.bi,
          data_nascimento: patientData.dataNascimento,
          email: patientData.email,
          telefone: patientData.telefone || '',
          motivo: patientData.motivo || '',
          medico_id: selectedSlot.medicoId,
          data_hora: dataHora,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setConfirmedConsult(result.consulta)
        setStep(4)
      } else {
        alert(result.error || 'Erro ao marcar consulta. Tente novamente.')
        setStep(2)
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro de conexão. Verifique sua internet e tente novamente.')
      setStep(2)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStep(1)
    setSelectedDate('')
    setSelectedSlot(null)
    setPatientData(null)
    setConfirmedConsult(null)
  }

  return (
    <div className="min-h-screen bg-surface py-8 md:py-12">
      <div className="container">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/" className="text-sm text-primary hover:underline">
            Início
          </Link>
          <span className="mx-2 text-outline">/</span>
          <span className="text-sm text-on-surface-variant">Agendar Consulta</span>
        </div>

        {/* Stepper */}
        <BookingStepper currentStep={step} />

        <div className="mt-8">
          {/* STEP 1: Escolher Data e Hora */}
          {step === 1 && (
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
                  <CalendarIcon size={24} className="text-primary" />
                  Escolha a data
                </h2>
                <Calendar
                  onDateSelect={setSelectedDate}
                  selectedDate={selectedDate}
                />
              </div>
              <div>
                {selectedDate && (
                  <>
                    <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
                      <Clock size={24} className="text-primary" />
                      Escolha o horário
                    </h2>
                    <SlotSelector
                      date={selectedDate}
                      turno="manha"
                      onSlotSelect={handleSlotSelect}
                    />
                  </>
                )}
                {!selectedDate && (
                  <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-outline-variant bg-white p-12">
                    <p className="text-center text-on-surface-variant">
                      Selecione uma data no calendário para ver os horários disponíveis.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Dados Pessoais */}
          {step === 2 && selectedSlot && (
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
                <User size={24} className="text-primary" />
                Seus dados
              </h2>
              <PatientForm
                slot={selectedSlot}
                date={selectedDate}
                onSubmit={handlePatientSubmit}
                onBack={() => setStep(1)}
              />
            </div>
          )}

          {/* STEP 3: Confirmar */}
          {step === 3 && selectedSlot && patientData && (
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
                <CheckCircle size={24} className="text-primary" />
                Confirmar consulta
              </h2>

              <div className="rounded-xl border border-outline-variant bg-white p-6">
                {/* Resumo */}
                <div className="mb-6 space-y-3 rounded-xl bg-surface-container p-4">
                  <h3 className="text-sm font-semibold text-on-surface">
                    Resumo da Consulta
                  </h3>
                  <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <span className="text-on-surface-variant">Data:</span>
                      <p className="font-medium text-on-surface">
                        {formatDisplayDate(selectedDate)}
                      </p>
                    </div>
                    <div>
                      <span className="text-on-surface-variant">Horário:</span>
                      <p className="font-medium text-on-surface">
                        {selectedSlot.horaInicio} - {selectedSlot.horaFim}
                      </p>
                    </div>
                    <div>
                      <span className="text-on-surface-variant">Médico:</span>
                      <p className="font-medium text-on-surface">
                        {selectedSlot.medicoNome}
                      </p>
                    </div>
                    <div>
                      <span className="text-on-surface-variant">Paciente:</span>
                      <p className="font-medium text-on-surface">
                        {patientData.nome}
                      </p>
                    </div>
                    <div>
                      <span className="text-on-surface-variant">BI:</span>
                      <p className="font-medium text-on-surface">
                        {patientData.bi}
                      </p>
                    </div>
                    <div>
                      <span className="text-on-surface-variant">Email:</span>
                      <p className="font-medium text-on-surface">
                        {patientData.email}
                      </p>
                    </div>
                  </div>
                  {patientData.motivo && (
                    <div>
                      <span className="text-sm text-on-surface-variant">
                        Motivo:
                      </span>
                      <p className="text-sm text-on-surface">
                        {patientData.motivo}
                      </p>
                    </div>
                  )}
                </div>

                {/* Aviso */}
                <div className="mb-6 rounded-xl bg-warning/10 border border-warning/30 p-4">
                  <p className="text-sm font-medium text-warning">
                    ⚠️ Chegue com 15 minutos de antecedência. Atraso superior a 10 minutos pode resultar na perda da vaga.
                  </p>
                </div>

                {/* Botões */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 rounded-full border-2 border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                  >
                    <ArrowLeft size={18} />
                    Voltar
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-container disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Marcando...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        Confirmar Marcação
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Sucesso */}
          {step === 4 && confirmedConsult && (
            <div className="mx-auto max-w-lg text-center">
              <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h2 className="mb-2 text-2xl font-semibold text-on-surface">
                Consulta Marcada!
              </h2>
              <p className="mb-6 text-on-surface-variant">
                Sua consulta foi agendada com sucesso.
              </p>

              <div className="mb-6 rounded-xl bg-surface-container p-4 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Data:</span>
                    <span className="font-medium text-on-surface">
                      {confirmedConsult.data}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Hora:</span>
                    <span className="font-medium text-on-surface">
                      {confirmedConsult.hora}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Médico:</span>
                    <span className="font-medium text-on-surface">
                      {selectedSlot?.medicoNome}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6 rounded-xl bg-primary-fixed/20 p-4 text-left">
                <p className="text-sm font-medium text-primary">
                  📧 Verifique seu email!
                </p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Enviamos para <strong>{patientData?.email}</strong> a sua senha de acesso e o link para cancelamento.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleReset}
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-container"
                >
                  Marcar Nova Consulta
                </button>
                <Link
                  href="/"
                  className="rounded-full border-2 border-primary px-6 py-3 text-center text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                  Voltar ao Início
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}