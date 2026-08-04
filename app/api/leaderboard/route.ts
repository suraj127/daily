import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_USERS, INITIAL_REPORTS } from '@/lib/mock-data';
import { LeaderboardUser } from '@/lib/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sortBy = searchParams.get('sortBy') || 'revenue'; // revenue, sales, demos, hours, followups, revPerHour, target

  const employees = INITIAL_USERS.filter((u) => u.role === 'EMPLOYEE' && u.isActive);

  // Group performance by employee
  const leaderboard: LeaderboardUser[] = employees.map((emp) => {
    const userReports = INITIAL_REPORTS.filter((r) => r.userId === emp.id || r.userName.toLowerCase() === emp.name.toLowerCase());
    
    const revenue = userReports.reduce((acc, r) => acc + (r.performance?.revenue || 0), 0);
    const salesClosed = userReports.reduce((acc, r) => acc + (r.performance?.salesClosed || 0), 0);
    const demoDone = userReports.reduce((acc, r) => acc + (r.performance?.demoDone || 0), 0);
    const workingHours = userReports.reduce((acc, r) => acc + (r.workingHours || 0), 0);
    const followUpCount = userReports.reduce((acc, r) => acc + (r.performance?.followUpCount || 0), 0);
    const hours = Math.max(0.1, workingHours);
    const revenuePerHour = Math.round(revenue / hours);
    // Target calculation: target 4L per month or 50k/day
    const targetAchievement = Math.min(100, Number(((revenue / 500000) * 100).toFixed(1)));

    return {
      rank: 0,
      userId: emp.id,
      name: emp.name,
      revenue,
      salesClosed,
      demoDone,
      workingHours: Number(workingHours.toFixed(1)),
      followUpCount,
      revenuePerHour,
      targetAchievement,
      reportsSubmitted: userReports.length,
    };
  });

  // Sort by selected metric
  leaderboard.sort((a, b) => {
    switch (sortBy) {
      case 'sales':
        return b.salesClosed - a.salesClosed;
      case 'demos':
        return b.demoDone - a.demoDone;
      case 'hours':
        return b.workingHours - a.workingHours;
      case 'followups':
        return b.followUpCount - a.followUpCount;
      case 'revPerHour':
        return b.revenuePerHour - a.revenuePerHour;
      case 'target':
        return b.targetAchievement - a.targetAchievement;
      case 'revenue':
      default:
        return b.revenue - a.revenue;
    }
  });

  // Assign ranks & badges
  const ranked = leaderboard.map((item, index) => ({
    ...item,
    rank: index + 1,
    badge: index === 0 ? '👑 Top Performer' : index === 1 ? '🥈 Sales Star' : index === 2 ? '🥉 High Achiever' : undefined,
  }));

  return NextResponse.json({ leaderboard: ranked });
}
