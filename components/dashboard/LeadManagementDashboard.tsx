'use client';

import React, { useState } from 'react';
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
import MetricDetailModal from './MetricDetailModal';

export default function LeadManagementDashboard() {
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

  // Scope lmReports strictly to current user for employees
  const lmReports = currentUser?.role === 'ADMIN'
    ? reports.filter((r) => r.team === 'LEAD_MANAGEMENT')
    : reports.filter((r) => r.userId === currentUser?.id);
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
  const trendData = myReports.slice(0, 7).reverse().map((r) => ({
    date: r.date ? r.date.split('-').slice(1).join('/') : 'Today',
    Calls: r.performance?.totalCalls || 0,
    DemosArranged: r.performance?.totalDemoArranged || 0,
  }));

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 dark:bg-slate-900 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-slate-300" /> Lead Management Dashboard
              </span>
              <span className="text-xs text-slate-400 font-mono">Welcome back</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Hello, {currentUser?.name}! 📞
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              {isReportDoneToday
                ? 'Your Lead Management activity report for today is logged! Click any card to view detailed item breakdown.'
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

      {/* Today's Performance Metrics (Clickable Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Total Calls */}
        <div
          onClick={() =>
            setSelectedMetricModal({
              isOpen: true,
              title: "Today's Total Calls",
              subtitle: 'Aggregate first calls, old calls, and follow-ups',
              icon: <PhoneCall className="w-5 h-5 text-blue-500" />,
              totalValue: `${todayTotalCalls} Calls`,
              metricKey: 'totalCalls',
              reports: lmReports,
            })
          }
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer hover:border-blue-500/50 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider group-hover:text-blue-600 transition-colors">Total Calls</span>
            <PhoneCall className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
            {todayTotalCalls}
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
            Click to view breakdown →
          </div>
        </div>

        {/* Card 2: Demos Arranged */}
        <div
          onClick={() =>
            setSelectedMetricModal({
              isOpen: true,
              title: 'Demos Arranged Today',
              subtitle: 'Qualified demos scheduled for Demo Team reps',
              icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
              totalValue: `${todayDemoArranged} Demos`,
              metricKey: 'demoArranged',
              reports: lmReports,
            })
          }
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer hover:border-blue-500/50 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider group-hover:text-blue-600 transition-colors">Demos Arranged</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
            {todayDemoArranged}
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
            Click to view breakdown →
          </div>
        </div>

        {/* Card 3: Feedback Calls */}
        <div
          onClick={() =>
            setSelectedMetricModal({
              isOpen: true,
              title: 'Post-Demo Feedback Calls',
              subtitle: 'Prospect feedback and sentiment check-ins',
              icon: <MessageSquare className="w-5 h-5 text-violet-500" />,
              totalValue: `${todayFeedbackCalls} Calls`,
              metricKey: 'followUpCount',
              reports: lmReports,
            })
          }
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer hover:border-blue-500/50 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider group-hover:text-blue-600 transition-colors">Feedback Calls</span>
            <MessageSquare className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
            {todayFeedbackCalls}
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
            Click to view breakdown →
          </div>
        </div>

        {/* Card 4: Working Hours */}
        <div
          onClick={() =>
            setSelectedMetricModal({
              isOpen: true,
              title: 'Shift & Activity Hours',
              subtitle: 'Active hours logged in calling & lead outreach',
              icon: <Clock className="w-5 h-5 text-amber-500" />,
              totalValue: `${todayHours} hrs`,
              metricKey: 'workingHours',
              reports: lmReports,
            })
          }
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer hover:border-blue-500/50 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider group-hover:text-blue-600 transition-colors">Working Hours</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
            {todayHours}h
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
            Click to view breakdown →
          </div>
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

        {/* Monthly Summary (Clickable) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">
              Monthly Lead Summary
            </h3>
            <p className="text-xs text-slate-400">Overall lead conversion numbers</p>
          </div>

          <div className="space-y-3 my-auto">
            <div
              onClick={() =>
                setSelectedMetricModal({
                  isOpen: true,
                  title: 'Monthly Calls Handled',
                  subtitle: 'Cumulative calling volume for your account',
                  icon: <PhoneCall className="w-5 h-5 text-blue-500" />,
                  totalValue: `${monthlyCalls} Calls`,
                  metricKey: 'totalCalls',
                  reports: myReports,
                })
              }
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Total Calls Handled</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 font-mono text-sm">{monthlyCalls}</span>
            </div>

            <div
              onClick={() =>
                setSelectedMetricModal({
                  isOpen: true,
                  title: 'Monthly Demos Arranged',
                  subtitle: 'Cumulative qualified demos scheduled',
                  icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
                  totalValue: `${monthlyDemosArranged} Demos`,
                  metricKey: 'demoArranged',
                  reports: myReports,
                })
              }
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Total Demos Arranged</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 font-mono text-sm">{monthlyDemosArranged}</span>
            </div>

            <div
              onClick={() =>
                setSelectedMetricModal({
                  isOpen: true,
                  title: 'Monthly Revenue Impact',
                  subtitle: 'Impact revenue closed from arranged demos',
                  icon: <IndianRupee className="w-5 h-5 text-blue-500" />,
                  totalValue: `₹${monthlyRevenue.toLocaleString('en-IN')}`,
                  metricKey: 'revenue',
                  reports: myReports,
                })
              }
              className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between cursor-pointer hover:bg-blue-500/20 transition-colors"
            >
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
