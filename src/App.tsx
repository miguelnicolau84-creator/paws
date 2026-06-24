import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { DashboardPage } from '@/pages/DashboardPage'
import { AnimalsPage } from '@/pages/AnimalsPage'
import { AnimalProfilePage } from '@/pages/AnimalProfilePage'
import { FacilitiesPage } from '@/pages/FacilitiesPage'
import { AdoptionPage } from '@/pages/AdoptionPage'
import { VolunteersPage } from '@/pages/VolunteersPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { useAppStore } from '@/stores/appStore'
import { PawPrint } from 'lucide-react'

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-warm-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <PawPrint className="w-8 h-8 text-white" />
        </div>
        <p className="text-sage-600 font-medium">Loading Paws...</p>
      </div>
    </div>
  )
}

export default function App() {
  const { initialize, isLoading } = useAppStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  if (isLoading) return <LoadingScreen />

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/animals" element={<AnimalsPage />} />
          <Route path="/animals/:id" element={<AnimalProfilePage />} />
          <Route path="/facilities" element={<FacilitiesPage />} />
          <Route path="/adoption" element={<AdoptionPage />} />
          <Route path="/volunteers" element={<VolunteersPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
