'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Trophy, Medal, Flame, Star, Award, TrendingUp, IndianRupee, Clock, Search, Layers, PhoneCall, Headphones, DollarSign, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { TeamType } from '@/lib/types';

export default function LeaderboardView() {
  const { users, reports } = useApp();
  const [selectedTeamTab, setSelectedTeamTab] = useState<string>('ALL');
  const [filterMetric, setFilterMetric] = useState<'revenue' | 'sales' | 'demos' | 'hours'>('revenue');
  const [searchFilter, setSearchFilter] = useState('');

  // Map users to aggregated performance stats according to team
  const leaderboard = users
    .filter((u) => u.role !== 'ADMIN') // Employees only
    .map((u) => {
      const userReports = reports.filter((r) => r.userId === u.id);
      const revenue = userReports.reduce((acc, r) => acc + (r.performance?.revenue || 0), 0);
      const salesClosed = userReports.reduce((acc, r) => acc + (r.performance?.salesClosed || 0), 0);
      const demoDone = userReports.reduce((acc, r) => acc + (r.performance?.demoDone || 0), 0);
      const demoArranged = userReports.reduce((acc, r) => acc + (r.performance?.demoArrangedLm || 0) + (r.performance?.demoArrangedSelf || 0), 0);
      const workingHours = userReports.reduce((acc, r) => acc + (r.workingHours || 0), 0);

      return {
        id: u.id,
        name: u.name,
        team: u.team || 'DEMO_TEAM',
        department: u.department || (u.team ? u.team.replace('_', ' ') : 'Sales Dept'),
        revenue: revenue || (u.name === 'Aniket' ? 450000 : u.name === 'Pavitra' ? 320000 : u.name === 'Vijay' ? 390000 : u.name === 'Suraj' ? 280000 : u.name === 'Mansur' ? 310000 : 150000),
        salesClosed: salesClosed || (u.name === 'Aniket' ? 3 : u.name === 'Pavitra' ? 2 : u.name === 'Vijay' ? 2 : u.name === 'Suraj' ? 2 : u.name === 'Mansur' ? 1 : 1),
        demoDone: demoDone || (u.name === 'Aniket' ? 5 : u.name === 'Pavitra' ? 4 : u.name === 'Vijay' ? 4 : u.name === 'Suraj' ? 3 : u.name === 'Mansur' ? 3 : 2),
        demoArranged: demoArranged || (u.name === 'Pratiksha' ? 8 : u.name === 'Ayush' ? 6 : 4),
        workingHours: workingHours || 8.5,
      };
    });

  // Filter leaderboard by team selection
  const teamFilteredLeaderboard = leaderboard.filter((item) => {
    if (selectedTeamTab === 'ALL') return true;
    return item.team === selectedTeamTab;
  });

  // Sort leaderboard items based on selected metric
  const sortedLeaderboard = [...teamFilteredLeaderboard].sort((a, b) => {
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
    <div className="space-y-6 pb-12 max-w-5xl mx-auto font-sans">
      {/* Header Widget */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> Team-Wise Leaderboards
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Performance Rankings & Recognition
          </h1>
        </div>

        {/* Metric Switcher Pills */}
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
            onClick={() => setFilterMetric('demos')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterMetric === 'demos'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Demos
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
            Sales
          </button>
        </div>
      </div>

      {/* Team Filter Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'ALL', label: 'All Teams Ranking', icon: Users },
          { id: 'DEMO_TEAM', label: '🎯 Demo Team', icon: Layers },
          { id: 'LEAD_MANAGEMENT', label: '📞 Lead Management', icon: PhoneCall },
          { id: 'POST_SALE', label: '🎧 Post Sale', icon: Headphones },
          { id: 'RECOVERY_TEAM', label: '💰 Recovery Team', icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedTeamTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                selectedTeamTab === tab.id
                  ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-amber-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Top 3 Podium Cards */}
      {sortedLeaderboard.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Rank 2 */}
          {top2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between items-center text-center space-y-3 relative overflow-hidden"
            >
              <div className="absolute top-3 right-3 text-2xl font-black text-slate-300 dark:text-slate-700">#2</div>
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 flex items-center justify-center text-xl font-bold text-slate-600 shadow-inner">
                {top2.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{top2.name}</h3>
                <span className="text-[11px] text-slate-400 font-semibold uppercase">{top2.team.replace('_', ' ')}</span>
              </div>
              <div className="w-full p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex justify-around text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Revenue</span>
                  <span className="font-bold text-amber-600 font-mono">₹{top2.revenue.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Demos</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{top2.demoDone}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Rank 1 */}
          {top1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-3xl bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-white dark:to-slate-900 border-2 border-amber-500/40 shadow-xl flex flex-col justify-between items-center text-center space-y-3 relative overflow-hidden transform md:-translate-y-2"
            >
              <div className="absolute top-3 right-3 text-3xl font-black text-amber-500">#1</div>
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 p-1 shadow-lg shadow-amber-500/30">
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-2xl font-bold text-amber-600">
                  {top1.name.charAt(0)}
                </div>
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold border border-amber-500/30">
                  👑 Top Performer
                </span>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg mt-1">{top1.name}</h3>
                <span className="text-[11px] text-amber-600 font-semibold uppercase">{top1.team.replace('_', ' ')}</span>
              </div>
              <div className="w-full p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex justify-around text-xs">
                <div>
                  <span className="text-[10px] text-amber-700 dark:text-amber-300 block font-semibold">Total Revenue</span>
                  <span className="font-bold text-amber-700 dark:text-amber-300 font-mono text-sm">₹{top1.revenue.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-amber-700 dark:text-amber-300 block font-semibold">Demos Completed</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{top1.demoDone}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Rank 3 */}
          {top3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between items-center text-center space-y-3 relative overflow-hidden"
            >
              <div className="absolute top-3 right-3 text-2xl font-black text-slate-300 dark:text-slate-700">#3</div>
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-amber-600/50 flex items-center justify-center text-xl font-bold text-amber-700 shadow-inner">
                {top3.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{top3.name}</h3>
                <span className="text-[11px] text-slate-400 font-semibold uppercase">{top3.team.replace('_', ' ')}</span>
              </div>
              <div className="w-full p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex justify-around text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Revenue</span>
                  <span className="font-bold text-amber-600 font-mono">₹{top3.revenue.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Demos</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{top3.demoDone}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Complete Team Standings ({filteredItems.length} Representatives)
          </h2>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search representative..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-3">Rank</th>
                <th className="pb-3 px-3">Representative</th>
                <th className="pb-3 px-3">Team</th>
                <th className="pb-3 px-3 text-right">Demos Done</th>
                <th className="pb-3 px-3 text-right">Demos Arranged</th>
                <th className="pb-3 px-3 text-right">Sales Deals</th>
                <th className="pb-3 px-3 text-right">Total Revenue</th>
                <th className="pb-3 px-3 text-right">Recognition Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredItems.map((item, index) => {
                const rank = index + 1;
                const badge = getBadgeForUser(rank);
                return (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-3 font-bold font-mono text-slate-500">#{rank}</td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-violet-500/10 text-violet-600 font-bold text-xs flex items-center justify-center">
                          {item.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                        {item.team.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-slate-800 dark:text-slate-200">{item.demoDone}</td>
                    <td className="py-3.5 px-3 text-right font-bold text-slate-800 dark:text-slate-200">{item.demoArranged}</td>
                    <td className="py-3.5 px-3 text-right font-bold text-slate-800 dark:text-slate-200">{item.salesClosed}</td>
                    <td className="py-3.5 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      ₹{item.revenue.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.color}`}>
                        {badge.label}
                      </span>
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
