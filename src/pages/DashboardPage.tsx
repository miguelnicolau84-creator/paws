import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/dashboard/StatCard'
import { QuickLogDialog } from '@/components/activities/QuickLogDialog'
import { useAppStore } from '@/stores/appStore'
import { getMedicationStatus } from '@/api/client'
import { timeAgo } from '@/lib/utils'
import { ACTIVITY_LABELS } from '@/types'
import {
  Dog,
  Cat,
  Heart,
  Users,
  Pill,
  Footprints,
  Sparkles,
  Mail,
  Activity,
} from 'lucide-react'

export function DashboardPage() {
  const { animals, medications, activities, facilities, adoptionInquiries, volunteers } = useAppStore()

  const availableDogs = animals.filter((a) => a.species === 'dog' && a.adoptionStatus === 'available').length
  const availableCats = animals.filter((a) => a.species === 'cat' && a.adoptionStatus === 'available').length
  const adoptedThisMonth = animals.filter((a) => {
    if (!a.adoptedAt) return false
    const adopted = new Date(a.adoptedAt)
    const now = new Date()
    return adopted.getMonth() === now.getMonth() && adopted.getFullYear() === now.getFullYear()
  }).length
  const activeVolunteers = volunteers.filter((v) => v.isActiveToday).length

  const medsNeedingAttention = medications.filter(
    (m) => getMedicationStatus(m.nextDue, m.lastAdministered) !== 'completed',
  )

  const dogsNeedingWalks = animals.filter((a) => {
    if (a.species !== 'dog' || a.adoptionStatus === 'adopted' || a.adoptionStatus === 'foster') return false
    const lastWalk = activities.find((act) => act.type === 'walk' && act.animalId === a.id)
    if (!lastWalk) return true
    const hoursSince = (Date.now() - new Date(lastWalk.timestamp).getTime()) / 3600000
    return hoursSince > 8
  })

  const facilitiesNeedingCleaning = facilities.filter((f) => !f.cleanedToday)
  const newInquiries = adoptionInquiries.filter((i) => i.status === 'new')

  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8)

  const activityIcons: Record<string, typeof Activity> = {
    walk: Footprints,
    play: Sparkles,
    training: Activity,
    grooming: Sparkles,
    feeding: Heart,
    cleaning: Sparkles,
    medication: Pill,
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-sage-900">Good morning! 🐾</h1>
          <p className="text-sage-600 mt-1">Here's what's happening at the shelter today.</p>
        </div>
        <QuickLogDialog />
      </div>

      {/* Today's Summary */}
      <section>
        <h2 className="text-lg font-bold text-sage-900 mb-4">Today's Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-red-400">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-sage-600 flex items-center gap-2">
                <Pill className="w-4 h-4" /> Medication Due
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{medsNeedingAttention.length}</p>
              <div className="mt-2 space-y-1">
                {medsNeedingAttention.slice(0, 3).map((m) => {
                  const animal = animals.find((a) => a.id === m.animalId)
                  return (
                    <p key={m.id} className="text-xs text-sage-600">
                      {animal?.name} — {m.name}
                    </p>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-400">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-sage-600 flex items-center gap-2">
                <Footprints className="w-4 h-4" /> Awaiting Walks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{dogsNeedingWalks.length}</p>
              <div className="mt-2 space-y-1">
                {dogsNeedingWalks.slice(0, 3).map((d) => (
                  <Link key={d.id} to={`/animals/${d.id}`} className="text-xs text-warm-600 hover:underline block">
                    {d.name}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-400">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-sage-600 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Needs Cleaning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{facilitiesNeedingCleaning.length}</p>
              <div className="mt-2 space-y-1">
                {facilitiesNeedingCleaning.slice(0, 3).map((f) => (
                  <p key={f.id} className="text-xs text-sage-600">{f.name}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-400">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-sage-600 flex items-center gap-2">
                <Mail className="w-4 h-4" /> New Inquiries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{newInquiries.length}</p>
              <div className="mt-2 space-y-1">
                {newInquiries.slice(0, 3).map((i) => (
                  <p key={i.id} className="text-xs text-sage-600">{i.inquirerName} — {i.animalName}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Stats */}
      <section>
        <h2 className="text-lg font-bold text-sage-900 mb-4">Quick Statistics</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Dogs Available" value={availableDogs} icon={Dog} color="warm" />
          <StatCard title="Cats Available" value={availableCats} icon={Cat} color="sage" />
          <StatCard title="Adopted This Month" value={adoptedThisMonth} icon={Heart} color="coral" subtitle="Celebrating forever homes!" />
          <StatCard title="Volunteers Today" value={activeVolunteers} icon={Users} color="green" subtitle={`of ${volunteers.length} total`} />
        </div>
      </section>

      {/* Activity Feed */}
      <section>
        <h2 className="text-lg font-bold text-sage-900 mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-0 divide-y divide-sage-100">
            {recentActivities.map((activity) => {
              const Icon = activityIcons[activity.type] || Activity
              const animal = animals.find((a) => a.id === activity.animalId)
              return (
                <div key={activity.id} className="flex items-center gap-4 p-4 hover:bg-sage-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-warm-100 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-warm-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-sage-900">
                      {ACTIVITY_LABELS[activity.type]}
                      {animal && (
                        <Link to={`/animals/${animal.id}`} className="text-warm-600 hover:underline ml-1">
                          — {animal.name}
                        </Link>
                      )}
                    </p>
                    <p className="text-xs text-sage-500">
                      {activity.volunteerName}
                      {activity.duration && ` · ${activity.duration} min`}
                      {activity.notes && ` · ${activity.notes}`}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">{timeAgo(activity.timestamp)}</Badge>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
