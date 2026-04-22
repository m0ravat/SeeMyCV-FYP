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

    const { id, name, summary, description, technologies, link, startDate, endDate } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
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
    const techString = Array.isArray(technologies) ? technologies.join(',') : technologies;

    const toDateStr = (d: string | null | undefined) =>
      d ? (d.length === 7 ? `${d}-01` : d) : null;

    // Update project
    await query(
      `UPDATE project 
       SET title = $1, summary = $2, description = $3, skills = $4, link = $5, start_date = $6, end_date = $7
       WHERE project_id = $8 AND cv_id = $9`,
      [name, summary || '', description || '', techString, link || null, toDateStr(startDate), toDateStr(endDate), id, cvId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[v0] Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}
