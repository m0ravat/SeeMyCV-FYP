import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { comparePassword, signToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'SELECT user_id, username, password FROM public."user" WHERE username = $1',
      [username]
    );

    if ((result.rowCount ?? 0) === 0) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    const user = result.rows[0];
    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    // Update last_login
    await pool.query(
      'UPDATE public."user" SET last_login = NOW() WHERE user_id = $1',
      [user.user_id]
    );

    const token = signToken({ userId: user.user_id, username: user.username });
    const cookieOptions = setAuthCookie(token);

    const response = NextResponse.json(
      { message: "Logged in successfully.", userId: user.user_id },
      { status: 200 }
    );
    response.cookies.set(cookieOptions);
    return response;
  } catch (error) {
    console.error("[login] Error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
