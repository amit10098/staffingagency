"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, FileSearch, CheckCircle2, Upload, Brain, Target, Zap, ChevronRight } from "lucide-react"

const presets = [
  { label: "Nurse CV", text: "Registered General Nurse with 7 years NHS experience. BSc Nursing. NMC pinned. Specialisms: A&E and ICU. Manual handling trained. DBS clear." },
  { label: "Chef CV", text: "Sous Chef with 5 years fine dining experience. NVQ Level 3. Allergen trained. City & Guilds Food Safety Level 3. Available for shifts and permanent." },
  { label: "Driver CV", text: "HGV Class 1 driver with 8 years experience. CPC card holder. Tachograph trained. Clean DVLA licence. ADR hazmat certified." },
]

const features = [
  { icon: Brain, title: "AI Skill Extraction", desc: "Automatically pulls relevant skills and certifications from any CV format." },
  { icon: Target, title: "Job Matching", desc: "Ranks your open positions against candidate profile with a compatibility score." },
  { icon: Zap, title: "Instant Results", desc: "Get parsed results in under 3 seconds — no waiting, no manual work." },
]

export default function AiDemo() {
  const [text, setText] = React.useState("")
  const [parsing, setParsing] = React.useState(false)
  const [result, setResult] = React.useState<{
    name: string; role: string; experience: string; skills: string[];
    certs: string[]; matchScore: number; matchedJob: string;
  } | null>(null)

  const handleParse = () => {
    setParsing(true)
    setTimeout(() => {
      setResult({
        name: "Example Candidate",
        role: text.toLowerCase().includes("nurse") ? "Registered Nurse" : text.toLowerCase().includes("chef") ? "Sous Chef" : "HGV Driver",
        experience: text.toLowerCase().includes("nurse") ? "7 years NHS experience" : text.toLowerCase().includes("chef") ? "5 years fine dining" : "8 years logistics",
        skills: text.toLowerCase().includes("nurse") ? ["Patient Care", "NMC Registered", "A&E", "ICU", "Manual Handling"] : text.toLowerCase().includes("chef") ? ["Fine Dining", "HACCP", "NVQ Level 3", "Allergen Awareness"] : ["Class 1 HGV", "CPC Card", "Tachograph", "ADR Hazmat"],
        certs: text.toLowerCase().includes("nurse") ? ["NMC Pin", "DBS Clear", "Manual Handling"] : text.toLowerCase().includes("chef") ? ["Food Safety Level 3", "City & Guilds"] : ["DVLA Clean Licence", "CPC Card"],
        matchScore: text.toLowerCase().includes("nurse") ? 96 : text.toLowerCase().includes("chef") ? 88 : 91,
        matchedJob: text.toLowerCase().includes("nurse") ? "RGN at City Hospital" : text.toLowerCase().includes("chef") ? "Sous Chef at The Grand Hotel" : "HGV Driver at DHL UK",
      })
      setParsing(false)
    }, 2000)
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-extrabold">AI Candidate Matching</h1>
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
        </div>
        <p className="text-muted-foreground">Paste a candidate CV to instantly extract skills, certifications, and match against open jobs.</p>
      </div>

      {/* Feature highlights */}
      <div className="grid sm:grid-cols-3 gap-4">
        {features.map((f) => (
          <div key={f.title} className="flex gap-3 p-4 rounded-xl bg-muted/40 group hover:bg-muted/60 transition-colors">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
              <f.icon className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">{f.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FileSearch className="h-4 w-4 text-primary" /> CV Input
            </CardTitle>
            <CardDescription>Paste raw CV text or use a quick preset below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {presets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => { setText(p.text); setResult(null) }}
                  className="px-2.5 py-1 rounded-md text-xs font-semibold bg-muted hover:bg-primary/10 hover:text-primary transition-colors border"
                >
                  Try: {p.label}
                </button>
              ))}
            </div>
            <Textarea
              placeholder="Paste candidate CV text here... or use a preset above to demo the AI parser."
              className="min-h-[200px] resize-none font-mono text-xs"
              value={text}
              onChange={e => { setText(e.target.value); setResult(null) }}
            />
            <Button
              className="w-full h-12 font-semibold gap-2 shadow-md shadow-primary/20"
              onClick={handleParse}
              disabled={parsing || !text.trim()}
            >
              {parsing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Analysing with AI...
                </span>
              ) : (
                <><Sparkles className="h-4 w-4" /> Parse CV with AI</>
              )}
            </Button>
            <Button variant="outline" className="w-full gap-2 font-medium">
              <Upload className="h-4 w-4" /> Upload PDF / DOCX
            </Button>
          </CardContent>
        </Card>

        {/* Output Card */}
        <div>
          {!result && !parsing && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 rounded-2xl border-2 border-dashed border-border">
              <Sparkles className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="font-semibold text-muted-foreground mb-1">AI Results will appear here</p>
              <p className="text-sm text-muted-foreground">Paste a CV and click "Parse CV" to see the magic</p>
            </div>
          )}

          {parsing && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-primary/5 border border-primary/20">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-pulse">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <p className="font-semibold mb-2">AI Analysing CV...</p>
              <p className="text-sm text-muted-foreground">Extracting skills, certs, experience...</p>
            </div>
          )}

          {result && (
            <Card className="border-primary/20 bg-primary/5 h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" /> Analysis Complete
                  </CardTitle>
                  <Badge className="bg-green-500 hover:bg-green-600 text-white text-sm px-3">
                    {result.matchScore}% Match 🎯
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="p-3 rounded-lg bg-card border border-primary/20">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Identified Role</p>
                  <p className="font-bold text-primary">{result.role}</p>
                  <p className="text-sm text-muted-foreground">{result.experience}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Extracted Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {result.skills.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Certifications</p>
                  <div className="flex flex-wrap gap-2">
                    {result.certs.map(c => (
                      <span key={c} className="flex items-center gap-1 text-xs bg-green-500/10 text-green-700 border border-green-200 rounded-full px-2.5 py-0.5">
                        <CheckCircle2 className="h-3 w-3" /> {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-200 flex items-center gap-3">
                  <Target className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-green-700">Best Match Found</p>
                    <p className="text-xs text-green-600">{result.matchedJob}</p>
                  </div>
                  <Button size="sm" className="ml-auto text-xs font-semibold gap-1 bg-green-600 hover:bg-green-700">
                    View Job <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
