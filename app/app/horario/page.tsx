'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import Link from 'next/link'
import { Plus, Trash2, Calendar } from 'lucide-react'
import type { Subject, Class, ClassFormData } from '@/lib/types'
import { DAYS_OF_WEEK, CLASS_TYPES } from '@/lib/types'

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7) // 7h to 20h

const initialFormData: ClassFormData = {
  subject_id: '',
  day_of_week: 1,
  start_time: '08:00',
  end_time: '10:00',
  room: '',
  type: 'teorica',
}

export default function HorarioPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<ClassFormData>(initialFormData)
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data } = await supabase.from('subjects').select('*').order('name')
      return (data || []) as Subject[]
    },
  })

  const { data: classes = [], isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data } = await supabase
        .from('classes')
        .select('*, subject:subjects(*)')
        .order('start_time')
      return (data || []) as Class[]
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: ClassFormData) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Nao autenticado')

      const { error } = await supabase.from('classes').insert({
        ...data,
        user_id: user.id,
        room: data.room || null,
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
      setIsOpen(false)
      setFormData(initialFormData)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('classes').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  const getClassesForDayAndHour = (day: number, hour: number) => {
    return classes.filter((cls) => {
      const startHour = parseInt(cls.start_time.split(':')[0])
      const endHour = parseInt(cls.end_time.split(':')[0])
      return cls.day_of_week === day && hour >= startHour && hour < endHour
    })
  }

  const isClassStart = (cls: Class, hour: number) => {
    const startHour = parseInt(cls.start_time.split(':')[0])
    return startHour === hour
  }

  const getClassDuration = (cls: Class) => {
    const startHour = parseInt(cls.start_time.split(':')[0])
    const endHour = parseInt(cls.end_time.split(':')[0])
    return endHour - startHour
  }

  // Dias da semana uteis (Segunda a Sexta)
  const weekDays = DAYS_OF_WEEK.filter((d) => d.value >= 1 && d.value <= 5)

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
          <h1 className="text-2xl font-bold">Horario Semanal</h1>
          <p className="text-muted-foreground">
            Organiza as tuas aulas da semana
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button disabled={subjects.length === 0}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Aula
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Aula</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Disciplina *</Label>
                <Select
                  value={formData.subject_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, subject_id: value }))
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleciona uma disciplina" />
                  </SelectTrigger>
                  <SelectContent>
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
                <Label>Dia da semana *</Label>
                <Select
                  value={formData.day_of_week.toString()}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, day_of_week: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_time">Hora inicio *</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, start_time: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_time">Hora fim *</Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, end_time: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipo de aula</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, type: value as 'teorica' | 'pratica' | 'laboratorio' }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASS_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="room">Sala</Label>
                <Input
                  id="room"
                  value={formData.room || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, room: e.target.value }))
                  }
                  placeholder="Ex: Sala 201"
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
                  {createMutation.isPending ? 'A adicionar...' : 'Adicionar aula'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {subjects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Adiciona disciplinas primeiro</h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Para criares o teu horario, precisas de adicionar as tuas disciplinas.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/app/disciplinas">Ir para disciplinas</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr>
                  <th className="w-16 border-b border-r bg-muted/50 p-2 text-xs font-medium text-muted-foreground">
                    Hora
                  </th>
                  {weekDays.map((day) => (
                    <th
                      key={day.value}
                      className="border-b bg-muted/50 p-2 text-sm font-medium"
                    >
                      {day.label.split('-')[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HOURS.map((hour) => (
                  <tr key={hour}>
                    <td className="border-r bg-muted/30 p-2 text-center text-xs text-muted-foreground">
                      {hour}:00
                    </td>
                    {weekDays.map((day) => {
                      const dayClasses = getClassesForDayAndHour(day.value, hour)
                      const startingClass = dayClasses.find((cls) =>
                        isClassStart(cls, hour)
                      )

                      if (dayClasses.length > 0 && !startingClass) {
                        return null // Cell is part of a spanning class
                      }

                      if (startingClass) {
                        const duration = getClassDuration(startingClass)
                        return (
                          <td
                            key={`${day.value}-${hour}`}
                            rowSpan={duration}
                            className="relative border p-1"
                          >
                            <div
                              className="group flex h-full min-h-[60px] flex-col rounded-md p-2 text-white"
                              style={{
                                backgroundColor: startingClass.subject?.color || '#666',
                              }}
                            >
                              <p className="text-xs font-semibold leading-tight">
                                {startingClass.subject?.name}
                              </p>
                              <p className="mt-1 text-xs opacity-90">
                                {startingClass.start_time.slice(0, 5)} -{' '}
                                {startingClass.end_time.slice(0, 5)}
                              </p>
                              {startingClass.room && (
                                <p className="text-xs opacity-80">{startingClass.room}</p>
                              )}
                              <button
                                onClick={() => {
                                  if (confirm('Apagar esta aula?')) {
                                    deleteMutation.mutate(startingClass.id)
                                  }
                                }}
                                className="absolute right-1 top-1 hidden rounded bg-black/20 p-1 text-white hover:bg-black/40 group-hover:block"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                        )
                      }

                      return (
                        <td
                          key={`${day.value}-${hour}`}
                          className="border p-1"
                        >
                          <div className="min-h-[60px]" />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Lista de aulas para mobile */}
      <div className="block md:hidden">
        <h2 className="mb-4 text-lg font-semibold">Lista de Aulas</h2>
        {classes.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem aulas registadas</p>
        ) : (
          <div className="space-y-2">
            {DAYS_OF_WEEK.filter((d) => d.value >= 1 && d.value <= 5).map((day) => {
              const dayClasses = classes.filter((cls) => cls.day_of_week === day.value)
              if (dayClasses.length === 0) return null

              return (
                <div key={day.value}>
                  <h3 className="mb-2 font-medium">{day.label}</h3>
                  <div className="space-y-2">
                    {dayClasses.map((cls) => (
                      <div
                        key={cls.id}
                        className="flex items-center gap-3 rounded-lg border p-3"
                      >
                        <div
                          className="h-10 w-1 rounded-full"
                          style={{ backgroundColor: cls.subject?.color || '#666' }}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{cls.subject?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {cls.start_time.slice(0, 5)} - {cls.end_time.slice(0, 5)}
                            {cls.room && ` • ${cls.room}`}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => {
                            if (confirm('Apagar esta aula?')) {
                              deleteMutation.mutate(cls.id)
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
