"use client";

import React from "react"

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Plus,
  Trash2,
  Briefcase,
  Code,
  GraduationCap,
  Award,
  FolderOpen,
} from "lucide-react";

interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  summary: string;
  description: string;
  keySkills: string;
  location: string;
  startDate: string;
  endDate: string;
}

interface SkillEntry {
  id: string;
  name: string;
  summary: string;
  description: string;
  aptitude: "beginner" | "intermediate" | "advanced";
  skillType: "soft" | "hard" | "";
}

interface EducationEntry {
  id: string;
  instituteName: string;
  gradeAchieved: string;
  gradeTarget: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
}

interface ProjectEntry {
  id: string;
  title: string;
  summary: string;
  description: string;
  skills: string;
  link: string;
  startDate: string;
  endDate: string;
}

interface CertificationEntry {
  id: string;
  title: string;
  summary: string;
  description: string;
  skills: string;
  institute: string;
  link: string;
  issueDate: string;
  expiryDate: string;
}

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPremiumPlan = searchParams.get("plan") === "premium";

  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [credentials, setCredentials] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    location: "",
    linkedInUrl: "",
    personalWebsite: "",
    isProfilePublic: true,
    isContactDetailsPublic: true,
    aboutMe: "",
    experience: [] as ExperienceEntry[],
    skills: [] as SkillEntry[],
    education: [] as EducationEntry[],
    projects: [] as ProjectEntry[],
    certifications: [] as CertificationEntry[],
  });

  const handleCredentialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleAddExperience = () => {
    setProfileData({
      ...profileData,
      experience: [
        ...profileData.experience,
        { id: Date.now().toString(), title: "", company: "", summary: "", description: "", keySkills: "", location: "", startDate: "", endDate: "" },
      ],
    });
  };

  const handleUpdateExperience = (id: string, field: string, value: string) => {
    setProfileData({
      ...profileData,
      experience: profileData.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const handleRemoveExperience = (id: string) => {
    setProfileData({
      ...profileData,
      experience: profileData.experience.filter((exp) => exp.id !== id),
    });
  };

  const handleAddSkill = () => {
    setProfileData({
      ...profileData,
      skills: [
        ...profileData.skills,
        { id: Date.now().toString(), name: "", summary: "", description: "", aptitude: "beginner", skillType: "" },
      ],
    });
  };

  const handleUpdateSkill = (id: string, field: string, value: string | boolean) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    });
  };

  const handleRemoveSkill = (id: string) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter((skill) => skill.id !== id),
    });
  };

  const handleAddEducation = () => {
    setProfileData({
      ...profileData,
      education: [
        ...profileData.education,
        { id: Date.now().toString(), instituteName: "", gradeAchieved: "", gradeTarget: "", description: "", location: "", startDate: "", endDate: "" },
      ],
    });
  };

  const handleUpdateEducation = (id: string, field: string, value: string) => {
    setProfileData({
      ...profileData,
      education: profileData.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const handleRemoveEducation = (id: string) => {
    setProfileData({
      ...profileData,
      education: profileData.education.filter((edu) => edu.id !== id),
    });
  };

  const handleAddProject = () => {
    setProfileData({
      ...profileData,
      projects: [
        ...profileData.projects,
        { id: Date.now().toString(), title: "", summary: "", description: "", skills: "", link: "", startDate: "", endDate: "" },
      ],
    });
  };

  const handleUpdateProject = (id: string, field: string, value: string) => {
    setProfileData({
      ...profileData,
      projects: profileData.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    });
  };

  const handleRemoveProject = (id: string) => {
    setProfileData({
      ...profileData,
      projects: profileData.projects.filter((proj) => proj.id !== id),
    });
  };

  const handleAddCertification = () => {
    setProfileData({
      ...profileData,
      certifications: [
        ...profileData.certifications,
        { id: Date.now().toString(), title: "", summary: "", description: "", skills: "", institute: "", link: "", issueDate: "", expiryDate: "" },
      ],
    });
  };

  const handleUpdateCertification = (id: string, field: string, value: string) => {
    setProfileData({
      ...profileData,
      certifications: profileData.certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    });
  };

  const handleRemoveCertification = (id: string) => {
    setProfileData({
      ...profileData,
      certifications: profileData.certifications.filter((cert) => cert.id !== id),
    });
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate processing - instant redirect for demo
    router.push("/dashboard");
  };

  const benefits = [
    "Create professional CVs with industry-specific templates",
    "Get AI-powered feedback to optimize your CV",
    "Connect directly with recruiters and professionals",
    "Join a privacy-first community - no profile pictures",
    "Access career resources and expert guides",
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">CVConnect</span>
          </Link>

          <div className="space-y-8">
            <div>
              {isPremiumPlan && (
                <Badge className="bg-premium text-premium-foreground mb-4">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Premium Plan Selected
                </Badge>
              )}
              <h1 className="text-4xl font-bold leading-tight text-balance">
                Start your career journey today
              </h1>
              <p className="text-primary-foreground/80 text-lg leading-relaxed max-w-md mt-4">
                Create your free account and build professional CVs that get you noticed.
              </p>
            </div>

            <ul className="space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" />
                  <span className="text-primary-foreground/90">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-primary-foreground/60 text-sm">
            2024 CVConnect. Privacy-first professional networking.
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">CVConnect</span>
            </Link>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              1
            </div>
            <div className={`w-12 h-1 rounded ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              2
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {step === 1 ? "Create your account" : "Set up your profile"}
            </h2>
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>

          {step === 1 ? (
            <>
              {/* Step 1 Form */}
              <form onSubmit={handleStep1Submit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        value={credentials.firstName}
                        onChange={handleCredentialsChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={credentials.lastName}
                      onChange={handleCredentialsChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={credentials.email}
                      onChange={handleCredentialsChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={credentials.password}
                      onChange={handleCredentialsChange}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters with a number and symbol
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="tos"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="tos" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                      I agree to the{" "}
                      <button type="button" className="text-primary hover:underline">Terms of Service</button>
                      {" "}and{" "}
                      <button type="button" className="text-primary hover:underline">Privacy Policy</button>
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                  disabled={!agreeToTerms}
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </>
          ) : (
            /* Step 2 Form - Profile Setup */
            <form onSubmit={handleStep2Submit} className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Contact Details */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Contact Details</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={profileData.phoneNumber}
                      onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, Country"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="linkedInUrl">LinkedIn URL</Label>
                    <Input
                      id="linkedInUrl"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={profileData.linkedInUrl}
                      onChange={(e) => setProfileData({ ...profileData, linkedInUrl: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="personalWebsite">Personal Website</Label>
                    <Input
                      id="personalWebsite"
                      placeholder="https://yourwebsite.com"
                      value={profileData.personalWebsite}
                      onChange={(e) => setProfileData({ ...profileData, personalWebsite: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Public Profile</Label>
                      <p className="text-sm text-muted-foreground">
                        Make your profile visible to others
                      </p>
                    </div>
                    <Checkbox
                      checked={profileData.isProfilePublic}
                      onCheckedChange={(checked) =>
                        setProfileData({ ...profileData, isProfilePublic: checked as boolean })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Public Contact Details</Label>
                      <p className="text-sm text-muted-foreground">
                        Show email, phone & location on your profile
                      </p>
                    </div>
                    <Checkbox
                      checked={profileData.isContactDetailsPublic}
                      onCheckedChange={(checked) =>
                        setProfileData({ ...profileData, isContactDetailsPublic: checked as boolean })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* About Me */}
              <div className="space-y-2">
                <Label htmlFor="aboutMe" className="text-base font-semibold">About Me</Label>
                <Textarea
                  id="aboutMe"
                  name="aboutMe"
                  placeholder="Tell us about yourself..."
                  value={profileData.aboutMe}
                  onChange={handleProfileChange}
                  className="min-h-24 resize-none"
                />
              </div>

              {/* Education */}
              <div className="space-y-3 border-t border-border pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Education
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddEducation}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-3">
                  {profileData.education.map((edu) => (
                    <div key={edu.id} className="p-3 border border-border rounded-lg space-y-2 bg-muted/30">
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Institute / School"
                          value={edu.instituteName}
                          onChange={(e) => handleUpdateEducation(edu.id, "instituteName", e.target.value)}
                          className="text-sm"
                        />
                        <Input
                          placeholder="Location"
                          value={edu.location}
                          onChange={(e) => handleUpdateEducation(edu.id, "location", e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Grade Achieved"
                          value={edu.gradeAchieved}
                          onChange={(e) => handleUpdateEducation(edu.id, "gradeAchieved", e.target.value)}
                          className="text-sm"
                        />
                        <Input
                          placeholder="Grade Target"
                          value={edu.gradeTarget}
                          onChange={(e) => handleUpdateEducation(edu.id, "gradeTarget", e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <Textarea
                        placeholder="Description"
                        value={edu.description}
                        onChange={(e) => handleUpdateEducation(edu.id, "description", e.target.value)}
                        className="text-sm min-h-16 resize-none"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs mb-1 block">Start Date</Label>
                          <Input
                            type="date"
                            value={edu.startDate}
                            onChange={(e) => handleUpdateEducation(edu.id, "startDate", e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs mb-1 block">End Date</Label>
                          <Input
                            type="date"
                            value={edu.endDate}
                            onChange={(e) => handleUpdateEducation(edu.id, "endDate", e.target.value)}
                            className="text-sm"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEducation(edu.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-3 border-t border-border pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Experience
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddExperience}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-3">
                  {profileData.experience.map((exp) => (
                    <div key={exp.id} className="p-3 border border-border rounded-lg space-y-2 bg-muted/30">
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Job Title"
                          value={exp.title}
                          onChange={(e) => handleUpdateExperience(exp.id, "title", e.target.value)}
                          className="text-sm"
                        />
                        <Input
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) => handleUpdateExperience(exp.id, "company", e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <Input
                        placeholder="Summary"
                        value={exp.summary}
                        onChange={(e) => handleUpdateExperience(exp.id, "summary", e.target.value)}
                        className="text-sm"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Location"
                          value={exp.location}
                          onChange={(e) => handleUpdateExperience(exp.id, "location", e.target.value)}
                          className="text-sm"
                        />
                        <Input
                          placeholder="Key Skills (comma separated)"
                          value={exp.keySkills}
                          onChange={(e) => handleUpdateExperience(exp.id, "keySkills", e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs mb-1 block">Start Date</Label>
                          <Input
                            type="date"
                            value={exp.startDate}
                            onChange={(e) => handleUpdateExperience(exp.id, "startDate", e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs mb-1 block">End Date</Label>
                          <Input
                            type="date"
                            value={exp.endDate}
                            onChange={(e) => handleUpdateExperience(exp.id, "endDate", e.target.value)}
                            className="text-sm"
                          />
                        </div>
                      </div>
                      <Textarea
                        placeholder="Description / achievements"
                        value={exp.description}
                        onChange={(e) => handleUpdateExperience(exp.id, "description", e.target.value)}
                        className="text-sm min-h-20 resize-none"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveExperience(exp.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-3 border-t border-border pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold flex items-center gap-2">
                    <Code className="w-5 h-5 text-primary" />
                    Skills
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSkill}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {profileData.skills.map((skill) => (
                    <div key={skill.id} className="p-3 border border-border rounded-lg space-y-2 bg-muted/30">
                      <div className="flex gap-2 items-start">
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder="Skill name"
                            value={skill.name}
                            onChange={(e) => handleUpdateSkill(skill.id, "name", e.target.value)}
                            className="text-sm"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <select
                              value={skill.aptitude}
                              onChange={(e) => handleUpdateSkill(skill.id, "aptitude", e.target.value)}
                              className="text-sm rounded-md border border-input bg-background px-3 py-2"
                            >
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                            </select>
                            <div></div>
                          </div>
                          <Input
                            placeholder="Skill summary"
                            value={skill.summary}
                            onChange={(e) => handleUpdateSkill(skill.id, "summary", e.target.value)}
                            className="text-sm"
                          />
                          <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id={`soft-${skill.id}`}
                                name={`skillType-${skill.id}`}
                                value="soft"
                                checked={skill.skillType === "soft"}
                                onChange={() => handleUpdateSkill(skill.id, "skillType", "soft")}
                                className="w-4 h-4"
                              />
                              <Label htmlFor={`soft-${skill.id}`} className="text-xs cursor-pointer">Soft Skill</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id={`hard-${skill.id}`}
                                name={`skillType-${skill.id}`}
                                value="hard"
                                checked={skill.skillType === "hard"}
                                onChange={() => handleUpdateSkill(skill.id, "skillType", "hard")}
                                className="w-4 h-4"
                              />
                              <Label htmlFor={`hard-${skill.id}`} className="text-xs cursor-pointer">Hard Skill</Label>
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSkill(skill.id)}
                          className="text-destructive hover:text-destructive flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="space-y-3 border-t border-border pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Certifications
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddCertification}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-3">
                  {profileData.certifications.map((cert) => (
                    <div key={cert.id} className="p-3 border border-border rounded-lg space-y-2 bg-muted/30">
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Certification Title"
                          value={cert.title}
                          onChange={(e) => handleUpdateCertification(cert.id, "title", e.target.value)}
                          className="text-sm"
                        />
                        <Input
                          placeholder="Institute / Issuer"
                          value={cert.institute}
                          onChange={(e) => handleUpdateCertification(cert.id, "institute", e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <Input
                        placeholder="Certification Summary"
                        value={cert.summary}
                        onChange={(e) => handleUpdateCertification(cert.id, "summary", e.target.value)}
                        className="text-sm"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs mb-1 block">Issue Date</Label>
                          <Input
                            type="date"
                            value={cert.issueDate}
                            onChange={(e) => handleUpdateCertification(cert.id, "issueDate", e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs mb-1 block">Expiry Date</Label>
                          <Input
                            type="date"
                            value={cert.expiryDate}
                            onChange={(e) => handleUpdateCertification(cert.id, "expiryDate", e.target.value)}
                            className="text-sm"
                          />
                        </div>
                      </div>
                      <Input
                        placeholder="Skills (comma separated)"
                        value={cert.skills}
                        onChange={(e) => handleUpdateCertification(cert.id, "skills", e.target.value)}
                        className="text-sm"
                      />
                      <Input
                        placeholder="Credential Link / URL"
                        value={cert.link}
                        onChange={(e) => handleUpdateCertification(cert.id, "link", e.target.value)}
                        className="text-sm"
                      />
                      <Textarea
                        placeholder="Certification description"
                        value={cert.description}
                        onChange={(e) => handleUpdateCertification(cert.id, "description", e.target.value)}
                        className="text-sm min-h-16 resize-none"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCertification(cert.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 border-t border-border pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  size="lg"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          <p className="text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
            <button className="text-primary hover:underline">Terms of Service</button>
            {" "}and{" "}
            <button className="text-primary hover:underline">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
}
