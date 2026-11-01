import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Stethoscope, Hotel, Warehouse, Truck, ChefHat, Factory,
  ArrowRight, Star, Shield, Zap, Users, CheckCircle2,
  TrendingUp, Building2, Clock, Globe
} from "lucide-react";

const sectors = [
  { name: "Healthcare", icon: Stethoscope, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-200 dark:border-blue-900", desc: "Nurses, care workers, and clinical staff across the NHS and private sector." },
  { name: "Hospitality", icon: Hotel, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-200 dark:border-orange-900", desc: "Front-of-house, events, and kitchen teams for hotels and restaurants." },
  { name: "Warehouse", icon: Warehouse, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-200 dark:border-yellow-900", desc: "Pickers, packers, and forklift operators for fulfilment centres." },
  { name: "Logistics", icon: Truck, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-200 dark:border-green-900", desc: "Drivers and delivery operatives to keep your supply chain moving." },
  { name: "Industrial", icon: Factory, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-200 dark:border-red-900", desc: "Production lines, assembly, and quality control specialists." },
  { name: "Catering", icon: ChefHat, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-200 dark:border-purple-900", desc: "Chefs, kitchen porters, and catering assistants across the UK." },
];

const stats = [
  { value: "500+", label: "Active Clients", icon: Building2 },
  { value: "10k+", label: "Verified Workers", icon: Users },
  { value: "25k+", label: "Shifts Filled", icon: CheckCircle2 },
  { value: "24/7", label: "Human Support", icon: Clock },
];

const features = [
  { icon: Zap, title: "Instant Matching", desc: "Our AI matches the right workers to the right shifts in seconds, not hours." },
  { icon: Shield, title: "RTW Verified", desc: "Every worker is fully Right-to-Work checked and compliance-ready from day one." },
  { icon: TrendingUp, title: "Real-Time Rota", desc: "Drag-and-drop rota management with live availability and instant notifications." },
  { icon: Globe, title: "UK-Wide Coverage", desc: "Operating across England, Scotland, Wales and Northern Ireland." },
];

const testimonials = [
  { name: "Sarah Mitchell", role: "Operations Manager, NHS Trust", content: "PrimeStaff cut our agency admin time by 60%. The compliance dashboard is a game-changer for us.", stars: 5 },
  { name: "James Thornton", role: "Director, Hilton Manchester", content: "We had 15 staff confirmed within 2 hours of posting. Absolutely seamless.", stars: 5 },
  { name: "Priya Patel", role: "Logistics Lead, DHL UK", content: "The rota planner and payroll integration saves us countless hours every week.", stars: 5 },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-48">
          <div className="hero-gradient absolute inset-0 -z-10" />
          <div className="absolute inset-0 bg-grid-pattern -z-10 opacity-60" />
          {/* Decorative blobs */}
          <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl -z-10 animate-pulse-slow" />
          <div className="absolute bottom-10 left-10 h-96 w-96 rounded-full bg-blue-400/8 blur-3xl -z-10 animate-pulse-slow" style={{animationDelay: '2s'}} />

          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-6 py-1.5 px-4 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 transition-colors">
              🇬🇧 #1 Staffing Platform in the UK
            </Badge>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-6 leading-tight">
              The Smart Way to{" "}
              <br className="hidden sm:block" />
              <span className="gradient-text">Staff Your Business</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed">
              PrimeStaff Solutions connects UK businesses with compliant, vetted workers across Healthcare, Hospitality, Logistics and more — in minutes, not days.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button size="lg" asChild className="h-14 px-8 text-base font-semibold shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105">
                <Link href="/jobs">Find Work Today <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-14 px-8 text-base font-semibold hover:bg-primary/5 hover:border-primary/30 transition-all">
                <Link href="/register">Hire Talent Free</Link>
              </Button>
            </div>
            {/* Trust bar */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500" /> No placement fee</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500" /> RTW verified workers</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500" /> Fast onboarding</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500" /> 24/7 support</span>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center group">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-3 group-hover:scale-110 transition-transform mx-auto">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-4xl font-extrabold mb-1 gradient-text">{stat.value}</p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sectors Section */}
        <section className="py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">Industries We Serve</Badge>
              <h2 className="text-4xl font-bold sm:text-5xl mb-4">Specialist Staffing{" "}
                <span className="gradient-text">Across Sectors</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                Deep sector expertise means we understand your roles, your compliance needs, and your timescales.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sectors.map((sector) => (
                <Card key={sector.name} className={`border card-hover group overflow-hidden cursor-pointer ${sector.border}`}>
                  <CardContent className="p-8">
                    <div className={`mb-5 inline-flex h-13 w-13 items-center justify-center rounded-xl ${sector.bg} group-hover:scale-110 transition-transform`}>
                      <sector.icon className={`h-7 w-7 ${sector.color}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {sector.name} Staffing
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{sector.desc}</p>
                    <Link href="/industries" className="text-sm font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all">
                      Learn More <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-28 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <Badge variant="outline" className="mb-4 text-primary border-primary/30">Why PrimeStaff</Badge>
                <h2 className="text-4xl font-bold sm:text-5xl mb-6 leading-tight">
                  Staffing made{" "}
                  <span className="gradient-text">effortless</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                  From posting a shift to having a verified worker on-site, our platform handles everything. Real-time rota management, automated payroll, and full compliance built in.
                </p>
                <div className="space-y-6">
                  {features.map((f) => (
                    <div key={f.title} className="flex gap-4 group">
                      <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <f.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{f.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button asChild className="mt-10 h-12 px-8 font-semibold shadow-lg shadow-primary/25">
                  <Link href="/services">Explore Our Platform <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden border shadow-2xl shadow-primary/10 bg-card p-6">
                  <div className="flex items-center gap-2 mb-5 pb-4 border-b">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                    <span className="ml-2 text-xs text-muted-foreground font-mono">PrimeStaff — Live Rota View</span>
                  </div>
                  {/* Mock dashboard preview */}
                  <div className="space-y-3">
                    {["Nurse · City Hospital", "Chef · Grand Hotel", "Picker · Amazon FC"].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                          {item[0]}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{item}</div>
                          <div className="text-xs text-muted-foreground">Today, 09:00 - 17:00</div>
                        </div>
                        <Badge className="bg-green-500/10 text-green-600 border-green-200 text-xs">Confirmed</Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-3 text-center">
                    {[["12", "Shifts Today"], ["98%", "Fill Rate"], ["4.9★", "Avg Rating"]].map(([v, l]) => (
                      <div key={l} className="rounded-lg bg-primary/5 py-3 px-2">
                        <div className="text-lg font-bold text-primary">{v}</div>
                        <div className="text-[10px] text-muted-foreground">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-primary/20 blur-2xl" />
                <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-blue-400/15 blur-3xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">Testimonials</Badge>
              <h2 className="text-4xl font-bold sm:text-5xl mb-4">Trusted by UK Leaders</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Hundreds of companies depend on PrimeStaff to keep their operations running.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <Card key={t.name} className="card-hover">
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {Array.from({ length: t.stars }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-foreground italic leading-relaxed mb-6">&quot;{t.content}&quot;</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary">
                        {t.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-20 border-y bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-12">
              Trusted by Leading UK Organisations
            </p>
            <div className="flex flex-wrap items-center justify-center gap-12">
              {["NHS", "HILTON", "AMAZON", "DHL", "TESCO", "IHG"].map((brand) => (
                <div key={brand} className="text-2xl font-black italic tracking-widest text-muted-foreground/50 hover:text-foreground transition-colors cursor-default">
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <div className="absolute inset-0 bg-grid-pattern -z-10 opacity-30" />
          <div className="absolute top-10 right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl -z-10" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold sm:text-5xl mb-6">
              Ready to transform your{" "}
              <span className="gradient-text">workforce?</span>
            </h2>
            <p className="text-muted-foreground text-xl mb-10 max-w-xl mx-auto">
              Join 500+ UK businesses already using PrimeStaff to hire smarter, faster, and with complete confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="h-14 px-10 text-base font-semibold shadow-2xl shadow-primary/30">
                <Link href="/register">Start Hiring Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-14 px-10 text-base font-semibold">
                <Link href="/contact">Talk to Sales</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-12 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">PS</div>
                  <span className="font-bold text-lg"><span className="text-primary">Prime</span>Staff</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">The UK's leading staffing agency management platform.</p>
              </div>
              {[
                { title: "Platform", links: [
                  { label: "Job Board", href: "/jobs" },
                  { label: "For Employers", href: "/employer/login" },
                  { label: "For Workers", href: "/login" },
                  { label: "Pricing", href: "/contact" },
                ]},
                { title: "Company", links: [
                  { label: "About Us", href: "/about" },
                  { label: "Services", href: "/services" },
                  { label: "Industries", href: "/industries" },
                  { label: "Contact", href: "/contact" },
                ]},
                { title: "Legal", links: [
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Cookie Policy", href: "/cookies" },
                  { label: "GDPR", href: "/gdpr" },
                ]},
              ].map((col) => (
                <div key={col.title}>
                  <h4 className="font-semibold text-sm mb-4">{col.title}</h4>
                  <ul className="space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">© 2025 PrimeStaff Solutions Ltd. All rights reserved.</p>
              <p className="text-sm text-muted-foreground">
                Developed by{" "}
                <a href="https://www.amnexustech.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                  Amnexus Technology
                </a>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
