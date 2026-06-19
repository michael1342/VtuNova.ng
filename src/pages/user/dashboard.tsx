import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const monthlyData = [
  { month: 'Jan', value: 320 },
  { month: 'Feb', value: 280 },
  { month: 'Mar', value: 450 },
  { month: 'Apr', value: 390 },
  { month: 'May', value: 520 },
  { month: 'Jun', value: 480 },
  { month: 'Jul', value: 620 },
  { month: 'Aug', value: 700 },
  { month: 'Sep', value: 650 },
];

const serviceData = [
  { name: 'Airtime', value: 42, color: '#3b82f6' },
  { name: 'Data', value: 28, color: '#10b981' },
  { name: 'Electricity', value: 18, color: '#f59e0b' },
  { name: 'Cable TV', value: 12, color: '#a855f7' },
];

const transactions = [
  { id: '#TX-98031', service: 'Airtime', recipient: '0803••4321', amount: '₦2,000', status: 'Success', date: 'Jun' },
  { id: '#TX-98232', service: 'Data Bundle', recipient: '0810••8642', amount: '₦3,500', status: 'Success', date: 'Jun' },
  { id: '#TX-98086', service: 'Electricity', recipient: 'Meter 4471', amount: '₦5,000', status: 'Pending', date: 'Jun' },
  { id: '#TX-98027', service: 'Cable TV', recipient: 'DSTV 2290', amount: '₦9,500', status: 'Success', date: 'Jun' },
  { id: '#TX-98027', service: 'Airtime', recipient: '2705••1195', amount: '₦1,000', status: 'Failed', date: 'Jun' },
];

const notifications = [
  {
    type: 'success',
    title: 'Purchase Successful',
    desc: '₦2,000 airtime delivered •',
    time: '2 hrs ago',
  },
  {
    type: 'info',
    title: 'Wallet Credited',
    desc: '₦10,000 added • 1 hr ago',
    time: '1 hr ago',
  },
  {
    type: 'warning',
    title: '₦50 Cashback',
    desc: 'Data bundle cashback • 3 hr ago',
    time: '3 hr ago',
  },
  {
    type: 'info',
    title: 'System Update',
    desc: 'New features available • 4d ago',
    time: '4d ago',
  },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
  iconBg: string;
}

const StatCard = ({ label, value, change, positive, icon, iconBg }: StatCardProps) => (
  <div className="bg-bg-card border border-border rounded-xl p-4 flex flex-col gap-3 hover:border-border-hover transition-all duration-200">
    <div className="flex items-center justify-between">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
      <span
        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${positive ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}
      >
        {change}
      </span>
    </div>
    <div>
      <div className="text-xs text-text-muted mb-0.5">{label}</div>
      <div className="text-xl font-bold text-text-white font-['Space_Grotesk']">{value}</div>
    </div>
  </div>
);

// ─── Quick Action Button ──────────────────────────────────────────────────────

interface QuickActionProps {
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  to: string;
}

const QuickAction = ({ label, icon, iconBg, to }: QuickActionProps) => (
  <Link
    to={to}
    className="flex flex-col items-center gap-2.5 bg-bg-card border border-border rounded-xl p-4 hover:border-border-hover hover:bg-bg-card-hover transition-all duration-200 group w-full"
  >
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg} group-hover:scale-110 transition-transform duration-200`}>
      {icon}
    </div>
    <span className="text-xs text-text-gray group-hover:text-text-white transition-colors">{label}</span>
  </Link>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    Success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    Pending: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Failed: 'text-red-400 bg-red-500/10 border-red-500/20',
  };
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${map[status] ?? 'text-text-muted bg-zinc-500/10'}`}>
      {status}
    </span>
  );
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-dark-secondary border border-border rounded-lg px-3 py-2 text-xs text-text-white shadow-xl">
        <div className="text-text-muted mb-0.5">{label}</div>
        <div className="font-bold">{payload[0].value} transactions</div>
      </div>
    );
  }
  return null;
};

// ─── Dashboard Page ───────────────────────────────────────────────────────────

const Dashboard = () => {
  const { currentUser } = useAuth() as {currentUser: {firstName: string, lastName: string, role: string, email: string}}

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-dark-secondary overflow-y-auto">

      {/* ── Main Content ── */}
      <main className="flex-1 p-6 space-y-5">

        {/* Welcome Banner */}
        <div className="relative bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20 rounded-2xl p-5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-text-white text-xl font-bold font-['Space_Grotesk'] flex flex-wrap items-center gap-2">
                Welcome Back, {currentUser?.firstName || 'User'} 👋
                <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
                  Verified
                </span>
              </h2>
              <p className="text-text-gray text-sm mt-1">Manage your wallet, airtime purchases, data subscriptions, and bill payments from one place.</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-text-muted">
                <span className="flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  June 12, 2025
                </span>
                <span className="flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                  </svg>
                  Last login: Today, 09:42 AM
                </span>
              </div>
            </div>
            <Link to="/user/fund" className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M12 5v14M5 12l7-7 7 7" />
              </svg>
              Fund Wallet
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Wallet Balance"
            value="₦150,000.00"
            change="+12.4%"
            positive={true}
            iconBg="bg-blue-500/15"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" className="w-4 h-4">
                <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
              </svg>
            }
          />
          <StatCard
            label="Total Transactions"
            value="1,284"
            change="+8.1%"
            positive={true}
            iconBg="bg-purple-500/15"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" className="w-4 h-4">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
            }
          />
          <StatCard
            label="Successful Purchases"
            value="1,198"
            change="+5.3%"
            positive={true}
            iconBg="bg-emerald-500/15"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" className="w-4 h-4">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            }
          />
          <StatCard
            label="Referral Earnings"
            value="₦25,500"
            change="-8.6%"
            positive={false}
            iconBg="bg-pink-500/15"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" className="w-4 h-4">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            }
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-bg-card border border-border rounded-2xl p-5">
          <div className="mb-4">
            <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Quick Actions</h3>
            <p className="text-xs text-text-muted mt-0.5">One-click navigation</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <QuickAction
              label="Buy Airtime"
              iconBg="bg-blue-500/15"
              to="/user/buy/airtime"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" className="w-5 h-5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.5 11.5a19.79 19.79 0 01-3.07-8.67A2 2 0 013.41 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.37a16 16 0 006.72 6.72l1.74-1.74a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
              }
            />
           
            <QuickAction
              label="Buy Data"
              iconBg="bg-emerald-500/15"
              to="/user/buy/data"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" className="w-5 h-5">
                  <path d="M1.42 9a16 16 0 0121.16 0M5 12.55a11 11 0 0114.08 0M10.54 16.1a6 6 0 012.92 0M12 20h.01" />
                </svg>
              }
            />
            <QuickAction
              label="Pay Electricity"
              iconBg="bg-amber-500/15"
              to="/user/buy/electricity"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" className="w-5 h-5">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              }
            />
            <QuickAction
              label="Subscribe TV"
              iconBg="bg-purple-500/15"
              to="/user/buy/cable"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" className="w-5 h-5">
                  <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 3l-4 4-4-4" />
                </svg>
              }
            />
            <QuickAction
              label="Fund Wallet"
              iconBg="bg-pink-500/15"
              to="/user/fund"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" className="w-5 h-5">
                  <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
                </svg>
              }
            />
          </div>
        </div>

        {/* Charts Row */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Monthly Transactions Chart */}
          <div className="lg:col-span-3 bg-bg-card border border-border rounded-2xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Monthly Transactions</h3>
                <p className="text-xs text-text-muted mt-0.5">Transaction volume over time</p>
              </div>
              <div className="flex items-center gap-1.5 bg-bg-dark-secondary border border-border rounded-lg px-2.5 py-1.5 text-xs text-text-gray">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                2025
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="txGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#txGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#3b82f6', stroke: '#1d4ed8', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Service Usage Donut */}
          <div className="lg:col-span-2 bg-bg-card border border-border rounded-2xl p-5 flex flex-col">
            <div className="mb-4">
              <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Service Usage</h3>
              <p className="text-xs text-text-muted mt-0.5">Breakdown by service</p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={76}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value}%`, name]}
                    contentStyle={{ background: 'var(--color-bg-dark-secondary)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }}
                    itemStyle={{ color: 'var(--color-text-white)' }}
                    labelStyle={{ display: 'none' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 w-full">
                {serviceData.map((s) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                    <span className="text-xs text-text-gray">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Recent Transactions + Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Recent Transactions */}
          <div className="lg:col-span-3 bg-bg-card border border-border rounded-2xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Recent Transactions</h3>
                <p className="text-xs text-text-muted mt-0.5">Your latest activity</p>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/user/transactions" className="text-xs text-primary hover:text-primary-hover font-semibold transition-colors mr-2">
                  View All
                </Link>
                <button className="flex items-center gap-1.5 text-xs text-text-gray hover:text-text-white bg-bg-dark-secondary border border-border rounded-lg px-2.5 py-1.5 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                  Filter
                </button>
                <button className="flex items-center gap-1.5 text-xs text-text-gray hover:text-text-white bg-bg-dark-secondary border border-border rounded-lg px-2.5 py-1.5 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Export
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    {['Transaction ID', 'Service', 'Recipient', 'Amount', 'Status', 'Date'].map((h) => (
                      <th key={h} className="text-left text-text-muted font-medium py-2 pr-4 last:pr-0 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, i) => (
                    <tr key={i} className="border-b border-border hover:bg-bg-card-hover transition-colors">
                      <td className="py-3 pr-4 text-blue-400 font-mono whitespace-nowrap">{tx.id}</td>
                      <td className="py-3 pr-4 text-text-white whitespace-nowrap">{tx.service}</td>
                      <td className="py-3 pr-4 text-text-gray font-mono whitespace-nowrap">{tx.recipient}</td>
                      <td className="py-3 pr-4 text-text-white font-semibold whitespace-nowrap">{tx.amount}</td>
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="py-3 text-text-muted">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <span className="text-xs text-text-muted">Showing 5 of 1,284</span>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-lg bg-bg-dark-secondary border border-border flex items-center justify-center text-text-gray hover:text-text-white hover:bg-bg-card-hover transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-semibold flex items-center justify-center">1</button>
                <button className="w-7 h-7 rounded-lg bg-bg-dark-secondary border border-border text-text-gray text-xs hover:text-text-white hover:bg-bg-card-hover transition-colors flex items-center justify-center">2</button>
                <button className="w-7 h-7 rounded-lg bg-bg-dark-secondary border border-border flex items-center justify-center text-text-gray hover:text-text-white hover:bg-bg-card-hover transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="lg:col-span-2 bg-bg-card border border-border rounded-2xl p-5 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Notifications</h3>
                <span className="inline-block mt-0.5 text-[10px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                  4 new
                </span>
              </div>
              <Link to="/user/notifications" className="text-xs text-primary hover:text-primary-hover font-semibold transition-colors">
                View All
              </Link>
            </div>

            <div className="space-y-3 flex-1">
              {notifications.map((n, i) => {
                const iconMap: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
                  success: {
                    color: 'text-emerald-400',
                    bg: 'bg-emerald-500/10',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ),
                  },
                  info: {
                    color: 'text-blue-400',
                    bg: 'bg-blue-500/10',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                        <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                      </svg>
                    ),
                  },
                  warning: {
                    color: 'text-amber-400',
                    bg: 'bg-amber-500/10',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><path d="M12 9v4M12 17h.01" />
                      </svg>
                    ),
                  },
                };
                const style = iconMap[n.type] ?? iconMap.info;

                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-bg-dark-secondary border border-border rounded-xl p-3 hover:bg-bg-card-hover transition-colors cursor-pointer"
                  >
                    <div className={`w-7 h-7 rounded-lg ${style.bg} ${style.color} flex items-center justify-center shrink-0 mt-0.5`}>
                      {style.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-text-white">{n.title}</div>
                      <div className="text-[11px] text-text-muted mt-0.5 truncate">{n.desc}</div>
                    </div>
                    <span className="text-[10px] text-text-muted shrink-0">{n.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Floating help button */}
      <Link to="/main/help" className="fixed bottom-6 right-6 w-11 h-11 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all duration-200 hover:scale-110 z-50">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
        </svg>
      </Link>
    </div>
  );
};

export default Dashboard;
