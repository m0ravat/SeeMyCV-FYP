"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FileText,
  Plus,
  Trash2,
  Sparkles,
  Check,
  FileCheck,
  Code,
  Headphones,
  GraduationCap,
  X,
  Loader2,
  Bot,
  CheckCircle2,
  Lightbulb,
  Target,
  User,
  Briefcase,
  FolderOpen,
  BookOpen,
  Lock,
} from "lucide-react";
import { UserCVProfile } from "./user-cv-profile";

interface SavedCV {
  id: string;
  name: string;
  template: string;
  lastModified: string;
  status: "draft" | "published";
  openForFeedback: boolean;
  upvotes: number;
  comments: number;
}

interface CVBuilderProps {
  isPremium?: boolean;
  onUpgrade?: () => void;
}

interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  bullets: string[];
}

interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  technologies: string;
  url: string;
  bullets: string[];
}

interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  grade: string;
  expected: boolean;
  description: string;
}

interface SkillCategory {
  id: string;
  name: string;
  skills: string;
}

interface CVFormData {
  firstName: string;
  surname: string;
  city: string;
  county: string;
  postcode: string;
  phone: string;
  email: string;
  website: string;
  github: string;
  linkedin: string;
  summary: string;
  skillCategories: SkillCategory[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  education: EducationEntry[];
}

interface CvFormat {
  id: string;
  title: string;
  desc: string;
  job_desc: string;
  sections: string[];
  ai_prompt: string;
  isPremium: boolean;
}

// Derive an icon from the template title/sections
function getTemplateIcon(format: CvFormat) {
  const t = format.title.toLowerCase();
  if (t.includes("tech") || t.includes("software") || t.includes("it")) return Code;
  if (t.includes("teach") || t.includes("education") || t.includes("apprentice")) return GraduationCap;
  if (t.includes("customer") || t.includes("service")) return Headphones;
  return FileCheck;
}

const formSections = [
  { id: "contact", label: "Contact", icon: User },
  { id: "summary", label: "Summary", icon: FileText },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "skills", label: "Skills", icon: Code },
  { id: "education", label: "Education", icon: BookOpen },
];

const initialFormData: CVFormData = {
  firstName: "",
  surname: "",
  city: "",
  county: "",
  postcode: "",
  phone: "",
  email: "",
  website: "",
  github: "",
  linkedin: "",
  summary: "",
  skillCategories: [{ id: "1", name: "Technical Skills", skills: "" }],
  experience: [],
  projects: [],
  education: [],
};

export function CVBuilder({ isPremium = false, onUpgrade }: CVBuilderProps) {
  const [savedCVs, setSavedCVs] = useState<SavedCV[]>([
    {
      id: "1",
      name: "Software Developer CV",
      template: "tech",
      lastModified: "2 days ago",
      status: "published",
      openForFeedback: true,
      upvotes: 45,
      comments: 12,
    },
    {
      id: "2",
      name: "General Application CV",
      template: "entry-level",
      lastModified: "1 week ago",
      status: "draft",
      openForFeedback: false,
      upvotes: 0,
      comments: 0,
    },
  ]);

  const [cvFormats, setCvFormats] = useState<CvFormat[]>([]);
  const [formatsLoading, setFormatsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showCVForm, setShowCVForm] = useState(false);
  const [showAIFeedback, setShowAIFeedback] = useState(false);
  const [showCVPreview, setShowCVPreview] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [activeSection, setActiveSection] = useState("contact");
  const [formData, setFormData] = useState<CVFormData>(initialFormData);

  useEffect(() => {
    fetch("/api/cvformats")
      .then((r) => r.json())
      .then((data) => setCvFormats(data.templates ?? []))
      .catch(() => setCvFormats([]))
      .finally(() => setFormatsLoading(false));
  }, []);

  const handleUseTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    setFormData(initialFormData);
    setActiveSection("contact");
    setShowCVForm(true);
  };

  const handleDeleteCV = (id: string) => {
    setSavedCVs(savedCVs.filter((cv) => cv.id !== id));
  };

  // Form handlers
  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        {
          id: Date.now().toString(),
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
          bullets: [""],
        },
      ],
    });
  };

  const removeExperience = (id: string) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((exp) => exp.id !== id),
    });
  };

  const updateExperience = (id: string, field: keyof ExperienceEntry, value: string | boolean | string[]) => {
    setFormData({
      ...formData,
      experience: formData.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const addExperienceBullet = (expId: string) => {
    setFormData({
      ...formData,
      experience: formData.experience.map((exp) =>
        exp.id === expId ? { ...exp, bullets: [...exp.bullets, ""] } : exp
      ),
    });
  };

  const removeExperienceBullet = (expId: string, bulletIndex: number) => {
    setFormData({
      ...formData,
      experience: formData.experience.map((exp) =>
        exp.id === expId
          ? { ...exp, bullets: exp.bullets.filter((_, idx) => idx !== bulletIndex) }
          : exp
      ),
    });
  };

  const updateExperienceBullet = (expId: string, bulletIndex: number, value: string) => {
    setFormData({
      ...formData,
      experience: formData.experience.map((exp) =>
        exp.id === expId
          ? { ...exp, bullets: exp.bullets.map((b, idx) => (idx === bulletIndex ? value : b)) }
          : exp
      ),
    });
  };

  // Project handlers
  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...formData.projects,
        {
          id: Date.now().toString(),
          name: "",
          description: "",
          technologies: "",
          url: "",
          bullets: [""],
        },
      ],
    });
  };

  const removeProject = (id: string) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((proj) => proj.id !== id),
    });
  };

  const updateProject = (id: string, field: keyof ProjectEntry, value: string | string[]) => {
    setFormData({
      ...formData,
      projects: formData.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    });
  };

  const addProjectBullet = (projId: string) => {
    setFormData({
      ...formData,
      projects: formData.projects.map((proj) =>
        proj.id === projId ? { ...proj, bullets: [...proj.bullets, ""] } : proj
      ),
    });
  };

  const removeProjectBullet = (projId: string, bulletIndex: number) => {
    setFormData({
      ...formData,
      projects: formData.projects.map((proj) =>
        proj.id === projId
          ? { ...proj, bullets: proj.bullets.filter((_, idx) => idx !== bulletIndex) }
          : proj
      ),
    });
  };

  const updateProjectBullet = (projId: string, bulletIndex: number, value: string) => {
    setFormData({
      ...formData,
      projects: formData.projects.map((proj) =>
        proj.id === projId
          ? { ...proj, bullets: proj.bullets.map((b, idx) => (idx === bulletIndex ? value : b)) }
          : proj
      ),
    });
  };

  // Education handlers
  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          id: Date.now().toString(),
          degree: "",
          institution: "",
          location: "",
          startDate: "",
          endDate: "",
          grade: "",
          expected: false,
          description: "",
        },
      ],
    });
  };

  const removeEducation = (id: string) => {
    setFormData({
      ...formData,
      education: formData.education.filter((edu) => edu.id !== id),
    });
  };

  const updateEducation = (id: string, field: keyof EducationEntry, value: string | boolean) => {
    setFormData({
      ...formData,
      education: formData.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  // Skill handlers
  const addSkillCategory = () => {
    setFormData({
      ...formData,
      skillCategories: [
        ...formData.skillCategories,
        { id: Date.now().toString(), name: "", skills: "" },
      ],
    });
  };

  const removeSkillCategory = (id: string) => {
    setFormData({
      ...formData,
      skillCategories: formData.skillCategories.filter((cat) => cat.id !== id),
    });
  };

  const updateSkillCategory = (id: string, field: keyof SkillCategory, value: string) => {
    setFormData({
      ...formData,
      skillCategories: formData.skillCategories.map((cat) =>
        cat.id === id ? { ...cat, [field]: value } : cat
      ),
    });
  };

  const handleSaveCV = () => {
    const newCV: SavedCV = {
      id: Date.now().toString(),
      name: `${formData.firstName} ${formData.surname} - ${cvFormats.find((f) => String(f.id) === selectedTemplate)?.title ?? selectedTemplate}`,
      template: selectedTemplate || "",
      lastModified: "Just now",
      status: "draft",
      openForFeedback: false,
      upvotes: 0,
      comments: 0,
    };
    setSavedCVs([newCV, ...savedCVs]);
    setShowCVForm(false);
    setSelectedTemplate(null);
    setFormData(initialFormData);
  };

  const startAIAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const getTemplateIconById = (templateId: string) => {
    const format = cvFormats.find((t) => String(t.id) === templateId);
    return format ? getTemplateIcon(format) : FileText;
  };

  const renderFormSection = () => {
    switch (activeSection) {
      case "contact":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                How do you want recruiters to contact you?
              </h2>
              <p className="text-muted-foreground">
                Include your full name and at least email or phone number
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Olivia"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surname">Surname</Label>
                <Input
                  id="surname"
                  value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                  placeholder="Taylor"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="London"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="county">County/Region</Label>
                <Input
                  id="county"
                  value={formData.county}
                  onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                  placeholder="Greater London"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postcode">Postcode</Label>
                <Input
                  id="postcode"
                  value={formData.postcode}
                  onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                  placeholder="SW1A 1AA"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="07123 456789"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                  {formData.email && formData.email.includes("@") && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website (optional)</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://yourwebsite.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub (optional)</Label>
                <Input
                  id="github"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  placeholder="https://github.com/username"
                />
              </div>
            </div>
          </div>
        );

      case "summary":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Write a brief professional summary
              </h2>
              <p className="text-muted-foreground">
                Summarise your experience and what makes you a great candidate
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Professional Summary</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="A dedicated software engineer with 3+ years of experience in full-stack development..."
                className="min-h-[200px]"
              />
              <p className="text-xs text-muted-foreground">
                Tip: Keep it between 2-4 sentences highlighting your key strengths
              </p>
            </div>
          </div>
        );

      case "experience":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Tell us about your work experience
              </h2>
              <p className="text-muted-foreground">
                Add your most relevant positions, starting with the most recent
              </p>
            </div>

            {formData.experience.map((exp, index) => (
              <Card key={exp.id} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => removeExperience(exp.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Position {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input
                        value={exp.title}
                        onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                        placeholder="Software Developer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                        placeholder="Acme Inc."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                      placeholder="London, UK"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                        placeholder="January 2023"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                        placeholder="Present"
                        disabled={exp.current}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`current-${exp.id}`}
                      checked={exp.current}
                      onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                      className="rounded border-input"
                    />
                    <Label htmlFor={`current-${exp.id}`} className="text-sm font-normal">
                      I currently work here
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Brief Description</Label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                      placeholder="A brief summary of your role and responsibilities..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Key Achievements (bullet points)</Label>
                    {exp.bullets.map((bullet, bulletIdx) => (
                      <div key={bulletIdx} className="flex gap-2">
                        <Input
                          value={bullet}
                          onChange={(e) => updateExperienceBullet(exp.id, bulletIdx, e.target.value)}
                          placeholder="Achieved X by doing Y, resulting in Z..."
                        />
                        {exp.bullets.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeExperienceBullet(exp.id, bulletIdx)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addExperienceBullet(exp.id)}
                      className="bg-transparent"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Bullet Point
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" onClick={addExperience} className="w-full bg-transparent">
              <Plus className="w-4 h-4 mr-2" /> Add Experience
            </Button>
          </div>
        );

      case "projects":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Showcase your projects
              </h2>
              <p className="text-muted-foreground">
                Add personal or professional projects that demonstrate your skills
              </p>
            </div>

            {formData.projects.map((proj, index) => (
              <Card key={proj.id} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => removeProject(proj.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Project {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Project Name</Label>
                      <Input
                        value={proj.name}
                        onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                        placeholder="My Awesome Project"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>URL (optional)</Label>
                      <Input
                        value={proj.url}
                        onChange={(e) => updateProject(proj.id, "url", e.target.value)}
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Technologies Used</Label>
                    <Input
                      value={proj.technologies}
                      onChange={(e) => updateProject(proj.id, "technologies", e.target.value)}
                      placeholder="React, Node.js, PostgreSQL"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Brief Description</Label>
                    <Textarea
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                      placeholder="A brief summary of what the project does..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Key Features (bullet points)</Label>
                    {proj.bullets.map((bullet, bulletIdx) => (
                      <div key={bulletIdx} className="flex gap-2">
                        <Input
                          value={bullet}
                          onChange={(e) => updateProjectBullet(proj.id, bulletIdx, e.target.value)}
                          placeholder="Built feature X using Y technology..."
                        />
                        {proj.bullets.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeProjectBullet(proj.id, bulletIdx)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addProjectBullet(proj.id)}
                      className="bg-transparent"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Bullet Point
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" onClick={addProject} className="w-full bg-transparent">
              <Plus className="w-4 h-4 mr-2" /> Add Project
            </Button>
          </div>
        );

      case "skills":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                What skills do you have?
              </h2>
              <p className="text-muted-foreground">
                Group your skills by category for better organisation
              </p>
            </div>

            {formData.skillCategories.map((cat, index) => (
              <Card key={cat.id} className="relative">
                {formData.skillCategories.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeSkillCategory(cat.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Category {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Category Name</Label>
                    <Input
                      value={cat.name}
                      onChange={(e) => updateSkillCategory(cat.id, "name", e.target.value)}
                      placeholder="Technical Skills, Soft Skills, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Skills (comma separated)</Label>
                    <Textarea
                      value={cat.skills}
                      onChange={(e) => updateSkillCategory(cat.id, "skills", e.target.value)}
                      placeholder="JavaScript, React, Node.js, Python..."
                      className="min-h-[80px]"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" onClick={addSkillCategory} className="w-full bg-transparent">
              <Plus className="w-4 h-4 mr-2" /> Add Skill Category
            </Button>
          </div>
        );

      case "education":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Tell us about your education
              </h2>
              <p className="text-muted-foreground">
                Add your qualifications, starting with the most recent
              </p>
            </div>

            {formData.education.map((edu, index) => (
              <Card key={edu.id} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => removeEducation(edu.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Education {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Degree / Qualification</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                      placeholder="BSc Computer Science"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                        placeholder="University of London"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={edu.location}
                        onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                        placeholder="London, UK"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                        placeholder="September 2020"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                        placeholder="June 2024"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Grade</Label>
                      <Input
                        value={edu.grade}
                        onChange={(e) => updateEducation(edu.id, "grade", e.target.value)}
                        placeholder="First Class Honours"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id={`expected-${edu.id}`}
                        checked={edu.expected}
                        onChange={(e) => updateEducation(edu.id, "expected", e.target.checked)}
                        className="rounded border-input"
                      />
                      <Label htmlFor={`expected-${edu.id}`} className="text-sm font-normal">
                        Expected grade
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description (optional)</Label>
                    <Textarea
                      value={edu.description}
                      onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                      placeholder="Key modules, achievements, or activities..."
                      className="min-h-[80px]"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" onClick={addEducation} className="w-full bg-transparent">
              <Plus className="w-4 h-4 mr-2" /> Add Education
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Choose a CV Template</h1>
        <p className="text-muted-foreground">Select a template that best fits your industry and experience level</p>
      </div>

      {/* Template Grid - Main View */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {formatsLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-muted" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2 space-y-2">
                <div className="h-3 bg-muted rounded w-2/3" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-8 bg-muted rounded mt-4" />
              </CardContent>
            </Card>
          ))
        ) : (
        cvFormats.map((template) => {
          const Icon = getTemplateIcon(template);
          return (
          <Card
            key={template.id}
            className={`transition-all ${
              template.isPremium
                ? "border-orange-500 hover:border-orange-600 hover:shadow-md hover:shadow-orange-200 bg-gradient-to-br from-orange-50 to-transparent"
                : "hover:border-primary hover:shadow-md"
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    template.isPremium
                      ? "bg-orange-100"
                      : "bg-primary/10"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      template.isPremium
                        ? "text-orange-600"
                        : "text-primary"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{template.title}</CardTitle>
                    {template.isPremium && (
                      <Badge className="bg-orange-600 hover:bg-orange-700 text-white text-xs">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-xs">{template.desc}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <ul className="space-y-1 mb-4">
                {(template.sections ?? []).map((section) => (
                  <li key={section} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check
                      className={`w-4 h-4 ${
                        template.isPremium
                          ? "text-orange-600"
                          : "text-accent"
                      }`}
                    />
                    {section}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                {template.isPremium && !isPremium ? (
                  <Button
                    className="flex-1 bg-orange-100 text-orange-600 hover:bg-orange-100 cursor-not-allowed opacity-70"
                    disabled
                    title="Upgrade to Premium to unlock this template"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Premium Only
                  </Button>
                ) : (
                  <Button
                    className={`flex-1 ${
                      template.isPremium
                        ? "bg-orange-600 hover:bg-orange-700 text-white"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                    onClick={() => handleUseTemplate(String(template.id))}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create
                  </Button>
                )}
                <Button
                  variant="outline"
                  className={`flex-1 ${template.isPremium && !isPremium ? "cursor-not-allowed opacity-50" : ""}`}
                  disabled={template.isPremium && !isPremium}
                  onClick={() => !template.isPremium || isPremium ? setShowAIFeedback(true) : onUpgrade?.()}
                >
                  {template.isPremium && !isPremium ? (
                    <Lock className="w-4 h-4 mr-2" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  AI Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
          );
        })
        )}
      </div>

      {/* CV Form Dialog - Wider without preview */}
      <Dialog open={showCVForm} onOpenChange={setShowCVForm}>
        <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0 overflow-hidden">
          <div className="flex h-full">
            {/* Left Sidebar */}
            <div className="w-16 bg-primary flex flex-col items-center py-4 gap-2 shrink-0">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              {formSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    activeSection === section.id
                      ? "bg-primary-foreground text-primary"
                      : "text-primary-foreground/70 hover:bg-primary-foreground/20"
                  }`}
                  title={section.label}
                >
                  <section.icon className="w-5 h-5" />
                </button>
              ))}
            </div>

            {/* Main Form Area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Form Section */}
              <div className="flex-1 p-8 overflow-y-auto">
                <div className="flex items-center gap-2 mb-6">
                  <Badge variant="secondary" className="text-xs">
                    {formSections.find((s) => s.id === activeSection)?.label}
                  </Badge>
                </div>
                <div className="max-w-2xl">
                  {renderFormSection()}
                </div>
              </div>

              {/* Footer Navigation */}
              <div className="border-t border-border p-4 flex items-center justify-between bg-background shrink-0">
                <Button
                  variant="outline"
                  onClick={() => {
                    const currentIndex = formSections.findIndex((s) => s.id === activeSection);
                    if (currentIndex > 0) {
                      setActiveSection(formSections[currentIndex - 1].id);
                    } else {
                      setShowCVForm(false);
                    }
                  }}
                  className="bg-transparent px-8"
                >
                  Back
                </Button>
                <Button
                  onClick={() => {
                    const currentIndex = formSections.findIndex((s) => s.id === activeSection);
                    if (currentIndex < formSections.length - 1) {
                      setActiveSection(formSections[currentIndex + 1].id);
                    } else {
                      handleSaveCV();
                    }
                  }}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 px-8"
                >
                  {activeSection === "education" ? "Save CV" : "Continue"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* CV Preview Dialog - Full width and scrollable */}
      <Dialog open={showCVPreview} onOpenChange={setShowCVPreview}>
        <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 flex flex-col">
          <DialogHeader className="p-4 border-b shrink-0">
            <DialogTitle>CV Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <UserCVProfile isOwnProfile={true} onEdit={() => setShowCVPreview(false)} />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Feedback Dialog */}
      <Dialog
        open={showAIFeedback}
        onOpenChange={(open) => {
          setShowAIFeedback(open);
          if (!open) { setAnalysisComplete(false); setIsAnalyzing(false); setAiFeedbackResult(null); setAiFeedbackError(null); setJobDescription(""); }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              AI-Powered CV Analysis
            </DialogTitle>
            <DialogDescription>
              Get personalised feedback matched against a specific job description
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            {!analysisComplete && !isAnalyzing && (
              <div className="px-6 py-8 space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-sm">1</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="font-semibold text-foreground">Paste the Job Description</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">The AI will compare your profile data against this role and give targeted feedback.</p>
                    </div>
                    <Textarea placeholder="Paste the full job description here..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={10} className="resize-none" />
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-sm">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Profile sections being reviewed</h3>
                    <p className="text-sm text-muted-foreground mt-0.5 mb-3">Based on your selected CV format, the AI pulls these sections from your saved profile:</p>
                    <div className="flex flex-wrap gap-2">
                      {aiFeedbackTemplateSections.length > 0 ? aiFeedbackTemplateSections.map((s) => <Badge key={s} variant="secondary">{s}</Badge>) : <span className="text-sm text-muted-foreground">All available sections</span>}
                    </div>
                  </div>
                </div>
                {aiFeedbackError && <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{aiFeedbackError}</div>}
              </div>
            )}
            {isAnalyzing && (
              <div className="px-6 py-16 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5 animate-pulse">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Analysing Your CV...</h3>
                <p className="text-muted-foreground text-sm">Gemini is comparing your profile against the job description. This takes a few seconds.</p>
              </div>
            )}
            {analysisComplete && aiFeedbackResult && (
              <div className="px-6 py-6 space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-4xl font-bold text-primary mb-1">{aiFeedbackResult.overallScore}<span className="text-lg font-normal">/100</span></div>
                    <p className="text-xs text-muted-foreground">Overall Match Score</p>
                  </div>
                  <div className="text-center p-4 bg-accent/10 rounded-lg">
                    <div className="text-4xl font-bold text-accent mb-1">{aiFeedbackResult.atsScore}<span className="text-lg font-normal">%</span></div>
                    <p className="text-xs text-muted-foreground">ATS Compatibility</p>
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg text-sm text-foreground leading-relaxed">{aiFeedbackResult.matchSummary}</div>
                <div>
                  <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-accent" />Strengths
                  </h4>
                  <ul className="space-y-2">
                    {aiFeedbackResult.strengths.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="text-accent font-bold shrink-0">+</span>
                        <span className="text-foreground">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-premium" />Areas for Improvement
                  </h4>
                  <ul className="space-y-2">
                    {aiFeedbackResult.improvements.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="text-premium font-bold shrink-0">!</span>
                        <span className="text-foreground">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {aiFeedbackResult.missingKeywords?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                      <Target className="w-4 h-4 text-primary" />Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {aiFeedbackResult.missingKeywords.map((kw, i) => (
                        <Badge key={i} variant="outline" className="text-xs border-destructive/40 text-destructive">{kw}</Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">{aiFeedbackResult.atsTip}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-primary" />Industry Tips
                  </h4>
                  <ul className="space-y-2">
                    {aiFeedbackResult.industryTips.map((t, i) => (
                      <li key={i} className="flex gap-2 text-sm text-foreground">
                        <span className="text-primary font-bold shrink-0">&bull;</span>{t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-border flex-shrink-0 flex items-center justify-between gap-3">
            <div>
              {analysisComplete && (
                <Button variant="outline" onClick={() => { setAnalysisComplete(false); setAiFeedbackResult(null); setAiFeedbackError(null); setJobDescription(""); }}>
                  Try Another Job
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAIFeedback(false)}>Close</Button>
              {!analysisComplete && (
                <Button onClick={startAIAnalysis} disabled={isAnalyzing || !jobDescription.trim()}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isAnalyzing ? "Analysing..." : "Analyse CV"}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
