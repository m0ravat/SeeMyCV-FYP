import { verifySession } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { skillId } = await req.json();
    if (!skillId) {
      return NextResponse.json({ error: 'skillId is required' }, { status: 400 });
    }

    // Verify the skill belongs to this user before deleting
    const check = await query(
      `SELECT s.skill_id FROM skill s
       JOIN cv c ON c.cv_id = s.cv_id
       JOIN profile p ON p.profile_id = c.profile_id
       WHERE s.skill_id = $1 AND p.user_id = $2`,
      [skillId, session.userId],
    );

    if (check.rows.length === 0) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    await query('DELETE FROM skill WHERE skill_id = $1', [skillId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[delete-skill] Error:', error);
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
