"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin,
  Bell, RefreshCw, CheckCircle2, Coffee, FileText, Building2,
  Sun, Zap
} from "lucide-react"
import {
  format, addWeeks, subWeeks, startOfWeek, addDays,
  isSameDay, isAfter, isBefore, isToday
} from "date-fns"
import { api } from "@/lib/api"
import { useNotifications } from "@/hooks/use-notifications"

const statusStyle: Record<string, { border: string; badge: string; label: string }> = {
  ASSIGNED:   { border: "border-l-indigo-500",   badge: "bg-indigo-50 text-indigo-700 border-indigo-200",   label: "Assigned" },
  ACCEPTED:   { border: "border-l-green-500",    badge: "bg-green-50 text-green-700 border-green-200",     label: "Confirmed" },
  COMPLETED:  { border: "border-l-slate-400",    badge: "bg-slate-50 text-slate-600 border-slate-200",     label: "Completed" },
  UNASSIGNED: { border: "border-l-yellow-400",   badge: "bg-yellow-50 text-yellow-700 border-yellow-200",  label: "Unassigned" },
  REJECTED:   { border: "border-l-red-400",      badge: "bg-red-50 text-red-700 border-red-200",           label: "Rejected" },
}

function getStyle(status: string) {
  return statusStyle[status] ?? statusStyle.UNASSIGNED
}

function ShiftCard({ shift, compact = false }: { shift: any; compact?: boolean }) {
  const style = getStyle(shift.status)
  const start = new Date(shift.startTime)
  const end = new Date(shift.endTime)
  const isClockedIn = !!shift.attendance?.clockInTime
  const isClockedOut = !!shift.attendance?.clockOutTime
  const durationMins = Math.round((end.getTime() - start.getTime()) / 60000)
  const netMins = durationMins - (shift.breakTime || 0)

  if (compact) {
    return (
      <div className={`rounded-xl border border-border border-l-4 ${style.border} p-3 bg-white shadow-sm hover:shadow-md transition-all`}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-sm font-bold text-foreground leading-tight truncate">{shift.job?.title || "Shift"}</p>
          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border flex-shrink-0 ${style.badge}`}>
            {style.label}
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3 text-primary" />
            <span className="font-semibold text-foreground">{format(start, "HH:mm")}–{format(end, "HH:mm")}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Building2 className="h-3 w-3" />
            <span className="truncate">{shift.job?.company?.name || "—"}</span>
          </div>
          {shift.job?.location && (
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{shift.job.location}</span>
            </div>
          )}
          {shift.breakTime > 0 && (
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Coffee className="h-3 w-3" />
              <span>{shift.breakTime}m break · {Math.floor(netMins / 60)}h {netMins % 60}m net</span>
            </div>
          )}
          {isClockedIn && (
            <div className="mt-1.5 flex items-center gap-1 text-[9px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5 w-fit">
              <CheckCircle2 className="h-2.5 w-2.5" />
              {isClockedOut ? "Clocked Out" : "Clocked In"}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Full card (used in upcoming panel)
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl bg-white border border-border shadow-sm border-l-4 ${style.border} hover:shadow-md transition-all`}>
      <div className="text-center bg-primary/10 rounded-lg px-2.5 py-1.5 flex-shrink-0 min-w-[44px]">
        <p className="text-[10px] font-bold text-primary uppercase">{format(start, "EEE")}</p>
        <p className="text-lg font-black text-primary leading-none">{format(start, "dd")}</p>
        <p className="text-[9px] text-muted-foreground">{format(start, "MMM")}</p>
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-sm font-semibold truncate">{shift.job?.title || "Shift"}</p>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Building2 className="h-3 w-3" />
          <span className="truncate font-medium text-foreground">{shift.job?.company?.name || "—"}</span>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {format(start, "HH:mm")}–{format(end, "HH:mm")}
          </div>
          {shift.job?.location && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{shift.job.location}</span>
            </div>
          )}
          {shift.breakTime > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Coffee className="h-3 w-3" />
              {shift.breakTime}m break
            </div>
          )}
        </div>
        {shift.notes && (
          <div className="flex items-start gap-1 text-[10px] text-muted-foreground">
            <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">{shift.notes}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${style.badge}`}>
          {style.label}
        </span>
        {isClockedIn && (
          <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5">
            {isClockedOut ? "✓ Out" : "✓ In"}
          </span>
        )}
      </div>
    </div>
  )
}

export default function WorkerRota() {
  const [shifts, setShifts] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [refreshing, setRefreshing] = React.useState(false)
  const [weekOffset, setWeekOffset] = React.useState(0)
  const [newShiftBanner, setNewShiftBanner] = React.useState(false)
  const prevShiftIds = React.useRef<Set<string>>(new Set())
  const { refresh: refreshNotifications } = useNotifications()

  const fetchShifts = React.useCallback(async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true)
    try {
      const data = await api.getMyShifts()
      const hasNew = data.some((s: any) => !prevShiftIds.current.has(s.id)) && prevShiftIds.current.size > 0
      if (hasNew) setNewShiftBanner(true)
      prevShiftIds.current = new Set(data.map((s: any) => s.id))
      setShifts(data)
    } catch {
      setShifts([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  React.useEffect(() => { fetchShifts() }, [fetchShifts])
  React.useEffect(() => {
    const interval = setInterval(() => fetchShifts(), 15000)
    return () => clearInterval(interval)
  }, [fetchShifts])

  const weekStart = React.useMemo(() => {
    const base = startOfWeek(new Date(), { weekStartsOn: 1 })
    return weekOffset >= 0 ? addWeeks(base, weekOffset) : subWeeks(base, Math.abs(weekOffset))
  }, [weekOffset])

  const weekDays = React.useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  )

  const getShiftForDay = (day: Date) => shifts.filter((s) => isSameDay(new Date(s.startTime), day))

  const upcomingShifts = React.useMemo(
    () => shifts
      .filter((s) => isAfter(new Date(s.startTime), new Date()))
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 5),
    [shifts]
  )

  const todayShifts = React.useMemo(
    () => shifts.filter((s) => isToday(new Date(s.startTime))),
    [shifts]
  )

  const pastShiftsCount = shifts.filter(s => isBefore(new Date(s.endTime), new Date())).length

  const handleManualRefresh = async () => {
    await fetchShifts(true)
    await refreshNotifications()
    setNewShiftBanner(false)
  }

  return (
    <div className="space-y-6">
      {/* New Shift Banner */}
      {newShiftBanner && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/30 animate-in slide-in-from-top-2 duration-500">
          <Bell className="h-5 w-5 text-primary animate-bounce" />
          <div className="flex-1">
            <p className="text-sm font-bold text-primary">New Rota Assigned!</p>
            <p className="text-xs text-muted-foreground">Your schedule has been updated by the admin.</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setNewShiftBanner(false)} className="border-primary/30">
            Dismiss
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">My Rota</h1>
          <p className="text-muted-foreground text-sm mt-1">Your assigned shifts — auto-updates every 15 seconds.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleManualRefresh} disabled={refreshing} className="gap-2 text-xs">
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setWeekOffset(o => o - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-2 font-medium" onClick={() => setWeekOffset(0)}>
            <CalendarIcon className="h-4 w-4 text-primary" />
            {format(weekDays[0], "dd MMM")} – {format(weekDays[6], "dd MMM")}
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setWeekOffset(o => o + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Zap, label: "Total Shifts", value: shifts.length, color: "text-primary bg-primary/10" },
          { icon: CheckCircle2, label: "Upcoming", value: upcomingShifts.length, color: "text-green-600 bg-green-50" },
          { icon: Sun, label: "Completed", value: pastShiftsCount, color: "text-slate-500 bg-slate-100" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-xl border bg-white p-4 flex items-center gap-3 shadow-sm">
            <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xl font-black">{value}</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Shifts */}
      {todayShifts.length > 0 && (
        <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-indigo-700">
              <Sun className="h-4 w-4" /> Today's Shift{todayShifts.length > 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-3">
            {todayShifts.map(shift => <ShiftCard key={shift.id} shift={shift} />)}
          </CardContent>
        </Card>
      )}

      {/* Upcoming Shifts Quick View */}
      {upcomingShifts.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Next Upcoming Shifts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingShifts.map(shift => <ShiftCard key={shift.id} shift={shift} />)}
          </CardContent>
        </Card>
      )}

      {/* Weekly Grid */}
      {loading ? (
        <div className="flex items-center gap-3 p-6 rounded-xl border bg-white">
          <RefreshCw className="h-5 w-5 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading your rota...</p>
        </div>
      ) : shifts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center space-y-3">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <CalendarIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">No shifts assigned yet</p>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              You'll receive a notification when a rota is published for you.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Week of {format(weekDays[0], "dd MMM")} – {format(weekDays[6], "dd MMM yyyy")}
          </p>
          <div className="overflow-x-auto pb-4">
            <div className="min-w-[800px] grid grid-cols-7 gap-3">
              {weekDays.map((day) => {
                const dayShifts = getShiftForDay(day)
                const today = isSameDay(day, new Date())
                return (
                  <div key={day.toISOString()} className="space-y-2">
                    <div className={`text-center py-2.5 rounded-xl text-sm font-bold shadow-sm ${today ? "bg-primary text-primary-foreground" : "bg-white border border-border text-muted-foreground"}`}>
                      <p className="text-[10px] uppercase tracking-wider opacity-70">{format(day, "EEE")}</p>
                      <p className="text-lg font-black leading-tight">{format(day, "dd")}</p>
                      {today && <p className="text-[9px] font-medium opacity-80">Today</p>}
                    </div>
                    {dayShifts.length > 0 ? (
                      dayShifts.map(s => <ShiftCard key={s.id} shift={s} compact />)
                    ) : (
                      <div className="h-28 rounded-xl border border-dashed border-border/60 flex items-center justify-center bg-muted/5">
                        <p className="text-[10px] text-muted-foreground font-medium">Off duty</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
