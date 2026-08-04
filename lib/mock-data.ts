import { DailyReport, User, LeaderboardUser, CommentItem, NotificationItem, INITIAL_EMPLOYEES_LIST, TeamType } from './types';

export function getUserTeam(name: string): TeamType {
  const n = (name || '').toLowerCase().trim();
  if (n === 'admin' || n === 'administrator') return 'ADMIN';
  const demoMembers = ['suraj', 'mansur', 'pavitra', 'snehajit', 'aniket', 'sanket', 'pranali', 'vijay', 'irfan', 'demo team'];
  if (demoMembers.includes(n)) return 'DEMO_TEAM';
  const lmMembers = ['pratiksha', 'ayush', 'roopak', 'ramesh', 'ankita', 'kartik', 'lead management'];
  if (lmMembers.includes(n)) return 'LEAD_MANAGEMENT';
  const postSaleMembers = ['post sale', 'post sale rep', 'post sale team'];
  if (postSaleMembers.includes(n)) return 'POST_SALE';
  const recoveryMembers = ['recovery team', 'recovery rep'];
  if (recoveryMembers.includes(n)) return 'RECOVERY_TEAM';
  return 'DEMO_TEAM';
}

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    username: 'admin',
    name: 'Administrator',
    role: 'ADMIN',
    team: 'ADMIN',
    department: 'Executive Management',
    isActive: true,
    email: 'admin@salestrack.pro',
    designation: 'VP of Sales Operations',
  },
  ...INITIAL_EMPLOYEES_LIST.map((empName, index) => {
    const team = getUserTeam(empName);
    return {
      id: `user-emp-${index + 1}`,
      username: empName.toLowerCase().replace(/\s+/g, '.'),
      name: empName,
      role: 'EMPLOYEE' as const,
      team,
      department:
        team === 'DEMO_TEAM'
          ? 'Demo & Product Presentation'
          : team === 'LEAD_MANAGEMENT'
          ? 'Lead Gen & Conversion'
          : team === 'POST_SALE'
          ? 'Customer Success'
          : 'Payment Recovery',
      isActive: true,
      email: `${empName.toLowerCase().replace(/\s+/g, '')}@salestrack.pro`,
      designation: 'Sales Representative',
    };
  }),
];

// Helper to format dates YYYY-MM-DD
export function getFormattedDate(daysOffset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

const todayStr = getFormattedDate(0);
const yesterdayStr = getFormattedDate(-1);
const dayMinus2Str = getFormattedDate(-2);
const dayMinus3Str = getFormattedDate(-3);
const dayMinus4Str = getFormattedDate(-4);
const dayMinus5Str = getFormattedDate(-5);

export const INITIAL_REPORTS: DailyReport[] = [
  {
    id: 'rep-1',
    userId: 'user-emp-5', // Aniket
    userName: 'Aniket',
    team: 'DEMO_TEAM',
    date: todayStr,
    loginTime: '09:00',
    logoutTime: '17:30',
    workingHours: 8.5,
    activityHours: {
      demoArrangeCalls: 1.5,
      demo: 2.0,
      followUpCalls: 2.0,
      closingCalls: 1.0,
      quotationMaking: 0.5,
      fieldVisit: 1.0,
      reportingMeeting: 0.5,
    },
    performance: {
      demoArrangedLm: 4,
      demoArrangedSelf: 6,
      demoDone: 5,
      followUpCount: 18,
      closingCount: 5,
      salesClosed: 3,
      revenue: 450000,
    },
    revenuePerHour: 52941,
    achievements: 'Closed ₹4.5L deal with Alpha Corp & scheduled 5 new demos.',
    problemsFaced: 'Technical query delay from support team.',
    tomorrowPlan: 'Follow up with procurement & conduct client visits.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rep-2',
    userId: 'user-emp-3', // Pavitra
    userName: 'Pavitra',
    team: 'DEMO_TEAM',
    date: todayStr,
    loginTime: '09:15',
    logoutTime: '18:00',
    workingHours: 8.75,
    activityHours: {
      demoArrangeCalls: 1.0,
      demo: 2.5,
      followUpCalls: 2.5,
      closingCalls: 1.0,
      quotationMaking: 0.75,
      reportingMeeting: 1.0,
    },
    performance: {
      demoArrangedLm: 3,
      demoArrangedSelf: 4,
      demoDone: 4,
      followUpCount: 22,
      closingCount: 6,
      salesClosed: 2,
      revenue: 320000,
    },
    revenuePerHour: 36571,
    achievements: 'Highest conversion rate! Converted 2 key prospects.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rep-3',
    userId: 'user-emp-10', // Pratiksha (Lead Management)
    userName: 'Pratiksha',
    team: 'LEAD_MANAGEMENT',
    date: todayStr,
    loginTime: '09:30',
    logoutTime: '18:30',
    workingHours: 9.0,
    activityHours: {
      firstCalls: 2.5,
      oldCalls: 2.0,
      feedbackCalls: 1.5,
      followUpCalls: 1.5,
      closingCalls: 1.0,
      reportingMeeting: 0.5,
    },
    performance: {
      totalCalls: 35,
      totalDemoArranged: 8,
      demoDone: 3,
      feedbackCallsCount: 12,
      followUpCount: 15,
      salesClosed: 2,
      revenue: 280000,
    },
    revenuePerHour: 31111,
    achievements: 'Processed 35 cold and warm leads today.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rep-4',
    userId: 'user-emp-11', // Ayush (Lead Management)
    userName: 'Ayush',
    team: 'LEAD_MANAGEMENT',
    date: todayStr,
    loginTime: '08:45',
    logoutTime: '17:15',
    workingHours: 8.5,
    activityHours: {
      firstCalls: 3.0,
      oldCalls: 2.0,
      feedbackCalls: 1.5,
      followUpCalls: 1.0,
      closingCalls: 0.5,
      reportingMeeting: 0.5,
    },
    performance: {
      totalCalls: 40,
      totalDemoArranged: 10,
      demoDone: 4,
      feedbackCallsCount: 14,
      followUpCount: 10,
      salesClosed: 2,
      revenue: 390000,
    },
    revenuePerHour: 45882,
    achievements: 'Arranged 10 demos for the Demo Team!',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rep-5',
    userId: 'user-emp-5', // Aniket (Yesterday)
    userName: 'Aniket',
    team: 'DEMO_TEAM',
    date: yesterdayStr,
    loginTime: '09:00',
    logoutTime: '17:45',
    workingHours: 8.75,
    activityHours: {
      demoArrangeCalls: 2.0,
      demo: 3.0,
      followUpCalls: 1.5,
      closingCalls: 1.0,
      quotationMaking: 0.75,
      reportingMeeting: 0.5,
    },
    performance: {
      demoArrangedLm: 5,
      demoArrangedSelf: 4,
      demoDone: 6,
      followUpCount: 16,
      closingCount: 4,
      salesClosed: 4,
      revenue: 520000,
    },
    revenuePerHour: 59428,
    achievements: 'Outstanding sales day with 4 closed deals totaling ₹5.2L.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rep-6',
    userId: 'user-emp-2', // Mansur (Yesterday)
    userName: 'Mansur',
    team: 'DEMO_TEAM',
    date: yesterdayStr,
    loginTime: '09:00',
    logoutTime: '17:00',
    workingHours: 8.0,
    activityHours: {
      demoArrangeCalls: 1.5,
      demo: 2.0,
      followUpCalls: 2.0,
      closingCalls: 1.0,
      quotationMaking: 1.0,
      reportingMeeting: 0.5,
    },
    performance: {
      demoArrangedLm: 3,
      demoArrangedSelf: 3,
      demoDone: 3,
      followUpCount: 14,
      closingCount: 3,
      salesClosed: 2,
      revenue: 210000,
    },
    revenuePerHour: 26250,
    achievements: 'Secured 2 new deals in the Western region.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rep-7',
    userId: 'user-emp-6', // Sanket
    userName: 'Sanket',
    team: 'DEMO_TEAM',
    date: dayMinus2Str,
    loginTime: '09:30',
    logoutTime: '18:15',
    workingHours: 8.75,
    activityHours: {
      demoArrangeCalls: 2.5,
      demo: 2.0,
      followUpCalls: 2.0,
      closingCalls: 1.0,
      quotationMaking: 0.75,
      reportingMeeting: 0.5,
    },
    performance: {
      demoArrangedLm: 6,
      demoArrangedSelf: 4,
      demoDone: 4,
      followUpCount: 20,
      closingCount: 3,
      salesClosed: 2,
      revenue: 290000,
    },
    revenuePerHour: 33142,
    achievements: 'Arranged 10 demos for the upcoming week.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rep-8',
    userId: 'user-emp-7', // Pranali
    userName: 'Pranali',
    team: 'DEMO_TEAM',
    date: dayMinus3Str,
    loginTime: '09:00',
    logoutTime: '17:30',
    workingHours: 8.5,
    activityHours: {
      demoArrangeCalls: 1.5,
      demo: 3.0,
      followUpCalls: 1.5,
      closingCalls: 1.0,
      quotationMaking: 1.0,
      reportingMeeting: 0.5,
    },
    performance: {
      demoArrangedLm: 4,
      demoArrangedSelf: 3,
      demoDone: 5,
      followUpCount: 17,
      closingCount: 4,
      salesClosed: 3,
      revenue: 340000,
    },
    revenuePerHour: 40000,
    achievements: 'Conducted 5 comprehensive demos with 100% positive feedback.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rep-9',
    userId: 'user-emp-11', // Ayush
    userName: 'Ayush',
    team: 'LEAD_MANAGEMENT',
    date: dayMinus4Str,
    loginTime: '09:00',
    logoutTime: '18:00',
    workingHours: 9.0,
    activityHours: {
      firstCalls: 2.0,
      oldCalls: 2.0,
      feedbackCalls: 2.5,
      followUpCalls: 1.0,
      closingCalls: 1.0,
      reportingMeeting: 0.5,
    },
    performance: {
      totalCalls: 38,
      totalDemoArranged: 9,
      demoDone: 4,
      feedbackCallsCount: 15,
      followUpCount: 12,
      salesClosed: 2,
      revenue: 260000,
    },
    revenuePerHour: 28888,
    achievements: 'Expanded coverage in North region leads.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rep-10',
    userId: 'user-emp-12', // Roopak
    userName: 'Roopak',
    team: 'LEAD_MANAGEMENT',
    date: dayMinus5Str,
    loginTime: '08:30',
    logoutTime: '17:00',
    workingHours: 8.5,
    activityHours: {
      firstCalls: 2.5,
      oldCalls: 2.0,
      feedbackCalls: 2.0,
      followUpCalls: 1.0,
      closingCalls: 0.5,
      reportingMeeting: 0.5,
    },
    performance: {
      totalCalls: 42,
      totalDemoArranged: 11,
      demoDone: 5,
      feedbackCallsCount: 16,
      followUpCount: 10,
      salesClosed: 3,
      revenue: 380000,
    },
    revenuePerHour: 44705,
    achievements: 'High demo conversion rate and closed ₹3.8L total revenue.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'comm-1',
    reportId: 'rep-1',
    userId: 'user-admin',
    userName: 'Administrator',
    userRole: 'ADMIN',
    content: 'Fantastic work Aniket on closing Alpha Corp! Let us ensure their onboarding experience is seamless.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'comm-2',
    reportId: 'rep-1',
    userId: 'user-emp-5',
    userName: 'Aniket',
    userRole: 'EMPLOYEE',
    content: '@Administrator Thanks sir! Onboarding documents sent to Post Sale team already.',
    parentId: 'comm-1',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'comm-3',
    reportId: 'rep-3',
    userId: 'user-admin',
    userName: 'Administrator',
    userRole: 'ADMIN',
    content: 'Great persistence Pratiksha! High lead processing today. Keep up the momentum.',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-emp-5',
    title: 'Report Submitted Successfully',
    message: 'Your daily report for today has been recorded.',
    type: 'SUCCESS',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif-2',
    userId: 'user-admin',
    title: 'Daily Report Deadline Alert',
    message: '15 employees have pending reports for today.',
    type: 'REMINDER',
    isRead: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'notif-3',
    userId: 'all',
    title: 'Monthly Target Announcement',
    message: 'Team Target: ₹1.2 Cr Revenue for this month. Push for key enterprise deals!',
    type: 'INFO',
    isRead: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];
