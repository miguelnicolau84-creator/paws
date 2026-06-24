import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Footprints, Gamepad2, GraduationCap, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '@/stores/appStore'
import type { ActivityType } from '@/types'

const quickActions = [
  { type: 'walk' as const, label: 'Log Walk', icon: Footprints, color: 'bg-green-500' },
  { type: 'play' as const, label: 'Log Play', icon: Gamepad2, color: 'bg-blue-500' },
  { type: 'training' as const, label: 'Log Training', icon: GraduationCap, color: 'bg-purple-500' },
  { type: 'grooming' as const, label: 'Log Grooming', icon: Sparkles, color: 'bg-pink-500' },
]

interface QuickLogDialogProps {
  animalId?: string
  facilityId?: string
  defaultType?: ActivityType
  trigger?: React.ReactNode
}

export function QuickLogDialog({ animalId, facilityId, defaultType, trigger }: QuickLogDialogProps) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<ActivityType>(defaultType || 'walk')
  const [selectedAnimal, setSelectedAnimal] = useState(animalId || '')
  const [duration, setDuration] = useState('30')
  const [notes, setNotes] = useState('')
  const [successScore, setSuccessScore] = useState('7')
  const [commands, setCommands] = useState('')

  const { animals, logActivity, getCurrentUser } = useAppStore()
  const user = getCurrentUser()

  const availableAnimals = animals.filter(
    (a) => a.adoptionStatus !== 'adopted' && a.adoptionStatus !== 'foster',
  )

  const handleSubmit = async () => {
    if (!user) return
    const targetAnimal = animalId || selectedAnimal
    if (!targetAnimal && type !== 'cleaning') return

    await logActivity({
      type,
      animalId: targetAnimal || undefined,
      facilityId,
      volunteerId: user.id,
      volunteerName: user.name,
      timestamp: new Date().toISOString(),
      duration: duration ? parseInt(duration) : undefined,
      notes: notes || undefined,
      successScore: type === 'training' ? parseInt(successScore) : undefined,
      commandsPracticed: type === 'training' && commands ? commands.split(',').map((c) => c.trim()) : undefined,
    })

    setOpen(false)
    setNotes('')
    setDuration('30')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="lg" className="gap-2">
            <Plus className="w-5 h-5" />
            Quick Log
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Activity</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map(({ type: t, label, icon: Icon, color }) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all min-h-[80px] ${
                  type === t ? 'border-warm-500 bg-warm-50' : 'border-sage-200 hover:border-sage-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-semibold">{label}</span>
              </button>
            ))}
          </div>

          {!animalId && (
            <div>
              <label className="text-sm font-medium text-sage-700 mb-1.5 block">Animal</label>
              <Select value={selectedAnimal} onValueChange={setSelectedAnimal}>
                <SelectTrigger>
                  <SelectValue placeholder="Select animal" />
                </SelectTrigger>
                <SelectContent>
                  {availableAnimals.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name} ({a.species})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {(type === 'walk' || type === 'play' || type === 'training') && (
            <div>
              <label className="text-sm font-medium text-sage-700 mb-1.5 block">Duration (minutes)</label>
              <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} min={1} />
            </div>
          )}

          {type === 'training' && (
            <>
              <div>
                <label className="text-sm font-medium text-sage-700 mb-1.5 block">Commands (comma separated)</label>
                <Input value={commands} onChange={(e) => setCommands(e.target.value)} placeholder="sit, stay, come" />
              </div>
              <div>
                <label className="text-sm font-medium text-sage-700 mb-1.5 block">Success Score (1-10)</label>
                <Input type="number" value={successScore} onChange={(e) => setSuccessScore(e.target.value)} min={1} max={10} />
              </div>
            </>
          )}

          <div>
            <label className="text-sm font-medium text-sage-700 mb-1.5 block">Notes</label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." />
          </div>

          <Button size="lg" className="w-full" onClick={handleSubmit}>
            Save Activity
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function QuickActionBar({ animalId }: { animalId?: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      {quickActions.map(({ type, label, icon: Icon, color }) => (
        <QuickLogDialog
          key={type}
          animalId={animalId}
          defaultType={type}
          trigger={
            <Button variant="outline" size="lg" className="gap-2 flex-1 min-w-[140px]">
              <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              {label.replace('Log ', '')}
            </Button>
          }
        />
      ))}
    </div>
  )
}
