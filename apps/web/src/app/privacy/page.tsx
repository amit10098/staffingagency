import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | PrimeStaff Solutions",
  description: "How PrimeStaff Solutions collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="relative py-20 overflow-hidden">
          <div className="hero-gradient absolute inset-0 -z-10" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">Legal</Badge>
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-5 mx-auto">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">Last updated: 1 June 2025</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-10">
              
              <div className="p-6 rounded-2xl bg-muted/40 border">
                <p className="text-muted-foreground leading-relaxed">
                  PrimeStaff Solutions Ltd ("PrimeStaff", "we", "us", or "our") is committed to protecting and respecting your privacy. This policy sets out the basis on which any personal data we collect from you, or that you provide to us, will be processed by us. Please read the following carefully to understand our views and practices regarding your personal data and how we will treat it.
                </p>
              </div>

              {[
                {
                  title: "1. Who We Are",
                  content: "PrimeStaff Solutions Ltd is a company registered in England and Wales (Company No. 12345678) with our registered office at First Street, Manchester, M15 4FN. We operate a staffing and workforce management platform connecting employers and workers across the United Kingdom. We are registered with the Information Commissioner's Office (ICO) as a data controller."
                },
                {
                  title: "2. Information We Collect",
                  content: "We collect and process the following categories of personal data:\n\n• Identity Data: first name, last name, date of birth, National Insurance number\n• Contact Data: email address, phone number, postal address\n• Employment Data: work history, qualifications, certifications, Right-to-Work documents\n• Financial Data: bank account details for payroll processing, tax information\n• Technical Data: IP address, browser type, device information, usage data\n• Communications: messages, enquiries, and feedback you send us"
                },
                {
                  title: "3. How We Use Your Information",
                  content: "We use your personal data to:\n\n• Provide and manage our staffing services\n• Process payroll and manage financial transactions\n• Conduct Right-to-Work checks as required by UK law\n• Match workers with suitable employment opportunities\n• Send you notifications about shifts, job offers, and platform updates\n• Comply with our legal and regulatory obligations\n• Improve our platform and services"
                },
                {
                  title: "4. Legal Basis for Processing",
                  content: "We process your personal data on the following legal bases:\n\n• Contract: Processing necessary to perform our services\n• Legal Obligation: Compliance with UK employment law, HMRC requirements, and RTW checks\n• Legitimate Interests: Platform improvement, fraud prevention, and security\n• Consent: Marketing communications and optional profiling features"
                },
                {
                  title: "5. Data Sharing",
                  content: "We may share your personal data with:\n\n• Employer clients (limited to what is necessary for your placement)\n• HMRC and other regulatory bodies as required by law\n• Our technology service providers (cloud hosting, payroll systems)\n• Professional advisers (accountants, lawyers) under strict confidentiality\n\nWe never sell your personal data to third parties for marketing purposes."
                },
                {
                  title: "6. Data Retention",
                  content: "We retain your personal data for as long as necessary to fulfil the purposes for which it was collected, including for legal, accounting, or reporting requirements. Generally: worker records are kept for 6 years after the end of the employment relationship, and financial records for 7 years as required by HMRC."
                },
                {
                  title: "7. Your Rights",
                  content: "Under UK GDPR, you have the right to:\n\n• Access your personal data\n• Rectify inaccurate data\n• Erase your data (right to be forgotten)\n• Restrict processing\n• Data portability\n• Object to processing\n• Not be subject to automated decision-making\n\nTo exercise any of these rights, contact us at privacy@primestaff.co.uk"
                },
                {
                  title: "8. Cookies",
                  content: "We use cookies to improve your experience on our platform. For full details, please see our Cookie Policy."
                },
                {
                  title: "9. Security",
                  content: "We implement appropriate technical and organisational measures to protect your personal data against unauthorised or unlawful processing, accidental loss, destruction, or damage. All data is encrypted in transit (TLS 1.3) and at rest (AES-256)."
                },
                {
                  title: "10. Contact Us",
                  content: "If you have any questions about this Privacy Policy or wish to exercise your rights, please contact:\n\nData Protection Officer\nPrimeStaff Solutions Ltd\nFirst Street, Manchester, M15 4FN\nEmail: privacy@primestaff.co.uk\nPhone: +44 161 234 5678\n\nIf you are not satisfied with our response, you have the right to complain to the Information Commissioner's Office (ICO) at ico.org.uk."
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
                  <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
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
