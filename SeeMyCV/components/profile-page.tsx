"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/lib/use-user";
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
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  MapPin,
  Mail,
  Link as LinkIcon,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Clock,
  MessageCircle,
  Settings,
  Copy,
  Check,
} from "lucide-react";

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  grade?: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [privacyStatus, setPrivacyStatus] = useState("open");
  const [profileLinkCopied, setProfileLinkCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { userData, loading, refetch } = useUser();

  // Skills state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillDescription, setNewSkillDescription] = useState('');
  const [newSkillIsSoft, setNewSkillIsSoft] = useState(false);
  const [skillSaving, setSkillSaving] = useState(false);
  const [skillError, setSkillError] = useState<string | null>(null);
  const [deletingSkillId, setDeletingSkillId] = useState<string | null>(null);

  const handleAddSkill = async () => {
    if (!newSkillName.trim()) return;
    setSkillSaving(true);
    setSkillError(null);
    try {
      const res = await fetch('/api/cv/add-skill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSkillName.trim(),
          description: newSkillDescription.trim() || null,
          isSoftSkill: newSkillIsSoft,
          level: null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setSkillError(data.error ?? 'Failed to add skill');
        return;
      }
      setNewSkillName('');
      setNewSkillDescription('');
      setNewSkillIsSoft(false);
      refetch();
    } catch {
      setSkillError('Network error. Please try again.');
    } finally {
      setSkillSaving(false);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    setDeletingSkillId(skillId);
    try {
      await fetch('/api/cv/delete-skill', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId }),
      });
      refetch();
    } catch {
      // silently ignore
    } finally {
      setDeletingSkillId(null);
    }
  };

  // Use real user data from hook
  const profile = {
    name: `${userData?.profile.firstName} ${userData?.profile.lastName}`,
    location: userData?.profile.location || "Not specified",
    email: userData?.profile.email || "",
    website: userData?.profile.personalWebsite || "",
    bio: userData?.profile.aboutMe || "No bio yet",
    skills: userData?.cv.skills || [],
  };

  const experiences = userData?.cv.experiences?.map((exp: any) => ({
    id: exp.experience_id?.toString(),
    title: exp.title,
    company: exp.summary,
    location: exp.location,
    startDate: exp.start_date,
    endDate: exp.end_date,
    current: !exp.end_date,
    description: exp.description,
  })) || [];

  const education = userData?.cv.education?.map((edu: any) => ({
    id: edu.education_id?.toString(),
    degree: edu.institute_name,
    institution: edu.institute_name,
    location: edu.location,
    startDate: edu.start_date,
    endDate: edu.end_date,
    grade: edu.achieved,
  })) || [];

  const certifications = userData?.cv.certifications?.map((cert: any) => ({
    id: cert.certification_id?.toString(),
    name: cert.title,
    issuer: cert.institute,
    date: cert.issue_date,
    url: cert.link,
  })) || [];

  const privacyOptions = [
    { value: "open", label: "Open to all messages", icon: Globe },
    { value: "select", label: "Open on select platforms", icon: MessageCircle },
    { value: "unavailable", label: "Temporarily unavailable", icon: Clock },
    { value: "private", label: "Private", icon: Lock },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://cvconnect.com/profile/johndoe");
    setProfileLinkCopied(true);
    setTimeout(() => setProfileLinkCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Profile Summary */}
        <div className="space-y-4">
          {/* Profile Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                {/* Avatar - Using initials instead of photo */}
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-3xl">
                    {profile.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
                <p className="text-muted-foreground">{profile.title}</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {profile.location}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{profile.email}</span>
                </div>
                {profile.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <LinkIcon className="w-4 h-4 text-muted-foreground" />
                    <a href={`https://${profile.website}`} className="text-primary hover:underline">
                      {profile.website}
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <Button className="w-full" onClick={() => setIsEditing(true)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="text-sm font-medium mb-2 block">Message Availability</Label>
              <Select value={privacyStatus} onValueChange={setPrivacyStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {privacyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                Control who can send you messages on the platform
              </p>
            </CardContent>
          </Card>

          {/* Profile CV Link */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Shareable Profile CV</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Share this link to let others view your profile CV
              </p>
              <div className="flex gap-2">
                <Input
                  value="cvconnect.com/profile/johndoe"
                  readOnly
                  className="text-sm bg-secondary"
                />
                <Button variant="outline" size="icon" onClick={handleCopyLink}>
                  {profileLinkCopied ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <EyeOff className="w-4 h-4 mr-1" />
                  Archive
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* About */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5" />
                      About
                    </CardTitle>
                    <Button variant="ghost" size="sm">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">{profile.bio}</p>
                </CardContent>
              </Card>

              {/* Quick Experience */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Recent Experience
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("experience")}>
                      View all
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {experiences.slice(0, 2).map((exp) => (
                    <div key={exp.id} className="flex gap-4">
                      <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                        <Briefcase className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{exp.title}</h4>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                        <p className="text-xs text-muted-foreground">
                          {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Skills Preview */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Top Skills
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("skills")}>
                      View all
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.slice(0, 6).map((skill: any) => (
                      <Badge key={skill.skill_id ?? skill.name} variant="secondary">
                        {skill.name}
                      </Badge>
                    ))}
                    {profile.skills.length > 6 && (
                      <Badge variant="outline">+{profile.skills.length - 6} more</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Work Experience</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Work Experience</DialogTitle>
                      <DialogDescription>
                        Add your work experience to your profile
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label>Job Title</Label>
                        <Input placeholder="e.g. Software Developer" />
                      </div>
                      <div>
                        <Label>Company</Label>
                        <Input placeholder="e.g. TechCorp Ltd" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Start Date</Label>
                          <Input type="month" />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input type="month" />
                        </div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea placeholder="Describe your responsibilities and achievements..." />
                      </div>
                      <Button className="w-full">Save Experience</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {experiences.map((exp) => (
                <Card key={exp.id}>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                        <Briefcase className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{exp.title}</h3>
                            <p className="text-muted-foreground">{exp.company}</p>
                            <p className="text-sm text-muted-foreground">
                              {exp.startDate} - {exp.current ? "Present" : exp.endDate} · {exp.location}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="mt-3 text-foreground">{exp.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="education" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Education</h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </div>

              {education.map((edu) => (
                <Card key={edu.id}>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                        <GraduationCap className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                            <p className="text-muted-foreground">{edu.institution}</p>
                            <p className="text-sm text-muted-foreground">
                              {edu.startDate} - {edu.endDate} · {edu.location}
                            </p>
                            {edu.grade && (
                              <Badge variant="secondary" className="mt-2">
                                {edu.grade}
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Certifications */}
              <div className="flex items-center justify-between mt-8 mb-4">
                <h2 className="text-xl font-semibold text-foreground">Certifications</h2>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Certification
                </Button>
              </div>

              {certifications.map((cert) => (
                <Card key={cert.id}>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-premium/10 rounded-lg flex items-center justify-center shrink-0">
                        <Award className="w-6 h-6 text-premium" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{cert.name}</h3>
                            <p className="text-muted-foreground">{cert.issuer}</p>
                            <p className="text-sm text-muted-foreground">Issued {cert.date}</p>
                            {cert.url && (
                              <a
                                href={cert.url}
                                className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-1"
                              >
                                View credential
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Skills & Expertise</h2>
              </div>

              {/* Current skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Your Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.skills.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No skills added yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill: any) => (
                        <Badge
                          key={skill.skill_id ?? skill.name}
                          variant="secondary"
                          className="px-3 py-1.5 text-sm flex items-center gap-2"
                        >
                          {skill.is_soft_skill && (
                            <span className="text-xs text-muted-foreground mr-1">[soft]</span>
                          )}
                          {skill.name}
                          <button
                            className="hover:text-destructive transition-colors"
                            disabled={deletingSkillId === skill.skill_id}
                            onClick={() => handleDeleteSkill(skill.skill_id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Add new skill */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Add New Skill</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label>Skill Name</Label>
                      <Input
                        placeholder="e.g. React, Teamwork, SQL..."
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Description (optional)</Label>
                      <Input
                        placeholder="Brief description..."
                        value={newSkillDescription}
                        onChange={(e) => setNewSkillDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isSoftSkill"
                      checked={newSkillIsSoft}
                      onChange={(e) => setNewSkillIsSoft(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="isSoftSkill" className="cursor-pointer">Soft skill</Label>
                  </div>
                  {skillError && (
                    <p className="text-sm text-destructive">{skillError}</p>
                  )}
                  <Button onClick={handleAddSkill} disabled={skillSaving || !newSkillName.trim()}>
                    <Plus className="w-4 h-4 mr-2" />
                    {skillSaving ? 'Adding...' : 'Add Skill'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
