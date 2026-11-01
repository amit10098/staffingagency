"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Clock, MapPin, Camera, Edit2, Check, X, Search, Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { api } from "@/lib/api"

export default function AdminAttendancePage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AdminAttendanceContent />
    </React.Suspense>
  )
}

function AdminAttendanceContent() {
  const searchParams = useSearchParams()
  const companyParam = searchParams.get("company")

  const [attendance, setAttendance] = React.useState<any[]>([])
  const [companies, setCompanies] = React.useState<{ id: string; name: string }[]>([])
  const [filterCompany, setFilterCompany] = React.useState<string>(companyParam || "all")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [loading, setLoading] = React.useState(true)

  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editData, setEditData] = React.useState({ clockInTime: "", clockOutTime: "" })

  React.useEffect(() => {
    api.getCompanies().then(setCompanies).catch(console.error)
  }, [])

  const fetchAttendance = React.useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.getAttendance(filterCompany !== "all" ? filterCompany : undefined)
      setAttendance(data)
    } catch (err) {
      console.error(err)
      setAttendance([])
    } finally {
      setLoading(false)
    }
  }, [filterCompany])

  React.useEffect(() => {
    fetchAttendance()
  }, [fetchAttendance])

  React.useEffect(() => {
    if (companyParam && companyParam !== filterCompany) {
      setFilterCompany(companyParam)
    }
  }, [companyParam])

  const handleApprove = async (id: string) => {
    try {
      await api.approveAttendance(id)
      fetchAttendance()
    } catch (err: any) {
      alert("Failed to approve: " + err.message)
    }
  }

  const handleFlag = async (id: string) => {
    try {
      await api.flagAttendance(id)
      fetchAttendance()
    } catch (err: any) {
      alert("Failed to flag: " + err.message)
    }
  }

  const startEdit = (record: any) => {
    setEditingId(record.id)
    setEditData({
      clockInTime: record.clockInTime ? format(new Date(record.clockInTime), "HH:mm") : "",
      clockOutTime: record.clockOutTime ? format(new Date(record.clockOutTime), "HH:mm") : ""
    })
  }

  const saveEdit = async (record: any) => {
    try {
      // Reconstruct full datetime strings based on shift date
      const shiftDateStr = format(new Date(record.shift.startTime), "yyyy-MM-dd")
      const updatedClockIn = editData.clockInTime ? new Date(`${shiftDateStr}T${editData.clockInTime}:00`).toISOString() : undefined
      const updatedClockOut = editData.clockOutTime ? new Date(`${shiftDateStr}T${editData.clockOutTime}:00`).toISOString() : undefined

      await api.updateAttendanceTimes(record.id, {
        clockInTime: updatedClockIn,
        clockOutTime: updatedClockOut,
      })
      setEditingId(null)
      fetchAttendance()
    } catch (err: any) {
      alert("Failed to update times: " + err.message)
    }
  }

  const filteredAttendance = attendance.filter(a => {
    const workerName = `${a.shift.worker.firstName} ${a.shift.worker.lastName}`.toLowerCase()
    return workerName.includes(searchTerm.toLowerCase())
  })

  const pendingCount = attendance.filter(a => a.approvalStatus === "PENDING").length
  const flaggedCount = attendance.filter(a => a.approvalStatus === "FLAGGED").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Attendance Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Review, approve, and adjust worker clock-in/out records.</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={filterCompany} onValueChange={setFilterCompany}>
            <SelectTrigger className="w-[220px]">
              <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="All Companies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search workers..." 
                className="pl-9" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="font-medium px-3 py-1 bg-amber-50 text-amber-700 border-amber-200">
                Pending ({pendingCount})
              </Badge>
              <Badge variant="outline" className="font-medium px-3 py-1 bg-red-50 text-red-700 border-red-200">
                Flagged ({flaggedCount})
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="text-left p-4 font-bold">Worker</th>
                  <th className="text-left p-4 font-bold">Company / Shift</th>
                  <th className="text-left p-4 font-bold">Clock In/Out</th>
                  <th className="text-left p-4 font-bold">Verification</th>
                  <th className="text-left p-4 font-bold">Status</th>
                  <th className="text-right p-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">Loading attendance records...</td></tr>
                ) : filteredAttendance.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No attendance records found.</td></tr>
                ) : filteredAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                          {record.shift.worker.firstName[0]}{record.shift.worker.lastName[0]}
                        </div>
                        <div>
                          <p className="font-bold">{record.shift.worker.firstName} {record.shift.worker.lastName}</p>
                          <p className="text-[11px] text-muted-foreground">{record.shift.worker.position || "Worker"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-xs mb-1"><Building2 className="inline w-3 h-3 mr-1 text-muted-foreground"/> {record.shift.job.company.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {format(new Date(record.shift.startTime), "dd MMM yyyy")} <br/>
                        {format(new Date(record.shift.startTime), "HH:mm")} - {format(new Date(record.shift.endTime), "HH:mm")}
                      </p>
                    </td>
                    <td className="p-4">
                      {editingId === record.id ? (
                        <div className="flex flex-col gap-1.5 min-w-[100px]">
                          <Input 
                            type="time"
                            value={editData.clockInTime} 
                            onChange={e => setEditData({ ...editData, clockInTime: e.target.value })} 
                            className="h-7 text-xs px-2"
                          />
                          <Input 
                            type="time"
                            value={editData.clockOutTime} 
                            onChange={e => setEditData({ ...editData, clockOutTime: e.target.value })} 
                            className="h-7 text-xs px-2"
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="font-bold text-primary flex items-center gap-1.5">
                            <Clock className="h-3 w-3" /> 
                            {record.clockInTime ? format(new Date(record.clockInTime), "HH:mm") : "--:--"} – {record.clockOutTime ? format(new Date(record.clockOutTime), "HH:mm") : "--:--"}
                          </p>
                          <p className="text-[11px] text-muted-foreground">Actual logged time</p>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-[11px] space-y-1">
                      {record.clockInGps ? (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <MapPin className="h-3 w-3 text-primary" /> {record.clockInGps}
                        </div>
                      ) : (
                        <div className="text-muted-foreground italic">No GPS data</div>
                      )}
                      {/* Photo verification stub */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="flex items-center gap-1.5 text-primary hover:underline font-semibold text-left mt-1">
                            <Camera className="h-3 w-3" /> View Photo
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Clock-in Photo: {record.shift.worker.firstName}</DialogTitle></DialogHeader>
                          <div className="aspect-video w-full rounded-xl flex items-center justify-center bg-muted border border-dashed">
                            <p className="text-muted-foreground">No photo available</p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                    <td className="p-4">
                      <Badge className={cn(
                        "text-[10px] font-bold border-0",
                        record.approvalStatus === "APPROVED" ? "bg-green-500/10 text-green-600" :
                        record.approvalStatus === "FLAGGED" ? "bg-red-500/10 text-red-600" :
                        record.approvalStatus === "MODIFIED" ? "bg-blue-500/10 text-blue-600" :
                        "bg-amber-500/10 text-amber-700"
                      )}>
                        {record.approvalStatus}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      {editingId === record.id ? (
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={() => saveEdit(record)}><Check className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => setEditingId(null)}><X className="h-4 w-4" /></Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-1">
                          {record.approvalStatus !== "APPROVED" && (
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" title="Approve" onClick={() => handleApprove(record.id)}>
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" title="Edit Times" onClick={() => startEdit(record)}>
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          {record.approvalStatus !== "FLAGGED" && (
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" title="Flag for Review" onClick={() => handleFlag(record.id)}>
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
