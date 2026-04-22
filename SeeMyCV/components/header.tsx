"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogout } from "@/lib/use-logout";
import { useUser } from "@/lib/use-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Home,
  FileText,
  Bell,
  Crown,
  Menu,
  X,
  User,
  Settings,
  LogOut,
} from "lucide-react";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isPremium?: boolean;
}

export function Header({ currentPage, onNavigate, isPremium = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { logout } = useLogout();
  const { userData, loading } = useUser();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    router.push(`/profile/${trimmed}`);
    setSearchQuery("");
  };

  const navItems: Array<{ id: string; label: string; icon: typeof Home; href: string | null; badge?: number }> = [
    { id: "feed", label: "Feed", icon: Home, href: null },
    { id: "my-cvs", label: "My CVs", icon: FileText, href: null },
    {id: "blog", label: "Blogs", icon: Home, href: null}
  ];

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate("feed")}
              className="flex items-center gap-2 text-primary font-bold text-xl"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="hidden sm:block">CVConnect</span>
            </button>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 lg:w-80 bg-secondary border-border"
              />
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) =>
              item.href ? (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors relative ${
                    currentPage === item.id
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                  {item.badge && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors relative ${
                    currentPage === item.id
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                  {item.badge && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              )
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Premium Badge / Upgrade Button */}
            {isPremium ? (
              <Badge className="bg-premium text-premium-foreground gap-1 hidden sm:flex">
                <Crown className="w-3 h-3" />
                Premium
              </Badge>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("premium")}
                className="hidden sm:flex gap-1 border-premium text-premium hover:bg-premium hover:text-premium-foreground"
              >
                <Crown className="w-4 h-4" />
                Upgrade
              </Button>
            )}


            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="font-medium">{userData?.profile.firstName} {userData?.profile.lastName}</p>
                  <p className="text-sm text-muted-foreground">{userData?.profile.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    View Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={logout}
                  className="text-destructive cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full bg-secondary"
            />
          </form>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-1">
              {navItems.map((item) =>
                item.href ? (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      currentPage === item.id
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge className="ml-auto bg-destructive text-destructive-foreground">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      currentPage === item.id
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge className="ml-auto bg-destructive text-destructive-foreground">
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                )
              )}
              {!isPremium && (
                <button
                  onClick={() => {
                    onNavigate("premium");
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-premium hover:bg-premium/10 transition-colors"
                >
                  <Crown className="w-5 h-5" />
                  <span>Upgrade to Premium</span>
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
