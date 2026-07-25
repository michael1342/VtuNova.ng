import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  ArrowPathIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrophyIcon,
  ShieldExclamationIcon,
  ArrowUpRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

// ─── TYPES & INTERFACES ──────────────────────────────────────────────────────
export interface Referral {
  id: string;
  name: string;
  email: string;
  phone: string;
  code: string;
  invites: number;
  conversions: number;
  earnings: number;
  status: 'Active' | 'Pending' | 'Rewarded' | 'Suspended';
  joinedDate: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  campaign: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'Active' | 'Paused' | 'Scheduled' | 'Ended';
  participants: number;
  budget: number;
  spent: number;
  conversionRate: number;
  description: string;
}

export interface RewardConfig {
  type: 'Fixed Amount' | 'Percentage';
  value: number;
  currency: string;
  maxReward: number;
  activationThreshold: number;
  expiryDays: number;
}

export interface Payout {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Paid';
  requestedDate: string;
  campaign: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  email: string;
  avatar: string;
  invites: number;
  conversions: number;
  earnings: number;
}

export interface FraudRecord {
  id: string;
  type: 'Duplicate Referrals' | 'Unusual Conversion Activity' | 'Rapid Registrations' | 'Repeated Device Usage';
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  userId: string;
  userName: string;
  timestamp: string;
  status: 'Reviewed' | 'Flagged' | 'Restricted' | 'Pending';
}

export interface ActivityLog {
  id: string;
  event: 'Referral Created' | 'Reward Issued' | 'Campaign Activated' | 'Conversion Completed' | 'Referral Suspended';
  details: string;
  adminName: string;
  timestamp: string;
}

// ─── INITIAL MOCK DATA ───────────────────────────────────────────────────────
const INITIAL_REFERRALS: Referral[] = [
  {
    id: 'REF-10045',
    name: 'Michael Anazodo',
    email: 'michael@example.com',
    phone: '+234 803 123 4567',
    code: 'SWIFT-MICHAEL',
    invites: 82,
    conversions: 34,
    earnings: 84500,
    status: 'Rewarded',
    joinedDate: '2026-06-20',
    tier: 'Gold',
    campaign: 'Welcome Campaign'
  },
  {
    id: 'REF-10046',
    name: 'Aliyu Bello',
    email: 'aliyu.bello@example.com',
    phone: '+234 812 345 6789',
    code: 'SWIFT-ALIYU',
    invites: 45,
    conversions: 18,
    earnings: 45000,
    status: 'Active',
    joinedDate: '2026-06-19',
    tier: 'Silver',
    campaign: 'Welcome Campaign'
  },
  {
    id: 'REF-10047',
    name: 'Chioma Nwachukwu',
    email: 'chioma.n@example.com',
    phone: '+234 905 987 6543',
    code: 'SWIFT-CHIOMA',
    invites: 120,
    conversions: 52,
    earnings: 130000,
    status: 'Rewarded',
    joinedDate: '2026-06-20',
    tier: 'Platinum',
    campaign: 'VIP Referral Program'
  },
  {
    id: 'REF-10048',
    name: 'Babajide Cole',
    email: 'b.cole@example.com',
    phone: '+234 701 445 6677',
    code: 'SWIFT-JIDE',
    invites: 12,
    conversions: 4,
    earnings: 10000,
    status: 'Suspended',
    joinedDate: '2026-06-15',
    tier: 'Bronze',
    campaign: 'Holiday Bonus'
  },
  {
    id: 'REF-10049',
    name: 'Elizabeth Clark',
    email: 'lizzie@example.com',
    phone: '+234 809 334 5566',
    code: 'SWIFT-LIZ',
    invites: 2,
    conversions: 1,
    earnings: 2500,
    status: 'Pending',
    joinedDate: '2026-06-20',
    tier: 'Bronze',
    campaign: 'Welcome Campaign'
  }
];

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'CMP-01',
    name: 'Welcome Campaign',
    status: 'Active',
    participants: 12450,
    budget: 5000000,
    spent: 3120000,
    conversionRate: 38,
    description: 'General onboarding campaign offering ₦500 to new referees and referrers.'
  },
  {
    id: 'CMP-02',
    name: 'Holiday Bonus',
    status: 'Active',
    participants: 4200,
    budget: 2000000,
    spent: 980000,
    conversionRate: 28,
    description: 'Festive promotion offering double cashbacks on electricity and cable TV referrals.'
  },
  {
    id: 'CMP-03',
    name: 'Top Referrer Rewards',
    status: 'Scheduled',
    participants: 0,
    budget: 1500000,
    spent: 0,
    conversionRate: 0,
    description: 'Quarterly leaderboard rewards giving an extra ₦50,000 to the top 10 referrers.'
  },
  {
    id: 'CMP-04',
    name: 'VIP Referral Program',
    status: 'Active',
    participants: 1200,
    budget: 3000000,
    spent: 2150000,
    conversionRate: 44,
    description: 'Dedicated campaign for high-tier agents and merchants with customized margins.'
  }
];

const INITIAL_PAYOUTS: Payout[] = [
  {
    id: 'PAY-10023',
    userId: 'USR-8890',
    userName: 'Chioma Nwachukwu',
    userEmail: 'chioma.n@example.com',
    amount: 15000,
    status: 'Pending',
    requestedDate: '2026-06-20 17:15',
    campaign: 'VIP Referral Program'
  },
  {
    id: 'PAY-10024',
    userId: 'USR-4432',
    userName: 'Babajide Cole',
    userEmail: 'b.cole@example.com',
    amount: 2500,
    status: 'Pending',
    requestedDate: '2026-06-20 15:30',
    campaign: 'Holiday Bonus'
  },
  {
    id: 'PAY-10025',
    userId: 'USR-9021',
    userName: 'Sandra Okafor',
    userEmail: 'sandra@example.com',
    amount: 10000,
    status: 'Pending',
    requestedDate: '2026-06-20 12:45',
    campaign: 'Welcome Campaign'
  }
];

const FRAUD_RECORDS: FraudRecord[] = [
  {
    id: 'FRD-501',
    type: 'Unusual Conversion Activity',
    description: 'Referrer SWIFT-JIDE generated 8 conversions within 2 minutes from matching IP addresses.',
    riskLevel: 'Critical',
    userId: 'USR-4432',
    userName: 'Babajide Cole',
    timestamp: '2h ago',
    status: 'Pending'
  },
  {
    id: 'FRD-502',
    type: 'Duplicate Referrals',
    description: '3 user signups detected using same hardware UUID (MAC/IMEI) with code SWIFT-ALIYU.',
    riskLevel: 'High',
    userId: 'USR-1120',
    userName: 'Aliyu Bello',
    timestamp: '5h ago',
    status: 'Pending'
  },
  {
    id: 'FRD-503',
    type: 'Repeated Device Usage',
    description: 'Same mobile browser fingerprint registered multiple secondary accounts under active promo.',
    riskLevel: 'Medium',
    userId: 'USR-7043',
    userName: 'John Doe',
    timestamp: '1d ago',
    status: 'Reviewed'
  }
];

const LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'Chioma Nwachukwu', email: 'chioma.n@example.com', avatar: 'CN', invites: 120, conversions: 52, earnings: 130000 },
  { rank: 2, name: 'Michael Anazodo', email: 'michael@example.com', avatar: 'MA', invites: 82, conversions: 34, earnings: 84500 },
  { rank: 3, name: 'Aliyu Bello', email: 'aliyu.bello@example.com', avatar: 'AB', invites: 45, conversions: 18, earnings: 45000 },
  { rank: 4, name: 'Olamide Coker', email: 'olamide@example.com', avatar: 'OC', invites: 30, conversions: 12, earnings: 28000 }
];

const ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'ACT-901', event: 'Referral Created', details: 'User Aliyu Bello registered via code SWIFT-ALIYU.', adminName: 'System Core', timestamp: '10m ago' },
  { id: 'ACT-902', event: 'Conversion Completed', details: 'Michael Anazodo referee completed their first wallet funding.', adminName: 'System Core', timestamp: '45m ago' },
  { id: 'ACT-903', event: 'Reward Issued', details: '₦500 credit dispatched to Chioma Nwachukwu.', adminName: 'System Core', timestamp: '1h ago' },
  { id: 'ACT-904', event: 'Campaign Activated', details: 'VIP Referral Program budget modified to ₦3,000,000.', adminName: 'Michael Anazodo', timestamp: '2h ago' },
  { id: 'ACT-905', event: 'Referral Suspended', details: 'Babajide Cole referral code disabled due to critical risk triggers.', adminName: 'System Security', timestamp: '3h ago' }
];

// Charts Data
const GROWTH_DATA = [
  { name: 'Mon', Referrals: 3200, Conversions: 1100, Payouts: 450000 },
  { name: 'Tue', Referrals: 3800, Conversions: 1250, Payouts: 580000 },
  { name: 'Wed', Referrals: 3500, Conversions: 1180, Payouts: 510000 },
  { name: 'Thu', Referrals: 4100, Conversions: 1420, Payouts: 740000 },
  { name: 'Fri', Referrals: 4800, Conversions: 1680, Payouts: 820000 },
  { name: 'Sat', Referrals: 5400, Conversions: 1980, Payouts: 980000 },
  { name: 'Sun', Referrals: 4120, Conversions: 1510, Payouts: 610000 }
];

export default function AdminReferralManagement() {
  // ─── STATE MANAGEMENT ──────────────────────────────────────────────────────
  const [referrals, setReferrals] = useState<Referral[]>(INITIAL_REFERRALS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [payouts, setPayouts] = useState<Payout[]>(INITIAL_PAYOUTS);
  const [fraudRecords, setFraudRecords] = useState<FraudRecord[]>(FRAUD_RECORDS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(ACTIVITY_LOGS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Active Referral configurations rules state
  const [rewardConfig, setRewardConfig] = useState<RewardConfig>({
    type: 'Fixed Amount',
    value: 500,
    currency: 'NGN',
    maxReward: 10000,
    activationThreshold: 2000,
    expiryDays: 30
  });

  // Selected Referral State for Details Drawer
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Search & Filters toolbar parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [campaignFilter, setCampaignFilter] = useState('All');
  const [rewardTypeFilter, setRewardTypeFilter] = useState('All');
  const [tierFilter, setTierFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Active applied filter states
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedStatus, setAppliedStatus] = useState('All');
  const [appliedCampaign, setAppliedCampaign] = useState('All');
  const [appliedRewardType, setAppliedRewardType] = useState('All');
  const [appliedTier, setAppliedTier] = useState('All');
  const [appliedStart, setAppliedStart] = useState('');
  const [appliedEnd, setAppliedEnd] = useState('');

  // Sorting & pagination
  const [selectedReferralIds, setSelectedReferralIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'name' | 'invites' | 'conversions' | 'earnings' | 'joinedDate'>('joinedDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // New Campaign Form State
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignBudget, setNewCampaignBudget] = useState('');
  const [newCampaignDesc, setNewCampaignDesc] = useState('');

  // Helper: Trigger custom notification toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handlers for Referral Actions
  const handlePauseReferral = (id: string) => {
    setReferrals(prev =>
      prev.map(ref => {
        if (ref.id === id) {
          const nextStatus = ref.status === 'Suspended' ? 'Active' : 'Suspended';
          return { ...ref, status: nextStatus };
        }
        return ref;
      })
    );
    const matched = referrals.find(r => r.id === id);
    const action = matched?.status === 'Suspended' ? 'activated' : 'suspended';
    triggerToast(`Referral account for ${matched?.name} has been ${action}.`);
    
    // Add log
    const newLog: ActivityLog = {
      id: `ACT-${Math.floor(100 + Math.random() * 900)}`,
      event: 'Referral Suspended',
      details: `Referral code for ${matched?.name} status updated to ${action.toUpperCase()}`,
      adminName: 'Michael Anazodo',
      timestamp: 'Just now'
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const handleAdjustReward = (id: string, amount: number) => {
    setReferrals(prev =>
      prev.map(ref => {
        if (ref.id === id) {
          return { ...ref, earnings: ref.earnings + amount };
        }
        return ref;
      })
    );
    triggerToast(`Adjusted reward earnings for referral ledger.`);
  };

  // Handlers for Payout Queue Actions
  const handleApprovePayout = (id: string) => {
    setPayouts(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'Approved' as const } : p))
    );
    triggerToast(`Payout ${id} approved successfully.`);
  };

  const handleRejectPayout = (id: string) => {
    setPayouts(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'Rejected' as const } : p))
    );
    triggerToast(`Payout request ${id} rejected.`);
  };

  const handlePayPayout = (id: string) => {
    setLoading(true);
    setTimeout(() => {
      setPayouts(prev => prev.filter(p => p.id !== id));
      setLoading(false);
      triggerToast(`Dispatched reward payment to customer wallet.`);

      const newLog: ActivityLog = {
        id: `ACT-${Math.floor(100 + Math.random() * 900)}`,
        event: 'Reward Issued',
        details: `Payout item ${id} successfully credited to wallet.`,
        adminName: 'Michael Anazodo',
        timestamp: 'Just now'
      };
      setActivityLogs(prev => [newLog, ...prev]);
    }, 800);
  };

  // Handlers for Fraud record actions
  const handleUpdateFraudStatus = (id: string, nextStatus: FraudRecord['status']) => {
    setFraudRecords(prev =>
      prev.map(record => {
        if (record.id === id) {
          return { ...record, status: nextStatus };
        }
        return record;
      })
    );
    triggerToast(`Fraud record status updated to: ${nextStatus}`);
  };

  // Campaign create handler
  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignName || !newCampaignBudget) {
      triggerToast('Please complete campaign specifications.');
      return;
    }
    const newCamp: Campaign = {
      id: `CMP-0${campaigns.length + 1}`,
      name: newCampaignName,
      status: 'Active',
      participants: 0,
      budget: parseFloat(newCampaignBudget),
      spent: 0,
      conversionRate: 0,
      description: newCampaignDesc
    };
    setCampaigns(prev => [...prev, newCamp]);
    setIsCampaignModalOpen(false);
    setNewCampaignName('');
    setNewCampaignBudget('');
    setNewCampaignDesc('');
    triggerToast(`New referral campaign "${newCampaignName}" deployed successfully.`);

    const newLog: ActivityLog = {
      id: `ACT-${Math.floor(100 + Math.random() * 900)}`,
      event: 'Campaign Activated',
      details: `Referral campaign: "${newCampaignName}" budget set to ₦${parseFloat(newCampaignBudget).toLocaleString()}`,
      adminName: 'Michael Anazodo',
      timestamp: 'Just now'
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Reconcile and refresh database stats
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setReferrals(INITIAL_REFERRALS);
      setCampaigns(INITIAL_CAMPAIGNS);
      setPayouts(INITIAL_PAYOUTS);
      setFraudRecords(FRAUD_RECORDS);
      setActivityLogs(ACTIVITY_LOGS);
      setLoading(false);
      triggerToast('Referral databases reconciled.');
    }, 700);
  };

  // Filters logic
  const handleApplyFilters = () => {
    setAppliedSearch(searchQuery);
    setAppliedStatus(statusFilter);
    setAppliedCampaign(campaignFilter);
    setAppliedRewardType(rewardTypeFilter);
    setAppliedTier(tierFilter);
    setAppliedStart(startDate);
    setAppliedEnd(endDate);
    setCurrentPage(1);
    triggerToast('Referral filter queries applied.');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setCampaignFilter('All');
    setRewardTypeFilter('All');
    setTierFilter('All');
    setStartDate('');
    setEndDate('');

    setAppliedSearch('');
    setAppliedStatus('All');
    setAppliedCampaign('All');
    setAppliedRewardType('All');
    setAppliedTier('All');
    setAppliedStart('');
    setAppliedEnd('');
    setCurrentPage(1);
    triggerToast('Referral filters reset.');
  };

  // Filter & Sort dynamic references
  const filteredReferrals = useMemo(() => {
    return referrals.filter(ref => {
      const searchMatch = appliedSearch === '' ||
        ref.name.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        ref.email.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        ref.code.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        ref.id.toLowerCase().includes(appliedSearch.toLowerCase());

      const statusMatch = appliedStatus === 'All' || ref.status === appliedStatus;
      const campaignMatch = appliedCampaign === 'All' || ref.campaign === appliedCampaign;
      const tierMatch = appliedTier === 'All' || ref.tier === appliedTier;

      let dateMatch = true;
      if (appliedStart) {
        dateMatch = dateMatch && new Date(ref.joinedDate) >= new Date(appliedStart);
      }
      if (appliedEnd) {
        dateMatch = dateMatch && new Date(ref.joinedDate) <= new Date(appliedEnd);
      }

      return searchMatch && statusMatch && campaignMatch && tierMatch && dateMatch;
    });
  }, [referrals, appliedSearch, appliedStatus, appliedCampaign, appliedTier, appliedStart, appliedEnd]);

  const sortedReferrals = useMemo(() => {
    const sorted = [...filteredReferrals];
    sorted.sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else if (sortField === 'invites') {
        return sortDirection === 'asc' ? a.invites - b.invites : b.invites - a.invites;
      } else if (sortField === 'conversions') {
        return sortDirection === 'asc' ? a.conversions - b.conversions : b.conversions - a.conversions;
      } else if (sortField === 'earnings') {
        return sortDirection === 'asc' ? a.earnings - b.earnings : b.earnings - a.earnings;
      } else {
        return sortDirection === 'asc'
          ? new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime()
          : new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
      }
    });
    return sorted;
  }, [filteredReferrals, sortField, sortDirection]);

  const paginatedReferrals = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return sortedReferrals.slice(startIdx, startIdx + itemsPerPage);
  }, [sortedReferrals, currentPage]);

  const totalPages = Math.ceil(sortedReferrals.length / itemsPerPage);

  // Bulk Actions
  const handleSelectRow = (id: string) => {
    setSelectedReferralIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedReferralIds(paginatedReferrals.map(r => r.id));
    } else {
      setSelectedReferralIds([]);
    }
  };

  const handleBulkSuspend = () => {
    setReferrals(prev =>
      prev.map(r => (selectedReferralIds.includes(r.id) ? { ...r, status: 'Suspended' as const } : r))
    );
    setSelectedReferralIds([]);
    triggerToast('Suspended selected referral accounts.');
  };

  const handleBulkActivate = () => {
    setReferrals(prev =>
      prev.map(r => (selectedReferralIds.includes(r.id) ? { ...r, status: 'Active' as const } : r))
    );
    setSelectedReferralIds([]);
    triggerToast('Activated selected referral accounts.');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-dark text-text-gray relative">
      {/* Toast notifications */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-bg-card border-l-4 border-primary text-text-white shadow-2xl px-5 py-3.5 rounded-r-xl flex items-center gap-3 animate-slide-in">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Loading backdrop */}
      {loading && (
        <div className="fixed inset-0 z-[100] bg-bg-dark/40 backdrop-blur-xs flex items-center justify-center">
          <div className="bg-bg-card border border-border p-5 rounded-2xl flex flex-col items-center gap-3 shadow-2xl">
            <svg className="animate-spin w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
            </svg>
            <span className="text-xs font-semibold text-text-white font-heading">Reconciling ledger data...</span>
          </div>
        </div>
      )}

      {/* Main Page Layout */}
      <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-text-white font-heading tracking-tight">
              Referral Management
            </h1>
            <p className="text-xs text-text-muted mt-1">
              Monitor referral performance, manage rewards, review payouts, and grow platform acquisition.
            </p>
          </div>
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={() => setIsCampaignModalOpen(true)}
              className="flex items-center gap-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover px-4 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(59,130,246,0.3)] transition-all duration-200"
            >
              <PlusIcon className="w-4 h-4" />
              Create Campaign
            </button>
            <button
              onClick={() => triggerToast('Generating comprehensive growth and campaigns dataset report...')}
              className="flex items-center gap-2 text-xs font-semibold text-text-white bg-bg-card border border-border hover:border-border-hover hover:bg-bg-card-hover px-4 py-2.5 rounded-xl transition-all duration-200"
            >
              <ArrowDownTrayIcon className="w-4 h-4 text-text-muted" />
              Export Report
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 text-xs font-semibold text-text-white bg-bg-card border border-border hover:border-border-hover hover:bg-bg-card-hover px-4 py-2.5 rounded-xl transition-all duration-200"
            >
              <ArrowPathIcon className="w-4 h-4 text-text-muted" />
              Refresh
            </button>
          </div>
        </div>

        {/* KPI Overview Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {/* KPI 1: Total Referrals */}
          <div className="bg-bg-card border border-border rounded-2xl p-4.5 space-y-2 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Total Referrals</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-text-white font-heading">24,850</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <ArrowUpRightIcon className="w-2.5 h-2.5" />
                +18%
              </span>
            </div>
            <div className="h-5">
              <svg className="w-full h-full text-primary opacity-60" viewBox="0 0 100 30" fill="none">
                <path d="M0,22 Q15,10 30,18 T60,8 T90,2 L100,5" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </div>
          </div>

          {/* KPI 2: New Referrals (30 Days) */}
          <div className="bg-bg-card border border-border rounded-2xl p-4.5 space-y-2 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">New Referrals (30d)</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-text-white font-heading">4,120</span>
              <span className="text-[10px] font-semibold text-emerald-400">Stable</span>
            </div>
            <div className="h-5">
              <svg className="w-full h-full text-cyan-400 opacity-60" viewBox="0 0 100 30" fill="none">
                <path d="M0,25 Q20,10 40,20 T70,5 T100,12" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </div>
          </div>

          {/* KPI 3: Active Referrers */}
          <div className="bg-bg-card border border-border rounded-2xl p-4.5 space-y-2 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Active Referrers</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-text-white font-heading">2,840</span>
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Active</span>
            </div>
            <div className="h-5">
              <svg className="w-full h-full text-emerald-400 opacity-60" viewBox="0 0 100 30" fill="none">
                <path d="M0,15 L20,10 L40,22 L60,5 L80,18 L100,10" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* KPI 4: Referral Revenue */}
          <div className="bg-bg-card border border-border rounded-2xl p-4.5 space-y-2 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Referral Revenue</span>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-extrabold text-text-white font-heading">₦12,800,000</span>
              <span className="text-[10px] font-semibold text-emerald-400">+15%</span>
            </div>
            <div className="h-5">
              <svg className="w-full h-full text-primary opacity-60" viewBox="0 0 100 30" fill="none">
                <path d="M0,28 L30,20 L60,10 L90,2 L100,5" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </div>
          </div>

          {/* KPI 5: Rewards Paid */}
          <div className="bg-bg-card border border-border rounded-2xl p-4.5 space-y-2 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Rewards Paid</span>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-extrabold text-text-white font-heading">₦2,450,000</span>
              <span className="text-[10px] font-semibold text-cyan-400">+10%</span>
            </div>
            <div className="h-5">
              <svg className="w-full h-full text-cyan-400 opacity-60" viewBox="0 0 100 30" fill="none">
                <path d="M0,18 L25,12 L50,22 L75,10 L100,15" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </div>
          </div>

          {/* KPI 6: Conversion Rate */}
          <div className="bg-bg-card border border-border rounded-2xl p-4.5 space-y-2 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Conversion Rate</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-text-white font-heading">32%</span>
              <span className="text-[10px] font-semibold text-emerald-400">+2.5%</span>
            </div>
            <div className="h-5">
              <svg className="w-full h-full text-emerald-400 opacity-60" viewBox="0 0 100 30" fill="none">
                <path d="M0,25 Q25,5 50,15 T100,5" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </div>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex flex-col lg:flex-row items-center gap-3">
            {/* Search */}
            <div className="relative w-full lg:flex-1">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search by User Name, Referral Code, Email, Campaign..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-11 pr-4 py-3 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden focus:border-primary transition-colors placeholder:text-text-muted"
              />
            </div>
            <div className="flex items-center gap-2.5 w-full lg:w-auto">
              <button
                onClick={handleApplyFilters}
                className="flex-1 lg:flex-none px-4.5 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Apply Filters
              </button>
              <button
                onClick={handleResetFilters}
                className="flex-1 lg:flex-none px-4.5 py-3 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-xs font-bold rounded-xl transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => triggerToast('Referral list details exported as CSV file.')}
                className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-3 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Export CSV
              </button>
              <button
                onClick={() => triggerToast('Referral report sheets compiled and exported as PDF document.')}
                className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-3 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Export PDF
              </button>
            </div>
          </div>

          {/* Filters Area */}
          <div className="pt-3 border-t border-border/50">
            <div className="flex items-center gap-2 text-text-white font-heading font-bold text-[10px] uppercase tracking-wider mb-3">
              <FunnelIcon className="w-3.5 h-3.5 text-primary" />
              Filter parameters
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
              {/* Status */}
              <div>
                <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Referral Status</label>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Rewarded">Rewarded</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              {/* Campaign */}
              <div>
                <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Campaign</label>
                <select
                  value={campaignFilter}
                  onChange={e => setCampaignFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Campaigns</option>
                  {campaigns.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Reward Type */}
              <div>
                <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Reward Type</label>
                <select
                  value={rewardTypeFilter}
                  onChange={e => setRewardTypeFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Reward Types</option>
                  <option value="Fixed">Fixed Amount</option>
                  <option value="Percentage">Percentage</option>
                </select>
              </div>

              {/* Referral Tier */}
              <div>
                <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Referral Tier</label>
                <select
                  value={tierFilter}
                  onChange={e => setTierFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Tiers</option>
                  <option value="Bronze">Bronze Tier</option>
                  <option value="Silver">Silver Tier</option>
                  <option value="Gold">Gold Tier</option>
                  <option value="Platinum">Platinum Tier</option>
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Date Range</label>
                <div className="flex items-center gap-1">
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 bg-bg-dark-secondary text-text-white border border-border rounded-lg focus:outline-hidden"
                  />
                  <span className="text-[10px] text-text-muted font-bold">-</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 bg-bg-dark-secondary text-text-white border border-border rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedReferralIds.length > 0 && (
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-[fadeIn_.2s_ease]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-extrabold text-white">
                {selectedReferralIds.length}
              </span>
              <span className="text-xs font-bold text-text-white">Selected users for bulk updates</span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleBulkActivate}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition"
              >
                Mark Active
              </button>
              <button
                onClick={handleBulkSuspend}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold transition"
              >
                Suspend Accounts
              </button>
              <button
                onClick={() => setSelectedReferralIds([])}
                className="text-[11px] font-semibold text-text-muted hover:text-text-white px-2 py-1 transition"
              >
                Cancel Selection
              </button>
            </div>
          </div>
        )}

        {/* Referral Table */}
        <div className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto relative">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="sticky top-0 bg-bg-dark-secondary z-10 border-b border-border">
                <tr className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  <th className="py-4 px-4 w-10">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={paginatedReferrals.length > 0 && paginatedReferrals.every(r => selectedReferralIds.includes(r.id))}
                      className="rounded border-border focus:ring-primary text-primary"
                    />
                  </th>
                  <th className="py-4 px-4 cursor-pointer select-none" onClick={() => {
                    setSortField('name');
                    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                  }}>
                    <div className="flex items-center gap-1">
                      Referrer
                      {sortField === 'name' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                    </div>
                  </th>
                  <th className="py-4 px-4">Referral Code</th>
                  <th className="py-4 px-4 text-center cursor-pointer select-none" onClick={() => {
                    setSortField('invites');
                    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                  }}>
                    <div className="flex items-center justify-center gap-1">
                      Invites
                      {sortField === 'invites' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                    </div>
                  </th>
                  <th className="py-4 px-4 text-center cursor-pointer select-none" onClick={() => {
                    setSortField('conversions');
                    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                  }}>
                    <div className="flex items-center justify-center gap-1">
                      Conversions
                      {sortField === 'conversions' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                    </div>
                  </th>
                  <th className="py-4 px-4 text-right cursor-pointer select-none" onClick={() => {
                    setSortField('earnings');
                    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                  }}>
                    <div className="flex items-center justify-end gap-1">
                      Earnings
                      {sortField === 'earnings' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                    </div>
                  </th>
                  <th className="py-4 px-4">Reward Status</th>
                  <th className="py-4 px-4 cursor-pointer select-none" onClick={() => {
                    setSortField('joinedDate');
                    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                  }}>
                    <div className="flex items-center gap-1">
                      Joined
                      {sortField === 'joinedDate' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                    </div>
                  </th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-xs">
                {paginatedReferrals.length > 0 ? (
                  paginatedReferrals.map(ref => {
                    const isSelected = selectedReferralIds.includes(ref.id);
                    return (
                      <tr
                        key={ref.id}
                        className={`hover:bg-bg-card-hover/40 transition-colors ${
                          isSelected ? 'bg-primary/5 hover:bg-primary/10' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(ref.id)}
                            className="rounded border-border focus:ring-primary text-primary"
                          />
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                              {ref.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <span className="font-semibold text-text-white block">{ref.name}</span>
                              <span className="text-[10px] text-text-muted block">{ref.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-text-white">{ref.code}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-text-white">{ref.invites}</td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="font-bold text-emerald-400">{ref.conversions}</span>
                            <span className="text-[9px] text-text-muted">
                              ({Math.round((ref.conversions / (ref.invites || 1)) * 100)}%)
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-text-white">
                          ₦{ref.earnings.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 w-fit ${
                            ref.status === 'Rewarded' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            ref.status === 'Active' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            ref.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${
                              ref.status === 'Rewarded' ? 'bg-emerald-400' :
                              ref.status === 'Active' ? 'bg-blue-400' :
                              ref.status === 'Pending' ? 'bg-amber-400' :
                              'bg-red-400'
                            }`} />
                            {ref.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-text-muted whitespace-nowrap">{ref.joinedDate}</td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => { setSelectedReferral(ref); setIsDrawerOpen(true); }}
                              className="p-1 px-2.5 rounded-lg border border-border hover:border-border-hover text-text-muted hover:text-text-white hover:bg-bg-dark transition text-[11px] font-semibold"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleAdjustReward(ref.id, 500)}
                              className="p-1 px-2.5 rounded-lg border border-border hover:bg-bg-dark text-emerald-400 hover:text-emerald-300 transition text-[11px] font-semibold flex items-center gap-0.5"
                              title="Add ₦500 Adjustment Bonus"
                            >
                              +₦500
                            </button>
                            <button
                              onClick={() => handlePauseReferral(ref.id)}
                              className={`p-1 px-2 rounded-lg border text-[11px] font-semibold transition ${
                                ref.status === 'Suspended'
                                  ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                                  : 'border-red-500/20 text-red-400 hover:bg-red-500/10'
                              }`}
                            >
                              {ref.status === 'Suspended' ? 'Activate' : 'Suspend'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-text-muted">
                      <ExclamationTriangleIcon className="w-8 h-8 mx-auto text-text-muted mb-2 opacity-50" />
                      <span className="text-xs font-semibold block">No referral activity available.</span>
                      <button
                        onClick={() => setIsCampaignModalOpen(true)}
                        className="mt-3.5 px-4.5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-xs transition"
                      >
                        Create Campaign
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3.5 bg-bg-dark-secondary/50 border-t border-border flex items-center justify-between text-xs text-text-muted">
              <span>
                Showing <span className="font-bold text-text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-bold text-text-white">
                  {Math.min(currentPage * itemsPerPage, sortedReferrals.length)}
                </span>{' '}
                of <span className="font-bold text-text-white">{sortedReferrals.length}</span> entries
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="px-2.5 py-1 rounded bg-bg-card border border-border text-text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-bg-card-hover"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-2.5 py-1 rounded ${
                      currentPage === i + 1
                        ? 'bg-primary text-white font-bold'
                        : 'bg-bg-card border border-border text-text-white hover:bg-bg-card-hover'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="px-2.5 py-1 rounded bg-bg-card border border-border text-text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-bg-card-hover"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Campaign Management Grid */}
        <div className="space-y-4">
          <div>
            <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Active Referral Campaigns</h3>
            <p className="text-[10px] text-text-muted mt-0.5">Configure reward incentives and allocate budgets per campaign</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {campaigns.map(camp => (
              <div key={camp.id} className="bg-bg-card border border-border rounded-2xl p-4.5 space-y-4 flex flex-col justify-between hover:border-primary/20 transition group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] text-text-muted uppercase tracking-wider">{camp.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      camp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
                      camp.status === 'Scheduled' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-zinc-500/10 text-zinc-400'
                    }`}>
                      {camp.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-text-white block group-hover:text-primary transition-colors text-xs">{camp.name}</h4>
                  <p className="text-[10px] text-text-muted leading-relaxed line-clamp-2">{camp.description}</p>
                </div>

                <div className="space-y-2.5 pt-3.5 border-t border-border/50">
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-text-muted block">Participants</span>
                      <span className="font-bold text-text-white">{camp.participants.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-text-muted block">Conversion</span>
                      <span className="font-bold text-emerald-400">{camp.conversionRate}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[9px] text-text-muted mb-1">
                      <span>Spent: ₦{camp.spent.toLocaleString()}</span>
                      <span>Budget: ₦{camp.budget.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-1 bg-bg-dark rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${Math.min((camp.spent / camp.budget) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => triggerToast(`Edit configuration options for ${camp.name}`)}
                      className="flex-1 py-1.5 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-[9px] font-bold text-text-white rounded-lg transition"
                    >
                      Config
                    </button>
                    <button
                      onClick={() => {
                        setCampaigns(prev =>
                          prev.map(c => (c.id === camp.id ? { ...c, status: c.status === 'Active' ? 'Paused' as const : 'Active' as const } : c))
                        );
                        triggerToast(`Status changed for ${camp.name}.`);
                      }}
                      className={`flex-1 py-1.5 border text-[9px] font-bold rounded-lg transition ${
                        camp.status === 'Active'
                          ? 'border-red-500/20 text-red-400 hover:bg-red-500/10'
                          : 'border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/10'
                      }`}
                    >
                      {camp.status === 'Active' ? 'Pause' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Analytics & Configuration split row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recharts growth statistics */}
          <div className="lg:col-span-2 bg-bg-card border border-border rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Referral Analytics & Performance</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Acquisition conversion rates compared with rewards payout this week</p>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={GROWTH_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRefs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#100f1c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    labelStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '11px' }}
                    itemStyle={{ fontSize: '11px' }}
                  />
                  <Area type="monotone" dataKey="Referrals" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRefs)" strokeWidth={2} name="Invites" />
                  <Area type="monotone" dataKey="Conversions" stroke="#10b981" fillOpacity={1} fill="url(#colorConv)" strokeWidth={2} name="Conversions" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Reward configuration form */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Reward Configuration</h3>
                <p className="text-[10px] text-text-muted mt-0.5">Control reward value bounds and activation criteria</p>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Reward Type */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-text-muted uppercase">Reward Type</label>
                  <select
                    value={rewardConfig.type}
                    onChange={e => setRewardConfig(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full text-xs px-2.5 py-2 bg-bg-dark border border-border rounded-lg text-text-white focus:outline-hidden"
                  >
                    <option value="Fixed Amount">Fixed Amount (₦)</option>
                    <option value="Percentage">Percentage (%)</option>
                  </select>
                </div>

                {/* Reward Value */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-text-muted uppercase">Reward Value</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold">
                      {rewardConfig.type === 'Fixed Amount' ? '₦' : '%'}
                    </span>
                    <input
                      type="number"
                      value={rewardConfig.value}
                      onChange={e => setRewardConfig(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                      className="w-full text-xs pl-8 pr-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Activation Threshold */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-text-muted uppercase">Activation Threshold (Min Wallet Fund)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold">₦</span>
                    <input
                      type="number"
                      value={rewardConfig.activationThreshold}
                      onChange={e => setRewardConfig(prev => ({ ...prev, activationThreshold: parseFloat(e.target.value) || 0 }))}
                      className="w-full text-xs pl-8 pr-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Max Reward Limit */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-text-muted uppercase">Maximum Reward Cap</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold">₦</span>
                    <input
                      type="number"
                      value={rewardConfig.maxReward}
                      onChange={e => setRewardConfig(prev => ({ ...prev, maxReward: parseFloat(e.target.value) || 0 }))}
                      className="w-full text-xs pl-8 pr-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 pt-4.5 border-t border-border/50">
              <button
                onClick={() => triggerToast(`Preview rule triggers: ₦${rewardConfig.value} payout after ₦${rewardConfig.activationThreshold} wallet fund.`)}
                className="flex-1 py-2 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-[11px] font-bold text-text-white rounded-xl transition"
              >
                Preview Rewards
              </button>
              <button
                onClick={() => triggerToast('Referral payout rules successfully committed.')}
                className="flex-1 py-2 bg-primary hover:bg-primary-hover text-white text-[11px] font-bold rounded-xl shadow-xs transition"
              >
                Save Rules
              </button>
            </div>
          </div>
        </div>

        {/* Payout Queue & Fraud Abuse monitoring row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payout queue */}
          <div className="lg:col-span-2 bg-bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Pending Payout Queue</h3>
              </div>
              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
                Awaiting Payout Review
              </span>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-text-muted uppercase border-b border-border pb-2">
                    <th className="pb-2">Reward ID</th>
                    <th className="pb-2">User / Email</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Campaign</th>
                    <th className="pb-2">Requested</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {payouts.map(pay => (
                    <tr key={pay.id} className="hover:bg-bg-dark-secondary/40 transition">
                      <td className="py-3 font-mono font-bold text-text-white">{pay.id}</td>
                      <td className="py-3">
                        <span className="font-semibold text-text-white block">{pay.userName}</span>
                        <span className="text-[10px] text-text-muted block">{pay.userEmail}</span>
                      </td>
                      <td className="py-3 font-extrabold text-emerald-400">₦{pay.amount.toLocaleString()}</td>
                      <td className="py-3 text-text-muted">{pay.campaign}</td>
                      <td className="py-3 text-text-muted">{pay.requestedDate}</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {pay.status === 'Pending' ? (
                            <>
                              <button
                                onClick={() => handleApprovePayout(pay.id)}
                                className="px-2.5 py-1 rounded bg-primary hover:bg-primary-hover text-white text-[10px] font-bold transition"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectPayout(pay.id)}
                                className="px-2.5 py-1 rounded border border-border text-text-white hover:bg-bg-dark text-[10px] font-semibold transition"
                              >
                                Reject
                              </button>
                            </>
                          ) : pay.status === 'Approved' ? (
                            <button
                              onClick={() => handlePayPayout(pay.id)}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold transition flex items-center gap-1"
                            >
                              <CheckCircleIcon className="w-3.5 h-3.5" />
                              Pay Now
                            </button>
                          ) : (
                            <span className="text-[10px] text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                              Rejected
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fraud Monitoring */}
          <div className="bg-bg-card border border-red-500/20 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="flex items-center gap-1.5">
                  <ShieldExclamationIcon className="w-5 h-5 text-red-400" />
                  <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Fraud Monitoring</h3>
                </div>
                <span className="text-[9px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                  Real-time Audits
                </span>
              </div>

              <div className="space-y-3.5 text-xs">
                {fraudRecords.map(fraud => (
                  <div key={fraud.id} className="bg-bg-dark-secondary/50 border border-border rounded-xl p-3.5 space-y-2.5 hover:border-red-500/30 transition">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-text-white block truncate text-[11px] max-w-[150px]">{fraud.type}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${
                        fraud.riskLevel === 'Critical' ? 'bg-red-500/25 text-red-400 border border-red-500/30' :
                        fraud.riskLevel === 'High' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                        'bg-blue-500/10 text-blue-400'
                      }`}>
                        {fraud.riskLevel} Risk
                      </span>
                    </div>
                    <p className="text-[10px] text-text-muted leading-relaxed">{fraud.description}</p>
                    <div className="flex items-center justify-between text-[9px] text-text-muted pt-2 border-t border-border/50">
                      <span>User: {fraud.userName} • {fraud.timestamp}</span>
                      <div className="flex gap-1">
                        {fraud.status === 'Pending' ? (
                          <>
                            <button
                              onClick={() => handleUpdateFraudStatus(fraud.id, 'Flagged')}
                              className="text-red-400 hover:underline font-bold"
                            >
                              Flag
                            </button>
                            <span className="text-border">|</span>
                            <button
                              onClick={() => {
                                handleUpdateFraudStatus(fraud.id, 'Restricted');
                                setReferrals(prev =>
                                  prev.map(r => (r.name === fraud.userName ? { ...r, status: 'Suspended' as const } : r))
                                );
                              }}
                              className="text-red-500 hover:underline font-bold"
                            >
                              Restrict
                            </button>
                          </>
                        ) : (
                          <span className="text-emerald-400 font-bold">✓ {fraud.status}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboards & Activity Feed row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rankings Leaderboard */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 border-b border-border/50 pb-3 mb-2">
                <TrophyIcon className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Top Referrers Ranking</h3>
              </div>

              <div className="space-y-3.5 text-xs pt-1.5">
                {LEADERBOARD.map(user => (
                  <div key={user.rank} className="flex items-center justify-between bg-bg-dark-secondary/35 border border-border rounded-xl p-2.5 hover:border-primary/20 transition">
                    <div className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center ${
                        user.rank === 1 ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30' :
                        user.rank === 2 ? 'bg-zinc-400/20 text-zinc-300' :
                        'bg-zinc-700/20 text-text-muted'
                      }`}>
                        {user.rank}
                      </span>
                      <div>
                        <span className="font-bold text-text-white block">{user.name}</span>
                        <span className="text-[9px] text-text-muted block mt-0.5">{user.invites} Invites • {user.conversions} Conversions</span>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-400 text-xs">₦{user.earnings.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Feed timeline */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="border-b border-border/50 pb-3">
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Referral Activity Feed</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Real-time log of referrer creations and conversions</p>
            </div>

            <div className="space-y-3.5 pl-1 text-xs max-h-64 overflow-y-auto pr-1">
              {activityLogs.map(log => (
                <div key={log.id} className="flex items-start gap-3">
                  <span className={`w-6 h-6 rounded bg-primary/10 border border-primary/15 text-primary flex items-center justify-center font-bold text-[10px] shrink-0 ${
                    log.event === 'Referral Suspended' ? 'text-red-400 bg-red-500/10 border-red-500/15' :
                    log.event === 'Reward Issued' ? 'text-emerald-400 bg-emerald-500/10' : ''
                  }`}>
                    {log.event === 'Referral Suspended' ? '✕' : '✓'}
                  </span>
                  <div className="flex-1">
                    <span className="font-medium text-text-white block">{log.event}</span>
                    <p className="text-[10px] text-text-muted leading-relaxed">{log.details}</p>
                    <span className="text-[9px] text-text-muted block mt-1">By {log.adminName} • {log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Center widget */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Export Center</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Generate campaign data and payouts reports</p>
            </div>

            <div className="space-y-3 text-xs">
              {['Referral Report', 'Campaign Report', 'Payout Report', 'Growth Report'].map(reportName => (
                <div key={reportName} className="bg-bg-dark-secondary/50 border border-border rounded-xl p-3.5 flex items-center justify-between hover:border-primary/20 transition-all duration-200">
                  <div>
                    <span className="font-bold text-text-white block">{reportName}</span>
                    <span className="text-[9px] text-text-muted block">Includes current week referral dataset (.csv)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => triggerToast(`Report dataset successfully queued for: ${reportName}`)}
                      className="px-2.5 py-1 rounded bg-bg-card hover:bg-bg-card-hover border border-border text-[9px] font-bold text-text-white transition"
                    >
                      Generate
                    </button>
                    <button
                      onClick={() => triggerToast(`Downloaded dataset: SWT_REFERRAL_${reportName.toUpperCase().replace(' ', '_')}.csv`)}
                      className="p-1 px-2.5 rounded bg-primary hover:bg-primary-hover text-white text-[9px] font-bold transition"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Slide-out Details Inspector Drawer */}
      {isDrawerOpen && selectedReferral && (
        <div className="fixed inset-0 z-50 overflow-hidden text-xs" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Overlay background */}
            <div
              onClick={() => setIsDrawerOpen(false)}
              className="absolute inset-0 bg-bg-dark/65 backdrop-blur-xs transition-opacity animate-fade-in"
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md transform bg-bg-card border-l border-border text-text-gray shadow-2xl transition-all duration-300 animate-slide-left">
                <div className="flex h-full flex-col overflow-y-auto">
                  {/* Header */}
                  <div className="bg-bg-dark-secondary/60 border-b border-border px-6 py-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-extrabold text-text-white font-heading tracking-tight">
                        Referral Profile Inspector
                      </h2>
                      <p className="text-[10px] text-text-muted mt-0.5 font-mono">ID: {selectedReferral.id}</p>
                    </div>
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="rounded-xl border border-border p-1.5 hover:bg-bg-dark hover:text-text-white transition"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    {/* User Info Card */}
                    <div className="bg-bg-dark-secondary/40 border border-border rounded-2xl p-4.5 space-y-4">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block border-b border-border/50 pb-2">Referrer Profile</span>
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-primary/10 text-primary font-heading font-extrabold flex items-center justify-center text-sm border border-primary/20">
                          {selectedReferral.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <span className="text-sm font-extrabold text-text-white block">{selectedReferral.name}</span>
                          <span className="text-[10px] text-text-muted block mt-0.5">{selectedReferral.email}</span>
                          <span className="text-[10px] text-text-muted block">{selectedReferral.phone}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3.5 pt-3 text-[10px] border-t border-border/50">
                        <div>
                          <span className="text-text-muted block font-bold">Referral Code</span>
                          <span className="font-mono text-text-white font-semibold text-xs">{selectedReferral.code}</span>
                        </div>
                        <div>
                          <span className="text-text-muted block font-bold">Tier Level</span>
                          <span className="font-semibold text-cyan-400 text-xs">{selectedReferral.tier}</span>
                        </div>
                      </div>
                    </div>

                    {/* Referrals performance */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Performance Details</span>
                      <div className="bg-bg-dark-secondary/40 border border-border rounded-xl p-4 space-y-3.5">
                        <div className="flex justify-between">
                          <span className="text-text-muted">Total Invites</span>
                          <span className="font-extrabold text-text-white">{selectedReferral.invites} users</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Conversions Completed</span>
                          <span className="font-extrabold text-emerald-400">{selectedReferral.conversions} conversions</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Acquisition Ratio</span>
                          <span className="font-extrabold text-text-white">
                            {Math.round((selectedReferral.conversions / (selectedReferral.invites || 1)) * 100)}% Conversion Rate
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Enrolled Campaign</span>
                          <span className="font-semibold text-cyan-400">{selectedReferral.campaign}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rewards Summary */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Earnings Summary</span>
                      <div className="bg-bg-dark-secondary/40 border border-border rounded-xl p-4 space-y-3.5">
                        <div className="flex justify-between">
                          <span className="text-text-muted">Paid Rewards</span>
                          <span className="font-bold text-emerald-400">₦{(selectedReferral.earnings * 0.8).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Pending Balance</span>
                          <span className="font-bold text-amber-400">₦{(selectedReferral.earnings * 0.2).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t border-border/50 pt-2.5">
                          <span className="text-text-white font-bold">Total Earnings</span>
                          <span className="font-extrabold text-text-white">₦{selectedReferral.earnings.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Timeline logs */}
                    <div className="space-y-3.5">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Activity History</span>
                      <div className="space-y-4 relative pl-5.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                        <div className="relative">
                          <span className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-primary" />
                          <div>
                            <span className="font-bold text-text-white block">Referral Shared</span>
                            <span className="text-[10px] text-text-muted block mt-0.5">Code SWIFT-MICHAEL dispatched on messaging channels.</span>
                          </div>
                        </div>
                        <div className="relative">
                          <span className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-emerald-400" />
                          <div>
                            <span className="font-bold text-text-white block">New Conversion Completed</span>
                            <span className="text-[10px] text-text-muted block mt-0.5">Referee completed their first bill payment.</span>
                          </div>
                        </div>
                        <div className="relative">
                          <span className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-cyan-400" />
                          <div>
                            <span className="font-bold text-text-white block">Rewards Successfully Settled</span>
                            <span className="text-[10px] text-text-muted block mt-0.5">₦2,500 credited to user wallet balance.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="bg-bg-dark-secondary/60 border-t border-border px-6 py-5 flex items-center justify-between gap-3 shadow-2xl">
                    <button
                      onClick={() => handlePauseReferral(selectedReferral.id)}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold text-center transition cursor-pointer ${
                        selectedReferral.status === 'Suspended'
                          ? 'border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/10'
                          : 'border-red-500/25 text-red-400 hover:bg-red-500/10'
                      }`}
                    >
                      {selectedReferral.status === 'Suspended' ? 'Activate Referral' : 'Pause Referral'}
                    </button>
                    <button
                      onClick={() => {
                        triggerToast(`Initiating manual adjustment for ${selectedReferral.name}`);
                        handleAdjustReward(selectedReferral.id, 1000);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition text-center shadow-xs cursor-pointer"
                    >
                      Adjust Earnings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Creation Modal */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-xs">
          <div onClick={() => setIsCampaignModalOpen(false)} className="absolute inset-0 bg-bg-dark/60 backdrop-blur-xs animate-fade-in" />
          <form
            onSubmit={handleCreateCampaign}
            className="relative bg-bg-card border border-border w-full max-w-md rounded-2xl overflow-hidden shadow-2xl p-5 space-y-4 animate-scale-in"
          >
            <div>
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Deploy New Referral Campaign</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Specify reward margins and budget limits</p>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-text-muted uppercase">Campaign Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Referral Promotion"
                  value={newCampaignName}
                  onChange={e => setNewCampaignName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-text-muted uppercase">Allocated Budget (NGN)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 5000000"
                  value={newCampaignBudget}
                  onChange={e => setNewCampaignBudget(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-text-muted uppercase">Description / Objectives</label>
                <textarea
                  rows={3}
                  placeholder="Describe target user behaviors and incentives criteria..."
                  value={newCampaignDesc}
                  onChange={e => setNewCampaignDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setIsCampaignModalOpen(false)}
                className="text-[11px] font-bold text-text-muted hover:text-text-white px-3 py-1.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-white px-4.5 py-2.5 rounded-xl text-xs font-bold transition shadow-xs"
              >
                Deploy Campaign
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
