import bcrypt from 'bcryptjs';
import { query, withTransaction } from '@/lib/db';
import { createSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const {
      username,
      password,
      firstName,
      lastName,
      email,
      phoneNumber,
      location,
      linkedInUrl,
      personalWebsite,
      isProfilePublic,
      isContactDetailsPublic,
      aboutMe,
      experience,
      skills,
      education,
      projects,
      certifications,
      isPremiumPlan,
    } = await req.json();

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

    // Check if username already exists
    const userExists = await query(
      'SELECT user_id FROM "user" WHERE username = $1',
      [username]
    );

    if (userExists.rows.length > 0) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Check if email already exists in profile
    const emailExists = await query(
      'SELECT profile_id FROM profile WHERE email = $1',
      [email]
    );

    if (emailExists.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user, profile, and all associated data in a transaction
    const result = await withTransaction(async (client) => {
      // 1. Insert user
      const userResult = await client.query(
        `INSERT INTO "user" (username, password, "isPremium")
         VALUES ($1, $2, $3)
         RETURNING user_id`,
        [username, hashedPassword, isPremiumPlan || false]
      );

      const userId = userResult.rows[0].user_id;

      // 2. Insert profile
      const profileResult = await client.query(
        `INSERT INTO profile (user_id, first_name, last_name, email, phone_number, person_location, linkedin_url, personal_website)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING profile_id`,
        [userId, firstName, lastName, email, phoneNumber || null, location || null, linkedInUrl || null, personalWebsite || null]
      );

      const profileId = profileResult.rows[0].profile_id;

      // 3. Insert CV (about_me goes into CV table)
      const cvResult = await client.query(
        `INSERT INTO cv (profile_id, about_me)
         VALUES ($1, $2)
         RETURNING cv_id`,
        [profileId, aboutMe || null]
      );

      const cvId = cvResult.rows[0].cv_id;

      // 4. Insert experiences
      if (experience && Array.isArray(experience) && experience.length > 0) {
        for (const exp of experience) {
          if (exp.title || exp.company) { // Only insert if has data
            await client.query(
              `INSERT INTO experience (cv_id, title, summary, description, key_skills, location, start_date, end_date)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
              [
                cvId,
                exp.title || null,
                exp.summary || null,
                exp.description || null,
                exp.keySkills || null,
                exp.location || null,
                exp.startDate || null,
                exp.endDate || null,
              ]
            );
          }
        }
      }

      // 5. Insert education
      if (education && Array.isArray(education) && education.length > 0) {
        for (const edu of education) {
          if (edu.instituteName) { // Only insert if has data
            await client.query(
              `INSERT INTO education (cv_id, institute_name, achieved, target, grade_description, location, start_date, end_date)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
              [
                cvId,
                edu.instituteName || null,
                edu.gradeAchieved || null,
                edu.gradeTarget || null,
                edu.description || null,
                edu.location || null,
                edu.startDate || null,
                edu.endDate || null,
              ]
            );
          }
        }
      }

      // 6. Insert projects
      if (projects && Array.isArray(projects) && projects.length > 0) {
        for (const proj of projects) {
          if (proj.title) { // Only insert if has data
            await client.query(
              `INSERT INTO project (cv_id, title, summary, description, skills, link, start_date, end_date)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
              [
                cvId,
                proj.title || null,
                proj.summary || null,
                proj.description || null,
                proj.skills || null,
                proj.link || null,
                proj.startDate || null,
                proj.endDate || null,
              ]
            );
          }
        }
      }

      // 7. Insert certifications
      if (certifications && Array.isArray(certifications) && certifications.length > 0) {
        for (const cert of certifications) {
          if (cert.title) { // Only insert if has data
            await client.query(
              `INSERT INTO certification (cv_id, title, summary, description, skills, institute, link, issue_date, expiry_date)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
              [
                cvId,
                cert.title || null,
                cert.summary || null,
                cert.description || null,
                cert.skills || null,
                cert.institute || null,
                cert.link || null,
                cert.issueDate || null,
                cert.expiryDate || null,
              ]
            );
          }
        }
      }

      // 8. Insert skills
      if (skills && Array.isArray(skills) && skills.length > 0) {
        for (const skill of skills) {
          if (skill.name) { // Only insert if has data
            // Map skillType to is_soft_skill boolean
            const isSoftSkill = skill.skillType === 'soft' ? true : skill.skillType === 'hard' ? false : null;

            await client.query(
              `INSERT INTO skill (cv_id, name, description, skill_level, is_soft_skill)
               VALUES ($1, $2, $3, $4, $5)`,
              [
                cvId,
                skill.name || null,
                skill.description || null,
                skill.aptitude || null, // beginner, intermediate, advanced
                isSoftSkill,
              ]
            );
          }
        }
      }

      return { userId, profileId, cvId };
    });

    // Create session with HTTP-only cookie
    await createSession(result.userId, username, email, isPremiumPlan || false);

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        ...result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Signup error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage.includes('duplicate key') ? 'User ID conflict - please try again' : 'Internal server error' },
      { status: 500 }
    );
  }
}
