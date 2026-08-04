'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { User } from '@/lib/types';
import { Users, UserPlus, CheckCircle2, Clock, Shield, Search, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function EmployeesView() {
  const { users, reports, toggleEmployeeStatus, addEmployee, currentUser } = useApp();
  const [searchFilter, setSearchFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Employee Form State
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [department, setDepartment] = useState('Sales Dept');
  const [role, setRole] = useState<'EMPLOYEE' | 'ADMIN'>('EMPLOYEE');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      u.department?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await addEmployee(name, department);

    setName('');
    setUsername('');
    setShowAddModal(false);
  };

  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <Shield className="w-12 h-12 text-rose-500 mx-auto mb-2" />
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Access Restricted</h2>
        <p className="text-xs text-slate-400 mt-1">
          Only Admin accounts have permission to view and manage team employee accounts.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[11px] font-bold">
              Team & Staff Management
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-violet-500" /> Employee Roster ({users.length} Registered)
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="h-10 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Employee</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Filter by employee name or department..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
        />
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((u) => {
          const userReportToday = reports.find((r) => r.userId === u.id && r.date === todayStr);
          const isDoneToday = !!userReportToday;

          return (
            <div
              key={u.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white font-bold text-sm flex items-center justify-center shadow-md">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{u.name}</h3>
                    <p className="text-[11px] text-slate-400">{u.department || 'Sales Dept'}</p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                    u.isActive
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {u.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Compliance Badge */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Today&apos;s Report Status:</span>
                {isDoneToday ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Logged
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5" /> Pending
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400">Role: <strong className="text-slate-700 dark:text-slate-300">{u.role}</strong></span>
                <button
                  type="button"
                  onClick={() => toggleEmployeeStatus(u.id)}
                  className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                >
                  {u.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-violet-500" /> Add New Sales Representative
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddEmployee} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Rajesh Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Username / ID</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. rajesh"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'EMPLOYEE' | 'ADMIN')}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100"
                  >
                    <option value="EMPLOYEE">Sales Employee</option>
                    <option value="ADMIN">Manager / Admin</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-10 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md transition-all"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
