import { verifySession } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, skillLevel, isSoftSkill } = await req.json();

    // Get the user's CV
    const cvResult = await query(
      'SELECT cv_id FROM cv WHERE profile_id = (SELECT profile_id FROM profile WHERE user_id = $1) LIMIT 1',
      [session.userId]
    );

    if (cvResult.rows.length === 0) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    const cvId = cvResult.rows[0].cv_id;

    // Insert skill
    const result = await query(
      `INSERT INTO skill (cv_id, name, description, skill_level, is_soft_skill)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING skill_id`,
      [cvId, name || null, description || null, skillLevel || null, isSoftSkill]
    );

    return NextResponse.json(
      { success: true, skill_id: result.rows[0].skill_id },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Add skill error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
