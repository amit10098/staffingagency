import { AuthForm } from "@/components/auth/auth-form"
import Link from "next/link"
import { ShieldAlert, Terminal, Lock, Globe } from "lucide-react"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col relative overflow-hidden bg-slate-900 border-r border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,oklch(0.52_0.22_264_/_0.1),transparent_50%)]" />
        <div className="relative z-10 flex flex-col h-full p-12">
          <Link href="/" className="flex items-center gap-2 mb-auto">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              PS
            </div>
            <span className="text-xl font-bold text-white tracking-widest uppercase">Console</span>
          </Link>
          <div className="mb-auto space-y-8">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <ShieldAlert className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-2 leading-tight">
                Secure Administrator Access
              </h2>
              <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                Authorized personnel only. Access to this environment is strictly monitored and logged for compliance and security auditing.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <Terminal className="h-4 w-4 text-slate-500 mb-2" />
                <p className="text-xs text-slate-300 font-mono">System Status: Nominal</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <Globe className="h-4 w-4 text-slate-500 mb-2" />
                <p className="text-xs text-slate-300 font-mono">Uptime: 99.99%</p>
              </div>
            </div>
          </div>
          <div className="mt-auto flex items-center gap-2 text-slate-500 text-[10px] font-mono border-t border-white/5 pt-8">
            <Lock className="h-3 w-3" />
            <span>ENCRYPTED_SESSION_ACTIVE // AES-256</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center px-6 py-12 bg-slate-950">
        <div className="w-full max-w-md bg-slate-900/50 p-8 rounded-3xl border border-white/5 shadow-2xl">
          <AuthForm type="login" defaultRole="admin" />
          <p className="mt-8 text-center text-xs text-slate-500">
            Internal system for PrimeStaff Agency personnel.<br />
            <Link href="/login" className="text-primary hover:underline font-medium mt-2 inline-block">Return to Worker Portal</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
