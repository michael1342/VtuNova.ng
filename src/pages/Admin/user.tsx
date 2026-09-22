import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/themeContext';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import type { AlertItem, UserAccount, UserActivityEvent as ActivityEvent } from '../../interface/admin.interface';

// ─── TYPES & INTERFACES ──────────────────────────────────────────────────────
// ─── INITIAL MOCK DATA ───────────────────────────────────────────────────────
const INITIAL_USERS: UserAccount[] = [
  { id: 'USR-89021', firstName: 'Chidi', lastName: 'Benson', email: 'chidi.b@example.com', phone: '+234 803 445 7821', walletBalance: 150000, transactionsCount: 482, verificationStatus: 'Verified', status: 'Active', role: 'User', joinedDate: '2025-06-12', emailVerified: true, phoneVerified: true, identityVerified: true },
  { id: 'USR-89022', firstName: 'Amara', lastName: 'Okafor', email: 'amara.o@example.com', phone: '+234 810 984 5673', walletBalance: 245000, transactionsCount: 395, verificationStatus: 'Verified', status: 'Active', role: 'Agent', joinedDate: '2025-09-18', emailVerified: true, phoneVerified: true, identityVerified: true },
  { id: 'USR-89023', firstName: 'Tunde', lastName: 'Bakare', email: 'tunde.b@example.com', phone: '+234 802 984 5673', walletBalance: 4500, transactionsCount: 312, verificationStatus: 'Pending', status: 'Active', role: 'User', joinedDate: '2025-11-04', emailVerified: true, phoneVerified: true, identityVerified: false, identityDocUrl: 'ID_Document_Tunde.pdf' },
  { id: 'USR-89024', firstName: 'Fatima', lastName: 'Musa', email: 'fatima.m@example.com', phone: '+234 903 234 5678', walletBalance: 87000, transactionsCount: 288, verificationStatus: 'Verified', status: 'Active', role: 'User', joinedDate: '2025-12-15', emailVerified: true, phoneVerified: true, identityVerified: true },
  { id: 'USR-89025', firstName: 'Obinna', lastName: 'Ani', email: 'obinna.a@example.com', phone: '+234 705 270 5119', walletBalance: 12000, transactionsCount: 95, verificationStatus: 'Unverified', status: 'Suspended', role: 'User', joinedDate: '2026-02-10', emailVerified: true, phoneVerified: false, identityVerified: false },
  { id: 'USR-89026', firstName: 'Aisha', lastName: 'Yusuf', email: 'aisha.y@example.com', phone: '+234 803 112 3456', walletBalance: 320000, transactionsCount: 512, verificationStatus: 'Verified', status: 'Active', role: 'Agent', joinedDate: '2026-03-01', emailVerified: true, phoneVerified: true, identityVerified: true },
  { id: 'USR-89027', firstName: 'David', lastName: 'Mark', email: 'david.m@example.com', phone: '+234 812 345 6789', walletBalance: 0, transactionsCount: 12, verificationStatus: 'Pending', status: 'Active', role: 'User', joinedDate: '2026-05-20', emailVerified: true, phoneVerified: false, identityVerified: false, identityDocUrl: 'NIN_Slip_David.jpg' },
  { id: 'USR-89028', firstName: 'Grace', lastName: 'Emmanuel', email: 'grace.e@example.com', phone: '+234 905 678 1234', walletBalance: 95000, transactionsCount: 145, verificationStatus: 'Verified', status: 'Active', role: 'User', joinedDate: '2026-06-01', emailVerified: true, phoneVerified: true, identityVerified: true },
];

const INITIAL_TIMELINE_EVENTS: ActivityEvent[] = [
  { id: 'e1', userId: 'USR-89021', type: 'registration', text: 'User registered via landing referral link.', time: '2026-06-20 09:12', icon: '👤', color: 'bg-blue-500/10 text-blue-500' },
  { id: 'e2', userId: 'USR-89021', type: 'funding', text: 'Funded wallet with ₦50,000 using Paystack Checkout.', time: '2026-06-20 10:45', icon: '💳', color: 'bg-emerald-500/10 text-emerald-500' },
  { id: 'e3', userId: 'USR-89022', type: 'purchase', text: 'Purchased AEDC Electricity Token (₦15,000).', time: '2026-06-20 11:20', icon: '⚡', color: 'bg-amber-500/10 text-amber-500' },
  { id: 'e4', userId: 'USR-89023', type: 'profile_update', text: 'Uploaded National Identity Card for Level 2 verification.', time: '2026-06-20 12:05', icon: '📎', color: 'bg-purple-500/10 text-purple-500' },
  { id: 'e5', userId: 'USR-89025', type: 'admin_action', text: 'Admin suspended user account due to potential chargeback activity.', time: '2026-06-20 12:30', icon: '🛡️', color: 'bg-red-500/10 text-red-500' },
];

const INITIAL_ALERTS: AlertItem[] = [
  { id: 'al-1', title: 'Suspicious Activity Detected', desc: 'Multiple rapid wallet funding attempts from USR-89025.', severity: 'high', time: '12m ago' },
  { id: 'al-2', title: 'Large Wallet Deposit', desc: 'USR-89026 funded wallet with ₦300,000 in a single transaction.', severity: 'info', time: '40m ago' },
  { id: 'al-3', title: 'Repeated Verification Failures', desc: 'USR-89027 failed phone OTP code verification three times.', severity: 'warning', time: '1h ago' },
];

const ANALYTICS_GROWTH_DATA = [
  { name: 'Jan', Users: 7200, Active: 5800 },
  { name: 'Feb', Users: 8100, Active: 6400 },
  { name: 'Mar', Users: 9500, Active: 7200 },
  { name: 'Apr', Users: 10800, Active: 8100 },
  { name: 'May', Users: 11900, Active: 9000 },
  { name: 'Jun', Users: 12840, Active: 9845 },
];

const ANALYTICS_DISTRIBUTION_DATA = [
  { name: '₦0 - ₦5k', count: 4800 },
  { name: '₦5k - ₦20k', count: 3200 },
  { name: '₦20k - ₦100k', count: 2900 },
  { name: '₦100k+', count: 1940 },
];

const ANALYTICS_VERIFICATION_DATA = [
  { name: 'Verified', value: 10952, color: '#10b981' },
  { name: 'Pending', value: 1240, color: '#f59e0b' },
  { name: 'Unverified', value: 648, color: '#ef4444' },
];

export default function AdminUserManagement() {
  const { currentUser, logout } = useAuth() as { currentUser: any; logout: () => void };
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // ─── STATE MANAGEMENT ──────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'Users' | 'Dashboard' | 'Transactions' | 'Wallet' | 'Airtime' | 'Data' | 'Electricity' | 'Cable TV' | 'Notifications' | 'Referrals' | 'Analytics' | 'Settings' | 'Support' | 'Roles'>('Users');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  // Users Lists & Simulation States
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [timelineEvents, setTimelineEvents] = useState<ActivityEvent[]>(INITIAL_TIMELINE_EVENTS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);

  // KPI Counters (Dynamic values that change on operations)
  const [totalUsers, setTotalUsers] = useState(12840);
  const [activeUsers, setActiveUsers] = useState(9845);
  const [newUsers, setNewUsers] = useState(1240);
  const [suspendedUsers, setSuspendedUsers] = useState(104);
  const [verifiedUsers, setVerifiedUsers] = useState(10952);
  const [avgWalletVal] = useState(84500);

  // Search & Filters toolbar
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Suspended'>('All');
  const [verifyFilter, setVerifyFilter] = useState<'All' | 'Verified' | 'Pending' | 'Unverified'>('All');
  const [roleFilter, setRoleFilter] = useState<'All' | 'User' | 'Agent' | 'Admin'>('All');
  const [balanceFilter, setBalanceFilter] = useState<'All' | 'Zero' | 'High'>('All');
  const [isEmptyState, setIsEmptyState] = useState(false);

  // Modals & Drawer States
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [actionsMenuUser, setActionsMenuUser] = useState<string | null>(null);

  // Form details
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'User' as 'User' | 'Agent' | 'Admin',
    walletAmount: '',
    walletAction: 'credit' as 'credit' | 'debit',
    walletReason: '',
    notificationTitle: '',
    notificationBody: '',
  });

  // ─── FILTER & SEARCH LOGIC ─────────────────────────────────────────────────
  const processedUsers = useMemo(() => {
    if (isEmptyState) return [];

    let result = [...users];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.id.toLowerCase().includes(q) ||
          u.firstName.toLowerCase().includes(q) ||
          u.lastName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone.includes(q)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter((u) => u.status === statusFilter);
    }

    if (verifyFilter !== 'All') {
      result = result.filter((u) => u.verificationStatus === verifyFilter);
    }

    if (roleFilter !== 'All') {
      result = result.filter((u) => u.role === roleFilter);
    }

    if (balanceFilter === 'Zero') {
      result = result.filter((u) => u.walletBalance === 0);
    } else if (balanceFilter === 'High') {
      result = result.filter((u) => u.walletBalance >= 100000);
    }

    return result;
  }, [users, searchQuery, statusFilter, verifyFilter, roleFilter, balanceFilter, isEmptyState]);

  // ─── ACTIONS HANDLERS ──────────────────────────────────────────────────────
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email) return;

    const newUserObj: UserAccount = {
      id: `USR-${Math.floor(89000 + Math.random() * 900)}`,
      firstName: formData.firstName,
      lastName: formData.lastName || 'Doe',
      email: formData.email,
      phone: formData.phone || '+234 800 000 0000',
      walletBalance: 0,
      transactionsCount: 0,
      verificationStatus: 'Unverified',
      status: 'Active',
      role: formData.role,
      joinedDate: new Date().toISOString().split('T')[0],
      emailVerified: true,
      phoneVerified: false,
      identityVerified: false,
    };

    setUsers((prev) => [newUserObj, ...prev]);
    setTotalUsers((prev) => prev + 1);
    setNewUsers((prev) => prev + 1);

    // Audit Log
    setTimelineEvents((prev) => [
      {
        id: `evt-${Date.now()}`,
        userId: newUserObj.id,
        type: 'registration',
        text: `Admin registered new user profile: ${newUserObj.firstName} ${newUserObj.lastName}.`,
        time: 'Just now',
        icon: '👤',
        color: 'bg-blue-500/10 text-blue-500',
      },
      ...prev,
    ]);

    setActiveModal(null);
    setFormData((prev) => ({ ...prev, firstName: '', lastName: '', email: '', phone: '', role: 'User' }));
    alert('User registered successfully!');
  };

  const handleWalletAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const amountNum = parseFloat(formData.walletAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === selectedUser.id) {
          const nextBal =
            formData.walletAction === 'credit'
              ? u.walletBalance + amountNum
              : Math.max(0, u.walletBalance - amountNum);
          
          // Update drawer preview state dynamically if open
          if (selectedUser.id === u.id) {
            setSelectedUser({ ...u, walletBalance: nextBal });
          }
          return { ...u, walletBalance: nextBal };
        }
        return u;
      })
    );

    // Add Audit logs
    setTimelineEvents((prev) => [
      {
        id: `evt-${Date.now()}`,
        userId: selectedUser.id,
        type: 'funding',
        text: `Admin adjusted wallet (${formData.walletAction === 'credit' ? 'Credited' : 'Debited'} ₦${amountNum.toLocaleString()}): ${formData.walletReason || 'Routine Admin correction'}.`,
        time: 'Just now',
        icon: '💳',
        color: formData.walletAction === 'credit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500',
      },
      ...prev,
    ]);

    alert(`Successfully applied balance correction to ${selectedUser.firstName}'s wallet.`);
    setActiveModal(null);
    setFormData((prev) => ({ ...prev, walletAmount: '', walletReason: '' }));
  };

  const handleVerifyAction = (type: 'email' | 'phone' | 'identity', approve: boolean) => {
    if (!selectedUser) return;

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === selectedUser.id) {
          const updated = { ...u };
          if (type === 'email') updated.emailVerified = approve;
          if (type === 'phone') updated.phoneVerified = approve;
          if (type === 'identity') {
            updated.identityVerified = approve;
            updated.verificationStatus = approve ? 'Verified' : 'Unverified';
            if (approve) setVerifiedUsers((v) => v + 1);
          }
          setSelectedUser(updated);
          return updated;
        }
        return u;
      })
    );

    setTimelineEvents((prev) => [
      {
        id: `evt-${Date.now()}`,
        userId: selectedUser.id,
        type: 'admin_action',
        text: `Admin ${approve ? 'Approved' : 'Rejected'} verification status for: ${type.toUpperCase()}`,
        time: 'Just now',
        icon: '🛡️',
        color: approve ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500',
      },
      ...prev,
    ]);

    alert(`Verification update applied.`);
  };

  const handleStatusChange = (userId: string, newStatus: 'Active' | 'Suspended') => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          if (selectedUser?.id === userId) {
            setSelectedUser({ ...u, status: newStatus });
          }
          return { ...u, status: newStatus };
        }
        return u;
      })
    );

    if (newStatus === 'Suspended') {
      setSuspendedUsers((prev) => prev + 1);
      setActiveUsers((prev) => Math.max(0, prev - 1));
    } else {
      setSuspendedUsers((prev) => Math.max(0, prev - 1));
      setActiveUsers((prev) => prev + 1);
    }

    setTimelineEvents((prev) => [
      {
        id: `evt-${Date.now()}`,
        userId: userId,
        type: 'admin_action',
        text: `Admin updated account status to: ${newStatus}`,
        time: 'Just now',
        icon: '🛡️',
        color: newStatus === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500',
      },
      ...prev,
    ]);

    alert(`User account marked as ${newStatus}.`);
  };

  const handleDeleteUser = (userId: string) => {
    if (!confirm('Are you sure you want to permanently delete this user account? This action is irreversible.')) return;

    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setTotalUsers((prev) => Math.max(0, prev - 1));
    if (selectedUser?.id === userId) {
      setIsDrawerOpen(false);
      setSelectedUser(null);
    }

    alert('User profile permanently deleted from VtuNova core DB.');
  };

  const handleSendUserNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !formData.notificationTitle) return;

    alert(`Direct notification broadcasted to user device: ${formData.notificationTitle}`);
    setActiveModal(null);
    setFormData((prev) => ({ ...prev, notificationTitle: '', notificationBody: '' }));
  };

  const sparklineData = [
    { value: 100 },
    { value: 120 },
    { value: 110 },
    { value: 130 },
    { value: 125 },
    { value: 140 },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-dark-secondary overflow-y-auto">
      {/* ─── SCROLLABLE PAGE WORKSPACE ─── */}
      <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto w-full">

          {/* Page Header */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20 rounded-2xl p-6">
            <div>
              <h2 className="text-text-white font-heading font-extrabold text-2xl tracking-tight">User Management</h2>
              <p className="text-text-gray text-xs sm:text-sm mt-1 max-w-2xl">
                Manage user accounts, monitor platform activity, and maintain operational control.
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-emerald-500/10 border-emerald-500/20 text-emerald-400 flex items-center gap-1.5 shadow-xs">
                ✓ Secure Administration
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-cyan-500/10 border-cyan-500/20 text-cyan-400 flex items-center gap-1.5 shadow-xs">
                ✓ User Monitoring
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-blue-500/10 border-blue-500/20 text-blue-400 flex items-center gap-1.5 shadow-xs">
                ✓ Verification Controls
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-purple-500/10 border-purple-500/20 text-purple-400 flex items-center gap-1.5 shadow-xs">
                ✓ Live Activity
              </span>
            </div>
          </div>

          {/* Sim Empty State Control Bar */}
          <div className="flex items-center justify-between bg-bg-card border border-border rounded-xl p-4 shadow-xs">
            <span className="text-xs text-text-white font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              User management operational database ready.
            </span>
            <button
              onClick={() => setIsEmptyState(!isEmptyState)}
              className="text-xs bg-bg-dark-secondary border border-border hover:bg-bg-card-hover text-text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              {isEmptyState ? 'Simulate Database Content' : 'Simulate Empty Search Results'}
            </button>
          </div>

          {/* ─── OVERVIEW KPI CARDS SECTION (6 CARDS) ─── */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            
            <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between text-text-muted">
                <span className="text-xs font-medium">Total Users</span>
                <span className="text-[15px]">👥</span>
              </div>
              <div className="my-2.5">
                <p className="text-xl font-heading font-extrabold text-text-white">{isEmptyState ? '0' : totalUsers.toLocaleString()}</p>
                <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">↑ +14.2% overall</span>
              </div>
              <div className="h-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData}>
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={1} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between text-text-muted">
                <span className="text-xs font-medium">Active Users</span>
                <span className="text-[15px]">🟢</span>
              </div>
              <div className="my-2.5">
                <p className="text-xl font-heading font-extrabold text-text-white">{isEmptyState ? '0' : activeUsers.toLocaleString()}</p>
                <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">76.6% active rate</span>
              </div>
              <div className="h-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData}>
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={1} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between text-text-muted">
                <span className="text-xs font-medium">New Users</span>
                <span className="text-[15px]">✨</span>
              </div>
              <div className="my-2.5">
                <p className="text-xl font-heading font-extrabold text-text-white">{isEmptyState ? '0' : newUsers.toLocaleString()}</p>
                <span className="text-[9px] text-cyan-400 font-semibold block mt-0.5">↑ +18% this week</span>
              </div>
              <div className="h-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData}>
                    <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={1} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between text-text-muted">
                <span className="text-xs font-medium">Suspended</span>
                <span className="text-[15px]">🚫</span>
              </div>
              <div className="my-2.5">
                <p className="text-xl font-heading font-extrabold text-red-400">{isEmptyState ? '0' : suspendedUsers.toLocaleString()}</p>
                <span className="text-[9px] text-text-muted block mt-0.5">0.8% of user database</span>
              </div>
              <div className="h-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData}>
                    <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={1} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between text-text-muted">
                <span className="text-xs font-medium">Verified</span>
                <span className="text-[15px]">✓</span>
              </div>
              <div className="my-2.5">
                <p className="text-xl font-heading font-extrabold text-text-white">{isEmptyState ? '0' : verifiedUsers.toLocaleString()}</p>
                <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">85.3% Level 2 KYC</span>
              </div>
              <div className="h-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData}>
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={1} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between text-text-muted">
                <span className="text-xs font-medium">Average Wallet</span>
                <span className="text-[15px]">₦</span>
              </div>
              <div className="my-2.5">
                <p className="text-xl font-heading font-extrabold text-text-white">₦{isEmptyState ? '0' : avgWalletVal.toLocaleString()}</p>
                <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">↑ +4.7% change</span>
              </div>
              <div className="h-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData}>
                    <Line type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={1} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* ─── ADMIN CONTROLS TOOLBAR ─── */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 shadow-xs space-y-4">
            <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
              
              {/* Search */}
              <div className="flex-1 relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs">🔍</span>
                <input
                  type="text"
                  placeholder="Search user name, email, phone number, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden focus:border-blue-500 placeholder-text-muted transition-colors"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 xl:flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e: any) => setStatusFilter(e.target.value)}
                  className="text-xs px-3 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active Only</option>
                  <option value="Suspended">Suspended Only</option>
                </select>

                <select
                  value={verifyFilter}
                  onChange={(e: any) => setVerifyFilter(e.target.value)}
                  className="text-xs px-3 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden"
                >
                  <option value="All">All Verification</option>
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending Audit</option>
                  <option value="Unverified">Unverified</option>
                </select>

                <select
                  value={roleFilter}
                  onChange={(e: any) => setRoleFilter(e.target.value)}
                  className="text-xs px-3 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden"
                >
                  <option value="All">All Roles</option>
                  <option value="User">User</option>
                  <option value="Agent">Agent</option>
                  <option value="Admin">Admin</option>
                </select>

                <select
                  value={balanceFilter}
                  onChange={(e: any) => setBalanceFilter(e.target.value)}
                  className="text-xs px-3 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden"
                >
                  <option value="All">All Balances</option>
                  <option value="Zero">Zero Wallet (₦0)</option>
                  <option value="High">High Balance (₦100k+)</option>
                </select>
              </div>

            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('All');
                    setVerifyFilter('All');
                    setRoleFilter('All');
                    setBalanceFilter('All');
                  }}
                  className="text-xs text-text-muted hover:text-text-white font-semibold transition-colors bg-bg-dark-secondary px-3.5 py-2 rounded-xl border border-border"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => alert('Exporting user roster to VtuNova_Roster_Audit.csv... File downloaded.')}
                  className="text-xs text-text-white hover:bg-bg-dark-secondary font-semibold transition-colors px-3.5 py-2 rounded-xl border border-border flex items-center gap-1.5"
                >
                  <span>📥</span> CSV
                </button>
                <button
                  onClick={() => alert('Generating user roster audit statement PDF... Ready for printing.')}
                  className="text-xs text-text-white hover:bg-bg-dark-secondary font-semibold transition-colors px-3.5 py-2 rounded-xl border border-border flex items-center gap-1.5"
                >
                  <span>📄</span> PDF
                </button>
              </div>

              <button
                onClick={() => setActiveModal('addUser')}
                className="text-xs text-white bg-blue-600 hover:bg-blue-500 font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/10 flex items-center gap-1.5"
              >
                <span>➕</span> Add User Profile
              </button>
            </div>
          </div>

          {/* ─── MAIN USER WORKSPACE LAYOUT ─── */}
          {isEmptyState || processedUsers.length === 0 ? (
            <div className="bg-bg-card border border-border rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-xs">
              <span className="text-4xl mb-4">🔍</span>
              <h3 className="text-text-white font-heading font-bold text-lg">No Users Found</h3>
              <p className="text-text-muted text-xs sm:text-sm mt-1 max-w-sm">
                No VtuNova customer profiles match the current filter criteria. Modify searches or register a profile.
              </p>
              <button
                onClick={() => { setIsEmptyState(false); setSearchQuery(''); setStatusFilter('All'); setVerifyFilter('All'); setRoleFilter('All'); setBalanceFilter('All'); }}
                className="mt-5 text-xs text-white bg-blue-600 hover:bg-blue-500 font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                Reset Database Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

              {/* LEFT & CENTER: DATA TABLE */}
              <div className="xl:col-span-2 space-y-6">
                
                <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border text-text-muted font-semibold pb-3">
                          {['User Account', 'Customer ID', 'Wallet Balance', 'Transactions', 'Verification', 'Status', 'Joined Date', 'Actions'].map((h) => (
                            <th key={h} className="text-left py-3 pr-4 last:pr-0 whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {processedUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-bg-dark-secondary/50 transition-colors group">
                            
                            {/* Avatar & User Details */}
                            <td className="py-3.5 pr-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-heading font-bold uppercase shrink-0">
                                  {u.firstName[0]}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-text-white font-semibold truncate hover:text-blue-500 transition-colors cursor-pointer" onClick={() => { setSelectedUser(u); setIsDrawerOpen(true); }}>
                                    {u.firstName} {u.lastName}
                                  </p>
                                  <span className="text-[10px] text-text-muted block truncate">{u.email}</span>
                                </div>
                              </div>
                            </td>

                            {/* ID */}
                            <td className="py-3.5 pr-4 text-blue-500 font-mono font-medium">{u.id}</td>

                            {/* Balance */}
                            <td className="py-3.5 pr-4 text-text-white font-bold">₦{u.walletBalance.toLocaleString()}</td>

                            {/* Count */}
                            <td className="py-3.5 pr-4 text-text-muted font-mono">{u.transactionsCount} txs</td>

                            {/* KYC */}
                            <td className="py-3.5 pr-4">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border
                                ${u.verificationStatus === 'Verified' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : ''}
                                ${u.verificationStatus === 'Pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : ''}
                                ${u.verificationStatus === 'Unverified' ? 'bg-red-500/10 border-red-500/20 text-red-400' : ''}
                              `}>
                                {u.verificationStatus}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 pr-4">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border
                                ${u.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}
                              `}>
                                {u.status}
                              </span>
                            </td>

                            {/* Date */}
                            <td className="py-3.5 pr-4 text-text-muted">{u.joinedDate}</td>

                            {/* Actions Dropdown */}
                            <td className="py-3.5 text-right relative">
                              <button
                                onClick={() => setActionsMenuUser(actionsMenuUser === u.id ? null : u.id)}
                                className="px-2 py-1 bg-bg-dark-secondary border border-border text-text-white hover:bg-border transition-colors rounded-lg font-bold"
                              >
                                •••
                              </button>

                              {actionsMenuUser === u.id && (
                                <div className="absolute right-0 mt-1 w-44 bg-bg-card border border-border rounded-xl shadow-xl py-2 z-30 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                                  <button onClick={() => { setSelectedUser(u); setIsDrawerOpen(true); setActionsMenuUser(null); }} className="w-full px-4 py-2 text-xs text-text-white hover:bg-bg-card-hover transition-colors flex items-center gap-2">
                                    👤 View Profile
                                  </button>
                                  <button onClick={() => { setSelectedUser(u); setActiveModal('walletAdjust'); setActionsMenuUser(null); }} className="w-full px-4 py-2 text-xs text-text-white hover:bg-bg-card-hover transition-colors flex items-center gap-2">
                                    💰 Credit/Debit Wallet
                                  </button>
                                  {u.status === 'Active' ? (
                                    <button onClick={() => { handleStatusChange(u.id, 'Suspended'); setActionsMenuUser(null); }} className="w-full px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2">
                                      🚫 Suspend User
                                    </button>
                                  ) : (
                                    <button onClick={() => { handleStatusChange(u.id, 'Active'); setActionsMenuUser(null); }} className="w-full px-4 py-2 text-xs text-emerald-400 hover:bg-emerald-500/10 transition-colors flex items-center gap-2">
                                      🟢 Reactivate
                                    </button>
                                  )}
                                  <button onClick={() => { handleDeleteUser(u.id); setActionsMenuUser(null); }} className="w-full px-4 py-2 text-xs text-red-500 hover:bg-red-600/10 transition-colors flex items-center gap-2">
                                    🗑️ Delete Profile
                                  </button>
                                </div>
                              )}
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section B: Recharts Analytics Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Chart 1: User Growth Timeline */}
                  <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-xs">
                    <h4 className="text-text-white font-heading font-bold text-sm mb-4">User Base Growth</h4>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={ANALYTICS_GROWTH_DATA}>
                          <defs>
                            <linearGradient id="userGlow" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                          <XAxis dataKey="name" tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} axisLine={false} />
                          <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} axisLine={false} />
                          <Tooltip />
                          <Area type="monotone" dataKey="Users" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#userGlow)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 2: Wallet Distribution */}
                  <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-xs">
                    <h4 className="text-text-white font-heading font-bold text-sm mb-4">Wallet Balance Distribution</h4>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ANALYTICS_DISTRIBUTION_DATA}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                          <XAxis dataKey="name" tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} axisLine={false} />
                          <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} axisLine={false} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

              </div>

              {/* RIGHT SIDEBAR PANEL */}
              <div className="space-y-6">

                {/* Verification Progress Donut */}
                <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-text-white font-heading font-bold text-sm">KYC Verification Summary</h4>
                    <p className="text-[11px] text-text-muted mt-0.5">Status breakdown of user registers</p>
                  </div>
                  
                  <div className="h-44 my-4 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ANALYTICS_VERIFICATION_DATA}
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {ANALYTICS_VERIFICATION_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs mt-2 border-t border-border pt-4">
                    <div>
                      <p className="text-text-muted text-[10px]">Verified</p>
                      <p className="text-sm font-bold text-text-white">10.9k</p>
                    </div>
                    <div>
                      <p className="text-text-muted text-[10px]">Pending</p>
                      <p className="text-sm font-bold text-amber-500">1.2k</p>
                    </div>
                    <div>
                      <p className="text-text-muted text-[10px]">Unverified</p>
                      <p className="text-sm font-bold text-red-500">648</p>
                    </div>
                  </div>
                </div>

                {/* Alerts log panel */}
                <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-text-white font-heading font-bold text-sm">Suspicious Users Audit Log</h4>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  </div>

                  <div className="space-y-3">
                    {alerts.map((al) => (
                      <div key={al.id} className="bg-bg-dark-secondary/60 border border-border rounded-xl p-3.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[10px] font-extrabold uppercase ${al.severity === 'high' ? 'text-red-500' : 'text-amber-500'}`}>
                            {al.severity === 'high' ? '🚨 High Alert' : '⚠️ Warning'}
                          </span>
                          <span className="text-[9px] text-text-muted">{al.time}</span>
                        </div>
                        <h5 className="text-xs font-semibold text-text-white mt-1.5">{al.title}</h5>
                        <p className="text-[10px] text-text-muted mt-1 leading-relaxed">{al.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Heatmap Grid simulator */}
                <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-xs">
                  <h4 className="text-text-white font-heading font-bold text-sm mb-2">Hourly Activity Heatmap</h4>
                  <p className="text-[10px] text-text-muted mb-4">Peak server usage hours across local time zones.</p>
                  
                  <div className="grid grid-cols-6 gap-1.5">
                    {Array.from({ length: 24 }).map((_, i) => {
                      const intensities = ['bg-blue-500/10', 'bg-blue-500/30', 'bg-blue-500/60', 'bg-blue-600', 'bg-blue-700'];
                      const heat = intensities[Math.floor(Math.random() * intensities.length)];
                      return (
                        <div
                          key={i}
                          className={`aspect-square rounded-sm ${heat} hover:scale-110 transition-transform cursor-pointer`}
                          title={`Hour ${i}:00 - Average Operations`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-text-muted mt-3">
                    <span>Low load (00:00)</span>
                    <span>Peak Traffic (14:00)</span>
                  </div>
                </div>

              </div>

            </div>
          )}

        </main>

      {/* ─── USER PROFILE SLIDE-OVER DRAWER ─── */}
      {isDrawerOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          {/* Drawer backdrop closer */}
          <div onClick={() => setIsDrawerOpen(false)} className="flex-1" />
          
          <div className="w-full max-w-lg bg-bg-card border-l border-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-bg-dark-secondary/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-heading font-bold text-white uppercase shadow-md">
                  {selectedUser.firstName[0]}
                </div>
                <div>
                  <h3 className="text-text-white font-heading font-bold text-base">{selectedUser.firstName} {selectedUser.lastName}</h3>
                  <span className="text-[10px] text-text-muted uppercase font-semibold tracking-wide">ID: {selectedUser.id}</span>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-text-white hover:bg-bg-dark-secondary transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Scrollable details */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Profile Overview */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-text-white uppercase tracking-wider border-b border-border pb-1">Profile Details</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-text-muted block mb-0.5">Email Address</span>
                    <span className="text-text-white font-medium">{selectedUser.email}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block mb-0.5">Phone Contact</span>
                    <span className="text-text-white font-medium">{selectedUser.phone}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block mb-0.5">Customer Tier</span>
                    <span className="text-text-white font-semibold text-blue-500">{selectedUser.role}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block mb-0.5">Joined System</span>
                    <span className="text-text-white font-medium">{selectedUser.joinedDate}</span>
                  </div>
                </div>
              </div>

              {/* Wallet Info */}
              <div className="bg-bg-dark-secondary/50 border border-border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-text-muted text-[10px] block font-semibold uppercase tracking-wider">Current Wallet Balance</span>
                  <span className="text-xl font-heading font-extrabold text-text-white mt-1 block">₦{selectedUser.walletBalance.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => setActiveModal('walletAdjust')}
                  className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3 py-2 rounded-xl transition-colors shadow-xs"
                >
                  Adjust Balance
                </button>
              </div>

              {/* Verification Status */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-text-white uppercase tracking-wider border-b border-border pb-1">Verification Center</h4>
                
                <div className="space-y-3.5">
                  
                  {/* Email */}
                  <div className="flex items-center justify-between border border-border/80 p-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{selectedUser.emailVerified ? '🟢' : '🔴'}</span>
                      <div>
                        <span className="text-xs font-bold text-text-white block">Email Verified</span>
                        <span className="text-[10px] text-text-muted block">{selectedUser.email}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleVerifyAction('email', !selectedUser.emailVerified)}
                      className="text-[10px] border border-border hover:bg-bg-dark-secondary text-text-white font-semibold px-2.5 py-1.5 rounded-lg"
                    >
                      Toggle Verify
                    </button>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center justify-between border border-border/80 p-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{selectedUser.phoneVerified ? '🟢' : '🔴'}</span>
                      <div>
                        <span className="text-xs font-bold text-text-white block">Phone Verified</span>
                        <span className="text-[10px] text-text-muted block">{selectedUser.phone}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleVerifyAction('phone', !selectedUser.phoneVerified)}
                      className="text-[10px] border border-border hover:bg-bg-dark-secondary text-text-white font-semibold px-2.5 py-1.5 rounded-lg"
                    >
                      Toggle Verify
                    </button>
                  </div>

                  {/* Identity verification */}
                  <div className="border border-border/80 p-3.5 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{selectedUser.identityVerified ? '🟢' : '🟡'}</span>
                        <div>
                          <span className="text-xs font-bold text-text-white block">Identity Verification KYC</span>
                          <span className="text-[10px] text-text-muted block">
                            {selectedUser.identityDocUrl ? `Attached document: ${selectedUser.identityDocUrl}` : 'No document uploaded.'}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border
                        ${selectedUser.verificationStatus === 'Verified' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}
                      `}>
                        {selectedUser.verificationStatus}
                      </span>
                    </div>

                    {selectedUser.identityDocUrl && (
                      <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                        <button
                          onClick={() => handleVerifyAction('identity', true)}
                          className="text-[10px] flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors text-center"
                        >
                          Approve ID Doc
                        </button>
                        <button
                          onClick={() => handleVerifyAction('identity', false)}
                          className="text-[10px] flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors text-center"
                        >
                          Reject ID Doc
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* User activity log */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-text-white uppercase tracking-wider border-b border-border pb-1">Activity Log</h4>
                <div className="space-y-3">
                  {timelineEvents
                    .filter((e) => e.userId === selectedUser.id)
                    .map((e) => (
                      <div key={e.id} className="flex gap-2.5 text-xs">
                        <span className="text-sm mt-0.5">{e.icon}</span>
                        <div>
                          <p className="text-text-white leading-relaxed">{e.text}</p>
                          <span className="text-[9px] text-text-muted block mt-0.5">{e.time}</span>
                        </div>
                      </div>
                    ))}
                  {timelineEvents.filter((e) => e.userId === selectedUser.id).length === 0 && (
                    <p className="text-xs text-text-muted py-2">No recent events logged for this user account.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Drawer footer actions */}
            <div className="p-4 border-t border-border flex items-center gap-2 bg-bg-dark-secondary/35">
              <button
                onClick={() => setActiveModal('sendNotification')}
                className="flex-1 py-2.5 bg-bg-dark-secondary border border-border hover:bg-border text-text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Send notification
              </button>
              
              {selectedUser.status === 'Active' ? (
                <button
                  onClick={() => handleStatusChange(selectedUser.id, 'Suspended')}
                  className="flex-1 py-2.5 bg-red-500/15 border border-red-500/20 text-red-400 hover:bg-red-500/25 rounded-xl text-xs font-semibold transition-colors"
                >
                  Suspend User
                </button>
              ) : (
                <button
                  onClick={() => handleStatusChange(selectedUser.id, 'Active')}
                  className="flex-1 py-2.5 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25 rounded-xl text-xs font-semibold transition-colors"
                >
                  Reactivate
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ─── DIALOGUE MODALS ─── */}

      {/* 1. Add User Modal */}
      {activeModal === 'addUser' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-text-muted hover:text-text-white text-lg">✕</button>
            <h3 className="text-text-white font-heading font-bold text-base mb-4">Register User Profile</h3>
            
            <form onSubmit={handleAddUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-text-muted uppercase mb-1.5">First Name</label>
                <input
                  type="text"
                  required
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                  className="w-full text-xs px-3.5 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-semibold text-text-muted uppercase mb-1.5">Last Name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                  className="w-full text-xs px-3.5 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-semibold text-text-muted uppercase mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full text-xs px-3.5 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-semibold text-text-muted uppercase mb-1.5">Phone Number</label>
                <input
                  type="text"
                  placeholder="+234..."
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full text-xs px-3.5 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-semibold text-text-muted uppercase mb-1.5">Platform Tier</label>
                <select
                  value={formData.role}
                  onChange={(e: any) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                  className="w-full text-xs px-3.5 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden"
                >
                  <option value="User">Regular User</option>
                  <option value="Agent">Commission Agent</option>
                  <option value="Admin">System Administrator</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-md transition-colors"
              >
                Confirm Register
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Wallet Adjustment Modal */}
      {activeModal === 'walletAdjust' && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-text-muted hover:text-text-white text-lg">✕</button>
            <h3 className="text-text-white font-heading font-bold text-base mb-2">Adjust User Wallet</h3>
            <p className="text-xs text-text-muted mb-4">Adjusting balance for: {selectedUser.firstName} {selectedUser.lastName} ({selectedUser.id})</p>

            <form onSubmit={handleWalletAdjust} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-text-muted uppercase mb-1.5">Action</label>
                <select
                  value={formData.walletAction}
                  onChange={(e: any) => setFormData((prev) => ({ ...prev, walletAction: e.target.value }))}
                  className="w-full text-xs px-3.5 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden"
                >
                  <option value="credit">Credit Balance (Add Funds)</option>
                  <option value="debit">Debit Balance (Deduct Funds)</option>
                </select>
              </div>
              
              <div>
                <label className="block font-semibold text-text-muted uppercase mb-1.5">Correction Amount (₦)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 5000"
                  value={formData.walletAmount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, walletAmount: e.target.value }))}
                  className="w-full text-xs px-3.5 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-text-muted uppercase mb-1.5">Audit Reason</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cashback promo bonus adjustment"
                  value={formData.walletReason}
                  onChange={(e) => setFormData((prev) => ({ ...prev, walletReason: e.target.value }))}
                  className="w-full text-xs px-3.5 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden"
                />
              </div>

              {/* Preview */}
              <div className="bg-bg-dark-secondary/50 border border-border p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] text-text-muted block font-semibold uppercase tracking-wider">Adjustment Preview</span>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-text-muted">Previous Balance:</span>
                  <span className="text-text-white font-medium">₦{selectedUser.walletBalance.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Correction Delta:</span>
                  <span className={formData.walletAction === 'credit' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {formData.walletAction === 'credit' ? '+' : '-'} ₦{parseFloat(formData.walletAmount || '0').toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-md transition-colors"
              >
                Apply Wallet Adjustment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Send Notification Modal */}
      {activeModal === 'sendNotification' && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-text-muted hover:text-text-white text-lg">✕</button>
            <h3 className="text-text-white font-heading font-bold text-base mb-1">Direct Push Notification</h3>
            <p className="text-xs text-text-muted mb-4">Send target message to: {selectedUser.firstName} ({selectedUser.id})</p>

            <form onSubmit={handleSendUserNotification} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-text-muted uppercase mb-1.5">Notification Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Account security warning"
                  value={formData.notificationTitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notificationTitle: e.target.value }))}
                  className="w-full text-xs px-3.5 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-text-muted uppercase mb-1.5">Message Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter direct notification details..."
                  value={formData.notificationBody}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notificationBody: e.target.value }))}
                  className="w-full text-xs px-3.5 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-md transition-colors"
              >
                Send Notification
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
