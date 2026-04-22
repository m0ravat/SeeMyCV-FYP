"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CVCard, CVData } from "@/components/cv-card";
import { FeedFilters, FilterState } from "@/components/feed-filters";
import { Loader2, TrendingUp, Users, FileText, Award } from "lucide-react";

// Mock CV data
const mockCVs: CVData[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    title: "Senior Frontend Developer",
    industry: "Technology",
    experienceLevel: "Senior",
    company: "Google",
    location: "London, UK",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Tailwind CSS"],
    summary: "Passionate frontend developer with 7+ years of experience building scalable web applications. Specialized in React ecosystem and modern JavaScript frameworks.",
    upvotes: 234,
    comments: 45,
    postedAt: "2 hours ago",
    openForFeedback: true,
    privacyStatus: "open",
  },
  {
    id: "2",
    name: "James Rodriguez",
    title: "Customer Success Manager",
    industry: "Customer Service",
    experienceLevel: "Mid Level",
    company: "Salesforce",
    location: "Manchester, UK",
    skills: ["CRM", "Customer Relations", "Team Leadership", "Salesforce", "Zendesk"],
    summary: "Results-driven customer success professional dedicated to building lasting client relationships and driving retention through proactive engagement strategies.",
    upvotes: 156,
    comments: 28,
    postedAt: "5 hours ago",
    openForFeedback: true,
    privacyStatus: "select",
  },
  {
    id: "3",
    name: "Emily Chen",
    title: "Secondary Mathematics Teacher",
    industry: "Education",
    experienceLevel: "Mid Level",
    company: "Westfield Academy",
    location: "Birmingham, UK",
    skills: ["Curriculum Development", "Classroom Management", "Student Assessment", "GCSE/A-Level"],
    summary: "Dedicated educator with a passion for making mathematics accessible and engaging for all students. Experience in both traditional and digital learning environments.",
    upvotes: 189,
    comments: 34,
    postedAt: "8 hours ago",
    openForFeedback: false,
    privacyStatus: "open",
  },
  {
    id: "4",
    name: "Michael Thompson",
    title: "Junior Software Engineer",
    industry: "Technology",
    experienceLevel: "Entry Level",
    company: "Startup",
    location: "Bristol, UK",
    skills: ["Python", "JavaScript", "SQL", "Git", "Docker"],
    summary: "Recent computer science graduate eager to contribute to innovative projects. Strong foundation in algorithms and data structures with hands-on project experience.",
    upvotes: 89,
    comments: 52,
    postedAt: "12 hours ago",
    openForFeedback: true,
    privacyStatus: "open",
  },
  {
    id: "5",
    name: "Alexandra Wright",
    title: "Chief Technology Officer",
    industry: "Technology",
    experienceLevel: "Executive",
    company: "TechVentures Ltd",
    location: "Edinburgh, UK",
    skills: ["Strategic Planning", "Team Building", "Cloud Architecture", "Agile", "Budget Management"],
    summary: "Visionary technology leader with 15+ years of experience driving digital transformation. Proven track record of scaling engineering teams and delivering enterprise solutions.",
    upvotes: 412,
    comments: 67,
    postedAt: "1 day ago",
    openForFeedback: false,
    privacyStatus: "unavailable",
  },
  {
    id: "6",
    name: "David Park",
    title: "Full Stack Developer",
    industry: "Technology",
    experienceLevel: "Mid Level",
    company: "Microsoft",
    location: "Reading, UK",
    skills: ["C#", ".NET", "Azure", "React", "SQL Server", "Microservices"],
    summary: "Versatile developer comfortable across the full technology stack. Passionate about clean code and building systems that scale.",
    upvotes: 198,
    comments: 23,
    postedAt: "1 day ago",
    openForFeedback: true,
    privacyStatus: "open",
  },
  {
    id: "7",
    name: "Priya Sharma",
    title: "UX Designer",
    industry: "Design",
    experienceLevel: "Senior",
    company: "Apple",
    location: "London, UK",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Accessibility"],
    summary: "Human-centered designer focused on creating intuitive and accessible digital experiences. Background in cognitive psychology informs research-driven design approach.",
    upvotes: 287,
    comments: 41,
    postedAt: "2 days ago",
    openForFeedback: true,
    privacyStatus: "select",
  },
  {
    id: "8",
    name: "Robert Taylor",
    title: "Finance Analyst",
    industry: "Finance",
    experienceLevel: "Mid Level",
    company: "Barclays",
    location: "Canary Wharf, UK",
    skills: ["Financial Modeling", "Excel", "Power BI", "Risk Analysis", "SQL"],
    summary: "Detail-oriented analyst with expertise in financial modeling and data visualization. Experience in investment banking and corporate finance sectors.",
    upvotes: 145,
    comments: 19,
    postedAt: "2 days ago",
    openForFeedback: false,
    privacyStatus: "private",
  },
  {
    id: "9",
    name: "Lisa Anderson",
    title: "Marketing Manager",
    industry: "Marketing",
    experienceLevel: "Senior",
    company: "Meta",
    location: "Dublin, Ireland",
    skills: ["Digital Marketing", "SEO/SEM", "Content Strategy", "Analytics", "Brand Management"],
    summary: "Creative marketing professional with a data-driven approach to campaign optimization. Expertise in both B2B and B2C marketing across multiple channels.",
    upvotes: 223,
    comments: 38,
    postedAt: "3 days ago",
    openForFeedback: true,
    privacyStatus: "open",
  },
  {
    id: "10",
    name: "Thomas Williams",
    title: "DevOps Engineer",
    industry: "Technology",
    experienceLevel: "Senior",
    company: "Amazon",
    location: "Cambridge, UK",
    skills: ["Kubernetes", "AWS", "Terraform", "CI/CD", "Python", "Linux"],
    summary: "Infrastructure specialist passionate about automation and reliability. Experienced in building and maintaining large-scale distributed systems.",
    upvotes: 312,
    comments: 56,
    postedAt: "3 days ago",
    openForFeedback: true,
    privacyStatus: "open",
  },
];

export function PublicFeed() {
  const [filters, setFilters] = useState<FilterState>({
    experienceLevels: [],
    industries: [],
    companies: [],
    sortBy: "recent",
  });
  const [displayCount, setDisplayCount] = useState(10);
  const [loading, setLoading] = useState(false);

  // Filter and sort CVs
  const filteredCVs = mockCVs
    .filter((cv) => {
      if (filters.experienceLevels.length > 0 && !filters.experienceLevels.includes(cv.experienceLevel)) {
        return false;
      }
      if (filters.industries.length > 0 && !filters.industries.includes(cv.industry)) {
        return false;
      }
      if (filters.companies.length > 0 && cv.company && !filters.companies.includes(cv.company)) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === "upvotes") return b.upvotes - a.upvotes;
      if (filters.sortBy === "comments") return b.comments - a.comments;
      return 0; // recent is default order
    });

  const displayedCVs = filteredCVs.slice(0, displayCount);
  const hasMore = displayCount < filteredCVs.length;

  const loadMore = () => {
    setLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setDisplayCount((prev) => prev + 10);
      setLoading(false);
    }, 500);
  };

  const handleView = (id: string) => {
    console.log("View CV:", id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">CV Feed</h1>
            <p className="text-muted-foreground">
              Discover professional CVs, provide feedback, and connect with talented individuals
            </p>
          </div>

          <FeedFilters filters={filters} onFiltersChange={setFilters} />

          <div className="space-y-4">
            {displayedCVs.length > 0 ? (
              <>
                {displayedCVs.map((cv) => (
                  <CVCard
                    key={cv.id}
                    cv={cv}
                    onView={handleView}
                  />
                ))}

                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={loadMore}
                      disabled={loading}
                      variant="outline"
                      className="w-full max-w-xs bg-transparent"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        `More... (${filteredCVs.length - displayCount} remaining)`
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No CVs found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters to see more results
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Stats Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Platform Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">2,847</p>
                  <p className="text-sm text-muted-foreground">CVs Shared</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">1,234</p>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">12,567</p>
                  <p className="text-sm text-muted-foreground">Feedback Given</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Industries */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Trending Industries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Technology", count: 847, trend: "+12%" },
                  { name: "Finance", count: 423, trend: "+8%" },
                  { name: "Healthcare", count: 312, trend: "+15%" },
                  { name: "Education", count: 289, trend: "+5%" },
                  { name: "Marketing", count: 245, trend: "+10%" },
                ].map((industry) => (
                  <div
                    key={industry.name}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-foreground">{industry.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {industry.count}
                      </span>
                      <span className="text-xs text-success">{industry.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Premium CTA */}
          <Card className="bg-gradient-to-br from-premium/10 to-primary/10 border-premium/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <Award className="w-10 h-10 mx-auto text-premium mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Go Premium</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get AI feedback on your CV and unlimited CV creation slots
                </p>
                <Button className="w-full bg-premium text-premium-foreground hover:bg-premium/90">
                  Upgrade for £5/month
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
