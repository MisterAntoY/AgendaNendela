import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Disciplinas Organizadas',
    description: 'Regista todas as tuas cadeiras com cores, professores e creditos num so lugar.',
  },
  {
    icon: Calendar,
    title: 'Horario Visual',
    description: 'Ve o teu horario semanal de forma clara e nunca mais percas uma aula.',
  },
  {
    icon: Clock,
    title: 'Sessoes de Estudo',
    description: 'Planeia e acompanha as tuas sessoes de estudo com timer integrado.',
  },
  {
    icon: GraduationCap,
    title: 'Controlo de Notas',
    description: 'Acompanha as tuas notas e calcula medias automaticamente.',
  },
]

const benefits = [
  'Nunca mais esquecas um teste ou entrega',
  'Organiza o teu tempo de estudo',
  'Acompanha o teu progresso academico',
  'Acede de qualquer dispositivo',
]

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="font-semibold">Copiloto Academico</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Comecar gratis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-16 text-center md:py-24">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            O teu parceiro de estudo para o{' '}
            <span className="text-primary">sucesso academico</span>
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Organiza as tuas disciplinas, aulas, testes e sessoes de estudo num so lugar. 
            Toma controlo da tua vida academica e alcanca os teus objetivos.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">
                Comecar agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">Ja tenho conta</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
              Tudo o que precisas para estudar melhor
            </h2>
            <p className="mt-4 text-muted-foreground">
              Ferramentas simples e eficazes para organizares a tua vida academica
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="border-0 bg-background shadow-sm">
                  <CardContent className="flex gap-4 p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Disciplina e organizacao para melhores resultados
              </h2>
              <p className="mt-4 text-muted-foreground">
                O Copiloto Academico foi criado para estudantes que querem ter controlo 
                total sobre os seus estudos e alcançar melhores resultados.
              </p>
              <ul className="mt-8 space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 shrink-0 text-accent" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8" size="lg" asChild>
                <Link href="/auth/sign-up">
                  Criar conta gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 p-8">
                <div className="flex h-full flex-col items-center justify-center gap-4 rounded-xl bg-background p-6 shadow-lg">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-center text-lg font-medium">
                    Mais de 1000 estudantes ja usam o Copiloto Academico
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-primary py-16 text-primary-foreground md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Pronto para comecar?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Junta-te a milhares de estudantes que ja estao a organizar melhor os seus estudos.
          </p>
          <Button size="lg" variant="secondary" className="mt-8" asChild>
            <Link href="/auth/sign-up">
              Criar conta gratis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
              <BookOpen className="h-3 w-3" />
            </div>
            <span>Copiloto Academico</span>
          </div>
          <p>2024 Copiloto Academico. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
