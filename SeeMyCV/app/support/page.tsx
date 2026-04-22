import Link from "next/link";
import { Mail, Phone, User, ArrowLeft, RefreshCcw, Clock, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Customer Support - CVConnect",
  description: "Get help with your CVConnect account, refunds, and general enquiries.",
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Customer Support</h1>
            <p className="text-sm text-muted-foreground">We&apos;re here to help</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">

        {/* Contact Card */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Contact Us</h2>
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Support Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-foreground font-medium">Muhammad Ravat</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                <a
                  href="tel:+447769004379"
                  className="text-primary hover:underline"
                >
                  +44 (0) 7769 004 379
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <a
                  href="mailto:m0ravat736@gmail.com"
                  className="text-primary hover:underline"
                >
                  m0ravat736@gmail.com
                </a>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Refunds Section */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Refund Policy</h2>
          <Card className="border border-border">
            <CardContent className="pt-6 space-y-6">
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <RefreshCcw className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">Eligibility</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Refund requests are accepted within <span className="text-foreground font-medium">14 days</span> of your purchase date. As our Premium plan is a one-time payment for lifetime access, refunds are only considered if you have not made significant use of the Premium features.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">Processing Time</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Once a refund is approved, it will be processed within <span className="text-foreground font-medium">5&ndash;10 business days</span> back to your original payment method via Stripe.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">How to Request</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    To request a refund, contact us by email at{" "}
                    <a href="mailto:m0ravat736@gmail.com" className="text-primary hover:underline">
                      m0ravat736@gmail.com
                    </a>{" "}
                    with your account email and reason for the refund. We aim to respond within 1&ndash;2 business days.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* General Help */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">General Enquiries</h2>
          <Card className="border border-border">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                For any other questions about your account, CV visibility settings, or technical issues, reach out directly by phone or email using the contact details above. We typically respond to all enquiries within <span className="text-foreground font-medium">24 hours</span>.
              </p>
            </CardContent>
          </Card>
        </section>

      </div>
    </main>
  );
}
