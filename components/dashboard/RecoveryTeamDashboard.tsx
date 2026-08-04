'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { DollarSign, CheckCircle2, Clock, IndianRupee, AlertCircle } from 'lucide-react';

export default function RecoveryTeamDashboard() {
  const { currentUser, reports, setActiveTab } = useApp();

  return (
    <div className="space-y-6 pb-12">
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
              Payment Follow-ups, Overdue Recoveries, & Outstanding Collections Command.
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
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Collections Today</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">₹3,40,000</div>
          <div className="text-[11px] text-slate-400">Payment receipts logged</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Overdue Resolved</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">14 Accounts</div>
          <div className="text-[11px] text-slate-400">Invoices cleared</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Follow-ups</div>
          <div className="text-2xl font-bold text-amber-500 font-mono">22 Accounts</div>
          <div className="text-[11px] text-slate-400">Scheduled for call/visit</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Collection Rate</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono">92.4%</div>
          <div className="text-[11px] text-slate-400">Target achievement</div>
        </div>
      </div>
    </div>
  );
}
