'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, User, FileText, ArrowRight, PhoneCall, CheckCircle2, Clock, IndianRupee } from 'lucide-react';
import { DailyReport } from '@/lib/types';

export interface MetricDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  totalValue: string | number;
  reports: DailyReport[];
  metricKey: 'demoDone' | 'demoArranged' | 'workingHours' | 'revenue' | 'firstCalls' | 'followUpCount' | 'salesClosed' | 'totalCalls' | 'onboarding' | 'support' | 'collections';
  onNavigateTab?: (tab: string) => void;
}

export default function MetricDetailModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  totalValue,
  reports,
  metricKey,
  onNavigateTab,
}: MetricDetailModalProps) {
  if (!isOpen) return null;

  const getNumericMetricValue = (r: DailyReport): number => {
    switch (metricKey) {
      case 'demoDone':
        return r.performance?.demoDone || 0;
      case 'demoArranged':
        return (r.performance?.demoArrangedLm || 0) + (r.performance?.demoArrangedSelf || 0);
      case 'workingHours':
        return r.workingHours || 0;
      case 'revenue':
        return r.performance?.revenue || 0;
      case 'followUpCount':
        return r.performance?.followUpCount || 0;
      case 'salesClosed':
        return r.performance?.salesClosed || 0;
      case 'totalCalls':
      case 'firstCalls':
        return r.performance?.totalCalls || 0;
      default:
        return r.performance?.revenue || r.workingHours || 0;
    }
  };

  const getMetricFormatted = (r: DailyReport): string => {
    const val = getNumericMetricValue(r);
    if (metricKey === 'revenue') return `₹${val.toLocaleString('en-IN')}`;
    if (metricKey === 'workingHours') return `${val} hrs`;
    if (metricKey === 'followUpCount') return `${val} Follow-ups`;
    if (metricKey === 'demoDone') return `${val} Demos Done`;
    if (metricKey === 'demoArranged') return `${val} Demos Arranged`;
    if (metricKey === 'salesClosed') return `${val} Sales`;
    return `${val} Calls/Items`;
  };

  // Group by Employee Name for Breakdown Summary
  const employeeBreakdownMap: Record<string, { count: number; team: string }> = {};
  reports.forEach((r) => {
    const name = r.userName || 'Unknown Rep';
    const val = getNumericMetricValue(r);
    if (!employeeBreakdownMap[name]) {
      employeeBreakdownMap[name] = { count: 0, team: r.team || 'DEMO_TEAM' };
    }
    employeeBreakdownMap[name].count += val;
  });

  const employeeBreakdownList = Object.entries(employeeBreakdownMap)
    .map(([name, data]) => ({ name, count: data.count, team: data.team }))
    .sort((a, b) => b.count - a.count);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  {icon}
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h2>
                <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Metric Summary & Employee Breakdown Cards */}
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Metric Output</span>
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">{totalValue}</span>
              </div>
              <div className="text-right text-xs text-slate-400 font-mono">
                {reports.length} {reports.length === 1 ? 'daily report' : 'daily reports'}
              </div>
            </div>

            {/* Per-Employee Output Breakdown */}
            {employeeBreakdownList.length > 0 && (
              <div className="p-4 rounded-2xl bg-violet-500/5 dark:bg-violet-950/20 border border-violet-500/15 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 block">
                  📊 Output Made By Each Employee ({employeeBreakdownList.length} Reps)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {employeeBreakdownList.map((emp) => (
                    <div key={emp.name} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{emp.name}</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 ml-1">
                        {metricKey === 'revenue' ? `₹${emp.count.toLocaleString('en-IN')}` : emp.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Detailed Individual Reports */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Individual Daily Activity Logs
            </span>

            {reports.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 italic">
                No activity records logged for this metric yet.
              </div>
            ) : (
              reports.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-violet-500/40 hover:shadow-md transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-violet-500/10 text-violet-600 font-bold text-xs flex items-center justify-center">
                        {r.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          {r.userName}
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 font-normal">
                            {r.team ? r.team.replace('_', ' ') : 'DEMO TEAM'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-slate-400" /> {r.date}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs font-mono">
                        {getMetricFormatted(r)}
                      </span>
                    </div>
                  </div>

                  {r.achievements && (
                    <div className="text-xs text-slate-600 dark:text-slate-300 pl-9 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                      <span className="font-semibold text-slate-500">Key Highlight: </span>
                      {r.achievements}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateTab('reports');
                }}
                className="px-4 py-2 rounded-xl bg-violet-600 text-white font-bold text-xs hover:bg-violet-500 shadow-md flex items-center gap-1.5 transition-all"
              >
                <span>View Full Reports Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
