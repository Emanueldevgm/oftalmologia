# HGU Oftalmologia

Sistema de agendamento de consultas oftalmológicas para o Hospital Geral Universitário.

## Funcionalidades

- Agendamento público de consultas
- Portal do paciente
- Painel administrativo completo
- Gestão de médicos e pacientes
- Relatórios e métricas
- Sistema de notificações por email

## Tecnologias

- Next.js 15
- TypeScript
- Supabase (banco de dados)
- Tailwind CSS
- Redis (cache e locks)
- Nodemailer (emails)

## Instalação

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente em `.env.local`
4. Execute as migrações do Supabase
5. Inicie o servidor: `npm run dev`

## Estrutura do Projeto

- `src/app/` - Páginas e rotas Next.js
- `src/components/` - Componentes React
- `src/lib/` - Utilitários e configurações
- `src/types/` - Definições TypeScript
- `public/images/` - Imagens estáticas

## Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença

Este projeto é propriedade do Hospital Geral Universitário.
