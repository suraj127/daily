'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Clock,
  TrendingUp,
  PhoneCall,
  CheckCircle2,
  IndianRupee,
  MessageSquare,
  FileText,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function LeadManagementDashboard() {
  const { currentUser, reports, setActiveTab, getTodayReportForUser } = useApp();

  const todayReport = currentUser ? getTodayReportForUser(currentUser.id) : undefined;
  const isReportDoneToday = !!todayReport;

  // Filter reports belonging to Lead Management Team
  const lmReports = reports.filter((r) => r.team === 'LEAD_MANAGEMENT' || r.activityHours?.firstCalls !== undefined);
  const myReports = reports.filter((r) => r.userId === currentUser?.id);

  // Today's KPIs
  const todayTotalCalls = todayReport?.performance?.totalCalls || 0;
  const todayDemoArranged = todayReport?.performance?.totalDemoArranged || 0;
  const todayFeedbackCalls = todayReport?.performance?.feedbackCallsCount || 0;
  const todayHours = todayReport?.workingHours || 0;
  const todayRevenue = todayReport?.performance?.revenue || 0;

  // Monthly KPIs
  const monthlyCalls = myReports.reduce((acc, r) => acc + (r.performance?.totalCalls || 0), 0);
  const monthlyDemosArranged = myReports.reduce((acc, r) => acc + (r.performance?.totalDemoArranged || 0), 0);
  const monthlyRevenue = myReports.reduce((acc, r) => acc + (r.performance?.revenue || 0), 0);

  // Performance Trend Data
  const trendData = myReports.length > 0
    ? myReports.slice(0, 7).reverse().map((r) => ({
        date: r.date.split('-').slice(1).join('/'),
        Calls: r.performance?.totalCalls || 0,
        DemosArranged: r.performance?.totalDemoArranged || 0,
      }))
    : [
        { date: '08/01', Calls: 30, DemosArranged: 6 },
        { date: '08/02', Calls: 35, DemosArranged: 8 },
        { date: '08/03', Calls: 40, DemosArranged: 10 },
        { date: '08/04', Calls: 38, DemosArranged: 9 },
      ];

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-blue-300" /> Lead Management Dashboard
              </span>
              <span className="text-xs text-slate-300 font-mono">Welcome back</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Hello, {currentUser?.name}! 📞
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              {isReportDoneToday
                ? 'Your Lead Management activity report for today is logged! Keep closing high-value leads.'
                : 'Log your first calls, old calls, feedback calls, and demos arranged before 7:00 PM.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {!isReportDoneToday && (
              <button
                type="button"
                onClick={() => setActiveTab('daily-report')}
                className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95"
              >
                + Submit Lead Report
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Today's Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Calls</span>
            <PhoneCall className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
            {todayTotalCalls}
          </div>
          <div className="text-[11px] text-slate-400">First + Old + Follow-up Calls</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Demos Arranged</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
            {todayDemoArranged}
          </div>
          <div className="text-[11px] text-slate-400">Demos scheduled for Demo Team</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Feedback Calls</span>
            <MessageSquare className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
            {todayFeedbackCalls}
          </div>
          <div className="text-[11px] text-slate-400">Post-demo feedback calls</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Working Hours</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
            {todayHours}h
          </div>
          <div className="text-[11px] text-slate-400">Shift activity total</div>
        </div>
      </div>

      {/* Lead Analytics & Call Trend Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Lead Analytics & Call Trends
              </h3>
              <p className="text-xs text-slate-400">Daily calls volume vs demos arranged</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-bold">
              Lead Management
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="Calls" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCalls)" />
                <Area type="monotone" dataKey="DemosArranged" stroke="#10b981" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">
              Monthly Lead Summary
            </h3>
            <p className="text-xs text-slate-400">Overall lead conversion numbers</p>
          </div>

          <div className="space-y-3 my-auto">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Total Calls Handled</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 font-mono text-sm">{monthlyCalls}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Total Demos Arranged</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 font-mono text-sm">{monthlyDemosArranged}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700 dark:text-blue-300">Revenue Impact</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 font-mono text-sm">
                ₹{monthlyRevenue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('clients')}
            className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            View Lead Records & Cross Comments →
          </button>
        </div>
      </div>

      {/* Recent Activity Logs */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500" /> Recent Lead Management Reports
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {lmReports.slice(0, 5).map((r) => (
            <div key={r.id} className="py-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-800 dark:text-slate-200">{r.userName}</div>
                <div className="text-[11px] text-slate-400">
                  Total Calls: {r.performance?.totalCalls || 0} | Demos Arranged: {r.performance?.totalDemoArranged || 0} | Feedback: {r.performance?.feedbackCallsCount || 0}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-600 font-mono">{r.workingHours}h shift</div>
                <div className="text-[10px] text-slate-400">{r.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
