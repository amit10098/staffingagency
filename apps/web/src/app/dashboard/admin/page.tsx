"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { 
  Building2, Users, Briefcase, CreditCard, TrendingUp, TrendingDown, 
  ArrowRight, Clock, CheckCircle2, AlertCircle, Activity, Plus, Download
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const stats = [
  { label: "Total Companies", value: "128", change: "+4 this month", up: true, icon: Building2, color: "blue" },
  { label: "Active Workers", value: "2,450", change: "+180 this month", up: true, icon: Users, color: "green" },
  { label: "Open Jobs", value: "42", change: "+12 since yesterday", up: true, icon: Briefcase, color: "purple" },
  { label: "Monthly Revenue", value: "£84,250", change: "+12% vs last month", up: true, icon: CreditCard, color: "orange" },
]

const colorMap: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-500",
  green: "bg-green-500/10 text-green-500",
  purple: "bg-purple-500/10 text-purple-500",
  orange: "bg-orange-500/10 text-orange-600",
}

const recentActivity = [
  { type: "Job Posted", desc: "RGN required at City Hospital Manchester", time: "2m ago", status: "new" },
  { type: "Worker Confirmed", desc: "John Doe confirmed for Waitstaff role tomorrow", time: "15m ago", status: "success" },
  { type: "Document Expiry", desc: "BRP for Sarah K. expires in 7 days", time: "1h ago", status: "warning" },
  { type: "Payroll Processed", desc: "Week 23 payroll £18,200 processed", time: "3h ago", status: "success" },
  { type: "New Employer", desc: "IHG Hotels signed up", time: "5h ago", status: "new" },
]

const statusStyles: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600",
  success: "bg-green-500/10 text-green-600",
  warning: "bg-yellow-500/10 text-yellow-700",
  error: "bg-red-500/10 text-red-600",
}

const kpiData = [
  { month: "Jan", value: 60 }, { month: "Feb", value: 72 }, { month: "Mar", value: 65 },
  { month: "Apr", value: 85 }, { month: "May", value: 78 }, { month: "Jun", value: 95 },
]

function exportReport() {
  const csv = [
    ["Metric", "Value"],
    ["Total Companies", "128"],
    ["Active Workers", "2,450"],
    ["Open Jobs", "42"],
    ["Monthly Revenue", "£84,250"],
    ["Fill Rate", "98%"],
    ["Avg Rating", "4.9"],
  ].map(r => r.join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `primestaff-report-${new Date().toISOString().split("T")[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminDashboard() {
  const maxVal = Math.max(...kpiData.map(d => d.value))
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Admin Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">{today} · Good morning 👋</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="font-medium gap-1.5" onClick={exportReport}>
            <Download className="h-3.5 w-3.5" /> Export Report
          </Button>
          <Link 
            href="/dashboard/jobs" 
            className={cn(
              buttonVariants({ size: "sm" }),
              "font-semibold shadow-md shadow-primary/20"
            )}
          >
            + Post New Job
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <Card key={stat.label} className="card-hover border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${colorMap[stat.color]}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                {stat.up ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                    <TrendingUp className="h-3 w-3" /> Up
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-medium text-red-500">
                    <TrendingDown className="h-3 w-3" /> Down
                  </span>
                )}
              </div>
              <p className="text-3xl font-extrabold mb-1">{stat.value}</p>
              <p className="text-xs font-semibold text-muted-foreground mb-0.5">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart (simplified bar) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold">Revenue Trend</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Shifts billed per month (£k)</p>
            </div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-36 mt-4">
              {kpiData.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md bg-primary/80 hover:bg-primary transition-colors cursor-pointer"
                    style={{ height: `${(d.value / maxVal) * 100}%` }}
                    title={`${d.month}: £${d.value}k`}
                  />
                  <span className="text-[10px] text-muted-foreground">{d.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "View Pending Timesheets", icon: Clock, href: "/dashboard/admin/rota" },
              { label: "Approve Documents", icon: CheckCircle2, href: "/dashboard/documents" },
              { label: "Run Payroll", icon: CreditCard, href: "/dashboard/payroll" },
              { label: "Browse Job Board", icon: Briefcase, href: "/dashboard/jobs" },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors group"
              >
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20">
                  <action.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="flex-1">{action.label}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold">Recent Activity</CardTitle>
          <Link href="/dashboard/admin/rota" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-primary font-medium text-xs")}>View All</Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0 mt-0.5">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide whitespace-nowrap ${statusStyles[item.status]}`}>
                    {item.type}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground flex-1">{item.desc}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
