export const SITE_CONFIG = {
  name: 'HGU',
  fullName: 'Hospital Geral do Uíge',
  description:
    'Portal de marcações e informações do Hospital Geral do Uíge.',
  url: 'https://hgu.gov.ao',
  locale: 'pt_AO',
  location: 'Uíge, Angola',
  founded: 1990,
}

export const SEO_CONFIG = {
  titleTemplate: '%s | HGU',
  defaultTitle: 'HGU | Hospital Geral do Uíge',
  description: SITE_CONFIG.description,
  keywords: [
    'consulta',
    'hospital',
    'Uíge',
    'Angola',
    'HGU',
  ],
  authors: [{ name: 'Hospital Geral do Uíge' }],
}

export const TRUST_INDICATORS = [
  { label: 'Consulta Gratuita', icon: 'Shield' },
  { label: 'Atendimento Rápido', icon: 'Clock' },
  { label: 'Especialistas', icon: 'Eye' },
]

export const WARNINGS = {
  pontualidade:
    'Chegue com 15 minutos de antecedência. Atraso superior a 10 minutos pode resultar na perda da vaga.',
  documento: 'Não se esqueça do seu Bilhete de Identidade (BI).',
  senha: 'Guarde a senha de 4 dígitos enviada por email para consultar ou cancelar suas marcações.',
}