import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_USERS } from '@/lib/mock-data';

export async function POST(req: NextRequest) {
  try {
    const { username, name, password } = await req.json();

    const inputName = (name || username || '').toLowerCase().trim();

    let targetUser;

    if (inputName === 'admin' || inputName === 'administrator' || inputName.includes('admin')) {
      targetUser = INITIAL_USERS.find((u) => u.role === 'ADMIN') || INITIAL_USERS[0];
    } else {
      targetUser = INITIAL_USERS.find(
        (u) => u.name.toLowerCase() === inputName || u.username.toLowerCase() === inputName
      );
    }

    // Fallback if not matched strictly
    if (!targetUser && inputName) {
      targetUser = INITIAL_USERS.find(
        (u) => u.name.toLowerCase().includes(inputName)
      );
    }

    if (!targetUser) {
      return NextResponse.json({ error: 'User account not found' }, { status: 404 });
    }

    if (!targetUser.isActive) {
      return NextResponse.json({ error: 'Account is disabled' }, { status: 403 });
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
