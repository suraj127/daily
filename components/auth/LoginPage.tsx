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
      setErrorMsg(res.error || 'Login failed. Please check password (default: omunim)');
    }
  };

  const handleQuickPreset = async (name: string) => {
    setSelectedName(name);
    setPassword('omunim');
    setIsLoading(true);
    await login(name, 'omunim');
    setIsLoading(false);
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
          <div className="w-14 h-14 rounded-2xl bg-white text-slate-950 font-extrabold text-xl flex items-center justify-center shadow-lg mb-3 border border-slate-700">
            OM
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Online Munim <span className="text-slate-400 font-semibold">Sales Track</span>
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
          {/* Employee Name Searchable Dropdown */}
          <div className="space-y-1.5 relative">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-violet-400" /> Employee / Account Name
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSearchDropdownOpen(!isSearchDropdownOpen)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-800/60 border border-slate-700/70 text-left text-sm font-medium text-slate-100 flex items-center justify-between hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
              >
                <span className="truncate">{selectedName || 'Select your name...'}</span>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              <AnimatePresence>
                {isSearchDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-2 max-h-60 overflow-y-auto"
                  >
                    <input
                      type="text"
                      placeholder="Search employee or type admin..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-800 text-slate-100 rounded-lg border border-slate-700 mb-2 focus:outline-none focus:ring-1 focus:ring-violet-500"
                      autoFocus
                    />

                    {/* Admin choice if searchFilter includes admin */}
                    {(searchFilter.toLowerCase().includes('admin') || searchFilter === '') && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedName('admin');
                          setIsSearchDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-xs font-semibold rounded-lg text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 flex items-center justify-between transition-colors mb-1"
                      >
                        <span className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5" /> Hidden Administrator (Admin)
                        </span>
                        {selectedName === 'admin' && <Check className="w-3.5 h-3.5" />}
                      </button>
                    )}

                    {filteredEmployees.map((emp) => (
                      <button
                        key={emp}
                        type="button"
                        onClick={() => {
                          setSelectedName(emp);
                          setIsSearchDropdownOpen(false);
                          setSearchFilter('');
                        }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-colors ${
                          selectedName === emp
                            ? 'bg-violet-600 text-white font-medium'
                            : 'text-slate-300 hover:bg-slate-800/80'
                        }`}
                      >
                        <span>{emp}</span>
                        {selectedName === emp && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-violet-400" /> Password
              </label>
              <span className="text-[11px] text-slate-400">Default: <code className="text-amber-300 font-mono">omunim</code></span>
            </div>
            <input
              type="password"
              placeholder="Enter omunim"
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

        {/* Quick Demo Shortcuts */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <p className="text-[11px] text-slate-400 font-medium text-center mb-2.5 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> One-Click Team Login Presets:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickPreset('Aniket')}
              className="px-2 py-1.5 text-[11px] bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-lg text-violet-300 font-medium transition-colors text-center truncate"
              title="Aniket (Demo Team)"
            >
              Demo Team
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('Pratiksha')}
              className="px-2 py-1.5 text-[11px] bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-lg text-blue-300 font-medium transition-colors text-center truncate"
              title="Pratiksha (Lead Mgmt)"
            >
              Lead Mgmt
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('admin')}
              className="px-2 py-1.5 text-[11px] bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-300 font-bold transition-colors text-center truncate"
              title="Admin Superuser"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
