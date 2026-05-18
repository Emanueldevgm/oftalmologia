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
    <div className="min-h-screen bg-surface-secondary pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/" className="text-sm text-primary hover:underline">
            Início
          </Link>
          <span className="mx-2 text-text-tertiary">/</span>
          <span className="text-sm text-text-secondary">Agendar Consulta</span>
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            Agendar Consulta
          </h1>
          <p className="mx-auto max-w-lg text-text-secondary">
            Escolha a data, horário e preencha seus dados para marcar sua consulta oftalmológica gratuita.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-12">
          <BookingStepper currentStep={step} />
        </div>

        <div className="mx-auto max-w-4xl">
          {/* STEP 1: Escolher Data e Hora */}
          {step === 1 && (
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-text-primary">
                  <CalendarIcon size={22} className="text-primary" />
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
                    <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-text-primary">
                      <Clock size={22} className="text-primary" />
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
                  <div className="flex h-full min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-border bg-white p-8">
                    <p className="text-center text-sm text-text-tertiary">
                      Selecione uma data no calendário para ver os horários disponíveis.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Dados Pessoais */}
          {step === 2 && selectedSlot && (
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-text-primary">
                <User size={22} className="text-primary" />
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
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-text-primary">
                <CheckCircle size={22} className="text-primary" />
                Confirmar consulta
              </h2>

              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8">
                {/* Resumo */}
                <div className="mb-6 rounded-xl bg-surface-secondary p-5">
                  <h3 className="mb-4 text-sm font-semibold text-text-primary">
                    Resumo da Consulta
                  </h3>
                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <span className="text-text-tertiary">Data:</span>
                      <p className="font-medium text-text-primary">
                        {formatDisplayDate(selectedDate)}
                      </p>
                    </div>
                    <div>
                      <span className="text-text-tertiary">Horário:</span>
                      <p className="font-medium text-text-primary">
                        {selectedSlot.horaInicio} - {selectedSlot.horaFim}
                      </p>
                    </div>
                    <div>
                      <span className="text-text-tertiary">Médico:</span>
                      <p className="font-medium text-text-primary">
                        {selectedSlot.medicoNome}
                      </p>
                    </div>
                    <div>
                      <span className="text-text-tertiary">Paciente:</span>
                      <p className="font-medium text-text-primary">
                        {patientData.nome}
                      </p>
                    </div>
                    <div>
                      <span className="text-text-tertiary">BI:</span>
                      <p className="font-medium text-text-primary">
                        {patientData.bi}
                      </p>
                    </div>
                    <div>
                      <span className="text-text-tertiary">Email:</span>
                      <p className="font-medium text-text-primary">
                        {patientData.email}
                      </p>
                    </div>
                  </div>
                  {patientData.motivo && (
                    <div className="mt-3 border-t border-border pt-3">
                      <span className="text-sm text-text-tertiary">
                        Motivo:
                      </span>
                      <p className="text-sm text-text-primary">
                        {patientData.motivo}
                      </p>
                    </div>
                  )}
                </div>

                {/* Aviso */}
                <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-4">
                  <p className="text-sm font-medium text-amber-700">
                    ⚠️ Chegue com 15 minutos de antecedência. Atraso superior a 10 minutos pode resultar na perda da vaga.
                  </p>
                </div>

                {/* Botões */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 rounded-xl border-2 border-border px-6 py-3 text-sm font-semibold text-text-secondary transition hover:border-primary hover:text-primary"
                  >
                    <ArrowLeft size={18} />
                    Voltar
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.01] disabled:opacity-50"
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
            <div className="text-center">
              <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 shadow-sm">
                <CheckCircle size={40} className="text-emerald-600" />
              </div>
              <h2 className="mb-2 text-3xl font-bold text-text-primary">
                Consulta Marcada!
              </h2>
              <p className="mb-8 text-text-secondary">
                Sua consulta foi agendada com sucesso.
              </p>

              <div className="mb-6 rounded-2xl border border-border bg-white p-6 text-left shadow-sm">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Data:</span>
                    <span className="font-medium text-text-primary">
                      {confirmedConsult.data}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Hora:</span>
                    <span className="font-medium text-text-primary">
                      {confirmedConsult.hora}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Médico:</span>
                    <span className="font-medium text-text-primary">
                      {selectedSlot?.medicoNome}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-8 rounded-2xl bg-blue-50 border border-blue-200 p-5 text-left">
                <p className="text-sm font-medium text-primary">
                  📧 Verifique seu email!
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  Enviamos para <strong>{patientData?.email}</strong> a sua senha de acesso e o link para cancelamento.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={handleReset}
                  className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.01]"
                >
                  Marcar Nova Consulta
                </button>
                <Link
                  href="/"
                  className="rounded-xl border-2 border-border px-6 py-3 text-center text-sm font-semibold text-text-secondary transition hover:border-primary hover:text-primary"
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