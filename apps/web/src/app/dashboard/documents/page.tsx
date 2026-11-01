"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckCircle, Clock, AlertCircle, Upload, Download, Shield, Plus } from "lucide-react"
import { api, getAuthUser } from "@/lib/api"

const statusConfig: Record<string, { badge: string; icon: React.ReactNode; bg: string }> = {
  APPROVED: {
    badge: "bg-green-500/10 text-green-700 border-green-200",
    icon: <CheckCircle className="h-3.5 w-3.5 text-green-500" />,
    bg: "border-l-green-400",
  },
  PENDING: {
    badge: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
    icon: <Clock className="h-3.5 w-3.5 text-yellow-500" />,
    bg: "border-l-yellow-400",
  },
  REJECTED: {
    badge: "bg-red-500/10 text-red-700 border-red-200",
    icon: <AlertCircle className="h-3.5 w-3.5 text-red-500" />,
    bg: "border-l-red-400",
  },
}

export default function DocumentManagement() {
  const [dragging, setDragging] = React.useState(false)
  const [role, setRole] = React.useState<'admin' | 'employer' | 'worker'>('admin')
  const [documents, setDocuments] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [uploading, setUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const fetchDocuments = React.useCallback(async () => {
    try {
      const storedRole = localStorage.getItem('userRole')
      const data = storedRole === 'worker' ? await api.getMyDocuments() : await api.getDocuments()
      setDocuments(data)
    } catch {
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as 'admin' | 'employer' | 'worker' | null
    if (storedRole) setRole(storedRole)
    fetchDocuments()
  }, [fetchDocuments])

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return
    const user = getAuthUser()
    if (!user?.profile?.id) {
      alert('Profile not found')
      return
    }

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('profileId', user.profile.id)
        formData.append('type', file.name.split('.').pop()?.toUpperCase() || 'Document')
        await api.uploadDocument(formData)
      }
      await fetchDocuments()
    } catch (err: any) {
      alert(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleVerify = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await api.verifyDocument(id, status)
      await fetchDocuments()
    } catch (err: any) {
      alert(err.message || 'Verification failed')
    }
  }

  const overview = [
    { label: "Approved", count: documents.filter(d => d.status === "APPROVED").length, color: "green" },
    { label: "Pending", count: documents.filter(d => d.status === "PENDING").length, color: "yellow" },
    { label: "Rejected", count: documents.filter(d => d.status === "REJECTED").length, color: "red" },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">{role === 'worker' ? 'My Documents' : 'Compliance & Documents'}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {role === 'worker' ? 'Manage your personal documents and certifications.' : 'Manage employee RTW documents and certifications.'}
          </p>
        </div>
        {role === 'worker' && (
          <Button className="font-semibold shadow-md shadow-primary/20 gap-2" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <Plus className="h-4 w-4" /> {uploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        )}
        <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={(e) => handleUpload(e.target.files)} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {overview.map((item) => (
          <Card key={item.label} className={`border-l-4 ${item.color === "green" ? "border-l-green-400" : item.color === "yellow" ? "border-l-yellow-400" : "border-l-red-400"}`}>
            <CardContent className="p-4">
              <p className="text-2xl font-extrabold">{item.count}</p>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {role === 'worker' && (
        <div
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/30"}`}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleUpload(e.dataTransfer.files) }}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className={`h-10 w-10 mx-auto mb-3 transition-colors ${dragging ? "text-primary" : "text-muted-foreground"}`} />
          <p className="font-semibold mb-1">Drop files here or click to upload</p>
          <p className="text-sm text-muted-foreground">PDF, JPG, PNG · Max 10MB per file</p>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-bold">{role === 'worker' ? 'My Documents' : 'All Documents'}</CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span>Secure file access with role-based permissions</span>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground p-4">Loading documents...</p>
          ) : documents.length === 0 ? (
            <p className="text-sm text-muted-foreground p-4">No documents uploaded yet.</p>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => {
                const config = statusConfig[doc.status] || statusConfig.PENDING
                return (
                  <div key={doc.id} className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border-l-4 bg-muted/20 hover:bg-muted/40 transition-colors ${config.bg}`}>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{doc.type}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                          {doc.profile && (
                            <span className="text-xs text-muted-foreground">{doc.profile.firstName} {doc.profile.lastName}</span>
                          )}
                          {doc.expiryDate && (
                            <span className="text-xs text-muted-foreground">Expires: {new Date(doc.expiryDate).toLocaleDateString('en-GB')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`text-xs whitespace-nowrap flex items-center gap-1 ${config.badge}`}>
                        {config.icon}
                        {doc.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" onClick={() => api.downloadFile(`/documents/${doc.id}/download`, `${doc.type}.pdf`)}>
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        {role === 'admin' && doc.status === 'PENDING' && (
                          <>
                            <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => handleVerify(doc.id, 'APPROVED')}>Approve</Button>
                            <Button size="sm" variant="outline" className="text-xs h-8 text-destructive" onClick={() => handleVerify(doc.id, 'REJECTED')}>Reject</Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
