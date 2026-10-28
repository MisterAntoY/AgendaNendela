# Graph Report - AgendaNendela  (2026-10-28)

## Corpus Check
- 91 files · ~26,516 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .css 2, (none) 1)

## Summary
- 692 nodes · 1753 edges · 63 communities (33 shown, 30 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1ed379e5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- eventos/page.tsx
- hooks/use-toast.ts
- cn
- sidebar.tsx
- app-sidebar.tsx
- alert-dialog.tsx
- item.tsx
- dependencies
- package.json
- compilerOptions
- components.json
- menubar.tsx
- devDependencies
- context-menu.tsx
- carousel.tsx
- react
- form.tsx
- utils.ts
- sheet.tsx
- middleware.ts
- Problemas identificados e corrigidos
- chart.tsx
- command.tsx
- drawer.tsx
- field.tsx
- input-group.tsx
- navigation-menu.tsx
- class-variance-authority
- empty.tsx
- app/layout.tsx
- collapsible.tsx
- next-themes
- alert.tsx
- popover.tsx
- scripts
- @radix-ui/react-aspect-ratio
- hover-card.tsx
- scroll-area.tsx
- next.config.mjs
- postcss.config.mjs
- clsx
- @hookform/resolvers@^3.9.1
- input-otp
- @radix-ui/react-alert-dialog
- @radix-ui/react-avatar
- @radix-ui/react-checkbox
- @radix-ui/react-context-menu
- @radix-ui/react-dialog
- @radix-ui/react-dropdown-menu
- @radix-ui/react-label
- @radix-ui/react-progress
- @radix-ui/react-radio-group
- @radix-ui/react-scroll-area
- @radix-ui/react-separator
- @radix-ui/react-slider
- @radix-ui/react-toast
- @radix-ui/react-toggle-group
- react-day-picker
- react-hook-form
- recharts
- @supabase/supabase-js
- @vercel/analytics

## God Nodes (most connected - your core abstractions)
1. `cn()` - 279 edges
2. `react` - 62 edges
3. `Button()` - 38 edges
4. `lucide-react` - 35 edges
5. `Card()` - 26 edges
6. `CardContent()` - 26 edges
7. `EventosPage()` - 25 edges
8. `EstudoPage()` - 22 edges
9. `CardHeader()` - 21 edges
10. `CardTitle()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `4. Formulário do perfil não sincronizado com dados async — `app/app/perfil/page.tsx`` --references--> `AuthProvider()`  [INFERRED]
  CHANGELOG.md → components/providers/auth-provider.tsx
- `5. `StudyTimer` recriava intervalo a cada segundo — `app/app/estudo/page.tsx`` --references--> `StudyTimer()`  [INFERRED]
  CHANGELOG.md → app/app/estudo/page.tsx
- `AlertDialogHeader()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts
- `AlertDialogFooter()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts
- `AlertDialogTitle()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (63 total, 30 thin omitted)

### Community 0 - "eventos/page.tsx"
Cohesion: 0.09
Nodes (78): DisciplinasPage(), initialFormData, EstudoPage(), initialFormData, StudyTimer(), EventosPage(), getPriorityBadge(), getRelativeDate() (+70 more)

### Community 1 - "hooks/use-toast.ts"
Cohesion: 0.08
Nodes (38): Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle, toastVariants (+30 more)

### Community 2 - "cn"
Cohesion: 0.09
Nodes (28): AccordionContent(), AccordionItem(), AccordionTrigger(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage() (+20 more)

### Community 3 - "sidebar.tsx"
Cohesion: 0.09
Nodes (31): SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent(), SidebarGroupLabel() (+23 more)

### Community 4 - "app-sidebar.tsx"
Cohesion: 0.11
Nodes (22): AppLayout(), AppSidebar(), navItems, AuthContext, AuthContextType, AuthProvider(), QueryProvider(), Avatar() (+14 more)

### Community 5 - "alert-dialog.tsx"
Cohesion: 0.11
Nodes (19): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay(), AlertDialogPortal() (+11 more)

### Community 6 - "item.tsx"
Cohesion: 0.11
Nodes (21): ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, FieldSeparator(), Item(), ItemActions(), ItemContent() (+13 more)

### Community 7 - "dependencies"
Cohesion: 0.08
Nodes (24): dependencies, cmdk@1.1.1, date-fns@4.1.0, embla-carousel-react@8.6.0, lucide-react@^0.564.0, next@16.2.6, @radix-ui/react-navigation-menu@1.2.14, @radix-ui/react-select@2.2.6 (+16 more)

### Community 8 - "package.json"
Cohesion: 0.10
Nodes (19): autoprefixer@^10.4.20, @radix-ui/react-accordion@1.2.12, @radix-ui/react-hover-card@1.1.15, @radix-ui/react-menubar@1.1.16, @radix-ui/react-popover@1.1.15, @radix-ui/react-toggle@1.1.10, vaul@^1.1.2, zod@^3.24.1 (+11 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 11 - "menubar.tsx"
Cohesion: 0.12
Nodes (12): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarPortal(), MenubarRadioItem(), MenubarSeparator() (+4 more)

### Community 12 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, postcss@^8.5, tailwindcss@^4.2.0, @tailwindcss/postcss@^4.2.0, tw-animate-css@1.3.3, @types/node@^22, @types/react@^19, @types/react-dom@^19 (+9 more)

### Community 13 - "context-menu.tsx"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 14 - "carousel.tsx"
Cohesion: 0.19
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 15 - "react"
Cohesion: 0.15
Nodes (5): Checkbox(), ResizableHandle(), ResizablePanelGroup(), Slider(), react

### Community 16 - "form.tsx"
Cohesion: 0.23
Nodes (10): FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue, FormLabel() (+2 more)

### Community 17 - "utils.ts"
Cohesion: 0.17
Nodes (7): Progress(), RadioGroup(), RadioGroupItem(), Spinner(), Switch(), tailwind-merge@^3.3.1, tailwind-merge

### Community 18 - "sheet.tsx"
Cohesion: 0.26
Nodes (9): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle() (+1 more)

### Community 19 - "middleware.ts"
Cohesion: 0.25
Nodes (7): GET(), updateSession(), createClient(), config, middleware(), @supabase/ssr@^0.10.3, @supabase/ssr

### Community 20 - "Problemas identificados e corrigidos"
Cohesion: 0.18
Nodes (10): 1. Fonte Geist nunca aplicada — `app/layout.tsx`, 2. Navegação com `<a>` nativo em vez de `<Link>` — `app/app/horario/page.tsx`, 3. Link ativo no sidebar falha em sub-rotas — `components/app-sidebar.tsx`, 4. Formulário do perfil não sincronizado com dados async — `app/app/perfil/page.tsx`, 5. `StudyTimer` recriava intervalo a cada segundo — `app/app/estudo/page.tsx`, 6. Imports não utilizados em notas — `app/app/notas/page.tsx`, 7. `fetchProfile` ignorava erros de base de dados — `components/providers/auth-provider.tsx`, Changelog — Revisão Sénior (+2 more)

### Community 21 - "chart.tsx"
Cohesion: 0.27
Nodes (10): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), ChartTooltipContent(), getPayloadConfigFromPayload() (+2 more)

### Community 22 - "command.tsx"
Cohesion: 0.22
Nodes (9): Command(), CommandDialog(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator(), CommandShortcut() (+1 more)

### Community 23 - "drawer.tsx"
Cohesion: 0.22
Nodes (7): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerPortal(), DrawerTitle()

### Community 24 - "field.tsx"
Cohesion: 0.20
Nodes (10): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSet() (+2 more)

### Community 25 - "input-group.tsx"
Cohesion: 0.25
Nodes (9): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea() (+1 more)

### Community 26 - "navigation-menu.tsx"
Cohesion: 0.24
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 27 - "class-variance-authority"
Cohesion: 0.33
Nodes (7): ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants, class-variance-authority@^0.7.1, class-variance-authority

### Community 28 - "empty.tsx"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 29 - "app/layout.tsx"
Cohesion: 0.33
Nodes (3): geist, geistMono, metadata

### Community 31 - "next-themes"
Cohesion: 0.33
Nodes (4): next-themes@^0.4.6, sonner@^1.7.1, next-themes, sonner

### Community 32 - "alert.tsx"
Cohesion: 0.50
Nodes (4): Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 34 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

## Knowledge Gaps
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `eventos/page.tsx`, `hooks/use-toast.ts`, `sidebar.tsx`, `app-sidebar.tsx`, `alert-dialog.tsx`, `item.tsx`, `menubar.tsx`, `context-menu.tsx`, `carousel.tsx`, `react`, `form.tsx`, `utils.ts`, `sheet.tsx`, `chart.tsx`, `command.tsx`, `drawer.tsx`, `field.tsx`, `input-group.tsx`, `navigation-menu.tsx`, `class-variance-authority`, `empty.tsx`, `alert.tsx`, `popover.tsx`, `hover-card.tsx`, `scroll-area.tsx`?**
  _High betweenness centrality (0.426) - this node is a cross-community bridge._
- **Should `eventos/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08872063676955931 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `eventos/page.tsx`, `hooks/use-toast.ts`, `cn`, `sidebar.tsx`, `app-sidebar.tsx`, `alert-dialog.tsx`, `item.tsx`, `dependencies`, `package.json`, `menubar.tsx`, `context-menu.tsx`, `carousel.tsx`, `form.tsx`, `utils.ts`, `sheet.tsx`, `chart.tsx`, `command.tsx`, `drawer.tsx`, `field.tsx`, `input-group.tsx`, `navigation-menu.tsx`, `class-variance-authority`, `alert.tsx`, `popover.tsx`, `hover-card.tsx`, `scroll-area.tsx`?**
  _High betweenness centrality (0.164) - this node is a cross-community bridge._
- **Should `hooks/use-toast.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07973421926910298 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `item.tsx`, `package.json`, `utils.ts`, `middleware.ts`, `class-variance-authority`, `collapsible.tsx`, `next-themes`, `@radix-ui/react-aspect-ratio`, `clsx`, `@hookform/resolvers@^3.9.1`, `input-otp`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-avatar`, `@radix-ui/react-checkbox`, `@radix-ui/react-context-menu`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-label`, `@radix-ui/react-progress`, `@radix-ui/react-radio-group`, `@radix-ui/react-scroll-area`, `@radix-ui/react-separator`, `@radix-ui/react-slider`, `@radix-ui/react-toast`, `@radix-ui/react-toggle-group`, `react-day-picker`, `react-hook-form`, `recharts`, `@supabase/supabase-js`, `@vercel/analytics`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.09047619047619047 - nodes in this community are weakly interconnected._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08571428571428572 - nodes in this community are weakly interconnected._