import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;

    // Fetch user by username
    const userResult = await query(
      `SELECT u.user_id, u.username, p.profile_id
       FROM "user" u
       JOIN profile p ON u.user_id = p.user_id
       WHERE u.username = $1`,
      [username]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userRecord = userResult.rows[0];
    const userId = userRecord.user_id;
    const profileId = userRecord.profile_id;

    // Fetch user profile
    const profileResult = await query(
      `SELECT * FROM profile WHERE profile_id = $1`,
      [profileId]
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
      [profileId]
    );

    const cv = cvResult.rows[0] || null;

    if (!cv) {
      return NextResponse.json(
        {
          profile: {
            firstName: profile.first_name,
            lastName: profile.last_name,
            email: profile.email,
            phone: profile.phone_number,
            location: profile.person_location,
            linkedinUrl: profile.linkedin_url,
            personalWebsite: profile.personal_website,
            aboutMe: '',
          },
          cv: {
            cvId: null,
            experiences: [],
            education: [],
            projects: [],
            certifications: [],
            skills: [],
          },
        },
        { status: 200 }
      );
    }

    // Fetch experiences
    const experienceResult = await query(
      `SELECT * FROM experience 
       WHERE cv_id = $1 
       ORDER BY start_date DESC`,
      [cv.cv_id]
    );

    // Fetch education
    const educationResult = await query(
      `SELECT * FROM education 
       WHERE cv_id = $1 
       ORDER BY start_date DESC`,
      [cv.cv_id]
    );

    // Fetch projects
    const projectResult = await query(
      `SELECT * FROM project 
       WHERE cv_id = $1 
       ORDER BY start_date DESC`,
      [cv.cv_id]
    );

    // Fetch certifications
    const certResult = await query(
      `SELECT * FROM certification 
       WHERE cv_id = $1 
       ORDER BY issue_date DESC`,
      [cv.cv_id]
    );

    // Fetch skills
    const skillResult = await query(
      `SELECT * FROM skill 
       WHERE cv_id = $1 
       ORDER BY name`,
      [cv.cv_id]
    );

    return NextResponse.json(
      {
        profile: {
          firstName: profile.first_name,
          lastName: profile.last_name,
          email: profile.email,
          phone: profile.phone_number,
          location: profile.person_location,
          linkedinUrl: profile.linkedin_url,
          personalWebsite: profile.personal_website,
          aboutMe: cv.about_me || '',
        },
        cv: {
          cvId: cv.cv_id,
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
    console.error('[v0] Error fetching public profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
