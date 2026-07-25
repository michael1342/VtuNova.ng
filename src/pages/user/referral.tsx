import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  GiftIcon,
  DocumentDuplicateIcon,
  ShareIcon,
  QrCodeIcon,
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  CheckCircleIcon,
  XMarkIcon,
  // SparklesIcon,
  TrophyIcon,
  UserGroupIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  ClockIcon,
  // BanknotesIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

// ─── TYPES & INTERFACES ──────────────────────────────────────────────────────
interface ReferralUser {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  transactions: number;
  status: 'Active' | 'Pending' | 'Inactive';
  rewardEarned: number;
}

interface ActivityEvent {
  id: string;
  type: 'joined' | 'credited' | 'active' | 'bonus';
  title: string;
  description: string;
  time: string;
  amount?: number;
}

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const MOCK_REFERRALS: ReferralUser[] = [
  { id: '1', name: 'Michael A.', email: 'm.adebayo@gmail.com', joinDate: '12 Jun 2026', transactions: 14, status: 'Active', rewardEarned: 3000 },
  { id: '2', name: 'Ada C.', email: 'ada.chi@yahoo.com', joinDate: '10 Jun 2026', transactions: 2, status: 'Pending', rewardEarned: 500 },
  { id: '3', name: 'Tunde B.', email: 'tundebakare@gmail.com', joinDate: '08 Jun 2026', transactions: 0, status: 'Pending', rewardEarned: 0 },
  { id: '4', name: 'Chinonso O.', email: 'chinonso20@outlook.com', joinDate: '05 Jun 2026', transactions: 25, status: 'Active', rewardEarned: 5000 },
  { id: '5', name: 'Blessing E.', email: 'blessy.e@gmail.com', joinDate: '28 May 2026', transactions: 9, status: 'Active', rewardEarned: 2000 },
  { id: '6', name: 'Yusuf A.', email: 'yusuf.alkali@gmail.com', joinDate: '15 May 2026', transactions: 0, status: 'Inactive', rewardEarned: 0 },
  { id: '7', name: 'Sandra W.', email: 'sandy.williams@hotmail.com', joinDate: '12 May 2026', transactions: 18, status: 'Active', rewardEarned: 4000 },
  { id: '8', name: 'Ibrahim K.', email: 'ibra.kabir@yahoo.com', joinDate: '01 May 2026', transactions: 1, status: 'Inactive', rewardEarned: 200 },
  { id: '9', name: 'Precious U.', email: 'precious.u@gmail.com', joinDate: '24 Apr 2026', transactions: 11, status: 'Active', rewardEarned: 2500 },
];

const MOCK_ACTIVITY: ActivityEvent[] = [
  { id: 'act-1', type: 'credited', title: 'Reward Credited', description: '₦3,000 added for Michael A. becoming active.', time: '2 hours ago', amount: 3000 },
  { id: 'act-2', type: 'active', title: 'Referral Became Active', description: 'Ada C. made their first wallet funding.', time: '5 hours ago' },
  { id: 'act-3', type: 'joined', title: 'Referral Joined', description: 'Tunde B. registered using your referral code.', time: '1 day ago' },
  { id: 'act-4', type: 'bonus', title: 'Milestone Bonus Earned', description: 'Received ₦2,000 for completing the "Invite 10 Friends" milestone.', time: '3 days ago', amount: 2000 },
  { id: 'act-5', type: 'credited', title: 'Reward Credited', description: '₦5,000 added for Chinonso O. transactions.', time: '5 days ago', amount: 5000 },
];

const MOCK_GROWTH_DATA = [
  { month: 'Jan', referrals: 15, earnings: 8500 },
  { month: 'Feb', referrals: 22, earnings: 12000 },
  { month: 'Mar', referrals: 35, earnings: 21500 },
  { month: 'Apr', referrals: 48, earnings: 32000 },
  { month: 'May', referrals: 64, earnings: 45000 },
  { month: 'Jun', referrals: 84, earnings: 85000 },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function Referrals() {
  // --- States ---
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedModalLink, setCopiedModalLink] = useState(false);
  const [isEmptyState,] = useState(false);
  
  // Wallet Balances
  const [availableEarnings, setAvailableEarnings] = useState(25500);
  const [totalEarnings, ] = useState(85000);
  const [pendingRewards,] = useState(12500);
  
  // Modals
  const [showQrModal, setShowQrModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  // Transaction flow simulation
  const [transferAmount, setTransferAmount] = useState('25500');
  const [withdrawAmount, setWithdrawAmount] = useState('25500');
  const [bankName, setBankName] = useState('Access Bank');
  const [accountNumber, setAccountNumber] = useState('0123456789');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Success details
  const [successDetails, setSuccessDetails] = useState({
    title: '',
    amount: 0,
    recipient: '',
    type: 'transfer' as 'transfer' | 'withdraw',
  });

  // Table Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Pending' | 'Inactive'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const referralCode = 'SWT-MICHAEL-248';
  const referralLink = `https://vtunova.com/ref/${referralCode}`;

  // --- Helpers ---
  const handleCopy = (text: string, type: 'code' | 'link' | 'modalLink') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedModalLink(true);
      setTimeout(() => setCopiedModalLink(false), 2000);
    }
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);
    if (isNaN(amt) || amt <= 0 || amt > availableEarnings) {
      alert('Invalid amount selected.');
      return;
    }
    
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowTransferModal(false);
      setAvailableEarnings(prev => prev - amt);
      setSuccessDetails({
        title: 'Transfer Successful',
        amount: amt,
        recipient: 'Main Wallet Account',
        type: 'transfer',
      });
      setShowSuccessModal(true);
    }, 1500);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0 || amt > availableEarnings) {
      alert('Invalid amount selected.');
      return;
    }
    if (!accountNumber || accountNumber.length < 10) {
      alert('Please enter a valid bank account number.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowWithdrawModal(false);
      setAvailableEarnings(prev => prev - amt);
      setSuccessDetails({
        title: 'Withdrawal Initialized',
        amount: amt,
        recipient: `${bankName} (${accountNumber.slice(0, 3)}••••${accountNumber.slice(-3)})`,
        type: 'withdraw',
      });
      setShowSuccessModal(true);
    }, 1500);
  };

  const handleShare = (platform: string) => {
    let url = '';
    const shareText = `Hey! Sign up on VtuNova using my referral link to get airtime, data and electricity bills discount instantly: ${referralLink}`;
    
    if (platform === 'whatsapp') {
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    } else if (platform === 'telegram') {
      url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`;
    } else if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
    } else if (platform === 'x') {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    }
    if (url) window.open(url, '_blank');
  };

  // --- Filtering & Paginating Referrals ---
  const filteredReferrals = useMemo(() => {
    if (isEmptyState) return [];
    return MOCK_REFERRALS.filter(ref => {
      const matchesSearch = ref.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            ref.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || ref.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, isEmptyState]);

  const paginatedReferrals = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredReferrals.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredReferrals, currentPage]);

  const totalPages = Math.ceil(filteredReferrals.length / itemsPerPage) || 1;

  const totalFriendsMilestone = 10;
  const currentFriendsMilestone = isEmptyState ? 0 : 8;

  const totalGoldMilestone = 50;
  const currentGoldMilestone = isEmptyState ? 0 : 32;

  const totalPlatinumMilestone = 100;
  const currentPlatinumMilestone = isEmptyState ? 0 : 64;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-dark-secondary text-text-gray font-sans transition-colors duration-200">
      
      {/* ── Demo Switcher Banner (Subtle & Premium Developer Tools) ── */}
      {/* <div className="bg-blue-600/10 border-b border-blue-500/20 py-2 px-6 flex items-center justify-between text-xs text-blue-500">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-4 h-4 animate-pulse" />
          <span><strong>Developer Demo Controls:</strong> Switch states to preview design features.</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsEmptyState(!isEmptyState)}
            className="bg-blue-500 text-white font-semibold rounded-md px-3 py-1 hover:bg-blue-600 transition-colors"
          >
            Toggle Empty State ({isEmptyState ? 'Active Dashboard' : 'Empty State'})
          </button>
        </div>
      </div> */}

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">

        {/* ── Page Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-text-white font-['Space_Grotesk'] leading-tight">
              Referral Program
            </h2>
            <p className="text-sm text-text-muted mt-1">
              Invite friends to VtuNova and earn rewards when they join and transact.
            </p>
          </div>
          {/* Trust Badges */}
          <div className="grid grid-cols-2 sm:flex items-center gap-x-4 gap-y-2 text-xs font-medium text-emerald-500 bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <CheckCircleIcon className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Instant Tracking</span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <CheckCircleIcon className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Unlimited Invites</span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <CheckCircleIcon className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Easy Sharing</span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <CheckCircleIcon className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Transparent Payouts</span>
            </div>
          </div>
        </div>

        {/* ── Main Layout Grid (Hero Card & Balance Card) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Referral Hero Card */}
          <div className="lg:col-span-2 relative bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-6 text-white overflow-hidden shadow-lg shadow-blue-500/15 flex flex-col justify-between min-h-[300px]">
            {/* Background SVGs */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <circle cx="20" cy="20" r="30" fill="white" />
                <circle cx="80" cy="80" r="40" fill="white" />
                <path d="M -10,80 Q 20,40 50,80 T 110,80" fill="none" stroke="white" strokeWidth="5" />
              </svg>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full text-white backdrop-blur">
                  Special Rewards
                </span>
                <GiftIcon className="w-8 h-8 text-cyan-200 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold font-['Space_Grotesk']">
                  Invite Friends & Earn Real Cash
                </h3>
                <p className="text-xs text-blue-100 max-w-md">
                  Get ₦500 for every friend who signs up and funds their wallet with at least ₦1,000. Your friend also receives a ₦200 bonus!
                </p>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/10">
              {/* Code Panel */}
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-blue-200 font-semibold uppercase">Your Referral Code</div>
                  <div className="text-lg font-bold font-mono tracking-wider text-white select-all">{referralCode}</div>
                </div>
                <button
                  onClick={() => handleCopy(referralCode, 'code')}
                  className="p-2 rounded-lg bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-white relative"
                  title="Copy Code"
                >
                  {copiedCode ? (
                    <span className="text-xs font-bold text-cyan-200 px-1">Copied!</span>
                  ) : (
                    <DocumentDuplicateIcon className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Link Panel */}
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10 flex items-center justify-between">
                <div className="truncate mr-2">
                  <div className="text-[10px] text-blue-200 font-semibold uppercase">Referral Link</div>
                  <div className="text-xs font-mono text-blue-50 truncate">{referralLink}</div>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleCopy(referralLink, 'link')}
                    className="p-2 rounded-lg bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-white"
                    title="Copy Link"
                  >
                    {copiedLink ? (
                      <span className="text-xs font-bold text-cyan-200 px-1">Copied!</span>
                    ) : (
                      <DocumentDuplicateIcon className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setShowQrModal(true)}
                    className="p-2 rounded-lg bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-white"
                    title="Generate QR Code"
                  >
                    <QrCodeIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reward Wallet Card */}
          <div className="bg-bg-card border border-border rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:border-border-hover transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-text-muted uppercase font-bold tracking-wider">Available Earnings</span>
                </div>
                <button 
                  onClick={() => setShowHistoryModal(true)}
                  className="text-xs text-blue-500 hover:text-blue-600 font-semibold flex items-center gap-1"
                >
                  <ClockIcon className="w-3.5 h-3.5" />
                  <span>History</span>
                </button>
              </div>

              <div className="space-y-1">
                <div className="text-3xl font-extrabold text-text-white font-['Space_Grotesk']">
                  ₦{availableEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-[11px] text-text-muted">
                  Earned rewards can be withdrawn to bank or transferred to main wallet.
                </p>
              </div>
            </div>

            <div className="space-y-2 mt-6">
              <button
                onClick={() => setShowTransferModal(true)}
                disabled={availableEarnings <= 0}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/40 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-2.5 px-4 text-xs transition-colors flex items-center justify-center gap-2"
              >
                <ArrowUpRightIcon className="w-4 h-4" />
                <span>Transfer to Main Wallet</span>
              </button>
              
              <button
                onClick={() => setShowWithdrawModal(true)}
                disabled={availableEarnings <= 0}
                className="w-full bg-bg-dark-secondary hover:bg-bg-card-hover border border-border disabled:opacity-40 disabled:cursor-not-allowed text-text-white font-semibold rounded-xl py-2.5 px-4 text-xs transition-all flex items-center justify-center gap-2"
              >
                <ArrowDownLeftIcon className="w-4 h-4" />
                <span>Withdraw Rewards to Bank</span>
              </button>
            </div>
          </div>

        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Referrals */}
          <div className="bg-bg-card border border-border rounded-xl p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <UserGroupIcon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                +12% mo
              </span>
            </div>
            <div className="mt-3">
              <div className="text-xs text-text-muted">Total Referrals</div>
              <div className="text-2xl font-bold text-text-white font-['Space_Grotesk'] mt-0.5">
                {isEmptyState ? 0 : 128}
              </div>
            </div>
            {/* Sparkline */}
            <div className="h-8 w-full mt-2">
              <svg className="w-full h-full text-blue-500" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path
                  d="M0,25 Q15,10 30,22 T60,8 T90,18 T100,5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Card 2: Active Referrals */}
          <div className="bg-bg-card border border-border rounded-xl p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <CheckCircleIcon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                65.6% Rate
              </span>
            </div>
            <div className="mt-3">
              <div className="text-xs text-text-muted">Active Referrals</div>
              <div className="text-2xl font-bold text-text-white font-['Space_Grotesk'] mt-0.5">
                {isEmptyState ? 0 : 84}
              </div>
            </div>
            {/* Sparkline */}
            <div className="h-8 w-full mt-2">
              <svg className="w-full h-full text-emerald-500" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path
                  d="M0,20 Q20,15 40,25 T70,5 T100,10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Card 3: Total Earnings */}
          <div className="bg-bg-card border border-border rounded-xl p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                <TrophyIcon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                +₦15,000 wk
              </span>
            </div>
            <div className="mt-3">
              <div className="text-xs text-text-muted">Total Earnings</div>
              <div className="text-2xl font-bold text-text-white font-['Space_Grotesk'] mt-0.5">
                ₦{(isEmptyState ? 0 : totalEarnings).toLocaleString('en-US')}
              </div>
            </div>
            {/* Sparkline */}
            <div className="h-8 w-full mt-2">
              <svg className="w-full h-full text-cyan-500" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path
                  d="M0,25 L10,24 L20,20 L30,22 L40,15 L50,18 L60,10 L70,12 L80,5 L90,8 L100,2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Card 4: Pending Rewards */}
          <div className="bg-bg-card border border-border rounded-xl p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                <ClockIcon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                In Review
              </span>
            </div>
            <div className="mt-3">
              <div className="text-xs text-text-muted">Pending Rewards</div>
              <div className="text-2xl font-bold text-text-white font-['Space_Grotesk'] mt-0.5">
                ₦{(isEmptyState ? 0 : pendingRewards).toLocaleString('en-US')}
              </div>
            </div>
            {/* Sparkline */}
            <div className="h-8 w-full mt-2">
              <svg className="w-full h-full text-amber-500" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path
                  d="M0,15 H30 Q50,5 70,20 T100,15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ── How It Works Section ── */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-text-white font-bold text-sm font-['Space_Grotesk']">
              How the Referral Program Works
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Follow these simple steps to claim your cash benefits.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center p-4 rounded-xl hover:bg-bg-dark-secondary/40 transition-colors">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-lg border-2 border-blue-500/20 mb-3 shadow-inner">
                1
              </div>
              <h4 className="text-xs font-bold text-text-white mb-1">Share Referral Link</h4>
              <p className="text-[11px] text-text-muted max-w-[180px]">
                Copy your customized link or code and share it with friends via socials or SMS.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center p-4 rounded-xl hover:bg-bg-dark-secondary/40 transition-colors">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold text-lg border-2 border-cyan-500/20 mb-3 shadow-inner">
                2
              </div>
              <h4 className="text-xs font-bold text-text-white mb-1">Friends Register</h4>
              <p className="text-[11px] text-text-muted max-w-[180px]">
                Your invitees use your custom code during signup to unlock their new member discount.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center p-4 rounded-xl hover:bg-bg-dark-secondary/40 transition-colors">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-lg border-2 border-purple-500/20 mb-3 shadow-inner">
                3
              </div>
              <h4 className="text-xs font-bold text-text-white mb-1">Friends Fund Wallet</h4>
              <p className="text-[11px] text-text-muted max-w-[180px]">
                They deposit a minimum of ₦1,000 into their wallets to carry out initial transactions.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative flex flex-col items-center text-center p-4 rounded-xl hover:bg-bg-dark-secondary/40 transition-colors">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-lg border-2 border-emerald-500/20 mb-3 shadow-inner">
                4
              </div>
              <h4 className="text-xs font-bold text-text-white mb-1">Earn Cash Rewards</h4>
              <p className="text-[11px] text-text-muted max-w-[180px]">
                ₦500 is instantly credited to your referral earnings wallet, and they get ₦200 bonus!
              </p>
            </div>

          </div>
        </div>

        {/* ── Performance Section (Chart & Funnel & Breakdown) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Monthly Referral Growth */}
          <div className="lg:col-span-2 bg-bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-text-white font-bold text-sm font-['Space_Grotesk']">Monthly Referral Growth</h3>
                <p className="text-xs text-text-muted mt-0.5">Visual referral signups and monthly trends</p>
              </div>
              <span className="text-[11px] font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md">
                1st Half 2026
              </span>
            </div>

            {/* Recharts AreaChart */}
            <div className="h-60 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={isEmptyState ? [] : MOCK_GROWTH_DATA}
                  margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="refGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-bg-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 12,
                      fontSize: 12,
                      color: 'var(--color-text-white)',
                    }}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="referrals"
                    name="Signups"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#refGrad)"
                    dot={{ r: 3, fill: '#3b82f6' }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Analytics Funnel & Breakdown */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-text-white font-bold text-sm font-['Space_Grotesk']">Referral Conversion</h3>
                <p className="text-xs text-text-muted mt-0.5">Breakdown of the invite pipeline</p>
              </div>

              {/* Conversion Stats */}
              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-gray">Unique Visitors</span>
                    <span className="font-semibold text-text-white">{isEmptyState ? 0 : '1,240'}</span>
                  </div>
                  <div className="w-full h-2 bg-bg-dark-secondary rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: isEmptyState ? '0%' : '100%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-gray">Registrations (Signups)</span>
                    <span className="font-semibold text-text-white">{isEmptyState ? 0 : '128 (10.3%)'}</span>
                  </div>
                  <div className="w-full h-2 bg-bg-dark-secondary rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full transition-all duration-500" style={{ width: isEmptyState ? '0%' : '50%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-gray">Active Users (Funded)</span>
                    <span className="font-semibold text-text-white">{isEmptyState ? 0 : '84 (65.6%)'}</span>
                  </div>
                  <div className="w-full h-2 bg-bg-dark-secondary rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: isEmptyState ? '0%' : '35%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-gray">Reward Conversion Rate</span>
                    <span className="font-semibold text-emerald-400">{isEmptyState ? '0%' : '57.1%'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings Breakdown */}
            <div className="pt-4 border-t border-border mt-4">
              <div className="text-xs text-text-white font-bold mb-2.5">Earnings Breakdown</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-bg-dark-secondary rounded-lg p-2 border border-border">
                  <div className="text-[10px] text-text-muted">This Month</div>
                  <div className="text-xs font-bold text-text-white mt-0.5">₦{isEmptyState ? 0 : '15,000'}</div>
                </div>
                <div className="bg-bg-dark-secondary rounded-lg p-2 border border-border">
                  <div className="text-[10px] text-text-muted">Last Month</div>
                  <div className="text-xs font-bold text-text-white mt-0.5">₦{isEmptyState ? 0 : '28,000'}</div>
                </div>
                <div className="bg-bg-dark-secondary rounded-lg p-2 border border-border">
                  <div className="text-[10px] text-text-muted">Lifetime</div>
                  <div className="text-xs font-bold text-blue-500 mt-0.5">₦{isEmptyState ? 0 : '85,000'}</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Table & Interactive Lists Container ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Referral Table Block */}
          <div className="lg:col-span-2 bg-bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-text-white font-bold text-sm font-['Space_Grotesk']">Referral List</h3>
                  <p className="text-xs text-text-muted mt-0.5">Search and filter detailed referral statuses</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      const csvContent = "data:text/csv;charset=utf-8,Name,Join Date,Transactions,Status,Reward Earned\n" + 
                        MOCK_REFERRALS.map(r => `"${r.name}","${r.joinDate}",${r.transactions},"${r.status}",${r.rewardEarned}`).join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", "referral_report.csv");
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="flex items-center gap-1 bg-bg-dark-secondary border border-border rounded-lg px-2.5 py-1.5 text-xs text-text-white hover:border-border-hover hover:bg-bg-card-hover transition-colors"
                  >
                    <ShareIcon className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Table Controls (Search & Filter) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="sm:col-span-2 bg-bg-dark-secondary border border-border text-xs text-text-white placeholder-text-muted rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500/50"
                />
                
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="bg-bg-dark-secondary border border-border text-xs text-text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500/50"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active Only</option>
                  <option value="Pending">Pending Only</option>
                  <option value="Inactive">Inactive Only</option>
                </select>
              </div>

              {/* Table Content */}
              <div className="overflow-x-auto overflow-y-auto max-h-[300px] scrollbar-thin">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border text-text-muted font-medium text-left">
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Join Date</th>
                      <th className="py-2 pr-4 text-center">Transactions</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 text-right">Reward Earned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isEmptyState || paginatedReferrals.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-text-muted">
                          {isEmptyState ? (
                            <div className="flex flex-col items-center justify-center space-y-2 py-4">
                              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <UserGroupIcon className="w-6 h-6" />
                              </div>
                              <div className="text-xs font-semibold text-text-white">Start inviting friends and earn rewards.</div>
                              <p className="text-[10px] text-text-muted max-w-[280px]">Your referral list is currently empty. Share your invite link to get started!</p>
                              <button
                                onClick={() => handleCopy(referralLink, 'link')}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-[11px] rounded-lg px-3 py-1.5 transition-colors flex items-center gap-1"
                              >
                                <span>Copy Link</span>
                              </button>
                            </div>
                          ) : (
                            <span>No matching referrals found.</span>
                          )}
                        </td>
                      </tr>
                    ) : (
                      paginatedReferrals.map((user) => (
                        <tr key={user.id} className="border-b border-border hover:bg-bg-dark-secondary/35 transition-colors">
                          <td className="py-3 pr-4">
                            <div className="font-semibold text-text-white">{user.name}</div>
                            <div className="text-[10px] text-text-muted font-mono">{user.email}</div>
                          </td>
                          <td className="py-3 pr-4 text-text-gray">{user.joinDate}</td>
                          <td className="py-3 pr-4 text-center text-text-white font-mono">{user.transactions}</td>
                          <td className="py-3 pr-4">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              user.status === 'Active' 
                                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                                : user.status === 'Pending' 
                                ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' 
                                : 'text-text-muted bg-zinc-500/10 border-zinc-500/20'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3 text-right font-bold text-text-white font-mono">
                            ₦{user.rewardEarned.toLocaleString('en-US')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination controls */}
            {filteredReferrals.length > 0 && (
              <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
                <span className="text-[11px] text-text-muted">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredReferrals.length)} of {filteredReferrals.length} entries
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="p-1.5 rounded-lg border border-border bg-bg-dark-secondary text-text-gray hover:text-text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-text-white font-bold px-2.5">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="p-1.5 rounded-lg border border-border bg-bg-dark-secondary text-text-gray hover:text-text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity Timeline */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-text-white font-bold text-sm font-['Space_Grotesk']">Recent Activity</h3>
                <p className="text-xs text-text-muted mt-0.5">Real-time referral notifications</p>
              </div>

              {/* Feed Items */}
              <div className="relative border-l border-border pl-4 ml-2.5 space-y-4">
                {isEmptyState ? (
                  <div className="py-6 text-center text-xs text-text-muted">No recent activities.</div>
                ) : (
                  MOCK_ACTIVITY.map((act) => (
                    <div key={act.id} className="relative">
                      {/* Timeline Dot */}
                      <span className={`absolute -left-[22px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-bg-card flex items-center justify-center ${
                        act.type === 'credited' ? 'bg-emerald-500' :
                        act.type === 'active' ? 'bg-blue-500' :
                        act.type === 'joined' ? 'bg-cyan-500' : 'bg-purple-500'
                      }`} />
                      
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-text-white">{act.title}</span>
                          <span className="text-[10px] text-text-muted font-mono">{act.time}</span>
                        </div>
                        <p className="text-[11px] text-text-muted leading-snug">
                          {act.description}
                        </p>
                        {act.amount && (
                          <div className="text-[10px] font-bold text-emerald-400 font-mono mt-0.5">
                            +₦{act.amount.toLocaleString()} Available
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="pt-4 border-t border-border mt-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-text-white mb-2">
                <InformationCircleIcon className="w-4 h-4 text-blue-400" />
                <span>Referral Tips</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-text-muted list-disc pl-4 leading-relaxed">
                <li>Share with friends who actively buy airtime, data or pay utility bills.</li>
                <li>Write a short tutorial explaining the 1.5% cashback benefits of VtuNova.</li>
                <li>Payouts are disbursed instantly once qualifications are confirmed.</li>
              </ul>
            </div>

          </div>

        </div>

        {/* ── Milestones Achievement Row ── */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-text-white font-bold text-sm font-['Space_Grotesk']">Achievement Tiers & Milestones</h3>
              <p className="text-xs text-text-muted mt-0.5">Unlock extra cash bonuses as your network expands</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <TrophyIcon className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tier 1 */}
            <div className="bg-bg-dark-secondary rounded-xl p-4 border border-border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-text-white">Invite 10 Friends</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px]">₦2,000 Bonus</span>
                </div>
                <p className="text-[11px] text-text-muted mb-4">Complete 10 successful active referrals to level up.</p>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-text-white mb-1">
                  <span>Silver Tier</span>
                  <span>{currentFriendsMilestone} / {totalFriendsMilestone}</span>
                </div>
                <div className="w-full h-2 bg-bg-card border border-border rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-700" 
                    style={{ width: `${(currentFriendsMilestone / totalFriendsMilestone) * 100}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Tier 2 */}
            <div className="bg-bg-dark-secondary rounded-xl p-4 border border-border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-text-white">Invite 50 Friends</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px]">₦10,000 Bonus</span>
                </div>
                <p className="text-[11px] text-text-muted mb-4">Extend your reach to 50 active members for larger payouts.</p>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-text-white mb-1">
                  <span>Gold Tier</span>
                  <span>{currentGoldMilestone} / {totalGoldMilestone}</span>
                </div>
                <div className="w-full h-2 bg-bg-card border border-border rounded-full overflow-hidden">
                  <div 
                    className="bg-cyan-500 h-full rounded-full transition-all duration-700" 
                    style={{ width: `${(currentGoldMilestone / totalGoldMilestone) * 100}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Tier 3 */}
            <div className="bg-bg-dark-secondary rounded-xl p-4 border border-border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-text-white">Invite 100 Friends</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px]">₦25,000 Bonus</span>
                </div>
                <p className="text-[11px] text-text-muted mb-4">Achieve legend status with 100 active network recruits.</p>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-text-white mb-1">
                  <span>Diamond Tier</span>
                  <span>{currentPlatinumMilestone} / {totalPlatinumMilestone}</span>
                </div>
                <div className="w-full h-2 bg-bg-card border border-border rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-500 h-full rounded-full transition-all duration-700" 
                    style={{ width: `${(currentPlatinumMilestone / totalPlatinumMilestone) * 100}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Social Share Panel ── */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-text-white font-bold text-sm font-['Space_Grotesk']">
              Promote Your Link & Boost Your Earnings
            </h3>
            <p className="text-xs text-text-muted">
              Instantly share on popular channels and social media apps.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleShare('whatsapp')}
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebd59] text-white font-bold rounded-xl px-4 py-2.5 text-xs transition-colors"
            >
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => handleShare('telegram')}
              className="flex items-center gap-2 bg-[#0088cc] hover:bg-[#007cbd] text-white font-bold rounded-xl px-4 py-2.5 text-xs transition-colors"
            >
              <span>Telegram</span>
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#1464cd] text-white font-bold rounded-xl px-4 py-2.5 text-xs transition-colors"
            >
              <span>Facebook</span>
            </button>
            <button
              onClick={() => handleShare('x')}
              className="flex items-center gap-2 bg-[#000000] dark:bg-[#ffffff] dark:text-[#000000] text-white font-bold rounded-xl px-4 py-2.5 text-xs transition-colors"
            >
              <span>X (Twitter)</span>
            </button>
            <button
              onClick={() => handleCopy(referralLink, 'link')}
              className="flex items-center gap-2 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white font-bold rounded-xl px-4 py-2.5 text-xs transition-all"
            >
              {copiedLink ? <span>Copied!</span> : <span>Copy Link</span>}
            </button>
            <button
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-2 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white font-bold rounded-xl px-4 py-2.5 text-xs transition-all"
            >
              <span>QR Code</span>
            </button>
          </div>
        </div>

      </div>

      {/* ── QR CODE MODAL ── */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-sm p-6 shadow-2xl relative animate-scale-up text-center space-y-4">
            
            <button 
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-white hover:bg-bg-dark-secondary p-1 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-text-white font-bold text-base font-['Space_Grotesk']">Your Referral QR Code</h3>
              <p className="text-xs text-text-muted">Scan with phone camera to join</p>
            </div>

            {/* Styled QR Code Box */}
            <div className="mx-auto bg-white p-4 rounded-xl inline-block border border-border shadow-inner">
              {/* SVG Mock QR Code */}
              <svg className="w-40 h-40 text-slate-800" viewBox="0 0 100 100">
                <rect x="0" y="0" width="25" height="25" fill="currentColor" />
                <rect x="5" y="5" width="15" height="15" fill="white" />
                <rect x="8" y="8" width="9" height="9" fill="currentColor" />

                <rect x="75" y="0" width="25" height="25" fill="currentColor" />
                <rect x="80" y="5" width="15" height="15" fill="white" />
                <rect x="83" y="8" width="9" height="9" fill="currentColor" />

                <rect x="0" y="75" width="25" height="25" fill="currentColor" />
                <rect x="5" y="80" width="15" height="15" fill="white" />
                <rect x="8" y="83" width="9" height="9" fill="currentColor" />

                {/* Random QR blocks */}
                <rect x="35" y="5" width="8" height="8" fill="currentColor" />
                <rect x="55" y="10" width="12" height="6" fill="currentColor" />
                <rect x="45" y="25" width="15" height="5" fill="currentColor" />
                <rect x="10" y="35" width="25" height="8" fill="currentColor" />
                <rect x="5" y="50" width="8" height="12" fill="currentColor" />
                <rect x="85" y="35" width="10" height="20" fill="currentColor" />
                <rect x="40" y="45" width="18" height="18" fill="currentColor" />
                <rect x="65" y="65" width="8" height="15" fill="currentColor" />
                <rect x="35" y="75" width="12" height="12" fill="currentColor" />
                <rect x="50" y="85" width="20" height="8" fill="currentColor" />
                <rect x="80" y="80" width="12" height="12" fill="currentColor" />
              </svg>
            </div>

            <div className="bg-bg-dark-secondary rounded-lg p-2.5 border border-border flex items-center justify-between text-left">
              <div className="truncate">
                <span className="text-[9px] text-text-muted font-bold uppercase">Referral Link</span>
                <p className="text-xs font-mono text-text-white truncate">{referralLink}</p>
              </div>
              <button 
                onClick={() => handleCopy(referralLink, 'modalLink')}
                className="text-xs text-blue-500 font-semibold shrink-0 ml-2"
              >
                {copiedModalLink ? 'Copied' : 'Copy'}
              </button>
            </div>

            <button
              onClick={() => {
                alert("QR Code image downloading...");
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl py-2 px-4 text-xs transition-colors"
            >
              Download QR Image
            </button>
          </div>
        </div>
      )}

      {/* ── TRANSFER TO WALLET MODAL ── */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-scale-up space-y-4">
            
            <button 
              onClick={() => setShowTransferModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-white hover:bg-bg-dark-secondary p-1 rounded-lg transition-colors"
              disabled={isProcessing}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-text-white font-bold text-base font-['Space_Grotesk']">Transfer to Main Wallet</h3>
              <p className="text-xs text-text-muted mt-0.5">Move referral rewards to your spending wallet balance</p>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs text-text-gray font-semibold">Available Rewards</label>
                <div className="bg-bg-dark-secondary border border-border rounded-xl px-4 py-3 text-text-white font-bold font-mono">
                  ₦{availableEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-text-gray font-semibold">Amount to Transfer (₦)</label>
                  <button 
                    type="button"
                    onClick={() => setTransferAmount(availableEarnings.toString())}
                    className="text-[10px] text-blue-500 font-bold hover:underline"
                  >
                    Transfer Max
                  </button>
                </div>
                <input
                  type="number"
                  required
                  min="1"
                  max={availableEarnings}
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="bg-bg-dark-secondary border border-border text-sm text-text-white rounded-xl px-4 py-2.5 w-full focus:outline-none focus:border-blue-500/50"
                  placeholder="Enter amount"
                />
              </div>

              <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 flex gap-2 text-[11px] text-text-muted">
                <InformationCircleIcon className="w-4 h-4 shrink-0 text-blue-500" />
                <span>Transfers are processed instantly. Your main wallet balance updates immediately.</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/40 text-white font-semibold rounded-xl py-2.5 px-4 text-xs transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    <span>Processing Transfer...</span>
                  </>
                ) : (
                  <span>Confirm Transfer</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── WITHDRAW TO BANK MODAL ── */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-scale-up space-y-4">
            
            <button 
              onClick={() => setShowWithdrawModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-white hover:bg-bg-dark-secondary p-1 rounded-lg transition-colors"
              disabled={isProcessing}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-text-white font-bold text-base font-['Space_Grotesk']">Withdraw to Bank Account</h3>
              <p className="text-xs text-text-muted mt-0.5">Disburse referral earnings directly to your bank account</p>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs text-text-gray font-semibold">Select Bank</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="bg-bg-dark-secondary border border-border text-xs text-text-white rounded-xl px-3 py-2 w-full focus:outline-none focus:border-blue-500/50"
                >
                  <option>Access Bank</option>
                  <option>GTBank</option>
                  <option>Zenith Bank</option>
                  <option>Kuda Bank</option>
                  <option>Opay</option>
                  <option>Moniepoint</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-text-gray font-semibold">Account Number</label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g,''))}
                  className="bg-bg-dark-secondary border border-border text-xs text-text-white rounded-xl px-4 py-2 w-full focus:outline-none"
                  placeholder="e.g. 0123456789"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-text-gray font-semibold">Amount to Withdraw (₦)</label>
                  <button 
                    type="button"
                    onClick={() => setWithdrawAmount(availableEarnings.toString())}
                    className="text-[10px] text-blue-500 font-bold hover:underline"
                  >
                    Withdraw Max
                  </button>
                </div>
                <input
                  type="number"
                  required
                  min="100"
                  max={availableEarnings}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="bg-bg-dark-secondary border border-border text-xs text-text-white rounded-xl px-4 py-2 w-full focus:outline-none"
                  placeholder="Enter amount"
                />
              </div>

              <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 flex gap-2 text-[10px] text-text-muted">
                <InformationCircleIcon className="w-4.5 h-4.5 shrink-0 text-amber-500" />
                <span>Bank disbursements standardly take up to 24 hours to clear, depending on network gateway conditions.</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/40 text-white font-semibold rounded-xl py-2.5 px-4 text-xs transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    <span>Processing Withdrawal...</span>
                  </>
                ) : (
                  <span>Initiate Payout</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── REWARD SUCCESS / CELEBRATION MODAL ── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center space-y-4 relative animate-scale-up">
            
            {/* Animated Celebration Circles */}
            <div className="relative mx-auto w-16 h-16 bg-emerald-500/15 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-500/30">
              <CheckIcon className="w-8 h-8 animate-pulse" />
              {/* Confetti simulation dots */}
              <span className="absolute top-1 left-2 w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
              <span className="absolute bottom-2 right-1 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="absolute top-4 right-3 w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-text-white font-bold text-lg font-['Space_Grotesk']">
                {successDetails.title}
              </h3>
              <p className="text-xs text-text-muted">
                Transaction processed successfully and logged.
              </p>
            </div>

            <div className="bg-bg-dark-secondary rounded-xl p-4 border border-border space-y-2 text-left">
              <div className="flex justify-between text-xs border-b border-border/50 pb-2">
                <span className="text-text-muted">Type:</span>
                <span className="font-semibold text-text-white capitalize">{successDetails.type}</span>
              </div>
              <div className="flex justify-between text-xs border-b border-border/50 pb-2">
                <span className="text-text-muted">Recipient Target:</span>
                <span className="font-semibold text-text-white truncate max-w-[160px]">{successDetails.recipient}</span>
              </div>
              <div className="flex justify-between text-xs pt-1">
                <span className="text-text-muted">Amount Transferred:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  ₦{successDetails.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl py-2 px-4 text-xs transition-colors"
              >
                Continue Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EARNINGS HISTORY OVERVIEW MODAL ── */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-lg p-6 shadow-2xl relative animate-scale-up space-y-4">
            
            <button 
              onClick={() => setShowHistoryModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-white hover:bg-bg-dark-secondary p-1 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-text-white font-bold text-base font-['Space_Grotesk']">Rewards Ledger History</h3>
              <p className="text-xs text-text-muted mt-0.5">Chronological record of referral actions & payouts</p>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {isEmptyState ? (
                <div className="py-6 text-center text-xs text-text-muted">No history found.</div>
              ) : (
                [
                  { id: 'h1', desc: 'Withdrawal to Access Bank', amt: -10000, date: '10 Jun 2026', type: 'out' },
                  { id: 'h2', desc: 'Transfer to Main Wallet', amt: -5000, date: '05 Jun 2026', type: 'out' },
                  { id: 'h3', desc: 'Referral Bonus: Michael A.', amt: 3000, date: '12 Jun 2026', type: 'in' },
                  { id: 'h4', desc: 'Referral Bonus: Chinonso O.', amt: 5000, date: '05 Jun 2026', type: 'in' },
                  { id: 'h5', desc: 'Milestone Tier Bonus: 10 Friends', amt: 2000, date: '03 Jun 2026', type: 'in' },
                  { id: 'h6', desc: 'Referral Bonus: Blessing E.', amt: 2000, date: '28 May 2026', type: 'in' },
                  { id: 'h7', desc: 'Referral Bonus: Sandra W.', amt: 4000, date: '12 May 2026', type: 'in' },
                ].map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 rounded-lg bg-bg-dark-secondary border border-border">
                    <div>
                      <div className="text-xs font-semibold text-text-white">{item.desc}</div>
                      <div className="text-[10px] text-text-muted mt-0.5">{item.date}</div>
                    </div>
                    <span className={`text-xs font-bold font-mono ${item.type === 'in' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {item.type === 'in' ? '+' : '-'}₦{Math.abs(item.amt).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
            
            <button
              onClick={() => setShowHistoryModal(false)}
              className="w-full bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white font-semibold rounded-xl py-2 px-4 text-xs transition-colors"
            >
              Close Ledger
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
