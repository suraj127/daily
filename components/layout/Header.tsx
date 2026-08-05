'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  LogOut,
  User as UserIcon,
  Shield,
  Menu,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Header({
  onOpenMobileSidebar,
  onOpenAIModal,
}: {
  onOpenMobileSidebar?: () => void;
  onOpenAIModal?: () => void;
}) {
  const {
    currentUser,
    logout,
    theme,
    setTheme,
    setIsSearchOpen,
    notifications,
    markNotificationRead,
  } = useApp();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 md:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile Toggle & Quick Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Button */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="hidden sm:flex items-center gap-2.5 h-9 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 text-xs hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all w-64 md:w-80"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="flex-1 text-left font-normal truncate">Search employees, reports, leads...</span>
          <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        {/* AI Insights Button */}
        <button
          type="button"
          onClick={onOpenAIModal}
          className="h-9 px-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-sky-500 hover:from-orange-600 hover:to-sky-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-all active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
          <span className="hidden sm:inline">AI Insights</span>
        </button>

        {/* Dark / Light Mode Toggle */}
        <button
          type="button"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon className="w-4 h-4 text-slate-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white dark:border-slate-900" />
            )}
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Notifications ({notifications.length})
                  </h4>
                  <span className="text-[10px] text-orange-500 font-medium">Auto-synced</span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                        n.isRead
                          ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-500'
                          : 'bg-orange-50 dark:bg-orange-950/40 text-slate-800 dark:text-slate-200 font-medium border-l-2 border-orange-500'
                      }`}
                    >
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{n.title}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Avatar & Profile Dropdown */}
        <div className="relative pl-2 border-l border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden lg:block text-xs">
              <div className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                {currentUser?.name}
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                {currentUser?.role === 'ADMIN' ? (
                  <span className="text-amber-500 font-semibold flex items-center gap-0.5">
                    <Shield className="w-3 h-3" /> Admin
                  </span>
                ) : (
                  <span>Employee</span>
                )}
              </div>
            </div>
          </button>

          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-1.5 z-50"
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <div className="font-bold text-slate-900 dark:text-slate-100">{currentUser?.name}</div>
                  <div className="text-[11px] text-slate-400">{currentUser?.department || 'Sales Dept'}</div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl flex items-center gap-2 transition-colors mt-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
