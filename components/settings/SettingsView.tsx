'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Settings as SettingsIcon, Sun, Moon, Lock, Shield, Database, CheckCircle2 } from 'lucide-react';

export default function SettingsView() {
  const { theme, setTheme, currentUser } = useApp();

  const [companyName, setCompanyName] = useState('SalesTrack Enterprise');
  const [targetHours, setTargetHours] = useState('8.0');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return;
    setSuccessMsg('Password successfully updated!');
    setOldPassword('');
    setNewPassword('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[11px] font-bold">
            System Preferences
          </span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-violet-500" /> Account & Application Settings
        </h1>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* Theme & Appearance */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Visual Theme & Appearance</h2>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
              theme === 'light'
                ? 'border-violet-600 bg-violet-50/50 dark:bg-violet-950/30 text-violet-900 dark:text-violet-200'
                : 'border-slate-200 dark:border-slate-800 text-slate-500'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <div>
              <div className="font-bold text-xs">Light Clean Mode</div>
              <div className="text-[10px] text-slate-400">High contrast light background</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
              theme === 'dark'
                ? 'border-violet-600 bg-violet-50/50 dark:bg-violet-950/30 text-violet-900 dark:text-violet-200'
                : 'border-slate-200 dark:border-slate-800 text-slate-500'
            }`}
          >
            <Moon className="w-5 h-5 text-indigo-400" />
            <div>
              <div className="font-bold text-xs">Dark Enterprise Mode</div>
              <div className="text-[10px] text-slate-400">Deep slate ambient canvas</div>
            </div>
          </button>
        </div>
      </div>

      {/* Security & Password */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Lock className="w-4 h-4 text-violet-500" /> Security & Password Update
        </h2>

        <form onSubmit={handlePasswordChange} className="space-y-3 max-w-md">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Current Password</label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password..."
              className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="h-10 px-5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md transition-all"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Admin Company Configurations */}
      {currentUser?.role === 'ADMIN' && (
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-500" /> Organization Configuration (Admin)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Company Title</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Target Shift Hours</label>
              <input
                type="text"
                value={targetHours}
                onChange={(e) => setTargetHours(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
