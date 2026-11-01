import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Target, Heart, Globe, Award, Users, TrendingUp } from "lucide-react";

const values = [
  { icon: Target, title: "Precision Matching", desc: "We don't just fill numbers — we match the right people to the right roles based on skills, experience, and culture fit." },
  { icon: Heart, title: "People First", desc: "Our workers and clients are treated as long-term partners, not transactions. We invest in every relationship." },
  { icon: Globe, title: "UK-Wide Reach", desc: "Operating from London to Edinburgh, we have boots on the ground in every major UK city." },
  { icon: Award, title: "Compliance Always", desc: "RTW checks, DBS screening, and payroll compliance are non-negotiables — built into every placement." },
];

const team = [
  { name: "Alexandra Clarke", role: "CEO & Co-Founder", bio: "15+ years in UK recruitment across Healthcare and Logistics." },
  { name: "David Okonkwo", role: "CTO", bio: "Ex-Palantir engineer building the next generation of workforce tech." },
  { name: "Sophie Brennan", role: "Head of Compliance", bio: "Former HMRC specialist ensuring every placement is legally perfect." },
  { name: "Marcus Reid", role: "Head of Client Success", bio: "Dedicated to making every employer's experience world-class." },
];

const milestones = [
  { year: "2019", event: "PrimeStaff founded in Manchester by Alexandra Clarke." },
  { year: "2021", event: "Expanded to London and Birmingham. Reached 100 clients." },
  { year: "2022", event: "Launched PrimeStaff Platform — fully digital hiring." },
  { year: "2023", event: "Crossed 5,000 verified workers and 10,000 shifts." },
  { year: "2024", event: "AI matching engine launched. National coverage achieved." },
  { year: "2025", event: "500+ clients, 25k+ shifts. Expanding across Europe." },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-24 lg:py-36 overflow-hidden">
          <div className="hero-gradient absolute inset-0 -z-10" />
          <div className="absolute inset-0 bg-grid-pattern -z-10 opacity-50" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">About Us</Badge>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6">
              Built for the UK{" "}
              <span className="gradient-text">Workforce</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8 leading-relaxed">
              PrimeStaff Solutions was born out of frustration with slow, expensive, and opaque staffing agencies. We built the platform we wished existed.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <Badge variant="outline" className="mb-4 text-primary border-primary/30">Our Mission</Badge>
                <h2 className="text-4xl font-bold mb-6">To make great work <span className="gradient-text">accessible to everyone</span></h2>
                <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                  We believe every worker deserves transparent pay, fair treatment, and the right opportunity. And every employer deserves a staffing partner that actually shows up.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our technology streamlines the complex — from compliance and payroll to shift management and communication — so our people can focus on what matters: creating brilliant working relationships across the UK.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { v: "500+", l: "Active Clients", icon: Users },
                  { v: "10k+", l: "Verified Workers", icon: TrendingUp },
                  { v: "98%", l: "Fill Rate", icon: Award },
                  { v: "4.9★", l: "Client Satisfaction", icon: Heart },
                ].map((s) => (
                  <div key={s.l} className="rounded-2xl bg-card border p-6 text-center card-hover">
                    <s.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                    <p className="text-3xl font-extrabold gradient-text mb-1">{s.v}</p>
                    <p className="text-sm text-muted-foreground">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">Our Values</Badge>
              <h2 className="text-4xl font-bold sm:text-5xl">What we stand for</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((v) => (
                <div key={v.title} className="text-center group">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                    <v.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">Our Journey</Badge>
              <h2 className="text-4xl font-bold">Built milestone by milestone</h2>
            </div>
            <div className="max-w-2xl mx-auto space-y-0">
              {milestones.map((m, i) => (
                <div key={m.year} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-xs font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all flex-shrink-0">
                      {m.year.slice(2)}
                    </div>
                    {i < milestones.length - 1 && <div className="w-0.5 h-8 bg-border mt-1" />}
                  </div>
                  <div className="pb-8">
                    <span className="text-xs font-bold text-primary">{m.year}</span>
                    <p className="text-sm text-muted-foreground mt-0.5">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">The Team</Badge>
              <h2 className="text-4xl font-bold">People behind the platform</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((person) => (
                <Card key={person.name} className="card-hover text-center">
                  <CardContent className="pt-8 pb-6 px-6">
                    <div className="h-16 w-16 rounded-full bg-primary/15 flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-4">
                      {person.name[0]}
                    </div>
                    <h3 className="font-bold mb-1">{person.name}</h3>
                    <p className="text-xs font-semibold text-primary mb-3">{person.role}</p>
                    <p className="text-sm text-muted-foreground">{person.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to work with us?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="h-12 px-8 font-semibold shadow-lg shadow-primary/25">
                <Link href="/register">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 px-8 font-semibold">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
