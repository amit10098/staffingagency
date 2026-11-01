import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service | PrimeStaff Solutions",
  description: "PrimeStaff Solutions terms and conditions for using our staffing platform.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="relative py-20 overflow-hidden">
          <div className="hero-gradient absolute inset-0 -z-10" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">Legal</Badge>
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-5 mx-auto">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-4">Terms of Service</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">Last updated: 1 June 2025</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-10">
              
              <div className="p-6 rounded-2xl bg-muted/40 border">
                <p className="text-muted-foreground leading-relaxed">
                  Please read these Terms of Service ("Terms") carefully before using the PrimeStaff Solutions platform. By accessing or using our services, you agree to be bound by these Terms. If you do not agree to these Terms, do not use our platform.
                </p>
              </div>

              {[
                {
                  title: "1. The Platform",
                  content: "PrimeStaff Solutions Ltd provides an online staffing and workforce management platform that connects employers with workers across the United Kingdom. Our services include job posting, worker matching, rota management, payroll processing, and compliance management."
                },
                {
                  title: "2. Eligibility",
                  content: "To use our platform, you must:\n\n• Be at least 18 years of age\n• Have the legal right to work in the United Kingdom\n• Provide accurate and complete registration information\n• Not have been previously suspended or removed from our platform\n\nEmployers must be legally registered businesses operating within the UK."
                },
                {
                  title: "3. Account Responsibilities",
                  content: "You are responsible for:\n\n• Maintaining the confidentiality of your account credentials\n• All activities that occur under your account\n• Ensuring all information provided is accurate and up-to-date\n• Notifying us immediately of any unauthorised use of your account\n\nYou must not share your login credentials or allow others to access your account."
                },
                {
                  title: "4. Worker Terms",
                  content: "As a worker on our platform, you agree to:\n\n• Provide accurate information about your qualifications and experience\n• Supply valid Right-to-Work documentation as required\n• Attend confirmed shifts or provide adequate notice of cancellation\n• Maintain professional conduct at all client sites\n• Report hours accurately through our timesheet system\n• Comply with all applicable employment law"
                },
                {
                  title: "5. Employer Terms",
                  content: "As an employer on our platform, you agree to:\n\n• Provide accurate job descriptions and working conditions\n• Pay workers at least the National Living Wage (currently £12.21/hr)\n• Comply with all UK employment law and health & safety regulations\n• Provide a safe working environment for all placed workers\n• Confirm or reject timesheets within 5 business days\n• Pay all invoices within agreed payment terms"
                },
                {
                  title: "6. Fees and Payment",
                  content: "Employers are charged a service fee based on the agreed rate for each placement. Workers receive payment directly from PrimeStaff as the employer of record, subject to applicable tax and National Insurance deductions. Our fee structure is provided separately in your service agreement."
                },
                {
                  title: "7. Intellectual Property",
                  content: "All content, features, and functionality of the PrimeStaff platform (including but not limited to text, graphics, logos, and software) is owned by PrimeStaff Solutions Ltd and is protected by UK and international intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written consent."
                },
                {
                  title: "8. Limitation of Liability",
                  content: "To the maximum extent permitted by law, PrimeStaff shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our platform. Our total liability to you shall not exceed the fees paid by you to us in the 12 months preceding the claim."
                },
                {
                  title: "9. Termination",
                  content: "We reserve the right to suspend or terminate your account if you breach these Terms or engage in conduct that is harmful to other users, our platform, or our reputation. You may close your account at any time by contacting us. Termination does not affect any outstanding obligations."
                },
                {
                  title: "10. Governing Law",
                  content: "These Terms are governed by the laws of England and Wales. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales."
                },
                {
                  title: "11. Changes to Terms",
                  content: "We may update these Terms from time to time. We will notify you of significant changes via email or platform notification. Continued use of our platform after changes take effect constitutes acceptance of the updated Terms."
                },
                {
                  title: "12. Contact",
                  content: "For questions about these Terms, contact us at:\nlegal@primestaff.co.uk\nPrimeStaff Solutions Ltd, First Street, Manchester, M15 4FN"
                },
              ].map((section) => (
                <div key={section.title} className="space-y-3">
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</div>
                </div>
              ))}

              <div className="border-t pt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <p className="text-sm text-muted-foreground">© 2025 PrimeStaff Solutions Ltd. All rights reserved.</p>
                <div className="flex gap-4 text-sm">
                  <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                  <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link>
                  <Link href="/gdpr" className="text-primary hover:underline">GDPR</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
