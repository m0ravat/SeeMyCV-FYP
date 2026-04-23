"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { PublicFeed } from "@/components/public-feed";
import { ProfilePage } from "@/components/profile-page";
import { CVBuilder } from "@/components/cv-builder";
import { PremiumPage } from "@/components/premium-page";
import { SettingsPage } from "@/components/settings-page";
import { useUser } from "@/lib/use-user";

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState("feed");
  const { userData, loading } = useUser();

  // Use premium status from fetched user data
  const isPremium = userData?.user.isPremium || false;

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleUpgrade = () => {
    setCurrentPage("premium");
  };

  const handleSubscribe = () => {
    // Premium status is now managed by backend
    setCurrentPage("feed");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "feed":
        return <PublicFeed />;
      case "profile":
        return <ProfilePage />;
      case "my-cvs":
        return <CVBuilder isPremium={isPremium} onUpgrade={handleUpgrade} />;
      case "premium":
        return <PremiumPage onSubscribe={handleSubscribe} isPremium={isPremium} />;
      case "settings":
        return <SettingsPage isPremium={isPremium} onUpgrade={handleUpgrade} />;
      default:
        return <PublicFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isPremium={isPremium}
      />
      <main>{renderPage()}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">SeeMyCV</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-foreground transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-foreground transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/blog" className="hover:text-foreground transition-colors">
                    Career Guides
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-foreground transition-colors">
                    CV Tips
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate("my-cvs")}
                    className="hover:text-foreground transition-colors"
                  >
                    CV Templates
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() => handleNavigate("settings")}
                    className="hover:text-foreground transition-colors"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate("settings")}
                    className="hover:text-foreground transition-colors"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button className="hover:text-foreground transition-colors">
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button className="hover:text-foreground transition-colors">
                    Cookie Policy
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>
              2026 SeeMyCV. All rights reserved. Built with privacy in mind -
              no profile pictures to prevent discrimination.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
