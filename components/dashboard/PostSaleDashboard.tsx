'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Headphones, CheckCircle2, Clock, IndianRupee, MessageSquare } from 'lucide-react';

export default function PostSaleDashboard() {
  const { currentUser, reports, setActiveTab } = useApp();

  const myReports = reports.filter((r) => r.userId === currentUser?.id || r.team === 'POST_SALE');

  return (
    <div className="space-y-6 pb-12">
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
              Customer Onboarding, Support Tickets, & Retention Tracking Center.
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
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Onboardings</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">12</div>
          <div className="text-[11px] text-slate-400">Completed this week</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Support Tickets</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">48</div>
          <div className="text-[11px] text-slate-400">Resolved 98.5%</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">CSAT Score</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">4.9 / 5.0</div>
          <div className="text-[11px] text-slate-400">Client satisfaction</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Retention Revenue</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">₹8,50,000</div>
          <div className="text-[11px] text-slate-400">Annual renewals</div>
        </div>
      </div>
    </div>
  );
}
