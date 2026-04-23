import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(
      `SELECT id, title, summary, full_blog, category, created_at
       FROM blog
       ORDER BY created_at DESC`
    );
    return NextResponse.json({ posts: result.rows });
  } catch (error) {
    console.error('[blog API] Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}
