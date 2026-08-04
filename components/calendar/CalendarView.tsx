'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { DailyReport } from '@/lib/types';
import { getFormattedDate } from '@/lib/mock-data';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  IndianRupee,
  User,
  FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CalendarView() {
  const { reports, currentUser, setSelectedDate, setActiveTab } = useApp();

  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDayReport, setSelectedDayReport] = useState<DailyReport | null>(null);

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  // Helper to get days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentMonthDate(new Date());
  };

  const getDayStatus = (dayNum: number) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(dayNum).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    const d = new Date(year, month, dayNum);
    const dayOfWeek = d.getDay();

    // Weekend check
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { status: 'WEEKEND', color: 'bg-slate-100 dark:bg-slate-800/40 text-slate-400', label: 'Weekend' };
    }

    const reportForDay = reports.find(
      (r) => r.date === dateStr && (currentUser?.role === 'ADMIN' || r.userId === currentUser?.id)
    );

    if (reportForDay) {
      return { status: 'SUBMITTED', color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400', label: 'Submitted', report: reportForDay };
    }

    const todayStr = getFormattedDate(0);
    if (dateStr < todayStr) {
      return { status: 'LATE', color: 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400', label: 'Late' };
    }

    if (dateStr === todayStr) {
      return { status: 'PENDING', color: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 animate-pulse', label: 'Pending' };
    }

    return { status: 'FUTURE', color: 'bg-slate-50 dark:bg-slate-900 text-slate-400', label: 'Upcoming' };
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[11px] font-bold">
              Attendance & Report Calendar
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-violet-500" /> {monthNames[month]} {year}
          </h1>
        </div>

        {/* Legend & Month Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Color Coding Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs">
        <span className="font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">
          Color Status Key:
        </span>
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Green (Submitted)
          </span>
          <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Yellow (Pending)
          </span>
          <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Red (Late)
          </span>
          <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Blue (Holiday)
          </span>
          <span className="flex items-center gap-1.5 text-slate-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Grey (Weekend)
          </span>
        </div>
      </div>

      {/* Monthly Grid */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Day of Week Header */}
        <div className="grid grid-cols-7 text-center text-xs font-bold uppercase tracking-wider text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-800">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Day Cells */}
        <div className="grid grid-cols-7 gap-2 pt-3">
          {/* Empty offset padding cells */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-24 rounded-2xl bg-transparent" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dayInfo = getDayStatus(dayNum);
            const formattedMonth = String(month + 1).padStart(2, '0');
            const formattedDay = String(dayNum).padStart(2, '0');
            const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

            return (
              <motion.div
                key={dayNum}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setSelectedDate(dateStr);
                  if (dayInfo.report) {
                    setSelectedDayReport(dayInfo.report);
                  } else {
                    setActiveTab('daily-report');
                  }
                }}
                className={`h-24 p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${dayInfo.color}`}
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span>{dayNum}</span>
                  <span className="text-[10px] uppercase font-semibold">{dayInfo.label}</span>
                </div>

                {dayInfo.report ? (
                  <div className="text-[11px] space-y-0.5">
                    <div className="font-bold truncate text-slate-900 dark:text-slate-100">
                      ₹{(dayInfo.report.performance?.revenue || 0).toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {dayInfo.report.workingHours}h • {dayInfo.report.performance?.demoDone || 0} demos
                    </div>
                  </div>
                ) : (
                  <div className="text-[10px] opacity-60 italic">
                    {dayInfo.status === 'WEEKEND' ? 'Off Day' : 'No Report'}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Day Report Modal */}
      <AnimatePresence>
        {selectedDayReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-violet-500" /> Daily Report: {selectedDayReport.userName}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">Date: {selectedDayReport.date}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDayReport(null)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block text-[10px]">Working Hours</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono text-sm">
                    {selectedDayReport.workingHours} hrs
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-emerald-700 dark:text-emerald-400 block text-[10px]">Revenue Closed</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                    ₹{(selectedDayReport.performance?.revenue || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {selectedDayReport.achievements && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Achievements</span>
                  <p className="text-slate-600 dark:text-slate-400">{selectedDayReport.achievements}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDayReport(null);
                    setActiveTab('daily-report');
                  }}
                  className="w-full h-10 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-colors"
                >
                  Edit / View Full Form
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
