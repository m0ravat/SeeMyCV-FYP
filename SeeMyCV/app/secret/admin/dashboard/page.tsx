"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Search,
  LogOut,
  Shield,
  FileText,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  mainContent: string;
  htmlSection: string;
  category: string;
  status: "published" | "draft";
  publishedAt: string;
}

const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "10 Tips for Writing an Effective CV in 2026",
    summary: "Learn the essential strategies for creating a CV that stands out to recruiters and passes ATS systems.",
    mainContent: "Full content about CV tips...",
    htmlSection: "<h2>Key Points</h2><p>This section can contain HTML content.</p>",
    category: "CV Tips",
    status: "published",
    publishedAt: "January 15, 2026",
  },
  {
    id: "2",
    title: "How to Tailor Your CV for Tech Roles",
    summary: "A comprehensive guide to highlighting technical skills and projects.",
    mainContent: "Full content about tech CVs...",
    htmlSection: "<h2>Tech Stack</h2><p>Showcase your technical expertise.</p>",
    category: "Industry Guides",
    status: "published",
    publishedAt: "January 10, 2026",
  },
  {
    id: "3",
    title: "Draft: Career Change Guide",
    summary: "Transitioning to a new career path.",
    mainContent: "Draft content here...",
    htmlSection: "<h2>Getting Started</h2>",
    category: "Career Change",
    status: "draft",
    publishedAt: "",
  },
];

const categories = ["CV Tips", "Industry Guides", "Career Change", "Getting Started", "Career Advice"];

export default function AdminDashboard() {
  const router = useRouter();
  const [posts, setPosts] = useState(mockPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    mainContent: "",
    htmlSection: "",
    category: "",
  });

  // Check authentication on mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (!isLoggedIn) {
      router.push("/secret/admin");
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeTab === "all" || post.status === activeTab;
    return matchesSearch && matchesStatus;
  });

  const handleCreateOrUpdate = () => {
    if (!formData.title || !formData.summary || !formData.category) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingId) {
      setPosts(
        posts.map((p) =>
          p.id === editingId
            ? {
                ...p,
                ...formData,
                publishedAt: p.publishedAt || new Date().toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
              }
            : p
        )
      );
      setEditingId(null);
    } else {
      const newPost: BlogPost = {
        id: Date.now().toString(),
        ...formData,
        status: "draft",
        publishedAt: "",
      };
      setPosts([newPost, ...posts]);
    }

    setFormData({
      title: "",
      summary: "",
      mainContent: "",
      htmlSection: "",
      category: "",
    });
    setIsCreating(false);
  };

  const handleEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      summary: post.summary,
      mainContent: post.mainContent,
      htmlSection: post.htmlSection,
      category: post.category,
    });
    setEditingId(post.id);
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter((p) => p.id !== id));
    }
  };

  const handlePublish = (id: string) => {
    setPosts(
      posts.map((p) =>
        p.id === id
          ? {
              ...p,
              status: "published",
              publishedAt: p.publishedAt || new Date().toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            }
          : p
      )
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    router.push("/secret/admin");
  };

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Blog Admin</h1>
                <p className="text-xs text-muted-foreground">Manage blog content</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Blog Dashboard</h2>
            <p className="text-muted-foreground">Create and manage blog posts</p>
          </div>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="w-4 h-4 mr-2" />
                {editingId ? "Update Post" : "Create Post"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
                <DialogDescription>
                  Fill in all fields to create or update a blog post
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    placeholder="Enter post title..."
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Summary *</Label>
                  <Textarea
                    placeholder="Brief summary of the article..."
                    value={formData.summary}
                    onChange={(e) =>
                      setFormData({ ...formData, summary: e.target.value })
                    }
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Main Content</Label>
                  <Textarea
                    placeholder="Write your article's main content..."
                    value={formData.mainContent}
                    onChange={(e) =>
                      setFormData({ ...formData, mainContent: e.target.value })
                    }
                    rows={6}
                  />
                </div>
                <div>
                  <Label>HTML Page Section</Label>
                  <Textarea
                    placeholder="Add custom HTML content (optional)..."
                    value={formData.htmlSection}
                    onChange={(e) =>
                      setFormData({ ...formData, htmlSection: e.target.value })
                    }
                    rows={4}
                    className="font-mono text-sm"
                  />
                </div>
                <div>
                  <Label>Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
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
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingId(null);
                      setFormData({
                        title: "",
                        summary: "",
                        mainContent: "",
                        htmlSection: "",
                        category: "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateOrUpdate}>
                    {editingId ? "Update Post" : "Create Post"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{posts.length}</p>
                  <p className="text-sm text-muted-foreground">Total Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{publishedCount}</p>
                  <p className="text-sm text-muted-foreground">Published</p>
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
                  <p className="text-2xl font-bold text-foreground">{draftCount}</p>
                  <p className="text-sm text-muted-foreground">Drafts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>Blog Posts</CardTitle>
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
                <TabsTrigger value="published">Published ({publishedCount})</TabsTrigger>
                <TabsTrigger value="draft">Drafts ({draftCount})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                <div className="space-y-3">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <div
                        key={post.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{post.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {post.summary}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <Badge variant="secondary">{post.category}</Badge>
                            {post.status === "published" && (
                              <>
                                <span>{post.publishedAt}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={post.status === "published" ? "default" : "secondary"}
                            className={post.status === "published" ? "bg-success text-success-foreground" : ""}
                          >
                            {post.status}
                          </Badge>
                          {post.status === "draft" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePublish(post.id)}
                              className="text-primary hover:text-primary"
                            >
                              Publish
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(post)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(post.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No posts found
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
