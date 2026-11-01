"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Users } from "lucide-react"
import { format } from "date-fns"
import { api } from "@/lib/api"
import Link from "next/link"

export default function EmployerRota() {
  const [shifts, setShifts] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    api.getShifts()
      .then(setShifts)
      .catch(() => setShifts([]))
      .finally(() => setLoading(false))
  }, [])

  const weekDays = React.useMemo(() => {
    const today = new Date()
    const start = new Date(today)
    start.setDate(today.getDate() - today.getDay() + 1)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      return d
    })
  }, [])

  const getShiftsForDay = (day: Date) =>
    shifts.filter((s) => new Date(s.startTime).toDateString() === day.toDateString())

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Company Rota</h1>
          <p className="text-muted-foreground text-sm mt-1">View and manage shifts for your company.</p>
        </div>
        <Link href="/dashboard/admin/rota">
          <Button className="gap-2">
            <CalendarIcon className="h-4 w-4" /> Create New Rota
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading rota...</p>
      ) : shifts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No shifts scheduled yet. Create a rota to assign workers.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[900px] grid grid-cols-7 gap-4">
            {weekDays.map((day) => {
              const dayShifts = getShiftsForDay(day)
              const isToday = day.toDateString() === new Date().toDateString()
              return (
                <div key={day.toISOString()} className="space-y-3">
                  <div className={`text-center py-2.5 rounded-xl text-sm font-bold ${isToday ? "bg-primary text-primary-foreground" : "bg-white border border-border text-muted-foreground"}`}>
                    {format(day, "EEE dd")}
                  </div>
                  {dayShifts.length > 0 ? (
                    dayShifts.map((shift) => (
                      <div key={shift.id} className="rounded-xl border border-l-4 border-l-primary p-3 bg-white shadow-sm">
                        <p className="text-sm font-bold">{shift.job?.title}</p>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(shift.startTime), "HH:mm")}–{format(new Date(shift.endTime), "HH:mm")}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                          <Users className="h-3 w-3" />
                          {shift.worker ? `${shift.worker.firstName} ${shift.worker.lastName}` : 'Unassigned'}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          {shift.job?.location}
                        </div>
                        <Badge variant="outline" className="text-[9px] mt-2">{shift.status}</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="h-24 rounded-xl border border-dashed flex items-center justify-center">
                      <p className="text-[10px] text-muted-foreground">No shifts</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
