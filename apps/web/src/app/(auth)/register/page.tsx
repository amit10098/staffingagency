import { AuthForm } from "@/components/auth/auth-form"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col relative overflow-hidden" style={{background: "linear-gradient(135deg, oklch(0.52 0.22 264) 0%, oklch(0.62 0.20 220) 100%)"}}>
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-20 left-10 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="relative z-10 flex flex-col h-full p-12">
          <Link href="/" className="flex items-center gap-2 mb-auto">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-sm backdrop-blur">PS</div>
            <span className="text-xl font-bold text-white">PrimeStaff</span>
          </Link>
          <div className="mb-auto py-12">
            <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
              Start your journey<br />with PrimeStaff
            </h2>
            <p className="text-white/75 text-lg mb-10 leading-relaxed">
              Whether you're looking to hire great people or find great work — we've got you covered.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { n: "500+", l: "Active Clients" },
                { n: "10k+", l: "Verified Workers" },
                { n: "25k+", l: "Shifts Filled" },
                { n: "98%", l: "Fill Rate" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl bg-white/10 backdrop-blur p-4">
                  <p className="text-2xl font-extrabold text-white">{s.n}</p>
                  <p className="text-xs text-white/70 mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-auto pt-8 border-t border-white/20">
            <p className="text-white/60 text-sm">✓ Free to register &nbsp;&nbsp; ✓ No credit card required &nbsp;&nbsp; ✓ Cancel anytime</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center px-6 py-12 bg-background overflow-y-auto">
        <AuthForm type="register" />
      </div>
    </div>
  )
}
