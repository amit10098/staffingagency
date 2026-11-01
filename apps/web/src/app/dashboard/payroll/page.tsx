"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Download, TrendingUp, CheckCircle2, Clock } from "lucide-react"
import { api } from "@/lib/api"

export default function PayrollPage() {
  const [role, setRole] = React.useState<'admin' | 'employer' | 'worker'>('admin')
  const [payslips, setPayslips] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as 'admin' | 'employer' | 'worker' | null
    if (storedRole) setRole(storedRole)

    const fetchPayslips = async () => {
      try {
        const data = storedRole === 'worker' ? await api.getMyPayslips() : await api.getPayslips()
        setPayslips(data)
      } catch {
        setPayslips([])
      } finally {
        setLoading(false)
      }
    }
    fetchPayslips()
  }, [])

  const totalGross = payslips.reduce((sum, p) => sum + p.grossPay, 0)
  const totalNet = payslips.reduce((sum, p) => sum + p.netPay, 0)
  const totalHours = payslips.reduce((sum, p) => sum + (p.hoursWorked || 0), 0)

  const downloadPayslip = async (id: string, period: string) => {
    try {
      await api.downloadFile(`/payroll/payslips/${id}/download`, `payslip-${period}.pdf`)
    } catch {
      alert('Download failed')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">{role === 'worker' ? 'My Payslips' : 'Payroll Management'}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {role === 'worker' ? 'View and download payslips sent by your administrator.' : 'Manage company-wide payroll and payslips.'}
          </p>
        </div>
      </div>

      {role !== 'worker' && payslips.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: "Gross Earnings (MTD)", value: `£${totalGross.toLocaleString()}`, note: "Before tax & NI", icon: TrendingUp, color: "green" },
            { label: "Net Earnings (MTD)", value: `£${totalNet.toFixed(2)}`, note: "After deductions", icon: CreditCard, color: "blue" },
            { label: "Hours Worked (MTD)", value: `${totalHours}h`, note: "Total recorded", icon: Clock, color: "purple" },
          ].map((stat) => (
            <Card key={stat.label} className="card-hover border-0 shadow-sm">
              <CardContent className="p-6">
                <div className={`h-10 w-10 rounded-xl mb-4 flex items-center justify-center ${
                  stat.color === "green" ? "bg-green-500/10" : stat.color === "blue" ? "bg-blue-500/10" : "bg-purple-500/10"
                }`}>
                  <stat.icon className={`h-5 w-5 ${stat.color === "green" ? "text-green-500" : stat.color === "blue" ? "text-blue-500" : "text-purple-500"}`} />
                </div>
                <p className="text-3xl font-extrabold">{stat.value}</p>
                <p className="text-sm font-semibold text-muted-foreground mt-1">{stat.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-bold">{role === 'worker' ? 'Available Payslips' : 'Payslip History'}</CardTitle>
          {role === 'worker' && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              <span>Sent by Administration</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground p-4">Loading payslips...</p>
          ) : payslips.length === 0 ? (
            <p className="text-sm text-muted-foreground p-4">No payslips available yet.</p>
          ) : (
            <div className="space-y-2">
              {payslips.map((p) => (
                <div key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors border border-transparent hover:border-primary/10">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{p.period}</p>
                    <p className="text-xs text-muted-foreground">{p.hoursWorked || 0}h worked · Status: {p.status}</p>
                    {p.profile && (
                      <p className="text-xs text-muted-foreground">{p.profile.firstName} {p.profile.lastName}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold">£{p.netPay.toFixed(2)}</p>
                      <Badge className="bg-green-500/10 text-green-600 border-0 text-[10px]">
                        {p.fileUrl ? 'Verified File' : 'Calculated'}
                      </Badge>
                    </div>
                    {p.fileUrl && (
                      <Button variant="outline" size="sm" className="gap-2 font-medium" onClick={() => downloadPayslip(p.id, p.period)}>
                        <Download className="h-3.5 w-3.5" /> Download
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
