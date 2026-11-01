"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  BarChart3, Users, Briefcase, Calendar, Clock, CreditCard, Settings, LogOut,
  Bell, FileText, Sparkles, Menu, X, Home, Building2, ChevronRight
} from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/hooks/use-notifications"
import { getAuthUser, getToken, clearAuth } from "@/lib/api"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Info, CheckCircle2, AlertTriangle } from "lucide-react"

interface SidebarItem {
  name: string;
  href: string;
  icon: any;
  roles: string[];
  badge?: string;
}

const allSidebarItems: SidebarItem[] = [
  // Admin Items
  { name: "Overview", href: "/dashboard/admin", icon: BarChart3, roles: ["admin"] },
  { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase, roles: ["admin", "employer", "worker"] },
  { name: "Companies", href: "/dashboard/admin/companies", icon: Building2, roles: ["admin"] },
  { name: "Rota", href: "/dashboard/admin/rota", icon: Calendar, badge: "3 open", roles: ["admin"] },
  { name: "Rota", href: "/dashboard/employer/rota", icon: Calendar, roles: ["employer"] },
  { name: "Employees", href: "/dashboard/employee/list", icon: Users, roles: ["admin"] },
  { name: "Attendance", href: "/dashboard/admin/attendance", icon: Clock, roles: ["admin"] },
  { name: "Documents", href: "/dashboard/documents", icon: FileText, badge: "2 pending", roles: ["admin", "employer", "worker"] },
  { name: "Payroll", href: "/dashboard/payroll", icon: CreditCard, roles: ["admin", "employer", "worker"] },
  { name: "AI Matching", href: "/dashboard/ai", icon: Sparkles, roles: ["admin"] },
  { name: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["admin", "employer", "worker"] },

  // Employee (Worker) Specific
  { name: "Dashboard", href: "/dashboard/employee", icon: Home, roles: ["worker"] },
  { name: "My Rota", href: "/dashboard/employee/rota", icon: Calendar, roles: ["worker"] },
  { name: "My Jobs", href: "/dashboard/jobs", icon: Briefcase, roles: ["worker"] },
]

const pageTitles: Record<string, string> = {
  "/dashboard/admin/companies": "Company Management",
  "/dashboard/admin/rota": "Rota Planner",
  "/dashboard/employee/list": "Employee Management",
  "/dashboard/employee": "Employee Dashboard",
  "/dashboard/employee/rota": "My Rota",
  "/dashboard/employer": "Employer Dashboard",
  "/dashboard/documents": "Documents",
  "/dashboard/payroll": "Payroll",
  "/dashboard/ai": "AI Matching",
  "/dashboard/settings": "Settings",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [role, setRole] = React.useState<string | null>(null)
  const [authUser, setAuthUser] = React.useState<ReturnType<typeof getAuthUser>>(null)

  React.useEffect(() => {
    const token = getToken()
    if (!token) {
      router.replace('/login')
      return
    }

    const user = getAuthUser()
    setAuthUser(user)

    let storedRole = localStorage.getItem('userRole')
    
    if (!storedRole) {
      if (pathname.includes('/dashboard/admin')) storedRole = 'admin'
      else if (pathname.includes('/dashboard/employer')) storedRole = 'employer'
      else if (pathname.includes('/dashboard/employee')) storedRole = 'worker'
      else storedRole = user?.role === 'SUPER_ADMIN' ? 'admin' : user?.role === 'EMPLOYER' ? 'employer' : 'worker'
    }
    
    setRole(storedRole)

    if (storedRole === 'worker') {
      const forbiddenPaths = ['/dashboard/admin', '/dashboard/employer', '/dashboard/rota', '/dashboard/ai']
      if (forbiddenPaths.some(p => pathname.startsWith(p)) && !pathname.startsWith('/dashboard/employee')) {
        router.replace('/dashboard/employee')
      }
    } else if (storedRole === 'employer') {
      const forbiddenPaths = ['/dashboard/admin', '/dashboard/employee']
      const isRotaPlanner = pathname.startsWith('/dashboard/admin/rota')
      if (forbiddenPaths.some(p => pathname.startsWith(p)) && !pathname.startsWith('/dashboard/employer') && !isRotaPlanner) {
        router.replace('/dashboard/employer')
      }
    }
  }, [pathname, router])

  // Filter items based on the requested menu structure for employees
  const sidebarItems = React.useMemo(() => {
    if (!role) return []
    if (role === 'worker') {
      return [
        { name: "Overview", href: "/dashboard/employee", icon: Home, roles: ["worker"] },
        { name: "My Rota", href: "/dashboard/employee/rota", icon: Calendar, roles: ["worker"] },
        { name: "My Jobs", href: "/dashboard/jobs", icon: Briefcase, roles: ["worker"] },
        { name: "Documents", href: "/dashboard/documents", icon: FileText, roles: ["worker"] },
        { name: "Payroll", href: "/dashboard/payroll", icon: CreditCard, roles: ["worker"] },
      ]
    }
    
    // Default/Admin/Employer view
    return allSidebarItems.filter(item => item.roles.includes(role))
  }, [role])

  const { notifications, markAsRead, markAllAsRead } = useNotifications()

  if (!role) return null // Wait for role detection

  const currentTitle = pageTitles[pathname] || "Dashboard"
  const unreadCount = notifications.filter(n => !n.isRead).length

  const NotificationCenter = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group">
          <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary border-2 border-background animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && <Badge variant="secondary" className="text-[10px]">{unreadCount} New</Badge>}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-xs">
              No notifications yet.
            </div>
          ) : (
            notifications.map((n) => (
              <div 
                key={n.id} 
                onClick={() => markAsRead(n.id)}
                className={cn(
                  "p-4 flex gap-3 hover:bg-muted/50 cursor-pointer transition-colors border-b last:border-0",
                  !n.isRead && "bg-primary/5"
                )}
              >
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                  n.type === "info" && "bg-blue-100 text-blue-600",
                  n.type === "success" && "bg-emerald-100 text-emerald-600",
                  n.type === "warning" && "bg-amber-100 text-amber-600"
                )}>
                  {n.type === "info" && <Info className="h-4 w-4" />}
                  {n.type === "success" && <CheckCircle2 className="h-4 w-4" />}
                  {n.type === "warning" && <AlertTriangle className="h-4 w-4" />}
                </div>
                <div className="space-y-1">
                  <p className={cn("text-sm leading-none", !n.isRead && "font-bold")}>{n.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{n.description}</p>
                  <p className="text-[10px] text-muted-foreground">{n.timestamp}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-2 border-t text-center">
          <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground" onClick={markAllAsRead}>
            Clear all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )

  const SidebarContent = () => {
    return (
      <div className="flex flex-col h-full">
        <div className="p-5 border-b">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs group-hover:scale-110 transition-transform">
              PS
            </div>
            <div>
              <span className="text-base font-bold">
                <span className="text-primary">Prime</span>Staff
              </span>
              <p className="text-[10px] text-muted-foreground -mt-0.5">Management Platform</p>
            </div>
          </Link>
        </div>

        <div className="px-3 py-4 flex-1 overflow-y-auto">
          <div className="mb-2">
            <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              {role === 'worker' ? 'Employee Menu' : 'Main Menu'}
            </p>
          </div>
          <nav className="space-y-0.5">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all group ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-primary-foreground" : "group-hover:text-primary transition-colors"}`} />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && !isActive && (
                    <Badge className="bg-primary/10 text-primary border-0 text-[9px] px-1.5 py-0 h-4">{item.badge}</Badge>
                  )}
                  {isActive && <ChevronRight className="h-3 w-3 opacity-70" />}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/60 mb-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
              {authUser?.profile?.firstName?.[0] || (role === 'worker' ? 'E' : 'A')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {authUser?.profile ? `${authUser.profile.firstName} ${authUser.profile.lastName}` : role === 'worker' ? 'Employee' : 'Admin User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {authUser?.email || ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => { clearAuth(); window.location.href = '/login' }}
            className={cn(
              buttonVariants({ variant: "ghost", size: "default" }),
              "w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-sm"
            )}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-card sticky top-0 h-screen shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 left-0 w-72 bg-card shadow-2xl flex flex-col"
            >
              <SidebarContent />
              <button 
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/80 backdrop-blur-md px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-bold tracking-tight">{currentTitle}</h2>
          </div>
          <div className="flex items-center gap-3">
            <NotificationCenter />
            <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="p-6 lg:p-8 max-w-7xl mx-auto w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
