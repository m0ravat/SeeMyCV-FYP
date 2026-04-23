"use client";

import { useState } from "react";
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
  Lock,
} from "lucide-react";

interface SkillItem {
  skill_id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  yearsExperience?: number;
  description?: string;
  is_soft_skill?: boolean;
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
  summary: string;
  description: string;
  technologies: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
  bullets: string[];
}

interface Education {
  id: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  grade?: string;
  target?: string;
  gradeDescription?: string;
  expected?: boolean;
  description?: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  expiryDate?: string;
  description?: string;
  url?: string;
  skills?: string[];
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
  certifications?: Certification[];
}

interface UserCVProfileProps {
  data?: CVProfileData;
  isOwnProfile?: boolean;
  onEdit?: () => void;
}

// Helper functions to transform database data to component format
function transformSkills(dbSkills: any[]): Skill[] {
  const grouped: { [key: string]: SkillItem[] } = {};
  
  dbSkills.forEach(skill => {
    const category = skill.is_soft_skill ? 'Soft Skills' : 'Technical Skills';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push({
      skill_id: skill.skill_id,
      name: skill.name,
      level: skill.skill_level || 'intermediate',
      description: skill.description,
      is_soft_skill: skill.is_soft_skill,
    });
  });
  
  return Object.entries(grouped).map(([category, items]) => ({ category, items }));
}

function formatDate(raw: string | null | undefined): string {
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

function transformExperiences(dbExperiences: any[]): Experience[] {
  return dbExperiences.map(exp => ({
    id: exp.experience_id?.toString() || '',
    title: exp.title || '',
    company: exp.summary || '',
    location: exp.location || '',
    startDate: formatDate(exp.start_date),
    endDate: formatDate(exp.end_date),
    current: !exp.end_date,
    description: exp.description || '',
    bullets: [],
  }));
}

function transformProjects(dbProjects: any[]): Project[] {
  return dbProjects.map(proj => ({
    id: proj.project_id?.toString() || '',
    name: proj.title || '',
    summary: proj.summary || '',
    description: proj.description || '',
    technologies: proj.skills ? proj.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    url: proj.link || '',
    startDate: formatDate(proj.start_date),
    endDate: formatDate(proj.end_date),
    bullets: [],
  }));
}

function transformEducation(dbEducation: any[]): Education[] {
  return dbEducation.map(edu => ({
    id: edu.education_id?.toString() || '',
    institution: edu.institute_name || '',
    location: edu.location || '',
    startDate: formatDate(edu.start_date),
    endDate: formatDate(edu.end_date),
    grade: edu.achieved || '',
    target: edu.target || '',
    gradeDescription: edu.grade_description || '',
  }));
}

function transformCertifications(dbCerts: any[]): Certification[] {
  return dbCerts.map(cert => ({
    id: cert.certification_id?.toString() || '',
    name: cert.title || '',
    issuer: cert.institute || '',
    date: formatDate(cert.issue_date),
    expiryDate: formatDate(cert.expiry_date),
    description: cert.description || cert.summary || '',
    url: cert.link || '',
    skills: cert.skills
      ? cert.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [],
  }));
}

const defaultData: CVProfileData = {
  name: "Muhammad Ravat",
  location: "London, UK",
  phone: "07769004379",
  email: "moravat763@gmail.com",
  website: "https://moravat.me",
  github: "https://github.com/m0ravat",
  aboutMe: "Passionate full-stack software engineer with a strong foundation in building scalable web applications. I have a proven track record of delivering high-quality code and collaborating effectively with teams. Experienced in modern development practices, cloud technologies, and agile methodologies. I thrive in challenging environments where I can contribute to innovative solutions and continue learning new technologies.",
  skills: [
    {
      category: "Coding Languages",
      items: [
        { name: "HTML", level: "expert", yearsExperience: 5, description: "Extensive experience building semantic, accessible HTML structures for web applications." },
        { name: "CSS", level: "expert", yearsExperience: 5, description: "Advanced styling including Flexbox, Grid, animations, and responsive design." },
        { name: "JavaScript/Node.js", level: "advanced", yearsExperience: 4, description: "Full-stack JavaScript development including async programming and API development." },
        { name: "TypeScript", level: "advanced", yearsExperience: 3, description: "Strong typing for large-scale applications with generics and advanced patterns." },
        { name: "Java", level: "intermediate", yearsExperience: 2, description: "Object-oriented programming and Spring Boot development." },
        { name: "C#", level: "intermediate", yearsExperience: 2, description: ".NET development and Unity game development basics." },
        { name: "Python", level: "intermediate", yearsExperience: 2, description: "Django web development and data processing scripts." },
      ],
    },
    {
      category: "Frameworks/Libraries",
      items: [
        { name: "Django", level: "intermediate", yearsExperience: 2, description: "Python web framework for rapid development." },
        { name: "Springboot", level: "intermediate", yearsExperience: 1, description: "Java-based enterprise application framework." },
        { name: "Express", level: "advanced", yearsExperience: 3, description: "Node.js web application framework for APIs." },
        { name: "Vue", level: "intermediate", yearsExperience: 2, description: "Progressive JavaScript framework for UIs." },
        { name: "React", level: "advanced", yearsExperience: 3, description: "Component-based UI library with hooks and state management." },
        { name: "NextJS", level: "advanced", yearsExperience: 2, description: "React framework with SSR, SSG, and API routes." },
        { name: ".NET", level: "beginner", yearsExperience: 1, description: "Microsoft framework for building applications." },
        { name: "Tailwind CSS", level: "expert", yearsExperience: 3, description: "Utility-first CSS framework for rapid UI development." },
      ],
    },
    {
      category: "Databases",
      items: [
        { name: "MySQL", level: "advanced", yearsExperience: 3, description: "Relational database design and optimization." },
        { name: "MongoDB", level: "intermediate", yearsExperience: 2, description: "NoSQL document database for flexible schemas." },
        { name: "Google Cloud Platform (GCP)", level: "intermediate", yearsExperience: 2, description: "Cloud services including Cloud SQL and Firebase." },
        { name: "DBDiagram.io", level: "advanced", yearsExperience: 2, description: "Database schema design and documentation." },
        { name: "DBDesigner", level: "intermediate", yearsExperience: 1, description: "Visual database modeling tool." },
        { name: "DrawSQL", level: "intermediate", yearsExperience: 1, description: "SQL diagram visualization tool." },
      ],
    },
    {
      category: "Development tools",
      items: [
        { name: "Git/GitHub", level: "expert", yearsExperience: 4, description: "Version control, branching strategies, and collaboration." },
        { name: "Vercel", level: "advanced", yearsExperience: 2, description: "Deployment platform for frontend frameworks." },
        { name: "Draw.io", level: "advanced", yearsExperience: 3, description: "Diagramming for system architecture and workflows." },
        { name: "Jira", level: "intermediate", yearsExperience: 2, description: "Agile project management and issue tracking." },
        { name: "Trello", level: "advanced", yearsExperience: 3, description: "Kanban-style task management." },
        { name: "Webpack", level: "intermediate", yearsExperience: 2, description: "Module bundling and build optimization." },
        { name: "JWT", level: "advanced", yearsExperience: 2, description: "JSON Web Tokens for authentication." },
      ],
    },
    {
      category: "Soft skills",
      items: [
        { name: "Adaptability", level: "expert", description: "Quick to adapt to new technologies and changing requirements." },
        { name: "Effective communication", level: "expert", description: "Clear communication with technical and non-technical stakeholders." },
        { name: "Time management", level: "advanced", description: "Efficient prioritization and deadline management." },
        { name: "Team collaboration", level: "expert", description: "Strong teamwork in agile environments." },
        { name: "Initiative", level: "advanced", description: "Proactive problem-solving and self-directed learning." },
      ],
    },
    {
      category: "Certifications",
      items: [
        { name: "Santander Project Management & Agile Fundamentals", level: "expert", description: "Certified in project management principles and agile methodologies including Scrum and Kanban." },
      ],
    },
  ],
  experience: [
    {
      id: "1",
      title: "FANS (Friends of Arriving New Students)",
      company: "University of Westminster",
      location: "London, UK",
      startDate: "September 2024",
      endDate: "October 2024",
      current: false,
      description: "Volunteered as a peer mentor to support incoming students during their transition to university life. Organized orientation activities and provided guidance on academic and social aspects.",
      bullets: [
        "Took on a **leadership role** guiding **35 students** over **6 weeks**, organising 4 activities in the first week that promoted team building and fostered early connections.",
        "Provided student support by responding to queries and signposting to relevant departments, leading to a **100% satisfaction rate** amongst students.",
      ],
    },
    {
      id: "2",
      title: "Night Replenishment",
      company: "Waitrose & Partners",
      location: "London, UK",
      startDate: "November 2024",
      endDate: "",
      current: true,
      description: "Working as part of the night team to ensure shelves are fully stocked and the store is ready for customers each morning. Responsible for inventory management and maintaining store presentation.",
      bullets: [
        "Collaborated with a team of **16+ colleagues** to replenish stock and keep the shopfloor tidy, contributing to a positive shopping experience and maintaining efficient inventory management.",
        "Paid close attention to detail and flagged damaged and almost expired products, contributing to the company's target of reducing food wastage by **50%**.",
        "Demonstrated reliability, adaptability across different areas, and the ability to communicate in a fast-paced environment, earning a **One Step Beyond award** within 2 shifts.",
      ],
    },
  ],
  projects: [
    {
      id: "1",
      name: "Personal Portfolio",
      description: "A modern, responsive portfolio website showcasing my projects and skills. Built with performance and SEO best practices in mind.",
      technologies: ["NextJS", "Tailwind CSS", "REST API"],
      url: "https://github.com/m0ravat",
      bullets: [
        "Maintained and migrated codebase from vanilla HTML to **NextJS** for enhanced scalability, cleaner code, and custom REST API routes for optimised data handling.",
        "Implemented **Tailwind CSS** and meta tags to enhance searchability and responsiveness, resulting in a **98/100 SEO** rating.",
      ],
    },
    {
      id: "2",
      name: "MadrasahPro (Mosque Management System)",
      description: "A comprehensive management system for Islamic educational institutions. Enables efficient tracking of student progress and teacher schedules.",
      technologies: ["SpringBoot", "GraphQL", "MySQL", "Google Cloud Platform (GCP)"],
      bullets: [
        "Created a data-oriented MVP utilising **SpringBoot & GraphQL** on the backend for effective data handling by following modern principles.",
        "Hosted a **MySQL** database on **Google Cloud Platform (GCP)** to store data surrounding the experiences of students, teachers and parents.",
        "Leveraged **Agile's Scrum** methodology to streamline the process of development by **80%** through sprints, planning, and evaluation across the whole **Software Development Lifecycle**.",
        "Rapidly prototyped the UI by leveraging **v0.dev** (AI model developed by Vercel) and referencing a similar website, speeding up the process by atleast **400%**.",
      ],
    },
    {
      id: "3",
      name: "Sky Health Check System",
      description: "A health monitoring application developed as part of a work-based learning project with Sky. Features comprehensive dashboards for tracking health metrics.",
      technologies: ["Django", "Storyboards", "UX Principles", "Kanban", "Trello"],
      bullets: [
        "Led a team of **4 students** to deliver a **Django** project for a **work-based learning project** assigned by professionals at Sky, demonstrating technical and teamwork skills formally recognised with a **Certificate of Completion**.",
        "Created low/high fidelity **wireframes** and used **storyboards** to design a comprehensive User Interface (UI) based on proven **User Experience (UX) principles** such as minimalism, scale, and visual hierarchy, receiving praise from industry professional.",
        "Adopted the **Kanban** software methodology for flexible planning and execution, ensuring other modules and assessments were fully completed without interruption.",
        "Facilitated regular team meetings, driving Trello engagement to **50%** and ensuring the timely completion of all deliverables.",
      ],
    },
  ],
  education: [
    {
      id: "1",
      degree: "Software Engineering Bachelor of Engineering (BEng)",
      institution: "University Of Westminster",
      location: "London, UK",
      startDate: "September 2023",
      endDate: "June 2026",
      grade: "First Class Honours (70%)",
      expected: true,
      description: "Studying software engineering with focus on full-stack development, software architecture, and agile methodologies.",
    },
  ],
};

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
          {experience.description && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-foreground leading-relaxed">{experience.description}</p>
            </div>
          )}
          {experience.bullets.length > 0 && (
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
          {(project.startDate || project.endDate) && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {project.startDate}{project.startDate && project.endDate ? " - " : ""}{project.endDate}
            </div>
          )}
          {project.technologies.length > 0 && (
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
              <p className="text-sm text-foreground leading-relaxed">{project.description}</p>
            </div>
          )}
          {project.bullets.length > 0 && (
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
      <DialogContent className="max-w-xl">
        <DialogHeader className="flex flex-row items-start justify-between space-y-0 pb-6">
          <DialogTitle className="text-lg">
            {education.institution}
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
        <div className="space-y-4 py-2">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {education.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {education.location}
              </span>
            )}
            {(education.startDate || education.endDate) && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {education.startDate}{education.startDate && education.endDate ? " - " : ""}{education.endDate}
              </span>
            )}
          </div>
          {(education.grade || education.target || education.gradeDescription) && (
            <div className="space-y-1">
              {education.target && (
                <p className="text-sm text-foreground">
                  <span className="font-medium">Target: </span>{education.target}
                </p>
              )}
              {education.grade && (
                <p className="text-sm text-foreground">
                  <span className="font-medium">{education.expected ? "Expected Grade: " : "Achieved: "}</span>
                  {education.grade}
                </p>
              )}
              {education.gradeDescription && (
                <p className="text-sm text-muted-foreground">{education.gradeDescription}</p>
              )}
            </div>
          )}
          {education.description && (
            <p className="text-sm text-foreground leading-relaxed">{education.description}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const emptyData: CVProfileData = {
  name: "", location: "", phone: "", email: "", website: "", github: "", linkedin: "",
  aboutMe: "", skills: [], experience: [], projects: [], education: [], certifications: [],
};

export function UserCVProfile({ data, isOwnProfile = true, onEdit }: UserCVProfileProps) {
  const [copied, setCopied] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(null);
  const [selectedCertification, setSelectedCertification] = useState<any | null>(null);
  const [showAddExperienceDialog, setShowAddExperienceDialog] = useState(false);
  const [showAddEducationDialog, setShowAddEducationDialog] = useState(false);
  const [showAddSkillDialog, setShowAddSkillDialog] = useState(false);
  const [showEditSkillDialog, setShowEditSkillDialog] = useState(false);
  const [editSkillName, setEditSkillName] = useState('');
  const [editSkillDescription, setEditSkillDescription] = useState('');
  const [editSkillIsSoft, setEditSkillIsSoft] = useState(false);
  const [editSkillSaving, setEditSkillSaving] = useState(false);
  const [showAddProjectDialog, setShowAddProjectDialog] = useState(false);
  const [showAddCertificationDialog, setShowAddCertificationDialog] = useState(false);
  const [showEditExperienceDialog, setShowEditExperienceDialog] = useState(false);
  const [showEditEducationDialog, setShowEditEducationDialog] = useState(false);
  const [showEditProjectDialog, setShowEditProjectDialog] = useState(false);
  const [showEditCertificationDialog, setShowEditCertificationDialog] = useState(false);
  const [showEditProfileDialog, setShowEditProfileDialog] = useState(false);
  
  // Fetch real user data if this is own profile
  const { userData, loading, refetch } = useUser();
  
  // Use real data if available, show empty while loading — never flash hardcoded data
  const displayData = (() => {
    if (isOwnProfile) {
      if (!userData) return emptyData;
      const cv = userData.cv;
      const profile = userData.profile;
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
        certifications: cv.certifications?.length > 0 ? transformCertifications(cv.certifications) : [],
      };
    }
    // For viewing other profiles, use passed data prop (or empty while fetching)
    return data ?? emptyData;
  })();
  
  // Get contact visibility preference from userData
  const contactPublic = userData?.profile?.contactPublic !== false;

  const handleShare = () => {
    const username = userData?.user?.username;
    const url = username
      ? `${window.location.origin}/profile/${username}`
      : window.location.href;
    navigator.clipboard.writeText(url);
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
    setShowEditSkillDialog(true);
  };

  const handleDeleteSkill = async () => {
    if (!selectedSkill?.skill_id) return;
    try {
      const response = await fetch("/api/cv/delete-skill", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId: selectedSkill.skill_id }),
      });
      if (!response.ok) throw new Error("Failed to delete skill");
      setSelectedSkill(null);
      refetch();
    } catch (error) {
      console.error("[v0] Error deleting skill:", error);
      alert("Failed to delete skill. Please try again.");
    }
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

  const handleDeleteCertification = async () => {
    if (!selectedCertification?.id) return;
    try {
      const response = await fetch("/api/cv/delete-certification", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedCertification.id }),
      });
      if (!response.ok) throw new Error("Failed to delete certification");
      setSelectedCertification(null);
      refetch();
    } catch (error) {
      console.error("[v0] Error deleting certification:", error);
      alert("Failed to delete certification");
    }
  };

  if (isOwnProfile && loading) {
    return (
      <div className="max-w-5xl mx-auto animate-pulse space-y-6 py-6">
        <div className="h-8 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-1/4" />
        <div className="h-24 bg-muted rounded" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-4 bg-muted rounded w-2/5" />
      </div>
    );
  }

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
        isOpen={!!selectedSkill && !showEditSkillDialog}
        onClose={() => setSelectedSkill(null)}
        skill={selectedSkill}
        isOwnProfile={isOwnProfile}
        onEdit={handleEditSkill}
        onDelete={handleDeleteSkill}
      />

      {/* Edit Skill Dialog */}
      <Dialog
        open={showEditSkillDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowEditSkillDialog(false);
          } else {
            setEditSkillName(selectedSkill?.name ?? '');
            setEditSkillDescription(selectedSkill?.description ?? '');
            setEditSkillIsSoft(selectedSkill?.is_soft_skill ?? false);
          }
        }}
      >
        <DialogContent className="max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Skill Name</label>
              <Input
                value={editSkillName}
                onChange={(e) => setEditSkillName(e.target.value)}
                placeholder="e.g. React, Teamwork..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Description (optional)</label>
              <Input
                value={editSkillDescription}
                onChange={(e) => setEditSkillDescription(e.target.value)}
                placeholder="Brief description..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="editIsSoft"
                checked={editSkillIsSoft}
                onChange={(e) => setEditSkillIsSoft(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="editIsSoft" className="text-sm font-medium cursor-pointer">Soft skill</label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowEditSkillDialog(false)}>Cancel</Button>
            <Button
              disabled={editSkillSaving || !editSkillName.trim()}
              onClick={async () => {
                if (!selectedSkill?.skill_id) return;
                setEditSkillSaving(true);
                try {
                  const res = await fetch('/api/cv/edit-skill', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      skillId: selectedSkill.skill_id,
                      name: editSkillName.trim(),
                      description: editSkillDescription.trim() || null,
                      isSoftSkill: editSkillIsSoft,
                    }),
                  });
                  if (!res.ok) throw new Error('Failed to update skill');
                  setShowEditSkillDialog(false);
                  setSelectedSkill(null);
                  refetch();
                } catch {
                  alert('Failed to update skill. Please try again.');
                } finally {
                  setEditSkillSaving(false);
                }
              }}
            >
              {editSkillSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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

      {/* Certification Detail Dialog */}
      <Dialog open={!!selectedCertification && !showEditCertificationDialog} onOpenChange={(open) => { if (!open) setSelectedCertification(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
            <DialogTitle className="text-lg pr-4">{selectedCertification?.name}</DialogTitle>
            {isOwnProfile && (
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => setShowEditCertificationDialog(true)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={handleDeleteCertification}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </DialogHeader>
          {selectedCertification && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Issued by</span>
                <span className="font-medium text-foreground">{selectedCertification.issuer}</span>
              </div>
              {selectedCertification.date && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Issue Date</span>
                  <span className="font-medium text-foreground">{selectedCertification.date}</span>
                </div>
              )}
              {selectedCertification.expiryDate && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Expiry Date</span>
                  <span className="font-medium text-foreground">{selectedCertification.expiryDate}</span>
                </div>
              )}
              {selectedCertification.description && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-foreground leading-relaxed">{selectedCertification.description}</p>
                </div>
              )}
              {selectedCertification.skills && selectedCertification.skills.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedCertification.skills.map((s: string) => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {selectedCertification.url && (
                <a
                  href={selectedCertification.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  View Credential
                </a>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      {isOwnProfile && userData && (
        <EditProfileDialog
          open={showEditProfileDialog}
          onOpenChange={setShowEditProfileDialog}
          profile={userData.profile}
          onSaved={refetch}
        />
      )}

      {/* Action Bar */}
      {isOwnProfile && (
        <div className="flex items-center justify-end gap-2 mb-4 print:hidden">
          <Button variant="outline" size="sm" onClick={handleShare} className="bg-transparent">
            <Share2 className="w-4 h-4 mr-2" />
            {copied ? "Copied!" : "Share"}
          </Button>
          {userData?.user?.isPremium ? (
            <Button variant="outline" size="sm" className="bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent opacity-60 cursor-not-allowed"
              disabled
              title="Upgrade to Premium to download your CV as PDF"
            >
              <Lock className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          )}
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
                {(() => {
                  const showContact = isOwnProfile || contactPublic;
                  const items: React.ReactNode[] = [];
                  if (displayData.location) items.push(<span key="loc">{displayData.location}</span>);
                  if (showContact && displayData.phone) items.push(<span key="phone">{displayData.phone}</span>);
                  if (showContact && displayData.email) items.push(
                    <a key="email" href={`mailto:${displayData.email}`} className="hover:underline">{displayData.email}</a>
                  );
                  if (displayData.linkedin) items.push(
                    <a key="linkedin" href={displayData.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {displayData.linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, "").replace(/\/$/, "")}
                    </a>
                  );
                  if (displayData.website) items.push(
                    <a key="website" href={displayData.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {displayData.website.replace(/https?:\/\//, "")}
                    </a>
                  );
                  return items.flatMap((item, i) =>
                    i === 0 ? [item] : [<span key={`sep-${i}`} className="text-primary-foreground/60">|</span>, item]
                  );
                })()}
              </div>
            </div>
            {isOwnProfile && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowEditProfileDialog(true)}
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
                        className="font-bold text-primary hover:underline cursor-pointer text-left"
                      >
                        {edu.institution}
                      </button>
                      {edu.gradeDescription && (
                        <span className="text-muted-foreground text-sm">
                          — {edu.gradeDescription}
                        </span>
                      )}
                    </div>
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
                      {exp.company && (
                        <span className="font-semibold text-foreground">{exp.company}</span>
                      )}
                      {exp.company && <span className="text-muted-foreground">-</span>}
                      <button
                        onClick={() => setSelectedExperience(exp)}
                        className="font-bold text-primary hover:underline cursor-pointer"
                      >
                        {exp.title}
                      </button>
                    </div>
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
                        className="font-bold text-primary hover:underline cursor-pointer text-left"
                      >
                        {proj.name}
                      </button>
                      {proj.summary && (
                        <span className="text-muted-foreground text-sm">— {proj.summary}</span>
                      )}
                    </div>
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
            {displayData.certifications && displayData.certifications.length > 0 ? (
              <div className="space-y-2">
                {displayData.certifications.map((cert) => (
                  <div key={cert.id}>
                    <div className="flex flex-wrap items-baseline gap-x-1">
                      <button
                        onClick={() => setSelectedCertification(cert)}
                        className="font-bold text-primary hover:underline cursor-pointer"
                      >
                        {cert.name}
                      </button>
                      {cert.issuer && <span className="text-muted-foreground">-</span>}
                      {cert.issuer && (
                        <span className="text-foreground">{cert.issuer}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No certifications added yet</p>
            )}
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
    summary: project.summary || "",
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
          summary: formData.summary,
          description: formData.description,
          technologies: formData.technologies.split(",").map((t) => t.trim()).filter(Boolean),
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
        <Label htmlFor="summary">Summary</Label>
        <Input
          id="summary"
          placeholder="One-line overview shown in the profile"
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Full details shown when the project is opened"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
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

// Edit Profile Dialog
function EditProfileDialog({
  open,
  onOpenChange,
  profile,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: any;
  onSaved: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    email: profile.email || "",
    phone: profile.phone || "",
    location: profile.location || "",
    linkedinUrl: profile.linkedinUrl || "",
    personalWebsite: profile.personalWebsite || "",
    aboutMe: profile.aboutMe || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      onSaved();
      onOpenChange(false);
    } catch (error) {
      console.error("[v0] Error updating profile:", error);
      alert("Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
          <div>
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <Input
              id="linkedinUrl"
              type="url"
              placeholder="https://linkedin.com/in/yourname"
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="personalWebsite">Personal Website</Label>
            <Input
              id="personalWebsite"
              type="url"
              placeholder="https://yourwebsite.com"
              value={formData.personalWebsite}
              onChange={(e) => setFormData({ ...formData, personalWebsite: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="aboutMe">About Me</Label>
            <Textarea
              id="aboutMe"
              rows={4}
              value={formData.aboutMe}
              onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
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
    summary: "",
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
          technologies: formData.technologies.split(",").map((t) => t.trim()).filter(Boolean),
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
        <Label htmlFor="summary">Summary</Label>
        <Input
          id="summary"
          placeholder="One-line overview shown in the profile"
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Full details shown when the project is opened"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
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
