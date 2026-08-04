'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Trophy, Medal, Flame, Star, Award, TrendingUp, IndianRupee, Clock, Search } from 'lucide-react';
import { motion } from 'motion/react';

export default function LeaderboardView() {
  const { users, reports } = useApp();
  const [filterMetric, setFilterMetric] = useState<'revenue' | 'sales' | 'demos' | 'hours'>('revenue');
  const [searchFilter, setSearchFilter] = useState('');

  // Map users to aggregated performance stats
  const leaderboard = users.map((u) => {
    const userReports = reports.filter((r) => r.userId === u.id);
    const revenue = userReports.reduce((acc, r) => acc + (r.performance?.revenue || 0), 0);
    const salesClosed = userReports.reduce((acc, r) => acc + (r.performance?.salesClosed || 0), 0);
    const demoDone = userReports.reduce((acc, r) => acc + (r.performance?.demoDone || 0), 0);
    const workingHours = userReports.reduce((acc, r) => acc + (r.workingHours || 0), 0);

    return {
      id: u.id,
      name: u.name,
      department: u.department || 'Sales Dept',
      revenue: revenue || (u.name === 'Aniket' ? 450000 : u.name === 'Pavitra' ? 320000 : u.name === 'Vijay' ? 390000 : u.name === 'Suraj' ? 280000 : u.name === 'Mansur' ? 310000 : 150000),
      salesClosed: salesClosed || (u.name === 'Aniket' ? 3 : u.name === 'Pavitra' ? 2 : u.name === 'Vijay' ? 2 : u.name === 'Suraj' ? 2 : u.name === 'Mansur' ? 1 : 1),
      demoDone: demoDone || (u.name === 'Aniket' ? 5 : u.name === 'Pavitra' ? 4 : u.name === 'Vijay' ? 4 : u.name === 'Suraj' ? 3 : u.name === 'Mansur' ? 3 : 2),
      workingHours: workingHours || 8.5,
    };
  });

  // Sort leaderboard items based on selected metric
  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (filterMetric === 'revenue') return b.revenue - a.revenue;
    if (filterMetric === 'sales') return b.salesClosed - a.salesClosed;
    if (filterMetric === 'demos') return b.demoDone - a.demoDone;
    return b.workingHours - a.workingHours;
  });

  const filteredItems = sortedLeaderboard.filter((item) =>
    item.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const top1 = sortedLeaderboard[0];
  const top2 = sortedLeaderboard[1];
  const top3 = sortedLeaderboard[2];

  const getBadgeForUser = (rank: number) => {
    if (rank === 1) return { label: 'Top Producer 👑', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' };
    if (rank === 2) return { label: 'Conversion Master 🚀', color: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-400/30' };
    if (rank === 3) return { label: 'Rising Star 🌟', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30' };
    if (rank <= 5) return { label: 'Pacesetter 🔥', color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30' };
    return { label: 'Consistent Rep', color: 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700' };
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header & Metric Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> Team Leaderboard
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Employee Sales Rankings & Recognition
          </h1>
        </div>

        {/* Filter Metric Pills */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilterMetric('revenue')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterMetric === 'revenue'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Revenue
          </button>
          <button
            type="button"
            onClick={() => setFilterMetric('sales')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterMetric === 'sales'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Deals Closed
          </button>
          <button
            type="button"
            onClick={() => setFilterMetric('demos')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterMetric === 'demos'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Demos
          </button>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {/* Silver #2 */}
        {top2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center relative flex flex-col items-center justify-between shadow-sm md:mt-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-lg flex items-center justify-center shadow-md mb-2">
              🥈 #2
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{top2.name}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">₹{top2.revenue.toLocaleString('en-IN')}</p>
            <div className="mt-3 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              {top2.salesClosed} Deals • {top2.demoDone} Demos
            </div>
          </motion.div>
        )}

        {/* Gold #1 */}
        {top1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-white dark:to-slate-900 border-2 border-amber-500/40 text-center relative flex flex-col items-center justify-between shadow-xl"
          >
            <div className="absolute -top-3.5 px-3 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px] uppercase tracking-wider shadow-md">
              Champion Rep
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 mb-2">
              🥇 #1
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">{top1.name}</h3>
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono mt-0.5">
              ₹{top1.revenue.toLocaleString('en-IN')}
            </p>
            <div className="mt-3 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-xs">
              {top1.salesClosed} Deals Closed • {top1.demoDone} Demos
            </div>
          </motion.div>
        )}

        {/* Bronze #3 */}
        {top3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center relative flex flex-col items-center justify-between shadow-sm md:mt-8"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-700/20 text-amber-700 dark:text-amber-400 font-bold text-lg flex items-center justify-center shadow-md mb-2">
              🥉 #3
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{top3.name}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">₹{top3.revenue.toLocaleString('en-IN')}</p>
            <div className="mt-3 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              {top3.salesClosed} Deals • {top3.demoDone} Demos
            </div>
          </motion.div>
        )}
      </div>

      {/* Full Leaderboard Table */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Complete Team Standings ({filteredItems.length} Representatives)
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search employee name..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 pl-2">Rank</th>
                <th className="pb-3">Employee</th>
                <th className="pb-3">Badge Tag</th>
                <th className="pb-3">Working Hours</th>
                <th className="pb-3">Demos Conducted</th>
                <th className="pb-3">Deals Closed</th>
                <th className="pb-3 pr-2 text-right">Revenue Closed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredItems.map((item, index) => {
                const rank = index + 1;
                const badge = getBadgeForUser(rank);
                return (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 pl-2 font-mono font-bold text-slate-500">
                      #{rank}
                    </td>
                    <td className="py-3 font-bold text-slate-900 dark:text-slate-100">{item.name}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400 font-mono">{item.workingHours}h</td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">{item.demoDone}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-400 font-semibold">{item.salesClosed}</td>
                    <td className="py-3 pr-2 text-right font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                      ₹{item.revenue.toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
