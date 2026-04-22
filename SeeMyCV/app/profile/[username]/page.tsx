"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserCVProfile } from "@/components/user-cv-profile";
import { ArrowLeft } from "lucide-react";

function formatDate(raw: string | null | undefined): string {
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

function transformSkills(dbSkills: any[]) {
  const grouped: { [key: string]: any[] } = {};
  dbSkills.forEach((skill) => {
    const category = skill.is_soft_skill ? "Soft Skills" : "Technical Skills";
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push({
      name: skill.name,
      level: skill.skill_level || "intermediate",
      description: skill.description || "",
      yearsExperience: skill.years_experience || undefined,
    });
  });
  return Object.entries(grouped).map(([category, items]) => ({ category, items }));
}

function transformExperiences(dbExperiences: any[]) {
  return dbExperiences.map((exp) => ({
    id: exp.experience_id?.toString() || "",
    title: exp.title || "",
    company: exp.summary || "",
    location: exp.location || "",
    startDate: formatDate(exp.start_date),
    endDate: formatDate(exp.end_date),
    current: !exp.end_date,
    description: exp.description || "",
    keySkills: exp.key_skills || "",
    bullets: [],
  }));
}

function transformProjects(dbProjects: any[]) {
  return dbProjects.map((proj) => ({
    id: proj.project_id?.toString() || "",
    name: proj.title || "",
    description: proj.description || proj.summary || "",
    technologies: proj.skills
      ? proj.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [],
    url: proj.link || "",
    startDate: formatDate(proj.start_date),
    endDate: formatDate(proj.end_date),
    bullets: [],
  }));
}

function transformEducation(dbEducation: any[]) {
  return dbEducation.map((edu) => ({
    id: edu.education_id?.toString() || "",
    degree: "",              // education table has no degree name column
    institution: edu.institute_name || "",
    location: edu.location || "",
    startDate: formatDate(edu.start_date),
    endDate: formatDate(edu.end_date),
    grade: edu.achieved || "",
    target: edu.target || "",
    gradeDescription: edu.grade_description || "",
  }));
}

function transformCertifications(dbCerts: any[]) {
  return dbCerts.map((cert) => ({
    id: cert.certification_id?.toString() || "",
    name: cert.title || "",
    issuer: cert.institute || "",
    date: formatDate(cert.issue_date),
    expiryDate: formatDate(cert.expiry_date),
    description: cert.description || cert.summary || "",
    url: cert.link || "",
    skills: cert.skills
      ? cert.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [],
  }));
}

export default function PublicProfilePage() {
  const params = useParams();
  const username = params?.username as string;

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/user/${username}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        const { profile, cv } = data;
        setProfileData({
          name: `${profile.firstName} ${profile.lastName}`.trim(),
          location: profile.location || "",
          phone: profile.contactPublic ? profile.phone || "" : "",
          email: profile.contactPublic ? profile.email || "" : "",
          website: profile.personalWebsite || "",
          github: "",
          linkedin: profile.linkedinUrl || "",
          aboutMe: profile.aboutMe || "",
          skills: cv.skills?.length > 0 ? transformSkills(cv.skills) : [],
          experience: cv.experiences?.length > 0 ? transformExperiences(cv.experiences) : [],
          projects: cv.projects?.length > 0 ? transformProjects(cv.projects) : [],
          education: cv.education?.length > 0 ? transformEducation(cv.education) : [],
          certifications: cv.certifications?.length > 0 ? transformCertifications(cv.certifications) : [],
        });
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CV</span>
            </div>
            <span className="font-bold text-xl text-foreground">CVConnect</span>
          </Link>
          <div className="w-[140px]" />
        </div>
      </header>

      <main className="py-8 px-4">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        ) : notFound ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <p className="text-xl font-semibold text-foreground">User not found</p>
            <p className="text-muted-foreground">
              No profile exists for &quot;{username}&quot;.
            </p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        ) : (
          <UserCVProfile data={profileData} isOwnProfile={false} />
        )}
      </main>

      <footer className="border-t border-border py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>CVConnect - Professional CV Sharing Platform</p>
        </div>
      </footer>
    </div>
  );
}
