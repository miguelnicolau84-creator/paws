import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/appStore'
import { formatDateTime } from '@/lib/utils'
import { Check, X, Dog, Cat, Trees } from 'lucide-react'

export function FacilitiesPage() {
  const { facilities, updateFacility, logActivity, getCurrentUser } = useAppStore()
  const user = getCurrentUser()

  const dogKennels = facilities.filter((f) => f.type === 'dog_kennel')
  const catRooms = facilities.filter((f) => f.type === 'cat_room')
  const outdoorAreas = facilities.filter((f) => f.type === 'outdoor_area')

  const handleMarkCleaned = async (facilityId: string, facilityName: string) => {
    if (!user) return
    await logActivity({
      type: 'cleaning',
      facilityId,
      volunteerId: user.id,
      volunteerName: user.name,
      timestamp: new Date().toISOString(),
      notes: `Cleaned ${facilityName}`,
    })
  }

  const handleToggleLitter = async (facilityId: string, current: boolean) => {
    await updateFacility(facilityId, { litterChanged: !current })
  }

  const handleSafetyInspection = async (facilityId: string, current: boolean) => {
    await updateFacility(facilityId, { safetyInspectionCompleted: !current })
  }

  const FacilitySection = ({
    title,
    icon: Icon,
    items,
    showLitter,
    showSafety,
  }: {
    title: string
    icon: typeof Dog
    items: typeof facilities
    showLitter?: boolean
    showSafety?: boolean
  }) => (
    <section>
      <h2 className="text-lg font-bold text-sage-900 mb-4 flex items-center gap-2">
        <Icon className="w-5 h-5 text-warm-600" />
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((facility) => (
          <Card key={facility.id} className={facility.cleanedToday ? 'border-green-200' : 'border-yellow-200'}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{facility.name}</CardTitle>
                <Badge variant={facility.cleanedToday ? 'success' : 'warning'}>
                  {facility.cleanedToday ? 'Cleaned' : 'Needs Cleaning'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {facility.lastCleaned && (
                <p className="text-sm text-sage-600">
                  Last cleaned: {formatDateTime(facility.lastCleaned)}
                  {facility.assignedVolunteerName && ` by ${facility.assignedVolunteerName}`}
                </p>
              )}

              {showLitter && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-sage-700">Litter changed</span>
                  <button
                    onClick={() => handleToggleLitter(facility.id, !!facility.litterChanged)}
                    className="p-2 rounded-lg hover:bg-sage-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Toggle litter changed"
                  >
                    {facility.litterChanged ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-400" />
                    )}
                  </button>
                </div>
              )}

              {showSafety && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-sage-700">Safety inspection</span>
                  <button
                    onClick={() => handleSafetyInspection(facility.id, !!facility.safetyInspectionCompleted)}
                    className="p-2 rounded-lg hover:bg-sage-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Toggle safety inspection"
                  >
                    {facility.safetyInspectionCompleted ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-400" />
                    )}
                  </button>
                </div>
              )}

              {!facility.cleanedToday && (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handleMarkCleaned(facility.id, facility.name)}
                >
                  Mark as Cleaned
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )

  const cleanedCount = facilities.filter((f) => f.cleanedToday).length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-sage-900">Facility Management</h1>
        <p className="text-sage-600 mt-1">
          {cleanedCount} of {facilities.length} facilities cleaned today
        </p>
      </div>

      <FacilitySection title="Dog Kennels" icon={Dog} items={dogKennels} />
      <FacilitySection title="Cat Rooms" icon={Cat} items={catRooms} showLitter />
      <FacilitySection title="Outdoor Areas" icon={Trees} items={outdoorAreas} showSafety />
    </div>
  )
}
