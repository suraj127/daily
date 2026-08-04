'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, DailyReport, CommentItem, NotificationItem, ClientRecord, ClientComment, TeamType } from '@/lib/types';
import { INITIAL_USERS, INITIAL_REPORTS, INITIAL_COMMENTS, INITIAL_NOTIFICATIONS, getFormattedDate, getUserTeam } from '@/lib/mock-data';
import { INITIAL_CLIENT_RECORDS, INITIAL_CLIENT_COMMENTS } from '@/lib/mock-clients';

interface AppContextType {
  currentUser: User | null;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  accessDeniedMsg: string | null;
  setAccessDeniedMsg: (msg: string | null) => void;
  adminTeamFilter: TeamType | 'ALL';
  setAdminTeamFilter: (filter: TeamType | 'ALL') => void;
  reports: DailyReport[];
  comments: CommentItem[];
  clientComments: ClientComment[];
  notifications: NotificationItem[];
  users: User[];
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  clientRecords: ClientRecord[];

  // Actions
  login: (name: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  submitReport: (reportData: Partial<DailyReport>) => Promise<{ success: boolean; error?: string; report?: DailyReport }>;
  deleteReport: (id: string) => Promise<boolean>;
  updateReport: (updatedReport: DailyReport) => Promise<boolean>;
  addComment: (reportId: string, content: string, parentId?: string) => Promise<boolean>;
  deleteComment: (commentId: string) => Promise<boolean>;
  addClientComment: (mobile: string, content: string) => Promise<boolean>;
  addEmployee: (name: string, department?: string, team?: TeamType) => Promise<boolean>;
  toggleEmployeeStatus: (id: string) => Promise<boolean>;
  deleteEmployee: (id: string) => Promise<boolean>;
  markNotificationRead: (id: string) => void;
  getTodayReportForUser: (userId: string) => DailyReport | undefined;
  addClientRecord: (record: Omit<ClientRecord, 'id' | 'createdAt' | 'userName' | 'userId'>) => Promise<boolean>;
  deleteClientRecord: (id: string) => Promise<boolean>;
  validateAndNavigateTab: (tab: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUserStr = localStorage.getItem('salestrack_user');
      if (savedUserStr) {
        try {
          const u = JSON.parse(savedUserStr);
          if (u && !u.team) {
            u.team = getUserTeam(u.name);
          }
          return u;
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_USERS.find((u) => u.name === 'Aniket') || INITIAL_USERS[1];
  });

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('salestrack_theme') as 'light' | 'dark' | null;
      return savedTheme || 'light';
    }
    return 'light';
  });

  const [activeTab, setActiveTabState] = useState<string>('dashboard');
  const [accessDeniedMsg, setAccessDeniedMsg] = useState<string | null>(null);
  const [adminTeamFilter, setAdminTeamFilter] = useState<TeamType | 'ALL'>('ALL');

  const [reports, setReports] = useState<DailyReport[]>(INITIAL_REPORTS);
  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
  const [clientComments, setClientComments] = useState<ClientComment[]>(INITIAL_CLIENT_COMMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [clientRecords, setClientRecords] = useState<ClientRecord[]>(INITIAL_CLIENT_RECORDS);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(getFormattedDate(0));

  // Auto-dismiss access denied notification
  useEffect(() => {
    if (accessDeniedMsg) {
      const timer = setTimeout(() => {
        setAccessDeniedMsg(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [accessDeniedMsg]);

  // Sync DOM dark class when theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('salestrack_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const validateAndNavigateTab = (targetTab: string) => {
    if (!currentUser) return;

    if (currentUser.role === 'ADMIN') {
      if (targetTab === 'daily-report') {
        setAccessDeniedMsg('Access Restricted: Admin users do not submit daily reports. Redirected to Company Dashboard.');
        setActiveTabState('company-dashboard');
        return;
      }
    }

    if (currentUser.role === 'EMPLOYEE') {
      const allowedEmployeeTabs = ['dashboard', 'daily-report', 'calendar', 'reports', 'clients', 'profile'];
      if (!allowedEmployeeTabs.includes(targetTab)) {
        setAccessDeniedMsg(`Access Denied: You do not have permission to access '${targetTab}'. Redirected to Dashboard.`);
        setActiveTabState('dashboard');
        return;
      }
    }

    setActiveTabState(targetTab);
  };

  const setActiveTab = (tab: string) => {
    validateAndNavigateTab(tab);
  };

  const login = async (name: string, password: string) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Login failed' };
      }

      const userWithTeam: User = {
        ...data.user,
        team: data.user.team || getUserTeam(data.user.name),
      };

      setCurrentUser(userWithTeam);
      localStorage.setItem('salestrack_user', JSON.stringify(userWithTeam));
      setActiveTabState('dashboard');
      setAccessDeniedMsg(null);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Server connection error' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('salestrack_user');
    setActiveTabState('dashboard');
  };

  const submitReport = async (reportData: Partial<DailyReport>) => {
    if (!currentUser) return { success: false, error: 'User not authenticated' };
    if (currentUser.role === 'ADMIN') {
      return { success: false, error: 'Admin users do not submit daily activity reports.' };
    }

    const payload: Partial<DailyReport> = {
      ...reportData,
      userId: currentUser.id,
      userName: currentUser.name,
      team: currentUser.team,
      date: reportData.date || getFormattedDate(0),
    };

    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      const newReport: DailyReport = data.success && data.report ? data.report : {
        id: `rep-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        team: currentUser.team,
        date: payload.date!,
        loginTime: payload.loginTime || '09:00',
        logoutTime: payload.logoutTime || '17:30',
        workingHours: payload.workingHours || 8,
        activityHours: payload.activityHours || {},
        performance: payload.performance || { demoDone: 0, followUpCount: 0, salesClosed: 0, revenue: 0 },
        revenuePerHour: payload.revenuePerHour || 0,
        achievements: payload.achievements || '',
        problemsFaced: payload.problemsFaced || '',
        tomorrowPlan: payload.tomorrowPlan || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setReports((prev) => {
        const existingIdx = prev.findIndex(
          (r) => r.userId === newReport.userId && r.date === newReport.date
        );
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = newReport;
          return updated;
        }
        return [newReport, ...prev];
      });

      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: currentUser.id,
        title: 'Report Saved',
        message: `Daily report for ${newReport.date} successfully logged.`,
        type: 'SUCCESS',
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotif, ...prev]);

      return { success: true, report: newReport };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error submitting report' };
    }
  };

  const deleteReport = async (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    return true;
  };

  const updateReport = async (updatedReport: DailyReport) => {
    setReports((prev) => prev.map((r) => (r.id === updatedReport.id ? updatedReport : r)));
    return true;
  };

  const addComment = async (reportId: string, content: string, parentId?: string) => {
    if (!currentUser) return false;
    const newComment: CommentItem = {
      id: `comm-${Date.now()}`,
      reportId,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      content,
      parentId: parentId || null,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newComment]);
    return true;
  };

  const deleteComment = async (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId && c.parentId !== commentId));
    return true;
  };

  const addClientComment = async (mobile: string, content: string) => {
    if (!currentUser) return false;
    const newComment: ClientComment = {
      id: `cc-${Date.now()}`,
      mobile,
      userId: currentUser.id,
      userName: currentUser.name,
      userTeam: currentUser.team,
      content,
      createdAt: new Date().toISOString(),
    };
    setClientComments((prev) => [...prev, newComment]);
    return true;
  };

  const addEmployee = async (name: string, department?: string, team?: TeamType) => {
    const assignedTeam = team || getUserTeam(name);
    const newUser: User = {
      id: `user-emp-${Date.now()}`,
      username: name.toLowerCase().replace(/\s+/g, '.'),
      name,
      role: 'EMPLOYEE',
      team: assignedTeam,
      department: department || 'Sales Operations',
      isActive: true,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@salestrack.pro`,
      designation: 'Sales Representative',
    };
    setUsers((prev) => [...prev, newUser]);
    return true;
  };

  const toggleEmployeeStatus = async (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    );
    return true;
  };

  const deleteEmployee = async (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    return true;
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const getTodayReportForUser = (userId: string) => {
    const today = getFormattedDate(0);
    return reports.find((r) => r.userId === userId && r.date === today);
  };

  const addClientRecord = async (record: Omit<ClientRecord, 'id' | 'createdAt' | 'userName' | 'userId'>) => {
    if (!currentUser) return false;
    const newRecord: ClientRecord = {
      ...record,
      id: `cli-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userTeam: currentUser.team,
      createdAt: new Date().toISOString(),
    };
    setClientRecords((prev) => [newRecord, ...prev]);
    return true;
  };

  const deleteClientRecord = async (id: string) => {
    setClientRecords((prev) => prev.filter((c) => c.id !== id));
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        theme,
        setTheme,
        activeTab,
        setActiveTab,
        accessDeniedMsg,
        setAccessDeniedMsg,
        adminTeamFilter,
        setAdminTeamFilter,
        reports,
        comments,
        clientComments,
        notifications,
        users,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        selectedDate,
        setSelectedDate,
        login,
        logout,
        submitReport,
        deleteReport,
        updateReport,
        addComment,
        deleteComment,
        addClientComment,
        addEmployee,
        toggleEmployeeStatus,
        deleteEmployee,
        markNotificationRead,
        getTodayReportForUser,
        clientRecords,
        addClientRecord,
        deleteClientRecord,
        validateAndNavigateTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
