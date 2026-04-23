import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { createSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// Type definitions for better type safety
interface LoginRequest {
  username: string;
  password: string;
}

interface UserRecord {
  user_id: number;
  username: string;
  password: string;
  isPremium: boolean;
  email: string;
}

interface LoginResponse {
  success: boolean;
  user?: {
    user_id: number;
    username: string;
    email: string;
    isPremium: boolean;
  };
  error?: string;
}

// Constants
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 128;
const INVALID_CREDENTIALS_MESSAGE = 'Invalid username or password';
const INTERNAL_ERROR_MESSAGE = 'Internal server error';

export async function POST(req: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    // Validate request method (redundant but good practice)
    if (req.method !== 'POST') {
      return NextResponse.json(
        { success: false, error: 'Method not allowed' },
        { status: 405 }
      );
    }

    // Parse and validate request body
    let body: LoginRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { username, password } = body;

    // Validate required fields
    if (!username || typeof username !== 'string' || username.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Username is required' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    // Validate password length to prevent timing attacks and unreasonable inputs
    if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
      return NextResponse.json(
        { success: false, error: INVALID_CREDENTIALS_MESSAGE },
        { status: 401 }
      );
    }

    // Sanitize username (basic protection)
    const sanitizedUsername = username.trim().toLowerCase();

    // Query user by username with profile email
    let result;
    try {
      result = await query(
        `SELECT u.user_id, u.username, u.password, u."isPremium", p.email
         FROM "user" u
         LEFT JOIN profile p ON u.user_id = p.user_id
         WHERE LOWER(u.username) = $1
         LIMIT 1`,
        [sanitizedUsername]
      );
    } catch (error) {
      console.error('Database query error:', error);
      return NextResponse.json(
        { success: false, error: INTERNAL_ERROR_MESSAGE },
        { status: 500 }
      );
    }

    // Check if user exists (use generic message for security)
    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: INVALID_CREDENTIALS_MESSAGE },
        { status: 401 }
      );
    }

    const user: UserRecord = result.rows[0];

    // Validate stored password hash exists
    if (!user.password) {
      console.error(`User ${user.user_id} has no password hash`);
      return NextResponse.json(
        { success: false, error: INVALID_CREDENTIALS_MESSAGE },
        { status: 401 }
      );
    }

    // Compare passwords using bcrypt
    let isPasswordValid = false;
    try {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } catch (error) {
      console.error('Bcrypt comparison error:', error);
      return NextResponse.json(
        { success: false, error: INTERNAL_ERROR_MESSAGE },
        { status: 500 }
      );
    }

    // Invalid password (use generic message for security)
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: INVALID_CREDENTIALS_MESSAGE },
        { status: 401 }
      );
    }

    // Create session
    try {
      await createSession(user.user_id, user.username, user.email, user.isPremium);
    } catch (error) {
      console.error('Session creation error:', error);
      return NextResponse.json(
        { success: false, error: INTERNAL_ERROR_MESSAGE },
        { status: 500 }
      );
    }

    // Successful login response
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
    // Catch-all for unexpected errors
    console.error('Unexpected login error:', error);
    return NextResponse.json(
      { success: false, error: INTERNAL_ERROR_MESSAGE },
      { status: 500 }
    );
  }
}
