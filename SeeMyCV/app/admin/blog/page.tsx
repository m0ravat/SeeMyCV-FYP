"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  User,
  TrendingUp,
  FileText,
  ArrowLeft,
  Home,
  MessageSquare,
  Bell,
  Crown,
  Menu,
  X,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: string;
  views: number;
  status: "published" | "draft";
}

const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "10 Tips for Writing an Effective CV in 2026",
    excerpt:
      "Learn the essential strategies for creating a CV that stands out to recruiters and passes ATS systems.",
    content: "",
    author: "SeeMyCV Team",
    category: "CV Tips",
    tags: ["CV Writing", "Job Search", "Career Advice"],
    publishedAt: "January 15, 2026",
    readTime: "5 min read",
    views: 1234,
    status: "published",
  },
  {
    id: "2",
    title: "How to Tailor Your CV for Tech Roles",
    excerpt:
      "A comprehensive guide to highlighting technical skills, projects, and achievements for software development positions.",
    content: "",
    author: "Sarah Mitchell",
    category: "Industry Guides",
    tags: ["Tech", "Software Development", "CV Tips"],
    publishedAt: "January 10, 2026",
    readTime: "8 min read",
    views: 892,
    status: "published",
  },
  {
    id: "3",
    title: "The Power of Skills-Based CVs for Career Changers",
    excerpt:
      "Discover how to leverage transferable skills when transitioning to a new industry or role.",
    content: "",
    author: "James Rodriguez",
    category: "Career Change",
    tags: ["Career Change", "Skills", "CV Format"],
    publishedAt: "January 5, 2026",
    readTime: "6 min read",
    views: 756,
    status: "published",
  },
  {
    id: "4",
    title: "Understanding ATS: How to Beat the Bots",
    excerpt:
      "Learn how Applicant Tracking Systems work and how to optimize your CV to pass automated screening.",
    content: "",
    author: "SeeMyCV Team",
    category: "CV Tips",
    tags: ["ATS", "Job Applications", "CV Optimization"],
    publishedAt: "December 28, 2023",
    readTime: "7 min read",
    views: 2341,
    status: "published",
  },
  {
    id: "5",
    title: "Creating Your First CV: A Graduate's Guide",
    excerpt:
      "Step-by-step instructions for recent graduates entering the job market with limited work experience.",
    content: "",
    author: "Emily Chen",
    category: "Getting Started",
    tags: ["Graduates", "Entry Level", "First Job"],
    publishedAt: "December 20, 2023",
    readTime: "10 min read",
    views: 1567,
    status: "published",
  },
  {
    id: "6",
    title: "Draft: Networking Tips for Job Seekers",
    excerpt: "Building professional connections that lead to career opportunities.",
    content: "",
    author: "SeeMyCV Team",
    category: "Career Advice",
    tags: ["Networking", "Career Development"],
    publishedAt: "",
    readTime: "5 min read",
    views: 0,
    status: "draft",
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

export default function AdminBlogPage() {
  const [posts, setPosts] = useState(mockPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isCreating, setIsCreating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
  });

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeTab === "all" || post.status === activeTab;
    return matchesSearch && matchesStatus;
  });

  const publishedPosts = posts.filter((p) => p.status === "published");
  const draftPosts = posts.filter((p) => p.status === "draft");

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  const handleCreatePost = () => {
    const post: BlogPost = {
      id: Date.now().toString(),
      title: newPost.title,
      excerpt: newPost.excerpt,
      content: newPost.content,
      author: "Admin User",
      category: newPost.category,
      tags: newPost.tags.split(",").map((t) => t.trim()),
      publishedAt: new Date().toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      readTime: "5 min read",
      views: 0,
      status: "draft",
    };
    setPosts([post, ...posts]);
    setNewPost({ title: "", excerpt: "", content: "", category: "", tags: "" });
    setIsCreating(false);
  };

  const navItems = [
    { id: "feed", label: "Feed", icon: Home, href: "/" },
    { id: "my-cvs", label: "My CVs", icon: FileText, href: "/?page=my-cvs" },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
      href: "/?page=messages",
      badge: 3,
    },
    { id: "blog", label: "Blog", icon: BookOpen, href: "/blog" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-primary font-bold text-xl"
              >
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                  <span className="hidden sm:block">SeeMyCV</span>
              </Link>

              <Badge variant="secondary" className="gap-1">
                <Shield className="w-3 h-3" />
                Admin
              </Badge>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex flex-col items-center px-4 py-2 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary relative"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                  {item.badge && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex gap-1 border-premium text-premium hover:bg-premium hover:text-premium-foreground bg-transparent"
                asChild
              >
                <Link href="/?page=premium">
                  <Crown className="w-4 h-4" />
                  Upgrade
                </Link>
              </Button>

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="font-medium">Admin User</p>
                    <p className="text-sm text-muted-foreground">
                      admin@cvconnect.com
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/?page=profile">
                      <User className="w-4 h-4 mr-2" />
                      View Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/?page=settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 border-t border-border pt-4">
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge className="ml-auto bg-destructive text-destructive-foreground">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb & Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/blog"
              className="hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <span>/</span>
            <span className="text-foreground">Admin Dashboard</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Blog Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage blog posts and share career advice with users
            </p>
          </div>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Blog Post</DialogTitle>
                <DialogDescription>
                  Write a new article to help users with their career journey
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    placeholder="Enter post title..."
                    value={newPost.title}
                    onChange={(e) =>
                      setNewPost({ ...newPost, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Excerpt</Label>
                  <Textarea
                    placeholder="Brief description of the article..."
                    value={newPost.excerpt}
                    onChange={(e) =>
                      setNewPost({ ...newPost, excerpt: e.target.value })
                    }
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Content</Label>
                  <Textarea
                    placeholder="Write your article content..."
                    value={newPost.content}
                    onChange={(e) =>
                      setNewPost({ ...newPost, content: e.target.value })
                    }
                    rows={8}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={newPost.category}
                      onValueChange={(value) =>
                        setNewPost({ ...newPost, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tags (comma separated)</Label>
                    <Input
                      placeholder="e.g. CV Tips, Career Advice"
                      value={newPost.tags}
                      onChange={(e) =>
                        setNewPost({ ...newPost, tags: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                  <Button variant="outline">Save as Draft</Button>
                  <Button onClick={handleCreatePost}>Publish</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {publishedPosts.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Published Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Pencil className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {draftPosts.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Drafts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {posts.reduce((acc, p) => acc + p.views, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-premium/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-premium" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">+12%</p>
                  <p className="text-sm text-muted-foreground">Engagement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Management */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>All Posts</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All ({posts.length})</TabsTrigger>
                <TabsTrigger value="published">
                  Published ({publishedPosts.length})
                </TabsTrigger>
                <TabsTrigger value="draft">
                  Drafts ({draftPosts.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                <div className="space-y-3">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-foreground truncate">
                            {post.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span>{post.author}</span>
                            <span className="hidden sm:inline">·</span>
                            <span className="hidden sm:inline">{post.category}</span>
                            {post.status === "published" && (
                              <>
                                <span className="hidden sm:inline">·</span>
                                <span className="hidden sm:inline">{post.publishedAt}</span>
                                <span className="hidden sm:inline">·</span>
                                <span className="hidden sm:inline">{post.views} views</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant={
                            post.status === "published" ? "default" : "secondary"
                          }
                          className={
                            post.status === "published"
                              ? "bg-success text-success-foreground"
                              : ""
                          }
                        >
                          {post.status}
                        </Badge>
                        <Button variant="ghost" size="icon" className="hidden sm:flex">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hidden sm:flex">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {filteredPosts.length === 0 && (
                    <div className="text-center py-12">
                      <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">
                        No posts found
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery
                          ? "Try adjusting your search"
                          : "Create your first blog post to get started"}
                      </p>
                      {!searchQuery && (
                        <Button onClick={() => setIsCreating(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Post
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              2026 SeeMyCV Admin Dashboard. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
