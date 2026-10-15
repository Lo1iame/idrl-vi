import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export type AppNavItem = { id: string; label: string; href: string; icon: LucideIcon }
export type AppShellConfig = {
  id: string; name: string; description?: string; logo: ReactNode; compactLogo: ReactNode; homeHref: string
  groups: { id: string; label: string; items: AppNavItem[] }[]
  status?: ReactNode; footer?: ReactNode
}
