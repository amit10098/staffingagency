import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Users, Briefcase, Calendar, Clock, ArrowRight, Plus, CheckCircle2, ChevronRight, MapPin } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const assignedWorkers = [
  { name: "John Doe", role: "Waitstaff", status: "On Shift", rating: 4.9, location: "Manchester" },
  { name: "Sarah Khan", role: "Chef de Partie", status: "Confirmed", rating: 4.8, location: "London" },
  { name: "Marcus Webb", role: "Kitchen Porter", status: "Pending", rating: 4.7, location: "Leeds" },
]

const activeJobs = [
  { title: "Event Waitstaff", applied: 8, location: "London", date: "13 Jun", filled: false },
  { title: "Sous Chef", applied: 3, location: "Manchester", date: "15 Jun", filled: true },
  { title: "Bar Supervisor", applied: 5, location: "Birmingham", date: "20 Jun", filled: false },
]

const workerStatusStyle: Record<string, string> = {
  "On Shift": "bg-green-500/10 text-green-600 border-green-200",
  Confirmed: "bg-blue-500/10 text-blue-600 border-blue-200",
  Pending: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
}

export default function EmployerDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Company Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Luxury Events Co. · Premium Plan</p>
        </div>
        <Link 
          href="/dashboard/jobs" 
          className={cn(
            buttonVariants({ size: "lg" }),
            "font-semibold shadow-md shadow-primary/20 gap-2"
          )}
        >
          <Plus className="h-4 w-4" /> Post a New Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Assigned Workers", value: "12", note: "3 on shift now", icon: Users, color: "blue" },
          { label: "Active Job Posts", value: "5", note: "2 partially filled", icon: Briefcase, color: "purple" },
          { label: "Pending Timesheets", value: "8", note: "Awaiting approval", icon: Calendar, color: "orange" },
          { label: "Shifts This Week", value: "21", note: "↑ 6 vs last week", icon: Clock, color: "green" },
        ].map((stat) => (
          <Card key={stat.label} className="card-hover border-0 shadow-sm">
            <CardContent className="p-5">
              <div className={`h-9 w-9 rounded-lg mb-3 flex items-center justify-center ${
                stat.color === "blue" ? "bg-blue-500/10" :
                stat.color === "purple" ? "bg-purple-500/10" :
                stat.color === "orange" ? "bg-orange-500/10" : "bg-green-500/10"
              }`}>
                <stat.icon className={`h-4.5 w-4.5 ${
                  stat.color === "blue" ? "text-blue-500" :
                  stat.color === "purple" ? "text-purple-500" :
                  stat.color === "orange" ? "text-orange-500" : "text-green-500"
                }`} />
              </div>
              <p className="text-2xl font-extrabold">{stat.value}</p>
              <p className="text-xs font-semibold text-muted-foreground mt-0.5">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Assigned Workers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-bold">Your Workers</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary text-xs font-medium gap-1">
              Manage All <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignedWorkers.map((w) => (
              <div key={w.name} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                  {w.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{w.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{w.role}</span>
                    <span>·</span>
                    <MapPin className="h-3 w-3" />
                    <span>{w.location}</span>
                    <span>·</span>
                    <span>⭐ {w.rating}</span>
                  </div>
                </div>
                <Badge variant="outline" className={`text-xs whitespace-nowrap ${workerStatusStyle[w.status]}`}>{w.status}</Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full text-sm font-medium gap-2 mt-1">
              <Plus className="h-3.5 w-3.5" /> Request More Staff
            </Button>
          </CardContent>
        </Card>

        {/* Active Jobs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-bold">Active Job Posts</CardTitle>
            <Link 
              href="/dashboard/jobs" 
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-primary text-xs font-medium gap-1"
              )}
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeJobs.map((job) => (
              <div key={job.title} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors cursor-pointer group">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold group-hover:text-primary transition-colors">{job.title}</p>
                    {job.filled && <Badge className="text-[9px] bg-green-500/10 text-green-600 border-0">Filled</Badge>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span><MapPin className="h-3 w-3 inline" /> {job.location}</span>
                    <span>📅 {job.date}</span>
                    <span>👥 {job.applied} applied</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
            <Link 
              href="/dashboard/jobs" 
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "w-full text-sm font-medium gap-2 mt-1"
              )}
            >
              <Plus className="h-3.5 w-3.5" /> Post New Job
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Timesheet approvals */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">Pending Timesheet Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { worker: "John Doe", date: "Mon 09 Jun", hours: 8, pay: "£112.00" },
              { worker: "Sarah Khan", date: "Mon 09 Jun", hours: 11, pay: "£176.00" },
              { worker: "Marcus Webb", date: "Sun 08 Jun", hours: 6, pay: "£72.00" },
            ].map((t, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-muted/40">
                <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                  {t.worker[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{t.worker}</p>
                  <p className="text-xs text-muted-foreground">{t.date} · {t.hours}h · {t.pay}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs h-8">Reject</Button>
                  <Button size="sm" className="text-xs h-8 font-semibold gap-1"><CheckCircle2 className="h-3 w-3" /> Approve</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
