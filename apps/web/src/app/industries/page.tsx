import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Stethoscope, Hotel, Warehouse, Truck, ChefHat, Factory, CheckCircle, Phone } from "lucide-react";

const industries = [
  {
    slug: "healthcare",
    name: "Healthcare",
    icon: Stethoscope,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-200 dark:border-blue-900",
    headline: "Staff NHS & Private Healthcare",
    desc: "We supply qualified nurses, HCAs, support workers, and allied health professionals to NHS trusts, care homes, and private hospitals across the UK.",
    roles: ["Registered General Nurse (RGN)", "Health Care Assistant (HCA)", "Phlebotomist", "Theatre Nurse", "Ward Manager", "Mental Health Nurse"],
    compliance: ["NMC Registration", "DBS Check", "Manual Handling", "Infection Control", "Safeguarding"],
    stat: "2,000+ Healthcare Workers",
  },
  {
    slug: "hospitality",
    name: "Hospitality",
    icon: Hotel,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-200 dark:border-orange-900",
    headline: "Front-of-House & Events Staffing",
    desc: "From five-star hotels to festival caterers, we supply experienced hospitality staff at short notice for any scale of event or operation.",
    roles: ["Hotel Receptionist", "Event Waitstaff", "Banqueting Manager", "Bar Supervisor", "Housekeeping", "Concierge"],
    compliance: ["Food Safety Level 2", "Allergen Awareness", "Personal Licence", "First Aid"],
    stat: "500+ Hospitality Sites",
  },
  {
    slug: "warehouse",
    name: "Warehouse",
    icon: Warehouse,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-200 dark:border-yellow-900",
    headline: "Reliable Warehouse Workforce",
    desc: "Pickers, packers, forklift operators and warehouse managers. We flex with your demand, from Black Friday surges to everyday operations.",
    roles: ["Picker/Packer", "Forklift Operator (FLT)", "Warehouse Manager", "Stock Controller", "Returns Operative"],
    compliance: ["Forklift Licence", "Manual Handling", "Health & Safety", "Fire Safety"],
    stat: "50+ Fulfilment Centres",
  },
  {
    slug: "logistics",
    name: "Logistics",
    icon: Truck,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-200 dark:border-green-900",
    headline: "Keep Supply Chains Moving",
    desc: "Qualified drivers and logistics operatives to keep your supply chain on schedule. All licence categories available.",
    roles: ["Class 2 LGV Driver", "Class 1 HGV Driver", "Van Driver (Cat B)", "Delivery Courier", "Logistics Coordinator"],
    compliance: ["DVLA Licence Check", "CPC Card", "Tachograph", "ADR (Hazmat)"],
    stat: "1,000+ Active Drivers",
  },
  {
    slug: "industrial",
    name: "Industrial",
    icon: Factory,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-200 dark:border-red-900",
    headline: "Production Line & Manufacturing",
    desc: "General operatives, machine operators, and quality controllers for food production, manufacturing, and packaging facilities.",
    roles: ["General Operative", "Machine Operator", "Quality Controller", "Production Lead", "Maintenance Engineer"],
    compliance: ["PPE Training", "COSHH", "Health & Safety", "Manual Handling"],
    stat: "80+ Manufacturing Sites",
  },
  {
    slug: "catering",
    name: "Catering",
    icon: ChefHat,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-200 dark:border-purple-900",
    headline: "Skilled Culinary Professionals",
    desc: "From sous chefs to kitchen porters, we supply trained catering staff to restaurants, hospitals, schools, and major events.",
    roles: ["Head Chef", "Sous Chef", "Commis Chef", "Kitchen Porter", "Pastry Chef", "Catering Supervisor"],
    compliance: ["Food Safety Level 2 & 3", "HACCP", "Allergen Training", "Fire Safety"],
    stat: "300+ Catering Clients",
  },
];

export default function IndustriesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-24 lg:py-36 overflow-hidden">
          <div className="hero-gradient absolute inset-0 -z-10" />
          <div className="absolute inset-0 bg-grid-pattern -z-10 opacity-50" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">Industries</Badge>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6">
              Sector-Specialist{" "}
              <span className="gradient-text">Staffing Expertise</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8 leading-relaxed">
              We don't do generic. Every industry has its roles, its compliance, and its culture. We've spent years building deep expertise in 6 critical sectors.
            </p>
          </div>
        </section>

        {/* Industries */}
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
            {industries.map((industry, i) => (
              <div key={industry.slug} className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${industry.bg} mb-5`}>
                    <industry.icon className={`h-8 w-8 ${industry.color}`} />
                  </div>
                  <Badge variant="outline" className={`mb-3 text-xs ${industry.color} border-current/30`}>{industry.name}</Badge>
                  <h2 className="text-3xl font-bold mb-4">{industry.headline}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">{industry.desc}</p>
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-6">
                    <CheckCircle className="h-4 w-4" /> {industry.stat}
                  </div>
                  <Button asChild className="font-semibold shadow-lg shadow-primary/20">
                    <Link href="/register">Find {industry.name} Staff <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
                <div className={`${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <Card className={`border-2 ${industry.border}`}>
                    <CardContent className="p-8">
                      <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Roles We Place</h4>
                      <ul className="space-y-2 mb-8">
                        {industry.roles.map((r) => (
                          <li key={r} className="flex items-center gap-2 text-sm">
                            <CheckCircle className={`h-4 w-4 ${industry.color} flex-shrink-0`} />
                            {r}
                          </li>
                        ))}
                      </ul>
                      <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Compliance Included</h4>
                      <div className="flex flex-wrap gap-2">
                        {industry.compliance.map((c) => (
                          <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-4">Don't see your sector?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">We work across many more roles. Give us a call and we'll tell you within minutes if we can help.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="h-12 px-8 font-semibold shadow-lg shadow-primary/25">
                <Link href="/contact"><Phone className="mr-2 h-4 w-4" /> Talk to an Expert</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 px-8 font-semibold">
                <Link href="/register">Sign Up Free</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
