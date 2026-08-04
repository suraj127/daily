import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_USERS } from '@/lib/mock-data';
import { User } from '@/lib/types';

let usersStore: User[] = [...INITIAL_USERS];

export async function GET() {
  return NextResponse.json({ users: usersStore });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, id, name, username, department, isActive, password } = body;

    if (action === 'ADD') {
      if (!name) {
        return NextResponse.json({ error: 'Employee name is required' }, { status: 400 });
      }
      const newEmp: User = {
        id: `user-emp-${Date.now()}`,
        username: username || name.toLowerCase().replace(/\s+/g, '.'),
        name,
        role: 'EMPLOYEE',
        department: department || 'Sales',
        isActive: isActive !== false,
        email: `${name.toLowerCase().replace(/\s+/g, '')}@salestrack.pro`,
        designation: 'Sales Executive',
      };
      usersStore.push(newEmp);
      return NextResponse.json({ success: true, user: newEmp });
    }

    if (action === 'UPDATE') {
      const idx = usersStore.findIndex((u) => u.id === id);
      if (idx === -1) {
        return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
      }
      usersStore[idx] = {
        ...usersStore[idx],
        name: name || usersStore[idx].name,
        department: department || usersStore[idx].department,
        isActive: isActive !== undefined ? isActive : usersStore[idx].isActive,
      };
      return NextResponse.json({ success: true, user: usersStore[idx] });
    }

    if (action === 'TOGGLE_STATUS') {
      const idx = usersStore.findIndex((u) => u.id === id);
      if (idx !== -1) {
        usersStore[idx].isActive = !usersStore[idx].isActive;
        return NextResponse.json({ success: true, user: usersStore[idx] });
      }
    }

    if (action === 'DELETE') {
      usersStore = usersStore.filter((u) => u.id !== id);
      return NextResponse.json({ success: true, deletedId: id });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Operation failed' }, { status: 500 });
  }
}
