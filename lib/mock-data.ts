import { DailyReport, User, CommentItem, NotificationItem, INITIAL_EMPLOYEES_LIST, TeamType } from './types';

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
    employeeId: 'ADM-001',
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
      employeeId: `EMP-${(index + 1).toString().padStart(3, '0')}`,
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

export function getFormattedDate(daysOffset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

export const INITIAL_REPORTS: DailyReport[] = [];

export const INITIAL_COMMENTS: CommentItem[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
