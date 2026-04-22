import { verifySession } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { firstName, lastName, email, phone, location, linkedinUrl, personalWebsite, aboutMe } = await request.json();

    // Update profile table
    await query(
      `UPDATE profile
       SET first_name = $1, last_name = $2, email = $3, phone_number = $4,
           person_location = $5, linkedin_url = $6, personal_website = $7
       WHERE user_id = $8`,
      [firstName, lastName, email || null, phone || null, location || null, linkedinUrl || null, personalWebsite || null, session.userId]
    );

    // Update about_me in cv table
    if (aboutMe !== undefined) {
      await query(
        `UPDATE cv SET about_me = $1
         WHERE profile_id = (SELECT profile_id FROM profile WHERE user_id = $2)`,
        [aboutMe, session.userId]
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[v0] Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Get session from middleware
    const session = await verifySession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Fetch user profile and CV data
    const profileResult = await query(
      `SELECT p.*, u."isPremium"
       FROM profile p
       LEFT JOIN "user" u ON p.user_id = u.user_id
       WHERE p.user_id = $1`,
      [session.userId]
    );

    if (profileResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    const profile = profileResult.rows[0];

    // Fetch CV
    const cvResult = await query(
      'SELECT cv_id, about_me FROM cv WHERE profile_id = $1 LIMIT 1',
      [profile.profile_id]
    );

    const cv = cvResult.rows[0] || null;

    // Fetch experiences
    const experienceResult = await query(
      `SELECT * FROM experience 
       WHERE cv_id = $1 
       ORDER BY start_date DESC`,
      [cv?.cv_id || 0]
    );

    // Fetch education
    const educationResult = await query(
      `SELECT * FROM education 
       WHERE cv_id = $1 
       ORDER BY start_date DESC`,
      [cv?.cv_id || 0]
    );

    // Fetch projects
    const projectResult = await query(
      `SELECT * FROM project 
       WHERE cv_id = $1 
       ORDER BY start_date DESC`,
      [cv?.cv_id || 0]
    );

    // Fetch certifications
    const certResult = await query(
      `SELECT * FROM certification 
       WHERE cv_id = $1 
       ORDER BY issue_date DESC`,
      [cv?.cv_id || 0]
    );

    // Fetch skills
    const skillResult = await query(
      `SELECT * FROM skill 
       WHERE cv_id = $1 
       ORDER BY name`,
      [cv?.cv_id || 0]
    );

    return NextResponse.json(
      {
        user: {
          userId: session.userId,
          username: session.username,
          email: session.email,
          isPremium: profile.isPremium,
        },
        profile: {
          firstName: profile.first_name,
          lastName: profile.last_name,
          email: profile.email,
          phone: profile.phone_number,
          location: profile.person_location,
          linkedinUrl: profile.linkedin_url,
          personalWebsite: profile.personal_website,
          contactPublic: profile.contactPublic,
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
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
