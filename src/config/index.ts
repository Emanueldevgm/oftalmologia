export {
  mainNavigation,
  footerLinks,
  adminNavigation,
  breadcrumbMap,
} from './navigation'

export {
  statusMap,
  statusList,
  getStatusConfig,
} from './status'
export type { ConsultaStatus } from './status'

export {
  TURNOS,
  SLOT_DURATION,
  horariosFuncionamento,
  DIAS_SEMANA,
  DIAS_UTEIS,
} from './schedule'
export type { Turno, HorarioFuncionamento } from './schedule'

export {
  contactList,
  PHONE_NUMBER,
  EMAIL_CONTACT,
  HOSPITAL_ADDRESS,
} from './contact'

export { medicosDestaque } from './doctors'
export type { MedicoCard } from './doctors'

export { servicos } from './services'

export {
  SITE_CONFIG,
  SEO_CONFIG,
  TRUST_INDICATORS,
  WARNINGS,
} from './site'