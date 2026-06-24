import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getMedicationStatus } from '@/api/client'
import { formatDateTime } from '@/lib/utils'
import type { Medication } from '@/types'
import { Check, Clock, AlertTriangle } from 'lucide-react'
import { useAppStore } from '@/stores/appStore'

interface MedicationCardProps {
  medication: Medication
  animalName: string
}

const statusConfig = {
  completed: { label: 'Completed', variant: 'success' as const, icon: Check, color: 'border-green-200 bg-green-50' },
  upcoming: { label: 'Upcoming', variant: 'warning' as const, icon: Clock, color: 'border-yellow-200 bg-yellow-50' },
  overdue: { label: 'Overdue', variant: 'danger' as const, icon: AlertTriangle, color: 'border-red-200 bg-red-50' },
}

export function MedicationCard({ medication, animalName }: MedicationCardProps) {
  const administerMedication = useAppStore((s) => s.administerMedication)
  const status = getMedicationStatus(medication.nextDue, medication.lastAdministered)
  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <Card className={`border-2 ${config.color}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{medication.name}</CardTitle>
            <p className="text-sm text-sage-600 mt-0.5">{animalName}</p>
          </div>
          <Badge variant={config.variant} className="flex items-center gap-1">
            <StatusIcon className="w-3 h-3" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-sage-500">Dosage</span>
            <p className="font-medium">{medication.dosage}</p>
          </div>
          <div>
            <span className="text-sage-500">Schedule</span>
            <p className="font-medium">{medication.schedule}</p>
          </div>
          {medication.lastAdministered && (
            <div className="col-span-2">
              <span className="text-sage-500">Last given</span>
              <p className="font-medium">
                {formatDateTime(medication.lastAdministered)}
                {medication.lastAdministeredBy && ` by ${medication.lastAdministeredBy}`}
              </p>
            </div>
          )}
          <div className="col-span-2">
            <span className="text-sage-500">Next due</span>
            <p className="font-medium">{formatDateTime(medication.nextDue)}</p>
          </div>
        </div>
        {(status === 'upcoming' || status === 'overdue') && (
          <Button
            className="w-full"
            variant={status === 'overdue' ? 'destructive' : 'default'}
            onClick={() => administerMedication(medication.id)}
          >
            Mark as Administered
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
