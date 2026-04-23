import bcrypt from 'bcryptjs';
import { query, withTransaction } from '@/lib/db';
import { createSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// Type definitions
interface SignupRequest {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  location?: string;
  linkedInUrl?: string;
  personalWebsite?: string;
  isSearchable?: boolean;
  contactPublic?: boolean;
  aboutMe?: string;
  experience?: ExperienceItem[];
  skills?: SkillItem[];
  education?: EducationItem[];
  projects?: ProjectItem[];
  certifications?: CertificationItem[];
  isPremiumPlan?: boolean;
}

interface ExperienceItem {
  title?: string;
  company?: string;
  summary?: string;
  description?: string;
  keySkills?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
}

interface EducationItem {
  instituteName?: string;
  gradeAchieved?: string;
  gradeTarget?: string;
  description?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
}

interface ProjectItem {
  title?: string;
  summary?: string;
  description?: string;
  skills?: string;
  link?: string;
  startDate?: string;
  endDate?: string;
}

interface CertificationItem {
  title?: string;
  summary?: string;
  description?: string;
  skills?: string;
  institute?: string;
  link?: string;
  issueDate?: string;
  expiryDate?: string;
}

interface SkillItem {
  name?: string;
  description?: string;
  skillType?: 'soft' | 'hard';
  aptitude?: 'beginner' | 'intermediate' | 'advanced';
}

interface SignupResponse {
  success?: boolean;
  message?: string;
  userId?: string;
  profileId?: string;
  cvId?: string;
  error?: string;
}

// Constants
const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 50;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;
const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 100;
const BCRYPT_ROUNDS = 12;

// Validation utilities
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  return (
    username.length >= MIN_USERNAME_LENGTH &&
    username.length <= MAX_USERNAME_LENGTH &&
    usernameRegex.test(username)
  );
}

function isValidPassword(password: string): boolean {
  return password.length >= MIN_PASSWORD_LENGTH && password.length <= MAX_PASSWORD_LENGTH;
}

function isValidName(name: string): boolean {
  return name.length >= MIN_NAME_LENGTH && name.length <= MAX_NAME_LENGTH;
}

export async function POST(req: NextRequest): Promise<NextResponse<SignupResponse>> {
  try {
    // Validate request method
    if (req.method !== 'POST') {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

    // Parse request body
    let body: SignupRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

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
      isSearchable = true,
      contactPublic = true,
      aboutMe,
      experience,
      skills,
      education,
      projects,
      certifications,
      isPremiumPlan = false,
    } = body;

    // Validate required fields
    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: 'Username is required and must be a string' },
        { status: 400 }
      );
    }

    if (!isValidUsername(username)) {
      return NextResponse.json(
        {
          error: `Username must be ${MIN_USERNAME_LENGTH}-${MAX_USERNAME_LENGTH} characters and contain only letters, numbers, underscores, and hyphens`,
        },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required and must be a string' },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters` },
        { status: 400 }
      );
    }

    if (!firstName || typeof firstName !== 'string' || !isValidName(firstName)) {
      return NextResponse.json(
        { error: 'First name is required and must be a valid string' },
        { status: 400 }
      );
    }

    if (!lastName || typeof lastName !== 'string' || !isValidName(lastName)) {
      return NextResponse.json(
        { error: 'Last name is required and must be a valid string' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required and must be a string' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Email must be a valid email address' },
        { status: 400 }
      );
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Check if username already exists
    let usernameCheckResult;
    try {
      usernameCheckResult = await query(
        'SELECT user_id FROM "user" WHERE LOWER(username) = $1 LIMIT 1',
        [username.toLowerCase()]
      );
    } catch (error) {
      console.error('Database error checking username:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    if (usernameCheckResult.rows && usernameCheckResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Check if email already exists
    let emailCheckResult;
    try {
      emailCheckResult = await query(
        'SELECT profile_id FROM profile WHERE LOWER(email) = $1 LIMIT 1',
        [normalizedEmail]
      );
    } catch (error) {
      console.error('Database error checking email:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    if (emailCheckResult.rows && emailCheckResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    let hashedPassword: string;
    try {
      hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
    } catch (error) {
      console.error('Bcrypt hashing error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    // Create user, profile, and all associated data in a transaction
    let result;
    try {
      result = await withTransaction(async (client) => {
        // 1. Insert user
        let userResult;
        try {
          userResult = await client.query(
            'INSERT INTO "user" (username, password, "isPremium") VALUES ($1, $2, $3) RETURNING user_id',
            [username, hashedPassword, isPremiumPlan]
          );
        } catch (error) {
          console.error('Error creating user:', error);
          throw new Error('Failed to create user account');
        }

        if (!userResult.rows || userResult.rows.length === 0) {
          throw new Error('Failed to retrieve user ID');
        }

        const userId = userResult.rows[0].user_id;

        // 2. Insert profile
        let profileResult;
        try {
          profileResult = await client.query(
            `INSERT INTO profile (user_id, first_name, last_name, email, phone_number, person_location, linkedin_url, personal_website, "isSearchable", "contactPublic")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING profile_id`,
            [
              userId,
              firstName,
              lastName,
              normalizedEmail,
              phoneNumber || null,
              location || null,
              linkedInUrl || null,
              personalWebsite || null,
              isSearchable,
              contactPublic,
            ]
          );
        } catch (error) {
          console.error('Error creating profile:', error);
          throw new Error('Failed to create user profile');
        }

        if (!profileResult.rows || profileResult.rows.length === 0) {
          throw new Error('Failed to retrieve profile ID');
        }

        const profileId = profileResult.rows[0].profile_id;

        // 3. Insert CV
        let cvResult;
        try {
          cvResult = await client.query(
            'INSERT INTO cv (profile_id, about_me) VALUES ($1, $2) RETURNING cv_id',
            [profileId, aboutMe || null]
          );
        } catch (error) {
          console.error('Error creating CV:', error);
          throw new Error('Failed to create CV');
        }

        if (!cvResult.rows || cvResult.rows.length === 0) {
          throw new Error('Failed to retrieve CV ID');
        }

        const cvId = cvResult.rows[0].cv_id;

        // 4. Insert experiences
        if (Array.isArray(experience) && experience.length > 0) {
          for (const exp of experience) {
            // Only insert if has meaningful data
            if (exp.title?.trim() || exp.company?.trim()) {
              try {
                await client.query(
                  `INSERT INTO experience (cv_id, title, summary, description, key_skills, location, start_date, end_date)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                  [
                    cvId,
                    exp.title?.trim() || null,
                    exp.summary?.trim() || null,
                    exp.description?.trim() || null,
                    exp.keySkills?.trim() || null,
                    exp.location?.trim() || null,
                    exp.startDate || null,
                    exp.endDate || null,
                  ]
                );
              } catch (error) {
                console.error('Error inserting experience:', error);
                // Continue with other records instead of failing entire signup
              }
            }
          }
        }

        // 5. Insert education
        if (Array.isArray(education) && education.length > 0) {
          for (const edu of education) {
            // Only insert if has meaningful data
            if (edu.instituteName?.trim()) {
              try {
                await client.query(
                  `INSERT INTO education (cv_id, institute_name, achieved, target, grade_description, location, start_date, end_date)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                  [
                    cvId,
                    edu.instituteName?.trim() || null,
                    edu.gradeAchieved?.trim() || null,
                    edu.gradeTarget?.trim() || null,
                    edu.description?.trim() || null,
                    edu.location?.trim() || null,
                    edu.startDate || null,
                    edu.endDate || null,
                  ]
                );
              } catch (error) {
                console.error('Error inserting education:', error);
                // Continue with other records
              }
            }
          }
        }

        // 6. Insert projects
        if (Array.isArray(projects) && projects.length > 0) {
          for (const proj of projects) {
            // Only insert if has meaningful data
            if (proj.title?.trim()) {
              try {
                await client.query(
                  `INSERT INTO project (cv_id, title, summary, description, skills, link, start_date, end_date)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                  [
                    cvId,
                    proj.title?.trim() || null,
                    proj.summary?.trim() || null,
                    proj.description?.trim() || null,
                    proj.skills?.trim() || null,
                    proj.link?.trim() || null,
                    proj.startDate || null,
                    proj.endDate || null,
                  ]
                );
              } catch (error) {
                console.error('Error inserting project:', error);
                // Continue with other records
              }
            }
          }
        }

        // 7. Insert certifications
        if (Array.isArray(certifications) && certifications.length > 0) {
          for (const cert of certifications) {
            // Only insert if has meaningful data
            if (cert.title?.trim()) {
              try {
                await client.query(
                  `INSERT INTO certification (cv_id, title, summary, description, skills, institute, link, issue_date, expiry_date)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                  [
                    cvId,
                    cert.title?.trim() || null,
                    cert.summary?.trim() || null,
                    cert.description?.trim() || null,
                    cert.skills?.trim() || null,
                    cert.institute?.trim() || null,
                    cert.link?.trim() || null,
                    cert.issueDate || null,
                    cert.expiryDate || null,
                  ]
                );
              } catch (error) {
                console.error('Error inserting certification:', error);
                // Continue with other records
              }
            }
          }
        }

        // 8. Insert skills
        if (Array.isArray(skills) && skills.length > 0) {
          for (const skill of skills) {
            // Only insert if has meaningful data
            if (skill.name?.trim()) {
              try {
                // Map skillType to is_soft_skill boolean
                const isSoftSkill =
                  skill.skillType === 'soft' ? true : skill.skillType === 'hard' ? false : null;

                await client.query(
                  `INSERT INTO skill (cv_id, name, description, skill_level, is_soft_skill)
                   VALUES ($1, $2, $3, $4, $5)`,
                  [
                    cvId,
                    skill.name?.trim() || null,
                    skill.description?.trim() || null,
                    skill.aptitude || null,
                    isSoftSkill,
                  ]
                );
              } catch (error) {
                console.error('Error inserting skill:', error);
                // Continue with other records
              }
            }
          }
        }

        return { userId, profileId, cvId };
      });
    } catch (error) {
      console.error('Transaction error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }

    // Create session
    try {
      await createSession(result.userId, username, normalizedEmail, isPremiumPlan);
    } catch (error) {
      console.error('Session creation error:', error);
      return NextResponse.json(
        { error: 'Account created but session failed - please log in' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        userId: result.userId,
        profileId: result.profileId,
        cvId: result.cvId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}