import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/blog          → published only (public blog)
// GET /api/blog?all=true → all posts including drafts (admin)
export async function GET(req: NextRequest) {
  try {
    const all = req.nextUrl.searchParams.get('all') === 'true';
    const sql = all
      ? `SELECT id, title, summary, full_blog, category, created_at, "isDraft"
         FROM blog ORDER BY created_at DESC`
      : `SELECT id, title, summary, full_blog, category, created_at, "isDraft"
         FROM blog WHERE "isDraft" = false ORDER BY created_at DESC`;
    const result = await query(sql);
    return NextResponse.json({ posts: result.rows });
  } catch (error) {
    console.error('[blog API] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, summary, full_blog, category, isDraft = true } = await req.json();
    if (!title || !summary || !full_blog) {
      return NextResponse.json({ error: 'title, summary and full_blog are required' }, { status: 400 });
    }
    const result = await query(
      `INSERT INTO blog (title, summary, full_blog, category, created_at, "isDraft")
       VALUES ($1, $2, $3, $4, NOW(), $5)
       RETURNING *`,
      [title, summary, full_blog, category || null, isDraft]
    );
    return NextResponse.json({ post: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('[blog API] POST error:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, title, summary, full_blog, category, isDraft } = await req.json();
    if (!id || !title || !summary || !full_blog) {
      return NextResponse.json({ error: 'id, title, summary and full_blog are required' }, { status: 400 });
    }
    const result = await query(
      `UPDATE blog
       SET title = $1, summary = $2, full_blog = $3, category = $4, "isDraft" = $5
       WHERE id = $6
       RETURNING *`,
      [title, summary, full_blog, category || null, isDraft ?? false, id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ post: result.rows[0] });
  } catch (error) {
    console.error('[blog API] PUT error:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }
    await query(`DELETE FROM blog WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[blog API] DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
