import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_REPORTS, getUserTeam } from '@/lib/mock-data';
import { DailyReport } from '@/lib/types';
import { supabase } from '@/lib/supabase';

// In-memory fallback reports store
let reportsStore: DailyReport[] = [...INITIAL_REPORTS];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const date = searchParams.get('date');

  try {
    let query = supabase.from('reports').select('*');
    if (userId) query = query.eq('user_id', userId);
    if (date) query = query.eq('date', date);

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      const mappedReports: DailyReport[] = data.map((d: any) => ({
        id: d.id,
        userId: d.user_id,
        userName: d.user_name,
        team: d.team,
        date: d.date,
        loginTime: d.login_time || '09:30',
        logoutTime: d.logout_time || '17:30',
        workingHours: d.working_hours || 0,
        activityHours: d.activity_hours || {},
        performance: d.performance || {},
        revenuePerHour: d.revenue_per_hour || 0,
        achievements: d.achievements || '',
        problemsFaced: d.problems_faced || '',
        tomorrowPlan: d.tomorrow_plan || '',
        createdAt: d.created_at || new Date().toISOString(),
        updatedAt: d.created_at || new Date().toISOString(),
      }));
      return NextResponse.json({ reports: mappedReports });
    }
  } catch (e) {
    console.error('Supabase fetch error, using fallback store:', e);
  }

  let filtered = [...reportsStore];
  if (userId) filtered = filtered.filter((r) => r.userId === userId);
  if (date) filtered = filtered.filter((r) => r.date === date);

  return NextResponse.json({ reports: filtered });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      userName,
      team,
      date,
      loginTime,
      logoutTime,
      workingHours,
      activityHours,
      performance,
      achievements,
      problemsFaced,
      tomorrowPlan,
    } = body;

    if (!userId || !userName || !date) {
      return NextResponse.json({ error: 'Missing required report fields' }, { status: 400 });
    }

    const calculatedRevPerHour = Math.round((performance?.revenue || 0) / Math.max(1, workingHours || 1));
    const reportId = `rep-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const nowIso = new Date().toISOString();

    const newReportObj: DailyReport = {
      id: reportId,
      userId,
      userName,
      team: team || getUserTeam(userName),
      date,
      loginTime: loginTime || '09:00',
      logoutTime: logoutTime || '17:30',
      workingHours: workingHours || 8,
      activityHours: activityHours || {},
      performance: performance || {
        demoArrangedLm: 0,
        demoArrangedSelf: 0,
        demoDone: 0,
        followUpCount: 0,
        closingCount: 0,
        quotationSent: 0,
        salesClosed: 0,
        revenue: 0,
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
