import { verifySession } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await verifySession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { institution, degree, location, startDate, endDate, target, achieved, gradeDescription } = await req.json();

    // Get user's CV
    const profileResult = await query(
      'SELECT profile_id FROM profile WHERE user_id = $1',
      [session.userId]
    );

    if (profileResult.rows.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const cvResult = await query(
      'SELECT cv_id FROM cv WHERE profile_id = $1 LIMIT 1',
      [profileResult.rows[0].profile_id]
    );

    if (cvResult.rows.length === 0) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    const cvId = cvResult.rows[0].cv_id;

    // Insert education
    const insertResult = await query(
      `INSERT INTO education (cv_id, institute_name, location, start_date, end_date, target, achieved, grade_description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING education_id`,
      [cvId, institution, location || null, startDate || null, endDate || null, target || null, achieved || null, gradeDescription || null]
    );

    return NextResponse.json({
      success: true,
      educationId: insertResult.rows[0].education_id,
    });
  } catch (error) {
    console.error('[v0] Error adding education:', error);
    return NextResponse.json(
      { error: 'Failed to add education' },
      { status: 500 }
    );
  }
}
