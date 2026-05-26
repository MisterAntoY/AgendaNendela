'use client'

import { createClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GraduationCap } from 'lucide-react'
import type { Subject, Grade } from '@/lib/types'

function calculateAverage(grades: Grade[]) {
  if (grades.length === 0) return null
  const weightedSum = grades.reduce((sum, g) => sum + (g.value / g.max_value) * 20 * g.weight, 0)
  const totalWeight = grades.reduce((sum, g) => sum + g.weight, 0)
  return totalWeight > 0 ? (weightedSum / totalWeight).toFixed(1) : null
}

function getGradeColor(value: number, maxValue: number) {
  const percentage = (value / maxValue) * 100
  if (percentage >= 70) return 'text-green-600 bg-green-50'
  if (percentage >= 50) return 'text-yellow-600 bg-yellow-50'
  return 'text-red-600 bg-red-50'
}

export default function NotasPage() {
  const supabase = createClient()

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data } = await supabase.from('subjects').select('*').order('name')
      return (data || []) as Subject[]
    },
  })

  const { data: grades = [], isLoading } = useQuery({
    queryKey: ['grades'],
    queryFn: async () => {
      const { data } = await supabase
        .from('grades')
        .select('*, subject:subjects(*)')
        .order('created_at', { ascending: false })
      return (data || []) as Grade[]
    },
  })

  // Group grades by subject
  const gradesBySubject = subjects.map((subject) => ({
    subject,
    grades: grades.filter((g) => g.subject_id === subject.id),
  }))

  const overallAverage = calculateAverage(grades)

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
          <h1 className="text-2xl font-bold">Notas</h1>
          <p className="text-muted-foreground">
            Acompanha as tuas notas e medias
          </p>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-3xl font-bold">{overallAverage || '-'}</p>
              <p className="text-sm text-muted-foreground">Media Geral</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <span className="text-lg font-bold">{grades.length}</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Avaliacoes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <span className="text-lg font-bold">
                {gradesBySubject.filter((s) => s.grades.length > 0).length}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Disciplinas com notas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grades by Subject */}
      {subjects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <GraduationCap className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Adiciona disciplinas primeiro</h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Para registares notas, precisas de ter disciplinas criadas.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Notas por Disciplina</h2>
          <p className="text-sm text-muted-foreground">
            As notas sao registadas automaticamente quando marcas um evento como concluido. 
            Podes tambem adicionar notas manualmente na pagina de eventos.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            {gradesBySubject.map(({ subject, grades: subjectGrades }) => {
              const average = calculateAverage(subjectGrades)
              
              return (
                <Card key={subject.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-4 w-4 rounded"
                          style={{ backgroundColor: subject.color }}
                        />
                        <CardTitle className="text-base">{subject.name}</CardTitle>
                      </div>
                      {average && (
                        <Badge 
                          variant="secondary"
                          className={getGradeColor(parseFloat(average), 20)}
                        >
                          Media: {average}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {subjectGrades.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Sem notas registadas
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {subjectGrades.map((grade) => (
                          <div
                            key={grade.id}
                            className="flex items-center justify-between rounded-lg bg-muted/50 p-2"
                          >
                            <span className="text-sm">{grade.notes || 'Avaliacao'}</span>
                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded px-2 py-0.5 text-sm font-medium ${getGradeColor(grade.value, grade.max_value)}`}
                              >
                                {grade.value}/{grade.max_value}
                              </span>
                              {grade.weight !== 1 && (
                                <span className="text-xs text-muted-foreground">
                                  ({(grade.weight * 100).toFixed(0)}%)
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
