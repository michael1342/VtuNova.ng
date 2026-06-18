import React, { useState, useEffect } from 'react';

const discos = [
  { id: 'ikeja', name: 'Ikeja Electric (IKEDC)' },
  { id: 'eko', name: 'Eko Electric (EKEDC)' },
  { id: 'abuja', name: 'Abuja Electric (AEDC)' },
  { id: 'kano', name: 'Kano Electric (KEDCO)' },
  { id: 'portharcourt', name: 'Port Harcourt Electric (PHED)' },
  { id: 'kaduna', name: 'Kaduna Electric (KAEDCO)' },
  { id: 'enugu', name: 'Enugu Electric (EEDC)' },
  { id: 'ibadan', name: 'Ibadan Electric (IBEDC)' },
  { id: 'jos', name: 'Jos Electric (JED)' },
  { id: 'yola', name: 'Yola Electric (YEDC)' },
  { id: 'benin', name: 'Benin Electric (BEDC)' },
];

const presetAmounts = [1000, 2000, 5000, 10000, 20000, 50000];


const BuyElectricity = () => {
  const [selectedDisco, setSelectedDisco] = useState('');
  const [meterType, setMeterType] = useState<'prepaid' | 'postpaid'>('prepaid');
  const [meterNumber, setMeterNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenGenerated, setTokenGenerated] = useState('');

  const activeAmount = selectedAmount ?? (customAmount ? Number(customAmount) : 0);
  const serviceFee = activeAmount > 0 ? 100 : 0;
  const vat = activeAmount > 0 ? 15 : 0;
  const totalDebit = activeAmount > 0 ? activeAmount + serviceFee + vat : 0;

  // Auto-verify meter number when it looks complete (e.g. 10 digits)
  useEffect(() => {
    if (meterNumber.trim().length >= 10 && selectedDisco) {
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
  }, [meterNumber, selectedDisco]);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const handleReset = () => {
    setSelectedDisco('');
    setMeterType('prepaid');
    setMeterNumber('');
    setSelectedAmount(null);
    setCustomAmount('');
    setIsVerified(false);
    setIsVerifying(false);
    setSuccess(false);
    setTokenGenerated('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDisco || !meterNumber || activeAmount <= 0 || !isVerified) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setSuccess(true);
    
    // Generate a mockup token if prepaid
    if (meterType === 'prepaid') {
      const parts = [];
      for (let i = 0; i < 5; i++) {
        parts.push(Math.floor(1000 + Math.random() * 9000));
      }
      setTokenGenerated(parts.join('-'));
    }
  };

  const selectedDiscoName = discos.find(d => d.id === selectedDisco)?.name || 'Choose distribution company';

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-dark-secondary overflow-y-auto">

      {/* ── Main Content ── */}
      <main className="flex-1 p-6 space-y-5 max-w-3xl mx-auto w-full">
        {/* Page Header Badges */}
        <div className="flex flex-wrap gap-2 mb-1">
          {['Instant Token Delivery', 'Secure Payments', 'All Nigerian DisCos Supported', '24/7 Availability'].map((badge, idx) => (
            <span
              key={idx}
              className="text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-light"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-text-white text-xl font-bold font-['Space_Grotesk']">Pay Electricity Bill</h2>
            <p className="text-xs text-text-muted mt-0.5">Complete your payment in a few secure steps.</p>
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
          <div className="flex flex-col gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 animate-[fadeIn_.3s_ease]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" className="w-4 h-4">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-emerald-400">Bill Payment Successful!</div>
                <div className="text-xs text-text-muted mt-0.5">
                  ₦{activeAmount.toLocaleString()} has been charged for meter {meterNumber}.
                </div>
              </div>
            </div>
            {tokenGenerated && (
              <div className="mt-1 p-3 bg-bg-dark-secondary border border-border rounded-xl flex flex-col gap-1 items-center justify-center">
                <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Electricity Token</span>
                <span className="text-lg font-mono font-bold tracking-widest text-emerald-400 select-all">{tokenGenerated}</span>
                <span className="text-[10px] text-text-muted">Enter this token on your meter keyboard.</span>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Main Purchase Card */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-5">
            
            {/* Select Provider */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-text-gray">Select Provider</label>
              <div className="relative">
                <select
                  value={selectedDisco}
                  onChange={(e) => {
                    setSelectedDisco(e.target.value);
                    setIsVerified(false);
                  }}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-bg-dark-secondary border border-border text-sm text-text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="" disabled className="text-text-muted">Choose distribution company</option>
                  {discos.map((d) => (
                    <option key={d.id} value={d.id} className="bg-bg-dark text-text-white">
                      {d.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Meter Type */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-text-gray">Meter Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMeterType('prepaid')}
                  className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                    meterType === 'prepaid'
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/30 text-black text-text-white'
                      : 'border-border bg-bg-dark-secondary text-text-gray hover:border-border-hover hover:bg-bg-card-hover dark:hover:bg-bg-card-hover-dark'
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-4 h-4 transition-colors ${meterType === 'prepaid' ? 'text-primary' : 'text-text-muted'}`}>
                    <circle cx="12" cy="12" r="10" />
                    {meterType === 'prepaid' && <circle cx="12" cy="12" r="6" fill="currentColor" />}
                  </svg>
                  Prepaid Meter
                </button>

                <button
                  type="button"
                  onClick={() => setMeterType('postpaid')}
                  className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                    meterType === 'postpaid'
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/30 text-black text-text-white'
                      : 'border-border bg-bg-dark-secondary text-text-gray hover:border-border-hover hover:bg-bg-card-hover dark:hover:bg-bg-card-hover-dark'
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-4 h-4 transition-colors ${meterType === 'postpaid' ? 'text-primary' : 'text-text-muted'}`}>
                    <circle cx="12" cy="12" r="10" />
                    {meterType === 'postpaid' && <circle cx="12" cy="12" r="6" fill="currentColor" />}
                  </svg>
                  Postpaid Meter
                </button>
              </div>
            </div>

            {/* Meter Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-text-gray">Meter Number</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter meter number"
                  value={meterNumber}
                  onChange={(e) => setMeterNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-bg-dark-secondary border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
                  {isVerifying ? (
                    <svg className="animate-spin w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                    </svg>
                  ) : isVerified ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" className="w-4 h-4">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-text-muted">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Verification Box */}
            {isVerified && (
              <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4 space-y-2 animate-[fadeIn_.2s_ease]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400">Customer Verification</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Verified
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-text-muted">Customer Name</span>
                    <span className="text-text-white font-semibold">Michael Anazodo</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-text-muted">Address</span>
                    <span className="text-text-white font-medium">Lekki Phase 1, Lagos</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-text-muted">DisCo</span>
                    <span className="text-text-white font-medium">{selectedDiscoName}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Enter Amount */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-text-gray">Enter Amount</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted select-none">₦</span>
                <input
                  type="number"
                  placeholder="0.00"
                  min={500}
                  max={100000}
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-bg-dark-secondary border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              
              {/* Preset Amounts */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
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

          {/* Payment Summary */}
          {activeAmount > 0 && (
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-3">
              <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk'] pb-3 border-b border-border">Payment Summary</h3>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Amount</span>
                  <span className="text-text-white font-medium">₦{activeAmount.toLocaleString()}.00</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Service Fee</span>
                  <span className="text-text-white font-medium">₦{serviceFee.toLocaleString()}.00</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-text-muted">VAT</span>
                  <span className="text-text-white font-medium">₦{vat.toLocaleString()}.00</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between bg-primary/5 -mx-5 px-5 py-3 rounded-b-2xl">
                <div>
                  <div className="text-xs text-text-muted mb-0.5">Total Debit</div>
                  <div className="text-xl font-bold text-primary-light font-['Space_Grotesk']">₦{totalDebit.toLocaleString()}.00</div>
                </div>
                
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Secure Payment
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pb-2">
            <button
              type="submit"
              disabled={loading || !selectedDisco || !meterNumber || activeAmount <= 0 || !isVerified}
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
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Pay Electricity Bill
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

        {/* Wallet Card */}
        <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
          <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Wallet Card</h3>
          
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-5 text-white space-y-4 shadow-lg">
            <div>
              <span className="text-xs opacity-80 block">Available Balance</span>
              <span className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] mt-1 block">₦150,000.00</span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
              <div>
                <span className="text-[10px] opacity-75 uppercase tracking-wider block">Today's Spending</span>
                <span className="text-sm font-semibold block mt-0.5">₦12,500</span>
              </div>
              <div>
                <span className="text-[10px] opacity-75 uppercase tracking-wider block">Total Payments</span>
                <span className="text-sm font-semibold block mt-0.5">248</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover flex items-center justify-center gap-1.5 transition-all duration-200"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M16 8h.01M22 10H2" />
            </svg>
            Fund Wallet
          </button>
        </div>

        {/* Saved Meters */}
        <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Saved Meters</h3>
          </div>
          
          <div className="bg-bg-dark-secondary border border-border rounded-xl p-4 space-y-3 relative group">
            <span className="absolute top-4 right-4 text-[9px] font-bold text-text-gray bg-bg-dark border border-border px-2 py-0.5 rounded-full">
              Primary
            </span>
            <div>
              <div className="text-sm font-semibold text-text-white">Michael Home</div>
              <div className="text-xs text-text-muted mt-1 space-y-0.5">
                <div>Meter: 12345678901</div>
                <div>DisCo: Ikeja Electric</div>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => {
                setMeterNumber('12345678901');
                setSelectedDisco('ikeja');
                setMeterType('prepaid');
              }}
              className="py-1.5 px-4 rounded-lg bg-bg-dark border border-border text-xs text-text-white hover:bg-bg-card-hover font-semibold transition-all duration-200"
            >
              Use Meter
            </button>
          </div>
        </div>

        {/* Recent Token Purchase */}
        <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
          <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Recent Token Purchase</h3>
          
          <div className="bg-bg-dark-secondary border border-border rounded-xl p-4 space-y-3">
            <div>
              <span className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">Token</span>
              <span className="text-sm sm:text-base font-mono font-bold tracking-widest text-text-white block">
                1234 5678 9012 3456
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs border-t border-border pt-3">
              <div>
                <span className="text-[10px] text-text-muted block">Amount</span>
                <span className="font-semibold text-text-white mt-0.5 block">₦5,000</span>
              </div>
              <div>
                <span className="text-[10px] text-text-muted block">Date</span>
                <span className="font-semibold text-text-white mt-0.5 block">Today</span>
              </div>
              <div>
                <span className="text-[10px] text-text-muted block">Status</span>
                <span className="font-semibold text-emerald-400 mt-0.5 block">Success</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText('1234567890123456');
            }}
            className="w-full py-2.5 rounded-xl border border-border bg-bg-dark text-text-white text-xs font-semibold hover:bg-bg-card-hover flex items-center justify-center gap-1.5 transition-all duration-200"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
            Copy Token
          </button>
        </div>

        {/* Recent Electricity Payments */}
        <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Recent Electricity Payments</h3>
              <p className="text-xs text-text-muted mt-0.5">Track all electricity bill transactions in one place.</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="px-3 py-1.5 rounded-lg border border-border bg-bg-dark-secondary text-text-white text-xs font-semibold hover:bg-bg-card-hover flex items-center gap-1.5 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-text-muted">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                Filters
              </button>
              <button type="button" className="px-3 py-1.5 rounded-lg border border-border bg-bg-dark-secondary text-text-white text-xs font-semibold hover:bg-bg-card-hover flex items-center gap-1.5 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-text-muted">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Export
              </button>
            </div>
          </div>

          {/* Search and Filter Pills */}
          <div className="space-y-3">
            <div className="relative">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-bg-dark-secondary border border-border text-xs text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex gap-2">
              <button type="button" className="px-3 py-1 rounded-full bg-primary text-white text-[11px] font-semibold">
                All Status
              </button>
              <button type="button" className="px-3 py-1 rounded-full bg-bg-dark-secondary border border-border text-text-gray hover:text-text-white text-[11px] font-medium transition-colors">
                This Month
              </button>
            </div>
          </div>

          {/* Payments Table */}
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-bg-dark-secondary border-b border-border text-text-gray font-medium">
                  <th className="p-3">Transaction ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">DisCo</th>
                  <th className="p-3">Meter Number</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-text-white">
                <tr className="hover:bg-bg-dark-secondary/40 transition-colors">
                  <td className="p-3 font-semibold text-text-white">EB-24091</td>
                  <td className="p-3">Michael Anazodo</td>
                  <td className="p-3">Ikeja Electric</td>
                  <td className="p-3 font-mono">12345678901</td>
                  <td className="p-3 font-semibold">₦5,000</td>
                  <td className="p-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      Success
                    </span>
                  </td>
                  <td className="p-3 text-text-muted">Today</td>
                </tr>
                <tr className="hover:bg-bg-dark-secondary/40 transition-colors">
                  <td className="p-3 font-semibold text-text-white">EB-24090</td>
                  <td className="p-3">Sarah Okafor</td>
                  <td className="p-3">Eko Electric</td>
                  <td className="p-3 font-mono">10987654321</td>
                  <td className="p-3 font-semibold">₦10,000</td>
                  <td className="p-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      Pending
                    </span>
                  </td>
                  <td className="p-3 text-text-muted">Today</td>
                </tr>
                <tr className="hover:bg-bg-dark-secondary/40 transition-colors">
                  <td className="p-3 font-semibold text-text-white">EB-24089</td>
                  <td className="p-3">David Musa</td>
                  <td className="p-3">Abuja Electric</td>
                  <td className="p-3 font-mono">11223344556</td>
                  <td className="p-3 font-semibold">₦20,000</td>
                  <td className="p-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 border border-red-500/20 text-red-400">
                      Failed
                    </span>
                  </td>
                  <td className="p-3 text-text-muted">Yesterday</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs text-text-muted pt-2">
            <span>Showing 1 to 3 of 24 payments</span>
            <div className="flex items-center gap-1">
              <button type="button" className="px-2.5 py-1.5 rounded-lg border border-border bg-bg-dark-secondary text-text-white hover:bg-bg-card-hover transition-colors font-medium">
                Previous
              </button>
              <button type="button" className="w-7 h-7 flex items-center justify-center rounded-lg bg-primary text-white font-bold">
                1
              </button>
              <button type="button" className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-bg-dark-secondary border border-transparent hover:border-border text-text-gray hover:text-text-white transition-colors">
                2
              </button>
              <button type="button" className="px-2.5 py-1.5 rounded-lg border border-border bg-bg-dark-secondary text-text-white hover:bg-bg-card-hover transition-colors font-medium">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Token History */}
        <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Token History</h3>
            <p className="text-xs text-text-muted mt-0.5">Previously generated tokens for quick reference.</p>
          </div>

          <div className="space-y-3">
            {/* Token Card 1 */}
            <div className="bg-bg-dark-secondary border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative group">
              <div className="space-y-2">
                <span className="text-[10px] text-text-muted uppercase tracking-wider block">Token Number</span>
                <span className="text-base font-mono font-bold tracking-widest text-text-white block">1234 5678 9012 3456</span>
                <div className="grid grid-cols-3 gap-x-4 text-[11px] text-text-muted pt-1">
                  <div>Meter: <span className="text-text-white">12345678901</span></div>
                  <div>Amount: <span className="text-text-white">₦5,000</span></div>
                  <div>Date: <span className="text-text-white">Today</span></div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText('1234567890123456')}
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-bg-card-hover hover:border-border-hover text-text-muted hover:text-text-white transition-all shrink-0 self-end sm:self-center"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              </button>
            </div>

            {/* Token Card 2 */}
            <div className="bg-bg-dark-secondary border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative group">
              <div className="space-y-2">
                <span className="text-[10px] text-text-muted uppercase tracking-wider block">Token Number</span>
                <span className="text-base font-mono font-bold tracking-widest text-text-white block">9876 5432 1098 7654</span>
                <div className="grid grid-cols-3 gap-x-4 text-[11px] text-text-muted pt-1">
                  <div>Meter: <span className="text-text-white">10987654321</span></div>
                  <div>Amount: <span className="text-text-white">₦10,000</span></div>
                  <div>Date: <span className="text-text-white">Yesterday</span></div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText('9876543210987654')}
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-bg-card-hover hover:border-border-hover text-text-muted hover:text-text-white transition-all shrink-0 self-end sm:self-center"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Electricity Payment Tips */}
        <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
          <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Electricity Payment Tips</h3>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-3 bg-bg-dark-secondary border border-border/60 rounded-xl p-3.5 text-text-gray">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4 text-primary shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Double-check meter number before payment.</span>
            </div>

            <div className="flex items-center gap-3 bg-bg-dark-secondary border border-border/60 rounded-xl p-3.5 text-text-gray">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4 text-primary shrink-0">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Tokens are delivered instantly after successful payment.</span>
            </div>

            <div className="flex items-center gap-3 bg-bg-dark-secondary border border-border/60 rounded-xl p-3.5 text-text-gray">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4 text-primary shrink-0">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
              <span>Save frequently used meters for faster checkout.</span>
            </div>

            <div className="flex items-center gap-3 bg-bg-dark-secondary border border-border/60 rounded-xl p-3.5 text-text-gray">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4 text-primary shrink-0">
                <path d="M3 18v-6a9 9 0 0118 0v6" />
                <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
              </svg>
              <span>Contact support if token delivery is delayed.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuyElectricity;
