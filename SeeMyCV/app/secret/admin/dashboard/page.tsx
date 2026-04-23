"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  TrendingUp,
  Loader2,
  Calendar,
  Send,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  full_blog: string;
  category: string;
  created_at: string;
  isDraft: boolean;
}

const CATEGORIES = [
  "CV Tips",
  "Industry Guides",
  "Career Change",
  "Getting Started",
  "Career Advice",
];

const emptyForm = { title: "", summary: "", full_blog: "", category: "", isDraft: true };

function formatDate(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminDashboard() {
  const router = useRouter();
  // Middleware guarantees the user is authenticated before this page renders

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "published" | "drafts">("all");

  // Create modal
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState(emptyForm);

  // Edit modal
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

  // Preview modal
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blog?all=true");
      const data = await res.json();
      setPosts(data.posts ?? []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const publishedPosts = posts.filter((p) => !p.isDraft);
  const draftPosts = posts.filter((p) => p.isDraft);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "published" && !post.isDraft) ||
      (activeTab === "drafts" && post.isDraft);
    return matchesSearch && matchesTab;
  });

  // Create
  const handleCreate = async (asDraft: boolean) => {
    if (!createForm.title || !createForm.summary || !createForm.full_blog) return;
    setSaving(true);
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...createForm, isDraft: asDraft }),
      });
      if (res.ok) {
        setIsCreating(false);
        setCreateForm(emptyForm);
        await fetchPosts();
      }
    } finally {
      setSaving(false);
    }
  };

  // Edit
  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    setEditForm({
      title: post.title,
      summary: post.summary,
      full_blog: post.full_blog,
      category: post.category ?? "",
      isDraft: post.isDraft,
    });
  };

  const handleUpdate = async () => {
    if (!editingPost || !editForm.title || !editForm.summary || !editForm.full_blog) return;
    setSaving(true);
    try {
      const res = await fetch("/api/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingPost.id, ...editForm }),
      });
      if (res.ok) {
        setEditingPost(null);
        await fetchPosts();
      }
    } finally {
      setSaving(false);
    }
  };

  // Quick-publish a draft without opening the edit modal
  const handlePublish = async (post: BlogPost) => {
    setSaving(true);
    try {
      await fetch("/api/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...post, isDraft: false }),
      });
      await fetchPosts();
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!deletingId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/blog", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deletingId }),
      });
      if (res.ok) {
        setDeletingId(null);
        await fetchPosts();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/secret/admin");
  };



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

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-1">Blog Dashboard</h2>
            <p className="text-muted-foreground">Create and manage blog posts</p>
          </div>
          <Button size="lg" onClick={() => { setCreateForm(emptyForm); setIsCreating(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
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
                  <p className="text-2xl font-bold text-foreground">{publishedPosts.length}</p>
                  <p className="text-sm text-muted-foreground">Published</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                  <Pencil className="w-5 h-5 text-amber-500" />
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
                <div className="w-10 h-10 bg-premium/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-premium" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{posts.length}</p>
                  <p className="text-sm text-muted-foreground">Total Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <CardTitle>Blog Posts ({posts.length})</CardTitle>
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
                  <TabsList>
                    <TabsTrigger value="all">All ({posts.length})</TabsTrigger>
                    <TabsTrigger value="published">Published ({publishedPosts.length})</TabsTrigger>
                    <TabsTrigger value="drafts">Drafts ({draftPosts.length})</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
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
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "Try adjusting your search" : "Create your first blog post to get started"}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setIsCreating(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Post
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors gap-4"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <BookOpen className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{post.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{post.summary}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {post.isDraft ? (
                            <Badge variant="outline" className="text-xs border-amber-400 text-amber-600 bg-amber-50">Draft</Badge>
                          ) : (
                            <Badge variant="default" className="text-xs bg-green-600 text-white">Published</Badge>
                          )}
                          {post.category && <Badge variant="secondary" className="text-xs">{post.category}</Badge>}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(post.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {post.isDraft && (
                        <Button
                          variant="outline"
                          size="sm"
                          title="Publish"
                          className="text-green-700 border-green-300 hover:bg-green-50 hidden sm:flex"
                          disabled={saving}
                          onClick={() => handlePublish(post)}
                        >
                          <Send className="w-3 h-3 mr-1" />
                          Publish
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" title="Preview" onClick={() => setPreviewPost(post)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Edit" onClick={() => openEdit(post)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeletingId(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Create Modal */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border flex-shrink-0">
            <DialogTitle>Create New Blog Post</DialogTitle>
            <DialogDescription>Fill in the fields below — posts are published immediately to the live blog.</DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
            <div>
              <Label>Title *</Label>
              <Input
                placeholder="Post title..."
                value={createForm.title}
                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={createForm.category} onValueChange={(v) => setCreateForm({ ...createForm, category: v })}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Summary * <span className="text-muted-foreground text-xs font-normal">(shown on blog listing cards)</span></Label>
              <Textarea
                placeholder="A short summary shown on the blog index page..."
                value={createForm.summary}
                onChange={(e) => setCreateForm({ ...createForm, summary: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label>Full Article * <span className="text-muted-foreground text-xs font-normal">(shown when reader clicks Read More)</span></Label>
              <Textarea
                placeholder="Write the full article content here..."
                value={createForm.full_blog}
                onChange={(e) => setCreateForm({ ...createForm, full_blog: e.target.value })}
                rows={10}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-border flex-shrink-0">
            <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
            <Button
              variant="outline"
              onClick={() => handleCreate(true)}
              disabled={saving || !createForm.title || !createForm.summary || !createForm.full_blog}
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Pencil className="w-4 h-4 mr-2" />}
              Save as Draft
            </Button>
            <Button
              onClick={() => handleCreate(false)}
              disabled={saving || !createForm.title || !createForm.summary || !createForm.full_blog}
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              Publish
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border flex-shrink-0">
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>Changes are saved directly to the database.</DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
            <div>
              <Label>Title *</Label>
              <Input
                placeholder="Post title..."
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={editForm.category} onValueChange={(v) => setEditForm({ ...editForm, category: v })}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Summary *</Label>
              <Textarea
                placeholder="Summary..."
                value={editForm.summary}
                onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label>Full Article *</Label>
              <Textarea
                placeholder="Full article content..."
                value={editForm.full_blog}
                onChange={(e) => setEditForm({ ...editForm, full_blog: e.target.value })}
                rows={10}
              />
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-secondary/30">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Status</p>
                <p className="text-xs text-muted-foreground">{editForm.isDraft ? "Draft — not visible on the public blog" : "Published — visible to all visitors"}</p>
              </div>
              <Button
                type="button"
                size="sm"
                variant={editForm.isDraft ? "outline" : "default"}
                className={editForm.isDraft ? "border-amber-400 text-amber-600 hover:bg-amber-50" : "bg-green-600 hover:bg-green-700 text-white"}
                onClick={() => setEditForm({ ...editForm, isDraft: !editForm.isDraft })}
              >
                {editForm.isDraft ? "Draft" : "Published"}
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-border flex-shrink-0">
            <Button variant="outline" onClick={() => setEditingPost(null)}>Cancel</Button>
            <Button
              onClick={handleUpdate}
              disabled={saving || !editForm.title || !editForm.summary || !editForm.full_blog}
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Pencil className="w-4 h-4 mr-2" />}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={!!previewPost} onOpenChange={(open) => !open && setPreviewPost(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border flex-shrink-0">
            {previewPost?.category && <Badge variant="secondary" className="w-fit mb-2">{previewPost.category}</Badge>}
            <DialogTitle className="text-xl text-balance leading-snug">{previewPost?.title}</DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">{formatDate(previewPost?.created_at ?? "")}</p>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-6 py-5">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">{previewPost?.full_blog}</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The post will be permanently removed from the database and will no longer appear on the public blog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={saving}
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
