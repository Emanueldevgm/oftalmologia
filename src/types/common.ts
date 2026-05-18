// ============================================
// Tipos Utilitários Genéricos
// ============================================

/** Tipo para ID (UUID) */
export type UUID = string

/** Tipo para BI Angolano */
export type BI = string

/** Tipo para email */
export type Email = string

/** Tipo para telefone */
export type Phone = string

/** Tipo para data ISO 8601 */
export type ISODate = string

/** Tipo para timestamp */
export type Timestamp = string

/** Tipo para valores monetários (em kwanzas) */
export type Kwanza = number

/** Tipo para percentuais (0-100) */
export type Percentage = number

// ============================================
// Tipos Genéricos
// ============================================

/** Paginação */
export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

/** Ordenação */
export type SortOrder = 'asc' | 'desc'

export interface SortParams {
  field: string
  order: SortOrder
}

/** Filtros */
export interface FilterParams {
  search?: string
  startDate?: ISODate
  endDate?: ISODate
  status?: string
}

/** Query params completas */
export interface QueryParams extends PaginationParams {
  sort?: SortParams
  filter?: FilterParams
}

// ============================================
// Tipos de Resposta de API
// ============================================

/** Resposta de sucesso genérica */
export interface ApiSuccessResponse<T = unknown> {
  success: true
  data: T
  message?: string
}

/** Resposta de erro */
export interface ApiErrorResponse {
  success: false
  error: string
  code?: string
  details?: Record<string, string[]>
}

/** Resposta combinada */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse

// ============================================
// Tipos de Estado
// ============================================

/** Estado de carregamento */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

/** Estado assíncrono com dados */
export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
  state: LoadingState
}

// ============================================
// Tipos de Endereço
// ============================================

export interface Address {
  rua?: string
  bairro?: string
  municipio?: string
  provincia?: string
  pais: string
}

// ============================================
// Tipos de Pessoa
// ============================================

export interface PersonBase {
  nome: string
  email: Email
  telefone?: Phone
}

export interface IdentifiableEntity {
  id: UUID
  criadoEm: Timestamp
  atualizadoEm: Timestamp
}