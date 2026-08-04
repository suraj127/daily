'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ActivityBreakdown, PerformanceCounts, Priority, Mood, Feedback } from '@/lib/types';
import { getFormattedDate } from '@/lib/mock-data';
import {
  FileText,
  Clock,
  TrendingUp,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Save,
  Send,
  Paperclip,
  Trash2,
  Calendar,
  IndianRupee,
  Star,
  User,
  ShieldCheck,
  Check,
  X,
  Users,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function DailyReportForm() {
  const { currentUser, submitReport, reports, comments, addComment, deleteComment, getTodayReportForUser, clientRecords, addClientRecord, deleteClientRecord } = useApp();

  const [date, setDate] = useState<string>(getFormattedDate(0));
  const [loginTime, setLoginTime] = useState<string>('09:00');
  const [logoutTime, setLogoutTime] = useState<string>('17:30');

  // Active details field for modal popup
  const [activeDetailsField, setActiveDetailsField] = useState<{ key: string; label: string } | null>(null);

  // Client entry form states
  const [clientName, setClientName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('');
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [saleAmount, setSaleAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'Pending' | 'Partial' | 'Paid'>('Pending');
  const [clientError, setClientError] = useState('');

  const handleOpenDetailsField = (key: string, label: string) => {
    setActiveDetailsField({ key, label });
    setClientName('');
    setContactPerson('');
    setMobile('');
    setCity('');
    setNotes('');
    setFollowUpDate('');
    setSaleAmount('');
    setPaymentStatus('Pending');
    setClientError('');
    
    if (key.startsWith('demoArranged')) {
      setStatus('Demo Scheduled');
    } else if (key === 'demoDone') {
      setStatus('Demo Completed');
    } else if (key === 'salesClosed') {
      setStatus('Sales Closed');
    } else if (key === 'quotationSent') {
      setStatus('Quotation Created');
    } else if (key === 'customerVisits') {
      setStatus('Client Visit Completed');
    } else {
      setStatus('Follow-up Scheduled');
    }
  };

  const handleAddClientRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError('');

    if (!clientName.trim() || !contactPerson.trim() || !mobile.trim() || !status.trim()) {
      setClientError('Shop Name, Contact, Phone, and Status are required fields.');
      return;
    }

    if (activeDetailsField?.key === 'salesClosed' && !saleAmount) {
      setClientError('Sale Amount is required for closed sales.');
      return;
    }

    const payload = {
      date,
      activityType: activeDetailsField!.key,
      clientName: clientName.trim(),
      contactPerson: contactPerson.trim(),
      mobile: mobile.trim(),
      city: city.trim() || undefined,
      status: status.trim(),
      notes: notes.trim() || undefined,
      followUpDate: followUpDate || undefined,
      ...(activeDetailsField?.key === 'salesClosed' ? {
        saleAmount: parseFloat(saleAmount) || 0,
        paymentStatus,
      } : {})
    };

    const success = await addClientRecord(payload);
    if (success) {
      // Find current count from records
      const currentFieldRecords = clientRecords.filter(
        (c) => c.userId === currentUser?.id && c.date === date && c.activityType === activeDetailsField!.key
      );
      const newCount = currentFieldRecords.length + 1;

      setPerformance((prev) => {
        const next = {
          ...prev,
          [activeDetailsField!.key]: newCount,
        };
        if (activeDetailsField!.key === 'salesClosed') {
          const addedAmt = parseFloat(saleAmount) || 0;
          next.revenue = (prev.revenue || 0) + addedAmt;
        }
        return next;
      });

      // Reset
      setClientName('');
      setContactPerson('');
      setMobile('');
      setCity('');
      setNotes('');
      setFollowUpDate('');
      setSaleAmount('');
    } else {
      setClientError('Failed to save client record. Please try again.');
    }
  };

  const handleDeleteClientRecordItem = async (id: string, amountToSubtract?: number) => {
    const success = await deleteClientRecord(id);
    if (success && activeDetailsField) {
      const currentFieldRecords = clientRecords.filter(
        (c) => c.userId === currentUser?.id && c.date === date && c.activityType === activeDetailsField.key
      );
      const newCount = Math.max(0, currentFieldRecords.length - 1);

      setPerformance((prev) => {
        const next = {
          ...prev,
          [activeDetailsField.key]: newCount,
        };
        if (activeDetailsField.key === 'salesClosed' && amountToSubtract) {
          next.revenue = Math.max(0, (prev.revenue || 0) - amountToSubtract);
        }
        return next;
      });
    }
  };
  
  // Activity Breakdown State
  const [activity, setActivity] = useState<ActivityBreakdown>({
    demoArrangeCalls: 1.5,
    demo: 2.0,
    followUpCalls: 2.0,
    closingCalls: 1.0,
    quotationMaking: 0.5,
    fieldVisit: 0,
    reportingMeeting: 0.5,
    technicalSupport: 0,
    clientVisit: 0.5,
    coldCalling: 0,
    whatsappFollowUp: 0,
    emailFollowUp: 0,
    training: 0,
    internalMeeting: 0,
    otherWork: 0,
  });

  // Performance Counts State
  const [performance, setPerformance] = useState<PerformanceCounts>({
    demoArrangedLm: 3,
    demoArrangedSelf: 4,
    demoDone: 4,
    followUpCount: 18,
    closingCount: 5,
    quotationSent: 4,
    quotationApproved: 3,
    salesClosed: 2,
    revenue: 350000,
    leadCreated: 6,
    leadConverted: 2,
    pendingLeads: 4,
    lostLeads: 0,
    clientMeetings: 3,
    customerVisits: 1,
  });

  // Qualitative & Feedback state
  const [achievements, setAchievements] = useState('');
  const [problemsFaced, setProblemsFaced] = useState('');
  const [tomorrowPlan, setTomorrowPlan] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [mood, setMood] = useState<Mood>('EXCELLENT');
  const [customerFeedback, setCustomerFeedback] = useState<Feedback>('POSITIVE');
  const [selfRating, setSelfRating] = useState<number>(5);

  // Discussion comments input
  const [newCommentText, setNewCommentText] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);

  // Status & modal UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved'>('saved');
  const [successBanner, setSuccessBanner] = useState(false);

  // Auto load existing report when date or user changes
  const [loadedReportKey, setLoadedReportKey] = useState<string>('');
  
  const existingReport = currentUser ? reports.find((r) => r.userId === currentUser.id && r.date === date) : undefined;
  const currentKey = `${currentUser?.id}-${date}-${existingReport?.id || 'none'}`;

  if (currentKey !== loadedReportKey) {
    setLoadedReportKey(currentKey);
    if (existingReport) {
      setLoginTime(existingReport.loginTime);
      setLogoutTime(existingReport.logoutTime);
      setActivity(existingReport.activityHours);
      setPerformance(existingReport.performance);
      setAchievements(existingReport.achievements || '');
      setProblemsFaced(existingReport.problemsFaced || '');
      setTomorrowPlan(existingReport.tomorrowPlan || '');
      setAdditionalNotes(existingReport.additionalNotes || '');
      setPriority(existingReport.priority);
      setMood(existingReport.mood);
      setCustomerFeedback(existingReport.customerFeedback);
      setSelfRating(existingReport.selfRating);
    }
  }

  // Autosave timer simulator (every 30 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setAutosaveStatus('saving');
      setTimeout(() => setAutosaveStatus('saved'), 1000);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Calculate working hours from activity sum or time diff
  const calculateTotalActivityHours = () => {
    return Object.values(activity).reduce((sum, val) => sum + (Number(val) || 0), 0);
  };

  const totalWorkingHours = Number(calculateTotalActivityHours().toFixed(2));

  // Calculated performance metrics
  const revenuePerHour = totalWorkingHours > 0 ? Math.round(performance.revenue / totalWorkingHours) : 0;
  const salesConversion = performance.quotationSent > 0
    ? Number(((performance.salesClosed / performance.quotationSent) * 100).toFixed(1))
    : 0;
  const totalDemosArranged = performance.demoArrangedLm + performance.demoArrangedSelf;
  const demoConversion = totalDemosArranged > 0
    ? Number(((performance.demoDone / totalDemosArranged) * 100).toFixed(1))
    : 0;

  // Progress Bar Color Logic (Green = 8h, Yellow = Below Target, Red = >12h)
  const getProgressBarColor = () => {
    if (totalWorkingHours >= 8 && totalWorkingHours <= 12) return 'bg-emerald-500';
    if (totalWorkingHours > 12) return 'bg-rose-500';
    return 'bg-amber-500';
  };

  const handleFormSubmit = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);

    const payload = {
      date,
      loginTime,
      logoutTime,
      workingHours: totalWorkingHours,
      activityHours: activity,
      performance,
      achievements,
      problemsFaced,
      tomorrowPlan,
      additionalNotes,
      priority,
      mood,
      customerFeedback,
      selfRating,
    };

    const res = await submitReport(payload);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessBanner(true);
      setTimeout(() => setSuccessBanner(false), 5000);
    }
  };

  const currentReportId = reports.find((r) => r.userId === currentUser?.id && r.date === date)?.id || 'rep-1';
  const reportComments = comments.filter((c) => c.reportId === currentReportId);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    await addComment(currentReportId, newCommentText, replyToId || undefined);
    setNewCommentText('');
    setReplyToId(null);
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Top Title & Submission Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[11px] font-bold">
              Daily Shift Reporting
            </span>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Clock className="w-3 h-3" /> Auto-saved {autosaveStatus === 'saving' ? '...' : 'just now'}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Submit Daily Performance & Activity Report
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
          />
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="h-10 px-5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Report</span>
          </button>
        </div>
      </div>

      {successBanner && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Daily Report successfully logged and stored in system database!</span>
          </div>
        </motion.div>
      )}

      {/* Working Hours Meter & Shift Timing */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-violet-500" /> Shift Hours & Time Tracking
          </h2>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Login:</span>
              <input
                type="time"
                value={loginTime}
                onChange={(e) => setLoginTime(e.target.value)}
                className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200 font-mono font-bold"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Logout:</span>
              <input
                type="time"
                value={logoutTime}
                onChange={(e) => setLogoutTime(e.target.value)}
                className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200 font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Animated Progress Meter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Total Calculated Working Hours: <strong className="font-mono text-violet-600 dark:text-violet-400">{totalWorkingHours} hrs</strong>
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              {totalWorkingHours >= 8 ? (totalWorkingHours > 12 ? '⚠️ Overtime Limit (>12h)' : 'Target Achieved (8h)') : 'Below 8h Target'}
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
            <div
              className={`h-full transition-all duration-500 rounded-full ${getProgressBarColor()}`}
              style={{ width: `${Math.min(100, (totalWorkingHours / 12) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-0.5">
            <span>0h</span>
            <span>Target: 8.0h (Green)</span>
            <span>12h+ (Overtime Red)</span>
          </div>
        </div>
      </div>

      {/* Activity Hours Breakdown Inputs (Team Specific) */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
            Activity Hours Breakdown ({currentUser?.team === 'LEAD_MANAGEMENT' ? 'Lead Management Team' : currentUser?.team === 'POST_SALE' ? 'Post Sale Team' : currentUser?.team === 'RECOVERY_TEAM' ? 'Recovery Team' : 'Demo Team'})
          </h2>
          <p className="text-[11px] text-slate-400">Specify hours spent on each activity today (Total is auto-calculated)</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {(currentUser?.team === 'LEAD_MANAGEMENT'
            ? [
                { key: 'firstCalls', label: 'First Calls' },
                { key: 'oldCalls', label: 'Old Calls' },
                { key: 'feedbackCalls', label: 'Feedback Calls' },
                { key: 'followUpCalls', label: 'Follow-ups' },
                { key: 'closingCalls', label: 'Closing Calls' },
                { key: 'reportingMeeting', label: 'Reporting & Meeting' },
              ]
            : currentUser?.team === 'POST_SALE'
            ? [
                { key: 'customerOnboarding', label: 'Customer Onboarding' },
                { key: 'supportCalls', label: 'Support Calls' },
                { key: 'accountManagement', label: 'Account Management' },
                { key: 'trainingSetup', label: 'Training & Setup' },
                { key: 'feedbackCalls', label: 'Feedback Calls' },
                { key: 'reportingMeeting', label: 'Reporting & Meeting' },
              ]
            : currentUser?.team === 'RECOVERY_TEAM'
            ? [
                { key: 'paymentFollowUps', label: 'Payment Follow-ups' },
                { key: 'overdueCalls', label: 'Overdue Invoices Calls' },
                { key: 'settlementCalls', label: 'Settlement Calls' },
                { key: 'recoveryVisit', label: 'Recovery Visit' },
                { key: 'reportingMeeting', label: 'Reporting & Meeting' },
              ]
            : [
                // Default: Demo Team
                { key: 'demoArrangeCalls', label: 'Demo Arrange Calls' },
                { key: 'demo', label: 'Product Demo' },
                { key: 'followUpCalls', label: 'Follow-ups' },
                { key: 'closingCalls', label: 'Closing Calls' },
                { key: 'quotationMaking', label: 'Quotation Making' },
                { key: 'fieldVisit', label: 'Field Visit' },
                { key: 'reportingMeeting', label: 'Reporting & Meeting' },
              ]
          ).map((act) => (
            <div key={act.key} className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block truncate mb-1">
                {act.label}
              </label>
              <input
                type="number"
                step="0.25"
                min="0"
                max="24"
                value={activity[act.key as keyof ActivityBreakdown]}
                onChange={(e) =>
                  setActivity({ ...activity, [act.key]: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Daily Performance Metrics (15 count fields + Revenue) */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
            Daily Performance Output Counts
          </h2>
          <p className="text-[11px] text-slate-400">Track counts of completed calls, demos, quotations & closed deals</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { key: 'demoArrangedLm', label: 'Demo Arranged (LM)' },
            { key: 'demoArrangedSelf', label: 'Demo Arranged (Self)' },
            { key: 'demoDone', label: 'Demo Done' },
            { key: 'followUpCount', label: 'Follow-up Calls' },
            { key: 'closingCount', label: 'Closing Calls' },
            { key: 'quotationSent', label: 'Quotation Sent' },
            { key: 'quotationApproved', label: 'Quotation Approved' },
            { key: 'salesClosed', label: 'Sales Closed' },
            { key: 'leadCreated', label: 'Leads Created' },
            { key: 'leadConverted', label: 'Leads Converted' },
            { key: 'pendingLeads', label: 'Pending Leads' },
            { key: 'lostLeads', label: 'Lost Leads' },
            { key: 'clientMeetings', label: 'Client Meetings' },
            { key: 'customerVisits', label: 'Customer Visits' },
          ].map((perf) => {
            const hasDetails = [
              'demoArrangedLm',
              'demoArrangedSelf',
              'demoDone',
              'followUpCount',
              'closingCount',
              'quotationSent',
              'salesClosed',
              'customerVisits',
            ].includes(perf.key);

            const currentFieldRecords = clientRecords.filter(
              (c) => c.userId === currentUser?.id && c.date === date && c.activityType === perf.key
            );

            return (
              <div key={perf.key} className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1 gap-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block truncate" title={perf.label}>
                    {perf.label}
                  </label>
                  {hasDetails && (
                    <button
                      type="button"
                      onClick={() => setActiveDetailsField({ key: perf.key, label: perf.label })}
                      className="text-[9px] font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center shrink-0"
                    >
                      👤 Details ({currentFieldRecords.length})
                    </button>
                  )}
                </div>
                <input
                  type="number"
                  min="0"
                  value={performance[perf.key as keyof PerformanceCounts]}
                  onChange={(e) =>
                    setPerformance({ ...performance, [perf.key]: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
            );
          })}

          {/* Special Revenue Field */}
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 col-span-2 sm:col-span-1">
            <label className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block truncate mb-1">
              Total Revenue Closed (₹)
            </label>
            <input
              type="number"
              min="0"
              value={performance.revenue}
              onChange={(e) =>
                setPerformance({ ...performance, revenue: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-emerald-500/50 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Auto Calculated Performance Badges */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200/60 dark:border-violet-800/40 text-xs">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold">Calculated Revenue / Hour:</span>
            <div className="text-base font-bold text-violet-600 dark:text-violet-400 font-mono">
              ₹{revenuePerHour.toLocaleString('en-IN')}/hr
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-xs">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold">Sales Conversion Rate:</span>
            <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {salesConversion}% (Deals / Quotations)
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 text-xs">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold">Demo Conversion Rate:</span>
            <div className="text-base font-bold text-blue-600 dark:text-blue-400 font-mono">
              {demoConversion}% (Completed / Arranged)
            </div>
          </div>
        </div>
      </div>

      {/* Qualitative Feedback & Comments */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
            Qualitative Summary & Daily Feedback
          </h2>
          <p className="text-[11px] text-slate-400">Achievements, difficulties faced, tomorrow&apos;s plan, priority and self rating</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Today&apos;s Achievements</label>
            <textarea
              rows={2}
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
              placeholder="E.g. Closed Alpha Corp ₹4.5L deal & scheduled 5 new demos..."
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Problems Faced</label>
            <textarea
              rows={2}
              value={problemsFaced}
              onChange={(e) => setProblemsFaced(e.target.value)}
              placeholder="E.g. Delayed response from technical support during demo..."
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tomorrow&apos;s Action Plan</label>
            <textarea
              rows={2}
              value={tomorrowPlan}
              onChange={(e) => setTomorrowPlan(e.target.value)}
              placeholder="E.g. Follow up with Apex Retail and visit 3 clients in industrial zone..."
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Additional Notes</label>
            <textarea
              rows={2}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="E.g. Discount approval needed for Beta Logistics contract..."
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
        </div>

        {/* Priorities, Moods, Ratings Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {/* Priority */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full h-9 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          {/* Mood Selector */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Daily Mood</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value as Mood)}
              className="w-full h-9 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
            >
              <option value="EXCELLENT">😊 Excellent</option>
              <option value="GOOD">🙂 Good</option>
              <option value="AVERAGE">😐 Average</option>
              <option value="DIFFICULT">😟 Difficult</option>
              <option value="VERY_DIFFICULT">😫 Very Difficult</option>
            </select>
          </div>

          {/* Customer Feedback */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Customer Sentiment</label>
            <select
              value={customerFeedback}
              onChange={(e) => setCustomerFeedback(e.target.value as Feedback)}
              className="w-full h-9 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
            >
              <option value="POSITIVE">Positive</option>
              <option value="NEUTRAL">Neutral</option>
              <option value="NEGATIVE">Negative</option>
            </select>
          </div>

          {/* Self Rating Stars */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Self Rating</label>
            <div className="flex items-center gap-1 h-9 px-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelfRating(star)}
                  className={`text-sm transition-transform hover:scale-125 ${
                    star <= selfRating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Discussion & Report Comments Section */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-violet-500" /> Report Discussion & Manager Feedback
          </h2>
          <span className="text-xs text-slate-400 font-medium">{reportComments.length} Comments</span>
        </div>

        {/* Comment List */}
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {reportComments.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              No comments yet on this report. Start a discussion below!
            </div>
          ) : (
            reportComments.map((comm) => (
              <div
                key={comm.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{comm.userName}</span>
                    {comm.userRole === 'ADMIN' && (
                      <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-500 text-[10px] font-bold rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span>{new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {(comm.userId === currentUser?.id || currentUser?.role === 'ADMIN') && (
                      <button
                        type="button"
                        onClick={() => deleteComment(comm.id)}
                        className="hover:text-rose-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-slate-700 dark:text-slate-300">{comm.content}</p>
              </div>
            ))
          )}
        </div>

        {/* New Comment Input Form */}
        <form onSubmit={handlePostComment} className="flex gap-2">
          <input
            type="text"
            placeholder="Write a comment or mention @Administrator..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            className="flex-1 h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
          <button
            type="submit"
            className="h-10 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors"
          >
            Post Comment
          </button>
        </form>
      </div>

      {/* Confirmation Modal before Submit */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Confirm Daily Report Submission
                  </h3>
                  <p className="text-xs text-slate-400">Date: {date}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1 text-slate-700 dark:text-slate-300 font-mono">
                <div>• Total Shift Hours: {totalWorkingHours} hrs</div>
                <div>• Closed Revenue: ₹{performance.revenue.toLocaleString('en-IN')}</div>
                <div>• Demos Conducted: {performance.demoDone}</div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFormSubmit}
                  className="flex-1 h-10 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  Confirm & Submit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Client Records details popup */}
      <AnimatePresence>
        {activeDetailsField && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh]"
            >
              <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-violet-600 dark:text-violet-400 tracking-wider">
                    Structured Client Details
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {activeDetailsField.label} &mdash; Client List
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Entering client details for date: <strong className="font-mono text-slate-600 dark:text-slate-300">{date}</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveDetailsField(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
                {/* Add record form */}
                <form onSubmit={handleAddClientRecordSubmit} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Add Client Record
                  </h4>

                  {clientError && (
                    <div className="text-[11px] font-bold text-rose-500 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                      {clientError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Client / Shop Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Nazir Jewellers"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Contact Person *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Nazir"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        City (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mumbai"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                      />
                    </div>

                    {activeDetailsField.key === 'salesClosed' && (
                      <>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Sale Amount (₹) *
                          </label>
                          <input
                            type="number"
                            required
                            placeholder="e.g. 410000"
                            value={saleAmount}
                            onChange={(e) => setSaleAmount(e.target.value)}
                            className="w-full h-9 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Payment Status *
                          </label>
                          <select
                            value={paymentStatus}
                            onChange={(e) => setPaymentStatus(e.target.value as any)}
                            className="w-full h-9 px-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Partial">Partial</option>
                            <option value="Paid">Paid</option>
                          </select>
                        </div>
                      </>
                    )}

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Current Status *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Demo Scheduled"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Follow-up Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Notes / Remarks
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Enter activity comments, requirements, next steps..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="h-9 px-5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Add Client to List</span>
                    </button>
                  </div>
                </form>

                {/* List of existing */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Existing Records for {activeDetailsField.label} ({clientRecords.filter((c) => c.userId === currentUser?.id && c.date === date && c.activityType === activeDetailsField.key).length})
                  </h4>

                  {clientRecords.filter((c) => c.userId === currentUser?.id && c.date === date && c.activityType === activeDetailsField.key).length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                      No client details logged for this activity on this date yet. Use the form above to add one.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {clientRecords
                        .filter((c) => c.userId === currentUser?.id && c.date === date && c.activityType === activeDetailsField.key)
                        .map((rec, i) => (
                          <div
                            key={rec.id}
                            className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 shadow-sm flex items-start justify-between gap-3"
                          >
                            <div className="space-y-1 text-xs">
                              <div className="font-bold text-slate-900 dark:text-slate-100">
                                {i + 1}. {rec.clientName}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 space-x-2">
                                <span>Contact: <strong>{rec.contactPerson}</strong></span>
                                <span>•</span>
                                <span className="font-mono">Phone: {rec.mobile}</span>
                                {rec.city && (
                                  <>
                                    <span>•</span>
                                    <span>City: {rec.city}</span>
                                  </>
                                )}
                              </div>
                              {rec.notes && (
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl mt-1.5 border border-slate-100 dark:border-slate-800/40">
                                  {rec.notes}
                                </p>
                              )}

                              {activeDetailsField.key === 'salesClosed' && rec.saleAmount && (
                                <div className="flex items-center gap-4 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 pt-1">
                                  <span>Amount: ₹{rec.saleAmount.toLocaleString('en-IN')}</span>
                                  <span>Payment Status: {rec.paymentStatus}</span>
                                </div>
                              )}

                              {rec.followUpDate && (
                                <div className="text-[11px] text-amber-600 dark:text-amber-400 font-bold pt-1">
                                  Follow-up: {rec.followUpDate}
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteClientRecordItem(rec.id, rec.saleAmount)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveDetailsField(null)}
                  className="h-10 px-6 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
