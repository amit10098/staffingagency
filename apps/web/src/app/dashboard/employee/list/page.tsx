"use client"

import * as React from "react"
import { 
  Users, Plus, Search, MoreVertical, 
  MapPin, Phone, Mail, BadgeCheck, 
  UserPlus, ShieldCheck, Briefcase
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

const initialWorkers = [
  { id: "W001", firstName: "Jordan", lastName: "Clarke", email: "jordan.c@example.com", phone: "07700 900234", position: "Lead Waiter", address: "15 Oxford Rd, Manchester", status: "Active", rtwStatus: "Approved" },
  { id: "W002", firstName: "Amelie", lastName: "Laurent", email: "a.laurent@example.com", phone: "07700 900567", position: "Events Staff", address: "22 Deansgate, Manchester", status: "Active", rtwStatus: "Approved" },
  { id: "W003", firstName: "Marcus", lastName: "Braid", email: "m.braid@example.com", phone: "07700 900890", position: "Warehouse Operative", address: "8 Salford Quays, Manchester", status: "On Leave", rtwStatus: "Pending" },
  { id: "W004", firstName: "Sarah", lastName: "Kwan", email: "s.kwan@example.com", phone: "07700 900123", position: "Chef de Partie", address: "44 Ancoats St, Manchester", status: "Inactive", rtwStatus: "Rejected" },
]

export default function EmployeeListPage() {
  const [workers, setWorkers] = React.useState(initialWorkers)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)

  const filteredWorkers = workers.filter(worker => 
    `${worker.firstName} ${worker.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.position.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active": return "bg-emerald-100 text-emerald-700 border-0"
      case "On Leave": return "bg-amber-100 text-amber-700 border-0"
      default: return "bg-muted text-muted-foreground border-0"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Management</h1>
          <p className="text-muted-foreground">Comprehensive database of all registered workers and their compliance status.</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger render={
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20">
              <UserPlus className="h-4 w-4" /> Add New Worker
            </Button>
          } />
          <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle>Register New Worker</DialogTitle>
              <DialogDescription>
                Submit initial details to create a new worker account. They will receive an email to complete their profile and document upload.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fname">First Name</Label>
                  <Input id="fname" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lname">Last Name</Label>
                  <Input id="lname" placeholder="Doe" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="07700..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pos">Position / Primary Role</Label>
                  <Input id="pos" placeholder="e.g. Waitstaff" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wid">Worker ID (Manual Entry)</Label>
                  <Input id="wid" placeholder="W-12345" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="addr">Primary Address</Label>
                <Input id="addr" placeholder="Street, City, Postcode" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsAddModalOpen(false)}>Register Worker</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-indigo-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workers.length}</div>
          </CardContent>
        </Card>
        <Card className="border-emerald-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Active Now</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">32</div>
          </CardContent>
        </Card>
        <Card className="border-amber-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Awaiting RTW</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">5</div>
          </CardContent>
        </Card>
        <Card className="border-rose-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Expired Docs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">2</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by ID, name, or role..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[120px]">Worker ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>RTW Status</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWorkers.map((worker) => (
              <TableRow key={worker.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-mono text-xs font-bold text-primary">
                  {worker.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                      {worker.firstName[0]}{worker.lastName[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{worker.firstName} {worker.lastName}</div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Mail className="h-2.5 w-2.5" /> {worker.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <Briefcase className="h-3 w-3 text-muted-foreground" /> {worker.position}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {worker.rtwStatus === "Approved" ? (
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    )}
                    <span className="text-xs text-muted-foreground">{worker.rtwStatus}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusBadge(worker.status)}>
                    {worker.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    } />
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Worker Profile</DropdownMenuLabel>
                      <DropdownMenuItem>View Performance</DropdownMenuItem>
                      <DropdownMenuItem>Verify Documents</DropdownMenuItem>
                      <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Deactivate Account</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
