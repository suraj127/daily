'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { DollarSign, CheckCircle2, Clock, IndianRupee, AlertCircle } from 'lucide-react';
import MetricDetailModal from './MetricDetailModal';

export default function RecoveryTeamDashboard() {
  const { currentUser, reports, setActiveTab } = useApp();

  const [selectedMetricModal, setSelectedMetricModal] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    totalValue: string | number;
    metricKey: 'demoDone' | 'demoArranged' | 'workingHours' | 'revenue' | 'firstCalls' | 'followUpCount' | 'salesClosed' | 'totalCalls' | 'onboarding' | 'support' | 'collections';
    reports: typeof reports;
  } | null>(null);

  const recoveryReports = reports.filter((r) => r.team === 'RECOVERY_TEAM' || r.userId === currentUser?.id);

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-900 via-pink-900 to-slate-900 text-white relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-rose-300" /> Recovery Team Dashboard
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Hello, {currentUser?.name}! 💰
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Payment Follow-ups, Overdue Recoveries, & Outstanding Collections Command. Click any card to inspect item details.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('daily-report')}
            className="h-10 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all active:scale-95"
          >
            + Submit Recovery Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Collections Today */}
        <div
          onClick={() =>
            setSelectedMetricModal({
              isOpen: true,
              title: 'Collections Collected Today',
              subtitle: 'Successful payment recoveries and receipts',
              icon: <IndianRupee className="w-5 h-5 text-emerald-500" />,
              totalValue: '₹3,40,000',
              metricKey: 'revenue',
              reports: recoveryReports,
            })
          }
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer hover:border-rose-500/50 hover:shadow-md transition-all group"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-rose-600 transition-colors">Collections Today</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">₹3,40,000</div>
          <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">Click to view breakdown →</div>
        </div>

        {/* Card 2: Overdue Resolved */}
        <div
          onClick={() =>
            setSelectedMetricModal({
              isOpen: true,
              title: 'Overdue Accounts Resolved',
              subtitle: 'Cleared pending invoices and settled balances',
              icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
              totalValue: '14 Accounts',
              metricKey: 'salesClosed',
              reports: recoveryReports,
            })
          }
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer hover:border-rose-500/50 hover:shadow-md transition-all group"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-rose-600 transition-colors">Overdue Resolved</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">14 Accounts</div>
          <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">Click to view breakdown →</div>
        </div>

        {/* Card 3: Pending Follow-ups */}
        <div
          onClick={() =>
            setSelectedMetricModal({
              isOpen: true,
              title: 'Pending Recovery Follow-ups',
              subtitle: 'Scheduled calls and client visits for payment reminders',
              icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
              totalValue: '22 Accounts',
              metricKey: 'followUpCount',
              reports: recoveryReports,
            })
          }
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer hover:border-rose-500/50 hover:shadow-md transition-all group"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-rose-600 transition-colors">Pending Follow-ups</div>
          <div className="text-2xl font-bold text-amber-500 font-mono">22 Accounts</div>
          <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">Click to view breakdown →</div>
        </div>

        {/* Card 4: Collection Rate */}
        <div
          onClick={() =>
            setSelectedMetricModal({
              isOpen: true,
              title: 'Collection Target Rate',
              subtitle: 'Percentage of overdue amounts successfully collected',
              icon: <Clock className="w-5 h-5 text-blue-500" />,
              totalValue: '92.4% Rate',
              metricKey: 'workingHours',
              reports: recoveryReports,
            })
          }
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer hover:border-rose-500/50 hover:shadow-md transition-all group"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-rose-600 transition-colors">Collection Rate</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono">92.4%</div>
          <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">Click to view breakdown →</div>
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
