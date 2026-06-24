export type UserRole = 'volunteer' | 'coordinator'

export type Species = 'dog' | 'cat'

export type AdoptionStatus =
  | 'available'
  | 'reserved'
  | 'foster'
  | 'medical_hold'
  | 'adopted'

export type PersonalityTag =
  | 'loves_children'
  | 'good_with_dogs'
  | 'good_with_cats'
  | 'high_energy'
  | 'calm'
  | 'house_trained'
  | 'nervous_strangers'
  | 'food_motivated'
  | 'training_in_progress'

export type ActivityType =
  | 'walk'
  | 'play'
  | 'training'
  | 'grooming'
  | 'feeding'
  | 'cleaning'
  | 'medication'

export type MedicationStatus = 'completed' | 'upcoming' | 'overdue'

export type FacilityType = 'dog_kennel' | 'cat_room' | 'outdoor_area'

export interface Volunteer {
  id: string
  name: string
  email: string
  avatar: string
  role: UserRole
  joinedAt: string
  stats: {
    walksCompleted: number
    trainingSessionsCompleted: number
    medicationsAdministered: number
    cleaningTasksCompleted: number
    playSessionsCompleted: number
  }
  badges: string[]
  isActiveToday: boolean
}

export interface Vaccination {
  name: string
  date: string
  nextDue?: string
}

export interface AnimalMedical {
  vaccinations: Vaccination[]
  microchip?: string
  allergies: string[]
  conditions: string[]
  spayedNeutered: boolean
}

export interface Medication {
  id: string
  animalId: string
  name: string
  dosage: string
  schedule: string
  lastAdministered?: string
  lastAdministeredBy?: string
  nextDue: string
}

export interface Activity {
  id: string
  type: ActivityType
  animalId?: string
  facilityId?: string
  volunteerId: string
  volunteerName: string
  timestamp: string
  duration?: number
  notes?: string
  commandsPracticed?: string[]
  successScore?: number
  feedingTime?: string
}

export interface Facility {
  id: string
  name: string
  type: FacilityType
  cleanedToday: boolean
  litterChanged?: boolean
  safetyInspectionCompleted?: boolean
  lastCleaned?: string
  assignedVolunteerId?: string
  assignedVolunteerName?: string
}

export interface AdoptionInquiry {
  id: string
  animalId: string
  animalName: string
  inquirerName: string
  email: string
  message: string
  createdAt: string
  status: 'new' | 'contacted' | 'scheduled' | 'closed'
}

export interface AdoptionReadiness {
  health: number
  behaviour: number
  training: number
  socialization: number
}

export interface AnimalFAQ {
  question: string
  answer: string
}

export interface Animal {
  id: string
  name: string
  species: Species
  breed: string
  age: string
  weight: string
  adoptionStatus: AdoptionStatus
  image: string
  gallery: string[]
  personalityTags: PersonalityTag[]
  personalityDescription: string
  talkingPoints: string[]
  medical: AnimalMedical
  adoptionReadiness: AdoptionReadiness
  faqs: AnimalFAQ[]
  kennelId?: string
  roomId?: string
  adoptedAt?: string
  intakeDate: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  threshold: number
  statKey: keyof Volunteer['stats']
}

export interface Database {
  animals: Animal[]
  volunteers: Volunteer[]
  medications: Medication[]
  activities: Activity[]
  facilities: Facility[]
  adoptionInquiries: AdoptionInquiry[]
  badges: Badge[]
}

export const PERSONALITY_LABELS: Record<PersonalityTag, string> = {
  loves_children: 'Loves children',
  good_with_dogs: 'Good with dogs',
  good_with_cats: 'Good with cats',
  high_energy: 'High energy',
  calm: 'Calm',
  house_trained: 'House trained',
  nervous_strangers: 'Nervous around strangers',
  food_motivated: 'Food motivated',
  training_in_progress: 'Training in progress',
}

export const ADOPTION_STATUS_LABELS: Record<AdoptionStatus, string> = {
  available: 'Available',
  reserved: 'Reserved',
  foster: 'Foster',
  medical_hold: 'Medical Hold',
  adopted: 'Adopted',
}

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  walk: 'Walk',
  play: 'Play Session',
  training: 'Training',
  grooming: 'Grooming',
  feeding: 'Feeding',
  cleaning: 'Cleaning',
  medication: 'Medication',
}
