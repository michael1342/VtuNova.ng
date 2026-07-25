import React, { useState, useEffect } from 'react';

const networks = [
  { id: 'mtn', name: 'MTN', color: '#f59e0b', bg: 'bg-amber-500/15', text: 'text-amber-400', desc: 'Everywhere you go' },
  { id: 'airtel', name: 'Airtel', color: '#ef4444', bg: 'bg-red-500/15', text: 'text-red-400', desc: 'The smartphone network' },
  { id: 'glo', name: 'Glo', color: '#10b981', bg: 'bg-emerald-500/15', text: 'text-emerald-400', desc: 'Grandmasters of data' },
  { id: '9mobile', name: '9mobile', color: '#3b82f6', bg: 'bg-blue-500/15', text: 'text-blue-400', desc: 'Here for you' },
];

const presetAmounts = [200, 500, 1000, 2000, 3000, 4000, 5000, 10000];

const beneficiaries = [
  { name: 'Mum', number: '08031234321', network: 'mtn' },
  { name: 'John D.', number: '08109878642', network: 'airtel' },
  { name: 'Self', number: '09012341195', network: 'glo' },
];

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

const BuyAirtime = () => {
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const activeAmount = selectedAmount ?? (customAmount ? Number(customAmount) : 0);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };
  const currentNetwork = networks.find((n) => n.id === selectedNetwork);

  useEffect(() => {
    if (phone.replace(/\D/g, '').length >= 11) {
      setIsVerifying(true);
      setIsVerified(false);
      const timer = setTimeout(() => {
        setIsVerifying(false);
        setIsVerified(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsVerified(false);
      setIsVerifying(false);
    }
  }, [phone]);

  const handleNetworkSelect = (networkId: string) => {
    setSelectedNetwork(networkId);
  };

  const handleReset = () => {
    setSelectedNetwork('');
    setPhone('');
    setSelectedAmount(null);
    setCustomAmount('');
    setIsVerified(false);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNetwork || !phone || activeAmount <= 0 || !isVerified) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setSuccess(true);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-dark-secondary overflow-y-auto">
      {/* ── Main Content ── */}
      <main className="flex-1 p-6 space-y-5 max-w-6xl mx-auto w-full">
        {/* Page Header Checkmarks */}
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-text-muted">
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Instant Activation
          </span>
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Secure Transactions
          </span>
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            All Networks Supported
          </span>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-text-white text-xl font-bold font-['Space_Grotesk']">Buy Airtime</h2>
            <p className="text-xs text-text-muted mt-0.5">Top up any mobile line instantly with secure checkout.</p>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full shrink-0">
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
              <div className="text-xs text-text-muted mt-0.5">
                ₦{activeAmount.toLocaleString()} airtime has been sent successfully to {phone}.
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Form and Package Selection */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-5">
              <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk'] pb-3 border-b border-border">Quick Airtime Purchase</h3>

              {/* Select Network */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-text-gray">Select Network</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {networks.map((net) => (
                    <button
                      key={net.id}
                      type="button"
                      onClick={() => handleNetworkSelect(net.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                        selectedNetwork === net.id
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                          : 'border-border bg-bg-dark-secondary hover:border-border-hover'
                      }`}
                    >
                      <span className="text-sm font-bold text-text-white font-['Space_Grotesk']">{net.name}</span>
                      <span className="text-[10px] text-text-muted mt-1 text-center">{net.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-text-gray">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.5 11.5a19.79 19.79 0 01-3.07-8.67A2 2 0 013.41 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.37a16 16 0 006.72 6.72l1.74-1.74a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </span>
                  <input
                    type="tel"
                    placeholder="Enter Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-bg-dark-secondary border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
                    {isVerifying && (
                      <svg className="animate-spin w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                      </svg>
                    )}
                    {isVerified && !isVerifying && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" className="w-4 h-4">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Verification Box */}
              {isVerified && (
                <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4 space-y-3 animate-[fadeIn_.2s_ease]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-text-muted block">Phone Number</span>
                      <span className="text-sm font-semibold text-text-white block mt-0.5">{phone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-text-muted text-right block">Network Status</span>
                      <span className="text-xs font-bold text-emerald-400 block mt-0.5 text-right">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 w-fit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Verified Number
                  </div>
                </div>
              )}

              {/* Amount Selection */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-text-gray">Enter Amount</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted select-none">₦</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      min={50}
                      max={50000}
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-bg-dark-secondary border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>

                {/* Preset Amounts */}
                <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 pt-1">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleAmountSelect(amt)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
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
            </div>

            {/* Order Summary */}
            {activeAmount > 0 && (
              <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-3">
                <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk'] pb-3 border-b border-border">Order Summary</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Airtime Amount</span>
                    <span className="text-text-white font-semibold">₦{activeAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pb-2">
              <button
                type="submit"
                disabled={loading || !selectedNetwork || !phone || activeAmount <= 0 || !isVerified}
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
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4.5 h-4.5">
                      <path d="M1.42 9a16 16 0 0121.16 0M5 12.55a11 11 0 0114.08 0M10.54 16.1a6 6 0 012.92 0M12 20h.01" />
                    </svg>
                    Buy Airtime
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-border bg-bg-card text-text-white text-sm font-semibold hover:bg-bg-card-hover hover:border-border-hover transition-all duration-200 flex items-center justify-center gap-2"
              >
                Reset
              </button>
            </div>
          </form>

          {/* Right Column: Dashboard Information Cards */}
          <div className="space-y-4">
            {/* Saved Beneficiaries */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-3">
              <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk'] pb-2 border-b border-border">Saved Beneficiaries</h3>
              
              <div className="space-y-3">
                {beneficiaries.map((b, idx) => (
                  <div key={idx} className="bg-bg-dark-secondary border border-border rounded-xl p-3.5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-text-white">{b.name}</div>
                        <div className="text-[11px] text-text-muted mt-0.5 capitalize">{b.network} • {b.number}</div>
                      </div>
                      <NetworkIcon networkId={b.network} size="sm" />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setPhone(b.number.replace(/\D/g, ''));
                        setSelectedNetwork(b.network);
                      }}
                      className="py-1.5 px-3 rounded-lg bg-bg-dark border border-border text-[11px] text-text-white hover:bg-bg-card-hover font-semibold transition-colors w-full text-center"
                    >
                      Use Beneficiary
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuyAirtime;
