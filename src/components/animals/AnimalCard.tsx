import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Animal } from '@/types'
import { ADOPTION_STATUS_LABELS } from '@/types'

interface AnimalCardProps {
  animal: Animal
}

export function AnimalCard({ animal }: AnimalCardProps) {
  return (
    <Link to={`/animals/${animal.id}`}>
      <Card className="overflow-hidden hover:card-shadow-lg transition-all duration-300 hover:-translate-y-1 group">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={animal.image}
            alt={animal.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 right-3">
            <Badge variant={animal.adoptionStatus}>{ADOPTION_STATUS_LABELS[animal.adoptionStatus]}</Badge>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h3 className="text-white font-bold text-xl">{animal.name}</h3>
            <p className="text-white/80 text-sm">{animal.breed}</p>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-sage-600">
            <span>{animal.age}</span>
            <span>{animal.weight}</span>
            <span className="capitalize">{animal.species}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
