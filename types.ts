
export enum ToolType {
  DASHBOARD = 'DASHBOARD',
  CODE_GEN = 'CODE_GEN',
  MOD_GEN = 'MOD_GEN',
  SKRIPT = 'SKRIPT',
  RESOURCE_PACK = 'RESOURCE_PACK',
  CRASH_DIAGNOSIS = 'CRASH_DIAGNOSIS',
  SKIN_GEN = 'SKIN_GEN',
  MOTD_GEN = 'MOTD_GEN',
  DISCORD_BOT = 'DISCORD_BOT',
  SUPPORT = 'SUPPORT',
  BILLING = 'BILLING',
  MODERATOR = 'MODERATOR'
}

export type UserPlan = 'budget' | 'pro' | 'legend';

export interface UserProfile {
  name: string;
  email: string;
  photo: string;
  isPremium: boolean;
  plan: UserPlan;
  isModerator: boolean;
  joinedAt: number;
  recoveryCode: string;
  usageStats?: Record<string, number>;
}

export interface ProjectFile {
  name: string;
  content: string;
  language: string;
}

export interface GeneratedProject {
  id: string;
  type: ToolType;
  title: string;
  files: ProjectFile[];
  steps: string[];
  timestamp: number;
  version: string;
  platform: string;
}

export interface DiagnosisResult {
  error: string;
  cause: string;
  solution: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type TicketCategory = 'Billing & Refunds' | 'Technical Issue' | 'Crash/Plugin Problem' | 'Account & Login';

export interface TicketMessage {
  id: string;
  sender: 'user' | 'admin';
  content: string;
  timestamp: number;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: 'Normal' | 'High';
  createdAt: number;
  lastUpdated: number;
  messages: TicketMessage[];
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  userName: string;
  txnId: string;
  amount: string;
  planRequested: UserPlan;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: number;
  screenshot?: string;
}
