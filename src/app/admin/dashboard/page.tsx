'use client'

import AdminLayout from '@/app/components/Admin/AdminLayout'
import ProtectedRoute from '@/app/components/Shared/ProtectedRoute'
import StatsCards from '@/app/components/Admin/Dashboard/StatsCards'
import Charts from '@/app/components/Admin/Dashboard/Charts'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-text-primary">Dashboard</h2>
            <p className="text-text-secondary">
              Bem-vindo ao painel de gestão do HGU Oftalmologia
            </p>
          </motion.div>

          {/* Stats Cards */}
          <StatsCards />

          {/* Charts */}
          <Charts />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}