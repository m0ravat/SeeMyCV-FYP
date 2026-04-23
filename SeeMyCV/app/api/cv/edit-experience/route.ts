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

    const { id, title, company, location, startDate, endDate, current, description } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Experience ID required' }, { status: 400 });
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

    const toDateStr = (d: string | null | undefined) =>
      d ? (d.length === 7 ? `${d}-01` : d) : null;

    // Update experience
    await query(
      `UPDATE experience 
       SET title = $1, summary = $2, location = $3, start_date = $4, end_date = $5, description = $6
       WHERE experience_id = $7 AND cv_id = $8`,
      [title, company, location, toDateStr(startDate), toDateStr(endDate), description, id, cvId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to update experience' },
      { status: 500 }
    );
  }
}
