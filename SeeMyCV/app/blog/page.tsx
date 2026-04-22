"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Search,
  Clock,
  User,
  Calendar,
  ArrowRight,
  FileText,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: string;
  views: number;
}

const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "10 Tips for Writing an Effective CV in 2024",
    excerpt:
      "Learn the essential strategies for creating a CV that stands out to recruiters and passes ATS systems.",
    author: "CVConnect Team",
    category: "CV Tips",
    tags: ["CV Writing", "Job Search", "Career Advice"],
    publishedAt: "January 15, 2024",
    readTime: "5 min read",
    views: 1234,
  },
  {
    id: "2",
    title: "How to Tailor Your CV for Tech Roles",
    excerpt:
      "A comprehensive guide to highlighting technical skills, projects, and achievements for software development positions.",
    author: "Sarah Mitchell",
    category: "Industry Guides",
    tags: ["Tech", "Software Development", "CV Tips"],
    publishedAt: "January 10, 2024",
    readTime: "8 min read",
    views: 892,
  },
  {
    id: "3",
    title: "The Power of Skills-Based CVs for Career Changers",
    excerpt:
      "Discover how to leverage transferable skills when transitioning to a new industry or role.",
    author: "James Rodriguez",
    category: "Career Change",
    tags: ["Career Change", "Skills", "CV Format"],
    publishedAt: "January 5, 2024",
    readTime: "6 min read",
    views: 756,
  },
  {
    id: "4",
    title: "Understanding ATS: How to Beat the Bots",
    excerpt:
      "Learn how Applicant Tracking Systems work and how to optimize your CV to pass automated screening.",
    author: "CVConnect Team",
    category: "CV Tips",
    tags: ["ATS", "Job Applications", "CV Optimization"],
    publishedAt: "December 28, 2023",
    readTime: "7 min read",
    views: 2341,
  },
  {
    id: "5",
    title: "Creating Your First CV: A Graduate's Guide",
    excerpt:
      "Step-by-step instructions for recent graduates entering the job market with limited work experience.",
    author: "Emily Chen",
    category: "Getting Started",
    tags: ["Graduates", "Entry Level", "First Job"],
    publishedAt: "December 20, 2023",
    readTime: "10 min read",
    views: 1567,
  },
  {
    id: "6",
    title: "Cover Letters That Get Results",
    excerpt:
      "Master the art of writing compelling cover letters that complement your CV and grab attention.",
    author: "CVConnect Team",
    category: "Career Advice",
    tags: ["Cover Letters", "Job Applications", "Writing Tips"],
    publishedAt: "December 15, 2023",
    readTime: "6 min read",
    views: 987,
  },
];

const categories = [
  "All Categories",
  "CV Tips",
  "Industry Guides",
  "Career Change",
  "Getting Started",
  "Career Advice",
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const filteredPosts = mockPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Public Navigation - Same as Landing Page */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">CVConnect</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="/#templates" className="text-muted-foreground hover:text-foreground transition-colors">
                Templates
              </Link>
              <Link href="/#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/blog" className="text-primary font-medium">
                Blog
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-foreground">
                  Log in
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4">
            <BookOpen className="w-3 h-3 mr-1" />
            Blog
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">
            Career Advice & CV Tips
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Expert guidance to help you create standout CVs and advance your
            career
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <Card className="mb-8 overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-8 flex items-center justify-center min-h-48">
                <BookOpen className="w-24 h-24 text-primary/40" />
              </div>
              <CardContent className="p-6 flex flex-col justify-center">
                <Badge variant="secondary" className="w-fit mb-3">
                  {filteredPosts[0].category}
                </Badge>
                <h2 className="text-2xl font-bold text-foreground mb-3 text-balance">
                  {filteredPosts[0].title}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {filteredPosts[0].excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {filteredPosts[0].author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {filteredPosts[0].readTime}
                  </span>
                </div>
                <Button className="w-fit">
                  Read Article
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </div>
          </Card>
        )}

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.slice(1).map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {post.readTime}
                  </span>
                </div>
                <CardTitle className="text-lg line-clamp-2">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {post.publishedAt}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" className="w-full">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-foreground mb-2">
                No articles found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter to find what you are looking
                for
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">CVConnect</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Build your career with professional CVs and connect with opportunities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/#templates" className="hover:text-foreground transition-colors">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="/#pricing" className="hover:text-foreground transition-colors">
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
                  <button className="hover:text-foreground transition-colors">About Us</button>
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
            <p>2024 CVConnect. All rights reserved. Built with privacy in mind - no profile pictures to prevent discrimination.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
