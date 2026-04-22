import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    // Find user by username (case-insensitive)
    const userResult = await query(
      `SELECT u.user_id, u.username
       FROM "user" u
       WHERE LOWER(u.username) = LOWER($1)`,
      [username]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userResult.rows[0];

    // Fetch profile
    const profileResult = await query(
      `SELECT p.* FROM profile p WHERE p.user_id = $1`,
      [user.user_id]
    );

    if (profileResult.rows.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const profile = profileResult.rows[0];

    // Block access if account is private
    if (profile.is_searchable === false) {
      return NextResponse.json({ error: 'private' }, { status: 403 });
    }

    // Fetch CV
    const cvResult = await query(
      'SELECT cv_id, about_me FROM cv WHERE profile_id = $1 LIMIT 1',
      [profile.profile_id]
    );

    const cv = cvResult.rows[0] || null;
    const cvId = cv?.cv_id || 0;

    // Fetch all CV sections in parallel
    const [experienceResult, educationResult, projectResult, certResult, skillResult] =
      await Promise.all([
        query(`SELECT * FROM experience WHERE cv_id = $1 ORDER BY start_date DESC`, [cvId]),
        query(`SELECT * FROM education WHERE cv_id = $1 ORDER BY start_date DESC`, [cvId]),
        query(`SELECT * FROM project WHERE cv_id = $1 ORDER BY start_date DESC`, [cvId]),
        query(`SELECT * FROM certification WHERE cv_id = $1 ORDER BY issue_date DESC`, [cvId]),
        query(`SELECT * FROM skill WHERE cv_id = $1 ORDER BY name`, [cvId]),
      ]);

    return NextResponse.json({
      profile: {
        firstName: profile.first_name,
        lastName: profile.last_name,
        email: profile.email,
        phone: profile.phone_number,
        location: profile.person_location,
        linkedinUrl: profile.linkedin_url,
        personalWebsite: profile.personal_website,
        contactPublic: profile.contact_public,
        aboutMe: cv?.about_me || '',
      },
      cv: {
        cvId: cv?.cv_id,
        experiences: experienceResult.rows || [],
        education: educationResult.rows || [],
        projects: projectResult.rows || [],
        certifications: certResult.rows || [],
        skills: skillResult.rows || [],
      },
    });
  } catch (error) {
    console.error('[v0] Error fetching public profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
