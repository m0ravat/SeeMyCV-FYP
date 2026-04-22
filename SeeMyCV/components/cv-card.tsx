"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Briefcase,
  MapPin,
  ExternalLink,
  Clock,
  MessageCircle,
  Lock,
  Globe,
} from "lucide-react";

export interface CVData {
  id: string;
  name: string;
  title: string;
  industry: string;
  experienceLevel: string;
  company?: string;
  location: string;
  skills: string[];
  summary: string;
  upvotes: number;
  comments: number;
  postedAt: string;
  openForFeedback: boolean;
  privacyStatus: "open" | "select" | "unavailable" | "private";
}

interface CVCardProps {
  cv: CVData;
  onView?: (id: string) => void;
}

const privacyIcons = {
  open: Globe,
  select: MessageCircle,
  unavailable: Clock,
  private: Lock,
};

const privacyLabels = {
  open: "Open to messages",
  select: "Select platforms",
  unavailable: "Temporarily unavailable",
  private: "Private",
};

const experienceLevelColors: Record<string, string> = {
  "Entry Level": "bg-accent text-accent-foreground",
  "Mid Level": "bg-primary text-primary-foreground",
  "Senior": "bg-primary text-primary-foreground",
  "Executive": "bg-premium text-premium-foreground",
};

export function CVCard({ cv, onView }: CVCardProps) {
  const PrivacyIcon = privacyIcons[cv.privacyStatus];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {/* Avatar placeholder - using initials instead of photo */}
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
              <span className="text-primary font-semibold text-lg">
                {cv.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate">{cv.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{cv.title}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                {cv.company && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    {cv.company}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {cv.location}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={experienceLevelColors[cv.experienceLevel] || "bg-secondary text-secondary-foreground"}>
              {cv.experienceLevel}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground" title={privacyLabels[cv.privacyStatus]}>
              <PrivacyIcon className="w-3 h-3" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{cv.summary}</p>
        {cv.openForFeedback && (
          <div className="mt-3">
            <Badge className="bg-success text-success-foreground text-xs">
              Open for Feedback
            </Badge>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{cv.postedAt}</span>
          <Button size="sm" variant="outline" onClick={() => onView?.(cv.id)}>
            <ExternalLink className="w-4 h-4 mr-1" />
            View CV
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
