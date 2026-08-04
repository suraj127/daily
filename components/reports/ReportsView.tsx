'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { DailyReport } from '@/lib/types';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Search,
  Filter,
  Eye,
  Trash2,
  Calendar,
  IndianRupee,
  Clock,
  ChevronDown,
  X,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ReportsView() {
  const { reports, users, currentUser, setSelectedDate, setActiveTab, deleteReport, updateReport } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('ALL');
  const [teamFilter, setTeamFilter] = useState<string>('ALL');
  const [minRevenueFilter, setMinRevenueFilter] = useState<number>(0);
  const [selectedReportDetail, setSelectedReportDetail] = useState<DailyReport | null>(null);
  const [editingReport, setEditingReport] = useState<DailyReport | null>(null);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Team Data Isolation Scope
  const scopedReports = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'ADMIN') return reports;
    return reports.filter((r) => r.team === currentUser.team || r.userId === currentUser.id);
  }, [reports, currentUser]);

  const filteredReports = scopedReports.filter((r) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = r.userName.toLowerCase().includes(q);
      const matchAch = r.achievements?.toLowerCase().includes(q);
      const matchDate = r.date.includes(q);
      if (!matchName && !matchAch && !matchDate) return false;
    }
    if (employeeFilter !== 'ALL' && r.userName.toLowerCase() !== employeeFilter.toLowerCase()) {
      return false;
    }
    if (teamFilter !== 'ALL' && r.team !== teamFilter) {
      return false;
    }
    if (minRevenueFilter > 0 && (r.performance?.revenue || 0) < minRevenueFilter) {
      return false;
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['Date', 'Employee', 'Hours', 'Demos', 'Followups', 'Sales', 'Revenue (INR)'];
    const rows = filteredReports.map((r) => [
      r.date,
      `"${r.userName}"`,
      r.workingHours,
      r.performance.demoDone,
      r.performance.followUpCount,
      r.performance.salesClosed,
      r.performance.revenue,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SalesTrack_Pro_Reports_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSelectAll = () => {
    if (selectedRowIds.length === filteredReports.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(filteredReports.map((r) => r.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[11px] font-bold">
              Database Records Explorer
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-violet-500" /> All Employee Daily Reports
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="h-10 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* Multi Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search report notes, employee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none"
          />
        </div>

        {/* Employee Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-400 shrink-0">Employee:</label>
          <select
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
          >
            <option value="ALL">All Representatives</option>
            {users.map((u) => (
              <option key={u.id} value={u.name}>{u.name}</option>
            ))}
          </select>
        </div>

        {/* Min Revenue Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-400 shrink-0">Min Revenue:</label>
          <select
            value={minRevenueFilter}
            onChange={(e) => setMinRevenueFilter(Number(e.target.value))}
            className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
          >
            <option value={0}>Any Amount</option>
            <option value={100000}>≥ ₹1,00,000</option>
            <option value={300000}>≥ ₹3,00,000</option>
            <option value={500000}>≥ ₹5,00,000</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span>Showing {filteredReports.length} recorded daily reports</span>
          {selectedRowIds.length > 0 && (
            <span className="text-violet-600 dark:text-violet-400 font-bold">
              {selectedRowIds.length} items selected
            </span>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search reports by employee or achievements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 pl-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedRowIds.length > 0 && selectedRowIds.length === filteredReports.length}
                    onChange={toggleSelectAll}
                    className="rounded text-violet-600"
                  />
                </th>
                <th className="pb-3">Employee</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Hours</th>
                <th className="pb-3">Demos</th>
                <th className="pb-3">Follow-ups</th>
                <th className="pb-3">Sales</th>
                <th className="pb-3">Revenue</th>
                <th className="pb-3">Mood</th>
                <th className="pb-3 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredReports.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 pl-4">
                    <input
                      type="checkbox"
                      checked={selectedRowIds.includes(r.id)}
                      onChange={() => toggleSelectRow(r.id)}
                      className="rounded text-violet-600"
                    />
                  </td>
                  <td className="py-3 font-bold text-slate-900 dark:text-slate-100">{r.userName}</td>
                  <td className="py-3 font-mono text-slate-500">{r.date}</td>
                  <td className="py-3 font-semibold text-slate-700 dark:text-slate-300">{r.workingHours}h</td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">{r.performance?.demoDone || 0}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">{r.performance?.followUpCount || 0}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-400 font-semibold">{r.performance?.salesClosed || 0}</td>
                  <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    ₹{(r.performance?.revenue || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 text-sm">{r.mood === 'EXCELLENT' ? '😊' : '🙂'}</td>
                  <td className="py-3 text-right pr-4">
                    <button
                      type="button"
                      onClick={() => setSelectedReportDetail(r)}
                      className="p-1.5 rounded-lg text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/40"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Modal Drawer */}
      <AnimatePresence>
        {selectedReportDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    Daily Report Detail: {selectedReportDetail.userName}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">Date: {selectedReportDetail.date}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedReportDetail(null)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 text-[10px] block">Login / Logout</span>
                  <span className="font-bold font-mono">{selectedReportDetail.loginTime} - {selectedReportDetail.logoutTime}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 text-[10px] block">Shift Hours</span>
                  <span className="font-bold font-mono text-violet-600">{selectedReportDetail.workingHours} hrs</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 text-[10px] block">Demos Completed</span>
                  <span className="font-bold font-mono">{selectedReportDetail.performance.demoDone}</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-emerald-600 text-[10px] block">Revenue</span>
                  <span className="font-bold font-mono text-emerald-600">₹{selectedReportDetail.performance.revenue.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {selectedReportDetail.achievements && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Achievements:</span>
                  <p className="text-slate-600 dark:text-slate-400">{selectedReportDetail.achievements}</p>
                </div>
              )}

              {selectedReportDetail.problemsFaced && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs">
                  <span className="font-bold text-amber-700 dark:text-amber-300 block mb-1">Problems Faced:</span>
                  <p className="text-amber-900 dark:text-amber-200">{selectedReportDetail.problemsFaced}</p>
                </div>
              )}

              {selectedReportDetail.tomorrowPlan && (
                <div className="p-3.5 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-xs">
                  <span className="font-bold text-violet-700 dark:text-violet-300 block mb-1">Tomorrow&apos;s Plan:</span>
                  <p className="text-violet-900 dark:text-violet-200">{selectedReportDetail.tomorrowPlan}</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
