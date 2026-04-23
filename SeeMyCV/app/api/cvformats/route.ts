import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(
      `SELECT id, title, "desc", job_desc, sections, ai_prompt, "isPremium"
       FROM cvformats
       ORDER BY "isPremium" ASC, id ASC`
    );
    return NextResponse.json({ templates: result.rows });
  } catch (error) {
    console.error('[cvformats API] Error fetching templates:', error);
    return NextResponse.json({ error: 'Failed to fetch CV formats' }, { status: 500 });
  }
}
