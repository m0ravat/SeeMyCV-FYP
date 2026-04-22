import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
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
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }

    // Hash password and create user with profile in a transaction
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        profiles: {
          create: {
            first_name: profileData?.firstName || null,
            last_name: profileData?.lastName || null,
            email: profileData?.email || null,
            phone_number: profileData?.phoneNumber || null,
            personal_website: profileData?.personalWebsite || null,
            linkedin_url: profileData?.linkedInUrl || null,
            person_location: profileData?.location || null,
            cvs: {
              create: profileData?.aboutMe || profileData?.experience?.length > 0 ? {
                about_me: profileData?.aboutMe || null,
              } : undefined,
            },
          },
        },
      },
      include: {
        profiles: true,
      },
    });

    return NextResponse.json(
      {
        message: 'User created successfully',
        userId: user.user_id,
        username: user.username,
        profileId: user.profiles[0]?.profile_id,
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
