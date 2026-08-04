'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { User, Shield, Mail, Phone, Building2, Calendar, Clock, LogOut, CheckCircle2 } from 'lucide-react';

export default function ProfileView() {
  const { currentUser, logout, reports } = useApp();

  const userReports = reports.filter((r) => r.userId === currentUser?.id);
  const totalHours = userReports.reduce((acc, r) => acc + (r.workingHours || 0), 0);
  const totalRevenue = userReports.reduce((acc, r) => acc + (r.performance?.revenue || 0), 0);

  const getTeamName = () => {
    if (currentUser?.role === 'ADMIN') return 'Executive Administration';
    switch (currentUser?.team) {
      case 'DEMO_TEAM': return 'Demo Team';
      case 'LEAD_MANAGEMENT': return 'Lead Management Team';
      case 'POST_SALE': return 'Post Sale Team';
      case 'RECOVERY_TEAM': return 'Recovery Team';
      default: return 'Sales Operations';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Profile Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-3xl flex items-center justify-center shadow-xl shadow-violet-500/20 shrink-0">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {currentUser?.name}
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400">
                {getTeamName()}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-semibold">{currentUser?.designation || 'Sales Account Executive'}</p>
            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1 font-mono">
              <Mail className="w-3.5 h-3.5 text-violet-500" /> {currentUser?.email || `${currentUser?.username}@salestrack.pro`}
            </p>
          </div>
        </div>

        {/* User Key Performance Summaries */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center">
            <span className="text-xs text-slate-400 font-semibold block mb-0.5">Reports Submitted</span>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">{userReports.length}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center">
            <span className="text-xs text-slate-400 font-semibold block mb-0.5">Total Hours Logged</span>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">{totalHours.toFixed(1)}h</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold block mb-0.5">Total Revenue Impact</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">₹{totalRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={logout}
            className="h-11 px-6 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
