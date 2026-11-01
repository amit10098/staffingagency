import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, Database, Globe, Bell } from "lucide-react";

export const metadata = {
  title: "GDPR Compliance | PrimeStaff Solutions",
  description: "PrimeStaff Solutions GDPR compliance information and data subject rights.",
};

const rights = [
  { icon: Eye, title: "Right to Access", desc: "Request a copy of all personal data we hold about you at any time." },
  { icon: Lock, title: "Right to Rectification", desc: "Correct inaccurate or incomplete personal data we hold about you." },
  { icon: Database, title: "Right to Erasure", desc: "Request deletion of your personal data where there is no compelling reason for its continued processing." },
  { icon: ShieldCheck, title: "Right to Restrict Processing", desc: "Ask us to halt processing of your data in certain circumstances." },
  { icon: Globe, title: "Right to Data Portability", desc: "Receive your personal data in a structured, commonly used, machine-readable format." },
  { icon: Bell, title: "Right to Object", desc: "Object to our processing of your personal data for direct marketing or legitimate interests." },
];

export default function GdprPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="relative py-20 overflow-hidden">
          <div className="hero-gradient absolute inset-0 -z-10" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">Legal</Badge>
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-5 mx-auto">
              <ShieldCheck className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-4">GDPR Compliance</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              PrimeStaff Solutions is fully compliant with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. We are committed to protecting your rights and data.
            </p>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Your Data Rights</h2>
              <p className="text-muted-foreground">Under UK GDPR, you have the following rights regarding your personal data:</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rights.map((right) => (
                <Card key={right.title} className="card-hover">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <right.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{right.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{right.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="space-y-10">
              {[
                {
                  title: "Our GDPR Obligations",
                  content: "As a data controller, PrimeStaff Solutions Ltd processes personal data in accordance with the six principles of UK GDPR:\n\n1. Lawfulness, Fairness and Transparency — We only process data with a valid legal basis and inform you clearly about how it is used.\n\n2. Purpose Limitation — Data is collected for specified, explicit, and legitimate purposes and not processed beyond those purposes.\n\n3. Data Minimisation — We only collect data that is adequate, relevant, and limited to what is necessary.\n\n4. Accuracy — We take reasonable steps to ensure personal data is accurate and kept up to date.\n\n5. Storage Limitation — We retain data no longer than necessary for its purpose.\n\n6. Integrity and Confidentiality — We implement appropriate security measures to protect personal data."
                },
                {
                  title: "Data Processing Activities",
                  content: "We maintain a full Record of Processing Activities (ROPA) as required by UK GDPR Article 30. Our key processing activities include:\n\n• Worker registration and compliance verification\n• Right-to-Work checks and document management\n• Payroll processing and HMRC reporting\n• Job matching and rota management\n• Communication and notification services\n• Platform analytics and improvement"
                },
                {
                  title: "International Data Transfers",
                  content: "We primarily process data within the UK. Where data is transferred outside the UK, we ensure adequate safeguards are in place in accordance with UK GDPR Chapter V requirements, including Standard Contractual Clauses (SCCs) or adequacy decisions."
                },
                {
                  title: "Data Breach Procedures",
                  content: "We have robust procedures for detecting, reporting, and investigating personal data breaches. Where a breach is likely to result in a risk to individuals, we will notify the ICO within 72 hours of becoming aware of it, and notify affected individuals where the risk is high."
                },
                {
                  title: "Data Protection Officer",
                  content: "We have appointed a Data Protection Officer (DPO) who is responsible for overseeing our GDPR compliance. You can contact our DPO at:\n\ndpo@primestaff.co.uk\n\nPrimeStaff Solutions Ltd, First Street, Manchester, M15 4FN"
                },
                {
                  title: "How to Exercise Your Rights",
                  content: "To exercise any of your data rights, please submit a request to privacy@primestaff.co.uk with 'Data Subject Request' in the subject line. We will respond within one calendar month. We may need to verify your identity before processing your request.\n\nIf you believe we have handled your data incorrectly, you have the right to lodge a complaint with the Information Commissioner's Office (ICO) at ico.org.uk or by calling 0303 123 1113."
                },
              ].map((section) => (
                <div key={section.title} className="space-y-3">
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</div>
                </div>
              ))}

              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center">
                <ShieldCheck className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">ICO Registered</h3>
                <p className="text-muted-foreground text-sm">
                  PrimeStaff Solutions Ltd is registered with the Information Commissioner's Office as a data controller. Registration No: ZA123456
                </p>
              </div>

              <div className="border-t pt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <p className="text-sm text-muted-foreground">© 2025 PrimeStaff Solutions Ltd. All rights reserved.</p>
                <div className="flex gap-4 text-sm">
                  <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                  <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                  <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
