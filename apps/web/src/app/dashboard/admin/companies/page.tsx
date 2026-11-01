"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  Building2, Plus, Search, MoreVertical, 
  MapPin, User, Phone, Mail, CheckCircle2, XCircle,
  Calendar, Clock, Trash2, Pencil
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

type Company = {
  id: string
  name: string
  industry: string
  contactPerson: string
  email: string
  phone: string
  address: string
  status: string
}

export default function CompaniesPage() {
  const router = useRouter()
  const [companies, setCompanies] = React.useState<Company[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [editingCompany, setEditingCompany] = React.useState<Company | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<Company | null>(null)
  const [deleting, setDeleting] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [newCompany, setNewCompany] = React.useState({
    name: "", industry: "Hospitality", contactPerson: "", email: "", contactNumber: "", address: ""
  })
  const [loading, setLoading] = React.useState(true)

  const fetchCompanies = React.useCallback(async () => {
    try {
      const data = await api.getCompanies()
      setCompanies(data.map((c: any) => ({
        id: c.id,
        name: c.name,
        industry: c.industry,
        contactPerson: c.contactPerson || '—',
        email: c.email || '—',
        phone: c.contactNumber || '—',
        address: c.address || '—',
        status: c.isActive ? 'Active' : 'Inactive',
      })))
    } catch {
      setCompanies([])
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => { fetchCompanies() }, [fetchCompanies])

  const handleAddCompany = async () => {
    setSaving(true)
    try {
      await api.createCompany({
        name: newCompany.name,
        industry: newCompany.industry,
        contactPerson: newCompany.contactPerson,
        email: newCompany.email,
        contactNumber: newCompany.contactNumber,
        address: newCompany.address,
      })
      setIsAddModalOpen(false)
      setNewCompany({ name: "", industry: "Hospitality", contactPerson: "", email: "", contactNumber: "", address: "" })
      await fetchCompanies()
    } catch (err: any) {
      alert(err.message || 'Failed to create company')
    } finally {
      setSaving(false)
    }
  }

  const handleEditCompany = async () => {
    if (!editingCompany) return
    setSaving(true)
    try {
      await api.updateCompany(editingCompany.id, {
        name: editingCompany.name,
        industry: editingCompany.industry,
        contactPerson: editingCompany.contactPerson,
        email: editingCompany.email,
        contactNumber: editingCompany.phone,
        address: editingCompany.address,
      })
      setIsEditModalOpen(false)
      setEditingCompany(null)
      await fetchCompanies()
    } catch (err: any) {
      alert(err.message || 'Failed to update company')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCompany = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.deleteCompany(deleteTarget.id)
      setDeleteTarget(null)
      await fetchCompanies()
    } catch (err: any) {
      alert(err.message || 'Failed to delete company')
    } finally {
      setDeleting(false)
    }
  }

  const openEdit = (company: Company) => {
    setEditingCompany({ ...company })
    setIsEditModalOpen(true)
  }

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activeCount = companies.filter(c => c.status === "Active").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
          <p className="text-muted-foreground">Manage your client companies, their rotas and attendance records.</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger render={
            <Button className="gap-2 shadow-lg hover:shadow-primary/25 transition-all" id="add-company-btn">
              <Plus className="h-4 w-4" /> Add New Company
            </Button>
          } />
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Company</DialogTitle>
              <DialogDescription>
                Enter the details for the new client company. These details will be used for rota assignments and communications.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-5 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Company Name</Label>
                <Input id="name" value={newCompany.name} onChange={(e) => setNewCompany({...newCompany, name: e.target.value})} placeholder="Grand Hotel" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="industry" className="text-right">Industry</Label>
                <Input id="industry" value={newCompany.industry} onChange={(e) => setNewCompany({...newCompany, industry: e.target.value})} placeholder="Hospitality" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">Address</Label>
                <Input id="address" value={newCompany.address} onChange={(e) => setNewCompany({...newCompany, address: e.target.value})} placeholder="Full Postal Address" className="col-span-3" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="contact">Contact Person</Label>
                  <Input id="contact" value={newCompany.contactPerson} onChange={(e) => setNewCompany({...newCompany, contactPerson: e.target.value})} placeholder="John Doe" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={newCompany.contactNumber} onChange={(e) => setNewCompany({...newCompany, contactNumber: e.target.value})} placeholder="0161..." />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" value={newCompany.email} onChange={(e) => setNewCompany({...newCompany, email: e.target.value})} placeholder="contact@company.com" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddCompany} disabled={!newCompany.name || saving}>
                {saving ? "Creating..." : "Create Company"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{companies.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{activeCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{companies.length - activeCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search companies..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[260px]">Company</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Quick Links</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Loading companies...</TableCell>
              </TableRow>
            ) : filteredCompanies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  {searchTerm ? "No companies match your search." : "No companies yet. Add your first client company."}
                </TableCell>
              </TableRow>
            ) : filteredCompanies.map((company) => (
              <TableRow key={company.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">{company.name}</div>
                      <div className="text-xs text-muted-foreground">{company.industry}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-3 w-3 text-muted-foreground" /> {company.contactPerson}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" /> {company.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" /> {company.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {company.address}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={company.status === "Active" ? "secondary" : "outline"} className={
                    company.status === "Active" 
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0" 
                      : "bg-muted text-muted-foreground hover:bg-muted border-0"
                  }>
                    {company.status === "Active" ? (
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                    ) : (
                      <XCircle className="mr-1 h-3 w-3" />
                    )}
                    {company.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs gap-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                      onClick={() => router.push(`/dashboard/admin/rota?company=${company.id}`)}
                    >
                      <Calendar className="h-3 w-3" /> Rota
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs gap-1 border-amber-200 text-amber-700 hover:bg-amber-50"
                      onClick={() => router.push(`/dashboard/admin/attendance?company=${company.id}`)}
                    >
                      <Clock className="h-3 w-3" /> Attendance
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    } />
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => openEdit(company)}>
                        <Pencil className="h-3.5 w-3.5 mr-2" /> Edit Company
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/rota?company=${company.id}`)}>
                        <Calendar className="h-3.5 w-3.5 mr-2" /> View Rota
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/attendance?company=${company.id}`)}>
                        <Clock className="h-3.5 w-3.5 mr-2" /> View Attendance
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteTarget(company)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete Company
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Company Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>Update the details for {editingCompany?.name}.</DialogDescription>
          </DialogHeader>
          {editingCompany && (
            <div className="grid gap-5 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Company Name</Label>
                <Input value={editingCompany.name} onChange={(e) => setEditingCompany({...editingCompany, name: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Industry</Label>
                <Input value={editingCompany.industry} onChange={(e) => setEditingCompany({...editingCompany, industry: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Address</Label>
                <Input value={editingCompany.address === '—' ? '' : editingCompany.address} onChange={(e) => setEditingCompany({...editingCompany, address: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Contact Person</Label>
                  <Input value={editingCompany.contactPerson === '—' ? '' : editingCompany.contactPerson} onChange={(e) => setEditingCompany({...editingCompany, contactPerson: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input value={editingCompany.phone === '—' ? '' : editingCompany.phone} onChange={(e) => setEditingCompany({...editingCompany, phone: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Email</Label>
                <Input type="email" value={editingCompany.email === '—' ? '' : editingCompany.email} onChange={(e) => setEditingCompany({...editingCompany, email: e.target.value})} className="col-span-3" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleEditCompany} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
              This will permanently remove all associated jobs, shifts, and attendance records.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCompany} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete Company"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
