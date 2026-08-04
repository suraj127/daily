import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_COMMENTS } from '@/lib/mock-data';
import { CommentItem } from '@/lib/types';

let commentsStore: CommentItem[] = [...INITIAL_COMMENTS];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reportId = searchParams.get('reportId');

  let list = [...commentsStore];
  if (reportId) {
    list = list.filter((c) => c.reportId === reportId);
  }

  return NextResponse.json({ comments: list });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reportId, userId, userName, userRole, content, parentId, attachments, mentions } = body;

    if (!reportId || !userId || !content) {
      return NextResponse.json({ error: 'Missing required comment fields' }, { status: 400 });
    }

    const newComment: CommentItem = {
      id: `comm-${Date.now()}`,
      reportId,
      userId,
      userName: userName || 'Employee',
      userRole: userRole || 'EMPLOYEE',
      content,
      parentId: parentId || null,
      attachments: attachments || [],
      mentions: mentions || [],
      createdAt: new Date().toISOString(),
    };

    commentsStore.push(newComment);

    return NextResponse.json({ success: true, comment: newComment });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to add comment' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Comment ID required' }, { status: 400 });
  }

  commentsStore = commentsStore.filter((c) => c.id !== id && c.parentId !== id);
  return NextResponse.json({ success: true, deletedId: id });
}
