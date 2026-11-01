"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ChevronLeft, ChevronRight, Plus, CheckCircle2, Clock, AlertCircle } from "lucide-react"

const days = ["Mon 09", "Tue 10", "Wed 11", "Thu 12", "Fri 13", "Sat 14", "Sun 15"]
const shifts = [
  { id: 1, day: "Mon 09", worker: "John Doe", role: "Waitstaff", time: "09:00–17:00", status: "Confirmed" },
  { id: 2, day: "Mon 09", worker: "Sarah Khan", role: "Chef", time: "11:00–22:00", status: "Confirmed" },
  { id: 3, day: "Tue 10", worker: "Marcus Webb", role: "Kitchen Porter", time: "08:00–14:00", status: "Pending" },
  { id: 4, day: "Tue 10", worker: "Unassigned", role: "Bartender", time: "18:00–23:00", status: "Open" },
  { id: 5, day: "Wed 11", worker: "Priya Patel", role: "Waitstaff", time: "10:00–18:00", status: "Confirmed" },
  { id: 6, day: "Thu 12", worker: "Unassigned", role: "Waitstaff", time: "09:00–17:00", status: "Open" },
  { id: 7, day: "Fri 13", worker: "Tom Bailey", role: "Chef de Partie", time: "12:00–22:00", status: "Confirmed" },
  { id: 8, day: "Sat 14", worker: "Unassigned", role: "Event Lead", time: "08:00–20:00", status: "Open" },
  { id: 9, day: "Sat 14", worker: "Jane Smith", role: "Waitstaff", time: "09:00–17:00", status: "Pending" },
]

const statusStyle: Record<string, { badge: string; bg: string }> = {
  Confirmed: { badge: "bg-green-500/10 text-green-600 border-green-200", bg: "border-l-green-400 bg-green-500/5" },
  Pending: { badge: "bg-yellow-500/10 text-yellow-700 border-yellow-200", bg: "border-l-yellow-400 bg-yellow-500/5" },
  Open: { badge: "bg-red-500/10 text-red-600 border-red-200", bg: "border-l-red-400 bg-red-500/5" },
}

const statusIcon: Record<string, React.ReactNode> = {
  Confirmed: <CheckCircle2 className="h-3 w-3 text-green-500" />,
  Pending: <Clock className="h-3 w-3 text-yellow-500" />,
  Open: <AlertCircle className="h-3 w-3 text-red-500" />,
}

export default function RotaPlanner() {
  const [week, setWeek] = React.useState("09 Jun – 15 Jun")
  const [allShifts, setAllShifts] = React.useState(shifts)

  const handleAssign = (shiftId: number) => {
    setAllShifts(prev => prev.map(s => 
      s.id === shiftId ? { ...s, worker: "Jordan Clarke", status: "Confirmed" } : s
    ))
  }

  const summary = {
    confirmed: allShifts.filter(s => s.status === "Confirmed").length,
    pending: allShifts.filter(s => s.status === "Pending").length,
    open: allShifts.filter(s => s.status === "Open").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Rota Planner</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your team's shifts and coverage for the week.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-9 w-9"><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" className="gap-2 font-medium">
            <CalendarIcon className="h-4 w-4 text-primary" />
            {week}
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Summary Badges */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-200">
          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
          <span className="text-xs font-semibold text-green-700">{summary.confirmed} Confirmed</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-200">
          <Clock className="h-3.5 w-3.5 text-yellow-500" />
          <span className="text-xs font-semibold text-yellow-700">{summary.pending} Pending</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-200">
          <AlertCircle className="h-3.5 w-3.5 text-red-500" />
          <span className="text-xs font-semibold text-red-700">{summary.open} Open</span>
        </div>
        <Button size="sm" className="ml-auto font-semibold gap-1.5 shadow-md shadow-primary/15">
          <Plus className="h-3.5 w-3.5" /> Add Shift
        </Button>
      </div>

      {/* Rota Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px] grid grid-cols-7 gap-3">
          {days.map((day) => {
            const dayShifts = allShifts.filter(s => s.day === day)
            const isToday = day === "Mon 09"
            return (
              <div key={day} className="space-y-2">
                <div className={`text-center py-2 rounded-lg text-sm font-bold ${isToday ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {day}
                </div>
                {dayShifts.length === 0 && (
                  <button className="w-full border border-dashed border-border rounded-lg p-3 text-xs text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors">
                    + Add shift
                  </button>
                )}
                {dayShifts.map((shift) => (
                  <div
                    key={shift.id}
                    onClick={() => shift.status === "Open" && handleAssign(shift.id)}
                    className={`rounded-lg border-l-4 p-2.5 cursor-pointer hover:shadow-md transition-all active:scale-95 ${statusStyle[shift.status].bg} ${shift.status === "Open" ? "ring-2 ring-primary/20 animate-pulse-subtle" : ""}`}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      {statusIcon[shift.status]}
                      <span className={`text-[9px] font-bold uppercase tracking-wide ${statusStyle[shift.status].badge.split(" ")[1]}`}>
                        {shift.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold leading-tight">{shift.role}</p>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">{shift.worker === "Unassigned" ? "Click to Assign" : shift.worker}</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 bg-background/60 rounded px-1.5 py-0.5">
                      <Clock className="h-2.5 w-2.5 text-muted-foreground" />
                      <span className="text-[9px] font-medium text-muted-foreground">{shift.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-4 border-t">
        <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-red-400" /> Click "Open" shifts to assign workers</div>
        <span className="ml-auto">Total shifts: {allShifts.length}</span>
      </div>
    </div>
  )
}
