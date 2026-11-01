"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Briefcase, Filter, Search, Pencil, Trash2, Loader2, RefreshCw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"

const UK_MIN_WAGE = 12.21

const SECTOR_COLORS: Record<string, string> = {
  Healthcare: "bg-blue-500/10 text-blue-600 border-blue-200",
  Hospitality: "bg-orange-500/10 text-orange-600 border-orange-200",
  Logistics: "bg-green-500/10 text-green-600 border-green-200",
  Catering: "bg-purple-500/10 text-purple-600 border-purple-200",
  Warehouse: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  Industrial: "bg-red-500/10 text-red-600 border-red-200",
  General: "bg-gray-500/10 text-gray-600 border-gray-200",
}

const SECTOR_FILTERS = ["All", "Healthcare", "Hospitality", "Logistics", "Catering", "Warehouse"]
const JOB_TYPES = ["Temporary", "Permanent", "Contract", "Ad-Hoc"]

/** Normalised shape used throughout this page */
interface Job {
  id: string          // always a real DB CUID
  title: string
  company: string
  location: string
  type: string
  pay: string         // display string e.g. "£15.00 / hr"
  payNum: number
  sector: string
  timePosted: string
  urgent: boolean
  applicants: number
  description: string
}

/** Convert raw API response to our UI Job shape */
function apiJobToUi(j: any): Job {
  return {
    id: j.id,
    title: j.title,
    company: j.company?.name ?? "PrimeStaff Agency",
    location: j.location ?? "TBC",
    type: j.type ?? "Temporary",
    pay: `£${Number(j.payRate ?? 0).toFixed(2)} / hr`,
    payNum: Number(j.payRate ?? 0),
    sector: j.sector?.name ?? j.sector ?? "General",
    timePosted: j.createdAt
      ? new Date(j.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
      : "Recent",
    urgent: j.urgent ?? false,
    applicants: j.shifts?.length ?? 0,
    description: j.description ?? "",
  }
}

interface JobFormState {
  title: string
  sector: string
  location: string
  type: string
  payRate: string
  description: string
}

const EMPTY_FORM: JobFormState = {
  title: "",
  sector: "",
  location: "",
  type: "Temporary",
  payRate: "12.21",
  description: "",
}

function jobToForm(job: Job): JobFormState {
  return {
    title: job.title,
    sector: job.sector,
    location: job.location,
    type: job.type,
    payRate: String(job.payNum),
    description: job.description,
  }
}

/** Shared form fields for Create and Edit dialogs */
function JobFormFields({
  form,
  onChange,
}: {
  form: JobFormState
  onChange: (field: keyof JobFormState, value: string) => void
}) {
  const isPayValid = parseFloat(form.payRate) >= UK_MIN_WAGE
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="job-title">
          Job Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="job-title"
          placeholder="e.g. Registered Nurse"
          value={form.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="job-pay">
            Pay Rate (£/hr) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="job-pay"
            type="number"
            min={UK_MIN_WAGE}
            step="0.01"
            value={form.payRate}
            onChange={(e) => onChange("payRate", e.target.value)}
            className={!isPayValid ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {!isPayValid && (
            <p className="text-[10px] text-red-500 font-medium">
              Must be at least £{UK_MIN_WAGE} (Min Wage)
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="job-sector">Sector</Label>
          <Input
            id="job-sector"
            placeholder="e.g. Healthcare"
            value={form.sector}
            onChange={(e) => onChange("sector", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="job-location">Location</Label>
          <Input
            id="job-location"
            placeholder="e.g. Manchester"
            value={form.location}
            onChange={(e) => onChange("location", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="job-type">Job Type</Label>
          <select
            id="job-type"
            value={form.type}
            onChange={(e) => onChange("type", e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="job-desc">Description</Label>
        <Textarea
          id="job-desc"
          placeholder="Role responsibilities, requirements..."
          rows={3}
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>
    </div>
  )
}

export default function JobBoard() {
  const [role, setRole] = React.useState<"admin" | "employer" | "worker">("admin")
  const [search, setSearch] = React.useState("")
  const [sector, setSector] = React.useState("All")
  const [loading, setLoading] = React.useState(true)

  // Create
  const [createOpen, setCreateOpen] = React.useState(false)
  const [createForm, setCreateForm] = React.useState<JobFormState>(EMPTY_FORM)
  const [creating, setCreating] = React.useState(false)

  // Edit
  const [editJob, setEditJob] = React.useState<Job | null>(null)
  const [editForm, setEditForm] = React.useState<JobFormState>(EMPTY_FORM)
  const [saving, setSaving] = React.useState(false)

  // Delete
  const [deleteJobId, setDeleteJobId] = React.useState<string | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  const [toast, setToast] = React.useState<{ type: "success" | "error"; msg: string } | null>(null)
  const [jobs, setJobs] = React.useState<Job[]>([])

  // ── Bootstrap ────────────────────────────────────────────────────────────
  React.useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as typeof role | null
    if (storedRole) setRole(storedRole)
  }, [])

  const loadJobs = React.useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.getJobs()
      setJobs(data.map(apiJobToUi))
    } catch {
      // Not logged in or API unavailable — show empty state
      setJobs([])
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => { loadJobs() }, [loadJobs])

  // Auto-dismiss toast
  React.useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  const isCreateValid = createForm.title.trim() !== "" && parseFloat(createForm.payRate) >= UK_MIN_WAGE
  const isEditValid = editForm.title.trim() !== "" && parseFloat(editForm.payRate) >= UK_MIN_WAGE

  const filtered = jobs.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
    const matchSector = sector === "All" || j.sector === sector
    return matchSearch && matchSector
  })

  // ── Create ────────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!isCreateValid || creating) return
    setCreating(true)
    try {
      const created = await api.createJob({
        title: createForm.title.trim(),
        description: createForm.description.trim() || undefined,
        payRate: parseFloat(createForm.payRate),
        sector: createForm.sector.trim() || undefined,
        location: createForm.location.trim() || undefined,
        type: createForm.type || undefined,
      })
      // Add the real returned record to state (with its DB id)
      setJobs((prev) => [apiJobToUi(created), ...prev])
      setToast({ type: "success", msg: `"${createForm.title}" posted successfully!` })
      setCreateForm(EMPTY_FORM)
      setCreateOpen(false)
    } catch (err: any) {
      setToast({ type: "error", msg: err?.message || "Failed to create job." })
    } finally {
      setCreating(false)
    }
  }

  // ── Edit ──────────────────────────────────────────────────────────────────
  const openEdit = (job: Job) => {
    setEditJob(job)
    setEditForm(jobToForm(job))
  }

  const handleSave = async () => {
    if (!editJob || !isEditValid || saving) return
    setSaving(true)
    try {
      const updated = await api.updateJob(editJob.id, {
        title: editForm.title.trim(),
        description: editForm.description.trim() || undefined,
        payRate: parseFloat(editForm.payRate),
        sector: editForm.sector.trim() || undefined,
        location: editForm.location.trim() || undefined,
        type: editForm.type || undefined,
      })
      setJobs((prev) =>
        prev.map((j) => (j.id === editJob.id ? apiJobToUi(updated) : j))
      )
      setToast({ type: "success", msg: `"${editForm.title}" updated successfully!` })
      setEditJob(null)
    } catch (err: any) {
      setToast({ type: "error", msg: err?.message || "Failed to update job." })
    } finally {
      setSaving(false)
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    setDeleting(true)
    try {
      await api.deleteJob(id)
      setJobs((prev) => prev.filter((j) => j.id !== id))
      setToast({ type: "success", msg: "Job post deleted." })
    } catch (err: any) {
      setToast({ type: "error", msg: err?.message || "Failed to delete job." })
    } finally {
      setDeleting(false)
      setDeleteJobId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-sm font-medium border animate-in slide-in-from-top-2 ${
            toast.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">
            {role === "worker" ? "My Assigned Jobs" : "Job Management"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {role === "worker"
              ? "View and manage roles you have been assigned to."
              : "Create, edit and manage recruitment opportunities."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh */}
          <Button variant="outline" size="sm" onClick={loadJobs} disabled={loading} className="gap-1.5">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          {/* Post New Job — admin only */}
          {role === "admin" && (
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger
                render={
                  <Button className="font-semibold shadow-md shadow-primary/20 gap-2">
                    + Post New Job
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                  <DialogTitle>Post a New Job</DialogTitle>
                  <DialogDescription>
                    Fill in the details below. UK National Living Wage of £{UK_MIN_WAGE}/hr is enforced.
                  </DialogDescription>
                </DialogHeader>
                <JobFormFields
                  form={createForm}
                  onChange={(field, value) => setCreateForm((p) => ({ ...p, [field]: value }))}
                />
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => { setCreateOpen(false); setCreateForm(EMPTY_FORM) }}
                    disabled={creating}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreate} disabled={!isCreateValid || creating}>
                    {creating
                      ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Posting...</>
                      : "Create Posting"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editJob} onOpenChange={(open) => { if (!open) setEditJob(null) }}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Edit Job Post</DialogTitle>
            <DialogDescription>Update job details. Changes are saved immediately.</DialogDescription>
          </DialogHeader>
          <JobFormFields
            form={editForm}
            onChange={(field, value) => setEditForm((p) => ({ ...p, [field]: value }))}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditJob(null)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!isEditValid || saving}>
              {saving
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search + Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, companies..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {SECTOR_FILTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSector(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    sector === s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="text-foreground font-semibold">{filtered.length}</span> roles found
        </p>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <Filter className="h-3 w-3" /> Sort: Newest
        </Button>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="animate-pulse space-y-3">
                  <div className="flex gap-2">
                    <div className="h-5 w-20 rounded-full bg-muted" />
                    <div className="h-5 w-16 rounded bg-muted" />
                  </div>
                  <div className="h-5 w-2/3 rounded bg-muted" />
                  <div className="h-4 w-1/3 rounded bg-muted" />
                  <div className="flex gap-4">
                    <div className="h-4 w-24 rounded bg-muted" />
                    <div className="h-4 w-20 rounded bg-muted" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Job Cards */}
      {!loading && (
        <div className="space-y-4">
          {filtered.map((job) => (
            <Card key={job.id} className="card-hover group transition-all">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                          SECTOR_COLORS[job.sector] || "bg-muted text-muted-foreground"
                        }`}
                      >
                        {job.sector}
                      </span>
                      <Badge variant="outline" className="text-[11px]">{job.type}</Badge>
                      {job.urgent && (
                        <Badge className="text-[11px] bg-red-500 hover:bg-red-600 text-white border-0">
                          🔥 Urgent
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">{job.timePosted}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm font-semibold text-primary mb-3">{job.company}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />{job.location}
                      </span>
                      <span className="flex items-center gap-1.5 font-semibold text-foreground">
                        💷 {job.pay}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs">
                        <Briefcase className="h-3.5 w-3.5" />{job.applicants} applied
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 shrink-0">
                    {role === "worker" ? (
                      <>
                        <Button className="flex-1 sm:flex-none sm:w-28 font-semibold text-sm shadow-md shadow-primary/15">
                          Apply Now
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs">
                          Save
                        </Button>
                      </>
                    ) : role === "admin" ? (
                      <>
                        {/* Edit */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-none text-xs font-bold text-primary border-primary/20 hover:bg-primary/5 gap-1.5"
                          onClick={() => openEdit(job)}
                        >
                          <Pencil className="h-3 w-3" /> Edit
                        </Button>

                        {/* Delete with inline confirm */}
                        {deleteJobId === job.id ? (
                          <div className="flex gap-1.5">
                            <Button
                              size="sm"
                              variant="destructive"
                              className="text-xs font-bold h-8 px-2.5"
                              onClick={() => handleDelete(job.id)}
                              disabled={deleting}
                            >
                              {deleting
                                ? <Loader2 className="h-3 w-3 animate-spin" />
                                : "Confirm"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-8 px-2.5"
                              onClick={() => setDeleteJobId(null)}
                              disabled={deleting}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 sm:flex-none text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 gap-1.5"
                            onClick={() => setDeleteJobId(job.id)}
                          >
                            <Trash2 className="h-3 w-3" /> Delete
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button variant="outline" size="sm" className="text-xs">
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && !loading && (
            <div className="text-center py-16 text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium text-base mb-1">No jobs found</p>
              <p className="text-sm">
                {role === "admin"
                  ? 'Click "+ Post New Job" to create your first job post.'
                  : "No roles have been assigned to you yet."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
