'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { ClientRecord } from '@/lib/types';
import {
  Search,
  Download,
  Calendar,
  User,
  Phone,
  MapPin,
  Clock,
  Briefcase,
  ChevronRight,
  X,
  CreditCard,
  Contact,
  MessageSquare,
  Send,
  HelpCircle,
  Users,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ClientsView() {
  const { clientRecords, clientComments, addClientComment, addClientRecord, users, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserFilter, setSelectedUserFilter] = useState('ALL');
  const [selectedActivityFilter, setSelectedActivityFilter] = useState('ALL');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  
  // New Client Record Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newContactPerson, setNewContactPerson] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newActivityType, setNewActivityType] = useState('demoDone');
  const [newNotes, setNewNotes] = useState('');
  const [newSaleAmount, setNewSaleAmount] = useState('');

  // Sort state
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Selected client mobile for timeline & comment modal
  const [selectedMobileForModal, setSelectedMobileForModal] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newMobile) return;
    
    await addClientRecord({
      date: new Date().toISOString().split('T')[0],
      clientName: newClientName,
      contactPerson: newContactPerson || newClientName,
      mobile: newMobile.trim(),
      city: newCity || 'Mumbai',
      activityType: newActivityType,
      userTeam: currentUser?.team || 'DEMO_TEAM',
      status: newActivityType === 'salesClosed' ? 'Closed' : 'Active',
      notes: newNotes,
      saleAmount: newSaleAmount ? Number(newSaleAmount) : undefined,
    });

    if (newNotes.trim()) {
      await addClientComment(newMobile.trim(), newNotes.trim());
    }

    setIsAddModalOpen(false);
    setNewClientName('');
    setNewContactPerson('');
    setNewMobile('');
    setNewCity('');
    setNewNotes('');
    setNewSaleAmount('');
  };

  // Helper to format activity type labels
  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'demoArrangedLm': return 'Demo Arranged (LM)';
      case 'demoArrangedSelf': return 'Demo Arranged (Self)';
      case 'demoDone': return 'Demo Completed';
      case 'followUpCount':
      case 'followUpCalls': return 'Follow-up Call';
      case 'closingCount':
      case 'closingCalls': return 'Closing Call';
      case 'quotationSent': return 'Quotation Created';
      case 'salesClosed': return 'Sale Closed';
      case 'firstCalls': return 'First Call (LM)';
      case 'oldCalls': return 'Old Call (LM)';
      case 'feedbackCalls': return 'Feedback Call (LM)';
      case 'customerVisits': return 'Client Visit';
      default: return type;
    }
  };

  // Helper for activity type styles
  const getActivityStyles = (type: string) => {
    switch (type) {
      case 'salesClosed':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
      case 'demoDone':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
      case 'demoArrangedLm':
      case 'demoArrangedSelf':
        return 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20';
      case 'firstCalls':
      case 'oldCalls':
      case 'feedbackCalls':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20';
    }
  };

  // Employee Scope Filter
  const visibleRecords = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'ADMIN') return clientRecords;

    // For employees: Show records belonging to their own team OR matching cross-team mobile entries
    const myTeamRecords = clientRecords.filter(r => r.userTeam === currentUser.team || r.userId === currentUser.id);
    const myMobiles = new Set(myTeamRecords.map(r => r.mobile));
    
    // Cross-team match: any record sharing mobile number with my team records
    return clientRecords.filter(r => myMobiles.has(r.mobile) || r.userTeam === currentUser.team || r.userId === currentUser.id);
  }, [clientRecords, currentUser]);

  // Filter records
  const filteredRecords = useMemo(() => {
    return visibleRecords.filter((rec) => {
      const matchesSearch =
        searchTerm === '' ||
        rec.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.mobile.includes(searchTerm) ||
        (rec.contactPerson && rec.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (rec.city && rec.city.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesUser = selectedUserFilter === 'ALL' || rec.userId === selectedUserFilter;
      const matchesActivity = selectedActivityFilter === 'ALL' || rec.activityType === selectedActivityFilter;
      const matchesStartDate = startDateFilter === '' || rec.date >= startDateFilter;
      const matchesEndDate = endDateFilter === '' || rec.date <= endDateFilter;

      return matchesSearch && matchesUser && matchesActivity && matchesStartDate && matchesEndDate;
    });
  }, [visibleRecords, searchTerm, selectedUserFilter, selectedActivityFilter, startDateFilter, endDateFilter]);

  // Sort filtered records
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'name') {
        comparison = a.clientName.localeCompare(b.clientName);
      } else if (sortBy === 'amount') {
        comparison = (a.saleAmount || 0) - (b.saleAmount || 0);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredRecords, sortBy, sortOrder]);

  // Timeline & comments for selected mobile number
  const selectedMobileRecords = useMemo(() => {
    if (!selectedMobileForModal) return [];
    return clientRecords
      .filter((rec) => rec.mobile === selectedMobileForModal)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [clientRecords, selectedMobileForModal]);

  const selectedMobileComments = useMemo(() => {
    if (!selectedMobileForModal) return [];
    return clientComments
      .filter((c) => c.mobile === selectedMobileForModal)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [clientComments, selectedMobileForModal]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMobileForModal || !commentInput.trim()) return;
    await addClientComment(selectedMobileForModal, commentInput.trim());
    setCommentInput('');
  };

  const handleSort = (field: 'date' | 'name' | 'amount') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const primaryRecordForModal = selectedMobileRecords[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Widget */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[11px] font-bold">
              Shared Client & Demo Directory
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Contact className="w-5 h-5 text-violet-500" /> Client & Demo Records (Cross-Team Comments)
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5">
            View Demo Done, Demo Arranged, and Lead records. Shared mobile entries support cross-team comments between Demo & Lead Management teams.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="h-10 px-5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 flex items-center gap-2 transition-all active:scale-95 shrink-0"
        >
          <span>+ Add Client / Demo Record</span>
        </button>
      </div>

      {/* Interactive Filter Grid */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Search Shop Name, Place, Mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-500 font-semibold"
            />
          </div>

          <div>
            <select
              value={selectedUserFilter}
              onChange={(e) => setSelectedUserFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100"
            >
              <option value="ALL">All Representatives</option>
              {users.filter(u => u.isActive).map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.team || 'Sales'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedActivityFilter}
              onChange={(e) => setSelectedActivityFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100"
            >
              <option value="ALL">All Activity Types</option>
              <option value="demoDone">Demo Completed</option>
              <option value="demoArrangedLm">Demo Arranged (LM)</option>
              <option value="demoArrangedSelf">Demo Arranged (Self)</option>
              <option value="firstCalls">First Calls</option>
              <option value="followUpCalls">Follow-up Call</option>
              <option value="salesClosed">Sale Closed</option>
            </select>
          </div>

          <div className="flex gap-2">
            <input
              type="date"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
              className="w-1/2 h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
            />
            <input
              type="date"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
              className="w-1/2 h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      {sortedRecords.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No Client Records Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try resetting your search query or choosing a different date range.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedRecords.map((rec) => {
            const commentsCount = clientComments.filter(c => c.mobile === rec.mobile).length;
            const sameMobileTeamCount = new Set(clientRecords.filter(r => r.mobile === rec.mobile).map(r => r.userTeam)).size;
            const isCrossTeam = sameMobileTeamCount > 1;

            return (
              <div
                key={rec.id}
                onClick={() => setSelectedMobileForModal(rec.mobile)}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-violet-300 dark:hover:border-violet-800 transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                          {rec.clientName}
                        </h3>
                        {isCrossTeam && (
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold border border-purple-500/20 flex items-center gap-1">
                            <Users className="w-3 h-3" /> Shared Lead
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 font-semibold">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{rec.contactPerson}</span>
                        {rec.city && (
                          <>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{rec.city}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full uppercase truncate ${getActivityStyles(rec.activityType)}`}>
                      {getActivityLabel(rec.activityType)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-[11px]">
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-medium">
                      <Phone className="w-3 h-3 text-violet-500" />
                      <span className="font-mono">{rec.mobile}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-medium justify-end text-right">
                      <Briefcase className="w-3 h-3 text-indigo-500" />
                      <span>Rep: <strong className="font-bold text-slate-800 dark:text-slate-200">{rec.userName}</strong></span>
                    </div>
                  </div>

                  {rec.notes && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 italic pl-2 border-l-2 border-slate-200 dark:border-slate-800">
                      &ldquo;{rec.notes}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1 font-semibold">
                    <Calendar className="w-3 h-3" /> {rec.date}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[10px] font-bold flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> {commentsCount} Comments
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Shared Client Mobile Modal & Cross-Team Comment Thread */}
      <AnimatePresence>
        {selectedMobileForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-violet-600 dark:text-violet-400 tracking-wider">
                      Cross-Team Client History & Comments
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {primaryRecordForModal?.clientName}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-violet-500" /> {selectedMobileForModal}
                    </span>
                    {primaryRecordForModal?.city && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {primaryRecordForModal.city}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedMobileForModal(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Records & Shared Comments Body */}
              <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
                {/* Related Entries */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Activity & Demo Entries ({selectedMobileRecords.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedMobileRecords.map((r) => (
                      <div key={r.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-slate-800 dark:text-slate-200">
                            {r.userName} ({r.userTeam || 'Sales'})
                          </span>
                          <span className={`px-2 py-0.5 text-[9px] rounded uppercase ${getActivityStyles(r.activityType)}`}>
                            {getActivityLabel(r.activityType)}
                          </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 italic">&ldquo;{r.notes || 'No notes'}&rdquo;</p>
                        <div className="text-[10px] text-slate-400 font-mono text-right">{r.date}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cross-Team Comments */}
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Shared Cross-Team Comments</span>
                    <span className="text-[10px] font-normal text-violet-500 font-mono">Mobile: {selectedMobileForModal}</span>
                  </h4>

                  {selectedMobileComments.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-400 italic">
                      No comments posted yet for this client mobile number. Be the first to comment below!
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                      {selectedMobileComments.map((c) => (
                        <div key={c.id} className="p-3 rounded-2xl bg-violet-500/5 dark:bg-violet-950/20 border border-violet-500/10 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                              {c.userName} <span className="text-[10px] text-violet-600 font-normal">({c.userTeam})</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300">{c.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handlePostComment} className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Add comment for mobile ${selectedMobileForModal}...`}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="flex-1 h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
                <button
                  type="submit"
                  disabled={!commentInput.trim()}
                  className="h-10 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Add New Client / Demo Record Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Contact className="w-5 h-5 text-violet-500" /> Log New Client / Demo Record
                  </h3>
                  <p className="text-xs text-slate-400">Add client details, activity type, and shared mobile comments</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRecord} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Client / Shop Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nazir Jewellers / Apex Traders"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      placeholder="Owner / Manager Name"
                      value={newContactPerson}
                      onChange={(e) => setNewContactPerson(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9876543210"
                      value={newMobile}
                      onChange={(e) => setNewMobile(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      City / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai / Pune"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Activity / Record Type
                    </label>
                    <select
                      value={newActivityType}
                      onChange={(e) => setNewActivityType(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-semibold"
                    >
                      <option value="demoDone">Demo Completed</option>
                      <option value="demoArrangedSelf">Demo Arranged (Self)</option>
                      <option value="demoArrangedLm">Demo Arranged (LM)</option>
                      <option value="firstCalls">First Lead Call</option>
                      <option value="salesClosed">Sale Deal Closed</option>
                    </select>
                  </div>
                </div>

                {newActivityType === 'salesClosed' && (
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Sale Deal Amount (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 250000"
                      value={newSaleAmount}
                      onChange={(e) => setNewSaleAmount(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Comment / Activity Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Add notes or status details... Shared by mobile number with other teams."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="w-1/2 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 h-10 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md transition-all"
                  >
                    Save Client Record
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
