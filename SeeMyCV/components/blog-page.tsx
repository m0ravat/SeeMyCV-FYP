"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
  BookOpen,
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Clock,
  User,
  Calendar,
  ArrowRight,
  Tag,
  TrendingUp,
  BarChart2,
  FileText,
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

interface BlogPageProps {
  isAdmin?: boolean;
}

const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "10 Tips for Writing an Effective CV in 2026",
    excerpt: "Learn the essential strategies for creating a CV that stands out to recruiters and passes ATS systems.",
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
    excerpt: "A comprehensive guide to highlighting technical skills, projects, and achievements for software development positions.",
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
    excerpt: "Discover how to leverage transferable skills when transitioning to a new industry or role.",
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
    excerpt: "Learn how Applicant Tracking Systems work and how to optimize your CV to pass automated screening.",
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
    excerpt: "Step-by-step instructions for recent graduates entering the job market with limited work experience.",
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

export function BlogPage({ isAdmin = false }: BlogPageProps) {
  const [posts, setPosts] = useState(mockPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [activeTab, setActiveTab] = useState("published");
  const [isCreating, setIsCreating] = useState(false);
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
    const matchesCategory =
      selectedCategory === "All Categories" || post.category === selectedCategory;
    const matchesStatus =
      activeTab === "all" || post.status === activeTab;
    return matchesSearch && matchesCategory && matchesStatus;
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

  // Public Blog View
  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4">
            <BookOpen className="w-3 h-3 mr-1" />
            Blog
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Career Advice & CV Tips
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Expert guidance to help you create standout CVs and advance your career
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
        {publishedPosts.length > 0 && (
          <Card className="mb-8 overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-8 flex items-center justify-center">
                <BookOpen className="w-24 h-24 text-primary/40" />
              </div>
              <CardContent className="p-6 flex flex-col justify-center">
                <Badge variant="secondary" className="w-fit mb-3">
                  {publishedPosts[0].category}
                </Badge>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  {publishedPosts[0].title}
                </h2>
                <p className="text-muted-foreground mb-4">{publishedPosts[0].excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {publishedPosts[0].author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {publishedPosts[0].readTime}
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
          {filteredPosts
            .filter((p) => p.status === "published")
            .slice(1)
            .map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
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

        {filteredPosts.filter((p) => p.status === "published").length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter to find what you are looking for
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Admin Dashboard View
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Blog Dashboard</h1>
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
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Excerpt</Label>
                <Textarea
                  placeholder="Brief description of the article..."
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                  rows={2}
                />
              </div>
              <div>
                <Label>Content</Label>
                <Textarea
                  placeholder="Write your article content..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={8}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={newPost.category}
                    onValueChange={(value) => setNewPost({ ...newPost, category: value })}
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
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
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
                <p className="text-2xl font-bold text-foreground">{publishedPosts.length}</p>
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
                <p className="text-2xl font-bold text-foreground">{draftPosts.length}</p>
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
          <div className="flex items-center justify-between">
            <CardTitle>All Posts</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All ({posts.length})</TabsTrigger>
              <TabsTrigger value="published">Published ({publishedPosts.length})</TabsTrigger>
              <TabsTrigger value="draft">Drafts ({draftPosts.length})</TabsTrigger>
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
                        <h3 className="font-medium text-foreground truncate">{post.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{post.author}</span>
                          <span>·</span>
                          <span>{post.category}</span>
                          {post.status === "published" && (
                            <>
                              <span>·</span>
                              <span>{post.publishedAt}</span>
                              <span>·</span>
                              <span>{post.views} views</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={post.status === "published" ? "default" : "secondary"}
                        className={post.status === "published" ? "bg-success text-success-foreground" : ""}
                      >
                        {post.status}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
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
                    <h3 className="font-semibold text-foreground mb-2">No posts found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or create a new post
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
