import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('authToken')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { profileData } = await request.json();
    const userId = decoded.userId as number;

    // Get user's profile
    const profile = await prisma.profile.findFirst({
      where: { user_id: userId },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Update profile basic info
    const updatedProfile = await prisma.profile.update({
      where: { profile_id: profile.profile_id },
      data: {
        first_name: profileData.firstName || undefined,
        last_name: profileData.lastName || undefined,
        email: profileData.email || undefined,
        phone_number: profileData.phoneNumber || undefined,
        personal_website: profileData.personalWebsite || undefined,
        linkedin_url: profileData.linkedInUrl || undefined,
        person_location: profileData.location || undefined,
      },
    });

    // Get or create CV
    let cv = await prisma.cV.findFirst({
      where: { profile_id: profile.profile_id },
    });

    if (!cv) {
      cv = await prisma.cV.create({
        data: {
          profile_id: profile.profile_id,
          about_me: profileData.aboutMe || null,
        },
      });
    } else {
      cv = await prisma.cV.update({
        where: { cv_id: cv.cv_id },
        data: {
          about_me: profileData.aboutMe || null,
        },
      });
    }

    // Handle experiences
    if (profileData.experience && profileData.experience.length > 0) {
      // Delete existing experiences
      await prisma.experience.deleteMany({
        where: { cv_id: cv.cv_id },
      });

      // Create new experiences
      for (const exp of profileData.experience) {
        await prisma.experience.create({
          data: {
            cv_id: cv.cv_id,
            title: exp.title || null,
            summary: exp.summary || null,
            description: exp.description || null,
            key_skills: exp.keySkills || null,
            location: exp.location || null,
            start_date: exp.startDate ? new Date(exp.startDate) : null,
            end_date: exp.endDate ? new Date(exp.endDate) : null,
          },
        });
      }
    }

    // Handle skills
    if (profileData.skills && profileData.skills.length > 0) {
      // Delete existing skills
      await prisma.skill.deleteMany({
        where: { cv_id: cv.cv_id },
      });

      // Create new skills
      for (const skill of profileData.skills) {
        await prisma.skill.create({
          data: {
            cv_id: cv.cv_id,
            name: skill.name,
            description: skill.description || null,
            is_soft_skill: skill.skillType === 'soft',
          },
        });
      }
    }

    // Handle education
    if (profileData.education && profileData.education.length > 0) {
      // Delete existing education
      await prisma.education.deleteMany({
        where: { cv_id: cv.cv_id },
      });

      // Create new education
      for (const edu of profileData.education) {
        await prisma.education.create({
          data: {
            cv_id: cv.cv_id,
            institute_name: edu.instituteName || null,
            grade_description: edu.gradeAchieved || null,
            target: edu.gradeTarget || null,
            achieved: edu.gradeAchieved || null,
            location: edu.location || null,
            start_date: edu.startDate ? new Date(edu.startDate) : null,
            end_date: edu.endDate ? new Date(edu.endDate) : null,
          },
        });
      }
    }

    // Handle projects
    if (profileData.projects && profileData.projects.length > 0) {
      // Delete existing projects
      await prisma.project.deleteMany({
        where: { cv_id: cv.cv_id },
      });

      // Create new projects
      for (const project of profileData.projects) {
        await prisma.project.create({
          data: {
            cv_id: cv.cv_id,
            title: project.title || null,
            summary: project.summary || null,
            description: project.description || null,
            skills: project.skills || null,
            link: project.link || null,
            start_date: project.startDate ? new Date(project.startDate) : null,
            end_date: project.endDate ? new Date(project.endDate) : null,
          },
        });
      }
    }

    // Handle certifications
    if (profileData.certifications && profileData.certifications.length > 0) {
      // Delete existing certifications
      await prisma.certification.deleteMany({
        where: { cv_id: cv.cv_id },
      });

      // Create new certifications
      for (const cert of profileData.certifications) {
        await prisma.certification.create({
          data: {
            cv_id: cv.cv_id,
            title: cert.title || null,
            summary: cert.summary || null,
            description: cert.description || null,
            skills: cert.skills || null,
            institute: cert.institute || null,
            link: cert.link || null,
            issue_date: cert.issueDate ? new Date(cert.issueDate) : null,
            expiry_date: cert.expiryDate ? new Date(cert.expiryDate) : null,
          },
        });
      }
    }

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        profileId: profile.profile_id,
        cvId: cv.cv_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
