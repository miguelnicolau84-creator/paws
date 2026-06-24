import { useState } from 'react'
import { AnimalCard } from '@/components/animals/AnimalCard'
import { QuickLogDialog } from '@/components/activities/QuickLogDialog'
import { CoordinatorActions } from '@/components/coordinator/CoordinatorActions'
import { useAppStore } from '@/stores/appStore'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import type { Species, AdoptionStatus } from '@/types'

export function AnimalsPage() {
  const { animals } = useAppStore()
  const [search, setSearch] = useState('')
  const [species, setSpecies] = useState<Species | 'all'>('all')
  const [status, setStatus] = useState<AdoptionStatus | 'all'>('all')

  const filtered = animals.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.breed.toLowerCase().includes(search.toLowerCase())
    const matchesSpecies = species === 'all' || a.species === species
    const matchesStatus = status === 'all' || a.adoptionStatus === status
    return matchesSearch && matchesSpecies && matchesStatus
  })

  const dogs = filtered.filter((a) => a.species === 'dog')
  const cats = filtered.filter((a) => a.species === 'cat')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-sage-900">Our Animals</h1>
          <p className="text-sage-600 mt-1">{animals.length} animals in our care</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CoordinatorActions />
          <QuickLogDialog />
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
        <Input
          className="pl-12 h-12 text-base"
          placeholder="Search by name or breed..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setSpecies('all')}>All ({filtered.length})</TabsTrigger>
          <TabsTrigger value="dogs" onClick={() => setSpecies('dog')}>Dogs ({dogs.length})</TabsTrigger>
          <TabsTrigger value="cats" onClick={() => setSpecies('cat')}>Cats ({cats.length})</TabsTrigger>
        </TabsList>

        <div className="flex flex-wrap gap-2 mt-4">
          {(['all', 'available', 'reserved', 'foster', 'medical_hold', 'adopted'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all min-h-[40px] ${
                status === s
                  ? 'bg-warm-500 text-white'
                  : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
              }`}
            >
              {s === 'all' ? 'All Status' : s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="dogs" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dogs.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="cats" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cats.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
