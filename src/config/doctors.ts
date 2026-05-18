export interface MedicoCard {
  nome: string
  crm: string
  especialidade: string
  turnos: string
}

export const medicosDestaque: MedicoCard[] = [
  {
    nome: 'Dr. João Silva',
    crm: 'CRM-12345',
    especialidade: 'Clínica Médica',
    turnos: 'Manhã e Tarde',
  },
  {
    nome: 'Dra. Maria Santos',
    crm: 'CRM-67890',
    especialidade: 'Clínica Médica',
    turnos: 'Manhã',
  },
  {
    nome: 'Dr. António Francisco',
    crm: 'CRM-ANG-001',
    especialidade: 'Clínica Médica',
    turnos: 'Manhã',
  },
  {
    nome: 'Dra. Ana Rita',
    crm: 'CRM-004',
    especialidade: 'Pediatria',
    turnos: 'Manhã',
  },
  {
    nome: 'Dr. Carlos Mendes',
    crm: 'CRM-005',
    especialidade: 'Clínica Médica',
    turnos: 'Tarde',
  },
]