import { AuthForm } from "@/components/auth/auth-form"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

const perks = [
  "Access thousands of verified jobs across the UK",
  "Real-time shift management and rota planning",
  "Automated payroll — get paid on time, every time",
  "24/7 compliance and document management",
]

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-20 right-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="relative z-10 flex flex-col h-full p-12">
          <Link href="/" className="flex items-center gap-2 mb-auto">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-sm backdrop-blur">
              PS
            </div>
            <span className="text-xl font-bold text-white">PrimeStaff</span>
          </Link>
          <div className="mb-auto">
            <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
              The UK's smartest<br />staffing platform
            </h2>
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              Trusted by 500+ companies and 10,000+ workers across the UK.
            </p>
            <ul className="space-y-4">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-3 text-white/90 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-white flex-shrink-0" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-auto pt-12 border-t border-white/20">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["S", "D", "P", "M"].map((l) => (
                  <div key={l} className="h-8 w-8 rounded-full bg-white/20 border-2 border-primary flex items-center justify-center text-white text-xs font-bold">
                    {l}
                  </div>
                ))}
              </div>
              <p className="text-white/70 text-sm">Joined by 500+ businesses this year</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center px-6 py-12 bg-background">
        <AuthForm type="login" defaultRole="worker" />
      </div>
    </div>
  )
}
