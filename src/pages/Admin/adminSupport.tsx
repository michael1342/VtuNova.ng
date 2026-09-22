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
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import type { AgentPerformance, EscalatedCase, KnowledgeBaseArticle, SLAStatus, SupportActivityLog as ActivityLog, SupportAgent, SupportCustomer as Customer, SupportSystemAlert as SystemAlert, SupportTicket, TicketMessage } from '../../interface/admin.interface';

// ─── TYPES & INTERFACES ──────────────────────────────────────────────────────
// ─── INITIAL MOCK DATA ───────────────────────────────────────────────────────
const INITIAL_CUSTOMERS: Record<string, Customer> = {
  'USR-8890': { id: 'USR-8890', name: 'Michael Anazodo', email: 'michael@example.com', phone: '+234 803 123 4567', walletBalance: 24500, verificationLevel: 'Level 3 (KYC Verified)', previousTickets: 2, referrals: 15 },
  'USR-4432': { id: 'USR-4432', name: 'Aliyu Bello', email: 'aliyu.bello@example.com', phone: '+234 812 345 6789', walletBalance: 12000, verificationLevel: 'Level 2 (BVN Linked)', previousTickets: 1, referrals: 8 },
  'USR-9021': { id: 'USR-9021', name: 'Chioma Nwachukwu', email: 'chioma.n@example.com', phone: '+234 905 987 6543', walletBalance: 145000, verificationLevel: 'Level 3 (KYC Verified)', previousTickets: 4, referrals: 32 }
};

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'SUP-10045',
    customerId: 'USR-8890',
    customerName: 'Michael Anazodo',
    customerEmail: 'michael@example.com',
    subject: 'Wallet Funding Delay',
    description: 'I made a bank transfer of ₦50,000 to my virtual accounts 20 minutes ago but my wallet balance remains uncredited. Please check.',
    category: 'Wallet',
    priority: 'High',
    assignedTo: 'Support Team A',
    status: 'In Progress',
    updatedDate: '2026-06-20',
    createdDate: '2026-06-20 17:45',
    tags: ['Bank Transfer', 'Delayed Crediting']
  },
  {
    id: 'SUP-10046',
    customerId: 'USR-4432',
    customerName: 'Aliyu Bello',
    customerEmail: 'aliyu.bello@example.com',
    subject: 'MTN Data Bundle Purchase Failure',
    description: 'I attempted to buy the MTN 10GB Data Plan for ₦3,000. The transaction failed on the platform but my wallet was debited. Need refund.',
    category: 'Data',
    priority: 'Medium',
    assignedTo: 'Tech Tier 2',
    status: 'Waiting',
    updatedDate: '2026-06-19',
    createdDate: '2026-06-19 14:20',
    tags: ['MTN Data', 'Refund Pending']
  },
  {
    id: 'SUP-10047',
    customerId: 'USR-9021',
    customerName: 'Chioma Nwachukwu',
    customerEmail: 'chioma.n@example.com',
    subject: 'Electricity Token Generation Issue',
    description: 'Purchased ₦10,000 prepaid token for Ikeja Electric. The transaction completed but the token code was not generated or SMSed.',
    category: 'Electricity',
    priority: 'Critical',
    assignedTo: 'Support Team A',
    status: 'Open',
    updatedDate: '2026-06-20',
    createdDate: '2026-06-20 18:10',
    tags: ['Ikeja Electric', 'Token Error']
  }
];

const TICKET_THREADS: Record<string, TicketMessage[]> = {
  'SUP-10045': [
    { id: 'msg-1', sender: 'Customer', senderName: 'Michael Anazodo', message: 'I made a bank transfer of ₦50,000 to my virtual accounts 20 minutes ago but my wallet balance remains uncredited. Please check.', timestamp: '17:45' },
    { id: 'msg-2', sender: 'System', senderName: 'System Trigger', message: 'Ticket assigned automatically to Support Team A.', timestamp: '17:46' },
    { id: 'msg-3', sender: 'Agent', senderName: 'Support Agent A', message: 'Hello Michael, looking into this now. I am confirming with our payment gateway partner if the webhook was delivered.', timestamp: '17:52' }
  ],
  'SUP-10046': [
    { id: 'msg-4', sender: 'Customer', senderName: 'Aliyu Bello', message: 'I attempted to buy the MTN 10GB Data Plan for ₦3,000. The transaction failed on the platform but my wallet was debited. Need refund.', timestamp: '14:20' }
  ],
  'SUP-10047': [
    { id: 'msg-5', sender: 'Customer', senderName: 'Chioma Nwachukwu', message: 'Purchased ₦10,000 prepaid token for Ikeja Electric. The transaction completed but the token code was not generated or SMSed.', timestamp: '18:10' }
  ]
};

const AGENT_LIST: SupportAgent[] = [
  { id: 'agt-1', name: 'Adekunle Jones', role: 'Support Agent Tier 1', activeTickets: 12 },
  { id: 'agt-2', name: 'Blessing Okafor', role: 'Support Team Lead', activeTickets: 4 },
  { id: 'agt-3', name: 'Farooq Umar', role: 'Technical Escalations Engineer', activeTickets: 6 }
];

const SLA_STATS: SLAStatus[] = [
  { label: 'First Response SLA', value: '98.4%', status: 'Healthy' },
  { label: 'Resolution Target SLA', value: '94.2%', status: 'Healthy' },
  { label: 'Breached Tickets', value: '3 cases', status: 'Warning' },
  { label: 'Current Queue Load', value: 'High', status: 'Warning' }
];

const ESCALATIONS_LIST: EscalatedCase[] = [
  { ticketId: 'SUP-10047', reason: 'Ikeja Electric API response timed out. Token payload empty.', assignedTeam: 'Tech Tier 2', priority: 'Critical', timeOpen: '40 mins' },
  { ticketId: 'SUP-10041', reason: 'Repeated chargeback warnings detected on virtual funding transaction.', assignedTeam: 'Risk & Fraud Team', priority: 'High', timeOpen: '3 hours' }
];

const KNOWLEDGE_BASE: KnowledgeBaseArticle[] = [
  { id: 'KB-01', title: 'Delayed Funding FAQ', category: 'Wallet', summary: 'Canned response outlining average settlement intervals for virtual bank fundings.', content: 'Hello, bank transfers settle within 10-30 minutes. If delayed beyond that, please send us the bank transaction reference sheet so we can manual reconcile.' },
  { id: 'KB-02', title: 'Data Purchase Refunds', category: 'Data', summary: 'Procedure for checking data order delivery logs before manual wallet refund.', content: 'Hello, your transaction has been verified as failed. We have automatically reversed the amount of {{amount}} back to your wallet balance.' },
  { id: 'KB-03', title: 'DisCo Token Delays', category: 'Electricity', summary: 'Troubleshooting guide for missing electricity token strings.', content: 'Hello, the power utility provider is experiencing delays in processing prepaid tokens. We have retrieved your token code: {{token}}.' }
];

const LEADERBOARD: AgentPerformance[] = [
  { rank: 1, name: 'Adekunle Jones', closed: 82, avgResolution: '1.2 hrs', rating: 4.8 },
  { rank: 2, name: 'Farooq Umar', closed: 54, avgResolution: '2.5 hrs', rating: 4.6 },
  { rank: 3, name: 'Blessing Okafor', closed: 42, avgResolution: '1.8 hrs', rating: 4.9 }
];

const SYSTEM_ALERTS: SystemAlert[] = [
  { id: 'ALT-301', title: 'High Ticket Volume', severity: 'High', description: 'Payments queue tickets volume spike (18 open items in 15 mins).', timestamp: '10m ago' },
  { id: 'ALT-302', title: 'SLA Breach Warning', severity: 'Critical', description: 'SUP-10047 response target breached (First response timeline over 15 mins).', timestamp: '20m ago' }
];

const ACTIVITY_TIMELINE: ActivityLog[] = [
  { id: 'ACT-201', event: 'New Ticket: SUP-10047 generated by Chioma Nwachukwu', timestamp: '20m ago' },
  { id: 'ACT-202', event: 'Reply Sent: SUP-10045 (Wallet funding delay)', timestamp: '35m ago' },
  { id: 'ACT-203', event: 'Ticket Resolved: SUP-10039 (Cable subscription issue)', timestamp: '1h ago' }
];

const SUPPORT_ANALYTICS_DATA = [
  { name: 'Mon', Volume: 140, Resolved: 120, Satisfaction: 93 },
  { name: 'Tue', Volume: 155, Resolved: 130, Satisfaction: 94 },
  { name: 'Wed', Volume: 172, Resolved: 145, Satisfaction: 92 },
  { name: 'Thu', Volume: 160, Resolved: 140, Satisfaction: 95 },
  { name: 'Fri', Volume: 185, Resolved: 160, Satisfaction: 94 },
  { name: 'Sat', Volume: 120, Resolved: 110, Satisfaction: 96 },
  { name: 'Sun', Volume: 124, Resolved: 124, Satisfaction: 94 }
];

export default function AdminSupport() {
  // ─── STATE MANAGEMENT ──────────────────────────────────────────────────────
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [timelineThreads, setTimelineThreads] = useState<Record<string, TicketMessage[]>>(TICKET_THREADS);
  const [escalations, setEscalations] = useState<EscalatedCase[]>(ESCALATIONS_LIST);
  const [alerts, setAlerts] = useState<SystemAlert[]>(SYSTEM_ALERTS);
  const [timelineLogs, setTimelineLogs] = useState<ActivityLog[]>(ACTIVITY_TIMELINE);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Selected Ticket Context Workspace
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

  // Workspace Reply state controls
  const [replyText, setReplyText] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [replyTargetStatus, setReplyTargetStatus] = useState<SupportTicket['status']>('In Progress');
  const [assignedStaff, setAssignedStaff] = useState('');

  // Advanced Filters states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [assignedFilter, setAssignedFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Applied filter state
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedStatus, setAppliedStatus] = useState('All');
  const [appliedPriority, setAppliedPriority] = useState('All');
  const [appliedCategory, setAppliedCategory] = useState('All');
  const [appliedAssigned, setAppliedAssigned] = useState('All');
  const [appliedStart, setAppliedStart] = useState('');
  const [appliedEnd, setAppliedEnd] = useState('');

  // Pagination & Multi-Selection
  const [selectedTicketIds, setSelectedTicketIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'id' | 'createdDate' | 'priority'>('createdDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // New ticket modal
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [newTicketUserEmail, setNewTicketUserEmail] = useState('');
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState<SupportTicket['category']>('Payments');
  const [newTicketDesc, setNewTicketDesc] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApplyFilters = () => {
    setAppliedSearch(searchQuery);
    setAppliedStatus(statusFilter);
    setAppliedPriority(priorityFilter);
    setAppliedCategory(categoryFilter);
    setAppliedAssigned(assignedFilter);
    setAppliedStart(startDate);
    setAppliedEnd(endDate);
    setCurrentPage(1);
    triggerToast('Support ticket search query processed.');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setCategoryFilter('All');
    setAssignedFilter('All');
    setStartDate('');
    setEndDate('');

    setAppliedSearch('');
    setAppliedStatus('All');
    setAppliedPriority('All');
    setAppliedCategory('All');
    setAppliedAssigned('All');
    setAppliedStart('');
    setAppliedEnd('');
    setCurrentPage(1);
    triggerToast('Filters reset.');
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setTickets(INITIAL_TICKETS);
      setTimelineThreads(TICKET_THREADS);
      setEscalations(ESCALATIONS_LIST);
      setAlerts(SYSTEM_ALERTS);
      setTimelineLogs(ACTIVITY_TIMELINE);
      setLoading(false);
      triggerToast('Support registry reconciled.');
    }, 700);
  };

  // Row selection handler
  const handleSelectRow = (id: string) => {
    setSelectedTicketIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTicketIds(paginatedTickets.map(t => t.id));
    } else {
      setSelectedTicketIds([]);
    }
  };

  // Bulk parameters handlers
  const handleBulkAssign = (staff: string) => {
    setTickets(prev =>
      prev.map(t => (selectedTicketIds.includes(t.id) ? { ...t, assignedTo: staff } : t))
    );
    setSelectedTicketIds([]);
    triggerToast(`Bulk assigned selected tickets to ${staff}`);
  };

  const handleBulkResolve = () => {
    setTickets(prev =>
      prev.map(t => (selectedTicketIds.includes(t.id) ? { ...t, status: 'Resolved' as const } : t))
    );
    setSelectedTicketIds([]);
    triggerToast('Bulk marked selected support tickets as resolved.');
  };

  const handleBulkEscalate = () => {
    const nextEsc: EscalatedCase[] = selectedTicketIds.map(id => {
      const match = tickets.find(t => t.id === id);
      return {
        ticketId: id,
        reason: match?.description || 'Escalated through bulk operations.',
        assignedTeam: 'Tech Tier 2',
        priority: 'High' as const,
        timeOpen: 'Just now'
      };
    });
    setEscalations(prev => [...nextEsc, ...prev]);
    setSelectedTicketIds([]);
    triggerToast('Bulk escalated selected support tickets to Tech Level 2.');
  };

  // Reply submit handler
  const handleSendReply = () => {
    if (!selectedTicket) return;
    if (!replyText && !internalNote) {
      triggerToast('Please type a reply message or internal memo.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Append reply to threads
      if (replyText) {
        const newMsg: TicketMessage = {
          id: `msg-${Date.now()}`,
          sender: 'Agent',
          senderName: 'Support Agent (You)',
          message: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setTimelineThreads(prev => ({
          ...prev,
          [selectedTicket.id]: [...(prev[selectedTicket.id] || []), newMsg]
        }));
      }

      // Update status
      setTickets(prev =>
        prev.map(t =>
          t.id === selectedTicket.id
            ? { ...t, status: replyTargetStatus, assignedTo: assignedStaff || t.assignedTo, updatedDate: '2026-06-20' }
            : t
        )
      );

      // Add log
      const newLog: ActivityLog = {
        id: `ACT-${Math.floor(100 + Math.random() * 900)}`,
        event: `Reply Sent: ${selectedTicket.id} (${selectedTicket.subject})`,
        timestamp: 'Just now'
      };
      setTimelineLogs(prev => [newLog, ...prev]);

      setReplyText('');
      setInternalNote('');
      setIsWorkspaceOpen(false);
      setLoading(false);
      triggerToast(`Response successfully dispatched. Ticket status updated to: ${replyTargetStatus}`);
    }, 800);
  };

  const handleQuickResolve = (id: string) => {
    setTickets(prev =>
      prev.map(t => (t.id === id ? { ...t, status: 'Resolved' as const, updatedDate: '2026-06-20' } : t))
    );
    triggerToast(`Ticket ${id} marked resolved.`);
  };

  const handleCannedResponseCopy = (content: string) => {
    setReplyText(content);
    triggerToast('Canned reply loaded into active editor.');
  };

  // New ticket submission
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketUserEmail || !newTicketSubject || !newTicketDesc) {
      triggerToast('Please complete all support ticket details.');
      return;
    }
    const nextId = `SUP-${Math.floor(10000 + Math.random() * 9000)}`;
    const newTicket: SupportTicket = {
      id: nextId,
      customerId: 'USR-8890',
      customerName: 'External Client',
      customerEmail: newTicketUserEmail,
      subject: newTicketSubject,
      description: newTicketDesc,
      category: newTicketCategory,
      priority: 'Medium',
      assignedTo: 'Support Team A',
      status: 'Open',
      updatedDate: new Date().toISOString().split('T')[0],
      createdDate: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tags: [newTicketCategory]
    };

    setTickets(prev => [newTicket, ...prev]);
    setTimelineThreads(prev => ({
      ...prev,
      [nextId]: [{ id: `msg-${Date.now()}`, sender: 'Customer', senderName: 'External Client', message: newTicketDesc, timestamp: 'Just now' }]
    }));

    setIsTicketModalOpen(false);
    setNewTicketUserEmail('');
    setNewTicketSubject('');
    setNewTicketDesc('');
    triggerToast(`Created ticket ${nextId} successfully.`);

    const newLog: ActivityLog = {
      id: `ACT-${Math.floor(100 + Math.random() * 900)}`,
      event: `New Ticket Created: ${nextId}`,
      timestamp: 'Just now'
    };
    setTimelineLogs(prev => [newLog, ...prev]);
  };

  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    triggerToast('System support alert dismissed.');
  };

  // Filters logic
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const searchMatch = appliedSearch === '' ||
        t.id.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        t.customerName.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        t.customerEmail.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        t.subject.toLowerCase().includes(appliedSearch.toLowerCase());

      const statusMatch = appliedStatus === 'All' || t.status === appliedStatus;
      const priorityMatch = appliedPriority === 'All' || t.priority === appliedPriority;
      const categoryMatch = appliedCategory === 'All' || t.category === appliedCategory;
      const assignedMatch = appliedAssigned === 'All' || t.assignedTo.includes(appliedAssigned);

      return searchMatch && statusMatch && priorityMatch && categoryMatch && assignedMatch;
    });
  }, [tickets, appliedSearch, appliedStatus, appliedPriority, appliedCategory, appliedAssigned]);

  const sortedTickets = useMemo(() => {
    const sorted = [...filteredTickets];
    sorted.sort((a, b) => {
      if (sortField === 'id') {
        return sortDirection === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
      } else if (sortField === 'priority') {
        const order = { Low: 1, Medium: 2, High: 3, Critical: 4 };
        return sortDirection === 'asc'
          ? order[a.priority] - order[b.priority]
          : order[b.priority] - order[a.priority];
      } else {
        return sortDirection === 'asc'
          ? new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
          : new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      }
    });
    return sorted;
  }, [filteredTickets, sortField, sortDirection]);

  const paginatedTickets = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return sortedTickets.slice(startIdx, startIdx + itemsPerPage);
  }, [sortedTickets, currentPage]);

  const totalPages = Math.ceil(sortedTickets.length / itemsPerPage);

  const selectedCustomerContext = useMemo(() => {
    if (!selectedTicket) return null;
    return INITIAL_CUSTOMERS[selectedTicket.customerId] || null;
  }, [selectedTicket]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-dark text-text-gray relative">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-bg-card border-l-4 border-primary text-text-white shadow-2xl px-5 py-3.5 rounded-r-xl flex items-center gap-3 animate-slide-in">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Loading Backdrop */}
      {loading && (
        <div className="fixed inset-0 z-[100] bg-bg-dark/40 backdrop-blur-xs flex items-center justify-center">
          <div className="bg-bg-card border border-border p-5 rounded-2xl flex flex-col items-center gap-3 shadow-2xl">
            <svg className="animate-spin w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
            </svg>
            <span className="text-xs font-semibold text-text-white font-heading">Processing ticket logs...</span>
          </div>
        </div>
      )}

      {/* Page Content Shell */}
      <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-text-white font-heading tracking-tight">
              Support Center
            </h1>
            <p className="text-xs text-text-muted mt-1">
              Manage support tickets, resolve customer issues, track service concerns, and maintain customer satisfaction.
            </p>
          </div>
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="flex items-center gap-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover px-4 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(59,130,246,0.3)] transition-all duration-200"
            >
              <PlusIcon className="w-4 h-4" />
              Create Ticket
            </button>
            <button
              onClick={() => triggerToast('Generating comprehensive tickets report details...')}
              className="flex items-center gap-2 text-xs font-semibold text-text-white bg-bg-card border border-border hover:border-border-hover hover:bg-bg-card-hover px-4 py-2.5 rounded-xl transition-all duration-200"
            >
              <ArrowDownTrayIcon className="w-4 h-4 text-text-muted" />
              Export Tickets
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

        {/* KPI Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { label: 'Open Tickets', value: '482', change: '+6%', trend: 'bg-red-500/10 text-red-400' },
            { label: 'Resolved Today', value: '124', change: 'Stable', trend: 'text-emerald-400' },
            { label: 'Avg Response Time', value: '14 min', change: '-2 min', trend: 'text-emerald-400' },
            { label: 'Avg Resolution Time', value: '2.4 hrs', change: '-0.3 hrs', trend: 'text-emerald-400' },
            { label: 'Customer Satisfaction', value: '94%', change: '+1.5%', trend: 'text-emerald-400 font-bold' },
            { label: 'Escalated Cases', value: '18', change: 'Active', trend: 'bg-amber-500/10 text-amber-400' }
          ].map(kpi => (
            <div key={kpi.label} className="bg-bg-card border border-border rounded-2xl p-4.5 space-y-2 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">{kpi.label}</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-extrabold text-text-white font-heading">{kpi.value}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${kpi.trend}`}>{kpi.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Support Controls Toolbar */}
        <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex flex-col lg:flex-row items-center gap-3">
            {/* Global Search */}
            <div className="relative w-full lg:flex-1">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search by Ticket ID, User submits, Email targets, Assigned Staff, Subjects..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-11 pr-4 py-3 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden focus:border-primary transition-colors placeholder:text-text-muted"
              />
            </div>
            {/* Actions */}
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
                onClick={() => triggerToast('Exported support ticket logs as CSV.')}
                className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-3 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Export CSV
              </button>
              <button
                onClick={() => triggerToast('Printed tickets list report as PDF.')}
                className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-3 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Export PDF
              </button>
            </div>
          </div>

          {/* Filters row details */}
          <div className="pt-3 border-t border-border/50">
            <div className="flex items-center gap-2 text-text-white font-heading font-bold text-[10px] uppercase tracking-wider mb-3">
              <FunnelIcon className="w-3.5 h-3.5 text-primary" />
              Advanced Filters
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
              {/* Status */}
              <div>
                <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Statuses</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Waiting">Waiting</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Priority</label>
                <select
                  value={priorityFilter}
                  onChange={e => setPriorityFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Priorities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Category</label>
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Categories</option>
                  <option value="Payments">Payments</option>
                  <option value="Wallet">Wallet</option>
                  <option value="Airtime">Airtime</option>
                  <option value="Data">Data</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Cable TV">Cable TV</option>
                  <option value="Technical">Technical</option>
                  <option value="Account">Account</option>
                </select>
              </div>

              {/* Assigned Staff */}
              <div>
                <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Assigned Team</label>
                <select
                  value={assignedFilter}
                  onChange={e => setAssignedFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Assignments</option>
                  <option value="Support Team">Support Team A</option>
                  <option value="Tech Tier">Tech Tier 2</option>
                  <option value="Risk">Risk Team</option>
                </select>
              </div>

              {/* Date */}
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

        {/* Bulk actions panel */}
        {selectedTicketIds.length > 0 && (
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-[fadeIn_.2s_ease]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-extrabold text-white">
                {selectedTicketIds.length}
              </span>
              <span className="text-xs font-bold text-text-white">Selected ticket issues for bulk support re-routing</span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => handleBulkAssign('Support Team A')}
                className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-[11px] font-semibold transition"
              >
                Assign Team A
              </button>
              <button
                onClick={handleBulkResolve}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition"
              >
                Mark Resolved
              </button>
              <button
                onClick={handleBulkEscalate}
                className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold transition"
              >
                Escalate Level 2
              </button>
              <button
                onClick={() => setSelectedTicketIds([])}
                className="text-[11px] font-semibold text-text-muted hover:text-text-white px-2 py-1 transition"
              >
                Cancel Selection
              </button>
            </div>
          </div>
        )}

        {/* Tickets Ledger Table */}
        <div className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto relative">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="sticky top-0 bg-bg-dark-secondary z-10 border-b border-border">
                <tr className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  <th className="py-4 px-4 w-10">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={paginatedTickets.length > 0 && paginatedTickets.every(t => selectedTicketIds.includes(t.id))}
                      className="rounded border-border focus:ring-primary text-primary"
                    />
                  </th>
                  <th className="py-4 px-4 cursor-pointer select-none" onClick={() => {
                    setSortField('id');
                    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                  }}>
                    <div className="flex items-center gap-1">
                      Ticket ID
                      {sortField === 'id' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                    </div>
                  </th>
                  <th className="py-4 px-4">User</th>
                  <th className="py-4 px-4">Subject</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4 cursor-pointer select-none" onClick={() => {
                    setSortField('priority');
                    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                  }}>
                    <div className="flex items-center gap-1">
                      Priority
                      {sortField === 'priority' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                    </div>
                  </th>
                  <th className="py-4 px-4">Assigned To</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 cursor-pointer select-none" onClick={() => {
                    setSortField('createdDate');
                    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                  }}>
                    <div className="flex items-center gap-1">
                      Updated Date
                      {sortField === 'createdDate' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                    </div>
                  </th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-xs">
                {paginatedTickets.length > 0 ? (
                  paginatedTickets.map(t => {
                    const isSelected = selectedTicketIds.includes(t.id);
                    return (
                      <tr
                        key={t.id}
                        className={`hover:bg-bg-card-hover/40 transition-colors ${
                          isSelected ? 'bg-primary/5 hover:bg-primary/10' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(t.id)}
                            className="rounded border-border focus:ring-primary text-primary"
                          />
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-text-white">{t.id}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-text-white block">{t.customerName}</span>
                          <span className="text-[9px] text-text-muted block">{t.customerEmail}</span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-text-white max-w-[150px] truncate" title={t.subject}>
                          {t.subject}
                        </td>
                        <td className="py-3.5 px-4 text-text-muted">{t.category}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.priority === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                            t.priority === 'High' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-text-muted">{t.assignedTo}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 w-fit ${
                            t.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            t.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            t.status === 'Waiting' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${
                              t.status === 'Resolved' ? 'bg-emerald-400' :
                              t.status === 'In Progress' ? 'bg-blue-400' :
                              t.status === 'Waiting' ? 'bg-amber-400' :
                              'bg-red-400'
                            }`} />
                            {t.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-text-muted whitespace-nowrap">{t.updatedDate}</td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => { setSelectedTicket(t); setReplyTargetStatus(t.status); setAssignedStaff(t.assignedTo); setIsWorkspaceOpen(true); }}
                              className="p-1 px-2.5 rounded-lg border border-border hover:border-border-hover text-text-muted hover:text-text-white hover:bg-bg-dark transition text-[11px] font-semibold"
                            >
                              Open
                            </button>
                            <button
                              onClick={() => handleQuickResolve(t.id)}
                              className="p-1.5 rounded-lg border border-border text-emerald-400 hover:bg-emerald-500/10 transition"
                              title="Quick Resolve"
                              disabled={t.status === 'Resolved'}
                            >
                              ✓
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
                      <span className="text-xs font-semibold block">No support activity available.</span>
                      <button
                        onClick={() => setIsTicketModalOpen(true)}
                        className="mt-3.5 px-4.5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-xs transition"
                      >
                        Create Ticket
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
                  {Math.min(currentPage * itemsPerPage, sortedTickets.length)}
                </span>{' '}
                of <span className="font-bold text-text-white">{sortedTickets.length}</span> entries
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

        {/* SLA & Escalations Queue grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          {/* SLA monitors */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="border-b border-border/50 pb-3">
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">SLA Performance Target</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Real-time status targets for response and resolution</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              {SLA_STATS.map(stat => (
                <div key={stat.label} className="bg-bg-dark-secondary/35 border border-border rounded-xl p-3 text-center space-y-1 hover:border-primary/10 transition">
                  <span className="text-[9px] font-bold text-text-muted uppercase block truncate">{stat.label}</span>
                  <span className={`text-[11px] font-extrabold block ${
                    stat.status === 'Healthy' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Escalations queue */}
          <div className="lg:col-span-2 bg-bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Escalation Queue</h3>
              </div>
              <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                Tech Level 2 Awaiting
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-text-muted uppercase border-b border-border pb-2 bg-bg-dark-secondary/10">
                    <th className="pb-2">Ticket</th>
                    <th className="pb-2">Reason Description</th>
                    <th className="pb-2">Assigned Team</th>
                    <th className="pb-2">Priority</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {escalations.map(esc => (
                    <tr key={esc.ticketId} className="hover:bg-bg-dark-secondary/40 transition">
                      <td className="py-2.5 font-mono font-bold text-text-white">{esc.ticketId}</td>
                      <td className="py-2.5 text-text-muted max-w-[200px] truncate" title={esc.reason}>{esc.reason}</td>
                      <td className="py-2.5 text-text-white font-medium">{esc.assignedTeam}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${
                          esc.priority === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {esc.priority}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => {
                            const match = tickets.find(t => t.id === esc.ticketId);
                            if (match) {
                              setSelectedTicket(match);
                              setIsWorkspaceOpen(true);
                            }
                          }}
                          className="px-2.5 py-1 rounded bg-bg-dark border border-border text-[9px] font-bold text-text-white hover:bg-bg-card-hover transition"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Analytics & Knowledge Base */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recharts Analytics */}
          <div className="lg:col-span-2 bg-bg-card border border-border rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Support Metrics Analytics</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Track resolved tickets and customer satisfaction scores this week</p>
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SUPPORT_ANALYTICS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
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
                  <Area type="monotone" dataKey="Volume" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVol)" strokeWidth={2} name="Tickets Raised" />
                  <Area type="monotone" dataKey="Resolved" stroke="#10b981" fillOpacity={1} fill="url(#colorRes)" strokeWidth={2} name="Resolved" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Reusable canned response knowledge base */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between text-xs">
            <div>
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Canned Response Knowledge Base</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Reusable messaging templates for immediate customer dispatch</p>
            </div>
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {KNOWLEDGE_BASE.map(kb => (
                <div key={kb.id} className="bg-bg-dark-secondary/50 border border-border rounded-xl p-3 space-y-1.5 hover:border-primary/20 transition">
                  <div className="flex justify-between items-center text-[10px] font-bold text-text-white">
                    <span>{kb.title}</span>
                    <span className="text-[9px] text-cyan-400 uppercase">{kb.category}</span>
                  </div>
                  <p className="text-[10px] text-text-muted leading-relaxed line-clamp-2">{kb.summary}</p>
                  <button
                    onClick={() => handleCannedResponseCopy(kb.content)}
                    className="text-[9px] text-primary hover:underline font-bold"
                  >
                    Copy Response to Editor
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Agent Performance & Feed Logs bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          {/* Agent performance */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-1.5 border-b border-border/50 pb-3 mb-1">
              <TrophyIcon className="w-5 h-5 text-amber-400" />
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Agent Performance</h3>
            </div>
            <div className="space-y-3 pt-1">
              {LEADERBOARD.map(agent => (
                <div key={agent.rank} className="flex justify-between items-center bg-bg-dark-secondary/35 border border-border rounded-xl p-2.5 hover:border-primary/20 transition">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-zinc-700/20 text-text-muted font-bold text-[10px] flex items-center justify-center border border-border/50">
                      {agent.rank}
                    </span>
                    <div>
                      <span className="font-bold text-text-white block">{agent.name}</span>
                      <span className="text-[9px] text-text-muted block mt-0.5">{agent.closed} Closed Tickets • rating: {agent.rating}★</span>
                    </div>
                  </div>
                  <span className="font-semibold text-cyan-400 font-mono text-[10px]">{agent.avgResolution} res</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline feeds */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="border-b border-border/50 pb-3">
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Live Support Activity Feed</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Timeline log of active ticket conversions and replies</p>
            </div>
            <div className="space-y-3.5 pl-1.5">
              {timelineLogs.map(log => (
                <div key={log.id} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded bg-primary/10 border border-primary/15 text-primary flex items-center justify-center font-bold text-[9px] shrink-0">
                    ✓
                  </span>
                  <div>
                    <span className="font-semibold text-text-white block">{log.event}</span>
                    <span className="text-[9px] text-text-muted block mt-0.5">{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts Center */}
          <div className="bg-bg-card border border-red-500/20 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 border-b border-border/50 pb-3 mb-2">
                <ShieldExclamationIcon className="w-5 h-5 text-red-400" />
                <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Support Alerts Center</h3>
              </div>
              <div className="space-y-3.5 pr-1 max-h-40 overflow-y-auto">
                {alerts.map(item => (
                  <div key={item.id} className="bg-bg-dark-secondary/35 border border-border rounded-xl p-3 space-y-1 relative group hover:border-red-500/30 transition">
                    <div className="flex justify-between items-center text-[10px] font-bold text-text-white">
                      <span>{item.title}</span>
                      <span className="text-[8px] font-extrabold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/15">{item.severity}</span>
                    </div>
                    <p className="text-[10px] text-text-muted pr-4 leading-relaxed">{item.description}</p>
                    <button
                      onClick={() => handleDismissAlert(item.id)}
                      className="absolute right-2 top-2 text-[9px] text-text-muted hover:text-text-white opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Ticket Details split pane Workspace Drawer */}
      {isWorkspaceOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 overflow-hidden text-xs" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Overlay background */}
            <div
              onClick={() => setIsWorkspaceOpen(false)}
              className="absolute inset-0 bg-bg-dark/65 backdrop-blur-xs transition-opacity"
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-4xl transform bg-bg-card border-l border-border text-text-gray shadow-2xl transition-all duration-300 animate-slide-left">
                <div className="flex h-full flex-col overflow-y-auto">
                  {/* Header */}
                  <div className="bg-bg-dark-secondary/60 border-b border-border px-6 py-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-extrabold text-text-white font-heading tracking-tight">
                        Support Ticket Workspace
                      </h2>
                      <p className="text-[10px] text-text-muted mt-0.5 font-mono">Ticket ID: {selectedTicket.id}</p>
                    </div>
                    <button
                      onClick={() => setIsWorkspaceOpen(false)}
                      className="rounded-xl border border-border p-1.5 hover:bg-bg-dark hover:text-text-white transition"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Body Content split grid */}
                  <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
                    
                    {/* Left Panel: Ticket Detail & Customer Context */}
                    <div className="space-y-4 overflow-y-auto pr-1">
                      <div className="bg-bg-dark-secondary/40 border border-border rounded-2xl p-4.5 space-y-4">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block border-b border-border/50 pb-2">Ticket Specifications</span>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Subject</span>
                          <span className="font-bold text-text-white">{selectedTicket.subject}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Category</span>
                          <span className="font-bold text-text-white">{selectedTicket.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Priority</span>
                          <span className="font-bold text-red-400">{selectedTicket.priority}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Created</span>
                          <span className="font-semibold text-text-white">{selectedTicket.createdDate}</span>
                        </div>
                      </div>

                      {/* Customer context */}
                      {selectedCustomerContext && (
                        <div className="bg-bg-dark-secondary/40 border border-border rounded-2xl p-4.5 space-y-3.5">
                          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block border-b border-border/50 pb-2">Customer Profile Context</span>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
                              {selectedCustomerContext.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <span className="font-bold text-text-white block">{selectedCustomerContext.name}</span>
                              <span className="text-[10px] text-text-muted block mt-0.5">{selectedCustomerContext.email}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3.5 pt-3 text-[10px] border-t border-border/50">
                            <div>
                              <span className="text-text-muted block font-bold">Wallet Balance</span>
                              <span className="font-bold text-emerald-400 text-xs">₦{selectedCustomerContext.walletBalance.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-text-muted block font-bold">Verification</span>
                              <span className="font-semibold text-cyan-400 text-[9px]">{selectedCustomerContext.verificationLevel}</span>
                            </div>
                            <div>
                              <span className="text-text-muted block font-bold">Ref Link Referrals</span>
                              <span className="font-semibold text-text-white">{selectedCustomerContext.referrals} referred</span>
                            </div>
                            <div>
                              <span className="text-text-muted block font-bold">Previous Tickets</span>
                              <span className="font-semibold text-text-white">{selectedCustomerContext.previousTickets} tickets</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Issue Description */}
                      <div className="bg-bg-dark-secondary/40 border border-border rounded-xl p-4.5 space-y-2">
                        <span className="text-[10px] font-bold text-text-white uppercase tracking-wider block">Customer Complaint Message</span>
                        <p className="text-[11px] text-text-muted leading-relaxed font-sans">
                          {selectedTicket.description}
                        </p>
                      </div>
                    </div>

                    {/* Right Panel: Resolution Conversation timeline & editor */}
                    <div className="space-y-4 flex flex-col justify-between overflow-y-auto pl-0 lg:pl-4 border-t lg:border-t-0 lg:border-l border-border/50 pt-4 lg:pt-0">
                      
                      {/* Timeline chat messages */}
                      <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] mb-4 pr-1">
                        <span className="text-[10px] font-bold text-text-white uppercase tracking-wider block mb-1">Conversation Thread</span>
                        <div className="space-y-3 pt-1">
                          {(timelineThreads[selectedTicket.id] || []).map((msg, index) => {
                            const isCustomer = msg.sender === 'Customer';
                            return (
                              <div key={index} className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}>
                                <div className={`max-w-[85%] rounded-xl p-3 text-[11px] leading-relaxed ${
                                  isCustomer
                                    ? 'bg-bg-dark-secondary border border-border text-text-white rounded-tl-none'
                                    : 'bg-primary/10 border border-primary/20 text-text-white rounded-tr-none'
                                }`}>
                                  <span className="block font-bold text-[9px] text-primary mb-1 uppercase">{msg.senderName}</span>
                                  {msg.message}
                                </div>
                                <span className="text-[8px] text-text-muted mt-1 font-mono">{msg.timestamp}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Reply Editor forms */}
                      <div className="space-y-3.5 pt-4 border-t border-border/50">
                        {/* Reply content */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-text-muted uppercase">Compose Dispatch Reply</label>
                          <textarea
                            rows={3}
                            placeholder="Type response contents or load canned KB article..."
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg placeholder:text-text-muted focus:outline-hidden resize-none"
                          />
                        </div>

                        {/* Status update & assign staff */}
                        <div className="grid grid-cols-2 gap-3.5 text-[10px]">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-text-muted uppercase">Set Ticket Status</label>
                            <select
                              value={replyTargetStatus}
                              onChange={e => setReplyTargetStatus(e.target.value as any)}
                              className="w-full text-xs px-2 py-1.5 bg-bg-dark border border-border rounded-lg text-text-white focus:outline-hidden"
                            >
                              <option value="In Progress">In Progress</option>
                              <option value="Waiting">Waiting Customer</option>
                              <option value="Resolved">Resolved</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-text-muted uppercase">Assign Agent</label>
                            <select
                              value={assignedStaff}
                              onChange={e => setAssignedStaff(e.target.value)}
                              className="w-full text-xs px-2 py-1.5 bg-bg-dark border border-border rounded-lg text-text-white focus:outline-hidden"
                            >
                              <option value="">Select Support Agent</option>
                              {AGENT_LIST.map(agt => (
                                <option key={agt.id} value={agt.name}>{agt.name} ({agt.activeTickets})</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Drawer Footer Actions */}
                  <div className="bg-bg-dark-secondary/60 border-t border-border px-6 py-5 flex items-center justify-between gap-3 shadow-2xl">
                    <button
                      onClick={() => {
                        setTickets(prev =>
                          prev.map(t => (t.id === selectedTicket.id ? { ...t, status: 'Resolved' as const, updatedDate: '2026-06-20' } : t))
                        );
                        setIsWorkspaceOpen(false);
                        triggerToast(`Ticket resolved.`);
                      }}
                      className="py-2 px-3 rounded-xl border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 text-xs font-bold transition cursor-pointer"
                    >
                      Resolve Ticket
                    </button>
                    <button
                      onClick={() => {
                        const isAlreadyEsc = escalations.some(esc => esc.ticketId === selectedTicket.id);
                        if (!isAlreadyEsc) {
                          const newEsc: EscalatedCase = {
                            ticketId: selectedTicket.id,
                            reason: selectedTicket.description,
                            assignedTeam: 'Tech Tier 2',
                            priority: 'High',
                            timeOpen: 'Just now'
                          };
                          setEscalations(prev => [newEsc, ...prev]);
                        }
                        setIsWorkspaceOpen(false);
                        triggerToast(`Ticket escalated.`);
                      }}
                      className="py-2 px-3 rounded-xl border border-amber-500/20 text-amber-400 hover:bg-amber-500/10 text-xs font-bold transition cursor-pointer"
                    >
                      Escalate
                    </button>
                    <button
                      onClick={handleSendReply}
                      className="py-2.5 px-5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <PaperAirplaneIcon className="w-3.5 h-3.5" />
                      Send Response
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Composition Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-xs">
          <div onClick={() => setIsTicketModalOpen(false)} className="absolute inset-0 bg-bg-dark/65 backdrop-blur-xs animate-fade-in" />
          <form
            onSubmit={handleCreateTicket}
            className="relative bg-bg-card border border-border w-full max-w-md rounded-2xl overflow-hidden shadow-2xl p-5 space-y-4 animate-scale-in"
          >
            <div>
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Create Manual Customer Ticket</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Submit ticket details on behalf of the customer</p>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-text-muted uppercase">Customer Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. customer@example.com"
                  value={newTicketUserEmail}
                  onChange={e => setNewTicketUserEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-text-muted uppercase">Subject / Concern</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cable TV subscription expired"
                  value={newTicketSubject}
                  onChange={e => setNewTicketSubject(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-text-muted uppercase">Category</label>
                <select
                  value={newTicketCategory}
                  onChange={e => setNewTicketCategory(e.target.value as any)}
                  className="w-full text-xs px-2.5 py-2 bg-bg-dark border border-border rounded-lg text-text-white focus:outline-hidden"
                >
                  <option value="Payments">Payments</option>
                  <option value="Wallet">Wallet Funding</option>
                  <option value="Airtime">Airtime Recharge</option>
                  <option value="Data">Data Bundles</option>
                  <option value="Electricity">Electricity Tokens</option>
                  <option value="Cable TV">Cable TV</option>
                  <option value="Technical">Technical</option>
                  <option value="Account">Account</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-text-muted uppercase">Complaint Details</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe details of the issue..."
                  value={newTicketDesc}
                  onChange={e => setNewTicketDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setIsTicketModalOpen(false)}
                className="text-[11px] font-bold text-text-muted hover:text-text-white px-3 py-1.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-white px-4.5 py-2.5 rounded-xl text-xs font-bold transition shadow-xs"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
