"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { User, Bell, Shield, CreditCard, Building2, ChevronRight, CheckCircle2, Moon, Sun, Globe } from "lucide-react"

const settingsSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "company", label: "Company", icon: Building2 },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = React.useState("profile")
  const [saved, setSaved] = React.useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account, preferences, and security.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="p-2">
            {settingsSections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeSection === s.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <s.icon className="h-4 w-4" />
                {s.label}
                {activeSection !== s.id && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-50" />}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/15 flex items-center justify-center text-primary text-2xl font-extrabold">
                    A
                  </div>
                  <div>
                    <Button variant="outline" size="sm" className="font-medium">Change Photo</Button>
                    <p className="text-xs text-muted-foreground mt-1.5">JPG, GIF or PNG. Max 2MB.</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">First Name</Label>
                    <Input defaultValue="Admin" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Last Name</Label>
                    <Input defaultValue="User" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Email Address</Label>
                  <Input type="email" defaultValue="admin@primestaff.co.uk" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Phone</Label>
                  <Input type="tel" defaultValue="+44 7700 900123" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Role</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>Agency Admin</option>
                    <option>Employer</option>
                    <option>Worker</option>
                  </select>
                </div>
                <div className="flex items-center justify-between pt-2">
                  {saved && (
                    <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                      <CheckCircle2 className="h-4 w-4" /> Changes saved!
                    </span>
                  )}
                  <Button onClick={handleSave} className="ml-auto font-semibold shadow-md shadow-primary/20">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "New shift confirmations", desc: "Get notified when a shift is confirmed" },
                  { label: "Document expiry alerts", desc: "7-day warning before documents expire" },
                  { label: "Payroll processed", desc: "Notify when weekly payroll is run" },
                  { label: "New job applications", desc: "Alert when someone applies to your post" },
                  { label: "System updates", desc: "Platform news and maintenance notices" },
                ].map((n) => (
                  <div key={n.label} className="flex items-center justify-between p-4 rounded-xl bg-muted/40">
                    <div>
                      <p className="text-sm font-semibold">{n.label}</p>
                      <p className="text-xs text-muted-foreground">{n.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-10 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:left-0.5 after:top-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeSection === "security" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold">Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Current Password</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">New Password</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Confirm New Password</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <Button className="font-semibold shadow-md shadow-primary/20">Update Password</Button>
                </div>
                <div className="border-t pt-5">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40">
                    <div>
                      <p className="text-sm font-semibold">Two-Factor Authentication</p>
                      <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline" size="sm" className="font-medium">Enable 2FA</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {(activeSection === "billing" || activeSection === "company") && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold">{activeSection === "billing" ? "Billing & Plan" : "Company Details"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeSection === "billing" && (
                  <>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <div>
                        <Badge className="bg-primary text-primary-foreground mb-1">Growth Plan</Badge>
                        <p className="text-sm text-muted-foreground">£99/month · Renews 01 Jul 2025</p>
                      </div>
                      <Button variant="outline" size="sm">Manage Plan</Button>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Billing Email</Label>
                      <Input defaultValue="billing@primestaff.co.uk" />
                    </div>
                  </>
                )}
                {activeSection === "company" && (
                  <>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Company Name</Label>
                      <Input defaultValue="PrimeStaff Solutions Ltd" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Company Number</Label>
                      <Input defaultValue="12345678" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">VAT Number</Label>
                      <Input defaultValue="GB123456789" />
                    </div>
                  </>
                )}
                <Button onClick={handleSave} className="font-semibold shadow-md shadow-primary/20">
                  {saved ? <><CheckCircle2 className="mr-2 h-4 w-4" /> Saved!</> : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
