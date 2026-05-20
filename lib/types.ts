// Database types for Academic Copilot

export interface Profile {
  id: string
  full_name: string | null
  school: string | null
  course: string | null
  year: number | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Subject {
  id: string
  user_id: string
  name: string
  color: string
  teacher: string | null
  credits: number | null
  created_at: string
}

export interface Class {
  id: string
  user_id: string
  subject_id: string
  day_of_week: number // 0 = Domingo, 1 = Segunda, etc.
  start_time: string
  end_time: string
  room: string | null
  type: 'teorica' | 'pratica' | 'laboratorio'
  created_at: string
  // Joined data
  subject?: Subject
}

export interface Event {
  id: string
  user_id: string
  subject_id: string | null
  title: string
  description: string | null
  event_type: 'teste' | 'trabalho' | 'entrega' | 'apresentacao' | 'outro'
  due_date: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed'
  reminder_at: string | null
  created_at: string
  updated_at: string
  // Joined data
  subject?: Subject
}

export interface StudySession {
  id: string
  user_id: string
  subject_id: string | null
  event_id: string | null
  title: string
  scheduled_at: string
  duration_minutes: number
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  notes: string | null
  created_at: string
  // Joined data
  subject?: Subject
  event?: Event
}

export interface Grade {
  id: string
  user_id: string
  subject_id: string
  event_id: string | null
  value: number
  max_value: number
  weight: number
  notes: string | null
  created_at: string
  // Joined data
  subject?: Subject
  event?: Event
}

// Form types for creating/updating
export type SubjectFormData = Omit<Subject, 'id' | 'user_id' | 'created_at'>
export type ClassFormData = Omit<Class, 'id' | 'user_id' | 'created_at' | 'subject'>
export type EventFormData = Omit<Event, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'subject'>
export type StudySessionFormData = Omit<StudySession, 'id' | 'user_id' | 'created_at' | 'subject' | 'event'>
export type GradeFormData = Omit<Grade, 'id' | 'user_id' | 'created_at' | 'subject' | 'event'>
export type ProfileFormData = Omit<Profile, 'id' | 'created_at' | 'updated_at'>

// Constants
export const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terca-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sabado' },
]

export const CLASS_TYPES = [
  { value: 'teorica', label: 'Teorica' },
  { value: 'pratica', label: 'Pratica' },
  { value: 'laboratorio', label: 'Laboratorio' },
]

export const EVENT_TYPES = [
  { value: 'teste', label: 'Teste' },
  { value: 'trabalho', label: 'Trabalho' },
  { value: 'entrega', label: 'Entrega' },
  { value: 'apresentacao', label: 'Apresentacao' },
  { value: 'outro', label: 'Outro' },
]

export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Baixa', color: 'text-green-600' },
  { value: 'medium', label: 'Media', color: 'text-yellow-600' },
  { value: 'high', label: 'Alta', color: 'text-red-600' },
]

export const EVENT_STATUS = [
  { value: 'pending', label: 'Pendente' },
  { value: 'in_progress', label: 'Em progresso' },
  { value: 'completed', label: 'Concluido' },
]

export const SESSION_STATUS = [
  { value: 'scheduled', label: 'Agendada' },
  { value: 'in_progress', label: 'Em progresso' },
  { value: 'completed', label: 'Concluida' },
  { value: 'cancelled', label: 'Cancelada' },
]

// Subject colors palette
export const SUBJECT_COLORS = [
  { value: '#3B82F6', label: 'Azul' },
  { value: '#10B981', label: 'Verde' },
  { value: '#F59E0B', label: 'Amarelo' },
  { value: '#EF4444', label: 'Vermelho' },
  { value: '#8B5CF6', label: 'Roxo' },
  { value: '#EC4899', label: 'Rosa' },
  { value: '#06B6D4', label: 'Ciano' },
  { value: '#F97316', label: 'Laranja' },
]
