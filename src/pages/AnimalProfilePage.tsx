import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { MedicationCard } from '@/components/medications/MedicationCard'
import { QuickActionBar } from '@/components/activities/QuickLogDialog'
import { useAppStore } from '@/stores/appStore'
import { getAdoptionScore } from '@/api/client'
import { timeAgo } from '@/lib/utils'
import {
  ADOPTION_STATUS_LABELS,
  PERSONALITY_LABELS,
  ACTIVITY_LABELS,
} from '@/types'
import {
  ArrowLeft,
  Footprints,
  Gamepad2,
  GraduationCap,
  Sparkles,
  Utensils,
  Pill,
  MessageCircle,
} from 'lucide-react'

const activityIcons = {
  walk: Footprints,
  play: Gamepad2,
  training: GraduationCap,
  grooming: Sparkles,
  feeding: Utensils,
  cleaning: Sparkles,
  medication: Pill,
}

export function AnimalProfilePage() {
  const { id } = useParams<{ id: string }>()
  const { animals, medications, activities } = useAppStore()

  const animal = animals.find((a) => a.id === id)
  if (!animal) {
    return (
      <div className="text-center py-20">
        <p className="text-sage-600">Animal not found.</p>
        <Link to="/animals" className="text-warm-600 hover:underline mt-2 inline-block">Back to animals</Link>
      </div>
    )
  }

  const animalMeds = medications.filter((m) => m.animalId === animal.id)
  const animalActivities = activities
    .filter((a) => a.animalId === animal.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const adoptionScore = getAdoptionScore(animal.adoptionReadiness)

  return (
    <div className="space-y-8">
      <Link to="/animals" className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-900 font-medium min-h-[44px]">
        <ArrowLeft className="w-5 h-5" />
        Back to Animals
      </Link>

      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden card-shadow-lg">
        <img src={animal.image} alt={animal.name} className="w-full h-64 md:h-96 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1">
              <Badge variant={animal.adoptionStatus} className="mb-2">
                {ADOPTION_STATUS_LABELS[animal.adoptionStatus]}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white">{animal.name}</h1>
              <p className="text-white/80 text-lg mt-1">{animal.breed} · {animal.age} · {animal.weight}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
              <p className="text-white/80 text-sm">Adoption Score</p>
              <p className="text-3xl font-bold text-white">{adoptionScore}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActionBar animalId={animal.id} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Personality */}
          <Card>
            <CardHeader>
              <CardTitle>Personality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {animal.personalityTags.map((tag) => (
                  <Badge key={tag} variant="secondary">{PERSONALITY_LABELS[tag]}</Badge>
                ))}
              </div>
              <p className="text-sage-700 leading-relaxed">{animal.personalityDescription}</p>
            </CardContent>
          </Card>

          {/* Talking Points */}
          <Card className="border-warm-200 bg-warm-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-warm-600" />
                Volunteer Talking Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {animal.talkingPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-warm-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sage-800 font-medium">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Medical */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-sage-500 mb-2">Vaccinations</h4>
                  {animal.medical.vaccinations.map((v, i) => (
                    <p key={i} className="text-sm text-sage-800">{v.name} — {v.date}</p>
                  ))}
                </div>
                {animal.medical.microchip && (
                  <div>
                    <h4 className="text-sm font-semibold text-sage-500 mb-2">Microchip</h4>
                    <p className="text-sm text-sage-800 font-mono">{animal.medical.microchip}</p>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-sage-500 mb-2">Allergies</h4>
                  <p className="text-sm text-sage-800">
                    {animal.medical.allergies.length ? animal.medical.allergies.join(', ') : 'None known'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-sage-500 mb-2">Conditions</h4>
                  <p className="text-sm text-sage-800">
                    {animal.medical.conditions.length ? animal.medical.conditions.join(', ') : 'None'}
                  </p>
                </div>
              </div>
              <Badge variant={animal.medical.spayedNeutered ? 'success' : 'warning'}>
                {animal.medical.spayedNeutered ? 'Spayed/Neutered' : 'Not yet spayed/neutered'}
              </Badge>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              {animalActivities.length === 0 ? (
                <p className="text-sage-500 text-center py-8">No activities logged yet.</p>
              ) : (
                <div className="space-y-4">
                  {animalActivities.map((activity, i) => {
                    const Icon = activityIcons[activity.type]
                    return (
                      <div key={activity.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-sage-600" />
                          </div>
                          {i < animalActivities.length - 1 && (
                            <div className="w-0.5 flex-1 bg-sage-200 my-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-sage-900">{ACTIVITY_LABELS[activity.type]}</p>
                            <span className="text-xs text-sage-500">{timeAgo(activity.timestamp)}</span>
                          </div>
                          <p className="text-sm text-sage-600 mt-0.5">{activity.volunteerName}</p>
                          {activity.duration && (
                            <p className="text-sm text-sage-500">Duration: {activity.duration} min</p>
                          )}
                          {activity.commandsPracticed && (
                            <p className="text-sm text-sage-500">
                              Commands: {activity.commandsPracticed.join(', ')}
                              {activity.successScore && ` · Score: ${activity.successScore}/10`}
                            </p>
                          )}
                          {activity.notes && (
                            <p className="text-sm text-sage-700 mt-1 italic">"{activity.notes}"</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Adoption Readiness */}
          <Card>
            <CardHeader>
              <CardTitle>Adoption Readiness</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(animal.adoptionReadiness).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-sage-600">{key}</span>
                    <span className="font-semibold">{value}%</span>
                  </div>
                  <Progress value={value} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Medications */}
          {animalMeds.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sage-900">Medications</h3>
              {animalMeds.map((med) => (
                <MedicationCard key={med.id} medication={med} animalName={animal.name} />
              ))}
            </div>
          )}

          {/* FAQs */}
          {animal.faqs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Adoption FAQs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {animal.faqs.map((faq, i) => (
                  <div key={i}>
                    <p className="font-semibold text-sage-900 text-sm">{faq.question}</p>
                    <p className="text-sage-600 text-sm mt-1">{faq.answer}</p>
                    {i < animal.faqs.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Gallery */}
          {animal.gallery.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Photo Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {animal.gallery.map((img, i) => (
                    <img key={i} src={img} alt={`${animal.name} ${i + 1}`} className="rounded-xl aspect-square object-cover" />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
