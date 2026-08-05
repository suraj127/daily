'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { INITIAL_EMPLOYEES_LIST } from '@/lib/types';
import { TrendingUp, Lock, User as UserIcon, ShieldAlert, Sparkles, Check, ChevronDown, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LoginPage() {
  const { login } = useApp();
  const [selectedName, setSelectedName] = useState<string>('Aniket');
  const [password, setPassword] = useState<string>('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const filteredEmployees = INITIAL_EMPLOYEES_LIST.filter((emp) =>
    emp.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const res = await login(selectedName, password);
    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-100 relative overflow-hidden p-4">
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative z-10"
      >
        {/* Company Logo & Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-slate-950 border-2 border-orange-500 flex items-center justify-center shadow-xl shadow-orange-500/30 mb-3 relative overflow-hidden">
            <div className="w-10 h-5 rounded-full border border-orange-400 bg-orange-500/20 flex items-center justify-center gap-1.5">
              <span className="text-[10px] font-bold text-sky-400">^</span>
              <span className="text-[10px] font-bold text-emerald-400">^</span>
            </div>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-amber-500 bg-clip-text text-transparent">Online Munim</span>{' '}
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">Sales Track</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official Performance & Reporting Management Portal
          </p>
        </div>

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Employee Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-violet-400" /> Employee / Account Name
            </label>
            <input
              type="text"
              placeholder="Enter account or employee name..."
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
              required
              className="w-full h-11 px-3.5 rounded-xl bg-slate-800/60 border border-slate-700/70 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-slate-500"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-violet-400" /> Password
            </label>
            <input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-11 px-3.5 rounded-xl bg-slate-800/60 border border-slate-700/70 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-slate-500"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to SalesTrack</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
