import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { useAppStore } from '@/stores/appStore'
import { Trophy, Footprints, GraduationCap, Pill, Sparkles, Gamepad2 } from 'lucide-react'

export function VolunteersPage() {
  const { volunteers, badges } = useAppStore()

  const leaderboard = [...volunteers]
    .sort((a, b) => {
      const totalA =
        a.stats.walksCompleted +
        a.stats.trainingSessionsCompleted +
        a.stats.medicationsAdministered +
        a.stats.cleaningTasksCompleted +
        a.stats.playSessionsCompleted
      const totalB =
        b.stats.walksCompleted +
        b.stats.trainingSessionsCompleted +
        b.stats.medicationsAdministered +
        b.stats.cleaningTasksCompleted +
        b.stats.playSessionsCompleted
      return totalB - totalA
    })

  const maxTotal = leaderboard.reduce((max, v) => {
    const total =
      v.stats.walksCompleted +
      v.stats.trainingSessionsCompleted +
      v.stats.medicationsAdministered +
      v.stats.cleaningTasksCompleted +
      v.stats.playSessionsCompleted
    return Math.max(max, total)
  }, 1)

  const statItems = [
    { key: 'walksCompleted' as const, label: 'Walks', icon: Footprints, color: 'text-green-600' },
    { key: 'trainingSessionsCompleted' as const, label: 'Training', icon: GraduationCap, color: 'text-purple-600' },
    { key: 'medicationsAdministered' as const, label: 'Medications', icon: Pill, color: 'text-red-500' },
    { key: 'cleaningTasksCompleted' as const, label: 'Cleaning', icon: Sparkles, color: 'text-blue-600' },
    { key: 'playSessionsCompleted' as const, label: 'Play', icon: Gamepad2, color: 'text-orange-500' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-sage-900">Volunteer Hub</h1>
        <p className="text-sage-600 mt-1">Celebrating the amazing people who make PawsConnect possible.</p>
      </div>

      {/* Leaderboard */}
      <section>
        <h2 className="text-lg font-bold text-sage-900 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Monthly Leaderboard
        </h2>
        <p className="text-sm text-sage-500 mb-4">Every contribution matters — thank you for caring! 💛</p>
        <Card>
          <CardContent className="p-0 divide-y divide-sage-100">
            {leaderboard.map((volunteer, index) => {
              const total =
                volunteer.stats.walksCompleted +
                volunteer.stats.trainingSessionsCompleted +
                volunteer.stats.medicationsAdministered +
                volunteer.stats.cleaningTasksCompleted +
                volunteer.stats.playSessionsCompleted
              const medals = ['🥇', '🥈', '🥉']

              return (
                <div key={volunteer.id} className="flex items-center gap-4 p-4">
                  <span className="text-2xl w-8 text-center">
                    {index < 3 ? medals[index] : <span className="text-sage-400 text-sm font-bold">{index + 1}</span>}
                  </span>
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={volunteer.avatar} alt={volunteer.name} />
                    <AvatarFallback>{volunteer.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sage-900">{volunteer.name}</p>
                      {volunteer.isActiveToday && (
                        <Badge variant="success" className="text-xs">Active today</Badge>
                      )}
                    </div>
                    <div className="mt-2">
                      <Progress value={(total / maxTotal) * 100} />
                    </div>
                    <p className="text-xs text-sage-500 mt-1">{total} total activities</p>
                  </div>
                  <div className="flex gap-1">
                    {volunteer.badges.map((badgeId) => {
                      const badge = badges.find((b) => b.id === badgeId)
                      return badge ? (
                        <span key={badgeId} title={badge.name} className="text-xl">
                          {badge.icon}
                        </span>
                      ) : null
                    })}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </section>

      {/* Volunteer Profiles */}
      <section>
        <h2 className="text-lg font-bold text-sage-900 mb-4">Volunteer Profiles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {volunteers.map((volunteer) => (
            <Card key={volunteer.id}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={volunteer.avatar} alt={volunteer.name} />
                    <AvatarFallback>{volunteer.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{volunteer.name}</CardTitle>
                    <Badge variant={volunteer.role === 'coordinator' ? 'default' : 'secondary'}>
                      {volunteer.role === 'coordinator' ? 'Coordinator' : 'Volunteer'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {statItems.map(({ key, label, icon: Icon, color }) => (
                    <div key={key} className="text-center p-3 rounded-xl bg-sage-50">
                      <Icon className={`w-5 h-5 mx-auto ${color}`} />
                      <p className="text-lg font-bold text-sage-900 mt-1">{volunteer.stats[key]}</p>
                      <p className="text-xs text-sage-500">{label}</p>
                    </div>
                  ))}
                </div>

                {volunteer.badges.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-sage-100">
                    <p className="text-sm font-semibold text-sage-700 mb-2">Badges Earned</p>
                    <div className="flex flex-wrap gap-2">
                      {volunteer.badges.map((badgeId) => {
                        const badge = badges.find((b) => b.id === badgeId)
                        return badge ? (
                          <Badge key={badgeId} variant="outline" className="gap-1 py-1.5">
                            <span>{badge.icon}</span>
                            {badge.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Available Badges */}
      <section>
        <h2 className="text-lg font-bold text-sage-900 mb-4">Available Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {badges.map((badge) => (
            <Card key={badge.id} className="text-center">
              <CardContent className="p-4">
                <span className="text-3xl">{badge.icon}</span>
                <p className="font-semibold text-sage-900 mt-2 text-sm">{badge.name}</p>
                <p className="text-xs text-sage-500 mt-1">{badge.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
