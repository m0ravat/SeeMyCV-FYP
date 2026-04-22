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

    const { name, description, technologies, link, startDate, endDate } = await req.json();

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
    const techString = technologies?.join(',') || '';

    // Convert YYYY-MM to YYYY-MM-01 for PostgreSQL date compatibility
    const toDateStr = (d: string | null | undefined) =>
      d ? (d.length === 7 ? `${d}-01` : d) : null;

    // Insert project
    const insertResult = await query(
      `INSERT INTO project (cv_id, title, summary, description, skills, link, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING project_id`,
      [cvId, name, description, description, techString, link || null, toDateStr(startDate), toDateStr(endDate)]
    );

    return NextResponse.json({
      success: true,
      projectId: insertResult.rows[0].project_id,
    });
  } catch (error) {
    console.error('[v0] Error adding project:', error);
    return NextResponse.json(
      { error: 'Failed to add project' },
      { status: 500 }
    );
  }
}
