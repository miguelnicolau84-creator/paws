import { create } from 'zustand'
import { api } from '@/api/client'
import type {
  Activity,
  Animal,
  Badge,
  Database,
  Facility,
  Medication,
  UserRole,
  Volunteer,
  AdoptionInquiry,
} from '@/types'

interface AppState {
  isLoading: boolean
  currentUserId: string
  currentRole: UserRole
  animals: Animal[]
  volunteers: Volunteer[]
  medications: Medication[]
  activities: Activity[]
  facilities: Facility[]
  adoptionInquiries: AdoptionInquiry[]
  badges: Badge[]

  initialize: () => Promise<void>
  setRole: (role: UserRole) => void
  setCurrentUser: (userId: string) => void
  refresh: () => Promise<void>

  getCurrentUser: () => Volunteer | undefined
  isCoordinator: () => boolean

  logActivity: (activity: Omit<Activity, 'id'>) => Promise<void>
  administerMedication: (medId: string) => Promise<void>
  updateFacility: (id: string, updates: Partial<Facility>) => Promise<void>
  updateAnimal: (id: string, updates: Partial<Animal>) => Promise<void>
  createAnimal: (animal: Animal) => Promise<void>
  createMedication: (med: Medication) => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  isLoading: true,
  currentUserId: 'v2',
  currentRole: 'volunteer',
  animals: [],
  volunteers: [],
  medications: [],
  activities: [],
  facilities: [],
  adoptionInquiries: [],
  badges: [],

  initialize: async () => {
    set({ isLoading: true })
    const db: Database = await api.getDatabase()
    set({
      animals: db.animals,
      volunteers: db.volunteers,
      medications: db.medications,
      activities: db.activities,
      facilities: db.facilities,
      adoptionInquiries: db.adoptionInquiries,
      badges: db.badges,
      isLoading: false,
    })
  },

  setRole: (role) => set({ currentRole: role }),
  setCurrentUser: (userId) => set({ currentUserId: userId }),

  refresh: async () => {
    const db = await api.getDatabase()
    set({
      animals: db.animals,
      volunteers: db.volunteers,
      medications: db.medications,
      activities: db.activities,
      facilities: db.facilities,
      adoptionInquiries: db.adoptionInquiries,
      badges: db.badges,
    })
  },

  getCurrentUser: () => {
    const { volunteers, currentUserId } = get()
    return volunteers.find((v) => v.id === currentUserId)
  },

  isCoordinator: () => {
    const user = get().getCurrentUser()
    return user?.role === 'coordinator' || get().currentRole === 'coordinator'
  },

  logActivity: async (activity) => {
    await api.logActivity(activity)
    await get().refresh()
  },

  administerMedication: async (medId) => {
    const user = get().getCurrentUser()
    if (!user) return
    await api.administerMedication(medId, user.id, user.name)
    await get().refresh()
  },

  updateFacility: async (id, updates) => {
    await api.updateFacility(id, updates)
    await get().refresh()
  },

  updateAnimal: async (id, updates) => {
    await api.updateAnimal(id, updates)
    await get().refresh()
  },

  createAnimal: async (animal) => {
    await api.createAnimal(animal)
    await get().refresh()
  },

  createMedication: async (med) => {
    await api.createMedication(med)
    await get().refresh()
  },
}))
