"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, EyeOff, Shield, Lock, AlertCircle } from "lucide-react";

const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const STORAGE_KEY = "adminLoginAttempts";

interface LoginAttempt {
  timestamp: number;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // Check rate limit on component mount
  useEffect(() => {
    checkRateLimit();
  }, []);

  // Update remaining time every second when rate limited
  useEffect(() => {
    if (!isRateLimited) return;

    const interval = setInterval(() => {
      checkRateLimit();
    }, 1000);

    return () => clearInterval(interval);
  }, [isRateLimited]);

  const getAttempts = (): LoginAttempt[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveAttempts = (attempts: LoginAttempt[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
  };

  const cleanOldAttempts = (attempts: LoginAttempt[]): LoginAttempt[] => {
    const now = Date.now();
    return attempts.filter(
      (attempt) => now - attempt.timestamp < RATE_LIMIT_WINDOW
    );
  };

  const checkRateLimit = () => {
    const attempts = cleanOldAttempts(getAttempts());
    saveAttempts(attempts);

    if (attempts.length >= MAX_ATTEMPTS) {
      const oldestAttempt = attempts[0];
      const timeUntilReset = RATE_LIMIT_WINDOW - (Date.now() - oldestAttempt.timestamp);
      const minutesRemaining = Math.ceil(timeUntilReset / 1000 / 60);

      setIsRateLimited(true);
      setRemainingTime(minutesRemaining);
      setError(
        `Too many login attempts. Please try again in ${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''}.`
      );
    } else {
      setIsRateLimited(false);
      setRemainingTime(0);
    }
  };

  const recordAttempt = () => {
    const attempts = cleanOldAttempts(getAttempts());
    attempts.push({ timestamp: Date.now() });
    saveAttempts(attempts);

    if (attempts.length >= MAX_ATTEMPTS) {
      checkRateLimit();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isRateLimited) {
      setError(
        `Too many login attempts. Please try again in ${remainingTime} minute${remainingTime !== 1 ? 's' : ''}.`
      );
      return;
    }

    recordAttempt();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem("adminLoggedIn", "true");
        router.push("/secret/admin/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials. Please try again.");
        setPassword("");
        checkRateLimit();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setIsLoading(false);
  };

  const attemptsLeft = MAX_ATTEMPTS - cleanOldAttempts(getAttempts()).length;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>Secret admin portal for blog management</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading || isRateLimited}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  disabled={isLoading || isRateLimited}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isLoading || isRateLimited}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!isRateLimited && attemptsLeft > 0 && attemptsLeft <= 2 && (
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 text-xs">
                {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining before 1 hour lockout
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !username || !password || isRateLimited}
            >
              {isLoading ? "Logging in..." : isRateLimited ? "Rate Limited" : "Access Dashboard"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
