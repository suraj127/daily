import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_CLIENT_RECORDS } from '@/lib/mock-clients';
import { ClientRecord } from '@/lib/types';

// In-memory store for client details
let clientsStore: ClientRecord[] = [...INITIAL_CLIENT_RECORDS];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const date = searchParams.get('date');
  const search = searchParams.get('search'); // can search by clientName or mobile
  const activityType = searchParams.get('activityType');

  let filtered = [...clientsStore];

  if (userId) {
    filtered = filtered.filter((c) => c.userId === userId);
  }

  if (date) {
    filtered = filtered.filter((c) => c.date === date);
  }

  if (activityType) {
    filtered = filtered.filter((c) => c.activityType === activityType);
  }

  if (search) {
    const query = search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.clientName.toLowerCase().includes(query) ||
        c.mobile.includes(query) ||
        (c.contactPerson && c.contactPerson.toLowerCase().includes(query)) ||
        (c.city && c.city.toLowerCase().includes(query))
    );
  }

  // Sort by createdAt descending
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ success: true, clients: filtered });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      userId,
      userName,
      date,
      activityType,
      clientName,
      contactPerson,
      mobile,
      city,
      status,
      saleAmount,
      paymentStatus,
      notes,
      followUpDate,
    } = body;

    if (!userId || !userName || !date || !activityType || !clientName || !mobile || !status) {
      return NextResponse.json({ error: 'Missing required client record fields' }, { status: 400 });
    }

    const existingIndex = id ? clientsStore.findIndex((c) => c.id === id) : -1;

    const record: ClientRecord = {
      id: existingIndex >= 0 ? clientsStore[existingIndex].id : `cli-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      userName,
      date,
      activityType,
      clientName,
      contactPerson,
      mobile,
      city: city || '',
      status,
      saleAmount: saleAmount ? Number(saleAmount) : undefined,
      paymentStatus,
      notes: notes || '',
      followUpDate: followUpDate || undefined,
      createdAt: existingIndex >= 0 ? clientsStore[existingIndex].createdAt : new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      clientsStore[existingIndex] = record;
    } else {
      clientsStore.unshift(record);
    }

    return NextResponse.json({ success: true, client: record });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save client record' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Client record ID required' }, { status: 400 });
  }

  clientsStore = clientsStore.filter((c) => c.id !== id);
  return NextResponse.json({ success: true, deletedId: id });
}
