import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json(
    { message: "Logged out successfully." },
    { status: 200 }
  );
  response.cookies.set(clearAuthCookie());
  return response;
}
