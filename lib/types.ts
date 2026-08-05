export type Role = 'ADMIN' | 'EMPLOYEE';

export type TeamType = 'ADMIN' | 'DEMO_TEAM' | 'LEAD_MANAGEMENT' | 'POST_SALE' | 'RECOVERY_TEAM';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type Feedback = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

export type Mood = 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'DIFFICULT' | 'VERY_DIFFICULT';

export interface User {
  id: string;
  employeeId?: string;
  username: string;
  name: string;
  role: Role;
  team: TeamType;
  department?: string;
  isActive: boolean;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  designation?: string;
  monthlyRevenueTarget?: number;
  monthlyDemosTarget?: number;
  monthlyCallsTarget?: number;
}

export interface ActivityBreakdown {
  // Demo Team fields
  demoArrangeCalls?: number;
  demo?: number;
  quotationMaking?: number;
  fieldVisit?: number;

  // Lead Management fields
  firstCalls?: number;
  oldCalls?: number;
  feedbackCalls?: number;

  // Post Sale fields
  customerOnboarding?: number;
  supportCalls?: number;
  accountManagement?: number;
  trainingSetup?: number;

  // Recovery Team fields
  paymentFollowUps?: number;
  overdueCalls?: number;
  settlementCalls?: number;
  recoveryVisit?: number;

  // Shared fields
  followUpCalls?: number;
  closingCalls?: number;
  reportingMeeting?: number;
  technicalSupport?: number;
  clientVisit?: number;
  coldCalling?: number;
  whatsappFollowUp?: number;
  emailFollowUp?: number;
  training?: number;
  internalMeeting?: number;
  otherWork?: number;
  [key: string]: number | undefined;
}

export interface PerformanceCounts {
  // Demo Team KPIs
  demoArrangedLm?: number;
  demoArrangedSelf?: number;

  // Lead Management KPIs
  totalCalls?: number;
  totalDemoArranged?: number;
  feedbackCallsCount?: number;

  // Post Sale KPIs
  onboardingCompleted?: number;
  ticketsResolved?: number;
  renewalCalls?: number;
  satisfactionScore?: number;
  retentionRevenue?: number;

  // Recovery Team KPIs
  paymentCollections?: number;
  overdueResolved?: number;
  outstandingFollowups?: number;
  recoveredAmount?: number;
  collectionRatePct?: number;

  // Shared KPIs
  demoDone?: number;
  followUpCount?: number;
  salesClosed?: number;
  revenue?: number;
  closingCount?: number;
  quotationSent?: number;
  quotationApproved?: number;
  leadCreated?: number;
  leadConverted?: number;
  pendingLeads?: number;
  lostLeads?: number;
  clientMeetings?: number;
  customerVisits?: number;
  [key: string]: number | undefined;
}

export interface DailyReport {
  id: string;
  userId: string;
  userName: string;
  team: TeamType;
  date: string; // YYYY-MM-DD
  loginTime: string;
  logoutTime: string;
  workingHours: number;
  activityHours: ActivityBreakdown;
  performance: PerformanceCounts;
  revenuePerHour: number;
  salesConversion?: number;
  demoConversion?: number;
  achievements?: string;
  problemsFaced?: string;
  tomorrowPlan?: string;
  additionalNotes?: string;
  priority?: Priority;
  mood?: Mood;
  customerFeedback?: Feedback;
  selfRating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClientRecord {
  id: string;
  reportId?: string;
  userId: string;
  userName: string;
  userTeam?: TeamType;
  allottedToUserId?: string;
  allottedToUserName?: string;
  allottedByUserName?: string;
  date: string; // YYYY-MM-DD
  activityType: string;
  clientName: string; // Shop Name / Client Name
  contactPerson: string;
  mobile: string;
  city?: string;
  status: string; // e.g. 'Demo Scheduled', 'Demo Completed', 'Interested', 'Payment Pending', 'Closed'
  saleAmount?: number;
  paymentStatus?: 'Pending' | 'Partial' | 'Paid';
  notes?: string;
  followUpDate?: string; // YYYY-MM-DD
  demoTiming?: string; // e.g. "14:30 PM", "11:00 AM"
  createdAt: string;
}

export interface ClientComment {
  id: string;
  clientRecordId?: string;
  mobile: string; // Linked by mobile number for cross-team sharing
  userId: string;
  userName: string;
  userTeam: TeamType;
  content: string;
  createdAt: string;
}

export interface CommentItem {
  id: string;
  reportId: string;
  userId: string;
  userName: string;
  userRole: Role;
  content: string;
  parentId?: string | null;
  attachments?: string[];
  mentions?: string[];
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'REMINDER';
  isRead: boolean;
  createdAt: string;
}

export interface LeaderboardUser {
  rank: number;
  userId: string;
  name: string;
  team?: TeamType;
  revenue: number;
  salesClosed: number;
  demoDone: number;
  workingHours: number;
  followUpCount: number;
  revenuePerHour: number;
  targetAchievement: number;
  reportsSubmitted: number;
  badge?: string;
}

export interface AnalyticsSummary {
  totalEmployees: number;
  reportsToday: number;
  pendingReportsToday: number;
  totalWorkingHours: number;
  totalDemoArranged: number;
  totalDemoCompleted: number;
  totalFollowUps: number;
  totalClosingCalls: number;
  totalQuotations: number;
  totalClientVisits: number;
  totalSalesClosed: number;
  totalRevenue: number;
  revenueThisMonth: number;
  avgRevenuePerHour: number;
  targetAchievementPct: number;
}

export const INITIAL_EMPLOYEES_LIST = [
  // Demo Team members
  'Suraj',
  'Mansur',
  'Pavitra',
  'Snehajit',
  'Aniket',
  'Sanket',
  'Pranali',
  'Vijay',
  'Irfan',

  // Lead Management members
  'Pratiksha',
  'Ayush',
  'Roopak',
  'Ramesh',
  'Ankita',
  'Kartik',

  // Post Sale members
  'Post Sale Rep',

  // Recovery Team members
  'Recovery Rep',
] as const;

export type EmployeeName = (typeof INITIAL_EMPLOYEES_LIST)[number];
