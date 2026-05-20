import { QueryProvider } from '@/components/providers/query-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import { AppSidebar } from '@/components/app-sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <div className="min-h-svh bg-background">
          <AppSidebar />
          <main className="pt-14 md:ml-64 md:pt-0">
            <div className="min-h-svh p-4 md:p-6">{children}</div>
          </main>
        </div>
      </AuthProvider>
    </QueryProvider>
  )
}
