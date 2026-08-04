import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_USERS } from '@/lib/mock-data';

export async function POST(req: NextRequest) {
  try {
    const { username, name, password } = await req.json();

    if (!password || password !== 'omunim') {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    let targetUser;

    if (username === 'admin' || name === 'admin' || name === 'Administrator') {
      targetUser = INITIAL_USERS.find((u) => u.username === 'admin');
    } else {
      targetUser = INITIAL_USERS.find(
        (u) => u.name.toLowerCase() === (name || username || '').toLowerCase()
      );
    }

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!targetUser.isActive) {
      return NextResponse.json({ error: 'Account is disabled by administrator' }, { status: 403 });
    }

    const response = NextResponse.json({
      success: true,
      user: targetUser,
      token: `fake-jwt-token-${targetUser.id}-${Date.now()}`,
    });

    response.cookies.set('salestrack_token', `token-${targetUser.id}`, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 500 });
  }
}
