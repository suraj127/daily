import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_REPORTS } from '@/lib/mock-data';
import { DailyReport } from '@/lib/types';

// In-memory reports store for runtime session consistency
let reportsStore: DailyReport[] = [...INITIAL_REPORTS];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const date = searchParams.get('date');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  let filtered = [...reportsStore];

  if (userId) {
    filtered = filtered.filter((r) => r.userId === userId);
  }

  if (date) {
    filtered = filtered.filter((r) => r.date === date);
  }

  if (startDate && endDate) {
    filtered = filtered.filter((r) => r.date >= startDate && r.date <= endDate);
  }

  return NextResponse.json({ reports: filtered });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      userName,
      date,
      loginTime,
      logoutTime,
      workingHours,
      activityHours,
      performance,
      achievements,
      problemsFaced,
      tomorrowPlan,
      additionalNotes,
      priority,
      mood,
      customerFeedback,
      selfRating,
    } = body;

    if (!userId || !userName || !date) {
      return NextResponse.json({ error: 'Missing required report fields' }, { status: 400 });
    }

    // Validation: Working hours cannot exceed 24
    if (workingHours > 24) {
      return NextResponse.json({ error: 'Working Hours cannot exceed 24 hours' }, { status: 400 });
    }

    // Validation: Revenue cannot be negative
    if (performance?.revenue < 0) {
      return NextResponse.json({ error: 'Revenue cannot be negative' }, { status: 400 });
    }

    // Check if report already exists for this employee on this date
    const existingIndex = reportsStore.findIndex(
      (r) => r.userId === userId && r.date === date
    );

    // Calculate revenue per hour, conversion rates
    const revenue = performance?.revenue || 0;
    const hours = Math.max(0.1, workingHours || 8);
    const revenuePerHour = Math.round(revenue / hours);

    const quotationSent = performance?.quotationSent || 0;
    const salesClosed = performance?.salesClosed || 0;
    const salesConversion = quotationSent > 0 ? Number(((salesClosed / quotationSent) * 100).toFixed(1)) : 0;

    const demoArranged = (performance?.demoArrangedLm || 0) + (performance?.demoArrangedSelf || 0);
    const demoDone = performance?.demoDone || 0;
    const demoConversion = demoArranged > 0 ? Number(((demoDone / demoArranged) * 100).toFixed(1)) : 0;

    const newReport: DailyReport = {
      id: existingIndex >= 0 ? reportsStore[existingIndex].id : `rep-${Date.now()}`,
      userId,
      userName,
      date,
      loginTime: loginTime || '09:00',
      logoutTime: logoutTime || '17:30',
      workingHours: workingHours || 8,
      activityHours: activityHours || {
        demoArrangeCalls: 0,
        demo: 0,
        followUpCalls: 0,
        closingCalls: 0,
        quotationMaking: 0,
        fieldVisit: 0,
        reportingMeeting: 0,
        technicalSupport: 0,
        clientVisit: 0,
        coldCalling: 0,
        whatsappFollowUp: 0,
        emailFollowUp: 0,
        training: 0,
        internalMeeting: 0,
        otherWork: 0,
      },
      performance: performance || {
        demoArrangedLm: 0,
        demoArrangedSelf: 0,
        demoDone: 0,
        followUpCount: 0,
        closingCount: 0,
        quotationSent: 0,
        quotationApproved: 0,
        salesClosed: 0,
        revenue: 0,
        leadCreated: 0,
        leadConverted: 0,
        pendingLeads: 0,
        lostLeads: 0,
        clientMeetings: 0,
        customerVisits: 0,
      },
      revenuePerHour,
      salesConversion,
      demoConversion,
      achievements: achievements || '',
      problemsFaced: problemsFaced || '',
      tomorrowPlan: tomorrowPlan || '',
      additionalNotes: additionalNotes || '',
      priority: priority || 'MEDIUM',
      mood: mood || 'GOOD',
      customerFeedback: customerFeedback || 'POSITIVE',
      selfRating: selfRating || 5,
      createdAt: existingIndex >= 0 ? reportsStore[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      reportsStore[existingIndex] = newReport;
    } else {
      reportsStore.unshift(newReport);
    }

    return NextResponse.json({ success: true, report: newReport });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Report submission failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Report ID required' }, { status: 400 });
  }

  reportsStore = reportsStore.filter((r) => r.id !== id);
  return NextResponse.json({ success: true, deletedId: id });
}
