'use client';

import React, { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Search, X, User as UserIcon, FileText, Calendar, IndianRupee, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function GlobalSearchModal() {
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery, reports, users, setActiveTab, setSelectedDate } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const query = searchQuery.trim().toLowerCase();

  const matchingUsers = query
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.department?.toLowerCase().includes(query) ||
          u.username.toLowerCase().includes(query)
      )
    : [];

  const matchingReports = query
    ? reports.filter(
        (r) =>
          r.userName.toLowerCase().includes(query) ||
          r.achievements?.toLowerCase().includes(query) ||
          r.problemsFaced?.toLowerCase().includes(query) ||
          r.date.includes(query) ||
          String(r.performance.revenue).includes(query)
      )
    : [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Top Search Input */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <Search className="w-5 h-5 text-violet-500 shrink-0" />
            <input
              type="text"
              placeholder="Search employee, customer, phone, date (e.g. 2026-08-04), comments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Results Area */}
          <div className="p-4 overflow-y-auto space-y-4 flex-1">
            {!query ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                Type employee name (e.g., <code className="text-violet-500 font-mono">Aniket</code>), revenue value, date, or keywords...
              </div>
            ) : matchingUsers.length === 0 && matchingReports.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No matching employees or daily reports found for &quot;{searchQuery}&quot;.
              </div>
            ) : (
              <>
                {/* Matching Employees */}
                {matchingUsers.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <UserIcon className="w-3.5 h-3.5 text-violet-500" /> Employees ({matchingUsers.length})
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {matchingUsers.map((u) => (
                        <div
                          key={u.id}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setActiveTab('leaderboard');
                          }}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-violet-50 dark:hover:bg-violet-950/40 border border-slate-200 dark:border-slate-700/60 cursor-pointer transition-colors flex items-center justify-between"
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{u.name}</div>
                            <div className="text-[10px] text-slate-400">{u.department || 'Sales Dept'}</div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matching Reports */}
                {matchingReports.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-500" /> Daily Reports ({matchingReports.length})
                    </div>
                    <div className="space-y-2">
                      {matchingReports.map((r) => (
                        <div
                          key={r.id}
                          onClick={() => {
                            setSelectedDate(r.date);
                            setIsSearchOpen(false);
                            setActiveTab('calendar');
                          }}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-violet-50 dark:hover:bg-violet-950/40 border border-slate-200 dark:border-slate-700/60 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                              {r.userName}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" /> {r.date}
                            </span>
                          </div>
                          {r.achievements && (
                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                              {r.achievements}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-4 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <span className="flex items-center">
                              <IndianRupee className="w-3 h-3" /> ₹{r.performance.revenue.toLocaleString('en-IN')}
                            </span>
                            <span className="text-slate-400 font-normal">
                              Sales Closed: {r.performance.salesClosed}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
