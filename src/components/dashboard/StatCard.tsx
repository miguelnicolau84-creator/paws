import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  color?: 'warm' | 'sage' | 'coral' | 'green'
}

const colorMap = {
  warm: 'bg-warm-50 text-warm-600 border-warm-100',
  sage: 'bg-sage-50 text-sage-600 border-sage-100',
  coral: 'bg-orange-50 text-orange-600 border-orange-100',
  green: 'bg-green-50 text-green-600 border-green-100',
}

export function StatCard({ title, value, subtitle, icon: Icon, color = 'warm' }: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-sage-600">{title}</CardTitle>
        <div className={cn('p-2.5 rounded-xl border', colorMap[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-sage-900">{value}</div>
        {subtitle && <p className="text-xs text-sage-500 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}
