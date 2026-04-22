import { verifySession } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, summary, description, skills, institute, link, issueDate, expiryDate } = await req.json();

    // Get the user's CV
    const cvResult = await query(
      'SELECT cv_id FROM cv WHERE profile_id = (SELECT profile_id FROM profile WHERE user_id = $1) LIMIT 1',
      [session.userId]
    );

    if (cvResult.rows.length === 0) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    const cvId = cvResult.rows[0].cv_id;

    // Insert certification
    const result = await query(
      `INSERT INTO certification (cv_id, title, summary, description, skills, institute, link, issue_date, expiry_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING certification_id`,
      [cvId, title || null, summary || null, description || null, skills || null, institute || null, link || null, issueDate || null, expiryDate || null]
    );

    return NextResponse.json(
      { success: true, certification_id: result.rows[0].certification_id },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Add certification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
