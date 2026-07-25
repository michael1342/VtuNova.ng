import React, { useState } from 'react';

const presetAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

const fundingHistory = [
  { id: 'FW-10029', method: 'Bank Transfer', amount: 15000, status: 'Success', date: 'Today, 10:42 AM' },
  { id: 'FW-10028', method: 'Card Payment', amount: 5000, status: 'Success', date: 'Yesterday, 04:15 PM' },
  { id: 'FW-10027', method: 'USSD Payment', amount: 2000, status: 'Success', date: '09 June, 08:30 AM' },
];

const FundWallet = () => {
  const [method, setMethod] = useState<'card' | 'bank' | 'ussd'>('card');
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  
  // Card states
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // USSD states
  const [selectedBank, setSelectedBank] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const activeAmount = amount ?? (customAmount ? Number(customAmount) : 0);

  const handleAmountSelect = (amt: number) => {
    setAmount(amt);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setAmount(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeAmount <= 0) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-dark-secondary overflow-y-auto">

      {/* ── Main Content ── */}
      <main className="flex-1 p-6 space-y-5 max-w-6xl mx-auto w-full">
        
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-text-white text-xl font-bold font-['Space_Grotesk']">Fund Wallet</h2>
            <p className="text-xs text-text-muted mt-0.5">Top up your wallet balance instantly using secure payment channels.</p>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Secure Funding
          </span>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 animate-[fadeIn_.3s_ease]">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" className="w-4 h-4">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-emerald-400">Wallet Funded Successfully!</div>
              <div className="text-xs text-text-muted mt-0.5">
                ₦{activeAmount.toLocaleString()} has been added to your available balance.
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Funding form */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-5">
              
              {/* Payment Method Tabs */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-text-gray">Select Funding Method</label>
                <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-bg-dark-secondary border border-border">
                  <button
                    type="button"
                    onClick={() => setMethod('card')}
                    className={`py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      method === 'card'
                        ? 'bg-primary text-white shadow-[0_4px_16px_rgba(59,130,246,0.3)]'
                        : 'text-text-gray hover:text-text-white hover:bg-bg-card-hover'
                    }`}
                  >
                    Card Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('bank')}
                    className={`py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      method === 'bank'
                        ? 'bg-primary text-white shadow-[0_4px_16px_rgba(59,130,246,0.3)]'
                        : 'text-text-gray hover:text-text-white hover:bg-bg-card-hover'
                    }`}
                  >
                    Bank Transfer
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('ussd')}
                    className={`py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      method === 'ussd'
                        ? 'bg-primary text-white shadow-[0_4px_16px_rgba(59,130,246,0.3)]'
                        : 'text-text-gray hover:text-text-white hover:bg-bg-card-hover'
                    }`}
                  >
                    USSD Code
                  </button>
                </div>
              </div>

              {/* Amount Inputs */}
              {method !== 'bank' && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-text-gray">Enter Amount</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted select-none">₦</span>
                      <input
                        type="number"
                        placeholder="Min ₦100"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-bg-dark-secondary border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {presetAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleAmountSelect(amt)}
                        className={`py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                          amount === amt
                            ? 'bg-primary border-primary text-white'
                            : 'bg-bg-dark-secondary border-border text-text-gray hover:border-border-hover hover:text-text-white'
                        }`}
                      >
                        ₦{amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Conditional Method Forms */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                {method === 'card' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-text-gray">Card Number</label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().substring(0, 19))}
                        className="w-full px-4 py-2.5 rounded-xl bg-bg-dark-secondary border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-text-gray">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value.replace(/\D/g, '').replace(/(.{2})/, '$1/').substring(0, 5))}
                          className="w-full px-4 py-2.5 rounded-xl bg-bg-dark-secondary border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-text-gray">CVV</label>
                        <input
                          type="password"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                          className="w-full px-4 py-2.5 rounded-xl bg-bg-dark-secondary border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || activeAmount <= 0 || cardNumber.length < 19 || expiry.length < 5 || cvv.length < 3}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-blue-500 text-white font-semibold text-sm shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_6px_30px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? 'Processing Payment...' : `Pay ₦${activeAmount.toLocaleString()}`}
                    </button>
                  </div>
                )}

                {method === 'bank' && (
                  <div className="space-y-4 animate-[fadeIn_.2s_ease]">
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
                      <span className="text-[11px] font-semibold text-primary block">Virtual Bank Accounts</span>
                      <p className="text-[11px] text-text-muted leading-relaxed">
                        Transfer money to any of the virtual bank accounts below to fund your wallet balance automatically.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-bg-dark-secondary border border-border rounded-xl p-4 flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-text-muted block">Sterling Bank</span>
                          <span className="text-sm font-bold font-mono text-text-white tracking-wider block mt-0.5">8273648190</span>
                          <span className="text-[10px] text-text-gray block mt-0.5">VtuNova - Michael Anazodo</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText('8273648190')}
                          className="px-3 py-1.5 rounded-lg border border-border hover:bg-bg-card-hover text-[11px] font-semibold text-text-white transition-colors"
                        >
                          Copy
                        </button>
                      </div>

                      <div className="bg-bg-dark-secondary border border-border rounded-xl p-4 flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-text-muted block">Wema Bank</span>
                          <span className="text-sm font-bold font-mono text-text-white tracking-wider block mt-0.5">9928374620</span>
                          <span className="text-[10px] text-text-gray block mt-0.5">VtuNova - Michael Anazodo</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText('9928374620')}
                          className="px-3 py-1.5 rounded-lg border border-border hover:bg-bg-card-hover text-[11px] font-semibold text-text-white transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {method === 'ussd' && (
                  <div className="space-y-4 animate-[fadeIn_.2s_ease]">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-text-gray">Select Bank</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-bg-dark-secondary border border-border text-sm text-text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all cursor-pointer"
                      >
                        <option value="" disabled>Choose your bank</option>
                        <option value="gtb" className="bg-bg-dark">GTBank (*737#)</option>
                        <option value="access" className="bg-bg-dark">Access Bank (*901#)</option>
                        <option value="zenith" className="bg-bg-dark">Zenith Bank (*966#)</option>
                        <option value="uba" className="bg-bg-dark">UBA (*919#)</option>
                      </select>
                    </div>

                    {selectedBank && activeAmount > 0 && (
                      <div className="bg-bg-dark-secondary border border-border rounded-xl p-4 space-y-3 text-center">
                        <span className="text-[10px] text-text-muted block uppercase tracking-wider">USSD Dial Code</span>
                        <span className="text-lg font-mono font-bold text-primary-light tracking-wide block">
                          {selectedBank === 'gtb' && `*737*1*2*${activeAmount}#`}
                          {selectedBank === 'access' && `*901*3*${activeAmount}#`}
                          {selectedBank === 'zenith' && `*966*3*${activeAmount}#`}
                          {selectedBank === 'uba' && `*919*3*${activeAmount}#`}
                        </span>
                        <p className="text-[10px] text-text-muted">Dial this code from your registered phone number to pay.</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || activeAmount <= 0 || !selectedBank}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-blue-500 text-white font-semibold text-sm shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_6px_30px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 transition-all flex items-center justify-center gap-2"
                    >
                      Confirm Payment
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Column: Wallet Info & History */}
          <div className="space-y-4">
            {/* Wallet Overview */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
              <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk'] pb-2 border-b border-border">Wallet Overview</h3>
              <div className="space-y-1">
                <span className="text-[10px] text-text-gray block uppercase tracking-wider">Available Balance</span>
                <span className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-text-white block">₦150,000.00</span>
              </div>
            </div>

            {/* Funding History */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
              <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk'] pb-2 border-b border-border">Funding History</h3>
              <div className="space-y-3">
                {fundingHistory.map((item) => (
                  <div key={item.id} className="bg-bg-dark-secondary border border-border rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-semibold text-text-white">{item.method}</div>
                      <div className="text-[10px] text-text-muted mt-0.5">{item.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-text-white">₦{item.amount.toLocaleString()}</div>
                      <span className="inline-block mt-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        {item.status}
                      </span>
                    </div>
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

export default FundWallet;
