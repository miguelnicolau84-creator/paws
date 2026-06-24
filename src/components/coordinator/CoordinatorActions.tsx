import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppStore } from '@/stores/appStore'
import { Plus, Pill } from 'lucide-react'
import type { Animal, Species, AdoptionStatus } from '@/types'

export function CoordinatorActions() {
  const { isCoordinator, createAnimal, createMedication, animals } = useAppStore()
  const [animalOpen, setAnimalOpen] = useState(false)
  const [medOpen, setMedOpen] = useState(false)

  const [name, setName] = useState('')
  const [species, setSpecies] = useState<Species>('dog')
  const [breed, setBreed] = useState('')
  const [age, setAge] = useState('')
  const [weight, setWeight] = useState('')

  const [medAnimalId, setMedAnimalId] = useState('')
  const [medName, setMedName] = useState('')
  const [medDosage, setMedDosage] = useState('')
  const [medSchedule, setMedSchedule] = useState('')

  if (!isCoordinator()) return null

  const handleAddAnimal = async () => {
    if (!name || !breed) return
    const animal: Animal = {
      id: `${species === 'dog' ? 'd' : 'c'}${Date.now()}`,
      name,
      species,
      breed,
      age: age || 'Unknown',
      weight: weight || 'Unknown',
      adoptionStatus: 'available' as AdoptionStatus,
      image: species === 'dog'
        ? 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop'
        : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=600&fit=crop',
      gallery: [],
      personalityTags: ['calm'],
      personalityDescription: 'New arrival — personality assessment in progress.',
      talkingPoints: ['Recently arrived — getting to know this sweet soul'],
      medical: { vaccinations: [], allergies: [], conditions: [], spayedNeutered: false },
      adoptionReadiness: { health: 70, behaviour: 60, training: 50, socialization: 55 },
      faqs: [],
      intakeDate: new Date().toISOString().split('T')[0],
    }
    await createAnimal(animal)
    setAnimalOpen(false)
    setName('')
    setBreed('')
    setAge('')
    setWeight('')
  }

  const handleAddMedication = async () => {
    if (!medAnimalId || !medName) return
    await createMedication({
      id: `m${Date.now()}`,
      animalId: medAnimalId,
      name: medName,
      dosage: medDosage || 'As directed',
      schedule: medSchedule || 'Once daily',
      nextDue: new Date(Date.now() + 8 * 3600000).toISOString(),
    })
    setMedOpen(false)
    setMedName('')
    setMedDosage('')
    setMedSchedule('')
  }

  const activeAnimals = animals.filter((a) => a.adoptionStatus !== 'adopted')

  return (
    <div className="flex flex-wrap gap-2">
      <Dialog open={animalOpen} onOpenChange={setAnimalOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Animal
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Animal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-sage-700 mb-1.5 block">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Animal name" />
            </div>
            <div>
              <label className="text-sm font-medium text-sage-700 mb-1.5 block">Species</label>
              <Select value={species} onValueChange={(v) => setSpecies(v as Species)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dog">Dog</SelectItem>
                  <SelectItem value="cat">Cat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-sage-700 mb-1.5 block">Breed</label>
                <Input value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Breed" />
              </div>
              <div>
                <label className="text-sm font-medium text-sage-700 mb-1.5 block">Age</label>
                <Input value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 2 years" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-sage-700 mb-1.5 block">Weight</label>
              <Input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 20 kg" />
            </div>
            <Button size="lg" className="w-full" onClick={handleAddAnimal}>Add Animal</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={medOpen} onOpenChange={setMedOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Pill className="w-4 h-4" />
            Add Medication
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Medication Schedule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-sage-700 mb-1.5 block">Animal</label>
              <Select value={medAnimalId} onValueChange={setMedAnimalId}>
                <SelectTrigger><SelectValue placeholder="Select animal" /></SelectTrigger>
                <SelectContent>
                  {activeAnimals.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.name} ({a.species})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-sage-700 mb-1.5 block">Medication</label>
              <Input value={medName} onChange={(e) => setMedName(e.target.value)} placeholder="Medication name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-sage-700 mb-1.5 block">Dosage</label>
                <Input value={medDosage} onChange={(e) => setMedDosage(e.target.value)} placeholder="e.g. 50mg" />
              </div>
              <div>
                <label className="text-sm font-medium text-sage-700 mb-1.5 block">Schedule</label>
                <Input value={medSchedule} onChange={(e) => setMedSchedule(e.target.value)} placeholder="Twice daily" />
              </div>
            </div>
            <Button size="lg" className="w-full" onClick={handleAddMedication}>Create Schedule</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
