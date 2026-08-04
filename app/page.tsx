'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import LoginPage from '@/components/auth/LoginPage';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import GlobalSearchModal from '@/components/layout/GlobalSearchModal';
import AIInsightsModal from '@/components/ai/AIInsightsModal';

import AdminDashboard from '@/components/dashboard/AdminDashboard';
import DemoTeamDashboard from '@/components/dashboard/DemoTeamDashboard';
import LeadManagementDashboard from '@/components/dashboard/LeadManagementDashboard';
import PostSaleDashboard from '@/components/dashboard/PostSaleDashboard';
import RecoveryTeamDashboard from '@/components/dashboard/RecoveryTeamDashboard';
import DailyReportForm from '@/components/report/DailyReportForm';
import CalendarView from '@/components/calendar/CalendarView';
import AnalyticsView from '@/components/analytics/AnalyticsView';
import LeaderboardView from '@/components/leaderboard/LeaderboardView';
import ReportsView from '@/components/reports/ReportsView';
import EmployeesView from '@/components/employees/EmployeesView';
import SettingsView from '@/components/settings/SettingsView';
import ClientsView from '@/components/clients/ClientsView';
import ProfileView from '@/components/profile/ProfileView';

import { ShieldAlert, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Home() {
  const { currentUser, activeTab, accessDeniedMsg, setAccessDeniedMsg, validateAndNavigateTab } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Validate activeTab against route permissions whenever activeTab changes
  useEffect(() => {
    if (currentUser) {
      validateAndNavigateTab(activeTab);
    }
  }, [activeTab, currentUser]);

  // Unauthenticated screen
  if (!currentUser) {
    return <LoginPage />;
  }

  // Render team-specific or role-specific tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (currentUser.role === 'ADMIN') {
          return <AdminDashboard onOpenAIModal={() => setIsAIModalOpen(true)} />;
        }
        switch (currentUser.team) {
          case 'DEMO_TEAM':
            return <DemoTeamDashboard />;
          case 'LEAD_MANAGEMENT':
            return <LeadManagementDashboard />;
          case 'POST_SALE':
            return <PostSaleDashboard />;
          case 'RECOVERY_TEAM':
            return <RecoveryTeamDashboard />;
          default:
            return <DemoTeamDashboard />;
        }

      case 'company-dashboard':
        return <AdminDashboard onOpenAIModal={() => setIsAIModalOpen(true)} />;
      case 'demo-dashboard':
        return <DemoTeamDashboard />;
      case 'lead-dashboard':
        return <LeadManagementDashboard />;
      case 'post-sale-dashboard':
        return <PostSaleDashboard />;
      case 'recovery-dashboard':
        return <RecoveryTeamDashboard />;
      case 'daily-report':
        return <DailyReportForm />;
      case 'calendar':
        return <CalendarView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'leaderboard':
      case 'leaderboards':
        return <LeaderboardView />;
      case 'reports':
        return <ReportsView />;
      case 'employees':
        return <EmployeesView />;
      case 'clients':
        return <ClientsView />;
      case 'settings':
        return <SettingsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return currentUser.role === 'ADMIN' ? (
          <AdminDashboard onOpenAIModal={() => setIsAIModalOpen(true)} />
        ) : (
          <DemoTeamDashboard />
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden text-slate-900 dark:text-slate-100 relative">
      {/* Navigation Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Sticky Header */}
        <Header
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenAIModal={() => setIsAIModalOpen(true)}
        />

        {/* Access Denied Toast Banner */}
        <AnimatePresence>
          {accessDeniedMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-4 md:mx-8 mt-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-between shadow-lg z-50 shrink-0"
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 shrink-0 text-rose-500" />
                <span>{accessDeniedMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setAccessDeniedMsg(null)}
                className="p-1 rounded-lg hover:bg-rose-500/20 text-rose-500"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Main Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderTabContent()}
        </main>
      </div>

      {/* Global Command K Search Overlay */}
      <GlobalSearchModal />

      {/* Gemini AI Insights Analyst Modal */}
      <AIInsightsModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />
    </div>
  );
}
