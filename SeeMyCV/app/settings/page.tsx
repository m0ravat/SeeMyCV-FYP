"use client";

import { Header } from "@/components/header";
import { SettingsPage } from "@/components/settings-page";
import { useState } from "react";
import { useUser } from "@/lib/use-user";

export default function SettingsRoute() {
  const [currentPage, setCurrentPage] = useState("settings");
  const { userData, loading } = useUser();
  
  const isPremium = userData?.user.isPremium || false;

  const handleUpgrade = () => {
    // Handle upgrade logic
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isPremium={isPremium}
      />
      <main>
        <SettingsPage isPremium={isPremium} onUpgrade={handleUpgrade} />
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">CVConnect</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/" className="hover:text-foreground transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <button className="hover:text-foreground transition-colors">
                    About Us
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/blog" className="hover:text-foreground transition-colors">
                    Career Guides
                  </a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-foreground transition-colors">
                    CV Tips
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage("my-cvs")}
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
                  <a href="/settings" className="hover:text-foreground transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="/settings" className="hover:text-foreground transition-colors">
                    Contact Us
                  </a>
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
              2024 CVConnect. All rights reserved. Built with privacy in mind -
              no profile pictures to prevent discrimination.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
