// ============================================
// Tipos para Componentes UI
// ============================================

import type { LucideIcon } from 'lucide-react'

// ============================================
// Variantes
// ============================================

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'ghost'
  | 'outline'

export type ButtonSize = 'sm' | 'md' | 'lg'

export type BadgeVariant =
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'neutral'
  | 'primary'

export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'date'
  | 'search'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

export type SkeletonVariant = 'text' | 'circular' | 'rectangular'

// ============================================
// Opções
// ============================================

export interface SelectOption<T = string> {
  value: T
  label: string
  disabled?: boolean
}

export interface TabOption {
  id: string
  label: string
  icon?: LucideIcon
  count?: number
}

// ============================================
// Stepper
// ============================================

export interface StepConfig {
  number: number
  label: string
  icon: LucideIcon
  description?: string
}

// ============================================
// Tabela
// ============================================

export interface TableColumn<T = Record<string, unknown>> {
  key: string
  header: string
  width?: string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  render?: (item: T) => React.ReactNode
}

// ============================================
// Menu
// ============================================

export interface MenuItem {
  href: string
  label: string
  icon?: LucideIcon
  badge?: string
  disabled?: boolean
  children?: MenuItem[]
}

// ============================================
// Breadcrumb
// ============================================

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: LucideIcon
}

// ============================================
// Toast
// ============================================

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastConfig {
  type: ToastType
  title: string
  description?: string
  duration?: number
}

// ============================================
// Card
// ============================================

export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

// ============================================
// Modal
// ============================================

export interface ModalConfig {
  title?: string
  description?: string
  size?: ModalSize
  closeOnOverlay?: boolean
  showCloseButton?: boolean
}

// ============================================
// Estado de UI
// ============================================

export interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  toasts: ToastConfig[]
}