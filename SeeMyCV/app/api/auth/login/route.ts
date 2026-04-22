import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcrypt';
import { createToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const userResult = await client.query(
      'SELECT user_id, username, password, "isPremium" FROM "user" WHERE username = $1',
      [username]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];

    // Verify password
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Update last login
    await client.query(
      'UPDATE "user" SET last_login = NOW() WHERE user_id = $1',
      [user.user_id]
    );

    // Create JWT token
    const token = await createToken({
      userId: user.user_id,
      username: user.username,
    });

    // Set token in HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json(
      {
        message: 'Login successful',
        userId: user.user_id,
        username: user.username,
        isPremium: user.isPremium,
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
