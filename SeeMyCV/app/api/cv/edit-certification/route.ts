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

    const { id, title, institute, issueDate, expiryDate, description, link } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Certification ID required' }, { status: 400 });
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

    // Update certification
    await query(
      `UPDATE certification 
       SET title = $1, institute = $2, issue_date = $3, expiry_date = $4, description = $5, link = $6
       WHERE certification_id = $7 AND cv_id = $8`,
      [title, institute, issueDate || null, expiryDate || null, description || null, link || null, id, cvId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[v0] Error updating certification:', error);
    return NextResponse.json(
      { error: 'Failed to update certification' },
      { status: 500 }
    );
  }
}
