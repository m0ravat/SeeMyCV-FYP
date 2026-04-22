import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

    // Fetch user by username
    const userResult = await query(
      'SELECT user_id FROM "user" WHERE username = $1',
      [username]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userId = userResult.rows[0].user_id;

    // Fetch user profile
    const profileResult = await query(
      'SELECT * FROM profile WHERE user_id = $1',
      [userId]
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
          userId: userId,
          username: username,
        },
        profile: {
          firstName: profile.first_name,
          lastName: profile.last_name,
          email: profile.email,
          phone: profile.phone_number,
          location: profile.person_location,
          linkedinUrl: profile.linkedin_url,
          personalWebsite: profile.personal_website,
          aboutMe: cv?.about_me || '',
        },
        cv: {
          experiences: experienceResult.rows.map(exp => ({
            id: exp.experience_id,
            title: exp.title,
            company: exp.summary,
            location: exp.location,
            startDate: exp.start_date,
            endDate: exp.end_date,
            description: exp.description,
            current: !exp.end_date,
          })),
          education: educationResult.rows.map(edu => ({
            id: edu.education_id,
            institution: edu.institute_name,
            degree: edu.degree || '',
            location: edu.location,
            startDate: edu.start_date,
            endDate: edu.end_date,
            target: edu.target,
            achieved: edu.achieved,
            gradeDescription: edu.grade_description,
          })),
          projects: projectResult.rows.map(proj => ({
            id: proj.project_id,
            name: proj.title,
            description: proj.description,
            technologies: proj.skills ? proj.skills.split(',').map((s: string) => s.trim()) : [],
            url: proj.link,
            startDate: proj.start_date,
            endDate: proj.end_date,
          })),
          certifications: certResult.rows.map(cert => ({
            id: cert.certification_id,
            name: cert.title,
            issuer: cert.institute,
            date: cert.issue_date,
            url: cert.link,
          })),
          skills: skillResult.rows.map(skill => ({
            name: skill.name,
            level: skill.skill_level,
            isSoftSkill: skill.is_soft_skill,
            description: skill.description,
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
