"use client"

import * as React from "react"
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search, MapPin, Briefcase, Clock, Filter, ChevronDown, ArrowRight, SlidersHorizontal } from "lucide-react";

const allJobs = [
  { id: 1, title: "Registered General Nurse (RGN)", company: "City Care Hospital", location: "Manchester", type: "Temporary", pay: "£28.00 / hr", sector: "Healthcare", timePosted: "2h ago", urgent: true },
  { id: 2, title: "Event Waitstaff", company: "Luxury Events Co.", location: "London", type: "Contract", pay: "£14.50 / hr", sector: "Hospitality", timePosted: "4h ago", urgent: false },
  { id: 3, title: "Warehouse Operative", company: "Global Logistics Ltd", location: "Birmingham", type: "Ad-Hoc", pay: "£12.00 / hr", sector: "Logistics", timePosted: "6h ago", urgent: false },
  { id: 4, title: "HGV Class 1 Driver", company: "DHL UK", location: "Bristol", type: "Temporary", pay: "£18.50 / hr", sector: "Logistics", timePosted: "1h ago", urgent: true },
  { id: 5, title: "Health Care Assistant", company: "NHS Greater London", location: "London", type: "Permanent", pay: "£13.50 / hr", sector: "Healthcare", timePosted: "1d ago", urgent: false },
  { id: 6, title: "Sous Chef", company: "The Grand Hotel", location: "Edinburgh", type: "Permanent", pay: "£16.00 / hr", sector: "Catering", timePosted: "3h ago", urgent: false },
  { id: 7, title: "Forklift Operator (FLT)", company: "Amazon FC Coventry", location: "Coventry", type: "Temporary", pay: "£13.50 / hr", sector: "Warehouse", timePosted: "5h ago", urgent: false },
  { id: 8, title: "Factory Line Operative", company: "Pringles UK", location: "Leeds", type: "Ad-Hoc", pay: "£11.50 / hr", sector: "Industrial", timePosted: "2d ago", urgent: false },
  { id: 9, title: "Theatre Scrub Nurse", company: "Spire Healthcare", location: "Liverpool", type: "Temporary", pay: "£32.00 / hr", sector: "Healthcare", timePosted: "30m ago", urgent: true },
];

const sectorColors: Record<string, string> = {
  Healthcare: "bg-blue-500/10 text-blue-600 border-blue-200",
  Hospitality: "bg-orange-500/10 text-orange-600 border-orange-200",
  Logistics: "bg-green-500/10 text-green-600 border-green-200",
  Catering: "bg-purple-500/10 text-purple-600 border-purple-200",
  Warehouse: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  Industrial: "bg-red-500/10 text-red-600 border-red-200",
};

export default function JobsPage() {
  const [search, setSearch] = React.useState("");
  const [sector, setSector] = React.useState("All");
  const [type, setType] = React.useState("All");

  const sectors = ["All", "Healthcare", "Hospitality", "Logistics", "Catering", "Warehouse", "Industrial"];
  const types = ["All", "Temporary", "Permanent", "Contract", "Ad-Hoc"];

  const filtered = allJobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()) || j.location.toLowerCase().includes(search.toLowerCase());
    const matchSector = sector === "All" || j.sector === sector;
    const matchType = type === "All" || j.type === type;
    return matchSearch && matchSector && matchType;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-20 overflow-hidden">
          <div className="hero-gradient absolute inset-0 -z-10" />
          <div className="absolute inset-0 bg-grid-pattern -z-10 opacity-50" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">Job Board</Badge>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6">
              Find Your Next{" "}
              <span className="gradient-text">Opportunity</span>
            </h1>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground mb-8">
              Browse hundreds of verified roles across the UK — from same-day shifts to career-changing permanent positions.
            </p>
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-3 p-2 rounded-2xl bg-card border shadow-xl shadow-primary/10">
                <div className="flex-1 flex items-center gap-2 px-3">
                  <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Job title, company, or location..."
                    className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <Button className="font-semibold px-6 shadow-lg shadow-primary/25">
                  Search Jobs
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Filters + Results */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <aside className="lg:w-64 flex-shrink-0">
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <SlidersHorizontal className="h-4 w-4 text-primary" />
                      <h3 className="font-bold">Filters</h3>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">Sector</label>
                        <div className="space-y-1">
                          {sectors.map(s => (
                            <button
                              key={s}
                              onClick={() => setSector(s)}
                              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${sector === s ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">Type</label>
                        <div className="space-y-1">
                          {types.map(t => (
                            <button
                              key={t}
                              onClick={() => setType(t)}
                              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${type === t ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </aside>

              {/* Job Listings */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{filtered.length}</span> roles found
                  </p>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-3 w-3" /> Sort: Newest
                  </Button>
                </div>
                <div className="space-y-4">
                  {filtered.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                      <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p className="font-medium">No roles found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  ) : filtered.map((job) => (
                    <Card key={job.id} className="card-hover group">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${sectorColors[job.sector] || "bg-muted text-muted-foreground"}`}>
                                {job.sector}
                              </span>
                              <Badge variant="outline" className="text-xs">{job.type}</Badge>
                              {job.urgent && <Badge className="text-xs bg-red-500 hover:bg-red-600">🔥 Urgent</Badge>}
                              <span className="text-xs text-muted-foreground">{job.timePosted}</span>
                            </div>
                            <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{job.title}</h3>
                            <p className="text-sm font-semibold text-primary mb-3">{job.company}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />Immediate Start</span>
                              <span className="flex items-center gap-1.5 font-semibold text-foreground">£ {job.pay}</span>
                            </div>
                          </div>
                          <div className="flex sm:flex-col gap-2">
                            <Button className="flex-1 sm:flex-none sm:w-32 font-semibold shadow-md shadow-primary/15" asChild>
                              <Link href="/register">Apply Now</Link>
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs">Save</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filtered.length > 0 && (
                  <div className="mt-10 text-center">
                    <Button variant="outline" size="lg" className="font-semibold">
                      Load More Jobs <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Worker CTA */}
        <section className="py-20 bg-primary/5 border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Don't see the right role?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Register your profile and we'll match you to new opportunities the moment they're posted.</p>
            <Button size="lg" asChild className="h-12 px-8 font-semibold shadow-lg shadow-primary/25">
              <Link href="/register">Create Your Profile <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
