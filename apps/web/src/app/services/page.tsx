import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Users, Briefcase, Clock, FileCheck, BarChart3, Sparkles, Bell, CreditCard, Shield } from "lucide-react";

const services = [
  {
    icon: Users,
    title: "Temporary Staffing",
    desc: "Fast, flexible workforce solutions for seasonal peaks, sick cover, and project-based demand. Workers available within 24 hours.",
    features: ["Same-day placement", "Fully vetted workers", "Payroll managed by us"],
    badge: "Most Popular",
    color: "blue",
  },
  {
    icon: Briefcase,
    title: "Permanent Recruitment",
    desc: "Find your next full-time star. We handle screening, interviews, and onboarding so you can focus on your business.",
    features: ["Dedicated recruiter", "3-month replacement guarantee", "Pre-screened candidates"],
    badge: null,
    color: "purple",
  },
  {
    icon: Clock,
    title: "On-Demand Shifts",
    desc: "Post a shift tonight, have a worker confirmed by morning. Our platform automates matching, booking, and confirmation.",
    features: ["AI-powered matching", "Instant confirmation", "Real-time availability"],
    badge: "New",
    color: "green",
  },
  {
    icon: FileCheck,
    title: "Compliance & RTW",
    desc: "End-to-end Right to Work checking, DBS screening, and document management. Stay audit-ready at all times.",
    features: ["Automated checks", "Digital document vault", "Expiry alerts"],
    badge: null,
    color: "orange",
  },
  {
    icon: CreditCard,
    title: "Payroll Management",
    desc: "Weekly payroll processing, pension enrolment, and HMRC reporting — fully handled by our dedicated payroll team.",
    features: ["BACS payments", "Auto-enrolment pension", "Monthly payslips"],
    badge: null,
    color: "red",
  },
  {
    icon: BarChart3,
    title: "Workforce Analytics",
    desc: "Dashboards that give you real-time visibility on headcount, fill rates, costs, and compliance across all sites.",
    features: ["Custom reports", "Cost forecasting", "Site-level breakdown"],
    badge: null,
    color: "indigo",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    desc: "Automated alerts for shift confirmations, worker arrivals, document expiry, and timesheet approvals.",
    features: ["SMS & email alerts", "Push notifications", "Escalation rules"],
    badge: null,
    color: "teal",
  },
  {
    icon: Sparkles,
    title: "AI Candidate Matching",
    desc: "Our AI engine parses CVs, maps skills, and ranks candidates against your job requirements automatically.",
    features: ["CV parsing", "Skills matching", "Culture fit scoring"],
    badge: "AI-Powered",
    color: "yellow",
  },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-500",
  purple: "bg-purple-500/10 text-purple-500",
  green: "bg-green-500/10 text-green-500",
  orange: "bg-orange-500/10 text-orange-500",
  red: "bg-red-500/10 text-red-500",
  indigo: "bg-indigo-500/10 text-indigo-500",
  teal: "bg-teal-500/10 text-teal-500",
  yellow: "bg-yellow-500/10 text-yellow-600",
};

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-24 lg:py-36 overflow-hidden">
          <div className="hero-gradient absolute inset-0 -z-10" />
          <div className="absolute inset-0 bg-grid-pattern -z-10 opacity-50" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">Our Services</Badge>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6">
              Everything you need to{" "}
              <span className="gradient-text">build your team</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8 leading-relaxed">
              From a single emergency shift to managing a workforce of thousands, PrimeStaff has the service to match your ambition.
            </p>
            <Button size="lg" asChild className="h-12 px-8 font-semibold shadow-lg shadow-primary/25">
              <Link href="/register">Start Free Today <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service) => (
                <Card key={service.title} className="card-hover group relative overflow-hidden">
                  {service.badge && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">{service.badge}</Badge>
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl mb-3 ${colorMap[service.color]} group-hover:scale-110 transition-transform`}>
                      <service.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{service.desc}</p>
                    <ul className="space-y-1.5">
                      {service.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Shield className="h-3 w-3 text-primary flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing teaser */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-4">Transparent Pricing</h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto">No hidden fees. No long-term contracts. Just straightforward rates that work for your business.</p>
            <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { plan: "Starter", price: "Free", desc: "Post up to 3 jobs/month. Basic matching. Ideal for small teams.", cta: "Get Started" },
                { plan: "Growth", price: "£99/mo", desc: "Unlimited jobs, AI matching, rota management, and payroll.", cta: "Start Trial", popular: true },
                { plan: "Enterprise", price: "Custom", desc: "Bespoke solutions, dedicated account manager, SLA guarantee.", cta: "Talk to Sales" },
              ].map((p) => (
                <Card key={p.plan} className={`card-hover ${p.popular ? "border-primary shadow-lg shadow-primary/15 relative" : ""}`}>
                  {p.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                    </div>
                  )}
                  <CardContent className="pt-8 pb-6 text-center">
                    <p className="font-bold text-sm text-muted-foreground mb-1">{p.plan}</p>
                    <p className="text-4xl font-extrabold mb-4 gradient-text">{p.price}</p>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{p.desc}</p>
                    <Button variant={p.popular ? "default" : "outline"} asChild className="w-full font-semibold">
                      <Link href="/register">{p.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
