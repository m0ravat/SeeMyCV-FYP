import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existing = await pool.query(
      'SELECT user_id FROM public."user" WHERE username = $1',
      [username]
    );

    if ((existing.rowCount ?? 0) > 0) {
      return NextResponse.json(
        { error: "Username is already taken." },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const result = await pool.query(
      'INSERT INTO public."user" (username, password) VALUES ($1, $2) RETURNING user_id, username',
      [username, hashedPassword]
    );

    const user = result.rows[0];

    // Create an empty profile for the user
    await pool.query(
      "INSERT INTO public.profile (user_id) VALUES ($1)",
      [user.user_id]
    );

    const token = signToken({ userId: user.user_id, username: user.username });
    const cookieOptions = setAuthCookie(token);

    const response = NextResponse.json(
      { message: "Account created successfully.", userId: user.user_id },
      { status: 201 }
    );
    response.cookies.set(cookieOptions);
    return response;
  } catch (error) {
    console.error("[signup] Error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
