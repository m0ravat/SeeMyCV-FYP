import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    const { username, password, profileData } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
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
    const userResult = await client.query(
      'SELECT user_id FROM "user" WHERE username = $1',
      [username]
    );

    if (userResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Start transaction
    await client.query('BEGIN');

    try {
      // Create user
      const createUserResult = await client.query(
        'INSERT INTO "user" (username, password) VALUES ($1, $2) RETURNING user_id',
        [username, hashedPassword]
      );

      const userId = createUserResult.rows[0].user_id;

      // Create profile
      const createProfileResult = await client.query(
        `INSERT INTO profile (user_id, first_name, last_name, email, phone_number, personal_website, linkedin_url, person_location)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING profile_id`,
        [
          userId,
          profileData?.firstName || null,
          profileData?.lastName || null,
          profileData?.email || null,
          profileData?.phoneNumber || null,
          profileData?.personalWebsite || null,
          profileData?.linkedInUrl || null,
          profileData?.location || null,
        ]
      );

      const profileId = createProfileResult.rows[0].profile_id;

      // Create initial CV if about_me is provided
      if (profileData?.aboutMe) {
        await client.query(
          'INSERT INTO cv (profile_id, about_me) VALUES ($1, $2)',
          [profileId, profileData.aboutMe]
        );
      }

      await client.query('COMMIT');

      return NextResponse.json(
        {
          message: 'User created successfully',
          userId,
          username,
          profileId,
        },
        { status: 201 }
      );
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
