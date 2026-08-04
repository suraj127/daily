import { NextResponse } from 'next/server';
import { INITIAL_USERS, getFormattedDate } from '@/lib/mock-data';
import { DailyReport } from '@/lib/types';

export async function GET() {
  // Fetch latest reports from report endpoint logic or in-memory
  // We can fetch via direct module reference or request
  const todayStr = getFormattedDate(0);
  
  // Total employees count (excluding admin)
  const employeeCount = INITIAL_USERS.filter((u) => u.role === 'EMPLOYEE' && u.isActive).length;

  return NextResponse.json({
    kpis: {
      totalEmployees: employeeCount,
      reportsToday: 4,
      pendingReportsToday: Math.max(0, employeeCount - 4),
      totalWorkingHours: 34.75,
      totalDemoArranged: 32,
      totalDemoCompleted: 16,
      followUpCalls: 81,
      closingCalls: 18,
      quotations: 16,
      clientVisits: 4,
      salesClosed: 9,
      revenueToday: 1440000,
      revenueThisMonth: 4250000,
      revenuePerHour: 41438,
      targetAchievementPct: 88.5,
    },
  });
}
