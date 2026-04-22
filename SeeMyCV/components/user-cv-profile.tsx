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
  Copy,
  Check,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  ExternalLink,
  Plus,
  Pencil,
  Trash2,
  Linkedin,
  Globe,
} from "lucide-react";

interface CVProfileData {
  name: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  github: string;
  linkedin: string;
  aboutMe: string;
  skills: SkillGroup[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
}

interface SkillGroup {
  category: string;
  items: SkillItem[];
}

interface SkillItem {
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  yearsExperience?: number;
  description?: string;
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
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  target?: string;
  achieved?: string;
  gradeDescription?: string;
}

interface UserCVProfileProps {
  data?: CVProfileData;
  isOwnProfile?: boolean;
  username?: string;
  onEdit?: () => void;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
  description?: string;
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
              {experience.startDate} - {experience.current ? "Present" : experience.endDate}
            </span>
          </div>
          {experience.description && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-foreground">{experience.description}</p>
            </div>
          )}
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
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          )}
          {project.description && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-foreground">{project.description}</p>
            </div>
          )}
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
      <DialogContent className="max-w-2xl">
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
            <span>{education.startDate} - {education.endDate}</span>
            {education.location && <span>{education.location}</span>}
          </div>
          {(education.target || education.achieved) && (
            <div className="space-y-2">
              {education.target && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Target Grade:</span>
                  <span className="font-medium">{education.target}</span>
                </div>
              )}
              {education.achieved && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Achieved:</span>
                  <span className="font-medium">{education.achieved}</span>
                </div>
              )}
            </div>
          )}
          {education.gradeDescription && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-foreground">{education.gradeDescription}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Transform functions
function transformSkills(skills: any[]): SkillGroup[] {
  const grouped: { [key: string]: SkillItem[] } = {};
  skills.forEach((skill) => {
    const category = skill.category || "Other";
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push({
      name: skill.name,
      level: skill.skill_level || "intermediate",
      description: skill.description,
    });
  });
  return Object.entries(grouped).map(([category, items]) => ({ category, items }));
}

function transformExperiences(experiences: any[]): Experience[] {
  return experiences.map((exp) => ({
    id: exp.experience_id,
    title: exp.position || exp.title,
    company: exp.summary || exp.company,
    location: exp.location || "",
    startDate: exp.start_date || "",
    endDate: exp.end_date || "",
    current: exp.currently_working || false,
    description: exp.description || "",
  }));
}

function transformProjects(projects: any[]): Project[] {
  return projects.map((proj) => ({
    id: proj.project_id,
    name: proj.title || proj.name,
    description: proj.description || "",
    technologies: Array.isArray(proj.skills) ? proj.skills : proj.technologies || [],
    url: proj.link || proj.url,
    startDate: proj.start_date,
    endDate: proj.end_date,
  }));
}

function transformEducation(education: any[]): Education[] {
  return education.map((edu) => ({
    id: edu.education_id,
    degree: edu.degree || "",
    institution: edu.institute_name || "",
    location: edu.location || "",
    startDate: edu.start_date || "",
    endDate: edu.end_date || "",
    target: edu.target,
    achieved: edu.achieved,
    gradeDescription: edu.grade_description,
  }));
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

  // Fetch public user data if username provided
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
  const { userData, loading } = useUser();

  // Use real data if available, NEVER fall back to hardcoded data
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
    
    // For own profile, ONLY use database data
    if (isOwnProfile && userData) {
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
    
    // Fallback to empty data
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

  if (loading || publicLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading...</div>;
  }

  const copyToClipboard = () => {
    const url = `${window.location.origin}/user/${displayData.name.replace(/\s+/g, "-").toLowerCase()}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <header className="mb-8">
        <div className="flex flex-col gap-6">
          {/* Name & Basic Info */}
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">{displayData.name || "CV Profile"}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {displayData.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {displayData.location}
                </span>
              )}
              {displayData.email && (
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {displayData.email}
                </span>
              )}
              {displayData.phone && (
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {displayData.phone}
                </span>
              )}
            </div>
          </div>

          {/* About Me */}
          {displayData.aboutMe && (
            <p className="text-foreground leading-relaxed max-w-2xl">{displayData.aboutMe}</p>
          )}

          {/* Share Profile Button */}
          {isOwnProfile && (
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Share Profile
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Skills Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground">SKILLS</Badge>
            <h2 className="text-xl font-bold text-primary">Skills</h2>
          </div>
        </div>
        <div className="space-y-4">
          {displayData.skills.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No skills available</p>
          ) : (
            displayData.skills.map((skillGroup) => (
              <div key={skillGroup.category}>
                <h3 className="font-semibold text-foreground mb-2">{skillGroup.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill) => (
                    <button
                      key={skill.name}
                      onClick={() => setSelectedSkill(skill)}
                      className="px-3 py-1 bg-muted text-foreground rounded-full text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {skill.name}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Experience Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground">EXP</Badge>
            <h2 className="text-xl font-bold text-primary">Experience</h2>
          </div>
        </div>
        <div className="space-y-4">
          {displayData.experience.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No experience available</p>
          ) : (
            displayData.experience.map((exp) => (
              <div
                key={exp.id}
                onClick={() => setSelectedExperience(exp)}
                className="p-4 bg-card border border-border rounded-lg hover:border-primary cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Education Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground">EDU</Badge>
            <h2 className="text-xl font-bold text-primary">Education</h2>
          </div>
        </div>
        <div className="space-y-4">
          {displayData.education.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No education available</p>
          ) : (
            displayData.education.map((edu) => (
              <div
                key={edu.id}
                onClick={() => setSelectedEducation(edu)}
                className="p-4 bg-card border border-border rounded-lg hover:border-primary cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                    <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{edu.startDate} - {edu.endDate}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Projects Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground">PROJ</Badge>
            <h2 className="text-xl font-bold text-primary">Projects</h2>
          </div>
        </div>
        <div className="space-y-4">
          {displayData.projects.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No projects available</p>
          ) : (
            displayData.projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => setSelectedProject(proj)}
                className="p-4 bg-card border border-border rounded-lg hover:border-primary cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{proj.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{proj.description}</p>
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
                  {proj.url && <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Modals */}
      <SkillDetailModal
        isOpen={!!selectedSkill}
        onClose={() => setSelectedSkill(null)}
        skill={selectedSkill}
      />
      <ExperienceDetailModal
        isOpen={!!selectedExperience}
        onClose={() => setSelectedExperience(null)}
        experience={selectedExperience}
      />
      <ProjectDetailModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
      <EducationDetailModal
        isOpen={!!selectedEducation}
        onClose={() => setSelectedEducation(null)}
        education={selectedEducation}
      />
    </div>
  );
}
