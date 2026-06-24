import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAppStore } from '@/stores/appStore'
import { getAdoptionScore } from '@/api/client'
import { timeAgo } from '@/lib/utils'
import { ADOPTION_STATUS_LABELS, PERSONALITY_LABELS } from '@/types'
import { Heart, Mail } from 'lucide-react'

export function AdoptionPage() {
  const { animals, adoptionInquiries } = useAppStore()

  const adoptable = animals.filter(
    (a) => a.adoptionStatus === 'available' || a.adoptionStatus === 'reserved',
  )

  const sortedByScore = [...adoptable].sort(
    (a, b) => getAdoptionScore(b.adoptionReadiness) - getAdoptionScore(a.adoptionReadiness),
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-sage-900">Adoption Support</h1>
        <p className="text-sage-600 mt-1">Help potential adopters find their perfect match.</p>
      </div>

      {/* Inquiries */}
      <section>
        <h2 className="text-lg font-bold text-sage-900 mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-warm-600" />
          Adoption Inquiries
        </h2>
        <div className="space-y-3">
          {adoptionInquiries.map((inquiry) => (
            <Card key={inquiry.id}>
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sage-900">{inquiry.inquirerName}</p>
                    <Badge variant={inquiry.status === 'new' ? 'warning' : 'secondary'}>{inquiry.status}</Badge>
                  </div>
                  <p className="text-sm text-warm-600">
                    Interested in{' '}
                    <Link to={`/animals/${inquiry.animalId}`} className="hover:underline font-medium">
                      {inquiry.animalName}
                    </Link>
                  </p>
                  <p className="text-sm text-sage-600 mt-1 line-clamp-2">"{inquiry.message}"</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-sage-500">{timeAgo(inquiry.createdAt)}</p>
                  <p className="text-xs text-sage-400">{inquiry.email}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Adoption Ready Animals */}
      <section>
        <h2 className="text-lg font-bold text-sage-900 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-coral-500" />
          Adoption Readiness
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedByScore.map((animal) => {
            const score = getAdoptionScore(animal.adoptionReadiness)
            return (
              <Card key={animal.id} className="overflow-hidden hover:card-shadow-lg transition-shadow">
                <div className="flex">
                  <img
                    src={animal.image}
                    alt={animal.name}
                    className="w-32 h-32 object-cover shrink-0"
                  />
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link to={`/animals/${animal.id}`} className="font-bold text-sage-900 hover:text-warm-600 text-lg">
                          {animal.name}
                        </Link>
                        <p className="text-sm text-sage-600">{animal.breed}</p>
                      </div>
                      <Badge variant={animal.adoptionStatus}>
                        {ADOPTION_STATUS_LABELS[animal.adoptionStatus]}
                      </Badge>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-sage-600">Readiness Score</span>
                        <span className="font-bold text-warm-600">{score}%</span>
                      </div>
                      <Progress value={score} />
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {animal.personalityTags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {PERSONALITY_LABELS[tag]}
                        </Badge>
                      ))}
                    </div>

                    {animal.faqs.length > 0 && (
                      <div className="mt-3 p-2 bg-sage-50 rounded-lg">
                        <p className="text-xs font-semibold text-sage-700">{animal.faqs[0].question}</p>
                        <p className="text-xs text-sage-600 mt-0.5">{animal.faqs[0].answer}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
