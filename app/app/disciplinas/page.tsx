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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react'
import type { Subject, SubjectFormData } from '@/lib/types'
import { SUBJECT_COLORS } from '@/lib/types'

const initialFormData: SubjectFormData = {
  name: '',
  color: SUBJECT_COLORS[0].value,
  teacher: '',
  credits: null,
}

export default function DisciplinasPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [formData, setFormData] = useState<SubjectFormData>(initialFormData)
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { data: subjects = [], isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data } = await supabase.from('subjects').select('*').order('name')
      return (data || []) as Subject[]
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: SubjectFormData) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Nao autenticado')
      
      const { error } = await supabase.from('subjects').insert({
        ...data,
        user_id: user.id,
        credits: data.credits || null,
        teacher: data.teacher || null,
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      setIsOpen(false)
      setFormData(initialFormData)
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SubjectFormData }) => {
      const { error } = await supabase
        .from('subjects')
        .update({
          ...data,
          credits: data.credits || null,
          teacher: data.teacher || null,
        })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      setIsOpen(false)
      setEditingSubject(null)
      setFormData(initialFormData)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('subjects').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingSubject) {
      updateMutation.mutate({ id: editingSubject.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject)
    setFormData({
      name: subject.name,
      color: subject.color,
      teacher: subject.teacher || '',
      credits: subject.credits,
    })
    setIsOpen(true)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setEditingSubject(null)
      setFormData(initialFormData)
    }
  }

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
          <h1 className="text-2xl font-bold">Disciplinas</h1>
          <p className="text-muted-foreground">
            Gere as tuas cadeiras e disciplinas
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nova Disciplina
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSubject ? 'Editar Disciplina' : 'Nova Disciplina'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da disciplina *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Ex: Calculo I"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Cor</Label>
                <div className="flex flex-wrap gap-2">
                  {SUBJECT_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, color: color.value }))
                      }
                      className={`h-8 w-8 rounded-full border-2 transition-all ${
                        formData.color === color.value
                          ? 'scale-110 border-foreground'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacher">Professor(a)</Label>
                <Input
                  id="teacher"
                  value={formData.teacher || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, teacher: e.target.value }))
                  }
                  placeholder="Ex: Prof. Joao Silva"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credits">Creditos</Label>
                <Input
                  id="credits"
                  type="number"
                  min="0"
                  value={formData.credits || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      credits: e.target.value ? parseInt(e.target.value) : null,
                    }))
                  }
                  placeholder="Ex: 6"
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
                    : editingSubject
                      ? 'Guardar alteracoes'
                      : 'Criar disciplina'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {subjects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Sem disciplinas</h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Comeca por adicionar as tuas disciplinas para poderes organizar o teu horario e eventos.
            </p>
            <Button className="mt-6" onClick={() => setIsOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar disciplina
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <Card key={subject.id}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg"
                    style={{ backgroundColor: subject.color }}
                  />
                  <CardTitle className="text-lg">{subject.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {subject.teacher && (
                    <p>
                      <span className="font-medium text-foreground">Professor:</span>{' '}
                      {subject.teacher}
                    </p>
                  )}
                  {subject.credits && (
                    <p>
                      <span className="font-medium text-foreground">Creditos:</span>{' '}
                      {subject.credits}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(subject)}
                  >
                    <Pencil className="mr-1 h-3 w-3" /> Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => {
                      if (confirm('Tens a certeza que queres apagar esta disciplina?')) {
                        deleteMutation.mutate(subject.id)
                      }
                    }}
                  >
                    <Trash2 className="mr-1 h-3 w-3" /> Apagar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
