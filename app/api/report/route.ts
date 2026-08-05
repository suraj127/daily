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

    const rev = performance?.revenue || 0;
    const hrs = Math.max(1, workingHours || 1);
    const calculatedRevenuePerHour = Math.round(rev / hrs);
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
      performance: performance || {},
      revenuePerHour: calculatedRevenuePerHour,
      achievements: achievements || '',
      problemsFaced: problemsFaced || '',
      tomorrowPlan: tomorrowPlan || '',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    // Insert into Supabase
    try {
      await supabase.from('reports').insert({
        id: reportId,
        user_id: userId,
        user_name: userName,
        team: newReportObj.team,
        date,
        login_time: newReportObj.loginTime,
        logout_time: newReportObj.logoutTime,
        working_hours: Number(workingHours) || 0,
        activity_hours: activityHours || {},
        performance: performance || {},
        revenue_per_hour: calculatedRevenuePerHour,
        achievements,
        problems_faced: problemsFaced,
        tomorrow_plan: tomorrowPlan,
        created_at: nowIso,
      });
    } catch (e) {
      console.error('Supabase report insert error:', e);
    }

    reportsStore = [newReportObj, ...reportsStore.filter((r) => r.id !== reportId)];

    return NextResponse.json({ success: true, report: newReportObj });
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
