import { AuthForm } from "@/components/auth/auth-form"
import Link from "next/link"
import { CheckCircle2, ShieldCheck, Users, Zap } from "lucide-react"

const employerPerks = [
  "Hire top-tier vetted staff in seconds",
  "Automated timesheets and instant approvals",
  "Dedicated account management support",
  "Advanced reporting and analytics dashboard",
]

export default function EmployerLoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.52_0.22_264_/_0.15),transparent_50%)]" />
        <div className="relative z-10 flex flex-col h-full p-12">
          <Link href="/" className="flex items-center gap-2 mb-auto">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              PS
            </div>
            <span className="text-xl font-bold text-white tracking-tight">PrimeStaff <span className="text-primary-foreground/60 font-medium">Business</span></span>
          </Link>
          <div className="mb-auto">
            <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">
              Scale your workforce<br />with confidence.
            </h2>
            <div className="space-y-6">
              {employerPerks.map((perk) => (
                <div key={perk} className="flex items-start gap-4">
                  <div className="mt-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-slate-300 text-sm font-medium">{perk}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-auto pt-12 border-t border-white/10">
            <div className="flex gap-8">
              <div>
                <p className="text-2xl font-bold text-white">98%</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Fill Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md">
          <AuthForm type="login" defaultRole="employer" />
          <p className="mt-8 text-center text-xs text-muted-foreground">
            Looking for something else? <Link href="/admin/login" className="text-primary hover:underline font-medium">Agency Login</Link> or <Link href="/login" className="text-primary hover:underline font-medium">Worker Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
