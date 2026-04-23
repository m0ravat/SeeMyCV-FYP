import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(req: NextRequest) {
  try {
    const { title, summary, full_blog, category } = await req.json();
    if (!title || !summary || !full_blog) {
      return NextResponse.json({ error: 'title, summary and full_blog are required' }, { status: 400 });
    }
    const result = await query(
      `INSERT INTO blog (title, summary, full_blog, category, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [title, summary, full_blog, category || null]
    );
    return NextResponse.json({ post: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('[blog API] Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, title, summary, full_blog, category } = await req.json();
    if (!id || !title || !summary || !full_blog) {
      return NextResponse.json({ error: 'id, title, summary and full_blog are required' }, { status: 400 });
    }
    const result = await query(
      `UPDATE blog
       SET title = $1, summary = $2, full_blog = $3, category = $4
       WHERE id = $5
       RETURNING *`,
      [title, summary, full_blog, category || null, id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ post: result.rows[0] });
  } catch (error) {
    console.error('[blog API] Error updating post:', error);
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
    console.error('[blog API] Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
