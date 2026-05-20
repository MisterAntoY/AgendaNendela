'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format, isToday, isTomorrow, parseISO, differenceInDays } from 'date-fns'
import { pt } from 'date-fns/locale'
import {
  BookOpen,
  CalendarCheck,
  Clock,
  GraduationCap,
  Plus,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'
import type { Subject, Event, StudySession, Class } from '@/lib/types'

function formatRelativeDate(dateStr: string) {
  const date = parseISO(dateStr)
  if (isToday(date)) return 'Hoje'
  if (isTomorrow(date)) return 'Amanha'
  const days = differenceInDays(date, new Date())
  if (days < 7 && days > 0) return `Em ${days} dias`
  return format(date, "d 'de' MMMM", { locale: pt })
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-50'
    case 'medium':
      return 'text-yellow-600 bg-yellow-50'
    default:
      return 'text-green-600 bg-green-50'
  }
}

export default function DashboardPage() {
  const { profile, isLoading: authLoading } = useAuth()
  const supabase = createClient()

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data } = await supabase.from('subjects').select('*').order('name')
      return (data || []) as Subject[]
    },
  })

  const { data: upcomingEvents = [] } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const { data } = await supabase
        .from('events')
        .select('*, subject:subjects(*)')
        .gte('due_date', new Date().toISOString())
        .neq('status', 'completed')
        .order('due_date')
        .limit(5)
      return (data || []) as Event[]
    },
  })

  const { data: todayClasses = [] } = useQuery({
    queryKey: ['today-classes'],
    queryFn: async () => {
      const today = new Date().getDay()
      const { data } = await supabase
        .from('classes')
        .select('*, subject:subjects(*)')
        .eq('day_of_week', today)
        .order('start_time')
      return (data || []) as Class[]
    },
  })

  const { data: todaySessions = [] } = useQuery({
    queryKey: ['today-sessions'],
    queryFn: async () => {
      const today = new Date()
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()
      const { data } = await supabase
        .from('study_sessions')
        .select('*, subject:subjects(*)')
        .gte('scheduled_at', startOfDay)
        .lte('scheduled_at', endOfDay)
        .order('scheduled_at')
      return (data || []) as StudySession[]
    },
  })

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  if (authLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          {greeting()}, {profile?.full_name?.split(' ')[0] || 'Estudante'}!
        </h1>
        <p className="text-muted-foreground">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: pt })}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{subjects.length}</p>
              <p className="text-sm text-muted-foreground">Disciplinas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{upcomingEvents.length}</p>
              <p className="text-sm text-muted-foreground">Eventos proximos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todayClasses.length}</p>
              <p className="text-sm text-muted-foreground">Aulas hoje</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todaySessions.length}</p>
              <p className="text-sm text-muted-foreground">Sessoes hoje</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Classes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Aulas de Hoje</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/horario">
                Ver horario <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {todayClasses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Sem aulas hoje</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayClasses.map((cls) => (
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
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Proximos Eventos</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/eventos">
                Ver todos <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CalendarCheck className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Sem eventos proximos</p>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link href="/app/eventos">
                    <Plus className="mr-1 h-4 w-4" /> Adicionar evento
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${getPriorityColor(event.priority)}`}
                    >
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatRelativeDate(event.due_date)}
                        {event.subject && ` • ${event.subject.name}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Study Sessions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Sessoes de Estudo de Hoje</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/estudo">
                Ver todas <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {todaySessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Nenhuma sessao de estudo agendada para hoje
                </p>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link href="/app/estudo">
                    <Plus className="mr-1 h-4 w-4" /> Agendar sessao
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {todaySessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div
                      className="h-10 w-1 rounded-full"
                      style={{ backgroundColor: session.subject?.color || '#666' }}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{session.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(session.scheduled_at), 'HH:mm')} •{' '}
                        {session.duration_minutes} min
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Empty state for new users */}
      {subjects.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Bem-vindo ao Copiloto Academico!</h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Comeca por adicionar as tuas disciplinas para organizar melhor os teus estudos.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/app/disciplinas">
                <Plus className="mr-2 h-4 w-4" /> Adicionar primeira disciplina
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
