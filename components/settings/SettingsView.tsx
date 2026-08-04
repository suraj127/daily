'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Settings as SettingsIcon, Sun, Moon, Lock, Shield, Target, CheckCircle2, User as UserIcon, IndianRupee, Layers, PhoneCall } from 'lucide-react';

export default function SettingsView() {
  const { theme, setTheme, currentUser, users, updateUserTarget } = useApp();

  const [companyName, setCompanyName] = useState('SalesTrack Enterprise');
  const [targetHours, setTargetHours] = useState('8.0');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Personal Target State
  const [myRevenueTarget, setMyRevenueTarget] = useState(currentUser?.monthlyRevenueTarget || 500000);
  const [myDemosTarget, setMyDemosTarget] = useState(currentUser?.monthlyDemosTarget || 20);
  const [myCallsTarget, setMyCallsTarget] = useState(currentUser?.monthlyCallsTarget || 150);

  // Admin Target Manager State
  const [selectedEmpId, setSelectedEmpId] = useState(users.find((u) => u.role !== 'ADMIN')?.id || '');
  const [empRevenueTarget, setEmpRevenueTarget] = useState(500000);
  const [empDemosTarget, setEmpDemosTarget] = useState(20);
  const [empCallsTarget, setEmpCallsTarget] = useState(150);

  const handleSavePersonalTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    await updateUserTarget(currentUser.id, {
      monthlyRevenueTarget: Number(myRevenueTarget),
      monthlyDemosTarget: Number(myDemosTarget),
      monthlyCallsTarget: Number(myCallsTarget),
    });
    setSuccessMsg('Your personal monthly targets have been saved successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleSaveEmployeeTargetByAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpId) return;
    const emp = users.find((u) => u.id === selectedEmpId);
    await updateUserTarget(selectedEmpId, {
      monthlyRevenueTarget: Number(empRevenueTarget),
      monthlyDemosTarget: Number(empDemosTarget),
      monthlyCallsTarget: Number(empCallsTarget),
    });
    setSuccessMsg(`Monthly target saved for employee ${emp?.name || 'Selected Employee'}!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return;
    setSuccessMsg('Password successfully updated!');
    setOldPassword('');
    setNewPassword('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto font-sans">
      {/* Header Widget */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[11px] font-bold">
            System Preferences
          </span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-violet-500" /> Account & Monthly Target Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure visual themes, password credentials, and your monthly performance targets.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* Monthly Target Preferences Card (For Employees & Admin) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Personal Monthly Performance Targets
            </h2>
            <p className="text-xs text-slate-400">Set your monthly goals for revenue, product demos, and client calls</p>
          </div>
        </div>

        <form onSubmit={handleSavePersonalTarget} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Monthly Revenue Target (₹)
              </label>
              <div className="relative">
                <IndianRupee className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  min="0"
                  value={myRevenueTarget}
                  onChange={(e) => setMyRevenueTarget(Number(e.target.value))}
                  placeholder="e.g. 500000"
                  className="w-full h-10 pl-8 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Monthly Demos Target
              </label>
              <div className="relative">
                <Layers className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  min="0"
                  value={myDemosTarget}
                  onChange={(e) => setMyDemosTarget(Number(e.target.value))}
                  placeholder="e.g. 20"
                  className="w-full h-10 pl-8 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Monthly Calls Target
              </label>
              <div className="relative">
                <PhoneCall className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  min="0"
                  value={myCallsTarget}
                  onChange={(e) => setMyCallsTarget(Number(e.target.value))}
                  placeholder="e.g. 150"
                  className="w-full h-10 pl-8 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="h-10 px-5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition-all active:scale-95"
          >
            Save Personal Targets
          </button>
        </form>
      </div>

      {/* Admin Employee Target Manager */}
      {currentUser?.role === 'ADMIN' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Admin Target Manager (Set Target For Any Representative)
              </h2>
              <p className="text-xs text-slate-400">Assign or update target quotas for specific sales team members</p>
            </div>
          </div>

          <form onSubmit={handleSaveEmployeeTargetByAdmin} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Select Representative / Employee
              </label>
              <select
                value={selectedEmpId}
                onChange={(e) => {
                  const empId = e.target.value;
                  setSelectedEmpId(empId);
                  const emp = users.find((u) => u.id === empId);
                  if (emp) {
                    setEmpRevenueTarget(emp.monthlyRevenueTarget || 500000);
                    setEmpDemosTarget(emp.monthlyDemosTarget || 20);
                    setEmpCallsTarget(emp.monthlyCallsTarget || 150);
                  }
                }}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
              >
                {users
                  .filter((u) => u.role !== 'ADMIN')
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.team ? u.team.replace('_', ' ') : 'Sales'})
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Revenue Target (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={empRevenueTarget}
                  onChange={(e) => setEmpRevenueTarget(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Demos Target
                </label>
                <input
                  type="number"
                  min="0"
                  value={empDemosTarget}
                  onChange={(e) => setEmpDemosTarget(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Calls Target
                </label>
                <input
                  type="number"
                  min="0"
                  value={empCallsTarget}
                  onChange={(e) => setEmpCallsTarget(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              Assign Target to Employee
            </button>
          </form>
        </div>
      )}

      {/* Visual Theme Preferences */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Visual Theme Mode</h2>

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
              <div className="text-[10px] text-slate-400">High contrast light canvas</div>
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
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
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
    </div>
  );
}
