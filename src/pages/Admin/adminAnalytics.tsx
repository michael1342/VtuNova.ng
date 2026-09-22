import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
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
  PlusIcon,
  ShieldExclamationIcon,
  CpuChipIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import type { AnalyticsActivityLog as ActivityLog, AnalyticsOverview, ForecastData, GeographicInsight, Report, RevenueMetric, ServiceAnalytics, AnalyticsSystemAlert as SystemAlert } from '../../interface/admin.interface';

// ─── TYPES & INTERFACES ──────────────────────────────────────────────────────
// ─── INITIAL MOCK DATA ───────────────────────────────────────────────────────
const INITIAL_OVERVIEW: AnalyticsOverview[] = [
  {
    id: 'kpi-1',
    label: 'Revenue',
    value: '₦84,600,000',
    change: '+16%',
    isPositive: true,
    type: 'money',
    sparkline: [{ x: 1, y: 10 }, { x: 2, y: 15 }, { x: 3, y: 12 }, { x: 4, y: 22 }, { x: 5, y: 18 }, { x: 6, y: 28 }, { x: 7, y: 35 }]
  },
  {
    id: 'kpi-2',
    label: 'Profit',
    value: '₦12,420,000',
    change: '+11%',
    isPositive: true,
    type: 'money',
    sparkline: [{ x: 1, y: 5 }, { x: 2, y: 8 }, { x: 3, y: 6 }, { x: 4, y: 12 }, { x: 5, y: 10 }, { x: 6, y: 15 }, { x: 7, y: 19 }]
  },
  {
    id: 'kpi-3',
    label: 'Transactions',
    value: '245,840',
    change: '+14%',
    isPositive: true,
    type: 'number',
    sparkline: [{ x: 1, y: 100 }, { x: 2, y: 120 }, { x: 3, y: 110 }, { x: 4, y: 150 }, { x: 5, y: 140 }, { x: 6, y: 180 }, { x: 7, y: 210 }]
  },
  {
    id: 'kpi-4',
    label: 'Users',
    value: '18,450',
    change: '+10%',
    isPositive: true,
    type: 'number',
    sparkline: [{ x: 1, y: 50 }, { x: 2, y: 55 }, { x: 3, y: 52 }, { x: 4, y: 65 }, { x: 5, y: 62 }, { x: 6, y: 70 }, { x: 7, y: 78 }]
  },
  {
    id: 'kpi-5',
    label: 'Conversion Rate',
    value: '38%',
    change: '+2.5%',
    isPositive: true,
    type: 'percentage',
    sparkline: [{ x: 1, y: 30 }, { x: 2, y: 32 }, { x: 3, y: 31 }, { x: 4, y: 35 }, { x: 5, y: 34 }, { x: 6, y: 37 }, { x: 7, y: 38 }]
  },
  {
    id: 'kpi-6',
    label: 'Wallet Funding',
    value: '₦52,000,000',
    change: '+19%',
    isPositive: true,
    type: 'money',
    sparkline: [{ x: 1, y: 8 }, { x: 2, y: 12 }, { x: 3, y: 10 }, { x: 4, y: 18 }, { x: 5, y: 15 }, { x: 6, y: 22 }, { x: 7, y: 26 }]
  },
  {
    id: 'kpi-7',
    label: 'Referral Growth',
    value: '+22%',
    change: '+4%',
    isPositive: true,
    type: 'percentage',
    sparkline: [{ x: 1, y: 12 }, { x: 2, y: 14 }, { x: 3, y: 15 }, { x: 4, y: 18 }, { x: 5, y: 17 }, { x: 6, y: 20 }, { x: 7, y: 22 }]
  },
  {
    id: 'kpi-8',
    label: 'Platform Health',
    value: '99.7%',
    change: 'Stable',
    isPositive: true,
    type: 'percentage',
    sparkline: [{ x: 1, y: 99.5 }, { x: 2, y: 99.8 }, { x: 3, y: 99.7 }, { x: 4, y: 99.9 }, { x: 5, y: 99.6 }, { x: 6, y: 99.7 }, { x: 7, y: 99.7 }]
  }
];

const REVENUE_DATA_MONTHLY: RevenueMetric[] = [
  { name: 'Jan', Revenue: 45000000, Profit: 6200000, Expense: 38800000, Growth: 10 },
  { name: 'Feb', Revenue: 52000000, Profit: 7500000, Expense: 44500000, Growth: 15 },
  { name: 'Mar', Revenue: 49000000, Profit: 6900000, Expense: 42100000, Growth: 12 },
  { name: 'Apr', Revenue: 61000000, Profit: 8900000, Expense: 52100000, Growth: 24 },
  { name: 'May', Revenue: 72000000, Profit: 10500000, Expense: 61500000, Growth: 18 },
  { name: 'Jun', Revenue: 84600000, Profit: 12420000, Expense: 72180000, Growth: 16 }
];

const REVENUE_DATA_WEEKLY: RevenueMetric[] = [
  { name: 'Wk 1', Revenue: 18000000, Profit: 2600000, Expense: 15400000, Growth: 5 },
  { name: 'Wk 2', Revenue: 21000000, Profit: 3100000, Expense: 17900000, Growth: 12 },
  { name: 'Wk 3', Revenue: 19500000, Profit: 2850000, Expense: 16650000, Growth: -7 },
  { name: 'Wk 4', Revenue: 26100000, Profit: 3870000, Expense: 22230000, Growth: 33 }
];

const TRANSACTION_PERFORMANCE = [
  { name: 'Mon', Volume: 32000, SuccessRate: 98.4, AvgValue: 340, Latency: 1.2 },
  { name: 'Tue', Volume: 38000, SuccessRate: 98.9, AvgValue: 360, Latency: 1.1 },
  { name: 'Wed', Volume: 35000, SuccessRate: 97.2, AvgValue: 330, Latency: 2.4 },
  { name: 'Thu', Volume: 41000, SuccessRate: 99.1, AvgValue: 380, Latency: 1.0 },
  { name: 'Fri', Volume: 48000, SuccessRate: 98.6, AvgValue: 390, Latency: 1.3 },
  { name: 'Sat', Volume: 54000, SuccessRate: 99.4, AvgValue: 420, Latency: 0.9 },
  { name: 'Sun', Volume: 39840, SuccessRate: 97.8, AvgValue: 350, Latency: 1.5 }
];

const USER_ANALYTICS_DATA = [
  { name: 'Jan', NewUsers: 1200, ActiveUsers: 14200, Churn: 1.8, Retention: 92 },
  { name: 'Feb', NewUsers: 1500, ActiveUsers: 15100, Churn: 1.4, Retention: 94 },
  { name: 'Mar', NewUsers: 1400, ActiveUsers: 15900, Churn: 1.6, Retention: 93 },
  { name: 'Apr', NewUsers: 1800, ActiveUsers: 16900, Churn: 1.2, Retention: 95 },
  { name: 'May', NewUsers: 2200, ActiveUsers: 17800, Churn: 1.5, Retention: 94 },
  { name: 'Jun', NewUsers: 2450, ActiveUsers: 18450, Churn: 1.3, Retention: 96 }
];

const SERVICE_STATS: ServiceAnalytics[] = [
  { name: 'Airtime', revenue: 28400000, transactions: 112000, profit: 2840000, growth: '+12%', successRate: 99.2 },
  { name: 'Data', revenue: 34200000, transactions: 84000, profit: 3420000, growth: '+18%', successRate: 98.8 },
  { name: 'Electricity', revenue: 15800000, transactions: 24800, profit: 4740000, growth: '+25%', successRate: 97.4 },
  { name: 'Cable TV', revenue: 6200000, transactions: 25040, profit: 1420000, growth: '+8%', successRate: 99.1 }
];

const REGIONAL_METRICS: GeographicInsight[] = [
  { region: 'Lagos State', revenue: 45800000, users: 9200, density: 'Critical Density', percentage: 54 },
  { region: 'Abuja FCT', revenue: 16200000, users: 3400, density: 'High Density', percentage: 19 },
  { region: 'Rivers State', revenue: 12400000, users: 2800, density: 'Medium Density', percentage: 15 },
  { region: 'Kano State', revenue: 10200000, users: 3050, density: 'Medium Density', percentage: 12 }
];

const INITIAL_REPORTS: Report[] = [
  { id: 'RPT-001', name: 'Q2 Financial Summary', createdDate: '2026-06-15', createdBy: 'Michael Anazodo', lastUpdated: '2h ago', type: 'Revenue' },
  { id: 'RPT-002', name: 'Service Success Rates Log', createdDate: '2026-06-18', createdBy: 'Aliyu Bello', lastUpdated: '1d ago', type: 'Service' },
  { id: 'RPT-003', name: 'User Retention Funnel', createdDate: '2026-06-19', createdBy: 'System Engine', lastUpdated: '5h ago', type: 'Growth' }
];

const FORECAST_TRENDS: ForecastData[] = [
  { name: 'Jun', actual: 84600000, projected: 84000000 },
  { name: 'Jul', actual: 0, projected: 89500000 },
  { name: 'Aug', actual: 0, projected: 94000000 },
  { name: 'Sep', actual: 0, projected: 99800000 },
  { name: 'Oct', actual: 0, projected: 106000000 }
];

const SYSTEM_ALERTS: SystemAlert[] = [
  { id: 'ALT-401', title: 'High Failures Check', description: 'Ikeja Electricity Gateway experiencing 12% token dispatch error rate.', severity: 'High', timestamp: '10m ago' },
  { id: 'ALT-402', title: 'Revenue Drop Alert', description: 'Cable TV transactions dropped by 15% between 2:00 PM and 4:00 PM.', severity: 'Medium', timestamp: '1h ago' },
  { id: 'ALT-403', title: 'Traffic Spike Flag', description: 'Rapid session creation triggers detected from corporate network hubs.', severity: 'Low', timestamp: '3h ago' }
];

const ACTIVITY_TIMELINE: ActivityLog[] = [
  { id: 'ACT-301', event: 'Analytics Exported: SWT_ANALYTICS_Q2.pdf', timestamp: '1h ago' },
  { id: 'ACT-302', event: 'Report Generated: Service Success Rates Log', timestamp: '4h ago' },
  { id: 'ACT-303', event: 'Revenue Milestone: Platform crossed ₦80M Monthly Vol.', timestamp: '1d ago' }
];

export default function AdminAnalytics() {
  // ─── STATE MANAGEMENT ──────────────────────────────────────────────────────
  const [overviewKPIs, setOverviewKPIs] = useState<AnalyticsOverview[]>(INITIAL_OVERVIEW);
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [alerts, setAlerts] = useState<SystemAlert[]>(SYSTEM_ALERTS);
  const [timelineLogs, setTimelineLogs] = useState<ActivityLog[]>(ACTIVITY_TIMELINE);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Time scope switches
  const [revenueTimeScope, setRevenueTimeScope] = useState<'monthly' | 'weekly'>('monthly');

  // Advanced filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRangeFilter, setTimeRangeFilter] = useState('30 Days');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [segmentFilter, setSegmentFilter] = useState('All');
  const [deviceFilter, setDeviceFilter] = useState('All');

  // Active filter states
  const [_, setAppliedSearch] = useState('');
  const [, setAppliedTimeRange] = useState('30 Days');
  const [, setAppliedService] = useState('All');
  const [, setAppliedSegment] = useState('All');
  const [, setAppliedDevice] = useState('All');

  // Custom Report Form States
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportFormName, setReportFormName] = useState('');
  const [reportFormType, setReportFormType] = useState<Report['type']>('Revenue');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApplyFilters = () => {
    setAppliedSearch(searchQuery);
    setAppliedTimeRange(timeRangeFilter);
    setAppliedService(serviceFilter);
    setAppliedSegment(segmentFilter);
    setAppliedDevice(deviceFilter);
    triggerToast('Analytics query filters applied.');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setTimeRangeFilter('30 Days');
    setServiceFilter('All');
    setSegmentFilter('All');
    setDeviceFilter('All');

    setAppliedSearch('');
    setAppliedTimeRange('30 Days');
    setAppliedService('All');
    setAppliedSegment('All');
    setAppliedDevice('All');
    triggerToast('Analytics filters reset.');
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setOverviewKPIs(INITIAL_OVERVIEW);
      setReports(INITIAL_REPORTS);
      setAlerts(SYSTEM_ALERTS);
      setTimelineLogs(ACTIVITY_TIMELINE);
      setLoading(false);
      triggerToast('Analytics datasets synchronized.');
    }, 800);
  };

  // Report creation
  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportFormName) {
      triggerToast('Please provide a report title.');
      return;
    }
    const newReport: Report = {
      id: `RPT-00${reports.length + 1}`,
      name: reportFormName,
      createdDate: new Date().toISOString().split('T')[0],
      createdBy: 'Michael Anazodo',
      lastUpdated: 'Just now',
      type: reportFormType
    };
    setReports(prev => [newReport, ...prev]);
    setShowReportModal(false);
    setReportFormName('');
    triggerToast(`Report "${reportFormName}" successfully compiled and queued.`);

    const newLog: ActivityLog = {
      id: `ACT-${Math.floor(100 + Math.random() * 900)}`,
      event: `Report Generated: ${reportFormName}`,
      timestamp: 'Just now'
    };
    setTimelineLogs(prev => [newLog, ...prev]);
  };

  const handleDeleteReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    triggerToast(`Report log file removed.`);
  };

  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    triggerToast(`System alert dismissed.`);
  };

  const activeRevenueData = useMemo(() => {
    return revenueTimeScope === 'weekly' ? REVENUE_DATA_WEEKLY : REVENUE_DATA_MONTHLY;
  }, [revenueTimeScope]);

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
            <span className="text-xs font-semibold text-text-white font-heading">Reconciling analytical parameters...</span>
          </div>
        </div>
      )}

      {/* Page Content Shell */}
      <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-text-white font-heading tracking-tight">
              Analytics
            </h1>
            <p className="text-xs text-text-muted mt-1">
              Track growth, revenue, operational performance, and business insights across VtuNova.
            </p>
          </div>
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={() => triggerToast('Compiling analytical indices for export... pdf generated.')}
              className="flex items-center gap-2 text-xs font-semibold text-text-white bg-bg-card border border-border hover:border-border-hover hover:bg-bg-card-hover px-4 py-2.5 rounded-xl transition-all duration-200"
            >
              <ArrowDownTrayIcon className="w-4 h-4 text-text-muted" />
              Export Analytics
            </button>
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover px-4 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(59,130,246,0.3)] transition-all duration-200"
            >
              <PlusIcon className="w-4 h-4" />
              Generate Report
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

        {/* 8 KPI overview Analytics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-8 gap-3.5">
          {overviewKPIs.map(kpi => (
            <div key={kpi.id} className="bg-bg-card border border-border rounded-2xl p-4.5 space-y-1.5 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block truncate">{kpi.label}</span>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-extrabold text-text-white font-heading truncate">{kpi.value}</span>
                <span className={`text-[9px] font-bold ${
                  kpi.change.startsWith('+') ? 'text-emerald-400' : 'text-text-muted'
                }`}>
                  {kpi.change}
                </span>
              </div>
              <div className="h-4.5 pt-1">
                <svg className="w-full h-full text-primary opacity-50 group-hover:opacity-80 transition" viewBox="0 0 100 30" fill="none">
                  <path
                    d={kpi.sparkline.map((pt, idx) => `${idx === 0 ? 'M' : 'L'}${pt.x * 14},${30 - pt.y}`).join(' ')}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Controls Toolbar */}
        <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex flex-col lg:flex-row items-center gap-3">
            {/* Global Search */}
            <div className="relative w-full lg:flex-1">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search by metric label, service type, report title, user segment..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-11 pr-4 py-3 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden focus:border-primary transition-colors placeholder:text-text-muted"
              />
            </div>
            {/* Action buttons */}
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
                onClick={() => triggerToast('Aggregate analytics metrics exported to CSV.')}
                className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-3 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Export CSV
              </button>
              <button
                onClick={() => triggerToast('Analytical charts and datasets printed to PDF.')}
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              {/* Time Range */}
              <div>
                <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Time Range</label>
                <select
                  value={timeRangeFilter}
                  onChange={e => setTimeRangeFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="Today">Today</option>
                  <option value="7 Days">7 Days</option>
                  <option value="30 Days">30 Days</option>
                  <option value="90 Days">90 Days</option>
                  <option value="12 Months">12 Months</option>
                </select>
              </div>

              {/* Services */}
              <div>
                <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Services</label>
                <select
                  value={serviceFilter}
                  onChange={e => setServiceFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Services</option>
                  <option value="Airtime">Airtime</option>
                  <option value="Data">Data</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Cable TV">Cable TV</option>
                  <option value="Wallet">Wallet Funding</option>
                </select>
              </div>

              {/* User Segment */}
              <div>
                <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">User Segment</label>
                <select
                  value={segmentFilter}
                  onChange={e => setSegmentFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Users</option>
                  <option value="VIP">VIP Users</option>
                  <option value="Agents">Agents & Merchants</option>
                  <option value="New">New Registrations</option>
                </select>
              </div>

              {/* Device Type */}
              <div>
                <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Device Type</label>
                <select
                  value={deviceFilter}
                  onChange={e => setDeviceFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Devices</option>
                  <option value="Mobile">Mobile Apps (Android/iOS)</option>
                  <option value="Desktop">Web Browser</option>
                  <option value="API">Developer API Gateway</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Dashboard */}
        <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/50 pb-3">
            <div>
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Revenue, Profit & Expense Trends</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Comprehensive tracking of business margins comparing gross values</p>
            </div>
            <div className="flex bg-bg-dark border border-border p-1 rounded-xl shrink-0 self-start sm:self-auto">
              <button
                onClick={() => setRevenueTimeScope('monthly')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition ${
                  revenueTimeScope === 'monthly' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-white'
                }`}
              >
                Monthly Trend
              </button>
              <button
                onClick={() => setRevenueTimeScope('weekly')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition ${
                  revenueTimeScope === 'weekly' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-white'
                }`}
              >
                Weekly Trend
              </button>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="Revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} name="Gross Revenue" />
                <Area type="monotone" dataKey="Profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2} name="Platform Profit" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaction vs User Growth Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transaction Performance */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Transaction Analytics</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Aggregate transaction volume logs and gateway processing latencies</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TRANSACTION_PERFORMANCE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#100f1c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '11px' }}
                  />
                  <Bar dataKey="Volume" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Transaction Vol" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-3.5 pt-3.5 border-t border-border/50 text-center text-xs">
              <div>
                <span className="text-text-muted block text-[10px]">Avg Order Value</span>
                <span className="font-bold text-text-white">₦368</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px]">Avg Success Rate</span>
                <span className="font-bold text-emerald-400">98.5%</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px]">Processing Latency</span>
                <span className="font-bold text-cyan-400">1.3s</span>
              </div>
            </div>
          </div>

          {/* User Growth curve */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">User Acquisition & Activity</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Acquisition curves showing active versus churn rate statistics</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={USER_ANALYTICS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#100f1c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '11px' }}
                  />
                  <Line type="monotone" dataKey="ActiveUsers" stroke="#06b6d4" strokeWidth={2.5} name="Active Users" dot={false} />
                  <Line type="monotone" dataKey="NewUsers" stroke="#3b82f6" strokeWidth={2} name="New Users" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-3.5 pt-3.5 border-t border-border/50 text-center text-xs">
              <div>
                <span className="text-text-muted block text-[10px]">Avg Retention</span>
                <span className="font-bold text-emerald-400">94.3%</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px]">Session Duration</span>
                <span className="font-bold text-text-white">4.2 min</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px]">Churn Rate</span>
                <span className="font-bold text-red-400">1.4%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Service Performance Section */}
        <div className="space-y-4">
          <div>
            <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Service Performance Breakdown</h3>
            <p className="text-[10px] text-text-muted mt-0.5">Comparison metrics between utility channels (Airtime, Data, Power)</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {SERVICE_STATS.map(stat => (
              <div key={stat.name} className="bg-bg-card border border-border rounded-2xl p-4.5 space-y-4 hover:border-primary/20 transition group">
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <span className="font-extrabold text-text-white group-hover:text-primary transition">{stat.name}</span>
                  <span className="font-bold text-emerald-400 text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded">{stat.growth}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Revenue</span>
                    <span className="font-bold text-text-white">₦{stat.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Transactions</span>
                    <span className="font-bold text-text-white">{stat.transactions.toLocaleString()} txs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Success Rate</span>
                    <span className="font-semibold text-emerald-400">{stat.successRate}%</span>
                  </div>
                  <div className="flex justify-between border-t border-border/50 pt-2 text-[11px]">
                    <span className="text-text-white font-bold">Profit Contribution</span>
                    <span className="font-bold text-text-white">₦{stat.profit.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Insights, Geographic Density & Customer Insights split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Financial Insights */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="border-b border-border/50 pb-3">
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Executive Financial Insights</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Advanced finance matrices and profit contributions</p>
            </div>
            <div className="space-y-3.5 text-xs pt-1.5">
              {[
                { label: 'Gross Revenue', value: '₦84,600,000', change: '+16%' },
                { label: 'Net Revenue', value: '₦72,180,000', change: '+14%' },
                { label: 'Profit Margin', value: '14.6%', change: 'Stable' },
                { label: 'Operational Costs', value: '₦4,200,000', change: '+2%' },
                { label: 'Customer Lifetime Value', value: '₦42,500', change: '+8%' }
              ].map(fin => (
                <div key={fin.label} className="flex items-center justify-between bg-bg-dark-secondary/35 border border-border rounded-xl p-2.5">
                  <span className="text-text-muted font-bold text-[10px] uppercase">{fin.label}</span>
                  <div className="text-right">
                    <span className="font-bold text-text-white block">{fin.value}</span>
                    <span className="text-[9px] text-emerald-400 font-semibold">{fin.change} limit</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional user distribution */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="border-b border-border/50 pb-3">
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Geographic Insights</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Regional acquisition density and transaction weights</p>
            </div>
            <div className="space-y-3 pt-1 text-xs">
              {REGIONAL_METRICS.map(reg => (
                <div key={reg.region} className="space-y-1.5 bg-bg-dark-secondary/20 border border-border rounded-xl p-2.5 hover:border-primary/10 transition">
                  <div className="flex justify-between items-center text-[10px] font-bold text-text-white">
                    <span>{reg.region}</span>
                    <span>₦{reg.revenue.toLocaleString()} ({reg.percentage}%)</span>
                  </div>
                  <div className="w-full h-1 bg-bg-dark rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400" style={{ width: `${reg.percentage}%` }} />
                  </div>
                  <div className="flex justify-between text-[9px] text-text-muted">
                    <span>Active Users: {reg.users.toLocaleString()}</span>
                    <span>{reg.density}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer insights */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="border-b border-border/50 pb-3">
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Customer Segmentation</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Engagement indexes and purchase cycles</p>
            </div>
            <div className="space-y-3.5 text-xs pt-1.5">
              {[
                { name: 'High Value Users (Merchants)', count: '2,480 clients', engagement: '98% activity', score: 'Highly Retained' },
                { name: 'General Consumers', count: '14,200 clients', engagement: '65% activity', score: 'Moderate Activity' },
                { name: 'VIP Subscribers', count: '1,770 clients', engagement: '88% activity', score: 'Growing Segment' }
              ].map(seg => (
                <div key={seg.name} className="bg-bg-dark-secondary/35 border border-border rounded-xl p-3 space-y-1.5">
                  <span className="font-bold text-text-white block">{seg.name}</span>
                  <div className="flex justify-between text-[10px] text-text-muted">
                    <span>{seg.count}</span>
                    <span>{seg.engagement}</span>
                  </div>
                  <div className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/15 w-fit">
                    {seg.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Operational Health availability vs Forecasting */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Operational Availability checks */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-1.5">
                <CpuChipIcon className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Operational System Health</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                Operational
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { server: 'Developer API Gateway', uptime: '99.98%', latency: '82ms', status: 'Healthy' },
                { server: 'DisCo Integration Links', uptime: '97.45%', latency: '240ms', status: 'Warning' },
                { server: 'Telecom Airtime APIs', uptime: '99.90%', latency: '120ms', status: 'Healthy' },
                { server: 'Platform Core Services', uptime: '100.00%', latency: '45ms', status: 'Healthy' }
              ].map(srv => (
                <div key={srv.server} className="flex justify-between items-center bg-bg-dark-secondary/35 border border-border rounded-xl p-2.5">
                  <div>
                    <span className="font-bold text-text-white block">{srv.server}</span>
                    <span className="text-[9px] text-text-muted block mt-0.5">Uptime: {srv.uptime} • Latency: {srv.latency}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${
                    srv.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {srv.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Forecasting Trends Area Chart */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Projections & Forecasting</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Projected revenue indexes using dynamic business metrics</p>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={FORECAST_TRENDS} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#100f1c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '11px' }}
                  />
                  <Line type="monotone" dataKey="projected" stroke="#eab308" strokeWidth={2} name="Projected Revenue" activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center text-[10px] text-text-muted font-bold pt-2 border-t border-border">
              <span>Expected Growth: +24.5%</span>
              <span>Projected Q3 Vol: ₦106M</span>
            </div>
          </div>

          {/* Alerts Center Insight Alert Cards */}
          <div className="bg-bg-card border border-red-500/20 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-1.5 border-b border-border/50 pb-3 mb-2">
              <ShieldExclamationIcon className="w-5 h-5 text-red-400" />
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Insight Alerts Center</h3>
            </div>
            <div className="space-y-3 text-xs max-h-56 overflow-y-auto pr-1">
              {alerts.map(alert => (
                <div key={alert.id} className="bg-bg-dark-secondary/35 border border-border rounded-xl p-3 space-y-1.5 relative group hover:border-red-500/30 transition">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-text-white block">{alert.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold ${
                      alert.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-muted leading-relaxed pr-6">{alert.description}</p>
                  <button
                    onClick={() => handleDismissAlert(alert.id)}
                    className="absolute right-2.5 top-2 text-[9px] font-bold text-text-muted hover:text-text-white transition opacity-0 group-hover:opacity-100"
                    title="Dismiss alert"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Executive summary & Saved reports ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Executive summary AI */}
          <div className="lg:col-span-2 bg-bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="border-b border-border/50 pb-3">
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">AI Executive Summary Insights</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Automated insights based on active weekly business indexes</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs pt-1.5">
              {[
                { label: 'Weekly Revenue Growth', desc: 'Revenue increased by 16% month-over-month. Performance correlates with the VIP Referral campaign.', positive: true },
                { label: 'Utility Revenue Velocity', desc: 'Electricity revenue grew fastest, recording a 25% volume expansion compared to Airtime channels.', positive: true },
                { label: 'User Retention Improvement', desc: 'Client churn rate decreased by 0.3%, driving the active retention index to an all-time high of 96.0%.', positive: true },
                { label: 'Wallet Payout Volume', desc: 'Funding totals crossed ₦52,000,000, illustrating high confidence in platform wallet infrastructure.', positive: true }
              ].map(summary => (
                <div key={summary.label} className="bg-bg-dark-secondary/25 border border-border rounded-xl p-3.5 space-y-1.5 hover:border-primary/10 transition">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-extrabold text-text-white block">{summary.label}</span>
                  </div>
                  <p className="text-[10px] text-text-muted leading-relaxed">{summary.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Reports Ledger */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-2">
                <div className="flex items-center gap-1.5">
                  <DocumentTextIcon className="w-5 h-5 text-primary" />
                  <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Saved Reports Center</h3>
                </div>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="text-[10px] font-bold text-primary hover:underline"
                >
                  Create Custom
                </button>
              </div>

              <div className="space-y-3.5 text-xs pt-1">
                {reports.map(rpt => (
                  <div key={rpt.id} className="bg-bg-dark-secondary/50 border border-border rounded-xl p-3.5 flex justify-between items-center hover:border-primary/20 transition">
                    <div>
                      <span className="font-bold text-text-white block">{rpt.name}</span>
                      <span className="text-[9px] text-text-muted block mt-0.5">Updated {rpt.lastUpdated} • By {rpt.createdBy}</span>
                    </div>
                    <div className="flex gap-2 shrink-0 ml-2">
                      <button
                        onClick={() => triggerToast(`Downloading report document ${rpt.name}...`)}
                        className="p-1 px-2 rounded bg-primary hover:bg-primary-hover text-white text-[9px] font-bold transition"
                      >
                        Get
                      </button>
                      <button
                        onClick={() => handleDeleteReport(rpt.id)}
                        className="p-1 px-2 rounded border border-border hover:bg-bg-dark text-text-muted hover:text-text-white text-[9px] font-semibold transition"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Activity timeline list */}
        <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="border-b border-border/50 pb-3">
            <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Analytical Event Timeline</h3>
            <p className="text-[10px] text-text-muted mt-0.5">Recent system log activities and milestones</p>
          </div>
          <div className="space-y-3.5 text-xs pl-2.5">
            {timelineLogs.map(log => (
              <div key={log.id} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded bg-primary/10 border border-primary/15 text-primary flex items-center justify-center font-bold text-[9px] shrink-0">
                  ✓
                </span>
                <div>
                  <span className="font-semibold text-text-white block">{log.event}</span>
                  <span className="text-[9px] text-text-muted block mt-0.5">Logged: {log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Generate custom report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-xs">
          <div onClick={() => setShowReportModal(false)} className="absolute inset-0 bg-bg-dark/60 backdrop-blur-xs animate-fade-in" />
          <form
            onSubmit={handleGenerateReport}
            className="relative bg-bg-card border border-border w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl p-5 space-y-4 animate-scale-in"
          >
            <div>
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Compile Custom Analytics Report</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Define compilation parameters for saved logs</p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-text-muted uppercase">Report Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Growth Forecasting"
                  value={reportFormName}
                  onChange={e => setReportFormName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-text-muted uppercase">Report Category</label>
                <select
                  value={reportFormType}
                  onChange={e => setReportFormType(e.target.value as any)}
                  className="w-full text-xs px-2.5 py-2 bg-bg-dark border border-border rounded-lg text-text-white focus:outline-hidden"
                >
                  <option value="Revenue">Revenue Indices</option>
                  <option value="Transaction">Transactions Logs</option>
                  <option value="Growth">Acquisition and Growth</option>
                  <option value="Service">Services Performance</option>
                  <option value="Custom">Custom parameters</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="text-[11px] font-bold text-text-muted hover:text-text-white px-3 py-1.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-white px-4.5 py-2.5 rounded-xl text-xs font-bold transition shadow-xs"
              >
                Compile Report
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
