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

    const { title, company, location, startDate, endDate, current, description } = await req.json();

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

    // Convert YYYY-MM to YYYY-MM-01 for PostgreSQL date compatibility
    const toDateStr = (d: string | null | undefined) =>
      d ? (d.length === 7 ? `${d}-01` : d) : null;

    // Insert experience
    const insertResult = await query(
      `INSERT INTO experience (cv_id, title, summary, location, start_date, end_date, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING experience_id`,
      [cvId, title, company, location, toDateStr(startDate), toDateStr(endDate), description]
    );

    return NextResponse.json({
      success: true,
      experienceId: insertResult.rows[0].experience_id,
    });
  } catch (error) {
    console.error('[v0] Error adding experience:', error);
    return NextResponse.json(
      { error: 'Failed to add experience' },
      { status: 500 }
    );
  }
}
