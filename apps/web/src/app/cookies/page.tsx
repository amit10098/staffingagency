import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Cookie } from "lucide-react";

export const metadata = {
  title: "Cookie Policy | PrimeStaff Solutions",
  description: "Information about how PrimeStaff uses cookies on its platform.",
};

export default function CookiesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="relative py-20 overflow-hidden">
          <div className="hero-gradient absolute inset-0 -z-10" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">Legal</Badge>
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-5 mx-auto">
              <Cookie className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-4">Cookie Policy</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">Last updated: 1 June 2025</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-10">
              
              <div className="p-6 rounded-2xl bg-muted/40 border">
                <p className="text-muted-foreground leading-relaxed">
                  This Cookie Policy explains how PrimeStaff Solutions Ltd uses cookies and similar tracking technologies when you visit our website and platform. By using our services, you consent to the use of cookies as described in this policy.
                </p>
              </div>

              {[
                {
                  title: "What Are Cookies?",
                  content: "Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work efficiently and to provide information to website owners. Cookies can be 'session cookies' (deleted when you close your browser) or 'persistent cookies' (which remain on your device for a set period)."
                },
                {
                  title: "How We Use Cookies",
                  content: "We use cookies to:\n\n• Keep you logged in securely to the platform\n• Remember your preferences and settings\n• Understand how you use our platform (analytics)\n• Improve platform performance and user experience\n• Prevent fraudulent activity and enhance security"
                },
                {
                  title: "Types of Cookies We Use",
                  content: "Essential Cookies — Required for the platform to function. These include authentication tokens, session management, and security cookies. These cannot be disabled.\n\nAnalytical Cookies — Help us understand how users interact with our platform. We use this data to improve our services. These include page view tracking and performance metrics.\n\nFunctional Cookies — Allow us to remember your preferences such as dark/light mode, language settings, and last-visited sections.\n\nMarketing Cookies — Used with your consent to show relevant content. You can opt out of these at any time."
                },
                {
                  title: "Third-Party Cookies",
                  content: "We may allow third-party services to set cookies on our platform, including:\n\n• Google Analytics (analytics)\n• Intercom (customer support chat)\n• Stripe (payment processing)\n\nThese third parties have their own privacy policies and we recommend reviewing them."
                },
                {
                  title: "Managing Cookies",
                  content: "You can control cookies through your browser settings. Most browsers allow you to:\n\n• View which cookies are set\n• Delete individual cookies or all cookies\n• Block cookies from specific sites\n• Block all cookies\n\nNote: disabling essential cookies may prevent some parts of our platform from working correctly."
                },
                {
                  title: "Your Consent",
                  content: "When you first visit our platform, we ask for your consent to set non-essential cookies. You can change your cookie preferences at any time by clicking 'Cookie Settings' in the footer or contacting us at privacy@primestaff.co.uk."
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
                  <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
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
