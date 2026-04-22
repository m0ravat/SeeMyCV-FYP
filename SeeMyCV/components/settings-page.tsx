"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Settings,
  User,
  Shield,
  Globe,
  Lock,
  Clock,
  Eye,
  EyeOff,
  Mail,
  Trash2,
  Download,
  Crown,
} from "lucide-react";

interface SettingsPageProps {
  isPremium?: boolean;
  onUpgrade?: () => void;
}

export function SettingsPage({ isPremium = false, onUpgrade }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState("account");
  const router = useRouter();
  
  // Account Settings
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  
  // Privacy Settings
  const [privacyStatus, setPrivacyStatus] = useState("open");
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [showEmail, setShowEmail] = useState(true);
  const [showPersonalLink, setShowPersonalLink] = useState(true);

  const privacyOptions = [
    { value: "open", label: "Open to all messages", icon: Globe, description: "Anyone can send you messages" },
    { value: "unavailable", label: "Temporarily unavailable", icon: Clock, description: "Show that you're not available" },
    { value: "private", label: "Private", icon: Lock, description: "No one can send you messages" },
  ];

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        setPasswordError(error.error || "Failed to change password");
        setIsChangingPassword(false);
        return;
      }

      setPasswordSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);

      // Clear success message after 3 seconds
      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (error) {
      console.error("[v0] Password change error:", error);
      setPasswordError("An error occurred while changing password");
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      alert("Please enter your password to delete your account");
      return;
    }

    setIsDeletingAccount(true);

    try {
      const response = await fetch("/api/user/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to delete account");
        setIsDeletingAccount(false);
        return;
      }

      // Account deleted successfully, redirect to login
      router.push("/login");
    } catch (error) {
      console.error("[v0] Account deletion error:", error);
      alert("An error occurred while deleting account");
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and privacy settings
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="account" className="gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Current Password</Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isChangingPassword}
                />
              </div>
              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isChangingPassword}
                />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isChangingPassword}
                />
              </div>
              {passwordError && (
                <div className="text-destructive text-sm">{passwordError}</div>
              )}
              {passwordSuccess && (
                <div className="text-green-600 text-sm">{passwordSuccess}</div>
              )}
              <Button 
                onClick={handleChangePassword}
                disabled={isChangingPassword}
              >
                {isChangingPassword ? "Changing..." : "Change Password"}
              </Button>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>
                Manage your SeeMyCV subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isPremium ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-premium/10 border border-premium/20">
                    <div className="flex items-center gap-3">
                      <Crown className="w-6 h-6 text-premium" />
                      <div>
                        <p className="font-medium text-foreground">Premium Plan</p>
                        <p className="text-sm text-muted-foreground">
                          Lifetime access — one-time payment
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-premium text-premium-foreground">Active</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">Manage Subscription</Button>
                    <Button variant="outline" className="text-destructive bg-transparent">
                      Cancel Subscription
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                    <div>
                      <p className="font-medium text-foreground">Free Plan</p>
                      <p className="text-sm text-muted-foreground">
                        Upgrade to unlock AI feedback and unlimited CVs
                      </p>
                    </div>
                    <Badge variant="secondary">Current</Badge>
                  </div>
                  <Button
                    className="bg-premium text-premium-foreground hover:bg-premium/90"
                    onClick={onUpgrade}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data & Account */}
          <Card>
            <CardHeader>
              <CardTitle>Data & Account</CardTitle>
              <CardDescription>
                Download your data or delete your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="font-medium text-foreground">Download Your Data</p>
                  <p className="text-sm text-muted-foreground">
                    Get a copy of all your profile and CV data
                  </p>
                </div>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/50 bg-destructive/5">
                <div>
                  <p className="font-medium text-foreground">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove all your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                      <Label>Enter your password to confirm</Label>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        disabled={isDeletingAccount}
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeletingAccount}>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-destructive text-destructive-foreground"
                        onClick={handleDeleteAccount}
                        disabled={isDeletingAccount}
                      >
                        {isDeletingAccount ? "Deleting..." : "Delete Account"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Message Privacy</CardTitle>
              <CardDescription>
                Control who can send you messages on the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {privacyOptions.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                    privacyStatus === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-secondary"
                  }`}
                  onClick={() => setPrivacyStatus(option.value)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      privacyStatus === option.value ? "bg-primary/10" : "bg-secondary"
                    }`}>
                      <option.icon className={`w-5 h-5 ${
                        privacyStatus === option.value ? "text-primary" : "text-muted-foreground"
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ${
                    privacyStatus === option.value
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  }`}>
                    {privacyStatus === option.value && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Visibility</CardTitle>
              <CardDescription>
                Control what information is visible on your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-2 block">Profile Visibility</Label>
                <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Public - Anyone can view
                      </div>
                    </SelectItem>
                    <SelectItem value="users">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Users Only - Logged in users only
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Private - Only you can view
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Email Address</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your email on your profile
                    </p>
                  </div>
                  <Switch checked={showEmail} onCheckedChange={setShowEmail} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Personal Link</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your personal link on your profile
                    </p>
                  </div>
                  <Switch checked={showPersonalLink} onCheckedChange={setShowPersonalLink} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
