import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/stores/appStore'
import { getMedicationStatus } from '@/api/client'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

const COLORS = ['#e67e33', '#5a7d5a', '#ef6548', '#7a9a7a', '#f5be8f', '#466446', '#dc4a2e', '#a3b9a3']

export function AnalyticsPage() {
  const { animals, activities, medications, volunteers } = useAppStore()

  const walkData = animals
    .filter((a) => a.species === 'dog' && a.adoptionStatus !== 'adopted')
    .map((animal) => ({
      name: animal.name,
      walks: activities.filter((a) => a.type === 'walk' && a.animalId === animal.id).length,
    }))
    .sort((a, b) => b.walks - a.walks)
    .slice(0, 8)

  const medCompliance = medications.map((med) => {
    const animal = animals.find((a) => a.id === med.animalId)
    const status = getMedicationStatus(med.nextDue, med.lastAdministered)
    return {
      name: `${animal?.name} - ${med.name}`,
      compliant: status === 'completed' ? 100 : status === 'upcoming' ? 75 : 40,
    }
  })

  const volunteerData = volunteers.map((v) => ({
    name: v.name.split(' ')[0],
    activities:
      v.stats.walksCompleted +
      v.stats.trainingSessionsCompleted +
      v.stats.medicationsAdministered +
      v.stats.cleaningTasksCompleted +
      v.stats.playSessionsCompleted,
  }))

  const adoptionByMonth = [
    { month: 'Jan', adoptions: 3 },
    { month: 'Feb', adoptions: 5 },
    { month: 'Mar', adoptions: 4 },
    { month: 'Apr', adoptions: 7 },
    { month: 'May', adoptions: 6 },
    { month: 'Jun', adoptions: animals.filter((a) => a.adoptedAt?.startsWith('2026-06')).length + 4 },
  ]

  const enrichmentData = [
    { name: 'Walks', value: activities.filter((a) => a.type === 'walk').length },
    { name: 'Play', value: activities.filter((a) => a.type === 'play').length },
    { name: 'Training', value: activities.filter((a) => a.type === 'training').length },
    { name: 'Grooming', value: activities.filter((a) => a.type === 'grooming').length },
  ].filter((d) => d.value > 0)

  const ChartCard = ({
    title,
    children,
  }: {
    title: string
    children: React.ReactNode
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">{children}</div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-sage-900">Analytics</h1>
        <p className="text-sage-600 mt-1">Shelter insights and trends at a glance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Walk Frequency by Animal">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={walkData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4ebe4" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e4ebe4' }}
              />
              <Bar dataKey="walks" fill="#e67e33" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Medication Compliance">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={medCompliance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4ebe4" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e4ebe4' }}
                formatter={(value) => [`${value}%`, 'Compliance']}
              />
              <Bar dataKey="compliant" fill="#5a7d5a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Volunteer Participation">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volunteerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4ebe4" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e4ebe4' }} />
              <Bar dataKey="activities" fill="#ef6548" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Adoption Rates">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={adoptionByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4ebe4" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e4ebe4' }} />
              <Line
                type="monotone"
                dataKey="adoptions"
                stroke="#e67e33"
                strokeWidth={3}
                dot={{ fill: '#e67e33', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Enrichment Activity Breakdown">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={enrichmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {enrichmentData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e4ebe4' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
