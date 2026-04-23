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

    const { title, institute, issueDate, expiryDate, description, link } = await req.json();

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

    // Insert certification
    const insertResult = await query(
      `INSERT INTO certification (cv_id, title, institute, issue_date, expiry_date, description, link)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING certification_id`,
      [cvId, title, institute, issueDate || null, expiryDate || null, description || null, link || null]
    );

    return NextResponse.json({
      success: true,
      certificationId: insertResult.rows[0].certification_id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to add certification' },
      { status: 500 }
    );
  }
}
