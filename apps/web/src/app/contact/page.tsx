"use client"

import * as React from "react"
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, CheckCircle2 } from "lucide-react";

const contactDetails = [
  { icon: Phone, label: "Phone", value: "+44 161 234 5678", href: "tel:+441612345678" },
  { icon: Mail, label: "Email", value: "hello@primestaff.co.uk", href: "mailto:hello@primestaff.co.uk" },
  { icon: MapPin, label: "Head Office", value: "First Street, Manchester, M15 4FN" },
  { icon: Clock, label: "Hours", value: "Mon–Fri: 8am–7pm · Sat: 9am–4pm · 24/7 Emergency Line" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", email: "", company: "", phone: "", type: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-24 lg:py-32 overflow-hidden">
          <div className="hero-gradient absolute inset-0 -z-10" />
          <div className="absolute inset-0 bg-grid-pattern -z-10 opacity-50" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">Contact Us</Badge>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6">
              Let's start a{" "}
              <span className="gradient-text">conversation</span>
            </h1>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground leading-relaxed">
              Whether you need staff urgently or want to explore how PrimeStaff can transform your workforce — we're here.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Form */}
              <div>
                <h2 className="text-3xl font-bold mb-2">Send us a message</h2>
                <p className="text-muted-foreground mb-8">We typically respond within 2 hours during business hours.</p>
                {submitted ? (
                  <div className="rounded-2xl border bg-green-500/5 border-green-200 dark:border-green-900 p-10 text-center">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Message Received!</h3>
                    <p className="text-muted-foreground">Thank you, {form.name}. Our team will be in touch within 2 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Full Name *</label>
                        <Input placeholder="Alexandra Clarke" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Email Address *</label>
                        <Input type="email" placeholder="alex@company.co.uk" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Company</label>
                        <Input placeholder="Your Company Ltd" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Phone</label>
                        <Input type="tel" placeholder="+44 7700 900000" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">I'm looking to...</label>
                      <select
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                        value={form.type}
                        onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                      >
                        <option value="">Select an option...</option>
                        <option>Hire temporary staff</option>
                        <option>Find a permanent role</option>
                        <option>Register as a worker</option>
                        <option>Learn more about PrimeStaff</option>
                        <option>Get a platform demo</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Message *</label>
                      <Textarea
                        placeholder="Tell us about your requirements, deadlines, or any questions you have..."
                        className="min-h-[140px] resize-none"
                        required
                        value={form.message}
                        onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full h-12 font-semibold shadow-lg shadow-primary/25">
                      Send Message
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      By submitting, you agree to our Privacy Policy. We'll never share your data.
                    </p>
                  </form>
                )}
              </div>

              {/* Contact Details */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Get in touch directly</h2>
                  <p className="text-muted-foreground">Our team is real, friendly, and ready to help.</p>
                </div>
                <div className="space-y-4">
                  {contactDetails.map((item) => (
                    <div key={item.label} className="flex gap-4 p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-sm font-medium hover:text-primary transition-colors">{item.value}</a>
                        ) : (
                          <p className="text-sm font-medium">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-2">🚨 Urgent Staffing?</h3>
                    <p className="text-sm text-muted-foreground mb-4">Need workers within hours? Call our 24/7 emergency line and we'll mobilise immediately.</p>
                    <Button asChild className="w-full font-semibold">
                      <a href="tel:+441612345679"><Phone className="mr-2 h-4 w-4" /> Call Emergency Line</a>
                    </Button>
                  </CardContent>
                </Card>

                <div className="rounded-2xl overflow-hidden border h-64 bg-muted/30">
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <p className="font-medium">Manchester Head Office</p>
                      <p className="text-xs">First Street, Manchester, M15 4FN</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
