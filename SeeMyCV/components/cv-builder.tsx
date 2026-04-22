"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Download,
  Eye,
  Trash2,
  Pencil,
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
  TrendingUp,
  User,
  Briefcase,
  FolderOpen,
  BookOpen,
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

const cvTemplates = [
  {
    id: "entry-level",
    name: "Entry Level / Generic",
    description: "Perfect for graduates and those new to the workforce",
    icon: FileCheck,
    features: ["Clean layout", "Skills emphasis", "Education focused"],
  },
  {
    id: "customer-service",
    name: "Customer Service",
    description: "Skills-based CV highlighting soft skills and achievements",
    icon: Headphones,
    features: ["Skills-based format", "Achievement metrics", "Communication focus"],
  },
  {
    id: "tech",
    name: "Tech / IT",
    description: "Technical CV with project showcase and tech stack",
    icon: Code,
    features: ["Technical skills section", "Project showcase", "GitHub integration"],
  },
  {
    id: "teaching",
    name: "Teaching / Education",
    description: "Educator-focused CV with certifications and methodologies",
    icon: GraduationCap,
    features: ["Qualifications display", "Teaching philosophy", "Student outcomes"],
  },
  {
    id: "entry-level-software-engineer",
    name: "Entry Level Software Engineer",
    description: "Premium format designed for new software engineers entering the field",
    icon: Code,
    features: ["Technical projects focus", "Programming skills showcase", "GitHub portfolio"],
    isPremium: true,
  },
  {
    id: "software-engineer-apprenticeship",
    name: "Software Engineer Apprenticeship",
    description: "Premium format tailored for apprenticeship programs and early-career roles",
    icon: GraduationCap,
    features: ["Learning highlights", "Apprenticeship structure", "Mentorship display"],
    isPremium: true,
  },
];

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

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showCVForm, setShowCVForm] = useState(false);
  const [showAIFeedback, setShowAIFeedback] = useState(false);
  const [showCVPreview, setShowCVPreview] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [activeSection, setActiveSection] = useState("contact");
  const [formData, setFormData] = useState<CVFormData>(initialFormData);

  const handleUseTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    setFormData(initialFormData);
    setActiveSection("contact");
    setShowTemplateSelector(false);
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
      name: `${formData.firstName} ${formData.surname} - ${selectedTemplate}`,
      template: selectedTemplate || "entry-level",
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

  const getTemplateIcon = (templateId: string) => {
    const template = cvTemplates.find((t) => t.id === templateId);
    return template?.icon || FileText;
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My CVs</h1>
          <p className="text-muted-foreground">Create and manage your professional CVs</p>
        </div>
        <Button onClick={() => setShowTemplateSelector(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create New CV
        </Button>
      </div>

      {/* Saved CVs Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedCVs.map((cv) => {
          const TemplateIcon = getTemplateIcon(cv.template);
          return (
            <Card key={cv.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TemplateIcon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{cv.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-center gap-2 mb-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCV(cv.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* AI Feedback Button */}
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => setShowAIFeedback(true)}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get AI Feedback
                </Button>
              </CardContent>
            </Card>
          );
        })}

        {/* Create New CV Card */}
        <Card
          className="border-dashed hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors"
          onClick={() => setShowTemplateSelector(true)}
        >
          <CardContent className="h-full flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <p className="font-medium text-foreground">Create New CV</p>
            <p className="text-sm text-muted-foreground">Choose a template to get started</p>
          </CardContent>
        </Card>
      </div>

      {/* Template Selector Dialog */}
      <Dialog open={showTemplateSelector} onOpenChange={setShowTemplateSelector}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Choose a CV Template</DialogTitle>
            <DialogDescription>
              Select a template that best fits your industry and experience level
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            <div className="grid md:grid-cols-2 gap-4 py-4">
              {cvTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all ${
                    template.isPremium
                      ? "border-orange-500 hover:border-orange-600 hover:shadow-md hover:shadow-orange-200 bg-gradient-to-br from-orange-50 to-transparent"
                      : "hover:border-primary hover:shadow-md"
                  }`}
                  onClick={() => handleUseTemplate(template.id)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          template.isPremium
                            ? "bg-orange-100"
                            : "bg-primary/10"
                        }`}
                      >
                        <template.icon
                          className={`w-6 h-6 ${
                            template.isPremium
                              ? "text-orange-600"
                              : "text-primary"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          {template.isPremium && (
                            <Badge className="bg-orange-600 hover:bg-orange-700 text-white text-xs">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-xs">{template.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {template.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check
                            className={`w-4 h-4 ${
                              template.isPremium
                                ? "text-orange-600"
                                : "text-accent"
                            }`}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

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
      <Dialog open={showAIFeedback} onOpenChange={setShowAIFeedback}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              AI-Powered CV Analysis
            </DialogTitle>
            <DialogDescription>
              Get personalized recommendations to improve your CV
            </DialogDescription>
          </DialogHeader>

          {!analysisComplete ? (
            <div className="py-12">
              {!isAnalyzing ? (
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Analyze</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Our AI will review your CV and provide detailed feedback on content, formatting,
                    and industry-specific recommendations.
                  </p>
                  <Button onClick={startAIAnalysis}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start Analysis
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Analyzing Your CV...</h3>
                  <p className="text-muted-foreground">This may take a few seconds</p>
                </div>
              )}
            </div>
          ) : (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 py-4">
                {/* Overall Score */}
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-4xl font-bold text-primary mb-1">78/100</div>
                  <p className="text-sm text-muted-foreground">Overall CV Score</p>
                </div>

                {/* Strengths */}
                <div>
                  <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex gap-2 text-sm">
                      <span className="text-accent">+</span>
                      <span className="text-foreground">
                        Strong technical skills section with relevant technologies
                      </span>
                    </li>
                    <li className="flex gap-2 text-sm">
                      <span className="text-accent">+</span>
                      <span className="text-foreground">
                        Good use of quantifiable achievements (e.g., "reduced by 50%")
                      </span>
                    </li>
                    <li className="flex gap-2 text-sm">
                      <span className="text-accent">+</span>
                      <span className="text-foreground">
                        Clear education section with expected grade
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div>
                  <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-premium" />
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex gap-2 text-sm">
                      <span className="text-premium">!</span>
                      <span className="text-foreground">
                        Consider adding a professional summary at the top
                      </span>
                    </li>
                    <li className="flex gap-2 text-sm">
                      <span className="text-premium">!</span>
                      <span className="text-foreground">
                        Add more specific metrics to your project descriptions
                      </span>
                    </li>
                    <li className="flex gap-2 text-sm">
                      <span className="text-premium">!</span>
                      <span className="text-foreground">
                        Include relevant certifications or courses
                      </span>
                    </li>
                  </ul>
                </div>

                {/* ATS Score */}
                <div>
                  <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-primary" />
                    ATS Compatibility
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-accent w-[85%]" />
                    </div>
                    <span className="text-sm font-medium text-foreground">85%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Your CV is well-optimized for Applicant Tracking Systems
                  </p>
                </div>

                {/* Industry Tips */}
                <div>
                  <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Industry-Specific Tips
                  </h4>
                  <div className="p-3 bg-muted rounded-lg text-sm text-foreground">
                    For software engineering roles, consider highlighting:
                    <ul className="list-disc ml-4 mt-2 space-y-1">
                      <li>Open source contributions</li>
                      <li>System design experience</li>
                      <li>CI/CD and DevOps exposure</li>
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}

          <DialogFooter>
            {analysisComplete && (
              <Button variant="outline" className="bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download Full Report
              </Button>
            )}
            <Button
              onClick={() => {
                setShowAIFeedback(false);
                setAnalysisComplete(false);
                setIsAnalyzing(false);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
