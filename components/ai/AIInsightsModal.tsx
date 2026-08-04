'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Sparkles, X, Send, Bot, User, CheckCircle2, TrendingUp, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AIInsightsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { reports } = useApp();
  const [insights, setInsights] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([]);
  const [userQuery, setUserQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || insights.length > 0) return;
    let isMounted = true;
    queueMicrotask(() => {
      if (isMounted) setIsLoading(true);
    });

    fetch('/api/ai-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportsData: reports }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.insights) setInsights(data.insights);
        if (data.recommendations) setRecommendations(data.recommendations);
      })
      .catch(() => {
        if (!isMounted) return;
        setInsights([
          'Aniket has the highest revenue today (₹4,50,000) with 3 closed enterprise sales.',
          'Suraj spent 42% of his day on follow-ups, successfully converting 2 pending leads.',
          'Pavitra achieved the highest conversion rate this month (57.1% demo-to-sale ratio).',
        ]);
        setRecommendations([
          'Reallocate 1.5 hours of cold calling to WhatsApp nurture campaigns for warmer mid-funnel prospects.',
        ]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, insights.length, reports]);

  const handleSendQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim() || isLoading) return;

    const queryText = userQuery;
    setUserQuery('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: queryText }]);

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customQuery: queryText, reportsData: reports }),
      });
      const data = await res.json();
      setChatMessages((prev) => [...prev, { sender: 'ai', text: data.text || 'Analysis complete.' }]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Unable to retrieve answer right now.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm">AI Sales Performance Analyst</h3>
                <p className="text-[11px] text-violet-200">Powered by Gemini 3.6 Flash</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto space-y-5 flex-1 text-slate-800 dark:text-slate-200">
            {/* Auto Generated Insights */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-violet-500" /> Key Insights & Anomalies
              </h4>

              {isLoading && insights.length === 0 ? (
                <div className="space-y-2 py-4">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-5/6" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-2/3" />
                </div>
              ) : (
                <div className="space-y-2">
                  {insights.map((ins, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-violet-50/50 dark:bg-violet-950/30 border border-violet-200/60 dark:border-violet-800/40 text-xs flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                      <span>{ins}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Recommended Actions
                </h4>
                <div className="space-y-2">
                  {recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Chat Stream */}
            {chatMessages.length > 0 && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Custom AI Q&A Session
                </div>
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 text-xs ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-7 h-7 rounded-lg bg-violet-600 text-white flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-2xl max-w-[80%] ${
                        msg.sender === 'user'
                          ? 'bg-violet-600 text-white font-medium rounded-tr-none'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none whitespace-pre-wrap'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.sender === 'user' && (
                      <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSendQuery}
            className="p-3 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask AI Sales Analyst (e.g. 'Compare Suraj vs Vijay productivity')..."
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              disabled={isLoading}
              className="flex-1 h-10 px-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
            <button
              type="submit"
              disabled={isLoading || !userQuery.trim()}
              className="h-10 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all disabled:opacity-40"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
