import { verifySession } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  try {
    const session = await verifySession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id, institution, degree, location, startDate, endDate, target, achieved, gradeDescription } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Education ID required' }, { status: 400 });
    }

    // Verify ownership
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

    // Update education
    await query(
      `UPDATE education 
       SET institute_name = $1, location = $2, start_date = $3, end_date = $4, target = $5, achieved = $6, grade_description = $7
       WHERE education_id = $8 AND cv_id = $9`,
      [institution, location || null, startDate || null, endDate || null, target || null, achieved || null, gradeDescription || null, id, cvId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[v0] Error updating education:', error);
    return NextResponse.json(
      { error: 'Failed to update education' },
      { status: 500 }
    );
  }
}
