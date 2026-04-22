import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { createSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find user by username with email joined from profile
    const result = await query(
      `SELECT u.user_id, u.username, u.password, u."isPremium", p.email
       FROM "user" u
       LEFT JOIN profile p ON u.user_id = p.user_id
       WHERE u.username = $1`,
      [username]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Create session with HTTP-only cookie
    await createSession(user.user_id, user.username, user.email, user.isPremium);

    return NextResponse.json(
      {
        success: true,
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          isPremium: user.isPremium,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
