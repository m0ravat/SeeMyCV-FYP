import { query, withTransaction } from '@/lib/db';
import { verifySession, clearSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await verifySession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { password } = await req.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password required to delete account' },
        { status: 400 }
      );
    }

    // Get user password hash
    const userResult = await query(
      'SELECT password FROM "user" WHERE user_id = $1',
      [session.userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    // Verify password before deletion
    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Password is incorrect' },
        { status: 401 }
      );
    }

    // Delete user account and all associated data in a transaction
    await withTransaction(async (client) => {
      // Delete all CV-related data first (due to foreign key constraints)
      const profileResult = await client.query(
        'SELECT profile_id FROM profile WHERE user_id = $1',
        [session.userId]
      );

      if (profileResult.rows.length > 0) {
        const profileId = profileResult.rows[0].profile_id;

        const cvResult = await client.query(
          'SELECT cv_id FROM cv WHERE profile_id = $1',
          [profileId]
        );

        if (cvResult.rows.length > 0) {
          const cvId = cvResult.rows[0].cv_id;

          // Delete all CV-related records
          await client.query('DELETE FROM experience WHERE cv_id = $1', [cvId]);
          await client.query('DELETE FROM education WHERE cv_id = $1', [cvId]);
          await client.query('DELETE FROM project WHERE cv_id = $1', [cvId]);
          await client.query('DELETE FROM certification WHERE cv_id = $1', [cvId]);
          await client.query('DELETE FROM skill WHERE cv_id = $1', [cvId]);
          await client.query('DELETE FROM cv WHERE cv_id = $1', [cvId]);
        }

        // Delete profile
        await client.query('DELETE FROM profile WHERE profile_id = $1', [profileId]);
      }

      // Delete user account
      await client.query('DELETE FROM "user" WHERE user_id = $1', [session.userId]);
    });

    // Clear session cookie
    await clearSession();

    console.log('[v0] Account deleted for user:', session.userId);

    return NextResponse.json(
      {
        success: true,
        message: 'Account deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Delete account error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
