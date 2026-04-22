"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/use-user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  Globe,
  ExternalLink,
  Download,
  Share2,
  Pencil,
  MapPin,
  Calendar,
  Building2,
  GraduationCap,
  Code,
  Briefcase,
  Plus,
  Trash2,
  FolderOpen,
} from "lucide-react";

interface SkillItem {
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  yearsExperience?: number;
  description?: string;
}

interface Skill {
  category: string;
  items: SkillItem[];
}

interface Experience {
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

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  bullets: string[];
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  grade?: string;
  expected?: boolean;
  description?: string;
}

interface CVProfileData {
  name: string;
  location: string;
  phone: string;
  email: string;
  website?: string;
  github?: string;
  linkedin?: string;
  aboutMe?: string;
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
}

interface UserCVProfileProps {
  data?: CVProfileData;
  isOwnProfile?: boolean;
  username?: string;
  onEdit?: () => void;
}

// Helper functions to transform database data to component format
function transformSkills(dbSkills: any[]): Skill[] {
  const grouped: { [key: string]: SkillItem[] } = {};
  
  dbSkills.forEach(skill => {
    const category = skill.is_soft_skill ? 'Soft Skills' : 'Technical Skills';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push({
      name: skill.name,
      level: skill.skill_level || 'intermediate',
      description: skill.description,
    });
  });
  
  return Object.entries(grouped).map(([category, items]) => ({ category, items }));
}

function transformExperiences(dbExperiences: any[]): Experience[] {
  return dbExperiences.map(exp => ({
    id: exp.experience_id?.toString() || '',
    title: exp.title || '',
    company: exp.summary || '',
    location: exp.location || '',
    startDate: exp.start_date || '',
    endDate: exp.end_date || '',
    current: !exp.end_date,
    description: exp.description || '',
    bullets: [],
  }));
}

function transformProjects(dbProjects: any[]): Project[] {
  return dbProjects.map(proj => ({
    id: proj.project_id?.toString() || '',
    name: proj.title || '',
    description: proj.summary || '',
    technologies: proj.skills ? proj.skills.split(',').map((s: string) => s.trim()) : [],
    url: proj.link,
    bullets: [],
  }));
}

function transformEducation(dbEducation: any[]): Education[] {
  return dbEducation.map(edu => ({
    id: edu.education_id?.toString() || '',
    degree: edu.institute_name || '',
    institution: edu.institute_name || '',
    location: edu.location || '',
    startDate: edu.start_date || '',
    endDate: edu.end_date || '',
    grade: edu.achieved,
  }));
}


const levelColors = {
  beginner: { bg: "bg-blue-100", text: "text-blue-700", progress: 25 },
  intermediate: { bg: "bg-yellow-100", text: "text-yellow-700", progress: 50 },
  advanced: { bg: "bg-green-100", text: "text-green-700", progress: 75 },
  expert: { bg: "bg-primary/10", text: "text-primary", progress: 100 },
};

function SkillDetailModal({
  isOpen,
  onClose,
  skill,
  isOwnProfile = false,
  onEdit,
  onDelete,
}: {
  isOpen: boolean;
  onClose: () => void;
  skill: SkillItem | null;
  isOwnProfile?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  if (!skill) return null;

  const levelInfo = levelColors[skill.level];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="flex flex-row items-start justify-between space-y-0 pb-6">
          <DialogTitle className="flex items-center gap-2 text-lg">
            {skill.name}
          </DialogTitle>
          {isOwnProfile && (
            <div className="flex gap-2 ml-6 flex-shrink-0">
              {onEdit && (
                <Button size="sm" variant="outline" onClick={onEdit}>
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
              {onDelete && (
                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={onDelete}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </DialogHeader>
        <div className="space-y-6 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Proficiency Level</span>
            <Badge className={`${levelInfo.bg} ${levelInfo.text} capitalize`}>
              {skill.level}
            </Badge>
          </div>
          <div>
            <Progress value={levelInfo.progress} className="h-2" />
          </div>
          {skill.yearsExperience && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Years of Experience</span>
              <span className="font-medium text-foreground">{skill.yearsExperience} years</span>
            </div>
          )}
          {skill.description && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-foreground leading-relaxed">{skill.description}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ExperienceDetailModal({
  isOpen,
  onClose,
  experience,
  isOwnProfile = false,
  onEdit,
  onDelete,
}: {
  isOpen: boolean;
  onClose: () => void;
  experience: Experience | null;
  isOwnProfile?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  if (!experience) return null;

  const renderTextWithBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex flex-row items-start justify-between space-y-0 pb-6">
          <DialogTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div>{experience.title}</div>
              <div className="text-sm font-normal text-muted-foreground">{experience.company}</div>
            </div>
          </DialogTitle>
          {isOwnProfile && (
            <div className="flex gap-2 ml-6 flex-shrink-0">
              {onEdit && (
                <Button size="sm" variant="outline" onClick={onEdit}>
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
              {onDelete && (
                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={onDelete}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </DialogHeader>
        <div className="space-y-6 py-2">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {experience.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {experience.startDate} - {experience.current ? "Present" : experience.endDate}
            </span>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-foreground">Key Achievements</h4>
            <ul className="space-y-3">
              {experience.bullets.map((bullet, idx) => (
                <li key={idx} className="flex gap-3 text-sm">
                  <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                  <span className="text-foreground leading-relaxed">{renderTextWithBold(bullet)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProjectDetailModal({
  isOpen,
  onClose,
  project,
  isOwnProfile = false,
  onEdit,
  onDelete,
}: {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  isOwnProfile?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  if (!project) return null;

  const renderTextWithBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="flex flex-row items-start justify-between space-y-0 pb-6">
          <DialogTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Code className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div>{project.name}</div>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-normal text-primary hover:underline flex items-center gap-1"
                >
                  View Project <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </DialogTitle>
          {isOwnProfile && (
            <div className="flex gap-2 ml-6 flex-shrink-0">
              {onEdit && (
                <Button size="sm" variant="outline" onClick={onEdit}>
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
              {onDelete && (
                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={onDelete}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </DialogHeader>
        <div className="space-y-6 py-2">
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
          <div>
            <h4 className="font-medium mb-3 text-foreground">Key Features & Achievements</h4>
            <ul className="space-y-3">
              {project.bullets.map((bullet, idx) => (
                <li key={idx} className="flex gap-3 text-sm">
                  <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                  <span className="text-foreground leading-relaxed">{renderTextWithBold(bullet)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EducationDetailModal({
  isOpen,
  onClose,
  education,
  isOwnProfile = false,
  onEdit,
  onDelete,
}: {
  isOpen: boolean;
  onClose: () => void;
  education: Education | null;
  isOwnProfile?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  if (!education) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader className="flex flex-row items-start justify-between space-y-0 pb-6">
          <DialogTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div>{education.degree}</div>
              <div className="text-sm font-normal text-muted-foreground">{education.institution}</div>
            </div>
          </DialogTitle>
          {isOwnProfile && (
            <div className="flex gap-2 ml-6 flex-shrink-0">
              {onEdit && (
                <Button size="sm" variant="outline" onClick={onEdit}>
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
              {onDelete && (
                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={onDelete}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </DialogHeader>
        <div className="space-y-6 py-2">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {education.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {education.startDate} - {education.endDate}
            </span>
          </div>
          {education.grade && (
            <div className="p-4 bg-accent/50 rounded-lg">
              <p className="text-sm font-medium text-foreground">
                {education.expected ? "Expected Grade: " : "Grade: "}
                <span className="text-primary">{education.grade}</span>
              </p>
            </div>
          )}
          {education.description && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-foreground leading-relaxed">{education.description}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function UserCVProfile({ data, isOwnProfile = true, username, onEdit }: UserCVProfileProps) {
  const [copied, setCopied] = useState(false);
  const [publicUserData, setPublicUserData] = useState<any>(null);
  const [publicLoading, setPublicLoading] = useState(!!username);
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(null);
  const [selectedCertification, setSelectedCertification] = useState<any | null>(null);
  const [showAddExperienceDialog, setShowAddExperienceDialog] = useState(false);
  const [showAddEducationDialog, setShowAddEducationDialog] = useState(false);
  const [showAddSkillDialog, setShowAddSkillDialog] = useState(false);
  const [showAddProjectDialog, setShowAddProjectDialog] = useState(false);
  const [showAddCertificationDialog, setShowAddCertificationDialog] = useState(false);
  const [showEditExperienceDialog, setShowEditExperienceDialog] = useState(false);
  const [showEditEducationDialog, setShowEditEducationDialog] = useState(false);
  const [showEditProjectDialog, setShowEditProjectDialog] = useState(false);
  const [showEditCertificationDialog, setShowEditCertificationDialog] = useState(false);
  
  // Fetch public user data if username is provided
  useEffect(() => {
    if (!username) return;
    
    const fetchPublicProfile = async () => {
      try {
        const response = await fetch(`/api/user/${username}`);
        if (!response.ok) throw new Error('Failed to fetch profile');
        const userData = await response.json();
        setPublicUserData(userData);
      } catch (error) {
        console.error('[v0] Error fetching public profile:', error);
      } finally {
        setPublicLoading(false);
      }
    };

    fetchPublicProfile();
  }, [username]);
  
  // Fetch real user data if this is own profile
  const { userData, loading, refetch } = useUser();
  
  // Use real data if available, NEVER fall back to hardcoded data for own profile
  const displayData = (() => {
    // For public profile pages using username
    if (username && publicUserData) {
      const cv = publicUserData.cv;
      const profile = publicUserData.profile;
      
      return {
        name: `${profile.firstName} ${profile.lastName}`,
        location: profile.location || "",
        phone: profile.phone || "",
        email: profile.email || "",
        website: profile.personalWebsite || "",
        github: "",
        linkedin: profile.linkedinUrl || "",
        aboutMe: profile.aboutMe || "",
        skills: cv.skills?.length > 0 ? transformSkills(cv.skills) : [],
        experience: cv.experiences?.length > 0 ? transformExperiences(cv.experiences) : [],
        projects: cv.projects?.length > 0 ? transformProjects(cv.projects) : [],
        education: cv.education?.length > 0 ? transformEducation(cv.education) : [],
      };
    }
    
    if (isOwnProfile && userData) {
      // For own profile, ONLY use database data
      const cv = userData.cv;
      const profile = userData.profile;
      
      return {
        name: `${profile.firstName} ${profile.lastName}`,
        location: profile.location || "",
        phone: profile.phoneNumber || "",
        email: profile.email || "",
        website: profile.personalWebsite || "",
        github: "",
        linkedin: profile.linkedinUrl || "",
        aboutMe: profile.aboutMe || "",
        skills: cv.skills?.length > 0 ? transformSkills(cv.skills) : [],
        experience: cv.experiences?.length > 0 ? transformExperiences(cv.experiences) : [],
        projects: cv.projects?.length > 0 ? transformProjects(cv.projects) : [],
        education: cv.education?.length > 0 ? transformEducation(cv.education) : [],
      };
    }
    
    // For public profiles or when no data available, return empty
    return {
      name: "",
      location: "",
      phone: "",
      email: "",
      website: "",
      github: "",
      linkedin: "",
      aboutMe: "",
      skills: [],
      experience: [],
      projects: [],
      education: [],
    };
  })();
  
  // Get contact visibility preference from userData
  const contactPublic = userData?.profile?.contactPublic !== false;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddSkill = () => {
    setShowAddSkillDialog(true);
  };

  const handleAddExperience = () => {
    setShowAddExperienceDialog(true);
  };

  const handleAddProject = () => {
    setShowAddProjectDialog(true);
  };

  const handleAddCertification = () => {
    setShowAddCertificationDialog(true);
  };

  const handleAddEducation = () => {
    setShowAddEducationDialog(true);
  };

  const handleEditSkill = () => {
    console.log("Edit skill:", selectedSkill?.name);
  };

  const handleDeleteSkill = () => {
    console.log("Delete skill:", selectedSkill?.name);
    setSelectedSkill(null);
  };

  const handleEditExperience = () => {
    setShowEditExperienceDialog(true);
  };

  const handleEditProject = () => {
    setShowEditProjectDialog(true);
  };

  const handleEditEducation = () => {
    setShowEditEducationDialog(true);
  };

  const handleEditCertification = () => {
    setShowEditCertificationDialog(true);
  };

  const handleDeleteExperience = async () => {
    if (!selectedExperience?.id) return;
    try {
      const response = await fetch("/api/cv/delete-experience", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedExperience.id }),
      });
      if (!response.ok) throw new Error("Failed to delete experience");
      setSelectedExperience(null);
      refetch();
    } catch (error) {
      console.error("[v0] Error deleting experience:", error);
      alert("Failed to delete experience");
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject?.id) return;
    try {
      const response = await fetch("/api/cv/delete-project", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedProject.id }),
      });
      if (!response.ok) throw new Error("Failed to delete project");
      setSelectedProject(null);
      refetch();
    } catch (error) {
      console.error("[v0] Error deleting project:", error);
      alert("Failed to delete project");
    }
  };

  const handleDeleteEducation = async () => {
    if (!selectedEducation?.id) return;
    try {
      const response = await fetch("/api/cv/delete-education", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedEducation.id }),
      });
      if (!response.ok) throw new Error("Failed to delete education");
      setSelectedEducation(null);
      refetch();
    } catch (error) {
      console.error("[v0] Error deleting education:", error);
      alert("Failed to delete education");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Add Experience Dialog */}
      <Dialog open={showAddExperienceDialog} onOpenChange={setShowAddExperienceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Experience</DialogTitle>
          </DialogHeader>
          <AddExperienceForm 
            onClose={() => setShowAddExperienceDialog(false)} 
            onSuccess={() => {
              setShowAddExperienceDialog(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Add Education Dialog */}
      <Dialog open={showAddEducationDialog} onOpenChange={setShowAddEducationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Education</DialogTitle>
          </DialogHeader>
          <AddEducationForm 
            onClose={() => setShowAddEducationDialog(false)} 
            onSuccess={() => {
              setShowAddEducationDialog(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Add Skill Dialog */}
      <Dialog open={showAddSkillDialog} onOpenChange={setShowAddSkillDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Skill</DialogTitle>
          </DialogHeader>
          <AddSkillForm 
            onClose={() => setShowAddSkillDialog(false)} 
            onSuccess={() => {
              setShowAddSkillDialog(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Add Project Dialog */}
      <Dialog open={showAddProjectDialog} onOpenChange={setShowAddProjectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Project</DialogTitle>
          </DialogHeader>
          <AddProjectForm 
            onClose={() => setShowAddProjectDialog(false)} 
            onSuccess={() => {
              setShowAddProjectDialog(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Add Certification Dialog */}
      <Dialog open={showAddCertificationDialog} onOpenChange={setShowAddCertificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Certification</DialogTitle>
          </DialogHeader>
          <AddCertificationForm 
            onClose={() => setShowAddCertificationDialog(false)} 
            onSuccess={() => {
              setShowAddCertificationDialog(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Experience Dialog */}
      <Dialog open={showEditExperienceDialog} onOpenChange={setShowEditExperienceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Experience</DialogTitle>
          </DialogHeader>
          {selectedExperience && (
            <EditExperienceForm 
              experience={selectedExperience}
              onClose={() => setShowEditExperienceDialog(false)} 
              onSuccess={() => {
                setShowEditExperienceDialog(false);
                setSelectedExperience(null);
                refetch();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Education Dialog */}
      <Dialog open={showEditEducationDialog} onOpenChange={setShowEditEducationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Education</DialogTitle>
          </DialogHeader>
          {selectedEducation && (
            <EditEducationForm 
              education={selectedEducation}
              onClose={() => setShowEditEducationDialog(false)} 
              onSuccess={() => {
                setShowEditEducationDialog(false);
                setSelectedEducation(null);
                refetch();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={showEditProjectDialog} onOpenChange={setShowEditProjectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <EditProjectForm 
              project={selectedProject}
              onClose={() => setShowEditProjectDialog(false)} 
              onSuccess={() => {
                setShowEditProjectDialog(false);
                setSelectedProject(null);
                refetch();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Certification Dialog */}
      <Dialog open={showEditCertificationDialog} onOpenChange={setShowEditCertificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Certification</DialogTitle>
          </DialogHeader>
          {selectedCertification && (
            <EditCertificationForm 
              certification={selectedCertification}
              onClose={() => setShowEditCertificationDialog(false)} 
              onSuccess={() => {
                setShowEditCertificationDialog(false);
                setSelectedCertification(null);
                refetch();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Detail Modals */}
      <SkillDetailModal
        isOpen={!!selectedSkill}
        onClose={() => setSelectedSkill(null)}
        skill={selectedSkill}
        isOwnProfile={isOwnProfile}
        onEdit={handleEditSkill}
        onDelete={handleDeleteSkill}
      />
      <ExperienceDetailModal
        isOpen={!!selectedExperience}
        onClose={() => setSelectedExperience(null)}
        experience={selectedExperience}
        isOwnProfile={isOwnProfile}
        onEdit={handleEditExperience}
        onDelete={handleDeleteExperience}
      />
      <ProjectDetailModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
        isOwnProfile={isOwnProfile}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
      />
      <EducationDetailModal
        isOpen={!!selectedEducation}
        onClose={() => setSelectedEducation(null)}
        education={selectedEducation}
        isOwnProfile={isOwnProfile}
        onEdit={handleEditEducation}
        onDelete={handleDeleteEducation}
      />

      {/* Action Bar */}
      {isOwnProfile && (
        <div className="flex items-center justify-end gap-2 mb-4 print:hidden">
          <Button variant="outline" size="sm" onClick={handleShare} className="bg-transparent">
            <Share2 className="w-4 h-4 mr-2" />
            {copied ? "Copied!" : "Share"}
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          {onEdit && (
            <Button size="sm" onClick={onEdit}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit CV
            </Button>
          )}
        </div>
      )}

      {/* CV Document - A4 Paper Style */}
      <div className="bg-white shadow-xl border border-border mx-auto print:shadow-none print:border-none" style={{ maxWidth: "210mm", minHeight: "297mm" }}>
        {/* Header - Blue Banner */}
        <div className="bg-primary px-8 py-6 relative">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-primary-foreground tracking-tight">{displayData.name}</h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-sm text-primary-foreground/90">
                {displayData.location && <span>{displayData.location}</span>}
                {contactPublic && displayData.phone && (
                  <>
                    {displayData.location && <span className="text-primary-foreground/60">|</span>}
                    <span>{displayData.phone}</span>
                  </>
                )}
                {contactPublic && displayData.email && (
                  <>
                    {(displayData.location || displayData.phone) && <span className="text-primary-foreground/60">|</span>}
                    <a href={`mailto:${displayData.email}`} className="hover:underline">
                      {displayData.email}
                    </a>
                  </>
                )}
                {displayData.website && (
                  <>
                    {(displayData.location || (contactPublic && displayData.phone) || (contactPublic && displayData.email)) && <span className="text-primary-foreground/60">|</span>}
                    <a href={displayData.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {displayData.website.replace("https://", "")}
                    </a>
                  </>
                )}
              </div>
            </div>
            {isOwnProfile && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => console.log("Edit contact info")}
                className="print:hidden text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8 p-0 flex-shrink-0 ml-4"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* CV Content */}
        <div className="px-8 py-6 space-y-5 text-foreground" style={{ fontSize: "10pt", lineHeight: "1.5" }}>
          {/* About Me Section */}
          {displayData.aboutMe && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-base font-bold text-primary border-b-2 border-primary pb-1">
                  About Me
                </h2>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{displayData.aboutMe}</p>
            </section>
          )}

          {/* Education Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h2 className="text-base font-bold text-primary border-b-2 border-primary pb-1">
                  Education
                </h2>
              </div>
              {isOwnProfile && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleAddEducation}
                  className="print:hidden h-8 w-8 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {displayData.education.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No education available</p>
              ) : (
                displayData.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex flex-wrap items-baseline gap-x-1">
                      <button
                        onClick={() => setSelectedEducation(edu)}
                        className="font-bold text-primary hover:underline cursor-pointer"
                      >
                        {edu.institution}
                      </button>
                      <span className="text-muted-foreground text-sm">
                        ({edu.startDate} - {edu.endDate})
                      </span>
                      <span className="text-foreground">-</span>
                      <span className="text-foreground">{edu.degree}</span>
                    </div>
                    {edu.grade && (
                      <p className="text-foreground text-sm mt-0.5">
                        <span className="font-medium">{edu.expected ? "Expected" : "Grade"}:</span> {edu.grade}
                    </p>
                      )}
                    </div>
                ))
              )}
            </div>
          </section>

          {/* Experience Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                <h2 className="text-base font-bold text-primary border-b-2 border-primary pb-1">
                  Experience
                </h2>
              </div>
              {isOwnProfile && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleAddExperience}
                  className="print:hidden h-8 w-8 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {displayData.experience.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No experience available</p>
              ) : (
                displayData.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex flex-wrap items-baseline gap-x-1">
                      <span className="font-bold text-foreground">{exp.company}</span>
                      <span className="text-foreground">-</span>
                      <button
                        onClick={() => setSelectedExperience(exp)}
                        className="font-bold text-primary hover:underline cursor-pointer"
                      >
                        {exp.title}
                      </button>
                      <span className="text-foreground">,</span>
                      <span className="text-muted-foreground text-sm">
                        {exp.startDate} - {exp.current ? "Current" : exp.endDate}
                      </span>
                    </div>
                    <p className="text-foreground mt-1 text-sm">{exp.description}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Skills Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                <h2 className="text-base font-bold text-primary border-b-2 border-primary pb-1">
                  Skills
                </h2>
              </div>
              {isOwnProfile && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleAddSkill}
                  className="print:hidden h-8 w-8 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="space-y-1.5">
              {displayData.skills.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No skills available</p>
              ) : (
                displayData.skills.map((skillGroup) => (
                  <div key={skillGroup.category}>
                    <span className="font-bold text-foreground">{skillGroup.category}</span>
                    <span className="text-foreground"> - </span>
                    <span>
                      {skillGroup.items.map((skill, idx) => (
                        <span key={skill.name}>
                          <button
                            onClick={() => setSelectedSkill(skill)}
                            className="text-primary hover:underline cursor-pointer"
                          >
                            {skill.name}
                          </button>
                          {idx < skillGroup.items.length - 1 && <span className="text-foreground">, </span>}
                        </span>
                      ))}
                      <span className="text-foreground">.</span>
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Projects Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground">PROJ</Badge>
                <h2 className="text-base font-bold text-primary border-b-2 border-primary pb-1">
                  Projects
                </h2>
              </div>
              {isOwnProfile && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleAddProject}
                  className="print:hidden h-8 w-8 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {displayData.projects.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No projects available</p>
              ) : (
                displayData.projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex flex-wrap items-baseline gap-x-1">
                      <button
                        onClick={() => setSelectedProject(proj)}
                        className="font-bold text-primary hover:underline cursor-pointer"
                      >
                        {proj.name}
                      </button>
                      {proj.url && (
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          <ExternalLink className="w-3 h-3 inline" />
                        </a>
                      )}
                    </div>
                    <p className="text-foreground text-sm mt-1">{proj.description}</p>
                    {proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {proj.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Certifications Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground">CERT</Badge>
                <h2 className="text-base font-bold text-primary border-b-2 border-primary pb-1">
                  Certifications
                </h2>
              </div>
              {isOwnProfile && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleAddCertification}
                  className="print:hidden h-8 w-8 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground italic">No certifications added yet</p>
          </section>
        </div>
      </div>
    </div>
  );
}

// Edit Experience Form Component
function EditExperienceForm({ experience, onClose, onSuccess }: { experience: Experience; onClose: () => void; onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: experience.title || "",
    company: experience.company || "",
    location: experience.location || "",
    startDate: experience.startDate || "",
    endDate: experience.endDate || "",
    current: experience.current || false,
    description: experience.description || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/cv/edit-experience", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: experience.id, ...formData }),
      });

      if (!response.ok) throw new Error("Failed to update experience");
      onSuccess();
    } catch (error) {
      console.error("[v0] Error updating experience:", error);
      alert("Failed to update experience");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Job Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="month"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="month"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            disabled={formData.current}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="current"
          checked={formData.current}
          onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: "" })}
        />
        <Label htmlFor="current">Currently working here</Label>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

// Edit Education Form Component
function EditEducationForm({ education, onClose, onSuccess }: { education: Education; onClose: () => void; onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    institution: education.institution || "",
    degree: education.degree || "",
    location: education.location || "",
    startDate: education.startDate || "",
    endDate: education.endDate || "",
    target: education.target || "",
    achieved: education.achieved || "",
    gradeDescription: education.gradeDescription || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/cv/edit-education", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: education.id, ...formData }),
      });

      if (!response.ok) throw new Error("Failed to update education");
      onSuccess();
    } catch (error) {
      console.error("[v0] Error updating education:", error);
      alert("Failed to update education");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="institution">Institution</Label>
        <Input
          id="institution"
          value={formData.institution}
          onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="degree">Degree</Label>
        <Input
          id="degree"
          value={formData.degree}
          onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="month"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="month"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="target">Target Grade (Optional)</Label>
          <Input
            id="target"
            value={formData.target}
            onChange={(e) => setFormData({ ...formData, target: e.target.value })}
            placeholder="e.g., 3.8"
          />
        </div>
        <div>
          <Label htmlFor="achieved">Achieved Grade (Optional)</Label>
          <Input
            id="achieved"
            value={formData.achieved}
            onChange={(e) => setFormData({ ...formData, achieved: e.target.value })}
            placeholder="e.g., 3.7"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="gradeDescription">Grade Description (Optional)</Label>
        <Input
          id="gradeDescription"
          value={formData.gradeDescription}
          onChange={(e) => setFormData({ ...formData, gradeDescription: e.target.value })}
          placeholder="e.g., First Class Honours"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

// Edit Project Form Component
function EditProjectForm({ project, onClose, onSuccess }: { project: Project; onClose: () => void; onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: project.name || "",
    description: project.description || "",
    technologies: (project.technologies || []).join(", "),
    link: project.url || "",
    startDate: project.startDate || "",
    endDate: project.endDate || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/cv/edit-project", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: project.id,
          name: formData.name,
          description: formData.description,
          technologies: formData.technologies.split(",").map((t) => t.trim()),
          link: formData.link,
          startDate: formData.startDate,
          endDate: formData.endDate,
        }),
      });

      if (!response.ok) throw new Error("Failed to update project");
      onSuccess();
    } catch (error) {
      console.error("[v0] Error updating project:", error);
      alert("Failed to update project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date (Optional)</Label>
          <Input
            id="startDate"
            type="month"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date (Optional)</Label>
          <Input
            id="endDate"
            type="month"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="technologies">Technologies (comma-separated)</Label>
        <Input
          id="technologies"
          value={formData.technologies}
          onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
          placeholder="React, TypeScript, Tailwind"
        />
      </div>
      <div>
        <Label htmlFor="link">Project Link (Optional)</Label>
        <Input
          id="link"
          type="url"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

// Edit Certification Form Component
function EditCertificationForm({ certification, onClose, onSuccess }: { certification: any; onClose: () => void; onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: certification.name || "",
    institute: certification.issuer || "",
    issueDate: certification.date || "",
    expiryDate: "",
    description: "",
    link: certification.url || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/cv/edit-certification", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: certification.id, ...formData }),
      });

      if (!response.ok) throw new Error("Failed to update certification");
      onSuccess();
    } catch (error) {
      console.error("[v0] Error updating certification:", error);
      alert("Failed to update certification");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Certification Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="institute">Issuing Organization</Label>
        <Input
          id="institute"
          value={formData.institute}
          onChange={(e) => setFormData({ ...formData, institute: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="issueDate">Issue Date</Label>
          <Input
            id="issueDate"
            type="date"
            value={formData.issueDate}
            onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
          <Input
            id="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="link">Credential URL (Optional)</Label>
        <Input
          id="link"
          type="url"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

// Add Experience Form Component
function AddExperienceForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/cv/add-experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add experience");
      onSuccess();
    } catch (error) {
      console.error("[v0] Error adding experience:", error);
      alert("Failed to add experience");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Job Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="month"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="month"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            disabled={formData.current}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="current"
          checked={formData.current}
          onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: "" })}
        />
        <Label htmlFor="current">Currently working here</Label>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Experience"}
        </Button>
      </div>
    </form>
  );
}

// Add Education Form Component
function AddEducationForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    location: "",
    startDate: "",
    endDate: "",
    target: "",
    achieved: "",
    gradeDescription: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/cv/add-education", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add education");
      onSuccess();
    } catch (error) {
      console.error("[v0] Error adding education:", error);
      alert("Failed to add education");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="institution">Institution</Label>
        <Input
          id="institution"
          value={formData.institution}
          onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="degree">Degree</Label>
        <Input
          id="degree"
          value={formData.degree}
          onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="month"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="month"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="target">Target Grade (Optional)</Label>
          <Input
            id="target"
            value={formData.target}
            onChange={(e) => setFormData({ ...formData, target: e.target.value })}
            placeholder="e.g., 3.8"
          />
        </div>
        <div>
          <Label htmlFor="achieved">Achieved Grade (Optional)</Label>
          <Input
            id="achieved"
            value={formData.achieved}
            onChange={(e) => setFormData({ ...formData, achieved: e.target.value })}
            placeholder="e.g., 3.7"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="gradeDescription">Grade Description (Optional)</Label>
        <Input
          id="gradeDescription"
          value={formData.gradeDescription}
          onChange={(e) => setFormData({ ...formData, gradeDescription: e.target.value })}
          placeholder="e.g., First Class Honours"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Education"}
        </Button>
      </div>
    </form>
  );
}

// Add Skill Form Component
function AddSkillForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    level: "intermediate" as const,
    isSoftSkill: false,
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/cv/add-skill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add skill");
      onSuccess();
    } catch (error) {
      console.error("[v0] Error adding skill:", error);
      alert("Failed to add skill");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Skill Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="level">Level</Label>
        <select
          id="level"
          value={formData.level}
          onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
          className="w-full border border-input rounded px-3 py-2"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isSoftSkill"
          checked={formData.isSoftSkill}
          onChange={(e) => setFormData({ ...formData, isSoftSkill: e.target.checked })}
        />
        <Label htmlFor="isSoftSkill">Soft Skill</Label>
      </div>
      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Skill"}
        </Button>
      </div>
    </form>
  );
}

// Add Project Form Component
function AddProjectForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    technologies: "",
    link: "",
    startDate: "",
    endDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/cv/add-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          technologies: formData.technologies.split(",").map((t) => t.trim()),
        }),
      });

      if (!response.ok) throw new Error("Failed to add project");
      onSuccess();
    } catch (error) {
      console.error("[v0] Error adding project:", error);
      alert("Failed to add project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          required
        />
      </div>
      <div>
        <Label htmlFor="technologies">Technologies (comma-separated)</Label>
        <Input
          id="technologies"
          value={formData.technologies}
          onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
          placeholder="React, TypeScript, Tailwind"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date (Optional)</Label>
          <Input
            id="startDate"
            type="month"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date (Optional)</Label>
          <Input
            id="endDate"
            type="month"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="link">Project Link (Optional)</Label>
        <Input
          id="link"
          type="url"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Project"}
        </Button>
      </div>
    </form>
  );
}

// Add Certification Form Component
function AddCertificationForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    institute: "",
    issueDate: "",
    expiryDate: "",
    description: "",
    link: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/cv/add-certification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add certification");
      onSuccess();
    } catch (error) {
      console.error("[v0] Error adding certification:", error);
      alert("Failed to add certification");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Certification Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="institute">Issuing Organization</Label>
        <Input
          id="institute"
          value={formData.institute}
          onChange={(e) => setFormData({ ...formData, institute: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="issueDate">Issue Date</Label>
          <Input
            id="issueDate"
            type="date"
            value={formData.issueDate}
            onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
          <Input
            id="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="link">Credential URL (Optional)</Label>
        <Input
          id="link"
          type="url"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Certification"}
        </Button>
      </div>
    </form>
  );
}
