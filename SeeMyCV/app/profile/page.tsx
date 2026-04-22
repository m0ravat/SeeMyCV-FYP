"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserCVProfile } from "@/components/user-cv-profile";

export default function ProfileRoute() {
  return <UserCVProfile isOwnProfile={true} />;
