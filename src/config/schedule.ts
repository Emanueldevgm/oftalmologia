export interface Turno {
  nome: string
  inicio: string
  fim: string
  minutosTotal: number
  slots: number
}

export const TURNOS: Record<'manha' | 'tarde', Turno> = {
  manha: {
    nome: 'Manhã',
    inicio: '08:00',
    fim: '12:00',
    minutosTotal: 240,
    slots: 9,
  },
  tarde: {
    nome: 'Tarde',
    inicio: '13:30',
    fim: '16:00',
    minutosTotal: 150,
    slots: 6,
  },
}

export const SLOT_DURATION = 25 // 20 min consulta + 5 min buffer

export interface HorarioFuncionamento {
  dias: string
  horas: string
}

export const horariosFuncionamento: HorarioFuncionamento[] = [
  { dias: 'Segunda - Sexta', horas: '08h00 - 16h00' },
  { dias: 'Turno Manhã', horas: '08h00 - 12h00' },
  { dias: 'Turno Tarde', horas: '13h30 - 16h00' },
  { dias: 'Sábado', horas: 'Fechado' },
  { dias: 'Domingo', horas: 'Fechado' },
  { dias: 'Feriados', horas: 'Fechado' },
]

export const DIAS_SEMANA: string[] = [
  'Dom',
  'Seg',
  'Ter',
  'Qua',
  'Qui',
  'Sex',
  'Sáb',
]

export const DIAS_UTEIS = [1, 2, 3, 4, 5] // Seg-Sex