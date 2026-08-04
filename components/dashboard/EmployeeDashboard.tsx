'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Sparkles,
  Clock,
  TrendingUp,
  FileCheck,
  AlertCircle,
  Trophy,
  Calendar,
  CheckCircle2,
  PlusCircle,
  PhoneCall,
  IndianRupee,
  ChevronRight,
  Target,
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
import { motion } from 'motion/react';

export default function EmployeeDashboard() {
  const { currentUser, reports, setActiveTab, getTodayReportForUser, setSelectedDate } = useApp();

  const todayReport = currentUser ? getTodayReportForUser(currentUser.id) : undefined;
  const isReportDoneToday = !!todayReport;

  // Employee specific reports
  const userReports = reports.filter(
    (r) => r.userId === currentUser?.id || r.userName.toLowerCase() === currentUser?.name.toLowerCase()
  );

  const totalUserRevenue = userReports.reduce((acc, r) => acc + (r.performance?.revenue || 0), 0);
  const totalUserDemos = userReports.reduce((acc, r) => acc + (r.performance?.demoDone || 0), 0);
  const totalUserSales = userReports.reduce((acc, r) => acc + (r.performance?.salesClosed || 0), 0);
  const totalUserHours = userReports.reduce((acc, r) => acc + (r.workingHours || 0), 0);

  const todayRevenue = todayReport?.performance?.revenue || 0;
  const todayHours = todayReport?.workingHours || 0;

  // Chart data for employee performance trend
  const performanceTrendData = userReports.length > 0
    ? userReports.slice(0, 7).reverse().map((r) => ({
        date: r.date.split('-').slice(1).join('/'),
        Revenue: (r.performance?.revenue || 0) / 1000,
        Demos: r.performance?.demoDone || 0,
        Followups: r.performance?.followUpCount || 0,
      }))
    : [
        { date: '07/28', Revenue: 150, Demos: 3, Followups: 14 },
        { date: '07/29', Revenue: 220, Demos: 4, Followups: 18 },
        { date: '07/30', Revenue: 310, Demos: 5, Followups: 20 },
        { date: '08/01', Revenue: 280, Demos: 4, Followups: 16 },
        { date: '08/02', Revenue: 450, Demos: 6, Followups: 22 },
      ];

  const upcomingTasks = [
    { title: 'Follow up with Apex Retail procurement officer', time: '14:30 PM', priority: 'HIGH' },
    { title: 'Conduct product demo with Zenith Tech team', time: '16:00 PM', priority: 'MEDIUM' },
    { title: 'Send finalized invoice to Alpha Corp', time: '17:15 PM', priority: 'CRITICAL' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Personalized Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold border border-violet-500/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Employee Command Center
              </span>
              <span className="text-xs text-slate-300 font-mono">Welcome back</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Hello, {currentUser?.name}! 👋
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              {isReportDoneToday
                ? 'Your daily activity report for today is submitted! Great job staying compliant.'
                : 'You have not submitted your daily report for today yet. Make sure to log your shift before 7:00 PM.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isReportDoneToday ? (
              <button
                type="button"
                onClick={() => setActiveTab('daily-report')}
                className="h-11 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>View Today&apos;s Log</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('daily-report')}
                className="h-11 px-5 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all active:scale-95 animate-bounce"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Submit Today&apos;s Report</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Employee Quick Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today Report Status */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Today&apos;s Report Status
            </div>
            <div className="flex items-center gap-1.5">
              {isReportDoneToday ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Submitted
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-1 animate-pulse">
                  <AlertCircle className="w-3.5 h-3.5" /> Action Required
                </span>
              )}
            </div>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isReportDoneToday ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
            <FileCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Working Hours Meter */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Shift Working Hours
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
              {todayHours ? `${todayHours} hrs logged` : '0.0 / 8.0 hrs'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Today Revenue */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Today&apos;s Revenue Closed
            </div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              ₹{todayRevenue.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>

        {/* Leaderboard Rank */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Team Leaderboard Rank
            </div>
            <div className="text-lg font-bold text-amber-500 flex items-center gap-1 font-mono">
              <Trophy className="w-4 h-4" /> #1 Top Performer
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Chart & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Performance Chart */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Your Revenue & Activity Trend
              </h3>
              <p className="text-[11px] text-slate-400">Revenue (in ₹ Thousands) vs Demos Conducted</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
            >
              Analytics <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceTrendData}>
                <defs>
                  <linearGradient id="userColorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="Revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#userColorRev)" name="Revenue (k ₹)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Tasks & Reminders */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-violet-500" /> Today&apos;s Action Items
              </h3>
              <span className="text-[10px] font-bold text-slate-400">3 Pending</span>
            </div>

            <div className="space-y-2.5">
              {upcomingTasks.map((task, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{task.title}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      task.priority === 'CRITICAL' ? 'bg-rose-500/10 text-rose-600' : 'bg-violet-500/10 text-violet-600'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> Scheduled: {task.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors text-center flex items-center justify-center gap-1.5"
          >
            <span>Open Sales Calendar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Your Recent Daily Reports Log */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Your Submitted Daily Reports</h3>
            <p className="text-[11px] text-slate-400">Historical performance logs and feedback ratings</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('daily-report')}
            className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
          >
            + New Log Entry
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3">Date</th>
                <th className="pb-3">Working Hours</th>
                <th className="pb-3">Demos Done</th>
                <th className="pb-3">Follow-ups</th>
                <th className="pb-3">Closed Sales</th>
                <th className="pb-3">Revenue Logged</th>
                <th className="pb-3 text-right">Self Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {userReports.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-mono text-slate-800 dark:text-slate-200">{r.date}</td>
                  <td className="py-3 font-semibold text-slate-700 dark:text-slate-300">{r.workingHours} hrs</td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">{r.performance?.demoDone || 0}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">{r.performance?.followUpCount || 0}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">{r.performance?.salesClosed || 0}</td>
                  <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{(r.performance?.revenue || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 text-right font-medium text-amber-500">
                    {'⭐'.repeat(r.selfRating || 5)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
