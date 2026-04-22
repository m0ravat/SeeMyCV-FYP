import { verifySession } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { instituteName, gradeAchieved, gradeTarget, description, location, startDate, endDate } = await req.json();

    // Get the user's CV
    const cvResult = await query(
      'SELECT cv_id FROM cv WHERE profile_id = (SELECT profile_id FROM profile WHERE user_id = $1) LIMIT 1',
      [session.userId]
    );

    if (cvResult.rows.length === 0) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    const cvId = cvResult.rows[0].cv_id;

    // Insert education
    const result = await query(
      `INSERT INTO education (cv_id, institute_name, achieved, target, grade_description, location, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING education_id`,
      [cvId, instituteName || null, gradeAchieved || null, gradeTarget || null, description || null, location || null, startDate || null, endDate || null]
    );

    return NextResponse.json(
      { success: true, education_id: result.rows[0].education_id },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Add education error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
