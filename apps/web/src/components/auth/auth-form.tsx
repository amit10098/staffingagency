"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Building2, User, Users } from "lucide-react"
import { api, setAuth, ApiError } from "@/lib/api"

interface AuthFormProps {
  type: "login" | "register"
  defaultRole?: "worker" | "employer" | "admin"
}

export function AuthForm({ type, defaultRole }: AuthFormProps) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [showPassword, setShowPassword] = React.useState(false)
  const [role, setRole] = React.useState<"worker" | "employer" | "admin">(defaultRole || "worker")
  const [step, setStep] = React.useState(1)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (type === "login") {
        const result = await api.login(email, password)
        setAuth(result.access_token, result.user)

        const routes = {
          worker: "/dashboard/employee",
          employer: "/dashboard/employer",
          admin: "/dashboard/admin",
        }
        const frontendRole = result.user.role === "SUPER_ADMIN"
          ? "admin"
          : result.user.role === "EMPLOYER"
          ? "employer"
          : "worker"
        window.location.href = routes[frontendRole]
      } else if (step === 1) {
        setStep(2)
      } else {
        setError("Registration is not yet connected to the API. Please use a seeded account.")
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  const roleOptions = [
    { id: "worker", label: "Job Seeker", desc: "Find shifts & manage my work", icon: User },
    { id: "employer", label: "Employer", desc: "Hire and manage my team", icon: Building2 },
    { id: "admin", label: "Agency Admin", desc: "Manage the full platform", icon: Users },
  ]

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm group-hover:scale-110 transition-transform">
            PS
          </div>
          <span className="text-2xl font-bold"><span className="text-primary">Prime</span>Staff</span>
        </Link>
        <h1 className="text-3xl font-extrabold mb-2">
          {type === "login" ? "Welcome back" : step === 2 ? "Almost there!" : "Join PrimeStaff"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {type === "login"
            ? "Sign in to your account"
            : step === 2
            ? "Complete your profile details"
            : "Create your free account in 2 minutes"}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {type === "register" && step === 1 && (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">I am a...</Label>
              <div className="grid grid-cols-3 gap-2">
                {roleOptions.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as "worker" | "employer" | "admin")}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-medium transition-all ${role === r.id ? "border-primary bg-primary/8 text-primary" : "border-border hover:border-primary/30 text-muted-foreground"}`}
                  >
                    <r.icon className="h-5 w-5" />
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                <Input id="firstName" placeholder="Alex" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                <Input id="lastName" placeholder="Clarke" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email-reg" className="text-sm font-medium">Email Address</Label>
              <Input id="email-reg" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.co.uk" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password-reg" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input id="password-reg" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" required className="pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </>
        )}

        {type === "register" && step === 2 && (
          <>
            {role === "employer" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Company Name</Label>
                  <Input placeholder="Acme Ltd" required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Industry</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>Healthcare</option>
                    <option>Hospitality</option>
                    <option>Logistics</option>
                  </select>
                </div>
              </>
            )}
            {role === "worker" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Primary Sector</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>Healthcare</option>
                    <option>Hospitality</option>
                    <option>Logistics</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">City / Town</Label>
                  <Input placeholder="Manchester" required />
                </div>
              </>
            )}
            <div className="flex items-start gap-2 pt-1">
              <input type="checkbox" id="terms" required className="mt-0.5 h-4 w-4 rounded border-input text-primary" />
              <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
                I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
              </label>
            </div>
          </>
        )}

        {type === "login" && (
          <>
            {!defaultRole && (
              <div className="space-y-2 mb-4">
                <Label className="text-sm font-semibold">Sign in as...</Label>
                <div className="grid grid-cols-3 gap-2">
                  {roleOptions.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id as "worker" | "employer" | "admin")}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-[10px] font-medium transition-all ${role === r.id ? "border-primary bg-primary/5 text-primary shadow-sm" : "border-border hover:border-primary/20 text-muted-foreground"}`}
                    >
                      <r.icon className="h-4 w-4" />
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.co.uk" required />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Link href="/contact" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required className="pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </>
        )}

        <Button
          type="submit"
          className="w-full h-12 font-semibold text-base shadow-lg shadow-primary/25"
          disabled={loading}
        >
          {loading ? "Processing..." : type === "login" ? "Sign In to Dashboard" : step === 1 ? "Continue →" : "Create My Account"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {type === "login" ? "New to PrimeStaff?" : "Already have an account?"}{" "}
          <Link href={type === "login" ? "/register" : "/login"} className="text-primary hover:underline font-semibold">
            {type === "login" ? "Create free account" : "Sign in"}
          </Link>
        </p>
      </form>
    </div>
  )
}
