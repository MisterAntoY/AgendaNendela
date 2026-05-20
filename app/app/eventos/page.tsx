'use client'

import { useState } from 'react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Pencil, Trash2, CalendarCheck, CheckCircle } from 'lucide-react'
import { format, parseISO, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns'
import { pt } from 'date-fns/locale'
import type { Subject, Event, EventFormData } from '@/lib/types'
import { EVENT_TYPES, PRIORITY_LEVELS, EVENT_STATUS } from '@/lib/types'

const initialFormData: EventFormData = {
  subject_id: null,
  title: '',
  description: '',
  event_type: 'teste',
  due_date: '',
  priority: 'medium',
  status: 'pending',
  reminder_at: null,
}

function getRelativeDate(dateStr: string) {
  const date = parseISO(dateStr)
  if (isPast(date) && !isToday(date)) return { text: 'Atrasado', variant: 'destructive' as const }
  if (isToday(date)) return { text: 'Hoje', variant: 'default' as const }
  if (isTomorrow(date)) return { text: 'Amanha', variant: 'secondary' as const }
  const days = differenceInDays(date, new Date())
  if (days <= 7) return { text: `Em ${days} dias`, variant: 'outline' as const }
  return { text: format(date, "d MMM", { locale: pt }), variant: 'outline' as const }
}

function getPriorityBadge(priority: string) {
  const config = PRIORITY_LEVELS.find((p) => p.value === priority)
  return config || PRIORITY_LEVELS[1]
}

export default function EventosPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState<EventFormData>(initialFormData)
  const [activeTab, setActiveTab] = useState('pending')
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data } = await supabase.from('subjects').select('*').order('name')
      return (data || []) as Subject[]
    },
  })

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data } = await supabase
        .from('events')
        .select('*, subject:subjects(*)')
        .order('due_date')
      return (data || []) as Event[]
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Nao autenticado')

      const { error } = await supabase.from('events').insert({
        ...data,
        user_id: user.id,
        subject_id: data.subject_id || null,
        description: data.description || null,
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      setIsOpen(false)
      setFormData(initialFormData)
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EventFormData> }) => {
      const { error } = await supabase.from('events').update(data).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      setIsOpen(false)
      setEditingEvent(null)
      setFormData(initialFormData)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('events').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      subject_id: event.subject_id,
      title: event.title,
      description: event.description || '',
      event_type: event.event_type as 'teste' | 'trabalho' | 'entrega' | 'apresentacao' | 'outro',
      due_date: event.due_date.slice(0, 16),
      priority: event.priority as 'low' | 'medium' | 'high',
      status: event.status as 'pending' | 'in_progress' | 'completed',
      reminder_at: event.reminder_at,
    })
    setIsOpen(true)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setEditingEvent(null)
      setFormData(initialFormData)
    }
  }

  const markAsCompleted = (event: Event) => {
    updateMutation.mutate({ id: event.id, data: { status: 'completed' } })
  }

  const pendingEvents = events.filter((e) => e.status !== 'completed')
  const completedEvents = events.filter((e) => e.status === 'completed')

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
          <h1 className="text-2xl font-bold">Eventos</h1>
          <p className="text-muted-foreground">
            Testes, trabalhos, entregas e apresentacoes
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Editar Evento' : 'Novo Evento'}
              </DialogTitle>
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
                  placeholder="Ex: Teste de Calculo I"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo *</Label>
                  <Select
                    value={formData.event_type}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        event_type: value as 'teste' | 'trabalho' | 'entrega' | 'apresentacao' | 'outro',
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        priority: value as 'low' | 'medium' | 'high',
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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

              <div className="space-y-2">
                <Label htmlFor="due_date">Data e hora *</Label>
                <Input
                  id="due_date"
                  type="datetime-local"
                  value={formData.due_date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, due_date: e.target.value }))
                  }
                  required
                />
              </div>

              {editingEvent && (
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: value as 'pending' | 'in_progress' | 'completed',
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_STATUS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Descricao</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Notas adicionais..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'A guardar...'
                    : editingEvent
                      ? 'Guardar alteracoes'
                      : 'Criar evento'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            Pendentes ({pendingEvents.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Concluidos ({completedEvents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingEvents.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <CalendarCheck className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Sem eventos pendentes</h3>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Adiciona testes, trabalhos e entregas para acompanhar os teus prazos.
                </p>
                <Button className="mt-6" onClick={() => setIsOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Adicionar evento
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingEvents.map((event) => {
                const dateInfo = getRelativeDate(event.due_date)
                const priorityInfo = getPriorityBadge(event.priority)

                return (
                  <Card key={event.id}>
                    <CardContent className="flex items-center gap-4 p-4">
                      <button
                        onClick={() => markAsCompleted(event)}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground/30 hover:border-primary hover:bg-primary/10"
                        title="Marcar como concluido"
                      >
                        <CheckCircle className="h-4 w-4 text-transparent hover:text-primary" />
                      </button>
                      <div
                        className="h-10 w-1 shrink-0 rounded-full"
                        style={{ backgroundColor: event.subject?.color || '#888' }}
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">{event.title}</span>
                          <Badge variant="secondary" className="text-xs">
                            {EVENT_TYPES.find((t) => t.value === event.event_type)?.label}
                          </Badge>
                          <Badge variant={dateInfo.variant} className="text-xs">
                            {dateInfo.text}
                          </Badge>
                          <span className={`text-xs ${priorityInfo.color}`}>
                            {priorityInfo.label}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {format(parseISO(event.due_date), "EEEE, d 'de' MMMM 'as' HH:mm", {
                            locale: pt,
                          })}
                          {event.subject && ` • ${event.subject.name}`}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(event)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => {
                            if (confirm('Apagar este evento?')) {
                              deleteMutation.mutate(event.id)
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedEvents.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Sem eventos concluidos</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Os eventos que marcares como concluidos aparecem aqui.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {completedEvents.map((event) => (
                <Card key={event.id} className="opacity-70">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div
                      className="h-10 w-1 shrink-0 rounded-full"
                      style={{ backgroundColor: event.subject?.color || '#888' }}
                    />
                    <div className="flex-1">
                      <span className="font-medium line-through">{event.title}</span>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(event.due_date), "d 'de' MMMM", { locale: pt })}
                        {event.subject && ` • ${event.subject.name}`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => {
                        if (confirm('Apagar este evento?')) {
                          deleteMutation.mutate(event.id)
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
