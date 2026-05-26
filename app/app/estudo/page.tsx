'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Plus, Clock, Play, Pause, RotateCcw, CheckCircle, Trash2 } from 'lucide-react'
import { format, parseISO, isToday, isTomorrow } from 'date-fns'
import { pt } from 'date-fns/locale'
import type { Subject, StudySession, StudySessionFormData } from '@/lib/types'

const initialFormData: StudySessionFormData = {
  subject_id: null,
  event_id: null,
  title: '',
  scheduled_at: '',
  duration_minutes: 60,
  status: 'scheduled',
  notes: '',
}

function StudyTimer({ 
  durationMinutes, 
  onComplete 
}: { 
  durationMinutes: number
  onComplete: () => void 
}) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          onComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, onComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((durationMinutes * 60 - timeLeft) / (durationMinutes * 60)) * 100

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex h-40 w-40 items-center justify-center">
        <svg className="absolute h-full w-full -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={2 * Math.PI * 70}
            strokeDashoffset={2 * Math.PI * 70 * (1 - progress / 100)}
            className="text-primary transition-all duration-1000"
          />
        </svg>
        <span className="text-3xl font-bold">{formatTime(timeLeft)}</span>
      </div>
      <div className="flex gap-2">
        <Button
          variant={isRunning ? 'secondary' : 'default'}
          size="icon"
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setTimeLeft(durationMinutes * 60)
            setIsRunning(false)
          }}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default function EstudoPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<StudySessionFormData>(initialFormData)
  const [activeSession, setActiveSession] = useState<StudySession | null>(null)
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data } = await supabase.from('subjects').select('*').order('name')
      return (data || []) as Subject[]
    },
  })

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['study-sessions'],
    queryFn: async () => {
      const { data } = await supabase
        .from('study_sessions')
        .select('*, subject:subjects(*)')
        .order('scheduled_at', { ascending: false })
      return (data || []) as StudySession[]
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: StudySessionFormData) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Nao autenticado')

      const { error } = await supabase.from('study_sessions').insert({
        ...data,
        user_id: user.id,
        subject_id: data.subject_id || null,
        notes: data.notes || null,
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sessions'] })
      setIsOpen(false)
      setFormData(initialFormData)
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<StudySessionFormData> }) => {
      const { error } = await supabase.from('study_sessions').update(data).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sessions'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('study_sessions').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sessions'] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  const handleComplete = useCallback(() => {
    if (activeSession) {
      updateMutation.mutate({ id: activeSession.id, data: { status: 'completed' } })
      setActiveSession(null)
    }
  }, [activeSession, updateMutation])

  const startSession = (session: StudySession) => {
    setActiveSession(session)
    updateMutation.mutate({ id: session.id, data: { status: 'in_progress' } })
  }

  const getDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr)
    if (isToday(date)) return 'Hoje'
    if (isTomorrow(date)) return 'Amanha'
    return format(date, "d 'de' MMMM", { locale: pt })
  }

  const scheduledSessions = sessions.filter((s) => s.status === 'scheduled')
  const completedSessions = sessions.filter((s) => s.status === 'completed')

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sessoes de Estudo</h1>
          <p className="text-muted-foreground">
            Planeia e acompanha o teu tempo de estudo
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nova Sessao
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Sessao de Estudo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titulo *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Ex: Revisao de Calculo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Disciplina</Label>
                <Select
                  value={formData.subject_id || 'none'}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      subject_id: value === 'none' ? null : value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleciona (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem disciplina</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: subject.color }}
                          />
                          {subject.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduled_at">Data e hora *</Label>
                  <Input
                    id="scheduled_at"
                    type="datetime-local"
                    value={formData.scheduled_at}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, scheduled_at: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duracao (minutos) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="5"
                    max="480"
                    value={formData.duration_minutes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        duration_minutes: parseInt(e.target.value) || 60,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="O que vais estudar?"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'A criar...' : 'Criar sessao'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Timer */}
      {activeSession && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Sessao em curso</span>
              <Badge variant="default">Em progresso</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-lg font-medium">{activeSession.title}</p>
            {activeSession.subject && (
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: activeSession.subject.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {activeSession.subject.name}
                </span>
              </div>
            )}
            <StudyTimer
              durationMinutes={activeSession.duration_minutes}
              onComplete={handleComplete}
            />
            <Button
              variant="outline"
              onClick={handleComplete}
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Terminar sessao
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Scheduled Sessions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Sessoes Agendadas</h2>
        {scheduledSessions.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Sem sessoes agendadas</h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Agenda sessoes de estudo para manter a disciplina e acompanhar o teu progresso.
              </p>
              <Button className="mt-6" onClick={() => setIsOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Agendar sessao
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {scheduledSessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {session.subject && (
                          <div
                            className="h-3 w-3 shrink-0 rounded-full"
                            style={{ backgroundColor: session.subject.color }}
                          />
                        )}
                        <p className="font-medium">{session.title}</p>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {getDateLabel(session.scheduled_at)} as{' '}
                        {format(parseISO(session.scheduled_at), 'HH:mm')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.duration_minutes} minutos
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-destructive"
                      onClick={() => {
                        if (confirm('Apagar esta sessao?')) {
                          deleteMutation.mutate(session.id)
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    className="mt-3 w-full"
                    size="sm"
                    onClick={() => startSession(session)}
                    disabled={activeSession !== null}
                  >
                    <Play className="mr-2 h-4 w-4" /> Iniciar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Completed Sessions */}
      {completedSessions.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">Sessoes Concluidas</h2>
          <div className="space-y-2">
            {completedSessions.slice(0, 10).map((session) => (
              <Card key={session.id} className="opacity-70">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  {session.subject && (
                    <div
                      className="h-8 w-1 rounded-full"
                      style={{ backgroundColor: session.subject.color }}
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{session.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(session.scheduled_at), "d 'de' MMMM", { locale: pt })} •{' '}
                      {session.duration_minutes} min
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
