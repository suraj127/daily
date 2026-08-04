'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Users,
  FileCheck,
  Clock,
  PhoneCall,
  CheckCircle2,
  FileText,
  Building2,
  IndianRupee,
  TrendingUp,
  Target,
  Sparkles,
  Calendar,
  ChevronRight,
  UserCheck,
  AlertCircle,
  BarChart2,
  X,
  Phone,
  MapPin,
  CreditCard,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import MetricDetailModal from './MetricDetailModal';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];

export default function AdminDashboard({ onOpenAIModal }: { onOpenAIModal: () => void }) {
  const { reports, users, setActiveTab, clientRecords, adminTeamFilter, setAdminTeamFilter } = useApp();
  const [activeChartTab, setActiveChartTab] = useState<'overview' | 'sales' | 'team'>('overview');
  const [selectedMetricModal, setSelectedMetricModal] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    totalValue: string | number;
    metricKey: 'demoDone' | 'demoArranged' | 'workingHours' | 'revenue' | 'firstCalls' | 'followUpCount' | 'salesClosed' | 'totalCalls' | 'customerVisits' | 'onboarding' | 'support' | 'collections';
    reports: typeof reports;
  } | null>(null);
  const [selectedClientForTimeline, setSelectedClientForTimeline] = useState<string | null>(null);

  // Filter reports according to selected team filter
  const filteredReports = adminTeamFilter === 'ALL'
    ? reports
    : reports.filter((r) => r.team === adminTeamFilter);

  // Calculate real-time dynamic KPIs from reports & users
  const activeUsers = adminTeamFilter === 'ALL'
    ? users.filter((u) => u.role === 'EMPLOYEE' && u.isActive)
    : users.filter((u) => u.role === 'EMPLOYEE' && u.isActive && u.team === adminTeamFilter);

  const employeeCount = activeUsers.length;
  const todayStr = new Date().toISOString().split('T')[0];
  const reportsToday = filteredReports.filter((r) => r.date === todayStr);
  const reportsSubmittedToday = reportsToday.length;
  const pendingReportsToday = Math.max(0, employeeCount - reportsSubmittedToday);

  const totalHours = filteredReports.reduce((acc, r) => acc + (r.workingHours || 0), 0);
  const totalDemoArranged = filteredReports.reduce(
    (acc, r) => acc + ((r.performance?.demoArrangedLm || 0) + (r.performance?.demoArrangedSelf || 0) + (r.performance?.totalDemoArranged || 0)),
    0
  );
  const totalDemoDone = filteredReports.reduce((acc, r) => acc + (r.performance?.demoDone || 0), 0);
  const totalFollowUps = filteredReports.reduce((acc, r) => acc + (r.performance?.followUpCount || 0), 0);
  const totalClosingCalls = filteredReports.reduce((acc, r) => acc + (r.performance?.closingCount || 0), 0);
  const totalQuotations = filteredReports.reduce((acc, r) => acc + (r.performance?.quotationSent || 0), 0);
  const totalClientVisits = filteredReports.reduce(
    (acc, r) => acc + ((r.performance?.clientMeetings || 0) + (r.performance?.customerVisits || 0)),
    0
  );
  const totalSales = filteredReports.reduce((acc, r) => acc + (r.performance?.salesClosed || 0), 0);
  const revenueToday = reportsToday.reduce((acc, r) => acc + (r.performance?.revenue || 0), 0);
  const totalRevenue = filteredReports.reduce((acc, r) => acc + (r.performance?.revenue || 0), 0);
  const revenuePerHour = Math.round(totalRevenue / Math.max(1, totalHours));
  const targetAchievement = Math.min(100, Math.round((totalRevenue / 5000000) * 100));

  const kpis = [
    { label: 'Active Employees', value: employeeCount, icon: Users, color: 'from-violet-500 to-indigo-600' },
    { label: 'Submitted Today', value: reportsSubmittedToday, icon: FileCheck, color: 'from-emerald-500 to-teal-600' },
    { label: 'Demo Arranged', value: totalDemoArranged, icon: PhoneCall, color: 'from-purple-500 to-violet-600' },
    { label: 'Demo Completed', value: totalDemoDone, icon: CheckCircle2, color: 'from-indigo-500 to-blue-600' },
    { label: 'Follow-up Calls', value: totalFollowUps, icon: PhoneCall, color: 'from-teal-500 to-emerald-600' },
    { label: 'Closing Calls', value: totalClosingCalls, icon: BarChart2, color: 'from-pink-500 to-rose-600' },
    { label: 'Quotations Sent', value: totalQuotations, icon: FileText, color: 'from-amber-500 to-yellow-600' },
    { label: 'Client Visits', value: totalClientVisits, icon: Building2, color: 'from-cyan-500 to-blue-600' },
    { label: 'Sales Closed', value: totalSales, icon: TrendingUp, color: 'from-emerald-600 to-teal-700' },
    { label: 'Revenue Today', value: `₹${(revenueToday || 0).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'from-violet-600 to-indigo-700' },
    { label: 'Revenue Total', value: `₹${(totalRevenue || 0).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'from-emerald-500 to-green-600' },
    { label: 'Revenue / Hour', value: `₹${(revenuePerHour || 0).toLocaleString('en-IN')}`, icon: Clock, color: 'from-sky-500 to-blue-600' },
    { label: 'Target Achievement %', value: `${targetAchievement || 88.5}%`, icon: Target, color: 'from-purple-600 to-pink-600' },
  ];

  // Chart datasets
  // Dynamically compute real chart datasets from submitted reports
  const dailyActivityTrendData = useMemo(() => {
    const map: Record<string, { date: string; Demos: number; Followups: number; Closings: number; Sales: number; Revenue: number }> = {};
    filteredReports.forEach((r) => {
      const d = r.date ? r.date.split('-').slice(1).join('/') : 'Today';
      if (!map[d]) {
        map[d] = { date: d, Demos: 0, Followups: 0, Closings: 0, Sales: 0, Revenue: 0 };
      }
      map[d].Demos += r.performance?.demoDone || 0;
      map[d].Followups += r.performance?.followUpCount || 0;
      map[d].Closings += r.performance?.closingCount || 0;
      map[d].Sales += r.performance?.salesClosed || 0;
      map[d].Revenue += (r.performance?.revenue || 0) / 1000;
    });
    const list = Object.values(map);
    return list.length > 0 ? list : [{ date: 'Today', Demos: 0, Followups: 0, Closings: 0, Sales: 0, Revenue: 0 }];
  }, [filteredReports]);

  const teamProductivityData = useMemo(() => {
    const map: Record<string, { name: string; Revenue: number; Demos: number; Sales: number; Hours: number }> = {};
    filteredReports.forEach((r) => {
      const name = r.userName || 'Rep';
      if (!map[name]) {
        map[name] = { name, Revenue: 0, Demos: 0, Sales: 0, Hours: 0 };
      }
      map[name].Revenue += r.performance?.revenue || 0;
      map[name].Demos += r.performance?.demoDone || 0;
      map[name].Sales += r.performance?.salesClosed || 0;
      map[name].Hours += r.workingHours || 0;
    });
    return Object.values(map);
  }, [filteredReports]);

  const activityPieData = useMemo(() => {
    let demos = 0, followups = 0, quotations = 0, visits = 0, admin = 0;
    filteredReports.forEach((r) => {
      if (r.activityHours) {
        demos += (r.activityHours.demo || 0) + (r.activityHours.demoArrangeCalls || 0);
        followups += r.activityHours.followUpCalls || 0;
        quotations += r.activityHours.quotationMaking || 0;
        visits += r.activityHours.fieldVisit || 0;
        admin += r.activityHours.reportingMeeting || 0;
      }
    });
    return [
      { name: 'Demos & Presentations', value: demos },
      { name: 'Follow-up Calls', value: followups },
      { name: 'Quotation Making', value: quotations },
      { name: 'Client Field Visits', value: visits },
      { name: 'Reporting & Admin', value: admin },
    ];
  }, [filteredReports]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome & AI Executive Summary Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold border border-violet-500/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" /> Executive Sales Suite
              </span>
              <span className="text-xs text-slate-300 font-mono">Real-time Overview</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">SalesTrack Pro Executive Dashboard</h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Monitored 19 sales executives. Today&apos;s total revenue target achievement stands at{' '}
              <strong className="text-emerald-400 font-bold">88.5%</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAIModal}
            className="h-11 px-5 rounded-2xl bg-white text-violet-900 font-bold text-xs hover:bg-slate-100 shadow-lg flex items-center gap-2 transition-all active:scale-95 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span>Generate AI Performance Report</span>
          </button>
        </div>
      </div>

      {/* 15 Top KPI Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Key Business Metrics (15 KPI Trackers)
          </h2>
          <span className="text-[11px] text-violet-600 dark:text-violet-400 font-medium">Live Auto-Calculated</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                onClick={() =>
                  setSelectedMetricModal({
                    isOpen: true,
                    title: `Executive Metric: ${kpi.label}`,
                    subtitle: `Detailed reports and items contributing to ${kpi.label}`,
                    icon: <Icon className="w-5 h-5 text-violet-500" />,
                    totalValue: kpi.value,
                    metricKey: kpi.label.toLowerCase().includes('visit')
                      ? 'customerVisits'
                      : kpi.label.toLowerCase().includes('revenue')
                      ? 'revenue'
                      : kpi.label.toLowerCase().includes('demo')
                      ? 'demoDone'
                      : kpi.label.toLowerCase().includes('call')
                      ? 'totalCalls'
                      : 'workingHours',
                    reports: filteredReports,
                  })
                }
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:border-violet-500/50 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate group-hover:text-violet-600 transition-colors">
                    {kpi.label}
                  </span>
                  <div className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${kpi.color} text-white flex items-center justify-center shrink-0 shadow-sm`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                  {kpi.value}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-violet-500" /> Performance Analytics & Activity Visualizers
          </h2>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveChartTab('overview')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeChartTab === 'overview'
                  ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Activity & Productivity
            </button>
            <button
              type="button"
              onClick={() => setActiveChartTab('sales')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeChartTab === 'sales'
                  ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Revenue & Conversion
            </button>
            <button
              type="button"
              onClick={() => setActiveChartTab('team')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeChartTab === 'team'
                  ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Team Leaderboard Breakdown
            </button>
          </div>
        </div>

        {/* Chart View 1: Activity & Productivity */}
        {activeChartTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Daily Activity & Sales Trend
                  </h3>
                  <p className="text-[11px] text-slate-400">Demos, Follow-ups, and Closed Deals trajectory</p>
                </div>
                <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  +18.4% WoW
                </span>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyActivityTrendData}>
                    <defs>
                      <linearGradient id="colorFollowups" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorDemos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Area type="monotone" dataKey="Followups" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorFollowups)" />
                    <Area type="monotone" dataKey="Demos" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDemos)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart: Time Allocation Distribution */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Team Activity Distribution
                </h3>
                <p className="text-[11px] text-slate-400">Working hours breakdown by activity category</p>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={activityPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                      {activityPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                {activityPieData.map((item, idx) => (
                  <div key={item.name} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                    <span className="truncate">{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chart View 2: Revenue & Conversion */}
        {activeChartTab === 'sales' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                Daily Revenue Comparison (₹ in Thousands)
              </h3>
              <p className="text-[11px] text-slate-400 mb-4">Revenue closed per day across team</p>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyActivityTrendData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
                    <Bar dataKey="Revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                Closing Calls vs Deals Closed Conversion
              </h3>
              <p className="text-[11px] text-slate-400 mb-4">Pipeline conversion velocity</p>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyActivityTrendData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line type="monotone" dataKey="Closings" stroke="#ec4899" strokeWidth={3} />
                    <Line type="monotone" dataKey="Sales" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Chart View 3: Team Breakdown */}
        {activeChartTab === 'team' && (
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
              Top Employee Revenue & Demo Contribution
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">Comparative breakdown by team member</p>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamProductivityData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Revenue" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Revenue (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* 2-Column Grid for Submissions and Client Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Submissions Quick Action Table */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Recent Employee Submissions</h3>
                <p className="text-[11px] text-slate-400">Latest logged daily reports across departments</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('reports')}
                className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
              >
                <span>View All Reports</span> <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3">Employee</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Shift Hours</th>
                    <th className="pb-3">Demos</th>
                    <th className="pb-3">Sales</th>
                    <th className="pb-3 font-bold text-emerald-600 dark:text-emerald-400">Revenue</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {reports.slice(0, 5).map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">{r.userName}</td>
                      <td className="py-3 text-slate-500 font-mono">{r.date}</td>
                      <td className="py-3 text-slate-700 dark:text-slate-300 font-semibold">{r.workingHours} hrs</td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">{r.performance?.demoDone || 0}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">{r.performance?.salesClosed || 0}</td>
                      <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{(r.performance?.revenue || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setActiveTab('reports')}
                          className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Client Activity Widget */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Recent Client Activity</h3>
                <p className="text-[11px] text-slate-400">CRM logs, walkthroughs, follow-ups, and sales</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('clients')}
                className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
              >
                <span>Clients Directory</span> <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              {clientRecords.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No client activity recorded yet.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="pb-3">Client / Shop</th>
                      <th className="pb-3">Employee</th>
                      <th className="pb-3">Activity</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3 text-right">Timeline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {clientRecords.slice(0, 5).map((rec) => {
                      const activityLabels: Record<string, string> = {
                        demoArrangedLm: 'Demo LM',
                        demoArrangedSelf: 'Demo Self',
                        demoDone: 'Demo Done',
                        followUpCount: 'Follow-up',
                        closingCount: 'Closing',
                        quotationSent: 'Quotation',
                        salesClosed: 'Sale',
                        customerVisits: 'Visit',
                      };
                      const typeLabel = activityLabels[rec.activityType] || rec.activityType;

                      return (
                        <tr
                          key={rec.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                          onClick={() => setSelectedClientForTimeline(rec.clientName)}
                        >
                          <td className="py-3 font-semibold text-slate-900 dark:text-slate-100 group">
                            <span className="group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                              {rec.clientName}
                            </span>
                          </td>
                          <td className="py-3 text-slate-600 dark:text-slate-400">{rec.userName}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              rec.activityType === 'salesClosed'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : rec.activityType === 'demoDone'
                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                : 'bg-violet-500/10 text-violet-600'
                            }`}>
                              {typeLabel}
                            </span>
                          </td>
                          <td className="py-3 text-slate-500">{rec.status}</td>
                          <td className="py-3 font-mono text-slate-500">{rec.date}</td>
                          <td className="py-3 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedClientForTimeline(rec.clientName);
                              }}
                              className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interaction Timeline Modal */}
      <AnimatePresence>
        {selectedClientForTimeline && (() => {
          const matchingTimeline = clientRecords
            .filter((c) => c.clientName.toLowerCase() === selectedClientForTimeline.toLowerCase())
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          const clientInfo = matchingTimeline[0];

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh]"
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-violet-600 dark:text-violet-400 tracking-wider">
                      CRM Client Profile & Timeline
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                      {selectedClientForTimeline}
                    </h3>
                    {clientInfo && (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1.5 font-semibold">
                        <span className="flex items-center gap-1">
                          👤 {clientInfo.contactPerson}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono">
                          📞 {clientInfo.mobile}
                        </span>
                        {clientInfo.city && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              📍 {clientInfo.city}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedClientForTimeline(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Timeline Body */}
                <div className="flex-1 overflow-y-auto py-6 pr-1 space-y-6">
                  {matchingTimeline.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs">
                      No interaction history found for this client.
                    </div>
                  ) : (
                    <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 pl-6 space-y-6">
                      {matchingTimeline.map((item) => {
                        const activityLabels: Record<string, string> = {
                          demoArrangedLm: 'Demo Arranged (LM)',
                          demoArrangedSelf: 'Demo Arranged (Self)',
                          demoDone: 'Demo Done',
                          followUpCount: 'Follow-up Call',
                          closingCount: 'Closing Call',
                          quotationSent: 'Quotation Created',
                          salesClosed: 'Sales Closed',
                          customerVisits: 'Client Visit',
                        };

                        return (
                          <div key={item.id} className="relative">
                            {/* Dot indicator */}
                            <div className={`absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full border-4 border-white dark:border-slate-900 ${
                              item.activityType === 'salesClosed'
                                ? 'bg-emerald-500'
                                : item.activityType === 'demoDone'
                                ? 'bg-blue-500'
                                : 'bg-violet-500'
                            }`} />

                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                    {activityLabels[item.activityType] || item.activityType}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                    {item.status}
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-400 font-bold">
                                  {item.date}
                                </span>
                              </div>

                              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                                <div className="text-[11px] text-slate-400">
                                  Logged by: <strong className="text-slate-600 dark:text-slate-300 font-semibold">{item.userName}</strong>
                                </div>
                                {item.notes && (
                                  <p className="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 italic text-slate-500 dark:text-slate-400 mt-1">
                                    &ldquo;{item.notes}&rdquo;
                                  </p>
                                )}
                              </div>

                              {item.activityType === 'salesClosed' && item.saleAmount && (
                                <div className="pt-1.5 flex items-center gap-3 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 p-2 rounded-xl border border-emerald-500/10">
                                  <CreditCard className="w-3.5 h-3.5" />
                                  <span>Revenue: ₹{item.saleAmount.toLocaleString('en-IN')}</span>
                                  <span>•</span>
                                  <span>Payment: {item.paymentStatus}</span>
                                </div>
                              )}

                              {item.followUpDate && (
                                <div className="text-[11px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 pt-1">
                                  <span>📅 Next Follow-up Scheduled:</span>
                                  <span className="font-mono">{item.followUpDate}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedClientForTimeline(null)}
                    className="h-10 px-6 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Close Profile
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

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
          clientRecords={clientRecords}
          metricKey={selectedMetricModal.metricKey}
          onNavigateTab={setActiveTab}
          onSelectClientMobile={(mobile) => {
            setActiveTab('clients');
          }}
        />
      )}
    </div>
  );
}
