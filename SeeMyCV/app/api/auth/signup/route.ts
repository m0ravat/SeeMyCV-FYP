import bcrypt from 'bcryptjs';
import { query, withTransaction } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { username, password, firstName, lastName, email } = await req.json();

    // Validation
    if (!username || !password || !firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const userExists = await query(
      'SELECT user_id FROM "user" WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (userExists.rows.length > 0) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user and profile in a transaction
    const result = await withTransaction(async (client) => {
      // Insert user
      const userResult = await client.query(
        `INSERT INTO "user" (username, email, password, "isPremium", created_at)
         VALUES ($1, $2, $3, false, NOW())
         RETURNING user_id`,
        [username, email, hashedPassword]
      );

      const userId = userResult.rows[0].user_id;

      // Insert profile
      await client.query(
        `INSERT INTO profile (user_id, first_name, last_name, email, phone_number, personal_website, person_location)
         VALUES ($1, $2, $3, $4, NULL, NULL, NULL)`,
        [userId, firstName, lastName, email]
      );

      return userId;
    });

    console.log('[v0] User created successfully:', result);

    // Create session (in production, use secure HTTP-only cookies)
    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        userId: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
