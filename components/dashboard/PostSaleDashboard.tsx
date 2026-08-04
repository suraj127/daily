'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Headphones, CheckCircle2, Clock, IndianRupee, MessageSquare } from 'lucide-react';
import MetricDetailModal from './MetricDetailModal';

export default function PostSaleDashboard() {
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

  const postSaleReports = reports.filter((r) => r.team === 'POST_SALE' || r.userId === currentUser?.id);

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1">
                <Headphones className="w-3.5 h-3.5 text-emerald-300" /> Post Sale Dashboard
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Hello, {currentUser?.name}! 🎧
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Customer Onboarding, Support Tickets, & Retention Tracking Center. Click any card to inspect item details.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('daily-report')}
            className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
          >
            + Submit Post Sale Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Onboardings */}
        <div
          onClick={() =>
            setSelectedMetricModal({
              isOpen: true,
              title: 'Customer Onboardings',
              subtitle: 'Completed client setup and product training',
              icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
              totalValue: '12 Onboarded',
              metricKey: 'salesClosed',
              reports: postSaleReports,
            })
          }
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer hover:border-emerald-500/50 hover:shadow-md transition-all group"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-emerald-600 transition-colors">Onboardings</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">12</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Click to view breakdown →</div>
        </div>

        {/* Card 2: Support Tickets */}
        <div
          onClick={() =>
            setSelectedMetricModal({
              isOpen: true,
              title: 'Support Tickets Handled',
              subtitle: 'Resolved support tickets and technical assistance',
              icon: <Headphones className="w-5 h-5 text-blue-500" />,
              totalValue: '48 Tickets',
              metricKey: 'followUpCount',
              reports: postSaleReports,
            })
          }
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer hover:border-emerald-500/50 hover:shadow-md transition-all group"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-emerald-600 transition-colors">Support Tickets</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">48</div>
          <div className="text-[11px] text-slate-400">Resolved 98.5%</div>
        </div>

        {/* Card 3: CSAT Score */}
        <div
          onClick={() =>
            setSelectedMetricModal({
              isOpen: true,
              title: 'Customer Satisfaction (CSAT)',
              subtitle: 'Average client feedback rating out of 5 stars',
              icon: <MessageSquare className="w-5 h-5 text-amber-500" />,
              totalValue: '4.9 / 5.0 Rating',
              metricKey: 'workingHours',
              reports: postSaleReports,
            })
          }
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer hover:border-emerald-500/50 hover:shadow-md transition-all group"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-emerald-600 transition-colors">CSAT Score</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">4.9 / 5.0</div>
          <div className="text-[11px] text-slate-400">Client satisfaction</div>
        </div>

        {/* Card 4: Retention Revenue */}
        <div
          onClick={() =>
            setSelectedMetricModal({
              isOpen: true,
              title: 'Annual Retention Revenue',
              subtitle: 'Recurring revenue retained from customer renewals',
              icon: <IndianRupee className="w-5 h-5 text-emerald-500" />,
              totalValue: '₹8,50,000',
              metricKey: 'revenue',
              reports: postSaleReports,
            })
          }
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer hover:border-emerald-500/50 hover:shadow-md transition-all group"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-emerald-600 transition-colors">Retention Revenue</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">₹8,50,000</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Click to view breakdown →</div>
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
