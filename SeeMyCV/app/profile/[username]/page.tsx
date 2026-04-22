"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserCVProfile } from "@/components/user-cv-profile";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const params = useParams();
  const username = params?.username as string | undefined;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CV</span>
            </div>
            <span className="font-bold text-xl text-foreground">CVConnect</span>
          </Link>
          <div className="w-[140px]" />
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-4">
        <UserCVProfile 
          isOwnProfile={false} 
          username={username}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>CVConnect - Professional CV Sharing Platform</p>
        </div>
      </footer>
    </div>
  );
}
