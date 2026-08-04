'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Sparkles,
  Clock,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  PhoneCall,
  IndianRupee,
  Calendar,
  Layers,
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
import MetricDetailModal from './MetricDetailModal';

export default function DemoTeamDashboard() {
  const { currentUser, reports, setActiveTab, getTodayReportForUser } = useApp();

  const [selectedMetricModal, setSelectedMetricModal] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    totalValue: string | number;
    metricKey: 'demoDone' | 'demoArranged' | 'workingHours' | 'revenue' | 'firstCalls' | 'followUpCount' | 'salesClosed' | 'totalCalls' | 'onboarding' | 'support' | 'collections';
    reports: typeof reports;
  } | null>(null);

  const todayReport = currentUser ? getTodayReportForUser(currentUser.id) : undefined;
  const isReportDoneToday = !!todayReport;

  // Filter reports belonging to Demo Team
  const demoReports = reports.filter((r) => r.team === 'DEMO_TEAM' || r.activityHours?.demo !== undefined);
  const myReports = reports.filter((r) => r.userId === currentUser?.id);

  // Today's KPIs
  const todayDemosDone = todayReport?.performance?.demoDone || 0;
  const todayDemosArrangedSelf = todayReport?.performance?.demoArrangedSelf || 0;
  const todayDemosArrangedLm = todayReport?.performance?.demoArrangedLm || 0;
  const todayHours = todayReport?.workingHours || 0;
  const todayRevenue = todayReport?.performance?.revenue || 0;

  // Monthly KPIs
  const monthlyDemosDone = myReports.reduce((acc, r) => acc + (r.performance?.demoDone || 0), 0);
  const monthlyHours = myReports.reduce((acc, r) => acc + (r.workingHours || 0), 0);
  const monthlyRevenue = myReports.reduce((acc, r) => acc + (r.performance?.revenue || 0), 0);

  // Performance Trend Data
  const trendData = myReports.length > 0
    ? myReports.slice(0, 7).reverse().map((r) => ({
        date: r.date.split('-').slice(1).join('/'),
        Demos: r.performance?.demoDone || 0,
        Revenue: (r.performance?.revenue || 0) / 1000,
        Hours: r.workingHours || 0,
      }))
    : [
        { date: '08/01', Demos: 4, Revenue: 180, Hours: 8 },
        { date: '08/02', Demos: 5, Revenue: 250, Hours: 8.5 },
        { date: '08/03', Demos: 6, Revenue: 320, Hours: 9 },
        { date: '08/04', Demos: 5, Revenue: 450, Hours: 8.5 },
      ];

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold border border-violet-500/30 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-amber-300" /> Demo Team Dashboard
              </span>
              <span className="text-xs text-slate-300 font-mono">Welcome back</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Hello, {currentUser?.name}! 🎯
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              {isReportDoneToday
                ? 'Your Demo Team activity report for today is submitted! Click any KPI card below to inspect detail logs.'
                : 'Log your product demos, demo arrange calls, and follow-ups before 7:00 PM.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {!isReportDoneToday && (
              <button
                type="button"
                onClick={() => setActiveTab('daily-report')}
                className="h-10 px-5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all active:scale-95"
              >
                + Submit Demo Report
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Today's Performance Metrics (Clickable Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Today's Demos */}
        <div
          onClick={() =>
            setSelectedMetricModal({
              isOpen: true,
              title: "Today's Completed Demos",
              subtitle: 'Individual product demos conducted today by the team',
              icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
              totalValue: `${todayDemosDone} Demos`,
              metricKey: 'demoDone',
              reports: demoReports,
            })
          }
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer hover:border-violet-500/50 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider group-hover:text-violet-600 transition-colors">Today&apos;s Demos</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
            {todayDemosDone}
          </div>
          <div className="text-[11px] text-violet-600 dark:text-violet-400 font-medium flex items-center gap-1">
            Click to view breakdown →
          </div>
        </div>

        {/* Card 2: Demo Arranged */}
        <div
          onClick={() =>
            setSelectedMetricModal({
              isOpen: true,
              title: 'Demos Arranged Today',
              subtitle: 'Demos arranged via Lead Management and Self-prospecting',
              icon: <PhoneCall className="w-5 h-5 text-violet-500" />,
              totalValue: `${todayDemosArrangedSelf + todayDemosArrangedLm} Demos`,
              metricKey: 'demoArranged',
              reports: demoReports,
            })
          }
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer hover:border-violet-500/50 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider group-hover:text-violet-600 transition-colors">Demo Arranged</span>
            <PhoneCall className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
            {todayDemosArrangedSelf + todayDemosArrangedLm}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            LM: {todayDemosArrangedLm} | Self: {todayDemosArrangedSelf}
          </div>
        </div>

        {/* Card 3: Working Hours */}
        <div
          onClick={() =>
            setSelectedMetricModal({
              isOpen: true,
              title: 'Shift & Activity Hours',
              subtitle: 'Logged active work hours across demo team reps',
              icon: <Clock className="w-5 h-5 text-blue-500" />,
              totalValue: `${todayHours} hrs`,
              metricKey: 'workingHours',
              reports: demoReports,
            })
          }
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer hover:border-violet-500/50 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider group-hover:text-violet-600 transition-colors">Working Hours</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
            {todayHours}h
          </div>
          <div className="text-[11px] text-violet-600 dark:text-violet-400 font-medium flex items-center gap-1">
            Click to view breakdown →
          </div>
        </div>

        {/* Card 4: Today Revenue */}
        <div
          onClick={() =>
            setSelectedMetricModal({
              isOpen: true,
              title: 'Generated Closed Revenue',
              subtitle: 'Financial revenue closed from product demos',
              icon: <IndianRupee className="w-5 h-5 text-amber-500" />,
              totalValue: `₹${todayRevenue.toLocaleString('en-IN')}`,
              metricKey: 'revenue',
              reports: demoReports,
            })
          }
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer hover:border-violet-500/50 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider group-hover:text-violet-600 transition-colors">Today Revenue</span>
            <IndianRupee className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            ₹{todayRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-violet-600 dark:text-violet-400 font-medium flex items-center gap-1">
            Click to view breakdown →
          </div>
        </div>
      </div>

      {/* Demo Analytics & Performance Trend Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Demo Analytics & Revenue Trend
              </h3>
              <p className="text-xs text-slate-400">Completed demos vs generated revenue (₹ in thousands)</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-600 text-xs font-bold">
              Demo Team
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="Revenue" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="Demos" stroke="#10b981" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Summary (Clickable cards) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">
              Monthly Performance
            </h3>
            <p className="text-xs text-slate-400">Total cumulative stats for Demo Team</p>
          </div>

          <div className="space-y-3 my-auto">
            <div
              onClick={() =>
                setSelectedMetricModal({
                  isOpen: true,
                  title: 'Monthly Total Demos',
                  subtitle: 'Cumulative completed demos for your account',
                  icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
                  totalValue: `${monthlyDemosDone} Demos`,
                  metricKey: 'demoDone',
                  reports: myReports,
                })
              }
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between cursor-pointer hover:bg-violet-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Total Demos Done</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 font-mono text-sm">{monthlyDemosDone}</span>
            </div>

            <div
              onClick={() =>
                setSelectedMetricModal({
                  isOpen: true,
                  title: 'Monthly Total Hours',
                  subtitle: 'Cumulative shift working hours logged',
                  icon: <Clock className="w-5 h-5 text-blue-500" />,
                  totalValue: `${monthlyHours.toFixed(1)} hrs`,
                  metricKey: 'workingHours',
                  reports: myReports,
                })
              }
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between cursor-pointer hover:bg-violet-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Working Hours</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 font-mono text-sm">{monthlyHours.toFixed(1)}h</span>
            </div>

            <div
              onClick={() =>
                setSelectedMetricModal({
                  isOpen: true,
                  title: 'Monthly Total Revenue',
                  subtitle: 'Cumulative revenue closed across all demos',
                  icon: <IndianRupee className="w-5 h-5 text-emerald-500" />,
                  totalValue: `₹${monthlyRevenue.toLocaleString('en-IN')}`,
                  metricKey: 'revenue',
                  reports: myReports,
                })
              }
              className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between cursor-pointer hover:bg-emerald-500/20 transition-colors"
            >
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Total Revenue</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                ₹{monthlyRevenue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('clients')}
            className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            View Demo Records & Comments →
          </button>
        </div>
      </div>

      {/* Recent Activity Logs */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <FileText className="w-4 h-4 text-violet-500" /> Recent Demo Team Reports
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {demoReports.slice(0, 5).map((r) => (
            <div key={r.id} className="py-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-800 dark:text-slate-200">{r.userName}</div>
                <div className="text-[11px] text-slate-400">
                  Demos: {r.performance?.demoDone || 0} | Arranged (LM): {r.performance?.demoArrangedLm || 0} | Arranged (Self): {r.performance?.demoArrangedSelf || 0}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-emerald-600 font-mono">₹{(r.performance?.revenue || 0).toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-slate-400">{r.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Metric Detail Drawer Modal */}
      {selectedMetricModal && (
        <MetricDetailModal
          isOpen={selectedMetricModal.isOpen}
          onClose={() => setSelectedMetricModal(null)}
          title={selectedMetricModal.title}
          subtitle={selectedMetricModal.subtitle}
          icon={selectedMetricModal.icon}
          totalValue={selectedMetricModal.totalValue}
          reports={selectedMetricModal.reports}
          metricKey={selectedMetricModal.metricKey}
          onNavigateTab={setActiveTab}
        />
      )}
    </div>
  );
}
