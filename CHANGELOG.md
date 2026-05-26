# Changelog — Revisão Sénior

Data: 2026-05-26

---

## Problemas identificados e corrigidos

### 1. Fonte Geist nunca aplicada — `app/layout.tsx`

**Problema:** As fontes `Geist` e `Geist_Mono` eram instanciadas com prefixo `_` (convenção de "não usada") e sem a opção `variable`. O CSS em `globals.css` declara `--font-sans: 'Geist'` no `@theme inline`, mas a variável CSS nunca era injetada no DOM pelo Next.js. O resultado era que toda a aplicação usava a fonte `sans-serif` padrão do browser em vez de Geist.

**Correção:** Adicionada a opção `variable` a ambas as fontes e aplicadas as classes `.variable` ao elemento `<html>`.

```diff
- const _geist = Geist({ subsets: ["latin"] });
- const _geistMono = Geist_Mono({ subsets: ["latin"] });
+ const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })
+ const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

- <html lang="pt">
+ <html lang="pt" className={`${geist.variable} ${geistMono.variable}`}>
```

**Ficheiro:** [app/layout.tsx](app/layout.tsx)

---

### 2. Navegação com `<a>` nativo em vez de `<Link>` — `app/app/horario/page.tsx`

**Problema:** O botão "Ir para disciplinas" usava `<a href="/app/disciplinas">`, que causa um reload completo da página, perdendo todo o estado React e ignorando o router do Next.js.

**Correção:** Substituído por `<Link>` do Next.js e adicionado o import correspondente.

```diff
+ import Link from 'next/link'
...
- <a href="/app/disciplinas">Ir para disciplinas</a>
+ <Link href="/app/disciplinas">Ir para disciplinas</Link>
```

**Ficheiro:** [app/app/horario/page.tsx](app/app/horario/page.tsx)

---

### 3. Link ativo no sidebar falha em sub-rotas — `components/app-sidebar.tsx`

**Problema:** A condição `pathname === item.href` usa igualdade exata. Ao navegar para `/app/disciplinas/nova` (ou qualquer sub-rota), nenhum item do menu ficava destacado como ativo.

**Correção:** Usar `startsWith` para rotas com sub-páginas, mantendo match exato apenas para `/app` (Dashboard), para evitar que o Dashboard ficasse sempre ativo.

```diff
- const isActive = pathname === item.href
+ const isActive =
+   item.href === '/app'
+     ? pathname === '/app'
+     : pathname.startsWith(item.href)
```

**Ficheiro:** [components/app-sidebar.tsx](components/app-sidebar.tsx)

---

### 4. Formulário do perfil não sincronizado com dados async — `app/app/perfil/page.tsx`

**Problema:** O estado `formData` era inicializado uma única vez no mount com `profile?.full_name || null`. Como `profile` é carregado de forma assíncrona pelo `AuthProvider`, na maioria das visitas o componente montava com `profile = null`, deixando todos os campos do formulário vazios mesmo depois dos dados chegarem.

**Correção:** Adicionado `useEffect` que sincroniza `formData` sempre que `profile` muda (e o utilizador não está a editar).

```diff
+ useEffect(() => {
+   if (profile && !isEditing) {
+     setFormData({
+       full_name: profile.full_name,
+       school: profile.school,
+       course: profile.course,
+       year: profile.year,
+       avatar_url: profile.avatar_url,
+     })
+   }
+ }, [profile, isEditing])
```

**Ficheiro:** [app/app/perfil/page.tsx](app/app/perfil/page.tsx)

---

### 5. `StudyTimer` recriava intervalo a cada segundo — `app/app/estudo/page.tsx`

**Problema:** O `useEffect` do timer tinha `[isRunning, timeLeft, onComplete]` como dependências. Como `timeLeft` diminui 1 unidade por segundo, o efeito re-executava a cada segundo: limpava o intervalo anterior e criava um novo. Isto é thrashing desnecessário e pode causar saltos de tempo em condições de carga.

**Correção:** Removido `timeLeft` das dependências. O intervalo só precisa de ser criado/destruído quando `isRunning` muda. O valor de `timeLeft` é lido dentro do `setTimeLeft` callback via `prev`, que sempre tem o valor atual sem precisar de estar na dependency array.

```diff
- }, [isRunning, timeLeft, onComplete])
+ }, [isRunning, onComplete])
```

**Ficheiro:** [app/app/estudo/page.tsx](app/app/estudo/page.tsx)

---

### 6. Imports não utilizados em notas — `app/app/notas/page.tsx`

**Problema:** `useMutation` e `useQueryClient` eram importados mas nunca usados na página. A página de notas é só de leitura, sem mutations. A variável `queryClient` estava declarada mas nunca referenciada, o que além de ruído de código poderia causar avisos do TypeScript/ESLint.

**Correção:** Removidos os imports e a variável não usada.

```diff
- import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
+ import { useQuery } from '@tanstack/react-query'
...
- const queryClient = useQueryClient()
```

**Ficheiro:** [app/app/notas/page.tsx](app/app/notas/page.tsx)

---

### 7. `fetchProfile` ignorava erros de base de dados — `components/providers/auth-provider.tsx`

**Problema:** A função `fetchProfile` desestruturava apenas `{ data }` da resposta do Supabase e chamava sempre `setProfile(data)`. Em caso de erro (ex: utilizador sem perfil na tabela, timeout de rede, política RLS), `data` seria `null` e o perfil seria silenciosamente apagado do estado, sem qualquer indicação do erro.

**Correção:** Desestruturado também `error` e `setProfile` só é chamado quando não há erro.

```diff
- const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
- setProfile(data)
+ const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
+ if (!error) setProfile(data)
```

**Ficheiro:** [components/providers/auth-provider.tsx](components/providers/auth-provider.tsx)

---

## Resumo

| # | Ficheiro | Tipo | Impacto |
|---|----------|------|---------|
| 1 | `app/layout.tsx` | Bug visual | Fonte Geist nunca era exibida |
| 2 | `app/app/horario/page.tsx` | Bug de navegação | Full-page reload desnecessário |
| 3 | `components/app-sidebar.tsx` | Bug de UX | Menu sem estado ativo em sub-rotas |
| 4 | `app/app/perfil/page.tsx` | Bug de estado | Formulário sempre vazio no primeiro carregamento |
| 5 | `app/app/estudo/page.tsx` | Performance | Intervalo recriado desnecessariamente a cada segundo |
| 6 | `app/app/notas/page.tsx` | Qualidade de código | Imports e variáveis mortas |
| 7 | `components/providers/auth-provider.tsx` | Robustez | Erros de DB ignorados silenciosamente |
