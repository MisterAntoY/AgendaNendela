'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Mail, School, BookOpen, Calendar, CheckCircle } from 'lucide-react'
import type { ProfileFormData } from '@/lib/types'

export default function PerfilPage() {
  const { user, profile, isLoading, refreshProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: profile?.full_name || null,
    school: profile?.school || null,
    course: profile?.course || null,
    year: profile?.year || null,
    avatar_url: profile?.avatar_url || null,
  })
  const [successMessage, setSuccessMessage] = useState('')
  const supabase = createClient()

  const updateMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id)
      if (error) throw error
    },
    onSuccess: async () => {
      await refreshProfile()
      setIsEditing(false)
      setSuccessMessage('Perfil atualizado com sucesso!')
      setTimeout(() => setSuccessMessage(''), 3000)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(formData)
  }

  const getInitials = (name: string | null) => {
    if (!name) return user?.email?.charAt(0).toUpperCase() || 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
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
      <div>
        <h1 className="text-2xl font-bold">Perfil</h1>
        <p className="text-muted-foreground">
          Gere as tuas informacoes pessoais
        </p>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-700">
          <CheckCircle className="h-5 w-5" />
          {successMessage}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center pt-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-2xl">
                {getInitials(profile?.full_name)}
              </AvatarFallback>
            </Avatar>
            <h2 className="mt-4 text-xl font-semibold">
              {profile?.full_name || 'Utilizador'}
            </h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            {profile?.school && (
              <p className="mt-2 text-sm text-muted-foreground">
                {profile.school}
              </p>
            )}
            {profile?.course && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{profile.course}</span>
                {profile.year && <span className="text-muted-foreground">• {profile.year}o ano</span>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informacoes do Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nome completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="full_name"
                      value={formData.full_name || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, full_name: e.target.value || null }))
                      }
                      placeholder="O teu nome"
                      className="pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      value={user?.email || ''}
                      className="pl-10"
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school">Escola / Universidade</Label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="school"
                      value={formData.school || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, school: e.target.value || null }))
                      }
                      placeholder="Ex: Universidade de Luanda"
                      className="pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Curso</Label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="course"
                      value={formData.course || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, course: e.target.value || null }))
                      }
                      placeholder="Ex: Engenharia Informatica"
                      className="pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Ano</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="year"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.year || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          year: e.target.value ? parseInt(e.target.value) : null,
                        }))
                      }
                      placeholder="Ex: 2"
                      className="pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        setFormData({
                          full_name: profile?.full_name || null,
                          school: profile?.school || null,
                          course: profile?.course || null,
                          year: profile?.year || null,
                          avatar_url: profile?.avatar_url || null,
                        })
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={updateMutation.isPending}>
                      {updateMutation.isPending ? 'A guardar...' : 'Guardar alteracoes'}
                    </Button>
                  </>
                ) : (
                  <Button type="button" onClick={() => setIsEditing(true)}>
                    Editar perfil
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informacoes da Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="font-medium">Conta criada</p>
            <p className="text-sm text-muted-foreground">
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString('pt-PT', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'Data desconhecida'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
