'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  FileText,
  Calendar as CalendarIcon,
  BarChart3,
  Trophy,
  FileSpreadsheet,
  Users,
  Settings as SettingsIcon,
  LogOut,
  TrendingUp,
  X,
  Shield,
  Clock,
  Contact,
  User as UserIcon,
  Layers,
  Headphones,
  DollarSign,
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Sidebar({
  mobileOpen,
  onCloseMobile,
}: {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}) {
  const { activeTab, setActiveTab, currentUser, logout, getTodayReportForUser } = useApp();

  const todayReport = currentUser ? getTodayReportForUser(currentUser.id) : undefined;
  const isReportDoneToday = !!todayReport;

  // Build role & team specific navigation items
  const getNavItems = () => {
    if (!currentUser) return [];

    if (currentUser.role === 'ADMIN') {
      return [
        { id: 'company-dashboard', label: 'Company Dashboard', icon: LayoutDashboard },
        { id: 'demo-dashboard', label: 'Demo Team Dashboard', icon: Layers },
        { id: 'lead-dashboard', label: 'LM Report', icon: TrendingUp },
        { id: 'post-sale-dashboard', label: 'Post Sale Dashboard', icon: Headphones },
        { id: 'recovery-dashboard', label: 'Recovery Team Dashboard', icon: DollarSign },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
        { id: 'employees', label: 'Employees', icon: Users },
        { id: 'clients', label: 'Client Database', icon: Contact },
        { id: 'leaderboards', label: 'Leaderboards', icon: Trophy },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
        { id: 'profile', label: 'Profile', icon: UserIcon },
      ];
    }

    // Employee sidebar (Demo Team, Lead Management, Post Sale, Recovery Team)
    // REMOVED Team Analytics & Leaderboard per user request
    return [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      {
        id: 'daily-report',
        label: 'Daily Report',
        icon: FileText,
        badge: isReportDoneToday ? 'Logged' : 'Pending',
        badgeColor: isReportDoneToday
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse',
      },
      { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
      { id: 'reports', label: 'My Reports', icon: FileSpreadsheet },
      { id: 'clients', label: 'Clients & Demos', icon: Contact },
      { id: 'profile', label: 'Profile', icon: UserIcon },
    ];
  };

  const navItems = getNavItems();

  const getTeamLabel = () => {
    if (currentUser?.role === 'ADMIN') return 'Admin Portal';
    switch (currentUser?.team) {
      case 'DEMO_TEAM':
        return 'Demo Team';
      case 'LEAD_MANAGEMENT':
        return 'Lead Management';
      case 'POST_SALE':
        return 'Post Sale Team';
      case 'RECOVERY_TEAM':
        return 'Recovery Team';
      default:
        return 'Sales Operations';
    }
  };

  const getTeamColor = () => {
    if (currentUser?.role === 'ADMIN') return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    switch (currentUser?.team) {
      case 'DEMO_TEAM':
        return 'bg-violet-500/10 text-violet-600 border-violet-500/20';
      case 'LEAD_MANAGEMENT':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'POST_SALE':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'RECOVERY_TEAM':
        return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 w-64 transition-colors">
      {/* Online Munim Sales Track Header Logo */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          {/* Logo Robot Badge */}
          <div className="w-9 h-9 rounded-full bg-slate-950 border-2 border-orange-500 flex items-center justify-center shadow-md shadow-orange-500/30 text-white shrink-0 relative overflow-hidden">
            <div className="w-6 h-3 rounded-full border border-orange-400 bg-orange-500/20 flex items-center justify-center gap-1">
              <span className="text-[7px] font-bold text-sky-400">^</span>
              <span className="text-[7px] font-bold text-emerald-400">^</span>
            </div>
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-orange-500 via-amber-500 to-sky-500 bg-clip-text text-transparent">
              Online Munim
            </span>
            <div className="text-[10px] font-bold text-sky-500 dark:text-sky-400 tracking-wider uppercase -mt-1">
              Sales Track
            </div>
          </div>
        </div>

        {mobileOpen && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Team Badge Indicator */}
      <div className="px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
        <span className="text-[10px] uppercase font-bold text-slate-400">Current Access</span>
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${getTeamColor()}`}>
          {getTeamLabel()}
        </span>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full h-10 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all group ${
                isActive
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Daily Shift Status Widget */}
      {currentUser?.role === 'EMPLOYEE' && (
        <div className="p-3 m-3 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/20 border border-slate-200/80 dark:border-slate-800 text-xs">
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-bold mb-1">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-violet-500" /> Today&apos;s Shift
            </span>
            <span className="text-[10px] text-slate-400 font-mono">8.0h target</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
            {isReportDoneToday ? 'Report submitted for today.' : 'Please log your activity report.'}
          </div>
          {!isReportDoneToday && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('daily-report');
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-semibold transition-colors text-center"
            >
              Log Report Now
            </button>
          )}
        </div>
      )}

      {/* User Footer & Logout */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-8 h-8 rounded-full bg-violet-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div className="truncate">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
              {currentUser?.name}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              {currentUser?.role === 'ADMIN' ? (
                <span className="text-amber-500 font-semibold flex items-center gap-0.5">
                  <Shield className="w-3 h-3" /> Admin
                </span>
              ) : (
                <span>{getTeamLabel()}</span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:block sticky top-0 h-screen z-20 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <motion.div
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            className="relative z-10 h-full"
          >
            {sidebarContent}
          </motion.div>
        </div>
      )}
    </>
  );
}
