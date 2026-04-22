"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Crown,
  Check,
  Sparkles,
  FileText,
  Zap,
  Shield,
  Star,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PremiumPageProps {
  onSubscribe?: () => void;
}

export function PremiumPage({ onSubscribe }: PremiumPageProps) {
  const [isAnnual, setIsAnnual] = useState(false);

  const monthlyPrice = 5;
  const annualPrice = 48; // £4/month billed annually
  const currentPrice = isAnnual ? annualPrice : monthlyPrice;
  const savings = isAnnual ? (monthlyPrice * 12 - annualPrice) : 0;

  const features = [
    {
      icon: FileText,
      title: "Unlimited CV Slots",
      description: "Create and manage unlimited CVs for different roles and industries",
      free: "2 CV slots",
      premium: "Unlimited",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Feedback",
      description: "Get detailed AI analysis and suggestions to improve your CV",
      free: "Not available",
      premium: "Unlimited reports",
    },
    {
      icon: Zap,
      title: "Priority Support",
      description: "Get faster responses and dedicated support for your questions",
      free: "Standard support",
      premium: "Priority queue",
    },
    {
      icon: Shield,
      title: "Advanced Privacy",
      description: "Enhanced privacy controls and profile visibility options",
      free: "Basic controls",
      premium: "Full control",
    },
    {
      icon: Star,
      title: "Premium Badge",
      description: "Stand out with a premium badge on your profile and CVs",
      free: "No badge",
      premium: "Premium badge",
    },
  ];

  const testimonials = [
    {
      name: "Alex Turner",
      role: "Software Engineer",
      content: "The AI feedback helped me land 3 interviews in my first week. Worth every penny!",
    },
    {
      name: "Maria Santos",
      role: "Marketing Manager",
      content: "Being able to create multiple tailored CVs for different roles was a game-changer.",
    },
    {
      name: "David Kim",
      role: "Recent Graduate",
      content: "The premium features gave me confidence that my CV was professionally polished.",
    },
  ];

  const faqs = [
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and PayPal. All payments are securely processed.",
    },
    {
      question: "Is there a free trial available?",
      answer: "We offer a 7-day free trial for new users. You can explore all premium features before committing to a subscription.",
    },
    {
      question: "What happens to my CVs if I downgrade?",
      answer: "Your CVs will remain saved, but you'll only be able to edit your 2 most recent ones. AI feedback reports will also be preserved.",
    },
    {
      question: "Can I get a refund?",
      answer: "We offer a 14-day money-back guarantee. If you're not satisfied, contact support for a full refund.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge className="bg-premium text-premium-foreground mb-4">
          <Crown className="w-3 h-3 mr-1" />
          Premium
        </Badge>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Supercharge Your Job Search
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get AI-powered CV feedback, unlimited CV creation, and premium features
          to help you land your dream job faster.
        </p>
      </div>

      {/* Pricing Toggle */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <Label htmlFor="billing-toggle" className={!isAnnual ? "text-foreground font-medium" : "text-muted-foreground"}>
          Monthly
        </Label>
        <Switch
          id="billing-toggle"
          checked={isAnnual}
          onCheckedChange={setIsAnnual}
        />
        <Label htmlFor="billing-toggle" className={isAnnual ? "text-foreground font-medium" : "text-muted-foreground"}>
          Annual
          <Badge variant="secondary" className="ml-2 bg-success/10 text-success">
            Save £{savings}
          </Badge>
        </Label>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
        {/* Free Tier */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              Free
            </CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <span className="text-4xl font-bold text-foreground">£0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-success" />
                <span className="text-foreground">2 CV creation slots</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-success" />
                <span className="text-foreground">Basic profile customization</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-success" />
                <span className="text-foreground">Public feed access</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-success" />
                <span className="text-foreground">Direct messaging</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-4 h-4 flex items-center justify-center">-</span>
                <span>AI-powered feedback</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-4 h-4 flex items-center justify-center">-</span>
                <span>Premium badge</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full bg-transparent" disabled>
              Current Plan
            </Button>
          </CardFooter>
        </Card>

        {/* Premium Tier */}
        <Card className="border-premium relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-premium text-premium-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
            RECOMMENDED
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-premium/10 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-premium" />
              </div>
              Premium
            </CardTitle>
            <CardDescription>Everything you need to succeed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <span className="text-4xl font-bold text-foreground">
                £{isAnnual ? Math.round(annualPrice / 12) : monthlyPrice}
              </span>
              <span className="text-muted-foreground">/month</span>
              {isAnnual && (
                <p className="text-sm text-muted-foreground mt-1">
                  Billed annually (£{annualPrice}/year)
                </p>
              )}
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-premium" />
                <span className="text-foreground font-medium">Unlimited CV creation slots</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-premium" />
                <span className="text-foreground font-medium">AI-powered CV feedback</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-premium" />
                <span className="text-foreground">Advanced profile customization</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-premium" />
                <span className="text-foreground">Priority support</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-premium" />
                <span className="text-foreground">Premium profile badge</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-premium" />
                <span className="text-foreground">Enhanced privacy controls</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-premium text-premium-foreground hover:bg-premium/90"
              onClick={onSubscribe}
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Feature Comparison */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">
          Feature Comparison
        </h2>
        <div className="grid gap-4 max-w-4xl mx-auto">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-8">
                    <div className="text-center w-24">
                      <p className="text-xs text-muted-foreground mb-1">Free</p>
                      <p className="text-sm text-foreground">{feature.free}</p>
                    </div>
                    <div className="text-center w-24">
                      <p className="text-xs text-premium mb-1">Premium</p>
                      <p className="text-sm font-medium text-foreground">{feature.premium}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">
          What Premium Users Say
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name}>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-premium text-premium" />
                  ))}
                </div>
                <p className="text-foreground mb-4">{`"${testimonial.content}"`}</p>
                <div>
                  <p className="font-medium text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-premium/10 to-primary/10 border-premium/20">
          <CardContent className="py-8">
            <Crown className="w-12 h-12 mx-auto text-premium mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Ready to stand out?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of professionals who have upgraded their job search with CVConnect Premium.
            </p>
            <Button
              size="lg"
              className="bg-premium text-premium-foreground hover:bg-premium/90"
              onClick={onSubscribe}
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              7-day free trial. Cancel anytime.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
