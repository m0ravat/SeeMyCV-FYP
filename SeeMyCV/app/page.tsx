"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Sparkles,
  Shield,
  Users,
  ArrowRight,
  CheckCircle2,
  Star,
  TrendingUp,
  Award,
  BookOpen,
  ThumbsUp,
  Briefcase,
  Code,
  GraduationCap,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: FileText,
      title: "Professional CV Templates",
      description:
        "Choose from industry-specific templates for tech, customer service, teaching, and more. Create CVs that stand out.",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Feedback",
      description:
        "Get intelligent suggestions to improve your CV with our premium AI feedback system. Optimize for ATS and recruiters.",
    },
    {
      icon: Shield,
      title: "Privacy-First Design",
      description:
        "No profile pictures to prevent discrimination. Your skills and experience speak for themselves.",
    },
    {
      icon: ThumbsUp,
      title: "Community Upvotes",
      description:
        "Get your CV upvoted by the community and gain visibility. See which CVs are trending in your industry.",
    },
    {
      icon: Users,
      title: "Community Feedback",
      description:
        "Share your CV publicly and get constructive feedback from the community through comments.",
    },
    {
      icon: BookOpen,
      title: "Career Resources",
      description:
        "Access expert career advice, industry insights, and CV writing guides on our blog.",
    },
  ];

  const cvTemplates = [
    { name: "Entry-Level", description: "Perfect for graduates and career starters", icon: BookOpen },
    { name: "Customer Service", description: "Skills-focused for service roles", icon: Users },
    { name: "Tech & IT", description: "Highlight technical skills and projects", icon: Code },
    { name: "Teaching", description: "Showcase education expertise", icon: GraduationCap },
  ];
  const testimonials = [
    {
      name: "Sarah M.",
      role: "Software Engineer",
      company: "TechCorp",
      content:
        "SeeMyCV helped me land my dream job. The AI feedback was incredibly helpful in optimizing my CV for tech roles.",
      rating: 5,
    },
    {
      name: "James P.",
      role: "Customer Service Lead",
      company: "RetailMax",
      content:
        "The skills-based CV template was perfect for highlighting my customer service experience. Got 3 interview calls in a week!",
      rating: 5,
    },
    {
      name: "Emily R.",
      role: "Teacher",
      company: "City Academy",
      content:
        "I love that there are no profile pictures - it keeps the focus on qualifications. The teaching template was exactly what I needed.",
      rating: 5,
    },
  ];


  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">SeeMyCV</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#templates" className="text-muted-foreground hover:text-foreground transition-colors">
                Templates
              </Link>
              <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-foreground">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered CV Platform
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                Build Your Career with Professional CVs
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Create stunning, ATS-optimized CVs with our industry-specific templates. 
                Get AI feedback, connect with recruiters, and land your dream job.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                    Learn More
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-sm font-medium text-primary"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">50,000+</span> professionals trust SeeMyCV
                </div>
              </div>
            </div>

            {/* Hero Visual - CV Preview */}
            <div className="relative">
              <div className="bg-card rounded-2xl shadow-2xl border border-border p-6 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary mb-3">
                        JD
                      </div>
                      <h3 className="text-xl font-bold text-foreground">John Doe</h3>
                      <p className="text-muted-foreground">Software Engineer</p>
                    </div>
                    <Badge className="bg-accent text-accent-foreground">Open to Work</Badge>
                  </div>
                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">Experience</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Senior Developer at TechCorp (2020-Present)</p>
                      <p>Full Stack Developer at StartupXYZ (2018-2020)</p>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {["React", "Node.js", "TypeScript", "AWS"].map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-success text-success-foreground px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">ATS Optimized</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Everything You Need to Succeed
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From professional templates to AI-powered feedback, we provide all the tools 
              you need to create a winning CV and advance your career.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-20 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Templates</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Industry-Specific CV Templates
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our professionally designed templates tailored for different industries and career stages.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cvTemplates.map((template) => {
              const TemplateIcon = template.icon;
              return (
                <div
                  key={template.name}
                  className="bg-background rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mb-4 flex items-center justify-center">
                    <TemplateIcon className="w-16 h-16 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Loved by Professionals
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See what our users have to say about their experience with SeeMyCV.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-card rounded-xl p-6 border border-border"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-premium text-premium" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">{`"${testimonial.content}"`}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start for free, upgrade when you need more. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-background rounded-2xl border border-border p-8">
              <h3 className="text-xl font-semibold text-foreground mb-2">Free</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-foreground">£0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Basic CV formats",
                  "Access to profile setup",
                  "Public CV sharing",
                  "View other profiles",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full bg-transparent">Get Started</Button>
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-primary rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-premium text-premium-foreground">Popular</Badge>
              </div>
              <h3 className="text-xl font-semibold text-primary-foreground mb-2">Premium</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-primary-foreground">£5</span>
                <span className="text-primary-foreground/80">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited CV formats",
                  "AI-powered CV feedback",
                  "All Free features"
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-primary-foreground/90">
                    <CheckCircle2 className="w-5 h-5 text-premium flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard">
                <Button className="w-full bg-card text-foreground hover:bg-card/90">
                  <Award className="w-5 h-5 mr-2" />
                  Upgrade to Premium
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
            Ready to Build Your Perfect CV?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already landed their dream jobs with SeeMyCV.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Create Your Free Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/blog">
              <Button size="lg" variant="outline" className="bg-transparent">
                <TrendingUp className="w-5 h-5 mr-2" />
                Read Career Tips
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">SeeMyCV</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Build your career with professional CVs and connect with opportunities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#templates" className="hover:text-foreground transition-colors">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/blog" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-foreground transition-colors">
                    Career Guides
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-foreground transition-colors">
                    CV Tips
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/support" className="hover:text-foreground transition-colors">Support</Link>
                </li>
                <li>
                  <button className="hover:text-foreground transition-colors">Privacy Policy</button>
                </li>
                <li>
                  <button className="hover:text-foreground transition-colors">Terms of Service</button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
              <p>2026 SeeMyCV. All rights reserved. Built with privacy in mind - no profile pictures to prevent discrimination.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
