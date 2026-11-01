"use client"

import * as React from "react"
import { 
  Calendar as CalendarIcon, Clock, Users, Building2, 
  ChevronRight, ChevronLeft, CheckCircle2, AlertCircle,
  Plus, Send, Edit, Trash2, ArrowLeftRight, CalendarDays, ListFilter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { format, addDays, subDays, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useNotifications } from "@/hooks/use-notifications"
import { api } from "@/lib/api"
import { useSearchParams } from "next/navigation"

const statusStyle: Record<string, string> = {
  ASSIGNED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  ACCEPTED: "bg-green-50 text-green-700 border-green-200",
  COMPLETED: "bg-slate-50 text-slate-600 border-slate-200",
  UNASSIGNED: "bg-yellow-50 text-yellow-700 border-yellow-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
}

export default function RotaManagementPage() {
  const searchParams = useSearchParams()
  const companyParam = searchParams.get("company")

  const [activeTab, setActiveTab] = React.useState("publish")
  
  // Publish Tab State
  const [step, setStep] = React.useState(1)
  const [publishing, setPublishing] = React.useState(false)
  const [formData, setFormData] = React.useState({
    companyId: companyParam || "", range: "single", date: new Date(),
    selectedWorkers: [] as string[],
    startTime: "09:00", endTime: "17:00", breakTime: "60", notes: ""
  })

  // Schedule View State
  const [scheduleDate, setScheduleDate] = React.useState<Date>(new Date())
  const [filterCompany, setFilterCompany] = React.useState<string>(companyParam || "all")
  const [shifts, setShifts] = React.useState<any[]>([])
  const [loadingShifts, setLoadingShifts] = React.useState(false)
  const [publishBanner, setPublishBanner] = React.useState<{ count: number; company: string; date: string } | null>(null)

  // Edit / Reassign State
  const [editingShift, setEditingShift] = React.useState<any>(null)
  const [editData, setEditData] = React.useState({ startTime: "", endTime: "", breakTime: 0, notes: "", status: "" })
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [deletingShift, setDeletingShift] = React.useState<any>(null)
  const [reassigningShift, setReassigningShift] = React.useState<any>(null)
  const [newWorkerId, setNewWorkerId] = React.useState("")

  // Global State
  const [companies, setCompanies] = React.useState<{ id: string; name: string }[]>([])
  const [workers, setWorkers] = React.useState<{ id: string; name: string; position: string }[]>([])
  const { refresh } = useNotifications()

  React.useEffect(() => {
    if (companyParam) {
      setFilterCompany(companyParam)
      setFormData(prev => ({ ...prev, companyId: companyParam }))
    }
  }, [companyParam])

  React.useEffect(() => {
    api.getCompanies().then(setCompanies).catch(console.error)
    api.getWorkers().then(data =>
      setWorkers(data.filter((w: any) => w.profile).map((w: any) => ({
        id: w.profile.id,
        name: `${w.profile.firstName} ${w.profile.lastName}`,
        position: w.profile.position || "Worker",
      })))
    ).catch(console.error)
  }, [])

  const fetchShifts = React.useCallback(async () => {
    setLoadingShifts(true)
    try {
      const data = filterCompany === "all" ? await api.getShifts() : await api.getShiftsByCompany(filterCompany)
      setShifts(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingShifts(false)
    }
  }, [filterCompany])

  React.useEffect(() => {
    if (activeTab === "schedule") {
      fetchShifts()
    }
  }, [activeTab, fetchShifts])

  // Publish Functions
  const handleNext = () => setStep(s => Math.min(s + 1, 5))
  const handleBack = () => setStep(s => Math.max(s - 1, 1))

  const handlePublish = async () => {
    setPublishing(true)
    try {
      const dateStr = format(formData.date, "yyyy-MM-dd")
      await api.publishRota({
        companyId: formData.companyId, date: dateStr,
        startTime: formData.startTime, endTime: formData.endTime,
        workerIds: formData.selectedWorkers, breakTime: Number(formData.breakTime) || 0,
        notes: formData.notes,
      })
      await refresh()
      // Navigate straight to Schedule View on the published date
      setScheduleDate(formData.date)
      setFilterCompany(formData.companyId)
      setPublishBanner({
        count: formData.selectedWorkers.length,
        company: companies.find(c => c.id === formData.companyId)?.name || "Company",
        date: format(formData.date, "EEE dd MMM yyyy"),
      })
      setActiveTab("schedule")
      // Reset wizard for next use
      setStep(1)
      setFormData({ ...formData, companyId: "", selectedWorkers: [] })
    } catch (err: any) {
      alert(err.message || "Failed to publish rota")
    } finally {
      setPublishing(false)
    }
  }

  const handleReset = () => {
    setStep(1)
    setFormData({ ...formData, companyId: "", selectedWorkers: [] })
  }

  const toggleWorker = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selectedWorkers: prev.selectedWorkers.includes(id) ? prev.selectedWorkers.filter(w => w !== id) : [...prev.selectedWorkers, id]
    }))
  }

  // Schedule View Functions
  const dateShifts = React.useMemo(() => shifts.filter(s => isSameDay(new Date(s.startTime), scheduleDate)), [shifts, scheduleDate])

  const openEditDialog = (shift: any) => {
    setEditingShift(shift)
    setEditData({
      startTime: format(new Date(shift.startTime), "HH:mm"),
      endTime: format(new Date(shift.endTime), "HH:mm"),
      breakTime: shift.breakTime || 0,
      notes: shift.notes || "",
      status: shift.status || "ASSIGNED"
    })
    setIsEditDialogOpen(true)
  }

  const saveEdit = async () => {
    try {
      const shiftDateStr = format(new Date(editingShift.startTime), "yyyy-MM-dd")
      const updatedStartTime = new Date(`${shiftDateStr}T${editData.startTime}:00`).toISOString()
      const updatedEndTime = new Date(`${shiftDateStr}T${editData.endTime}:00`).toISOString()
      
      await api.updateShift(editingShift.id, {
        startTime: updatedStartTime,
        endTime: updatedEndTime,
        breakTime: Number(editData.breakTime),
        notes: editData.notes,
        status: editData.status
      })
      setIsEditDialogOpen(false)
      fetchShifts()
    } catch (err: any) {
      alert("Failed to update: " + err.message)
    }
  }

  const confirmDelete = async () => {
    try {
      await api.deleteShift(deletingShift.id)
      setDeletingShift(null)
      fetchShifts()
    } catch (err: any) {
      alert("Failed to delete: " + err.message)
    }
  }

  const saveReassign = async () => {
    try {
      await api.assignWorker(reassigningShift.id, newWorkerId)
      setReassigningShift(null)
      setNewWorkerId("")
      fetchShifts()
    } catch (err: any) {
      alert("Failed to reassign: " + err.message)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rota Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Plan, publish, and manage employee shifts.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
          <TabsTrigger value="publish"><CalendarDays className="w-4 h-4 mr-2" /> Publish Rota</TabsTrigger>
          <TabsTrigger value="schedule"><ListFilter className="w-4 h-4 mr-2" /> Schedule View</TabsTrigger>
        </TabsList>

        <TabsContent value="publish">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="grid grid-cols-5 gap-2 mb-4">
              {[1,2,3,4,5].map(s => (
                <div key={s} className={cn("h-1.5 rounded-full transition-all", s <= step ? "bg-primary" : "bg-muted")} />
              ))}
            </div>
              <Card className="shadow-xl border-indigo-100 overflow-hidden">
                <CardContent className="p-8">
                  {step === 1 && (
                    <div className="space-y-6">
                      <Label>Select Company</Label>
                      <Select onValueChange={v => setFormData({...formData, companyId: v})} value={formData.companyId}>
                        <SelectTrigger className="w-full h-12"><SelectValue placeholder="Search and select a client company..." /></SelectTrigger>
                        <SelectContent>
                          {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {step === 2 && (
                    <div className="space-y-6">
                      <Label>Rota Period (Single Day)</Label>
                      <div className="flex justify-center p-4 bg-card border rounded-xl shadow-sm">
                        <Calendar mode="single" selected={formData.date} onSelect={(d) => d && setFormData({...formData, date: d})} className="rounded-md" />
                      </div>
                    </div>
                  )}
                  {step === 3 && (
                    <div className="space-y-4">
                      <Label>Select Workers ({formData.selectedWorkers.length})</Label>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {workers.map(worker => (
                          <div key={worker.id} onClick={() => toggleWorker(worker.id)} className={cn("flex items-center gap-3 p-3 rounded-lg border cursor-pointer", formData.selectedWorkers.includes(worker.id) ? "bg-primary/5 border-primary" : "hover:bg-muted")}>
                            <Checkbox checked={formData.selectedWorkers.includes(worker.id)} />
                            <div><div className="text-sm font-semibold">{worker.name}</div><div className="text-[10px] text-muted-foreground">{worker.position}</div></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {step === 4 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div><Label>Start Time</Label><Input type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} /></div>
                        <div><Label>End Time</Label><Input type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} /></div>
                      </div>
                      <div><Label>Break Duration (Minutes)</Label><Input type="number" value={formData.breakTime} onChange={e => setFormData({...formData, breakTime: e.target.value})} /></div>
                      <div><Label>Notes</Label><Textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} /></div>
                    </div>
                  )}
                  {step === 5 && (
                    <div className="space-y-6">
                      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 space-y-4">
                        <div className="font-bold text-primary">Rota Summary</div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><p className="text-muted-foreground text-xs">Company</p><p className="font-semibold">{companies.find(c => c.id === formData.companyId)?.name}</p></div>
                          <div><p className="text-muted-foreground text-xs">Date</p><p className="font-semibold">{format(formData.date, "PPP")}</p></div>
                          <div><p className="text-muted-foreground text-xs">Shift Time</p><p className="font-semibold">{formData.startTime} - {formData.endTime} ({formData.breakTime}m break)</p></div>
                          <div><p className="text-muted-foreground text-xs">Workers Assigned</p><p className="font-semibold">{formData.selectedWorkers.length} Employees</p></div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="bg-muted/50 p-6 flex justify-between">
                  <Button variant="ghost" onClick={handleBack} disabled={step === 1}><ChevronLeft className="h-4 w-4 mr-2" /> Back</Button>
                  {step < 5 ? <Button onClick={handleNext}>Continue <ChevronRight className="h-4 w-4 ml-2" /></Button> : 
                   <Button onClick={handlePublish} disabled={publishing}><Send className="h-4 w-4 mr-2" /> Publish</Button>}
                </CardFooter>
              </Card>
            </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          {/* Publish Success Banner */}
          {publishBanner && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200 animate-in slide-in-from-top-2 duration-400">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-green-800">Rota Published Successfully!</p>
                <p className="text-xs text-green-700">
                  <strong>{publishBanner.count} worker{publishBanner.count !== 1 ? "s" : ""}</strong> assigned to <strong>{publishBanner.company}</strong> on <strong>{publishBanner.date}</strong> — notifications sent.
                </p>
              </div>
              <Button size="sm" variant="ghost" className="text-green-700 hover:bg-green-100" onClick={() => setPublishBanner(null)}>Dismiss</Button>
            </div>
          )}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">Daily Schedule</CardTitle>
              <div className="flex items-center gap-4">
                <Select value={filterCompany} onValueChange={setFilterCompany}>
                  <SelectTrigger className="w-[200px]"><SelectValue placeholder="All Companies" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="flex items-center border rounded-md">
                  <Button variant="ghost" size="icon" onClick={() => setScheduleDate(subDays(scheduleDate, 1))}><ChevronLeft className="h-4 w-4" /></Button>
                  <div className="px-4 font-semibold text-sm w-[140px] text-center">{format(scheduleDate, "dd MMM yyyy")}</div>
                  <Button variant="ghost" size="icon" onClick={() => setScheduleDate(addDays(scheduleDate, 1))}><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingShifts ? (
                <div className="text-center py-10 text-muted-foreground">Loading schedule...</div>
              ) : dateShifts.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground border border-dashed rounded-lg bg-muted/20">
                  <CalendarIcon className="h-10 w-10 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">No shifts scheduled for this date</p>
                  <p className="text-xs mt-1">Switch tabs to publish a new rota.</p>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 font-semibold border-b">
                      <tr>
                        <th className="p-4">Worker</th>
                        <th className="p-4">Company</th>
                        <th className="p-4">Time</th>
                        <th className="p-4">Break</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {dateShifts.map((shift) => (
                        <tr key={shift.id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-4">
                            <div className="font-semibold">{shift.worker?.firstName} {shift.worker?.lastName}</div>
                            <div className="text-xs text-muted-foreground">{shift.worker?.position || "Worker"}</div>
                          </td>
                          <td className="p-4"><div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-muted-foreground"/> {shift.job?.company?.name || shift.job?.location}</div></td>
                          <td className="p-4"><div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground"/> {format(new Date(shift.startTime), "HH:mm")} - {format(new Date(shift.endTime), "HH:mm")}</div></td>
                          <td className="p-4">{shift.breakTime}m</td>
                          <td className="p-4">
                            <Badge variant="outline" className={cn("text-[10px]", statusStyle[shift.status] || statusStyle.UNASSIGNED)}>{shift.status}</Badge>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(shift)} title="Edit Shift"><Edit className="h-4 w-4 text-blue-600" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => setReassigningShift(shift)} title="Reassign Worker"><ArrowLeftRight className="h-4 w-4 text-orange-600" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeletingShift(shift)} title="Delete Shift"><Trash2 className="h-4 w-4 text-red-600" /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Shift Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Shift</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Start Time</Label><Input type="time" value={editData.startTime} onChange={e => setEditData({...editData, startTime: e.target.value})} /></div>
              <div><Label>End Time</Label><Input type="time" value={editData.endTime} onChange={e => setEditData({...editData, endTime: e.target.value})} /></div>
            </div>
            <div><Label>Break Duration (m)</Label><Input type="number" value={editData.breakTime} onChange={e => setEditData({...editData, breakTime: Number(e.target.value)})} /></div>
            <div>
              <Label>Status</Label>
              <Select value={editData.status} onValueChange={v => setEditData({...editData, status: v})}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ASSIGNED">Assigned</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Notes</Label><Textarea value={editData.notes} onChange={e => setEditData({...editData, notes: e.target.value})} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deletingShift} onOpenChange={(open) => !open && setDeletingShift(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Shift</DialogTitle><DialogDescription>Are you sure you want to delete this shift? This action cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingShift(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reassign Worker Dialog */}
      <Dialog open={!!reassigningShift} onOpenChange={(open) => { if(!open) setReassigningShift(null); setNewWorkerId("") }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reassign Worker</DialogTitle><DialogDescription>Select a new worker for this shift.</DialogDescription></DialogHeader>
          <div className="py-4 space-y-4">
            <Label>New Worker</Label>
            <Select value={newWorkerId} onValueChange={setNewWorkerId}>
              <SelectTrigger><SelectValue placeholder="Select worker..." /></SelectTrigger>
              <SelectContent>
                {workers.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReassigningShift(null)}>Cancel</Button>
            <Button onClick={saveReassign} disabled={!newWorkerId}>Reassign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
