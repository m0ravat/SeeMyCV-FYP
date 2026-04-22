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
      'SELECT id FROM "user" WHERE username = $1 OR email = $2',
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
        `INSERT INTO "user" (username, email, password, "isPremium", created_at, updated_at)
         VALUES ($1, $2, $3, false, NOW(), NOW())
         RETURNING id`,
        [username, email, hashedPassword]
      );

      const userId = userResult.rows[0].id;

      // Insert profile
      await client.query(
        `INSERT INTO profile (user_id, name, email, phone_number, personal_website, location_url, created_at, updated_at)
         VALUES ($1, $2, $3, NULL, NULL, NULL, NOW(), NOW())`,
        [userId, `${firstName} ${lastName}`, email]
      );

      return userId;
    });

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
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
