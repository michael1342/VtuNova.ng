import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// ─── Network Data ─────────────────────────────────────────────────────────────

const networks = [
  { id: 'mtn', name: 'MTN', color: '#f59e0b', bg: 'bg-amber-500/15', text: 'text-amber-400' },
  { id: 'airtel', name: 'Airtel', color: '#ef4444', bg: 'bg-red-500/15', text: 'text-red-400' },
  { id: 'glo', name: 'Glo', color: '#10b981', bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  { id: '9mobile', name: '9mobile', color: '#3b82f6', bg: 'bg-blue-500/15', text: 'text-blue-400' },
];

const presetAmounts = [200, 500, 1000, 2000, 5000];

const beneficiaries = [
  { name: 'Mum', number: '0803 ••• 4321', network: 'mtn' },
  { name: 'John D.', number: '0810 ••• 8642', network: 'airtel' },
  { name: 'Self', number: '0901 ••• 1195', network: 'glo' },
];

// ─── Network Icon ─────────────────────────────────────────────────────────────



const NetworkIcon = ({ networkId, size = 'md' }: { networkId: string; size?: 'sm' | 'md' }) => {
  const map: Record<string, string> = {
    mtn: 'MTN',
    airtel: 'AIR',
    glo: 'GLO',
    '9mobile': '9M',
  };
  const sizeClass = size === 'sm' ? 'w-6 h-6 text-[9px]' : 'w-9 h-9 text-xs';
  const net = networks.find((n) => n.id === networkId);
  return (
    <div
      className={`${sizeClass} rounded-lg flex items-center justify-center font-bold shrink-0`}
      style={{ background: net ? `${net.color}22` : '#3b82f622', color: net?.color ?? '#3b82f6' }}
    >
      {map[networkId] ?? '?'}
    </div>
  );
};

// ─── Buy Airtime Page ─────────────────────────────────────────────────────────

const BuyAirtime = () => {
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showNetworkMenu, setShowNetworkMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const activeAmount = selectedAmount ?? (customAmount ? Number(customAmount) : 0);

  const currentNetwork = networks.find((n) => n.id === selectedNetwork);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNetwork || !phone || activeAmount <= 0) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3500);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-dark-secondary overflow-y-auto">

      {/* ── Main Content ── */}
      <main className="flex-1 p-6 space-y-5 max-w-3xl mx-auto w-full">

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-text-white text-xl font-bold font-['Space_Grotesk']">Buy Airtime</h2>
            <p className="text-xs text-text-muted mt-0.5">Top up any mobile line instantly with secure checkout.</p>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Secure Checkout
          </span>
        </div>

        {/* Success Banner */}
        {success && (
          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 animate-[fadeIn_.3s_ease]">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" className="w-4 h-4">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-emerald-400">Airtime Purchased Successfully!</div>
              <div className="text-xs text-text-muted mt-0.5">₦{activeAmount.toLocaleString()} airtime has been sent to {phone || 'your number'}.</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ── Card: Purchase Form ── */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Quick Airtime Purchase</h3>
                <p className="text-xs text-text-muted mt-0.5">Send airtime to any network in seconds.</p>
              </div>
            </div>

            {/* Network Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-text-gray">Network Provider</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {networks.map((net) => (
                  <button
                    key={net.id}
                    type="button"
                    onClick={() => setSelectedNetwork(net.id)}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-all duration-200 group ${
                      selectedNetwork === net.id
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                        : 'border-border bg-bg-dark-secondary hover:border-border-hover hover:bg-bg-card-hover'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-transform duration-200 group-hover:scale-110 ${net.bg} ${net.text}`}
                    >
                      {net.name.substring(0, 3).toUpperCase()}
                    </div>
                    <span className={`text-xs font-medium transition-colors ${selectedNetwork === net.id ? 'text-text-white' : 'text-text-gray'}`}>
                      {net.name}
                    </span>
                    {selectedNetwork === net.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-text-gray">Phone Number</label>
              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
                >
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.5 11.5a19.79 19.79 0 01-3.07-8.67A2 2 0 013.41 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.37a16 16 0 006.72 6.72l1.74-1.74a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                <input
                  type="tel"
                  id="airtime-phone"
                  placeholder="0801 234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-dark-secondary border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                />
                {currentNetwork && phone && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    <NetworkIcon networkId={selectedNetwork} size="sm" />
                  </div>
                )}
              </div>
            </div>

            {/* Preset Amounts */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-text-gray">Select Amount</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleAmountSelect(amt)}
                    className={`py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                      selectedAmount === amt
                        ? 'bg-primary border-primary text-white shadow-[0_4px_16px_rgba(59,130,246,0.35)]'
                        : 'bg-bg-dark-secondary border-border text-text-gray hover:border-border-hover hover:text-text-white hover:bg-bg-card-hover'
                    }`}
                  >
                    ₦{amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-text-gray">Custom Amount</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted select-none">₦</span>
                <input
                  type="number"
                  id="airtime-custom-amount"
                  placeholder="Enter amount"
                  min={50}
                  max={50000}
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-bg-dark-secondary border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          </div>

          {/* ── Card: Saved Beneficiaries ── */}
          <div className="bg-bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Saved Beneficiaries</h3>
                <p className="text-xs text-text-muted mt-0.5">Quick-select a saved number.</p>
              </div>
              <button
                type="button"
                className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary-hover transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                  <path d="M12 5v14M5 12l7-7 7 7" />
                </svg>
                Manage
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {beneficiaries.map((b) => (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => setPhone(b.number.replace(/\s|•/g, ''))}
                  className="shrink-0 flex flex-col items-center gap-1.5 bg-bg-dark-secondary border border-border rounded-xl p-3 w-20 hover:border-border-hover hover:bg-bg-card-hover transition-all duration-200 group"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-600/30 border border-border flex items-center justify-center text-text-white font-bold text-sm group-hover:scale-110 transition-transform duration-200">
                    {b.name[0]}
                  </div>
                  <span className="text-[11px] font-medium text-text-white truncate w-full text-center">{b.name}</span>
                  <NetworkIcon networkId={b.network} size="sm" />
                </button>
              ))}
              <button
                type="button"
                className="shrink-0 flex flex-col items-center justify-center gap-1.5 bg-bg-dark-secondary border border-dashed border-border rounded-xl p-3 w-20 hover:border-border-hover hover:bg-bg-card-hover transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-full border-2 border-dashed border-border flex items-center justify-center text-text-muted">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
                <span className="text-[11px] text-text-muted">Add New</span>
              </button>
            </div>
          </div>

          {/* ── Card: Order Summary ── */}
          {activeAmount > 0 && (
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-3">
              <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk'] pb-3 border-b border-border">Order Summary</h3>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Airtime Amount</span>
                  <span className="text-text-white font-medium">₦{activeAmount.toLocaleString()}</span>
                </div>

                {selectedNetwork && (
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Network</span>
                    <div className="flex items-center gap-1.5">
                      <NetworkIcon networkId={selectedNetwork} size="sm" />
                      <span className="text-text-white font-medium capitalize">{currentNetwork?.name}</span>
                    </div>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Recipient</span>
                    <span className="text-text-white font-medium">{phone}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-border">
                <div className="text-xs text-text-muted mb-0.5">Estimated Total</div>
                <div className="text-2xl font-bold text-text-white font-['Space_Grotesk']">₦{activeAmount.toLocaleString()}.00</div>
              </div>

              <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-3 py-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" className="w-3.5 h-3.5 shrink-0">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Protected by encrypted payment processing and instant delivery confirmation.
                </p>
              </div>
            </div>
          )}

          {/* ── Action Buttons ── */}
          <div className="flex flex-col sm:flex-row gap-3 pb-2">
            <button
              type="submit"
              disabled={loading || !selectedNetwork || !phone || activeAmount <= 0}
              id="buy-airtime-submit"
              className="w-full sm:flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary to-blue-500 text-white font-semibold text-sm shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_6px_30px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.5 11.5a19.79 19.79 0 01-3.07-8.67A2 2 0 013.41 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.37a16 16 0 006.72 6.72l1.74-1.74a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  Buy Airtime
                </>
              )}
            </button>

            <button
              type="button"
              id="save-beneficiary"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-border bg-bg-card text-text-white text-sm font-semibold hover:bg-bg-card-hover hover:border-border-hover transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
              Save Beneficiary
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default BuyAirtime;
