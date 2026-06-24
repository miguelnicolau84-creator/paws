import type {
  Activity,
  ActivityType,
  Animal,
  Database,
  Facility,
  Medication,
  Volunteer,
} from '@/types'
import { seedDatabase } from '@/data/seed'

const STORAGE_KEY = 'paws-db'
const SEED_VERSION = '3'

function loadDb(): Database {
  const version = localStorage.getItem(`${STORAGE_KEY}-version`)
  if (version !== SEED_VERSION) {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.setItem(`${STORAGE_KEY}-version`, SEED_VERSION)
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored) as Database
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }
  return structuredClone(seedDatabase)
}

function saveDb(db: Database): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
}

let db = loadDb()

function refresh(): void {
  db = loadDb()
}

export function resetDatabase(): void {
  db = structuredClone(seedDatabase)
  saveDb(db)
}

function delay(ms = 150): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const api = {
  async getDatabase(): Promise<Database> {
    await delay()
    refresh()
    return structuredClone(db)
  },

  async getAnimals(): Promise<Animal[]> {
    await delay()
    return structuredClone(db.animals)
  },

  async getAnimal(id: string): Promise<Animal | undefined> {
    await delay()
    return structuredClone(db.animals.find((a) => a.id === id))
  },

  async createAnimal(animal: Animal): Promise<Animal> {
    await delay()
    db.animals.push(animal)
    saveDb(db)
    return animal
  },

  async updateAnimal(id: string, updates: Partial<Animal>): Promise<Animal> {
    await delay()
    const index = db.animals.findIndex((a) => a.id === id)
    if (index === -1) throw new Error('Animal not found')
    db.animals[index] = { ...db.animals[index], ...updates }
    saveDb(db)
    return db.animals[index]
  },

  async getVolunteers(): Promise<Volunteer[]> {
    await delay()
    return structuredClone(db.volunteers)
  },

  async getVolunteer(id: string): Promise<Volunteer | undefined> {
    await delay()
    return structuredClone(db.volunteers.find((v) => v.id === id))
  },

  async getMedications(): Promise<Medication[]> {
    await delay()
    return structuredClone(db.medications)
  },

  async getMedicationsForAnimal(animalId: string): Promise<Medication[]> {
    await delay()
    return structuredClone(db.medications.filter((m) => m.animalId === animalId))
  },

  async createMedication(med: Medication): Promise<Medication> {
    await delay()
    db.medications.push(med)
    saveDb(db)
    return med
  },

  async administerMedication(
    medId: string,
    volunteerId: string,
    volunteerName: string,
  ): Promise<Medication> {
    await delay()
    const index = db.medications.findIndex((m) => m.id === medId)
    if (index === -1) throw new Error('Medication not found')
    const now = new Date().toISOString()
    db.medications[index] = {
      ...db.medications[index],
      lastAdministered: now,
      lastAdministeredBy: volunteerName,
      nextDue: new Date(Date.now() + 12 * 3600000).toISOString(),
    }

    const volunteer = db.volunteers.find((v) => v.id === volunteerId)
    if (volunteer) {
      volunteer.stats.medicationsAdministered += 1
    }

    const activity: Activity = {
      id: `a-${Date.now()}`,
      type: 'medication',
      animalId: db.medications[index].animalId,
      volunteerId,
      volunteerName,
      timestamp: now,
      notes: `Administered ${db.medications[index].name}`,
    }
    db.activities.unshift(activity)
    saveDb(db)
    return db.medications[index]
  },

  async getActivities(): Promise<Activity[]> {
    await delay()
    return structuredClone(db.activities)
  },

  async getActivitiesForAnimal(animalId: string): Promise<Activity[]> {
    await delay()
    return structuredClone(
      db.activities.filter((a) => a.animalId === animalId).sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      ),
    )
  },

  async logActivity(activity: Omit<Activity, 'id'>): Promise<Activity> {
    await delay()
    const newActivity: Activity = { ...activity, id: `a-${Date.now()}` }
    db.activities.unshift(newActivity)

    const volunteer = db.volunteers.find((v) => v.id === activity.volunteerId)
    if (volunteer) {
      switch (activity.type) {
        case 'walk':
          volunteer.stats.walksCompleted += 1
          break
        case 'play':
          volunteer.stats.playSessionsCompleted += 1
          break
        case 'training':
          volunteer.stats.trainingSessionsCompleted += 1
          break
        case 'cleaning':
          volunteer.stats.cleaningTasksCompleted += 1
          break
        case 'medication':
          volunteer.stats.medicationsAdministered += 1
          break
      }
    }

    if (activity.facilityId && activity.type === 'cleaning') {
      const facility = db.facilities.find((f) => f.id === activity.facilityId)
      if (facility) {
        facility.cleanedToday = true
        facility.lastCleaned = newActivity.timestamp
        facility.assignedVolunteerId = activity.volunteerId
        facility.assignedVolunteerName = activity.volunteerName
      }
    }

    saveDb(db)
    return newActivity
  },

  async getFacilities(): Promise<Facility[]> {
    await delay()
    return structuredClone(db.facilities)
  },

  async updateFacility(id: string, updates: Partial<Facility>): Promise<Facility> {
    await delay()
    const index = db.facilities.findIndex((f) => f.id === id)
    if (index === -1) throw new Error('Facility not found')
    db.facilities[index] = { ...db.facilities[index], ...updates }
    saveDb(db)
    return db.facilities[index]
  },

  async getAdoptionInquiries() {
    await delay()
    return structuredClone(db.adoptionInquiries)
  },

  async getBadges() {
    await delay()
    return structuredClone(db.badges)
  },
}

export function getMedicationStatus(nextDue: string, lastAdministered?: string): 'completed' | 'upcoming' | 'overdue' {
  const now = Date.now()
  const due = new Date(nextDue).getTime()
  if (lastAdministered) {
    const last = new Date(lastAdministered).getTime()
    const hoursSince = (now - last) / 3600000
    if (hoursSince < 4) return 'completed'
  }
  if (due < now) return 'overdue'
  if (due - now < 4 * 3600000) return 'upcoming'
  return 'completed'
}

export function getAdoptionScore(readiness: Animal['adoptionReadiness']): number {
  const { health, behaviour, training, socialization } = readiness
  return Math.round((health + behaviour + training + socialization) / 4)
}

export type QuickLogType = Extract<ActivityType, 'walk' | 'play' | 'training' | 'cleaning' | 'medication'>
